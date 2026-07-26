"use server";

import { sendEnquiryEmail } from "@/lib/email";

export type FormState = { ok: boolean; error?: string } | null;

export async function submitEnquiry(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot: real users leave this empty; bots tend to fill it.
  if (((formData.get("company") as string) || "").trim()) {
    return { ok: true };
  }

  const get = (k: string) => ((formData.get(k) as string | null) || "").trim();
  const variant = get("variant") || "admission";
  const phone = get("phone");
  const email = get("email");
  const message = get("message");
  const digits = phone.replace(/\D/g, "");

  try {
    if (variant === "admission") {
      const studentName = get("studentName");
      const parentName = get("parentName");
      const grade = get("grade");
      if (!studentName || !parentName || !phone) {
        return { ok: false, error: "Please fill in the student's name, your name and a phone number." };
      }
      if (digits.length < 7) {
        return { ok: false, error: "Please enter a valid phone number." };
      }
      await sendEnquiryEmail({ kind: "Admission enquiry", studentName, parentName, phone, grade, message });
      return { ok: true };
    }

    // contact
    const name = get("name");
    if (!name || (!phone && !email)) {
      return { ok: false, error: "Please add your name and a phone number or email." };
    }
    await sendEnquiryEmail({ kind: "Contact message", name, email, phone, message });
    return { ok: true };
  } catch (err) {
    console.error("Enquiry send failed:", err);
    return { ok: false, error: "Something went wrong sending your message. Please try again, or call us on 98227 27300." };
  }
}
