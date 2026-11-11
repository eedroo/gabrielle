import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminConfigError, getAdmin } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (adminConfigError()) redirect("/admin/login");
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminShell name={admin.name}>{children}</AdminShell>;
}
