import { PageTitle } from "@/components/admin/ui";
import { listAccounts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { AccountForms } from "./AccountForms";

export default async function AccountPage() {
  const [admin, accounts] = await Promise.all([requireAdmin(), listAccounts()]);
  return (
    <>
      <PageTitle title="Account" description="Your password and who can access the backoffice." />
      <AccountForms me={admin.id} accounts={accounts} />
    </>
  );
}
