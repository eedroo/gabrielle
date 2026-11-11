import { PageTitle } from "@/components/admin/ui";
import { listLifestyle } from "@/lib/admin/queries";
import { blobEnabled } from "@/lib/admin/storage";
import { LifestyleManager } from "./LifestyleManager";

export default async function LifestyleAdminPage() {
  const items = await listLifestyle();
  return (
    <>
      <PageTitle title="Lifestyle" description="The cards shown on the Lifestyle page. A photo is optional for every card." />
      <LifestyleManager items={items} storage={blobEnabled() ? "blob" : "local"} />
    </>
  );
}
