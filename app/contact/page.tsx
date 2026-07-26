import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us | DIPS Umred",
  description: "Get in touch with Deoraoji Itankar Public School, Umred — phone, email, address, map and a contact form.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="We'd love to hear from you"
        subtitle="Questions about admissions, a visit, or anything else? Reach us any way you like."
      />

      <section className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-12">
        <div className="reveal space-y-5">
          <div className="flex items-start gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-meadow-light text-2xl shrink-0">📍</span><div><div className="font-bold text-ink mb-1">Address</div><p className="text-ink/70 leading-relaxed">Near Hirwa Talaw, Budhwari Peth, Umred,<br />Tah. Umred, Dist. Nagpur (MS) — 441203</p></div></div>
          <div className="flex items-start gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-sky-light text-2xl shrink-0">📞</span><div><div className="font-bold text-ink mb-1">Phone</div><a href="tel:9822727300" className="text-meadow font-semibold hover:underline">98227 27300</a></div></div>
          <div className="flex items-start gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-sun-light text-2xl shrink-0">✉️</span><div><div className="font-bold text-ink mb-1">Email</div><a href="mailto:dips.umred@gmail.com" className="text-meadow font-semibold hover:underline">dips.umred@gmail.com</a></div></div>
          <div className="flex items-start gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-blossom-light text-2xl shrink-0">💬</span><div><div className="font-bold text-ink mb-1">Social</div><a href="https://www.facebook.com/DIPSumred/" className="text-meadow font-semibold hover:underline">facebook.com/DIPSumred</a></div></div>

          <div className="rounded-3xl overflow-hidden border border-meadow/10 mt-4">
            <iframe
              title="DIPS Umred location"
              src="https://www.google.com/maps?q=Deoraoji%20Itankar%20Public%20School%20Umred&output=embed"
              width="100%"
              height="260"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="reveal bg-white rounded-[2rem] p-7 md:p-9 shadow-xl border border-meadow/10">
          <h2 className="font-semibold text-2xl text-ink mb-1">Send a message</h2>
          <p className="text-ink/60 mb-6">We&apos;ll get back to you as soon as we can.</p>
          <EnquiryForm variant="contact" />
        </div>
      </section>
    </>
  );
}
