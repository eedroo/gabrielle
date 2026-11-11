import { PageTitle } from "@/components/admin/ui";
import { listTravels } from "@/lib/admin/queries";
import { blobEnabled } from "@/lib/admin/storage";
import { TravelsManager } from "./TravelsManager";

export default async function TravelsPage() {
  const travels = await listTravels();
  return (
    <>
      <PageTitle
        title="Travels"
        description="Destinations appear in the travel bar, on the home page, on Travels and in the Book Me city list. Past trips disappear from the website automatically."
      />
      <TravelsManager travels={travels} storage={blobEnabled() ? "blob" : "local"} today={new Date().toISOString().slice(0, 10)} />
    </>
  );
}
