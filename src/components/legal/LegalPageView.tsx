import type { LegalBlock, LegalPage } from "@/content/legal";

const linkify = (text: string) =>
  text.split(/(geral@onda\.work)/).map((part, i) =>
    part === "geral@onda.work" ? (
      <a key={i} href="mailto:geral@onda.work" className="underline decoration-muted-gold underline-offset-4 hover:text-muted-gold">
        {part}
      </a>
    ) : (
      part
    ),
  );

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{linkify(block)}</p>;
  if ("list" in block)
    return (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-muted-gold">
        {block.list.map((item) => (
          <li key={item}>{linkify(item)}</li>
        ))}
      </ul>
    );
  return (
    <p>
      {block.lines.map((line) => (
        <span key={line} className="block">
          {linkify(line)}
        </span>
      ))}
    </p>
  );
}

/** Simple, readable legal document page. */
export function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <article className="bg-warm-ivory text-obsidian">
      <header className="bg-obsidian py-20 text-warm-ivory lg:py-24">
        <div className="container-site max-w-3xl">
          <p className="eyebrow text-champagne">Legal</p>
          <h1 className="h2 mt-5">{page.title}</h1>
          <p className="mt-5 text-sm text-soft-taupe">Last updated: {page.updated}</p>
        </div>
      </header>
      <div className="container-site max-w-3xl py-16 lg:py-20">
        <ol className="space-y-12">
          {page.sections.map((section, i) => (
            <li key={section.title}>
              <h2 className="font-display text-3xl">
                <span className="mr-3 text-muted-gold">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="body-copy mt-5 space-y-4 text-obsidian/80">
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
