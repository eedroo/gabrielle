"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { EnquiryFormCopy } from "@/content/book-me";
import { contactLinks, site } from "@/content/site";
import type { SlotAvailability } from "@/lib/availability";
import { Divider } from "@/components/ui/Divider";
import { ArrowRight, Mail, Telegram, WhatsApp } from "@/components/ui/Icons";

export type CityOption = {
  id: string;
  label: string;
  /** Inclusive YYYY-MM-DD range when the city is an upcoming trip */
  startDate: string;
  endDate: string;
  range: string;
};

type Channel = "whatsapp" | "telegram" | "email";
type Field = "city" | "otherCity" | "date" | "time" | "duration" | "name" | "email" | "about" | "plans";

const OTHER = "other";

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const durationHours = (label: string) => {
  const n = Number.parseInt(label, 10);
  return Number.isFinite(n) ? n : null;
};

const inputClass =
  "w-full border border-obsidian/15 bg-white/50 px-4 py-3.5 text-[0.9375rem] text-obsidian outline-none transition placeholder:text-obsidian/35 focus:border-muted-gold focus:bg-white/80 aria-[invalid=true]:border-red-800/60";

const pillClass =
  "flex min-h-11 cursor-pointer items-center justify-center border border-obsidian/15 px-3 text-sm transition hover:border-obsidian/40 peer-checked:border-obsidian peer-checked:bg-obsidian peer-checked:text-champagne peer-focus-visible:ring-2 peer-focus-visible:ring-muted-gold peer-disabled:cursor-not-allowed peer-disabled:text-obsidian/30 peer-disabled:line-through peer-disabled:hover:border-obsidian/15";

function FieldLabel({ htmlFor, label, hint, optional }: { htmlFor?: string; label: string; hint: string; optional?: string }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} className="mb-3 block">
      <span className="eyebrow block text-obsidian">{label}</span>
      <span className="mt-1.5 block text-sm text-obsidian/60">
        {hint}
        {optional && <span className="text-obsidian/45"> {optional}</span>}
      </span>
    </Tag>
  );
}

function ErrorText({ id, show }: { id: string; show: boolean }) {
  if (!show) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-800">
      Please complete this field.
    </p>
  );
}

function Step({ id, eyebrow, title, text, children }: { id?: string; eyebrow: string; title: string; text: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 py-14 first:pt-0 lg:py-16">
      <p className="eyebrow text-muted-gold">{eyebrow}</p>
      <h2 className="h2 mt-4 text-balance">{title}</h2>
      <p className="body-copy mt-5 max-w-xl text-obsidian/70">{text}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function EnquiryForm({ copy, cities }: { copy: EnquiryFormCopy; cities: CityOption[] }) {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const { availability: a, introduction: intro, channels: ch } = copy;

  const [values, setValues] = useState({
    city: "",
    otherCity: "",
    date: "",
    time: "",
    duration: "",
    name: "",
    email: "",
    about: "",
    plans: "",
    other: "",
  });
  const [errors, setErrors] = useState<Set<Field>>(new Set());
  const [slots, setSlots] = useState<SlotAvailability[] | null | "loading">(null);
  const [status, setStatus] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e.has(key as Field)) return e;
      const next = new Set(e);
      next.delete(key as Field);
      return next;
    });
  };

  const trip = cities.find((c) => c.id === values.city);
  const today = todayIso();
  const minDate = trip && trip.startDate > today ? trip.startDate : today;
  const maxDate = trip?.endDate;

  // Keep the chosen date inside the selected trip.
  useEffect(() => {
    if (values.date && (values.date < minDate || (maxDate && values.date > maxDate))) {
      setValues((v) => ({ ...v, date: "", time: "" }));
    }
  }, [minDate, maxDate, values.date]);

  // Ask the server (Google Calendar) which times are free for the date and duration.
  useEffect(() => {
    if (!values.date) {
      setSlots(null);
      return;
    }
    const controller = new AbortController();
    setSlots("loading");
    const params = new URLSearchParams({ date: values.date });
    const hours = durationHours(values.duration);
    if (hours) params.set("duration", String(hours));
    fetch(`/api/availability?${params}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { slots: null }))
      .then((data: { slots: SlotAvailability[] | null }) => setSlots(data.slots))
      .catch((err) => {
        if (err.name !== "AbortError") setSlots(null);
      });
    return () => controller.abort();
  }, [values.date, values.duration]);

  const slotMap = useMemo(() => (Array.isArray(slots) ? new Map(slots.map((s) => [s.time, s.available])) : null), [slots]);

  // A time that became unavailable can no longer be requested.
  useEffect(() => {
    if (slotMap && values.time && slotMap.get(values.time) === false) {
      setValues((v) => ({ ...v, time: "" }));
    }
  }, [slotMap, values.time]);

  const cityName = values.city === OTHER ? values.otherCity.trim() : trip?.label ?? "";

  const message = useMemo(() => {
    const lines = [
      `Hello ${site.name},`,
      "",
      values.name.trim() && `My name is ${values.name.trim()}.`,
      "",
      cityName && `City: ${cityName}`,
      values.date && `Date: ${formatDate(values.date)}`,
      values.time && `Time: ${values.time}`,
      values.duration && `Duration: ${values.duration}`,
      "",
      values.about.trim() && `A little about me:\n${values.about.trim()}`,
      "",
      values.plans.trim() && `My plans:\n${values.plans.trim()}`,
      "",
      values.other.trim() && `Anything else:\n${values.other.trim()}`,
      values.email.trim() && `\nYou can reach me at ${values.email.trim()}.`,
    ];
    return lines
      .filter((l): l is string => typeof l === "string")
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }, [values, cityName]);

  function validate(channel: Channel): boolean {
    const missing = new Set<Field>();
    if (!values.city) missing.add("city");
    if (values.city === OTHER && !values.otherCity.trim()) missing.add("otherCity");
    if (!values.date) missing.add("date");
    if (!values.time) missing.add("time");
    if (!values.duration) missing.add("duration");
    if (!values.name.trim()) missing.add("name");
    if (!values.about.trim()) missing.add("about");
    if (!values.plans.trim()) missing.add("plans");
    const email = values.email.trim();
    if ((channel === "email" && !email) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) missing.add("email");

    setErrors(missing);
    if (missing.size > 0) {
      const order: Field[] = ["city", "otherCity", "date", "time", "duration", "name", "email", "about", "plans"];
      const first = order.find((f) => missing.has(f))!;
      const el = document.getElementById(fid(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      setStatus(null);
      return false;
    }
    return true;
  }

  function send(channel: Channel) {
    if (!validate(channel)) return;
    if (channel === "whatsapp") {
      window.open(contactLinks.whatsapp(message), "_blank", "noopener");
      setStatus("Your enquiry has been prepared in WhatsApp. Please send it from there.");
    } else if (channel === "telegram") {
      // Telegram cannot prefill a message to a person, so the text is copied for pasting.
      window.open(contactLinks.telegram(), "_blank", "noopener");
      navigator.clipboard?.writeText(message).then(
        () => setStatus("Your enquiry has been copied. Paste it into the Telegram chat to send it."),
        () => setStatus("Telegram has been opened. Copy your enquiry from the preview above and paste it into the chat."),
      );
    } else {
      window.location.href = contactLinks.email(`Enquiry from ${values.name.trim()}`, message);
      setStatus("Your enquiry has been prepared in your email app. Please send it from there.");
    }
  }

  const err = (f: Field) => errors.has(f);
  const aria = (f: Field) => ({
    id: fid(f),
    "aria-invalid": err(f) || undefined,
    "aria-describedby": err(f) ? `${fid(f)}-error` : undefined,
  });

  const selectedAvailable = slotMap && values.time ? slotMap.get(values.time) : undefined;

  return (
    <form id="enquiry" noValidate onSubmit={(e) => e.preventDefault()} className="scroll-mt-28 divide-y divide-obsidian/10">
      {/* 03 — Availability */}
      <Step eyebrow={a.eyebrow} title={a.title} text={a.text}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fid("city")} label={a.city.label} hint={a.city.hint} />
            <select
              {...aria("city")}
              value={values.city}
              onChange={(e) => set("city")(e.target.value)}
              className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20fill='none'%20stroke='%2311100f'%20stroke-width='1.4'%3E%3Cpath%20d='M2%204l4%204%204-4'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
            >
              <option value="" disabled>
                Select a city
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} · {c.range}
                </option>
              ))}
              <option value={OTHER}>{a.city.other}</option>
            </select>
            <ErrorText id={`${fid("city")}-error`} show={err("city")} />
            {values.city === OTHER && (
              <>
                <input
                  {...aria("otherCity")}
                  aria-label={a.city.otherPlaceholder}
                  value={values.otherCity}
                  onChange={(e) => set("otherCity")(e.target.value)}
                  placeholder={a.city.otherPlaceholder}
                  autoComplete="address-level2"
                  className={`${inputClass} mt-3`}
                />
                <ErrorText id={`${fid("otherCity")}-error`} show={err("otherCity")} />
              </>
            )}
          </div>

          <div>
            <FieldLabel htmlFor={fid("date")} label={a.date.label} hint={a.date.hint} />
            <input
              {...aria("date")}
              type="date"
              value={values.date}
              min={minDate}
              max={maxDate}
              onChange={(e) => set("date")(e.target.value)}
              className={inputClass}
            />
            {trip && <p className="mt-2 text-sm text-obsidian/55">In {trip.label}: {trip.range}</p>}
            <ErrorText id={`${fid("date")}-error`} show={err("date")} />
          </div>
        </div>

        <fieldset className="mt-10" aria-describedby={err("time") ? `${fid("time")}-error` : undefined}>
          <legend className="w-full">
            <FieldLabel label={a.time.label} hint={a.time.hint} />
          </legend>
          <div id={fid("time")} tabIndex={-1} className="grid grid-cols-4 gap-2 outline-none sm:grid-cols-7">
            {a.times.map((t) => {
              const unavailable = slotMap?.get(t) === false;
              return (
                <label key={t} className="relative">
                  <input
                    type="radio"
                    name="time"
                    value={t}
                    checked={values.time === t}
                    disabled={unavailable}
                    onChange={() => set("time")(t)}
                    className="peer sr-only"
                  />
                  <span className={pillClass}>{t}</span>
                </label>
              );
            })}
          </div>
          <ErrorText id={`${fid("time")}-error`} show={err("time")} />
          <p className="mt-4 flex items-start gap-2 text-sm text-obsidian/70" aria-live="polite">
            {values.date && slots === "loading" && "Checking availability…"}
            {values.date && slots === null && a.states.none}
            {selectedAvailable === true && (
              <>
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-700" aria-hidden /> {a.states.available}
              </>
            )}
            {selectedAvailable === false && (
              <>
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-800" aria-hidden /> {a.states.unavailable}
              </>
            )}
          </p>
        </fieldset>

        <fieldset className="mt-10" aria-describedby={err("duration") ? `${fid("duration")}-error` : undefined}>
          <legend className="w-full">
            <FieldLabel label={a.duration.label} hint={a.duration.hint} />
          </legend>
          <div id={fid("duration")} tabIndex={-1} className="grid grid-cols-2 gap-2 outline-none sm:grid-cols-4 lg:grid-cols-7">
            {a.durations.map((d) => (
              <label key={d} className="relative">
                <input
                  type="radio"
                  name="duration"
                  value={d}
                  checked={values.duration === d}
                  onChange={() => set("duration")(d)}
                  className="peer sr-only"
                />
                <span className={`${pillClass} text-center`}>{d}</span>
              </label>
            ))}
          </div>
          <ErrorText id={`${fid("duration")}-error`} show={err("duration")} />
        </fieldset>

        <p className="mt-10 border-l-2 border-muted-gold/60 pl-4 text-sm italic text-obsidian/65">{a.note}</p>
      </Step>

      {/* 04 — Your introduction */}
      <Step eyebrow={intro.eyebrow} title={intro.title} text={intro.text}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fid("name")} label={intro.name.label} hint={intro.name.hint} />
            <input
              {...aria("name")}
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              autoComplete="name"
              className={inputClass}
            />
            <ErrorText id={`${fid("name")}-error`} show={err("name")} />
          </div>
          <div>
            <FieldLabel htmlFor={fid("email")} label={intro.email.label} hint={intro.email.hint} optional={intro.email.requiredForEmail} />
            <input
              {...aria("email")}
              type="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              autoComplete="email"
              inputMode="email"
              className={inputClass}
            />
            {err("email") && (
              <p id={`${fid("email")}-error`} className="mt-2 text-sm text-red-800">
                Please enter a valid email address.
              </p>
            )}
          </div>
          {(["about", "plans"] as const).map((f) => (
            <div key={f} className="md:col-span-2">
              <FieldLabel htmlFor={fid(f)} label={intro[f].label} hint={intro[f].hint} />
              <textarea
                {...aria(f)}
                rows={4}
                value={values[f]}
                onChange={(e) => set(f)(e.target.value)}
                className={`${inputClass} resize-y`}
              />
              <ErrorText id={`${fid(f)}-error`} show={err(f)} />
            </div>
          ))}
          <div className="md:col-span-2">
            <FieldLabel htmlFor={fid("other")} label={intro.other.label} hint={intro.other.hint} />
            <textarea
              id={fid("other")}
              rows={3}
              value={values.other}
              onChange={(e) => set("other")(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
        <p className="mt-8 text-sm text-obsidian/60">{intro.privacy}</p>
      </Step>

      {/* 05 — Choose how to get in touch */}
      <Step id="contact" eyebrow={ch.eyebrow} title={ch.title} text={ch.text}>
        <details className="group border border-obsidian/10 bg-white/40">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm">
            <span className="eyebrow text-obsidian">Preview your enquiry</span>
            <span className="text-xl leading-none text-muted-gold transition group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <pre className="whitespace-pre-wrap border-t border-obsidian/10 px-5 py-4 font-body text-sm leading-relaxed text-obsidian/75">
            {message}
          </pre>
        </details>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {(
            [
              { key: "whatsapp", Icon: WhatsApp, primary: true },
              { key: "telegram", Icon: Telegram, primary: false },
              { key: "email", Icon: Mail, primary: false },
            ] as const
          ).map(({ key, Icon, primary }) => (
            <div key={key} className="flex flex-col border border-obsidian/10 bg-white/40 p-6">
              <Icon width={22} height={22} className="text-muted-gold" />
              <h3 className="mt-4 font-display text-2xl">{ch[key].title}</h3>
              <p className="mt-2 flex-1 text-sm text-obsidian/65">{ch[key].text}</p>
              <button
                type="button"
                onClick={() => send(key)}
                className={`group mt-6 inline-flex min-h-12 items-center justify-center gap-3 border px-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                  primary
                    ? "border-obsidian bg-obsidian text-champagne hover:bg-deep-brown"
                    : "border-obsidian/70 text-obsidian hover:bg-obsidian hover:text-warm-ivory"
                }`}
              >
                {ch[key].cta}
                <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        <div aria-live="polite" className="mt-6 min-h-6 text-sm">
          {errors.size > 0 && <p className="text-red-800">Please complete the highlighted fields above.</p>}
          {errors.size === 0 && status && <p className="text-obsidian/75">{status}</p>}
        </div>

        <Divider className="mt-10 text-muted-gold" />
      </Step>
    </form>
  );
}
