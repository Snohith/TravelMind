"use server";

import { createClient } from "@/lib/supabase-server";
import { getTripByRoute, type Trip } from "@/data/mock-itinerary";
import { Database } from "@/types/supabase";
import { z } from "zod";
import { headers } from "next/headers";

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
    throw new Error("Authentication required to access trip details.");
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

  if (error || !trip) return null;
  
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
export async function getUserTrips() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Attempted to fetch trips without a session.");
    return [];
  }

  const { data, error } = await (supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as any);

  if (error) {
    console.error("Error fetching user trips:", error);
    return [];
  }

  return data as any[];
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
    console.error("Error deleting trip:", error);
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
    console.warn(`[SECURITY] Rate limit triggered for ${identifier}`);
    throw new Error(`Too many requests. Please wait a minute. (${limit} requests/min allowed)`);
  }

  entry.count++;
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
export async function getTripPreviewAction(from: string | null, to: string | null, vibe: string | null, budget: string | null) {
  // 1. Production Rate Limiting (Per-User & Per-IP)
  await checkRateLimit();

  // 2. Production Schema Validation (Zod)
  const validation = TripQuerySchema.safeParse({ from, to, vibe, budget });
  
  if (!validation.success) {
    console.error("[SECURITY] Invalid input detected:", validation.error.format());
    throw new Error("Parameters are outside safe travel limits. Please check your inputs.");
  }

  const { from: cleanFrom, to: cleanTo, vibe: cleanVibe, budget: cleanNumBudget } = validation.data;
  const cleanBudget = cleanNumBudget?.toString() || null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 3. User Quota Protection: Max 50 saved trips to prevent DB bloat
    if (user) {
      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if ((count || 0) >= 50) {
        throw new Error("You've reached your maximum limit of 50 saved trips. Please delete some before creating more.");
      }
    }
    const trip = await getTripByRoute(cleanFrom, cleanTo, cleanVibe, cleanBudget);
    return trip;
  } catch (err) {
    console.error("Error in getTripPreviewAction:", err);
    throw new Error("Failed to generate trip itinerary.");
  }
}
