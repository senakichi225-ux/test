"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/[locale]/actions";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { interests, roles, type WaitlistField } from "@/lib/waitlist/schema";

type Copy = Dictionary["waitlist"];

const initialState: WaitlistState = { status: "idle" };

const inputClass =
  "w-full border-0 border-b border-nezumi bg-transparent px-0 py-3 text-base text-sumi placeholder:text-nezumi focus:border-sumi focus:outline-none focus:ring-0 aria-[invalid=true]:border-shu";
const labelClass = "label block";

export function WaitlistForm({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [state, action, pending] = useActionState(joinWaitlist, initialState);
  const id = useId();
  const v = state.values ?? {};
  const has = (f: WaitlistField) => state.fields?.includes(f) ?? false;
  const errId = (f: WaitlistField) => `${id}-${f}-error`;
  const done = state.status === "created" || state.status === "updated";

  if (done) {
    return (
      <div role="status" aria-live="polite" className="border border-line px-6 py-12 text-center">
        <p className="font-serif text-2xl text-sumi">{state.status === "updated" ? copy.updated : copy.success}</p>
      </div>
    );
  }

  const fieldError = (f: WaitlistField) =>
    has(f) ? (
      <p id={errId(f)} className="mt-2 text-sm text-shu">
        {copy.errors[f]}
      </p>
    ) : null;

  return (
    // 入力エラーのあと、返ってきた値で入力欄を作り直す（key で再マウント）
    <form key={JSON.stringify(state)} action={action} noValidate className="space-y-8">
      <input type="hidden" name="locale" value={locale} />

      {/* ボット対策（人には見えない） */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={labelClass}>
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
          aria-describedby={has("email") ? errId("email") : undefined}
          className={inputClass}
        />
        {fieldError("email")}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-role`} className={labelClass}>
            {copy.role}
          </label>
          <select
            id={`${id}-role`}
            name="role"
            required
            defaultValue={v.role ?? ""}
            aria-invalid={has("role")}
            aria-describedby={has("role") ? errId("role") : undefined}
            className={inputClass}
          >
            <option value="" disabled>
              {copy.rolePlaceholder}
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {copy.roleOptions[r]}
              </option>
            ))}
          </select>
          {fieldError("role")}
        </div>

        <div>
          <label htmlFor={`${id}-country`} className={labelClass}>
            {copy.country} <span className="normal-case tracking-normal">({copy.optional})</span>
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
            aria-describedby={has("country") ? errId("country") : undefined}
            className={inputClass}
          />
          {fieldError("country")}
        </div>
      </div>

      <fieldset aria-describedby={has("interest") ? errId("interest") : undefined}>
        <legend className={labelClass}>
          {copy.interest} <span className="normal-case tracking-normal">({copy.optional})</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {interests.map((it) => (
            <label key={it} className="cursor-pointer">
              <input
                type="radio"
                name="interest"
                value={it}
                defaultChecked={v.interest === it}
                className="peer sr-only"
              />
              <span className="inline-block border border-line px-4 py-2 text-sm text-usuzumi transition-colors peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi">
                {copy.interestOptions[it]}
              </span>
            </label>
          ))}
        </div>
        {fieldError("interest")}
      </fieldset>

      <div>
        <label htmlFor={`${id}-message`} className={labelClass}>
          {copy.message} <span className="normal-case tracking-normal">({copy.optional})</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          maxLength={1000}
          placeholder={copy.messagePlaceholder}
          defaultValue={v.message}
          aria-invalid={has("message")}
          aria-describedby={has("message") ? errId("message") : undefined}
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
            aria-describedby={has("consent") ? errId("consent") : undefined}
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
