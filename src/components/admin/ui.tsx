"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-obsidian/15 bg-white px-3.5 py-2.5 text-sm text-obsidian outline-none transition placeholder:text-obsidian/35 focus:border-muted-gold focus:ring-2 focus:ring-champagne/40";

export const buttonClass = {
  primary: "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-obsidian px-4 text-sm font-medium text-champagne transition hover:bg-deep-brown disabled:opacity-50",
  secondary: "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-obsidian/20 bg-white px-4 text-sm text-obsidian transition hover:border-obsidian/50 disabled:opacity-50",
  danger: "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-800/30 bg-white px-4 text-sm text-red-800 transition hover:bg-red-50 disabled:opacity-50",
  ghost: "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm text-obsidian/70 transition hover:bg-obsidian/5 hover:text-obsidian disabled:opacity-30",
};

const PendingContext = createContext(false);

/**
 * Form bound to a server action that keeps what was typed (React's default
 * action forms clear their fields after every submit, even on errors).
 */
export function ActionForm({
  action,
  confirm,
  className,
  children,
}: {
  action: (fd: FormData) => void;
  confirm?: string;
  className?: string;
  children: ReactNode;
}) {
  const [pending, start] = useTransition();
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        const fd = new FormData(e.currentTarget);
        start(() => action(fd));
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
    </form>
  );
}

export function SubmitButton({ children, variant = "primary", className = "" }: { children: ReactNode; variant?: keyof typeof buttonClass; className?: string }) {
  const pending = useContext(PendingContext);
  return (
    <button type="submit" disabled={pending} className={`${buttonClass[variant]} ${className}`}>
      {pending ? "Saving…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: { ok?: string; error?: string } | undefined }) {
  if (!state) return null;
  return (
    <p role="status" className={`rounded-md px-3 py-2 text-sm ${state.error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
      {state.error ?? state.ok}
    </p>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-obsidian">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-obsidian/55">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

/** Runs a server action after an optional confirmation, with a pending state. */
export function ActionButton({
  action,
  confirm,
  children,
  variant = "ghost",
  title,
}: {
  action: () => Promise<unknown>;
  confirm?: string;
  children: ReactNode;
  variant?: keyof typeof buttonClass;
  title?: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        setError(false);
        start(async () => {
          try {
            await action();
          } catch {
            setError(true);
          }
        });
      }}
      className={`${buttonClass[variant]} ${error ? "text-red-800" : ""}`}
    >
      {pending ? "…" : children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-obsidian/10 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</div>;
}

export function PageTitle({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl text-obsidian">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-obsidian/60">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Badge({ tone, children }: { tone: "green" | "amber" | "grey"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
    amber: "bg-amber-50 text-amber-800 ring-amber-700/20",
    grey: "bg-obsidian/5 text-obsidian/60 ring-obsidian/10",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}
