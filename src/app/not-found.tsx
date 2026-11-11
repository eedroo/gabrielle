import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col">
      <div className="container-site py-6">
        <Link href="/" className="font-display text-2xl uppercase tracking-[0.28em]">
          {site.name}
        </Link>
      </div>
      <section className="section flex flex-1 items-center">
        <div className="container-site max-w-xl text-center">
          <p className="eyebrow text-champagne">Coming soon</p>
          <h1 className="h2 mt-5">This page is being prepared.</h1>
          <p className="body-copy mt-6 text-warm-ivory/70">In the meantime, you are welcome to return home or send a request.</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/" variant="outline-light" arrow={false}>
              Home
            </Button>
            <Button href="/book-me">Book Me</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
