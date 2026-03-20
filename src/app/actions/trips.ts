"use server";

import { supabase } from "@/lib/supabase";
import { getTripByRoute, type Trip } from "@/data/mock-itinerary";
import { Database } from "@/types/supabase";

type TripInsert = Database['public']['Tables']['trips']['Insert'];
type DayInsert = Database['public']['Tables']['itinerary_days']['Insert'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

export async function saveExistingTrip(tripData: Trip, userId: string) {
  // 1. Save main Trip record
  const { data: trip, error: tripError } = await (supabase
    .from('trips')
    .insert({
      user_id: userId,
      from_city: tripData.from,
      to_city: tripData.to,
      vibe: 'balanced',
      budget: 0,
      total_price: Number(tripData.totalPriceINR) || 0,
      duration: tripData.duration,
      start_date: new Date().toISOString()
    } as any)
    .select()
    .single() as any);

  if (tripError || !trip) throw new Error(tripError?.message || "Failed to save trip");

  // 2. Save Days and Activities
  for (const day of tripData.days) {
    const { data: dbDay, error: dayError } = await (supabase
      .from('itinerary_days')
      .insert({
        trip_id: trip.id,
        day_number: day.dayNumber,
        date: day.date,
        title: day.title,
        description: day.description || "",
        lat: Number(day.location.lat),
        lng: Number(day.location.lng)
      } as any)
      .select()
      .single() as any);

    if (dayError || !dbDay) {
      console.error("Error saving day:", dayError);
      continue;
    }

    const activityInserts = day.activities.map(act => ({
      day_id: dbDay.id,
      time: act.time,
      title: act.title,
      description: act.description || "",
      type: act.type,
      lat: act.location?.lat ? Number(act.location.lat) : null,
      lng: act.location?.lng ? Number(act.location.lng) : null,
      price_inr: (act as any).price_inr || (act as any).priceINR || 0
    }));

    if (activityInserts.length > 0) {
      const { error: actError } = await ((supabase as any).from('activities').insert(activityInserts) as any);
      if (actError) console.error("Error saving activities:", actError);
    }
  }

  return trip.id;
}

export async function generateAndSaveTrip(from: string, to: string, vibe: string, budget: string, userId: string) {
  const tripData = await getTripByRoute(from, to, vibe, budget);
  return saveExistingTrip(tripData, userId);
}

export async function getTripById(tripId: string) {
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

export async function getUserTrips(userId: string) {
  const { data, error } = await (supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }) as any);

  if (error) {
    console.error("Error fetching user trips:", error);
    return [];
  }

  return data as any[];
}

export async function deleteTrip(tripId: string, userId: string) {
  const { error } = await (supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', userId) as any);

  if (error) {
    console.error("Error deleting trip:", error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Server Action to generate a trip itinerary preview without saving to DB.
 * This keeps the "knowledge base" and generation logic on the server.
 */
export async function getTripPreviewAction(from: string | null, to: string | null, vibe: string | null, budget: string | null) {
  try {
    const trip = await getTripByRoute(from, to, vibe, budget);
    return trip;
  } catch (err) {
    console.error("Error in getTripPreviewAction:", err);
    throw new Error("Failed to generate trip itinerary.");
  }
}
