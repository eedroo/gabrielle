import Link from "next/link";
import { Badge, Card, PageTitle } from "@/components/admin/ui";
import { listGallery, listLifestyle, listTravels, slotSummary } from "@/lib/admin/queries";
import { BOOKING_RULES, calendarHealth } from "@/lib/availability";
import { currentTravel, formatRangeLong, upcomingTravels } from "@/lib/travels";

export default async function DashboardPage() {
  const [travels, slots, gallery, lifestyle, calendar] = await Promise.all([
    listTravels(),
    slotSummary(),
    listGallery(),
    listLifestyle(),
    calendarHealth(),
  ]);
  const current = currentTravel(travels);
  const upcoming = upcomingTravels(travels);
  const next = current ?? upcoming[0] ?? null;

  const stats = [
    { label: current ? "Current destination" : "Next destination", value: next?.city ?? "—", detail: next ? formatRangeLong(next) : "No trip published", href: "/admin/travels" },
    { label: "Upcoming travels", value: String(upcoming.length), detail: "Published", href: "/admin/travels" },
    { label: "Official photos", value: `${slots.official} / ${slots.total}`, detail: slots.temporary ? `${slots.temporary} still temporary` : "All official", href: "/admin/photos" },
    { label: "Gallery photos", value: String(gallery.length), detail: gallery.length ? "Uploaded" : "Showing temporary photos", href: "/admin/gallery" },
  ];

  const actions = [
    { href: "/admin/travels", title: "Add a travel", text: "Announce a new destination and dates." },
    { href: "/admin/photos", title: "Replace photos", text: "Swap temporary photos for official ones." },
    { href: "/admin/gallery", title: "Upload to the gallery", text: "Add photos to a collection." },
    { href: "/admin/lifestyle", title: "Edit lifestyle", text: "Fragrances, places and wishlist." },
    { href: "/admin/links", title: "Links & contacts", text: "WhatsApp, email and social channels." },
  ];

  return (
    <>
      <PageTitle title="Dashboard" description="Manage your website content, travels and photos. Every change is live on the website straight away." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl border border-obsidian/10 bg-white p-5 shadow-sm transition hover:border-muted-gold">
            <p className="text-xs uppercase tracking-[0.16em] text-obsidian/55">{s.label}</p>
            <p className="mt-2 font-display text-3xl">{s.value}</p>
            <p className="mt-1 text-sm text-obsidian/55">{s.detail}</p>
          </Link>
        ))}
      </div>

      {slots.temporary + slots.missing > 0 && (
        <Card className="mt-6 border-amber-700/20 bg-amber-50/60">
          <p className="text-sm text-amber-900">
            <strong>Before launch:</strong> {slots.temporary} photo{slots.temporary === 1 ? " is" : "s are"} still temporary
            {slots.missing ? ` and ${slots.missing} ${slots.missing === 1 ? "is" : "are"} missing` : ""}.{" "}
            <Link href="/admin/photos" className="underline">Replace them in Photos &amp; videos</Link>.
          </p>
        </Card>
      )}

      <h2 className="mt-10 font-display text-2xl">Availability calendar</h2>
      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          {calendar.state === "connected" && <Badge tone="green">Connected</Badge>}
          {calendar.state === "error" && <Badge tone="amber">Not working</Badge>}
          {calendar.state === "not-configured" && <Badge tone="grey">Not connected yet</Badge>}
          {calendar.state === "connected" && (
            <p className="text-sm">
              <strong>{calendar.name}</strong> · {calendar.windowsNext14Days} available period{calendar.windowsNext14Days === 1 ? "" : "s"} in the next 14 days
            </p>
          )}
          {calendar.state === "error" && <p className="text-sm text-amber-900">{calendar.message}</p>}
        </div>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-obsidian/65">
          <li>Every event in this calendar is a period when you are available. An empty calendar means no times are offered.</li>
          <li>Confirmed appointment? Add an event starting with “Booked” — that time plus {BOOKING_RULES.bufferMinutes} minutes before and after is no longer offered.</li>
          <li>Requests need at least {BOOKING_RULES.minNoticeMinutes / 60} hours’ notice. Times are shown in {BOOKING_RULES.timeZone.replace("_", " ")} time.</li>
        </ul>
      </Card>

      <h2 className="mt-10 font-display text-2xl">Quick actions</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="rounded-xl border border-obsidian/10 bg-white p-5 shadow-sm transition hover:border-muted-gold">
            <p className="font-medium">{a.title}</p>
            <p className="mt-1 text-sm text-obsidian/55">{a.text}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl">Upcoming travels</h2>
      <Card className="mt-4">
        {upcoming.length === 0 ? (
          <p className="text-sm text-obsidian/60">No upcoming travels. <Link href="/admin/travels" className="underline">Add one</Link>.</p>
        ) : (
          <ul className="divide-y divide-obsidian/10">
            {upcoming.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{t.city}</p>
                  <p className="text-sm text-obsidian/55">{t.country} · {formatRangeLong(t)}</p>
                </div>
                {t.id === current?.id ? <Badge tone="green">Current</Badge> : <Badge tone="grey">Upcoming</Badge>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="mt-10 text-xs text-obsidian/45">
        Lifestyle: {lifestyle.filter((i) => i.published).length} published items.
      </p>
    </>
  );
}
