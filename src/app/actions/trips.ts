"use server";

import { supabase } from "@/lib/supabase";
import { getTripByRoute, type Trip } from "@/data/mock-itinerary";
import { Database } from "@/types/supabase";

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

/**
 * Retrieves all trips created by a specific user, ordered by the newest first.
 * 
 * @param userId - The unique ID of the logged-in user (Input)
 * @returns An array of trip objects belonging to the user (Output)
 * 
 * Why it exists: To populate the user's dashboard with their history of planned trips.
 */
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

/**
 * Deletes a specific trip from the database, ensuring only the owner can delete it.
 * 
 * @param tripId - The ID of the trip to delete (Input)
 * @param userId - The ID of the user requesting the deletion (Input)
 * @returns true if successful, or throws an error if it fails (Output)
 * 
 * Why it exists: Gives users control over their data so they can remove trips they no longer want.
 */
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
  try {
    const trip = await getTripByRoute(from, to, vibe, budget);
    return trip;
  } catch (err) {
    console.error("Error in getTripPreviewAction:", err);
    throw new Error("Failed to generate trip itinerary.");
  }
}
