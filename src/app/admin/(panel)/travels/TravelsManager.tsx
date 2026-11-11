"use client";

import { useActionState, useEffect, useState } from "react";
import { deleteTravel, saveTravel, setTravelPublished } from "../../actions/content";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ActionForm, ActionButton, Badge, Card, Field, FormMessage, SubmitButton, buttonClass, inputClass } from "@/components/admin/ui";
import type { AdminTravel } from "@/lib/admin/queries";

type Props = { travels: AdminTravel[]; storage: "blob" | "local"; today: string };

const empty: AdminTravel = { id: "", city: "", country: "", countryCode: "", startDate: "", endDate: "", published: true, image: null };

function fmt(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function TravelsManager({ travels, storage, today }: Props) {
  const [editing, setEditing] = useState<AdminTravel | null>(null);

  const status = (t: AdminTravel) => {
    if (!t.published) return <Badge tone="grey">Hidden</Badge>;
    if (t.endDate < today) return <Badge tone="grey">Past</Badge>;
    if (t.startDate <= today) return <Badge tone="green">Current</Badge>;
    return <Badge tone="amber">Upcoming</Badge>;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Destinations</h2>
          <button type="button" className={buttonClass.primary} onClick={() => setEditing({ ...empty })}>
            + Add travel
          </button>
        </div>
        {travels.length === 0 ? (
          <p className="text-sm text-obsidian/60">No destinations yet.</p>
        ) : (
          <ul className="divide-y divide-obsidian/10">
            {travels.map((t) => (
              <li key={t.id} className={`flex flex-wrap items-center gap-4 py-4 ${t.endDate < today ? "opacity-60" : ""}`}>
                <div className="size-14 shrink-0 overflow-hidden rounded-md bg-obsidian/5">
                  {t.image && <img src={t.image} alt="" className="size-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {t.city} <span className="text-sm font-normal text-obsidian/55">· {t.country} ({t.countryCode})</span>
                  </p>
                  <p className="text-sm text-obsidian/55">
                    {fmt(t.startDate)} – {fmt(t.endDate)}
                  </p>
                </div>
                {status(t)}
                <div className="flex items-center gap-1">
                  <button type="button" className={buttonClass.ghost} onClick={() => setEditing(t)}>
                    Edit
                  </button>
                  <ActionButton action={() => setTravelPublished(t.id, !t.published)}>{t.published ? "Hide" : "Publish"}</ActionButton>
                  <ActionButton action={() => deleteTravel(t.id)} confirm={`Delete ${t.city}? This cannot be undone.`}>
                    Delete
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editing ? (
        <TravelForm key={editing.id || "new"} travel={editing} storage={storage} onClose={() => setEditing(null)} />
      ) : (
        <Card className="h-fit text-sm text-obsidian/60">Choose “Edit” on a destination, or “Add travel” to create a new one.</Card>
      )}
    </div>
  );
}

function TravelForm({ travel, storage, onClose }: { travel: AdminTravel; storage: "blob" | "local"; onClose: () => void }) {
  const [state, action] = useActionState(saveTravel, undefined);
  const [image, setImage] = useState(travel.image);
  const [city, setCity] = useState(travel.city);
  const isNew = !travel.id;

  useEffect(() => {
    if (state?.ok && isNew) onClose();
  }, [state, isNew, onClose]);

  return (
    <Card className="h-fit lg:sticky lg:top-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl">{isNew ? "New travel" : `Edit ${travel.city}`}</h2>
        <button type="button" className={buttonClass.ghost} onClick={onClose}>
          Close
        </button>
      </div>
      <ActionForm action={action} className="space-y-4">
        <input type="hidden" name="id" value={travel.id} />
        <input type="hidden" name="image_url" value={image ?? ""} />
        <Field label="City">
          <input name="city" required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Munich" />
        </Field>
        <div className="grid grid-cols-[1fr_96px] gap-3">
          <Field label="Country">
            <input name="country" required defaultValue={travel.country} className={inputClass} placeholder="Germany" />
          </Field>
          <Field label="Code" hint="2 letters">
            <input name="country_code" required maxLength={2} defaultValue={travel.countryCode} className={`${inputClass} uppercase`} placeholder="DE" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Arrival">
            <input name="start_date" type="date" required defaultValue={travel.startDate} className={inputClass} />
          </Field>
          <Field label="Departure">
            <input name="end_date" type="date" required defaultValue={travel.endDate} className={inputClass} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={travel.published} className="size-4 accent-obsidian" />
          Published on the website
        </label>

        <div>
          <p className="text-sm font-medium">City photo</p>
          <p className="mt-0.5 text-xs text-obsidian/55">Optional. Landscape 4:3. Without one, the default city photo is used.</p>
          <div className="mt-2 flex items-center gap-3">
            {image && <img src={image} alt="" className="h-16 w-20 rounded-md object-cover" />}
            <MediaUpload
              name={`gabrielle-travels-${city || "city"}`}
              folder="travels"
              storage={storage}
              label={image ? "Replace" : "Upload photo"}
              onUploaded={(url) => setImage(url)}
            />
            {image && (
              <button type="button" className={buttonClass.ghost} onClick={() => setImage(null)}>
                Remove
              </button>
            )}
          </div>
        </div>

        <FormMessage state={state} />
        <SubmitButton className="w-full">{isNew ? "Add travel" : "Save changes"}</SubmitButton>
      </ActionForm>
    </Card>
  );
}
