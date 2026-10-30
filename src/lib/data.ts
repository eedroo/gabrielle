/**
 * Data access layer. Pages only talk to these functions, so swapping the
 * static content for the backoffice (Supabase) later does not touch the UI.
 */
import { travels } from "@/content/travels";
import { currentTravel, upcomingTravels, type Travel } from "@/lib/travels";

export async function getUpcomingTravels(): Promise<Travel[]> {
  return upcomingTravels(travels);
}

export async function getCurrentTravel(): Promise<Travel | null> {
  return currentTravel(travels);
}
