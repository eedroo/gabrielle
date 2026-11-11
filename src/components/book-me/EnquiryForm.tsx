"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { EnquiryFormCopy } from "@/content/book-me";
import { contactLinks, site } from "@/content/site";
import type { SlotAvailability } from "@/lib/availability";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";

export type CityOption = {
  id: string;
  label: string;
  /** Inclusive YYYY-MM-DD range when the city is an upcoming trip */
  startDate: string;
  endDate: string;
  range: string;
};

type Field = "city" | "otherCity" | "date" | "time" | "duration" | "about" | "plans";

const OTHER = "other";
const STEP_FIELDS: Record<1 | 2, Field[]> = {
  1: ["city", "otherCity", "date", "time", "duration"],
  2: ["about", "plans"],
};

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
  "w-full border border-obsidian/15 bg-white/60 px-4 py-3 text-[0.9375rem] text-obsidian outline-none transition placeholder:text-obsidian/35 focus:border-muted-gold focus:bg-white/90 aria-[invalid=true]:border-red-800/60";

const pillClass =
  "flex min-h-10 cursor-pointer items-center justify-center border border-obsidian/15 px-2 text-sm transition hover:border-obsidian/40 peer-checked:border-obsidian peer-checked:bg-obsidian peer-checked:text-champagne peer-focus-visible:ring-2 peer-focus-visible:ring-muted-gold peer-disabled:cursor-not-allowed peer-disabled:text-obsidian/30 peer-disabled:line-through peer-disabled:hover:border-obsidian/15";

const buttonBase =
  "group inline-flex min-h-12 items-center justify-center gap-3 border px-6 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300";

function FieldLabel({ htmlFor, label, hint }: { htmlFor?: string; label: string; hint: string }) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} className="mb-2.5 block">
      <span className="eyebrow block text-obsidian">{label}</span>
      <span className="mt-1 block text-sm text-obsidian/60">{hint}</span>
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

/** Two-step enquiry: 1) when, 2) introduction, then sent as a prepared WhatsApp message. */
export function EnquiryForm({ copy, cities }: { copy: EnquiryFormCopy; cities: CityOption[] }) {
  const uid = useId();
  const fid = (f: string) => `${uid}-${f}`;
  const { availability: a, introduction: intro } = copy;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState({
    city: "",
    otherCity: "",
    date: "",
    time: "",
    duration: "",
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

  // Preselect the city when arriving from a destination (/book-me?city=<travel id>).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("city");
    if (id && cities.some((c) => c.id === id)) setValues((v) => ({ ...v, city: id }));
  }, [cities]);

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
    const when = [
      values.date && `on ${formatDate(values.date)}`,
      values.time && `at ${values.time}`,
      values.duration && (durationHours(values.duration) ? `for about ${values.duration}` : "with a flexible duration"),
    ]
      .filter(Boolean)
      .join(" ");
    const intro = cityName
      ? `I’m in ${cityName} and would love to meet you${when ? ` ${when}` : ""}.`
      : when && `I would love to meet you ${when}.`;
    return [
      `Hello ${site.name},`,
      intro,
      values.about.trim() && `A little about me:\n${values.about.trim()}`,
      values.plans.trim() && `What I have in mind:\n${values.plans.trim()}`,
      values.other.trim() && `Just to let you know:\n${values.other.trim()}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [values, cityName]);

  function validate(fields: Field[]): boolean {
    const missing = new Set<Field>();
    for (const f of fields) {
      if (f === "otherCity") {
        if (values.city === OTHER && !values.otherCity.trim()) missing.add(f);
      } else if (!values[f].trim()) {
        missing.add(f);
      }
    }
    setErrors(missing);
    const first = fields.find((f) => missing.has(f));
    if (first) {
      const el = document.getElementById(fid(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function goTo(next: 1 | 2) {
    setStep(next);
    setStatus(null);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function send() {
    if (!validate(STEP_FIELDS[2])) return;
    window.open(contactLinks.whatsapp(message), "_blank", "noopener");
    setStatus("Your enquiry has been prepared in WhatsApp. Please send it from there.");
  }

  const err = (f: Field) => errors.has(f);
  const aria = (f: Field) => ({
    id: fid(f),
    "aria-invalid": err(f) || undefined,
    "aria-describedby": err(f) ? `${fid(f)}-error` : undefined,
  });

  const selectedAvailable = slotMap && values.time ? slotMap.get(values.time) : undefined;
  const section = step === 1 ? a : intro;

  return (
    <form
      ref={formRef}
      id="enquiry"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1 && validate(STEP_FIELDS[1])) goTo(2);
        else if (step === 2) send();
      }}
      className="scroll-mt-28 border border-warm-ivory/20 bg-warm-ivory/95 p-6 text-obsidian shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-9"
    >
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-muted-gold">{section.eyebrow}</p>
        <p className="eyebrow shrink-0 text-obsidian/50">{copy.stepLabel.replace("{n}", String(step))}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5" aria-hidden>
        <span className="h-0.5 bg-obsidian" />
        <span className={`h-0.5 transition-colors ${step === 2 ? "bg-obsidian" : "bg-obsidian/15"}`} />
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="mt-7 font-display text-3xl leading-tight outline-none sm:text-4xl">
        {section.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-obsidian/70">{section.text}</p>

      {step === 1 && (
        <div className="mt-8 space-y-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={fid("city")} label={a.city.label} hint={a.city.hint} />
              <select
                {...aria("city")}
                value={values.city}
                onChange={(e) => set("city")(e.target.value)}
                className={`${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20fill='none'%20stroke='%2311100f'%20stroke-width='1.4'%3E%3Cpath%20d='M2%204l4%204%204-4'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
              >
                <option value="" disabled>
                  {a.city.placeholder}
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

          <fieldset aria-describedby={err("time") ? `${fid("time")}-error` : undefined}>
            <legend className="w-full">
              <FieldLabel label={a.time.label} hint={a.time.hint} />
            </legend>
            <div id={fid("time")} tabIndex={-1} className="grid grid-cols-4 gap-1.5 outline-none sm:grid-cols-7">
              {a.times.map((t) => (
                <label key={t} className="relative">
                  <input
                    type="radio"
                    name="time"
                    value={t}
                    checked={values.time === t}
                    disabled={slotMap?.get(t) === false}
                    onChange={() => set("time")(t)}
                    className="peer sr-only"
                  />
                  <span className={pillClass}>{t}</span>
                </label>
              ))}
            </div>
            <ErrorText id={`${fid("time")}-error`} show={err("time")} />
            <p className="mt-3 flex items-start gap-2 text-sm text-obsidian/70" aria-live="polite">
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

          <fieldset aria-describedby={err("duration") ? `${fid("duration")}-error` : undefined}>
            <legend className="w-full">
              <FieldLabel label={a.duration.label} hint={a.duration.hint} />
            </legend>
            <div id={fid("duration")} tabIndex={-1} className="grid grid-cols-2 gap-1.5 outline-none sm:grid-cols-4">
              {a.durations.map((d) => (
                <label key={d} className={`relative ${d.startsWith("Other") ? "col-span-2" : ""}`}>
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

          <p className="border-l-2 border-muted-gold/60 pl-4 text-sm italic text-obsidian/65">{a.note}</p>

          <div className="flex justify-end">
            <button type="submit" className={`${buttonBase} w-full border-obsidian bg-obsidian text-champagne hover:bg-deep-brown sm:w-auto`}>
              {copy.continue}
              <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 space-y-6">
          {(["about", "plans"] as const).map((f) => (
            <div key={f}>
              <FieldLabel htmlFor={fid(f)} label={intro[f].label} hint={intro[f].hint} />
              <textarea
                {...aria(f)}
                rows={3}
                value={values[f]}
                onChange={(e) => set(f)(e.target.value)}
                className={`${inputClass} resize-y`}
              />
              <ErrorText id={`${fid(f)}-error`} show={err(f)} />
            </div>
          ))}
          <div>
            <FieldLabel htmlFor={fid("other")} label={intro.other.label} hint={intro.other.hint} />
            <textarea
              id={fid("other")}
              rows={2}
              value={values.other}
              onChange={(e) => set("other")(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
          <p className="text-sm text-obsidian/60">{intro.privacy}</p>

          <details className="group border border-obsidian/10 bg-white/50">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="eyebrow text-obsidian">{intro.preview}</span>
              <span className="text-xl leading-none text-muted-gold transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <pre className="whitespace-pre-wrap border-t border-obsidian/10 px-5 py-4 font-body text-sm leading-relaxed text-obsidian/75">
              {message}
            </pre>
          </details>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => goTo(1)}
              className={`${buttonBase} border-obsidian/30 text-obsidian hover:border-obsidian`}
            >
              <ArrowRight width={14} height={14} className="rotate-180" />
              {copy.back}
            </button>
            <button type="submit" className={`${buttonBase} border-obsidian bg-obsidian text-champagne hover:bg-deep-brown`}>
              <WhatsApp width={18} height={18} />
              {intro.send}
            </button>
          </div>

          <div aria-live="polite" className="space-y-2 text-sm">
            {errors.size > 0 && <p className="text-red-800">Please complete the highlighted fields above.</p>}
            {errors.size === 0 && status && <p className="text-obsidian/75">{status}</p>}
          </div>
          <p className="border-t border-obsidian/10 pt-5 text-xs uppercase tracking-[0.16em] text-obsidian/55">{intro.confirmation}</p>
        </div>
      )}
    </form>
  );
}
