import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/admin/AuthCard";
import { sql } from "@/lib/db";
import { adminConfigError, getAdmin } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const problem = adminConfigError();
  if (problem) {
    return (
      <AuthCard title="Almost there" description="The backoffice needs its configuration before anyone can sign in.">
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">{problem}</p>
      </AuthCard>
    );
  }
  if (await getAdmin()) redirect("/admin");
  const [{ count }] = await sql!<{ count: number }[]>`SELECT count(*)::int AS count FROM admin_users`;
  if (count === 0) redirect("/admin/setup");

  return (
    <AuthCard title="Welcome back" description="Sign in to manage your website.">
      <LoginForm />
      <p className="mt-6 text-xs text-obsidian/50">
        Forgot your password? Ask the other admin to reset it in Account. <Link href="/" className="underline">Back to the website</Link>
      </p>
    </AuthCard>
  );
}
