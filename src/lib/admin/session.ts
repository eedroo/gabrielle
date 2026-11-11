import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { sql } from "@/lib/db";

const COOKIE = "gabrielle_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type AdminUser = { id: number; email: string; name: string };

function secret(): string | null {
  const s = process.env.AUTH_SECRET;
  return s && s.length >= 32 ? s : null;
}

/** Why the backoffice cannot run, if anything is missing. */
export function adminConfigError(): string | null {
  if (!sql) return "DATABASE_URL is not configured.";
  if (!secret()) return "AUTH_SECRET is not configured (at least 32 characters).";
  return null;
}

const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

/** Cookie value: base64url(JSON {uid, v, exp}).signature — `v` invalidates sessions on password change. */
export async function startSession(userId: number, sessionVersion: number) {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET missing");
  const payload = Buffer.from(JSON.stringify({ uid: userId, v: sessionVersion, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in admin, or null. Cached per request. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const key = secret();
  if (!key || !sql) return null;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  let data: { uid: number; v: number; exp: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
  if (!data.exp || data.exp < Date.now()) return null;

  const [user] = await sql<(AdminUser & { session_version: number })[]>`
    SELECT id, email, name, session_version FROM admin_users WHERE id = ${data.uid}`;
  if (!user || user.session_version !== data.v) return null;
  return { id: user.id, email: user.email, name: user.name };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
