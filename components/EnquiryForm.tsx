"use client";

import { useActionState } from "react";
import { submitEnquiry, type FormState } from "@/app/actions";

const grades = [
  "Std 1", "Std 2", "Std 3", "Std 4", "Std 5",
  "Std 6", "Std 7", "Std 8", "Std 9", "Std 10",
];

export default function EnquiryForm({
  variant = "admission",
}: {
  variant?: "admission" | "contact";
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitEnquiry,
    null
  );

  if (state?.ok) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="font-display text-2xl text-meadow mb-2 font-semibold">Thank you!</h3>
        <p className="text-ink/70">
          We&apos;ve received your {variant === "admission" ? "enquiry" : "message"} and our team will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="variant" value={variant} />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {variant === "admission" ? (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="lbl" htmlFor="studentName">Student&apos;s name</label>
              <input className="fld" id="studentName" name="studentName" type="text" placeholder="Aarav Sharma" required />
            </div>
            <div>
              <label className="lbl" htmlFor="parentName">Parent&apos;s name</label>
              <input className="fld" id="parentName" name="parentName" type="text" placeholder="Priya Sharma" required />
            </div>
            <div>
              <label className="lbl" htmlFor="phone">Phone number</label>
              <input className="fld" id="phone" name="phone" type="tel" placeholder="98765 43210" required />
            </div>
            <div>
              <label className="lbl" htmlFor="grade">Applying for</label>
              <select className="fld" id="grade" name="grade" defaultValue="">
                <option value="">Select a class</option>
                {grades.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="lbl" htmlFor="message">Your message (optional)</label>
            <textarea className="fld" id="message" name="message" rows={3} placeholder="Anything you'd like to ask us?" />
          </div>
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="lbl" htmlFor="name">Your name</label>
              <input className="fld" id="name" name="name" type="text" placeholder="Priya Sharma" required />
            </div>
            <div>
              <label className="lbl" htmlFor="phone">Phone number</label>
              <input className="fld" id="phone" name="phone" type="tel" placeholder="98765 43210" />
            </div>
            <div className="sm:col-span-2">
              <label className="lbl" htmlFor="email">Email</label>
              <input className="fld" id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div className="mt-4">
            <label className="lbl" htmlFor="message">Message</label>
            <textarea className="fld" id="message" name="message" rows={4} placeholder="How can we help?" required />
          </div>
        </>
      )}

      {state?.error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-meadow text-white font-bold text-lg px-7 py-3.5 rounded-full hover:bg-meadow-dark transition shadow-lg shadow-meadow/25 disabled:opacity-60"
      >
        {pending ? "Sending…" : variant === "admission" ? "Send enquiry" : "Send message"}
        {!pending && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink/40">We&apos;ll only use your details to respond to your enquiry.</p>
    </form>
  );
}
