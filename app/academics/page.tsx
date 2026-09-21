import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Academics | DIPS Umred",
  description: "CBSE academics at DIPS Umred — from Std 1 through Std 10, with smart classrooms, well-equipped labs and an activity-led approach.",
};

const approach = [
  { icon: "🧩", title: "Activity-led learning", desc: "Concepts brought alive through doing, making and playing — not rote memorising." },
  { icon: "💻", title: "Smart classrooms", desc: "Audio-visual lessons in every room make even tricky topics easy to picture." },
  { icon: "🔬", title: "Labs & discovery", desc: "Science and computer labs where curiosity turns into real understanding." },
  { icon: "🧘", title: "Balance & well-being", desc: "Yoga, sport and the arts woven through the week for happy, healthy learners." },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Learning that grows with your child"
        subtitle="A CBSE journey from Std 1 right through to Std 10 — joyful, hands-on, and built on strong foundations."
      />

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-7">
          <div className="reveal bg-white rounded-3xl p-8 border-b-4 border-sun shadow-sm"><div className="w-16 h-16 grid place-items-center rounded-2xl bg-sun-light text-4xl mb-5">✏️</div><span className="eyebrow text-sun-ink">Primary</span><h2 className="font-semibold text-2xl text-ink mt-1 mb-3">Std 1 to 5</h2><p className="text-ink/70 leading-relaxed">Strong foundations in reading, numbers and curiosity — built the joyful way, with activity-led lessons, plenty of encouragement and lots of room to explore.</p></div>
          <div className="reveal bg-white rounded-3xl p-8 border-b-4 border-sky shadow-sm"><div className="w-16 h-16 grid place-items-center rounded-2xl bg-sky-light text-4xl mb-5">🔬</div><span className="eyebrow text-sky">Secondary</span><h2 className="font-semibold text-2xl text-ink mt-1 mb-3">Std 6 to 10</h2><p className="text-ink/70 leading-relaxed">CBSE academics powered by smart classes and well-equipped labs — nurturing confident, capable and well-rounded young people ready for what comes next.</p></div>
        </div>
      </section>

      <section className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <p className="eyebrow text-meadow mb-3">How we teach</p>
            <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.7rem,4vw,2.4rem)" }}>Our approach to learning</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((a) => (
              <div key={a.title} className="reveal bg-white rounded-3xl p-7 text-center"><div className="w-14 h-14 grid place-items-center rounded-2xl bg-meadow-light text-3xl mb-4 mx-auto">{a.icon}</div><h3 className="font-semibold text-lg text-ink mb-2">{a.title}</h3><p className="text-ink/65 text-sm leading-relaxed">{a.desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 py-16 text-center">
        <div className="reveal">
          <h2 className="font-semibold text-ink leading-tight mb-4" style={{ fontSize: "clamp(1.7rem,4vw,2.4rem)" }}>Ready to join the DIPS family?</h2>
          <p className="text-ink/70 text-lg mb-7">Admissions are open from Std&nbsp;1 to Std&nbsp;10 for 2026–27.</p>
          <Link href="/admissions#enquiry" className="inline-flex items-center gap-2 bg-meadow text-white font-bold text-lg px-7 py-3.5 rounded-full hover:bg-meadow-dark transition shadow-lg shadow-meadow/25">
            Enquire about admission
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
