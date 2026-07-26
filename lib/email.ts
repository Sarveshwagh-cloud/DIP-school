import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// The "from" address. onboarding@resend.dev works with no domain setup,
// but can ONLY deliver to your Resend account email (set that as SCHOOL_EMAIL).
const FROM = process.env.EMAIL_FROM || "DIPS Website <onboarding@resend.dev>";
const TO = process.env.SCHOOL_EMAIL || "dips.umred@gmail.com";

export type EnquiryPayload = {
  kind: "Admission enquiry" | "Contact message";
  studentName?: string;
  parentName?: string;
  name?: string;
  email?: string;
  phone?: string;
  grade?: string;
  message?: string;
};

export async function sendEnquiryEmail(data: EnquiryPayload) {
  const rows: Array<[string, string | undefined]> = [
    ["Type", data.kind],
    ["Student's name", data.studentName],
    ["Parent's name", data.parentName],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Applying for", data.grade],
    ["Message", data.message],
  ];
  const filled = rows.filter(([, v]) => v && v.trim() !== "");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#2FA36B;color:#fff;padding:20px 24px;border-radius:16px 16px 0 0">
        <h2 style="margin:0;font-size:18px">🌱 New ${data.kind}</h2>
        <p style="margin:6px 0 0;opacity:.9;font-size:13px">via the DIPS Umred website</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none;border-radius:0 0 16px 16px">
        ${filled
          .map(
            ([k, v]) =>
              `<tr><td style="padding:12px 24px;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;width:130px;vertical-align:top">${k}</td><td style="padding:12px 24px;color:#22343A;font-size:14px;border-bottom:1px solid #f3f4f6">${(v || "").replace(/</g, "&lt;")}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");

  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email || undefined,
    subject: `${data.kind} — ${data.studentName || data.name || data.phone || "website"}`,
    html,
    text,
  });
}
