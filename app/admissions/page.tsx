import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Admissions | DIPS Umred",
  description: "Admissions are open at DIPS Umred for 2026–27, from Std 1 to Std 10. See our simple admission process and send an enquiry.",
};

const steps = [
  { n: "1", title: "Enquire", desc: "Send the form below or call us. Share a little about your child." },
  { n: "2", title: "Visit us", desc: "Come see the campus, meet our teachers and ask us anything." },
  { n: "3", title: "Submit documents", desc: "Complete the form with the required documents and details." },
  { n: "4", title: "Welcome!", desc: "Confirm the seat and join the DIPS family. Let the journey begin." },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Admissions open for 2026–27"
        subtitle="We're welcoming new children from Std 1 right through to Std 10. Here's how to begin."
      />

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="reveal bg-sun-light rounded-3xl px-8 py-7 flex flex-wrap items-center gap-4 justify-between mb-14">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎉</span>
            <div>
              <div className="font-semibold text-xl text-ink">Now open · Std 1 to Std 10</div>
              <div className="text-ink/70">Seats are filling up — enquire early to book a campus visit.</div>
            </div>
          </div>
          <a href="tel:9822727300" className="inline-flex items-center gap-2 bg-meadow text-white font-bold px-6 py-3 rounded-full hover:bg-meadow-dark transition">Call 98227 27300</a>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <p className="eyebrow text-meadow mb-3">Simple &amp; friendly</p>
          <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.7rem,4vw,2.4rem)" }}>Our admission process</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="reveal bg-white rounded-3xl p-7 border border-meadow/10"><div className="w-12 h-12 grid place-items-center rounded-full bg-meadow text-white font-display font-semibold text-xl mb-4">{s.n}</div><h3 className="font-semibold text-lg text-ink mb-2">{s.title}</h3><p className="text-ink/65 leading-relaxed">{s.desc}</p></div>
          ))}
        </div>
      </section>

      <section id="enquiry" className="bg-meadow-light scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="eyebrow text-meadow mb-3">Begin your journey</p>
            <h2 className="font-semibold text-ink leading-tight mb-4" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Send us an enquiry</h2>
            <p className="text-ink/70 text-lg leading-relaxed mb-7">Tell us a little about your child and we&apos;ll get in touch with the next steps — or simply call or email us. We&apos;d love to welcome you for a visit.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">📞</span><div><div className="font-bold text-ink">Call us</div><a href="tel:9822727300" className="text-meadow font-semibold hover:underline">98227 27300</a></div></li>
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">✉️</span><div><div className="font-bold text-ink">Email us</div><a href="mailto:dips.umred@gmail.com" className="text-meadow font-semibold hover:underline">dips.umred@gmail.com</a></div></li>
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">📍</span><div><div className="font-bold text-ink">Visit us</div><span className="text-ink/60">Near Hirwa Talaw, Budhwari Peth, Umred</span></div></li>
            </ul>
          </div>
          <div className="reveal bg-white rounded-[2rem] p-7 md:p-9 shadow-xl border border-meadow/10">
            <EnquiryForm variant="admission" />
          </div>
        </div>
      </section>
    </>
  );
}
