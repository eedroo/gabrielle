import type { ReactNode } from "react";

export function AuthCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-obsidian px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-3xl uppercase tracking-[0.3em] text-warm-ivory">Gabrielle</p>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-soft-taupe">Backoffice</p>
        <div className="mt-10 rounded-xl bg-warm-ivory p-7 text-obsidian shadow-2xl">
          <h1 className="font-display text-3xl">{title}</h1>
          {description && <p className="mt-2 text-sm text-obsidian/60">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
