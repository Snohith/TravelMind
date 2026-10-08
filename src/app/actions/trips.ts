"use server";

import { getTripByRoute, type Trip } from "@/data/mock-itinerary";
import { createClient } from "@/lib/supabase-server";
import { resolveOwnerId } from "@/lib/demo-user";
import { headers } from "next/headers";
import { z } from "zod";

// Server actions for saved trips. Reads/writes always scope to the resolved
// owner — never trust a user_id from the client.

// Caps so one bad actor can't blow up the DB or hammer generation.
const MAX_SAVED_TRIPS = 50;
const MAX_BUDGET_INR = 10_000_000; // 1 Cr, matches the form's sane upper bound
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_USER = 10;
const MAX_REQUESTS_ANON = 3;
// One trip + its days + activities for the dashboard detail view.
// Scoped to the resolved owner so ids can't be swapped to read other buckets.
export async function getTripById(tripId: string) {
  const supabase = await createClient();
  const ownerId = await resolveOwnerId();

  // Supabase's generated types don't carry the joined days/activities shape,
  // so we type the join once here instead of sprinkling `as any` below.
  type JoinedActivity = {
    id: string; time: string; title: string; description: string | null;
    type: Trip["days"][number]["activities"][number]["type"];
    lat: number; lng: number; price_inr: number | null;
  };
  type JoinedDay = {
    id: string; day_number: number; date: string; title: string;
    description: string | null; lat: number; lng: number;
    activities: JoinedActivity[];
  };
  type JoinedTrip = {
    id: string; from_city: string; to_city: string; duration: number;
    total_price: number | null; itinerary_days: JoinedDay[];
  };

  const { data, error } = await supabase
    .from("trips")
    .select("*, itinerary_days (*, activities (*))")
    .eq("id", tripId)
    .eq("user_id", ownerId)
    .single();

  const trip = data as unknown as JoinedTrip | null;
  if (error || !trip) return { error: "Trip not found." };

  const mappedTrip: Trip = {
    id: trip.id,
    from: trip.from_city,
    to: trip.to_city,
    title: `Trip to ${trip.to_city}`,
    duration: trip.duration,
    totalPriceINR: trip.total_price || 0,
    localDelicacies: [],
    photoGallery: [],
    days: trip.itinerary_days.map(day => ({
      id: day.id,
      dayNumber: day.day_number,
      date: day.date,
      title: day.title,
      description: day.description || "",
      location: { lat: day.lat, lng: day.lng },
      activities: day.activities.map(act => ({
        id: act.id,
        time: act.time,
        title: act.title,
        description: act.description || "",
        type: act.type,
        location: { lat: act.lat, lng: act.lng },
        priceINR: act.price_inr ?? undefined
      }))
    }))
  };

  return mappedTrip;
}

// Dashboard list, newest first. Resolved owner only — no user_id param by design.
export async function getUserTrips(page: number = 1, limit: number = 9) {
  const supabase = await createClient();
  const ownerId = await resolveOwnerId();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('trips')
    .select('*', { count: 'exact' })
    .eq('user_id', ownerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getUserTrips failed", error.message);
    return { data: [], count: 0 };
  }

  return { data: data ?? [], count: count || 0 };
}

// Owner-only delete. The extra user_id clause is the whole security model here.
export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  const ownerId = await resolveOwnerId();

  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', ownerId);

  if (error) {
    throw new Error(error.message);
  }
  return true;
}

// In-memory rate limit. Good enough for one instance; needs Redis once we scale
// past a single server (keys vanish on restart until then).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

async function checkRateLimit() {
  const ownerId = await resolveOwnerId();

  // Bucket by owner, falling back to IP when everyone's on the demo id.
  // Behind a proxy the forwarded header can be spoofed, but for a generation
  // quota that's fine.
  const h = await headers();
  const ip = h.get('x-forwarded-for') || 'anonymous';
  const identifier = ownerId === "local-demo" ? `ip:${ip}` : `user:${ownerId}`;

  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  const limit = ownerId === "local-demo" ? MAX_REQUESTS_ANON : MAX_REQUESTS_PER_USER;

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return;
  }

  if (entry.count >= limit) {
    return { error: `Too many requests. Please wait a minute. (${limit} requests/min allowed)` };
  }

  entry.count++;
  return null;
}

// Input guard: keeps junk and absurd budgets out before we touch the DB.
const TripQuerySchema = z.object({
  from: z.string().min(2).max(50).nullable(),
  to: z.string().min(2).max(50).nullable(),
  vibe: z.string().max(20).nullable(),
  budget: z.coerce.number().positive().max(MAX_BUDGET_INR).nullable(),
});

// Core generation path: validate → quota-check → build itinerary → save the
// trip graph (trip, then days, then activities). Runs server-side so keys and
// pricing logic never reach the browser. _endDate is unused for now — duration
// comes from budget tiers; the param stays so the caller's positional args
// don't silently shift.
export async function generateTrip(from: string | null, to: string | null, vibe: string | null, budget: string | null, startDate?: string | null, _endDate?: string | null) {
  const rateLimitError = await checkRateLimit();
  if (rateLimitError && rateLimitError.error) {
    return { error: rateLimitError.error };
  }

  // 2. Schema validation
  const validation = TripQuerySchema.safeParse({ from, to, vibe, budget });
  
  if (!validation.success) {
    return { error: "Parameters are outside safe travel limits. Please check your inputs." };
  }

  const { from: cleanFrom, to: cleanTo, vibe: cleanVibe, budget: cleanNumBudget } = validation.data;
  const cleanBudget = cleanNumBudget?.toString() || null;

  try {
    const supabase = await createClient();
    const ownerId = await resolveOwnerId();

    // Quota: keeps one bucket from bloating the trips table.
    const { count } = await supabase
      .from('trips')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', ownerId);
    
    if ((count || 0) >= MAX_SAVED_TRIPS) {
      return { error: `You've reached your limit of ${MAX_SAVED_TRIPS} saved trips. Delete one before creating more.` };
    }

    const trip = await getTripByRoute(cleanFrom, cleanTo, cleanVibe, cleanBudget);

    // Saved sequentially (trip → days → activities). Not a real transaction —
    // a crash mid-save can orphan days, which the dashboard tolerates by
    // rendering what exists. Good enough until volume says otherwise.
    const { data: insertedTrip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: ownerId,
        from_city: trip.from,
        to_city: trip.to,
        budget: cleanNumBudget || 0,
        vibe: cleanVibe || 'balanced',
        duration: trip.duration,
        total_price: trip.totalPriceINR,
        start_date: startDate || new Date().toISOString(),
      })
      .select()
      .single();

    if (tripError || !insertedTrip) {
      // Storage is optional for viewing: a dead database shouldn't eat a good
      // itinerary. Hand the built trip back as a preview so the page still
      // renders; the client says plainly that nothing was saved.
      console.error("trip insert failed, returning preview", tripError?.message);
      return { preview: trip };
    }

    for (const day of trip.days) {
      const { data: insertedDay, error: dayError } = await supabase
        .from('itinerary_days')
        .insert({
          trip_id: (insertedTrip as { id: string }).id,
          day_number: day.dayNumber,
          date: day.date,
          title: day.title,
          description: day.description,
          lat: day.location.lat,
          lng: day.location.lng
        })
        .select()
        .single();

      if (dayError || !insertedDay) {
        console.error("day insert failed, skipping", dayError?.message);
        continue;
      }

      const activityInserts = day.activities.map(act => ({
        day_id: (insertedDay as { id: string }).id,
        time: act.time,
        title: act.title,
        description: act.description,
        type: act.type,
        lat: act.location?.lat || day.location.lat,
        lng: act.location?.lng || day.location.lng,
        price_inr: act.priceINR
      }));

      const { error: actError } = await supabase
        .from('activities')
        .insert(activityInserts);

      if (actError) {
        console.error("activities insert failed for day", day.dayNumber, actError.message);
      }
    }
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
    
    return { success: true, tripId: (insertedTrip as { id: string }).id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to generate trip itinerary." };
  }
}
