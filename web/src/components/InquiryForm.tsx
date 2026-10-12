"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useId } from "react";
import { sendInquiry, type InquiryState } from "@/app/[locale]/actions";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { inquiryTypes, type InquiryField } from "@/lib/inquiry/schema";

type Copy = Dictionary["contact"];
type WorkOption = { slug: string; title: string };

const initialState: InquiryState = { status: "idle" };

const inputClass =
  "w-full border-0 border-b border-nezumi bg-transparent px-0 py-3 text-base text-sumi placeholder:text-nezumi focus:border-sumi focus:outline-none focus:ring-0 aria-[invalid=true]:border-shu";

export function InquiryForm({ copy, locale, works }: { copy: Copy; locale: Locale; works: WorkOption[] }) {
  const [state, action, pending] = useActionState(sendInquiry, initialState);
  const params = useSearchParams();
  const id = useId();

  // 作品ページ（?work=word-art）や特注ページ（?type=commission）から来たときの初期値
  const fromWork = params.get("work") ?? "";
  const fromType = params.get("type") ?? "";
  const v = state.values ?? {
    work: works.some((w) => w.slug === fromWork) ? fromWork : "",
    type: (inquiryTypes as readonly string[]).includes(fromType) ? fromType : fromWork ? "purchase" : "",
  };
  const has = (f: InquiryField) => state.fields?.includes(f) ?? false;
  const errId = (f: InquiryField) => `${id}-${f}-error`;
  const described = (f: InquiryField) => (has(f) ? errId(f) : undefined);

  if (state.status === "sent") {
    return (
      <div role="status" aria-live="polite" className="border border-line px-6 py-12 text-center">
        <p className="font-serif text-2xl font-light text-sumi">{copy.success}</p>
      </div>
    );
  }

  const fieldError = (f: InquiryField) =>
    has(f) ? (
      <p id={errId(f)} className="mt-2 text-sm text-shu">
        {copy.errors[f]}
      </p>
    ) : null;
  const optional = <span className="normal-case tracking-normal">({copy.optional})</span>;

  return (
    <form key={JSON.stringify(state)} action={action} noValidate className="space-y-9">
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset aria-describedby={described("type")}>
        <legend className="label">{copy.type}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {inquiryTypes.map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={v.type === t} className="peer sr-only" />
              <span className="inline-block border border-line px-4 py-2 text-sm text-usuzumi transition-colors peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi">
                {copy.types[t]}
              </span>
            </label>
          ))}
        </div>
        {fieldError("type")}
      </fieldset>

      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className="label block">
            {copy.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            defaultValue={v.email}
            aria-invalid={has("email")}
            aria-describedby={described("email")}
            className={inputClass}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={`${id}-name`} className="label block">
            {copy.name} {optional}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            maxLength={100}
            autoComplete="name"
            defaultValue={v.name}
            aria-invalid={has("name")}
            aria-describedby={described("name")}
            className={inputClass}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={`${id}-country`} className="label block">
            {copy.country} {optional}
          </label>
          <input
            id={`${id}-country`}
            name="country"
            type="text"
            maxLength={80}
            autoComplete="country-name"
            placeholder={copy.countryPlaceholder}
            defaultValue={v.country}
            aria-invalid={has("country")}
            aria-describedby={described("country")}
            className={inputClass}
          />
          {fieldError("country")}
        </div>
        <div>
          <label htmlFor={`${id}-work`} className="label block">
            {copy.work} {optional}
          </label>
          <select
            id={`${id}-work`}
            name="work"
            defaultValue={v.work ?? ""}
            aria-invalid={has("work")}
            aria-describedby={described("work")}
            className={inputClass}
          >
            <option value="">{copy.workNone}</option>
            {works.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.title}
              </option>
            ))}
          </select>
          {fieldError("work")}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="label block">
          {copy.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          maxLength={2000}
          placeholder={copy.messagePlaceholder}
          defaultValue={v.message}
          aria-invalid={has("message")}
          aria-describedby={described("message")}
          className={`${inputClass} resize-y`}
        />
        {fieldError("message")}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-usuzumi">
          <input
            type="checkbox"
            name="consent"
            value="yes"
            required
            defaultChecked={v.consent === "yes"}
            aria-invalid={has("consent")}
            aria-describedby={described("consent")}
            className="mt-1 size-4 shrink-0 accent-sumi"
          />
          <span>
            {copy.consentBefore}
            <Link href={`/${locale}/privacy`} className="text-sumi underline underline-offset-4" target="_blank">
              {copy.consentLink}
            </Link>
            {copy.consentAfter}
          </span>
        </label>
        {fieldError("consent")}
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-shu">
          {copy.errors.generic}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-sumi px-10 py-4 text-xs uppercase tracking-[0.24em] text-washi transition-opacity hover:opacity-85 disabled:opacity-60 sm:w-auto"
      >
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
