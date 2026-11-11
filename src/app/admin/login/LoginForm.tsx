"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";
import { ActionForm, Field, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  return (
    <ActionForm action={action} className="space-y-4">
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </ActionForm>
  );
}
