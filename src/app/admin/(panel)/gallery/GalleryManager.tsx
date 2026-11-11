"use client";

import { useActionState } from "react";
import { addGalleryPhoto, deleteGalleryPhoto, moveGalleryPhoto, updateGalleryPhoto } from "../../actions/content";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ActionForm, ActionButton, Card, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";
import type { AdminGalleryPhoto } from "@/lib/admin/queries";

type Collection = { id: string; label: string };
type Props = { photos: AdminGalleryPhoto[]; collections: Collection[]; storage: "blob" | "local" };

export function GalleryManager({ photos, collections, storage }: Props) {
  return (
    <div className="space-y-10">
      {collections.map((c) => {
        const items = photos.filter((p) => p.collection === c.id);
        return (
          <section key={c.id}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl">
                {c.label} <span className="text-base text-obsidian/45">({items.length})</span>
              </h2>
              <MediaUpload
                name={`gabrielle-gallery-${c.id}`}
                folder="gallery"
                storage={storage}
                multiple
                label="Upload photos"
                onUploaded={(url) => addGalleryPhoto(c.id, url, `Gabrielle — ${c.label.toLowerCase()} photograph`)}
              />
            </div>
            {items.length === 0 ? (
              <Card className="text-sm text-obsidian/55">No photos in {c.label} yet — this collection is hidden on the website.</Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p, i) => (
                  <PhotoCard key={p.id} photo={p} collections={collections} first={i === 0} last={i === items.length - 1} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PhotoCard({ photo, collections, first, last }: { photo: AdminGalleryPhoto; collections: Collection[]; first: boolean; last: boolean }) {
  const [state, action] = useActionState(updateGalleryPhoto, undefined);
  return (
    <div className="overflow-hidden rounded-xl border border-obsidian/10 bg-white shadow-sm">
      <img src={photo.url} alt="" className="aspect-[4/5] w-full object-cover" />
      <ActionForm action={action} className="space-y-2 p-3">
        <input type="hidden" name="id" value={photo.id} />
        <input name="alt" defaultValue={photo.alt} aria-label="Description" placeholder="Description" className={inputClass} />
        <select name="collection" defaultValue={photo.collection} aria-label="Collection" className={inputClass}>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between gap-1">
          <div className="flex">
            <ActionButton action={() => moveGalleryPhoto(photo.id, -1)} title="Move earlier">
              {first ? <span className="opacity-30">←</span> : "←"}
            </ActionButton>
            <ActionButton action={() => moveGalleryPhoto(photo.id, 1)} title="Move later">
              {last ? <span className="opacity-30">→</span> : "→"}
            </ActionButton>
            <ActionButton action={() => deleteGalleryPhoto(photo.id)} confirm="Delete this photo from the gallery?">
              Delete
            </ActionButton>
          </div>
          <SubmitButton variant="secondary">Save</SubmitButton>
        </div>
        <FormMessage state={state} />
      </ActionForm>
    </div>
  );
}
