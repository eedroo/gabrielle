"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { FormError, handle, text, type FormState } from "@/lib/admin/form";
import { MIN_PASSWORD_LENGTH, hashPassword, temporaryPassword, verifyPassword } from "@/lib/admin/password";
import { adminConfigError, endSession, requireAdmin, startSession } from "@/lib/admin/session";

const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function db() {
  const problem = adminConfigError();
  if (problem || !sql) throw new FormError(`The backoffice is not set up yet: ${problem}`);
  return sql;
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  let signedIn = false;
  const result = await handle(async () => {
    const q = db();
    const email = text(fd, "email", { max: 200 }).toLowerCase();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) throw new FormError("Please enter your email and password.");

    const [{ failures }] = await q<{ failures: number }[]>`
      SELECT count(*)::int AS failures FROM login_attempts
      WHERE email = ${email} AND NOT succeeded AND attempted_at > now() - make_interval(mins => ${LOCK_MINUTES})`;
    if (failures >= MAX_FAILURES) throw new FormError(`Too many attempts. Please try again in ${LOCK_MINUTES} minutes.`);

    const [user] = await q<{ id: number; password_hash: string; session_version: number }[]>`
      SELECT id, password_hash, session_version FROM admin_users WHERE email = ${email}`;
    const valid = user ? await verifyPassword(password, user.password_hash) : false;
    await q`INSERT INTO login_attempts (email, succeeded) VALUES (${email}, ${valid})`;
    if (!user || !valid) throw new FormError("Email or password is incorrect.");

    await q`UPDATE admin_users SET last_login_at = now() WHERE id = ${user.id}`;
    await startSession(user.id, user.session_version);
    signedIn = true;
  });
  if (signedIn) redirect("/admin");
  return result;
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/** Creates the very first account. Needs ADMIN_SETUP_CODE and only works while no account exists. */
export async function setupFirstAccount(_: FormState, fd: FormData): Promise<FormState> {
  let created = false;
  const result = await handle(async () => {
    const q = db();
    const expected = process.env.ADMIN_SETUP_CODE;
    if (!expected) throw new FormError("ADMIN_SETUP_CODE is not configured.");
    if (String(fd.get("code") ?? "") !== expected) throw new FormError("The setup code is not correct.");
    const [{ count }] = await q<{ count: number }[]>`SELECT count(*)::int AS count FROM admin_users`;
    if (count > 0) throw new FormError("An account already exists. Please sign in.");

    const name = text(fd, "name", { max: 80, required: true });
    const email = text(fd, "email", { max: 200, required: true }).toLowerCase();
    const password = String(fd.get("password") ?? "");
    if (!isEmail(email)) throw new FormError("Please enter a valid email address.");
    if (password.length < MIN_PASSWORD_LENGTH) throw new FormError(`The password needs at least ${MIN_PASSWORD_LENGTH} characters.`);

    const [user] = await q<{ id: number; session_version: number }[]>`
      INSERT INTO admin_users (email, name, password_hash) VALUES (${email}, ${name}, ${await hashPassword(password)})
      RETURNING id, session_version`;
    await startSession(user.id, user.session_version);
    created = true;
  });
  if (created) redirect("/admin");
  return result;
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const admin = await requireAdmin();
    const q = db();
    const current = String(fd.get("current") ?? "");
    const next = String(fd.get("next") ?? "");
    if (next.length < MIN_PASSWORD_LENGTH) throw new FormError(`The new password needs at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (next !== String(fd.get("confirm") ?? "")) throw new FormError("The new passwords do not match.");
    const [user] = await q<{ password_hash: string }[]>`SELECT password_hash FROM admin_users WHERE id = ${admin.id}`;
    if (!user || !(await verifyPassword(current, user.password_hash))) throw new FormError("Your current password is incorrect.");

    // Bumping the version signs out every other device.
    const [updated] = await q<{ session_version: number }[]>`
      UPDATE admin_users SET password_hash = ${await hashPassword(next)}, session_version = session_version + 1
      WHERE id = ${admin.id} RETURNING session_version`;
    await startSession(admin.id, updated.session_version);
    return "Your password has been changed.";
  });
}

export async function addAdmin(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    await requireAdmin();
    const q = db();
    const name = text(fd, "name", { max: 80, required: true });
    const email = text(fd, "email", { max: 200, required: true }).toLowerCase();
    if (!isEmail(email)) throw new FormError("Please enter a valid email address.");
    const password = temporaryPassword();
    const rows = await q`
      INSERT INTO admin_users (email, name, password_hash) VALUES (${email}, ${name}, ${await hashPassword(password)})
      ON CONFLICT (email) DO NOTHING RETURNING id`;
    if (rows.length === 0) throw new FormError("There is already an account with this email.");
    return `Account created. Temporary password: ${password} — share it privately and ask ${name} to change it after signing in.`;
  });
}

export async function resetAdminPassword(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const admin = await requireAdmin();
    const q = db();
    const id = Number(fd.get("id"));
    if (id === admin.id) throw new FormError("Use “Change password” for your own account.");
    const password = temporaryPassword();
    const rows = await q<{ name: string }[]>`
      UPDATE admin_users SET password_hash = ${await hashPassword(password)}, session_version = session_version + 1
      WHERE id = ${id} RETURNING name`;
    if (rows.length === 0) throw new FormError("Account not found.");
    return `New temporary password for ${rows[0].name}: ${password}`;
  });
}

export async function removeAdmin(_: FormState, fd: FormData): Promise<FormState> {
  return handle(async () => {
    const admin = await requireAdmin();
    const q = db();
    const id = Number(fd.get("id"));
    if (id === admin.id) throw new FormError("You cannot remove your own account.");
    await q`DELETE FROM admin_users WHERE id = ${id}`;
    return "Account removed.";
  });
}
