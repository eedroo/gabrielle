import { NextResponse, type NextRequest } from "next/server";
import { bookMe } from "@/content/book-me";
import { getAvailability } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const hours = Number.parseInt(request.nextUrl.searchParams.get("duration") ?? "", 10);

  const slots = await getAvailability({
    date,
    times: bookMe.form.availability.times,
    durationHours: Number.isFinite(hours) && hours > 0 ? hours : null,
  });

  return NextResponse.json(
    { slots },
    { headers: { "Cache-Control": "no-store" } },
  );
}
