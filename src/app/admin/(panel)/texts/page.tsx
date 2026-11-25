import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";
import { getTextOverrides, listTextSections, textPageLabels, type TextPageId } from "@/lib/texts";
import { TextSectionForm } from "./TextSectionForm";

const PAGE_LINKS: Record<TextPageId, string> = {
  home: "/",
  about: "/about",
  gallery: "/gallery",
  travels: "/travels",
  lifestyle: "/lifestyle",
  bookMe: "/book-me",
  site: "/",
};

export default async function TextsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requested = (await searchParams).page;
  const page: TextPageId = requested && requested in textPageLabels ? (requested as TextPageId) : "home";
  const overrides = await getTextOverrides();
  const sections = listTextSections(page).map((s) => ({
    ...s,
    fields: s.fields.map((f) => ({ ...f, value: overrides.get(f.key) ?? f.defaultValue, edited: overrides.has(f.key) })),
  }));

  return (
    <>
      <PageTitle
        title="Texts"
        description="Every text on the website, page by page and section by section. Save a section and the website updates straight away. “Reset” brings back the original text."
      />

      <nav aria-label="Pages" className="mb-8 flex flex-wrap gap-2">
        {(Object.keys(textPageLabels) as TextPageId[]).map((id) => (
          <Link
            key={id}
            href={`/admin/texts?page=${id}`}
            aria-current={id === page ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              id === page ? "border-obsidian bg-obsidian text-champagne" : "border-obsidian/15 bg-white hover:border-obsidian/40"
            }`}
          >
            {textPageLabels[id]}
          </Link>
        ))}
        <a href={PAGE_LINKS[page]} target="_blank" rel="noopener noreferrer" className="ml-auto self-center text-sm text-obsidian/55 underline">
          View page ↗
        </a>
      </nav>

      <div className="space-y-6">
        {sections.map((s) => (
          <TextSectionForm key={`${page}-${s.section}`} page={page} section={s} />
        ))}
      </div>
    </>
  );
}
