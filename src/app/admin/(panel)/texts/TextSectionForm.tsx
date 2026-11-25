"use client";

import { useActionState } from "react";
import { resetTexts, saveTexts } from "../../actions/content";
import { ActionButton, ActionForm, Badge, Card, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";
import type { TextField } from "@/lib/texts";

type Field = TextField & { value: string; edited: boolean };
type Section = { section: string; title: string; heading?: string; fields: Field[] };

export function TextSectionForm({ page, section }: { page: string; section: Section }) {
  const [state, action] = useActionState(saveTexts, undefined);
  const editedCount = section.fields.filter((f) => f.edited).length;

  return (
    <Card>
      <details open={section.section === "hero" || section.section === "seo" || page === "site"}>
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 [&::-webkit-details-marker]:hidden">
          <h2 className="font-display text-2xl">{section.title}</h2>
          {section.heading && section.title !== section.heading && <span className="text-sm text-obsidian/50">“{section.heading}”</span>}
          {editedCount > 0 && <Badge tone="green">{editedCount} edited</Badge>}
          <span className="ml-auto text-sm text-obsidian/50">{section.fields.length} texts ▾</span>
        </summary>

        <ActionForm action={action} className="mt-6 space-y-5">
          <input type="hidden" name="page" value={page} />
          <input type="hidden" name="section" value={section.section} />
          {section.fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {f.label}
                {f.edited && <Badge tone="green">Edited</Badge>}
              </label>
              {f.kind === "line" ? (
                <input id={f.key} name={f.key} defaultValue={f.value} className={`${inputClass} mt-1.5`} />
              ) : (
                <textarea
                  id={f.key}
                  name={f.key}
                  defaultValue={f.value}
                  rows={f.kind === "paragraphs" ? Math.min(12, Math.max(4, f.value.split("\n").length + 2)) : 3}
                  className={`${inputClass} mt-1.5 resize-y leading-relaxed`}
                />
              )}
              <div className="mt-1 space-y-0.5 text-xs text-obsidian/50">
                {f.kind === "paragraphs" && <p>Separate paragraphs with an empty line.</p>}
                {f.placeholders.length > 0 && <p>Keep {f.placeholders.join(", ")} — it is filled in automatically.</p>}
                {f.edited && (
                  <details>
                    <summary className="cursor-pointer">Original text</summary>
                    <p className="mt-1 whitespace-pre-line rounded bg-obsidian/5 p-2">{f.defaultValue}</p>
                  </details>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3 border-t border-obsidian/10 pt-5">
            <SubmitButton>Save section</SubmitButton>
            {editedCount > 0 && (
              <ActionButton action={() => resetTexts(page, section.section)} confirm="Bring back the original texts of this section?">
                Reset to original
              </ActionButton>
            )}
            <FormMessage state={state} />
          </div>
        </ActionForm>
      </details>
    </Card>
  );
}
