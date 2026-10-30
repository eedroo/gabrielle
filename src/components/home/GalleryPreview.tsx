import { home } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GalleryPreview() {
  const { gallery } = home;
  return (
    <section className="section bg-obsidian">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div className="max-w-xl">
            <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
            <Paragraphs items={gallery.paragraphs} className="mt-6 text-warm-ivory/70" />
          </div>
          <Button href={gallery.cta.href} variant="outline-light" className="self-start lg:self-auto">
            {gallery.cta.label}
          </Button>
        </div>

        {/* Mobile: swipeable strip · Desktop: editorial five-up grid */}
        <ul className="-mx-[var(--page-padding)] mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--page-padding)] pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-[1fr_1.4fr_1fr_1fr_1fr] lg:overflow-visible lg:px-0">
          {gallery.images.map((img, i) => (
            <li key={img.alt} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
              <EditorialImage
                image={img}
                tone={i % 2 ? "warm" : "dark"}
                sizes="(min-width: 1024px) 20vw, 68vw"
                className="aspect-[3/4] w-full transition duration-700 hover:opacity-90 lg:aspect-auto lg:h-[clamp(320px,30vw,440px)]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
