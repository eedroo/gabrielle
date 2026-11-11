import { PageTitle } from "@/components/admin/ui";
import { collectionDefs } from "@/content/gallery";
import { listGallery } from "@/lib/admin/queries";
import { blobEnabled } from "@/lib/admin/storage";
import { GalleryManager } from "./GalleryManager";

export default async function GalleryAdminPage() {
  const photos = await listGallery();
  return (
    <>
      <PageTitle
        title="Gallery"
        description="Upload photos to each collection. A collection without photos is hidden on the website. Until the first upload, the website shows the temporary photos."
      />
      <GalleryManager
        photos={photos}
        collections={collectionDefs.map((c) => ({ id: c.id, label: c.label }))}
        storage={blobEnabled() ? "blob" : "local"}
      />
    </>
  );
}
