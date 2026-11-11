"use client";

import { useActionState } from "react";
import { addAdmin, changePassword, removeAdmin, resetAdminPassword } from "../../actions/auth";
import { ActionForm, Badge, Card, Field, FormMessage, SubmitButton, inputClass } from "@/components/admin/ui";
import type { AdminAccount } from "@/lib/admin/queries";

export function AccountForms({ me, accounts }: { me: number; accounts: AdminAccount[] }) {
  const [pwState, pwAction] = useActionState(changePassword, undefined);
  const [addState, addAction] = useActionState(addAdmin, undefined);
  const [resetState, resetAction] = useActionState(resetAdminPassword, undefined);
  const [removeState, removeAction] = useActionState(removeAdmin, undefined);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="font-display text-2xl">Change password</h2>
        <ActionForm action={pwAction} className="mt-4 space-y-4">
          <Field label="Current password">
            <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
          </Field>
          <Field label="New password" hint="At least 10 characters.">
            <input name="next" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
          </Field>
          <Field label="Repeat new password">
            <input name="confirm" type="password" autoComplete="new-password" minLength={10} required className={inputClass} />
          </Field>
          <FormMessage state={pwState} />
          <SubmitButton>Change password</SubmitButton>
        </ActionForm>
      </Card>

      <Card>
        <h2 className="font-display text-2xl">Who has access</h2>
        <ul className="mt-4 divide-y divide-obsidian/10">
          {accounts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {a.name} {a.id === me && <Badge tone="green">You</Badge>}
                </p>
                <p className="text-sm text-obsidian/55">{a.email}</p>
                <p className="text-xs text-obsidian/40">Last sign-in: {a.lastLogin ?? "never"}</p>
              </div>
              {a.id !== me && (
                <div className="flex gap-1">
                  <ActionForm action={resetAction} confirm={`Create a new temporary password for ${a.name}?`}>
                    <input type="hidden" name="id" value={a.id} />
                    <SubmitButton variant="ghost">Reset password</SubmitButton>
                  </ActionForm>
                  <ActionForm action={removeAction} confirm={`Remove ${a.name}'s access?`}>
                    <input type="hidden" name="id" value={a.id} />
                    <SubmitButton variant="ghost">Remove</SubmitButton>
                  </ActionForm>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-2">
          <FormMessage state={resetState} />
          <FormMessage state={removeState} />
        </div>

        <h3 className="mt-8 font-medium">Add someone</h3>
        <ActionForm action={addAction} className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Name" required className={inputClass} />
            <input name="email" type="email" placeholder="Email" required className={inputClass} />
          </div>
          <FormMessage state={addState} />
          <SubmitButton variant="secondary">Create account</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
