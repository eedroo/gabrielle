import { PageTitle } from "@/components/admin/ui";
import { getSettings } from "@/lib/settings";
import { LinksForm } from "./LinksForm";

export default async function LinksPage() {
  const settings = await getSettings();
  return (
    <>
      <PageTitle
        title="Links & contacts"
        description="Used across the whole website: the WhatsApp buttons, the enquiry form, the footer, the menu and Stay Connected."
      />
      <LinksForm settings={settings} />
    </>
  );
}
