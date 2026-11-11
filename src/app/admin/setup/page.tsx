import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { sql } from "@/lib/db";
import { adminConfigError } from "@/lib/admin/session";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

/** One-time page to create the first account; closed once any account exists. */
export default async function SetupPage() {
  if (adminConfigError()) redirect("/admin/login");
  const [{ count }] = await sql!<{ count: number }[]>`SELECT count(*)::int AS count FROM admin_users`;
  if (count > 0) redirect("/admin/login");
  return (
    <AuthCard title="Create the first account" description="This page works only once. Further accounts are added in Account.">
      <SetupForm />
    </AuthCard>
  );
}
