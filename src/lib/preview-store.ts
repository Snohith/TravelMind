"use client";

import type { Trip } from "@/data/mock-itinerary";

// Previews live here when trip storage is unreachable (no DB in demo).
// localStorage, not Supabase: same browser only, ~5MB cap, no sharing.
// When server-side storage covers this path, delete this file and the branches
// that call it — that removal is the whole change (see ADR-0006).
const KEY = "tm-previews-v1";

function readAll(): Trip[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    // Corrupt or full — start over rather than crash the dashboard.
    return [];
  }
}

function writeAll(trips: Trip[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(trips));
  } catch {
    // Quota exceeded (big photo galleries). Drop the oldest and retry once.
    const trimmed = trips.slice(-3);
    try {
      localStorage.setItem(KEY, JSON.stringify(trimmed));
    } catch {
      // Still full — give up quietly, the page already renders the trip.
    }
  }
}

export function savePreview(trip: Trip) {
  const rest = readAll().filter(t => t.id !== trip.id);
  writeAll([trip, ...rest].slice(0, 20)); // cap so one browser can't hoard
}

export function getPreview(id: string): Trip | null {
  return readAll().find(t => t.id === id) ?? null;
}

export function listPreviews(): Trip[] {
  return readAll();
}

export function removePreview(id: string) {
  writeAll(readAll().filter(t => t.id !== id));
}
