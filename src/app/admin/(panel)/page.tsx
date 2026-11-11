import Link from "next/link";
import { Badge, Card, PageTitle } from "@/components/admin/ui";
import { listGallery, listLifestyle, listTravels, slotSummary } from "@/lib/admin/queries";
import { currentTravel, formatRangeLong, upcomingTravels } from "@/lib/travels";

export default async function DashboardPage() {
  const [travels, slots, gallery, lifestyle] = await Promise.all([listTravels(), slotSummary(), listGallery(), listLifestyle()]);
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
