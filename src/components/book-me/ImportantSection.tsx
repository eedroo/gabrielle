import { bookMe } from "@/content/book-me";
import { Divider } from "@/components/ui/Divider";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ImportantSection() {
  const { important } = bookMe;
  return (
    <section className="section bg-deep-brown">
      <div className="container-site max-w-3xl text-center" data-reveal>
        <SectionHeading eyebrow={important.eyebrow} title={important.title} align="center" />
        <Divider className="mx-auto mt-10 max-w-40 text-champagne" />
        <p className="mt-10 font-display text-2xl text-warm-ivory lg:text-3xl">{important.paragraphs[0]}</p>
        <Paragraphs items={important.paragraphs.slice(1)} className="mx-auto mt-6 max-w-xl text-warm-ivory/70" />
        <p className="mt-8 font-display text-xl italic text-champagne">{important.closing}</p>
      </div>
    </section>
  );
}
