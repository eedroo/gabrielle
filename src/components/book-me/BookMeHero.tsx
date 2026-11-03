import { bookMe } from "@/content/book-me";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";

export function BookMeHero() {
  const { hero } = bookMe;
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden lg:min-h-[min(72vh,700px)] lg:items-center">
      <EditorialImage image={hero.image} priority className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/40" />
      <div className="container-site pb-16 pt-36 lg:py-24">
        <div className="max-w-xl" data-reveal>
          <p className="eyebrow text-champagne">{hero.eyebrow}</p>
          <h1 className="h1 mt-6 text-balance">{hero.title}</h1>
          <p className="mt-7 font-display text-2xl italic text-champagne">{hero.lead}</p>
          <Paragraphs items={hero.paragraphs} className="mt-4 max-w-md text-warm-ivory/80" />
          <Button href="#enquiry" className="mt-10">
            {bookMe.closing.primaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
