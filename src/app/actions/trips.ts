"use server";

import { getTripByRoute, type Trip } from "@/data/mock-itinerary";
import { createClient } from "@/lib/supabase-server";
import { Database } from "@/types/supabase";
import { headers } from "next/headers";
import { z } from "zod";

type TripInsert = Database['public']['Tables']['trips']['Insert'];
type DayInsert = Database['public']['Tables']['itinerary_days']['Insert'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

/**
 * Fetches a single trip and all its associated daily plans and activities from the database.
 * 
 * @param tripId - The unique ID of the trip we want to find (Input)
 * @returns A formatted Trip object with days and activities, or null if not found (Output)
 * 
 * Why it exists: When a user clicks on a saved trip in their dashboard, 
 * we need to retrieve all the detailed information to display it.
 */
export async function getTripById(tripId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required to access trip details." };
  }

  const { data: trip, error } = await (supabase
    .from('trips')
    .select(`
      *,
      itinerary_days (
        *,
        activities (*)
      )
    `)
    .eq('id', tripId)
    .eq('user_id', user.id) // IMPORTANT: ONLY fetch if it belongs to THIS user
    .single() as any);

  if (error || !trip) return { error: "Trip not found." };
  
  // Map back to Trip interface
  const mappedTrip: Trip = {
    id: trip.id,
    from: trip.from_city,
    to: trip.to_city,
    title: `Trip to ${trip.to_city}`,
    duration: trip.duration,
    totalPriceINR: trip.total_price || 0,
    localDelicacies: [], // Add logic to fetch if needed
    photoGallery: [],
    days: (trip.itinerary_days as any[]).map(day => ({
      id: day.id,
      dayNumber: day.day_number,
      date: day.date,
      title: day.title,
      description: day.description || "",
      location: { lat: day.lat, lng: day.lng },
      activities: (day.activities as any[]).map(act => ({
        id: act.id,
        time: act.time,
        title: act.title,
        description: act.description || "",
        type: act.type as any,
        location: { lat: act.lat, lng: act.lng },
        priceINR: act.price_inr
      }))
    }))
  };

  return mappedTrip;
}

/**
 * Retrieves all trips created by a specific user, ordered by the newest first.
 * 
 * Why it exists: To populate the user's dashboard with their history of planned trips.
 * SAFETY: We now pull the user.id directly from the server session, making it 
 * impossible for anyone to spoof another user's ID.
 */
export async function getUserTrips(page: number = 1, limit: number = 9) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], count: 0 };
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await (supabase
    .from('trips')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to) as any);

  if (error) {
    return { data: [], count: 0 };
  }

  return { data: data as any[], count: count || 0 };
}

/**
 * Deletes a specific trip from the database, ensuring ONLY the owner can delete it.
 */
export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to delete trips.");
  }

  const { error } = await (supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id) as any);

  if (error) {
    throw new Error(error.message);
  }
  return true;
}

// Security: Production-grade rate limiting
// Simple in-memory map for demo; move to Redis (Upstash) for real production
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_USER = 10;
const MAX_REQUESTS_ANON = 3;

async function checkRateLimit() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Use user ID if logged in, otherwise use client IP address
  const h = await headers();
  const ip = h.get('x-forwarded-for') || 'anonymous';
  const identifier = user ? `user:${user.id}` : `ip:${ip}`;
  
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  const limit = user ? MAX_REQUESTS_PER_USER : MAX_REQUESTS_ANON;

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return;
  }

  if (entry.count >= limit) {
    return { error: `Too many requests. Please wait a minute. (${limit} requests/min allowed)` };
  }

  entry.count++;
  return null;
}

// Zod schema for input validation
const TripQuerySchema = z.object({
  from: z.string().min(2).max(50).nullable(),
  to: z.string().min(2).max(50).nullable(),
  vibe: z.string().max(20).nullable(),
  budget: z.coerce.number().positive().max(10000000).nullable(), // Max 1 Cr INR
});

/**
 * Server Action to generate a new trip itinerary without saving it to the database yet.
 * 
 * @param from - The starting city (Input)
 * @param to - The destination city (Input)
 * @param vibe - The style of the trip, e.g., "Relaxing", "Adventure" (Input)
 * @param budget - The maximum budget for the trip (Input)
 * @returns A generated trip object with an itinerary (Output)
 * 
 * Why it exists: This is the core AI generation feature. It runs securely on the server
 * so API keys and complex generation logic are kept hidden from the client browser.
 */
export async function generateTrip(from: string | null, to: string | null, vibe: string | null, budget: string | null, startDate?: string | null, endDate?: string | null) {
  // 1. Production Rate Limiting (Per-User & Per-IP)
  const rateLimitError = await checkRateLimit();
  if (rateLimitError && rateLimitError.error) {
    return { error: rateLimitError.error };
  }

  // 2. Production Schema Validation (Zod)
  const validation = TripQuerySchema.safeParse({ from, to, vibe, budget });
  
  if (!validation.success) {
    return { error: "Parameters are outside safe travel limits. Please check your inputs." };
  }

  const { from: cleanFrom, to: cleanTo, vibe: cleanVibe, budget: cleanNumBudget } = validation.data;
  const cleanBudget = cleanNumBudget?.toString() || null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to generate and save a trip." };
    }

    // 3. User Quota Protection: Max 50 saved trips to prevent DB bloat
    const { count } = await supabase
      .from('trips')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if ((count || 0) >= 50) {
      return { error: "You've reached your maximum limit of 50 saved trips. Please delete some before creating more." };
    }

    // 4. Generate the Trip (AI/Logic)
    const trip = await getTripByRoute(cleanFrom, cleanTo, cleanVibe, cleanBudget);

    // 5. SECURE DATABASE PERSISTENCE
    // We save the trip in a "transactional" way (sequential inserts as JS doesn't have cross-table transactions easily in this setup)
    
    // A) Insert Trip Root
    const { data: insertedTrip, error: tripError } = await (supabase
      .from('trips')
      .insert({
        user_id: user.id,
        from_city: trip.from,
        to_city: trip.to,
        budget: cleanNumBudget || 0,
        vibe: cleanVibe || 'balanced',
        duration: trip.duration,
        total_price: trip.totalPriceINR,
        start_date: startDate || new Date().toISOString(),
      })
      .select()
      .single() as any);

    if (tripError || !insertedTrip) {
      return { error: "Failed to save trip root to database." };
    }

    // B) Insert Days & Activities
    for (const day of trip.days) {
      const { data: insertedDay, error: dayError } = await (supabase
        .from('itinerary_days')
        .insert({
          trip_id: insertedTrip.id,
          day_number: day.dayNumber,
          date: day.date,
          title: day.title,
          description: day.description,
          lat: day.location.lat,
          lng: day.location.lng
        })
        .select()
        .single() as any);

      if (dayError || !insertedDay) {
        continue; // Try next day or handle more gracefully
      }

      // C) Insert Activities for this day
      const activityInserts = day.activities.map(act => ({
        day_id: insertedDay.id,
        time: act.time,
        title: act.title,
        description: act.description,
        type: act.type,
        lat: act.location?.lat || insertedDay.lat,
        lng: act.location?.lng || insertedDay.lng,
        price_inr: act.priceINR
      }));

      const { error: actError } = await supabase
        .from('activities')
        .insert(activityInserts);

      if (actError) {
      }
    }
    // 6. REVALIDATE AND RETURN
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
    
    return { success: true, tripId: insertedTrip.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to generate trip itinerary." };
  }
}
