"use client";

import { useActionState } from "react";
import { saveSettings } from "../../actions/content";
import { ActionForm, Card, Field, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";
import type { SiteSettings } from "@/lib/settings";

export function LinksForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, undefined);
  return (
    <ActionForm action={action} className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="font-display text-2xl">Contact</h2>
        <Field label="WhatsApp number" hint="With country code, digits only — e.g. 4915112345678.">
          <input name="whatsapp_number" inputMode="tel" required defaultValue={settings.whatsapp_number} className={inputClass} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required defaultValue={settings.email} className={inputClass} />
        </Field>
      </Card>
      <Card className="space-y-4">
        <h2 className="font-display text-2xl">Social channels</h2>
        <p className="text-xs text-obsidian/55">Full links starting with https://. Leave empty to hide a channel.</p>
        <Field label="Instagram">
          <input name="instagram_url" type="url" defaultValue={settings.instagram_url} className={inputClass} />
        </Field>
        <Field label="OnlyFans">
          <input name="onlyfans_url" type="url" defaultValue={settings.onlyfans_url} className={inputClass} />
        </Field>
        <Field label="X / Twitter">
          <input name="x_url" type="url" defaultValue={settings.x_url} className={inputClass} />
        </Field>
        <Field label="Telegram channel">
          <input name="telegram_channel_url" type="url" defaultValue={settings.telegram_channel_url} className={inputClass} />
        </Field>
      </Card>
      <div className="flex items-center gap-4 lg:col-span-2">
        <SubmitButton>Save links</SubmitButton>
        <FormMessage state={state} />
      </div>
    </ActionForm>
  );
}
