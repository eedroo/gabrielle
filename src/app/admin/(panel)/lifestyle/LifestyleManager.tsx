"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteLifestyleItem, moveLifestyleItem, saveLifestyleItem } from "../../actions/content";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ActionForm, ActionButton, Badge, Card, Field, FormMessage, SubmitButton, buttonClass, inputClass } from "@/components/admin/ui";
import type { AdminLifestyleItem } from "@/lib/admin/queries";

type Section = AdminLifestyleItem["section"];

const sections: { id: Section; title: string; subtitleLabel: string; subtitleHint: string; withNote: boolean }[] = [
  { id: "fragrance", title: "Fragrances", subtitleLabel: "Brand", subtitleHint: "e.g. Le Labo", withNote: true },
  { id: "place", title: "Places & experiences", subtitleLabel: "Location", subtitleHint: "e.g. Vienna, Austria", withNote: true },
  { id: "wishlist", title: "Wishlist", subtitleLabel: "Brand / description", subtitleHint: "e.g. Hermès", withNote: false },
];

export function LifestyleManager({ items, storage }: { items: AdminLifestyleItem[]; storage: "blob" | "local" }) {
  const [editing, setEditing] = useState<{ section: Section; item: AdminLifestyleItem | null } | null>(null);

  return (
    <div className="space-y-10">
      {sections.map((s) => {
        const list = items.filter((i) => i.section === s.id);
        const formHere = editing?.section === s.id;
        return (
          <section key={s.id}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl">{s.title}</h2>
              <button type="button" className={buttonClass.primary} onClick={() => setEditing({ section: s.id, item: null })}>
                + Add
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <Card>
                {list.length === 0 ? (
                  <p className="text-sm text-obsidian/55">Nothing here yet — this list is hidden on the website.</p>
                ) : (
                  <ul className="divide-y divide-obsidian/10">
                    {list.map((item, i) => (
                      <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-md bg-obsidian/5">
                          {item.image && <img src={item.image} alt="" className="size-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-obsidian/55">{item.subtitle}</p>
                        </div>
                        {!item.published && <Badge tone="grey">Hidden</Badge>}
                        <div className="flex items-center">
                          <ActionButton action={() => moveLifestyleItem(item.id, -1)} title="Move up">
                            <span className={i === 0 ? "opacity-30" : ""}>↑</span>
                          </ActionButton>
                          <ActionButton action={() => moveLifestyleItem(item.id, 1)} title="Move down">
                            <span className={i === list.length - 1 ? "opacity-30" : ""}>↓</span>
                          </ActionButton>
                          <button type="button" className={buttonClass.ghost} onClick={() => setEditing({ section: s.id, item })}>
                            Edit
                          </button>
                          <ActionButton action={() => deleteLifestyleItem(item.id)} confirm={`Delete “${item.title}”?`}>
                            Delete
                          </ActionButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              {formHere ? (
                <ItemForm
                  key={editing.item?.id ?? `new-${s.id}`}
                  config={s}
                  item={editing.item}
                  storage={storage}
                  onClose={() => setEditing(null)}
                />
              ) : (
                <div className="hidden lg:block" />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ItemForm({
  config,
  item,
  storage,
  onClose,
}: {
  config: (typeof sections)[number];
  item: AdminLifestyleItem | null;
  storage: "blob" | "local";
  onClose: () => void;
}) {
  const [state, action] = useActionState(saveLifestyleItem, undefined);
  const [image, setImage] = useState(item?.image ?? null);
  const [title, setTitle] = useState(item?.title ?? "");

  useEffect(() => {
    if (state?.ok && !item) onClose();
  }, [state, item, onClose]);

  return (
    <Card className="h-fit">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-2xl">{item ? "Edit" : "New"}</h3>
        <button type="button" className={buttonClass.ghost} onClick={onClose}>
          Close
        </button>
      </div>
      <ActionForm action={action} className="space-y-4">
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <input type="hidden" name="section" value={config.id} />
        <input type="hidden" name="image_url" value={image ?? ""} />
        <Field label="Name">
          <input name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label={config.subtitleLabel} hint={config.subtitleHint}>
          <input name="subtitle" required defaultValue={item?.subtitle} className={inputClass} />
        </Field>
        {config.withNote && (
          <Field label="Personal note" hint="Optional, one short sentence.">
            <textarea name="note" rows={2} defaultValue={item?.note ?? ""} className={inputClass} />
          </Field>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="size-4 accent-obsidian" />
          Published on the website
        </label>
        <div className="flex items-center gap-3">
          {image && <img src={image} alt="" className="h-14 w-16 rounded-md object-cover" />}
          <MediaUpload
            name={`gabrielle-lifestyle-${config.id}-${title || "item"}`}
            folder="lifestyle"
            storage={storage}
            label={image ? "Replace photo" : "Add photo (optional)"}
            onUploaded={(url) => setImage(url)}
          />
          {image && (
            <button type="button" className={buttonClass.ghost} onClick={() => setImage(null)}>
              Remove
            </button>
          )}
        </div>
        <FormMessage state={state} />
        <SubmitButton className="w-full">{item ? "Save changes" : "Add"}</SubmitButton>
      </ActionForm>
    </Card>
  );
}
