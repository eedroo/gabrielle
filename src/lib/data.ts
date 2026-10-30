/**
 * Data access layer. Pages only talk to these functions, so swapping the
 * static content for the backoffice (Supabase) later does not touch the UI.
 */
import { travels } from "@/content/travels";
import { resolveImage } from "@/lib/images";
import { currentTravel, upcomingTravels, type Travel } from "@/lib/travels";

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** A trip without its own image uses "gabrielle-travels-<city>" if that file exists. */
const withImage = (trip: Travel): Travel => ({
  ...trip,
  image: trip.image ?? resolveImage(`gabrielle-travels-${slug(trip.city)}`),
});

export async function getUpcomingTravels(): Promise<Travel[]> {
  return upcomingTravels(travels).map(withImage);
}

export async function getCurrentTravel(): Promise<Travel | null> {
  const trip = currentTravel(travels);
  return trip && withImage(trip);
}
