"use client";

import { useActionState } from "react";
import { setupFirstAccount } from "../actions/auth";
import { ActionForm, Field, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";

export function SetupForm() {
  const [state, action] = useActionState(setupFirstAccount, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <Field label="Setup code" hint="The ADMIN_SETUP_CODE value set in Vercel.">
        <input name="code" type="password" required className={inputClass} />
      </Field>
      <Field label="Your name">
        <input name="name" autoComplete="name" required className={inputClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Password" hint="At least 10 characters.">
        <input name="password" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Create account</SubmitButton>
    </ActionForm>
  );
}
