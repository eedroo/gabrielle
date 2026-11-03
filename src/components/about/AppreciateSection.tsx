import { about } from "@/content/about";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AppreciateSection() {
  const { appreciate } = about;
  return (
    <section className="section bg-warm-ivory text-obsidian">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div data-reveal>
          <SectionHeading eyebrow={appreciate.eyebrow} title={appreciate.title} tone="dark" />
          <p className="body-copy mt-7 text-obsidian/75">{appreciate.intro}</p>
          <EditorialImage
            image={appreciate.image}
            tone="warm"
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="mt-10 hidden aspect-[4/5] w-full lg:block"
          />
        </div>
        <ol className="divide-y divide-obsidian/10 border-y border-obsidian/10 lg:self-center">
          {appreciate.items.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4rem_1fr]" data-reveal>
              <span className="font-display text-xl text-muted-gold" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl">{item.title}</h3>
                <p className="body-copy mt-2 text-obsidian/70">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
