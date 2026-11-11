import { PageTitle } from "@/components/admin/ui";
import { listSlotStates } from "@/lib/admin/queries";
import { blobEnabled } from "@/lib/admin/storage";
import { SlotCard } from "./SlotCard";

export default async function PhotosPage() {
  const groups = await listSlotStates();
  const storage = blobEnabled() ? "blob" : "local";
  return (
    <>
      <PageTitle
        title="Photos & videos"
        description="Every photo on the website, page by page. “Temporary” means a placeholder is still showing: upload the official photo to replace it. The description helps search engines and screen readers."
      />
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.page}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">{g.page}</h2>
              <a href={g.href} target="_blank" rel="noopener noreferrer" className="text-sm text-obsidian/55 underline">
                View page ↗
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {g.slots.map((s) => (
                <SlotCard key={s.slot} slot={s} storage={storage} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
