import { bookMe } from "@/content/book-me";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BeforeSection() {
  const { before } = bookMe;
  return (
    <section className="section bg-obsidian">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <EditorialImage
          image={before.image}
          tone="warm"
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="hidden aspect-[4/5] w-full lg:block"
        />
        <div className="max-w-xl" data-reveal>
          <SectionHeading eyebrow={before.eyebrow} title={before.title} />
          <Paragraphs items={before.paragraphs} className="mt-7 text-warm-ivory/70" />
          <p className="eyebrow mt-10 text-champagne">{before.listTitle}</p>
          <ul className="mt-4 divide-y divide-warm-ivory/10 border-y border-warm-ivory/10">
            {before.list.map((item) => (
              <li key={item} className="flex gap-4 py-4 text-warm-ivory/85">
                <span className="mt-2.5 size-1.5 shrink-0 rotate-45 border border-champagne" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-display text-xl italic text-champagne">{before.closing}</p>
        </div>
      </div>
    </section>
  );
}
