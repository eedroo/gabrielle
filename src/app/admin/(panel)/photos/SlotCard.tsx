"use client";

import { useActionState } from "react";
import { saveSlotAlt, setSlotMedia } from "../../actions/content";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ActionForm, ActionButton, Badge, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";
import type { SlotState } from "@/lib/admin/queries";

const statusBadge = {
  official: <Badge tone="green">Official</Badge>,
  temporary: <Badge tone="amber">Temporary</Badge>,
  missing: <Badge tone="grey">Missing</Badge>,
};

export function SlotCard({ slot, storage }: { slot: SlotState; storage: "blob" | "local" }) {
  const [state, action] = useActionState(saveSlotAlt, undefined);
  const preview = slot.official.image ?? slot.temporary.image;
  const video = slot.official.video ?? slot.temporary.video;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-obsidian/10 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-obsidian/5">
        {video ? (
          <video src={video} poster={preview ?? undefined} muted loop playsInline autoPlay className="size-full object-cover" />
        ) : preview ? (
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-obsidian/40">No photo yet</div>
        )}
        <div className="absolute left-3 top-3">{statusBadge[slot.status]}</div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <p className="font-medium">{slot.label}</p>
          <p className="mt-0.5 text-xs text-obsidian/55">{slot.format}</p>
          <p className="mt-1 break-all font-mono text-[0.6875rem] text-obsidian/40">{slot.slot}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MediaUpload
            name={slot.slot}
            folder="photos"
            storage={storage}
            label={slot.official.image ? "Replace photo" : "Upload official photo"}
            onUploaded={(url) => setSlotMedia(slot.slot, "image_url", url)}
          />
          {slot.official.image && (
            <ActionButton action={() => setSlotMedia(slot.slot, "image_url", null)} confirm="Remove the official photo? The temporary one will show again.">
              Remove
            </ActionButton>
          )}
        </div>

        {slot.video && (
          <div className="space-y-2 border-t border-obsidian/10 pt-4">
            <p className="text-sm font-medium">
              Background video {slot.official.video ? <Badge tone="green">Official</Badge> : slot.temporary.video ? <Badge tone="amber">Temporary</Badge> : <Badge tone="grey">None</Badge>}
            </p>
            <p className="text-xs text-obsidian/55">MP4 without sound, 8–20 s loop, under 8 MB. The photo shows while it loads.</p>
            <div className="flex flex-wrap items-center gap-2">
              <MediaUpload
                name={slot.slot}
                folder="videos"
                kind="video"
                storage={storage}
                label={slot.official.video ? "Replace video" : "Upload video"}
                onUploaded={(url) => setSlotMedia(slot.slot, "video_url", url)}
              />
              {slot.official.video && (
                <ActionButton action={() => setSlotMedia(slot.slot, "video_url", null)} confirm="Remove this video?">
                  Remove
                </ActionButton>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <MediaUpload
                name={`${slot.slot}-mobile`}
                folder="videos"
                kind="video"
                storage={storage}
                label={slot.official.videoMobile ? "Replace phone version" : "Phone version (optional)"}
                onUploaded={(url) => setSlotMedia(slot.slot, "video_mobile_url", url)}
              />
              {slot.official.videoMobile && (
                <ActionButton action={() => setSlotMedia(slot.slot, "video_mobile_url", null)} confirm="Remove the phone version?">
                  Remove
                </ActionButton>
              )}
            </div>
          </div>
        )}

        <ActionForm action={action} className="mt-auto space-y-2 border-t border-obsidian/10 pt-4">
          <input type="hidden" name="slot" value={slot.slot} />
          <label className="block text-sm font-medium" htmlFor={`alt-${slot.slot}`}>
            Description
          </label>
          <div className="flex gap-2">
            <input
              id={`alt-${slot.slot}`}
              name="alt"
              defaultValue={slot.official.alt ?? ""}
              placeholder="e.g. Gabrielle in a black dress by the window"
              className={inputClass}
            />
            <SubmitButton variant="secondary">Save</SubmitButton>
          </div>
          <FormMessage state={state} />
        </ActionForm>
      </div>
    </div>
  );
}
