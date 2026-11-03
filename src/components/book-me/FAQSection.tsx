import { bookMe } from "@/content/book-me";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQSection() {
  const { faq } = bookMe;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <section id="faq" className="section scroll-mt-20 bg-warm-ivory text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} tone="dark" />
        <div className="border-t border-obsidian/10">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-obsidian/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl sm:text-2xl [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <span className="text-2xl leading-none text-muted-gold transition duration-300 group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="body-copy max-w-2xl pb-7 text-obsidian/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
