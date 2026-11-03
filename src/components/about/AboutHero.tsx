import { about } from "@/content/about";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Paragraphs } from "@/components/ui/Paragraphs";

export function AboutHero() {
  const { hero } = about;
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden lg:min-h-[min(80vh,780px)] lg:items-center">
      <EditorialImage image={hero.image} priority className="absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/40" />

      <div className="container-site pb-16 pt-40 lg:py-28">
        <div className="max-w-xl" data-reveal>
          <p className="eyebrow text-champagne">{hero.eyebrow}</p>
          <h1 className="h1 mt-6 text-balance">{hero.title}</h1>
          <Paragraphs items={hero.paragraphs} className="mt-7 max-w-md text-warm-ivory/80" />
          <p className="mt-5 font-display text-2xl italic text-champagne">{hero.signature}</p>
          <Button href={hero.cta.href} variant="outline-light" arrow={false} className="mt-10">
            {hero.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
