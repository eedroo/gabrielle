import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section flex min-h-[70vh] items-center">
      <div className="container-site max-w-xl text-center">
        <p className="eyebrow text-champagne">Coming soon</p>
        <h1 className="h2 mt-5">This page is being prepared.</h1>
        <p className="body-copy mt-6 text-warm-ivory/70">In the meantime, you are welcome to return home or send a request.</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/" variant="outline-light" arrow={false}>Home</Button>
          <Button href="/book-me">Book Me</Button>
        </div>
      </div>
    </section>
  );
}
