import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About Us | DIPS Umred",
  description: "The story of Deoraoji Itankar Public School, Umred — a CBSE school growing since 2014, with our mission, vision and messages from our leadership.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Our little garden, grown with care"
        subtitle="From a single classroom in 2014 to a full-bloom garden of nearly a thousand children — this is the DIPS story."
      />

      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="reveal space-y-4 text-lg text-ink/75 leading-relaxed">
          <p>Deoraoji Itankar Public School is a CBSE school run by <strong className="text-ink">Uday Mahila Seva Sanstha</strong>, set in the lush, pollution-free green heart of Umred with a single motive — to make Umred an educational hub.</p>
          <p>The school opened its doors in 2014 with just a Std&nbsp;1 class. Over the span of ten years it has made its mark across the city and flourished as a full-bloom garden, today offering classes from Std&nbsp;1 to Std&nbsp;10 to nearly a thousand students.</p>
          <p>It is blessed with a fully trained, caring staff and every facility that adds a cherry to the cake. With smart classrooms and hi-tech facilities, DIPS offers a perfect blend of technology and warmth — creating a stress-free environment where children genuinely love to learn.</p>
        </div>
      </section>

      <section className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-6">
          <div className="reveal bg-white rounded-3xl p-8"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-sky text-white text-2xl mb-4">🎯</div><h2 className="font-semibold text-2xl text-ink mb-2">Our mission</h2><p className="text-ink/70 leading-relaxed">To provide a stimulating, purposeful, cheerful, safe and secure environment, enabling all children to develop academically and socially.</p></div>
          <div className="reveal bg-white rounded-3xl p-8"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-sun text-ink text-2xl mb-4">🌟</div><h2 className="font-semibold text-2xl text-ink mb-2">Our vision</h2><p className="text-ink/70 leading-relaxed">To contribute to the formation of an advanced India through the education we imbibe in every young mind.</p></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-8">
        <div className="reveal bg-meadow rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="flex items-center gap-4 mb-5 relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 bg-cover bg-center" style={{ backgroundImage: "url('https://www.dipsumred.org/wp-content/uploads/2025/11/Director.jpeg')" }} />
            <div><div className="font-semibold text-lg">Director&apos;s message</div><div className="text-white/70 text-sm font-semibold">DIPS Umred</div></div>
          </div>
          <p className="text-lg leading-relaxed text-white/95 relative">&ldquo;Our aim is to help every child realise their own unique potential, in the light of the modern pedagogy shaping classrooms around the world.&rdquo;</p>
        </div>
        <div className="reveal bg-white border-2 border-meadow/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-meadow-light bg-cover bg-center" style={{ backgroundImage: "url('https://www.dipsumred.org/wp-content/uploads/2025/11/Principal.jpeg')" }} />
            <div><div className="font-semibold text-lg text-ink">Principal&apos;s message</div><div className="text-ink/55 text-sm font-semibold">Welcoming every family</div></div>
          </div>
          <p className="text-lg leading-relaxed text-ink/75">&ldquo;Education is the most powerful weapon which you can use to change the world. We&apos;re delighted to walk that journey with our students, parents and guardians — every single day.&rdquo;</p>
          <p className="mt-3 text-sm font-bold text-meadow">— after Nelson Mandela</p>
        </div>
      </section>
    </>
  );
}
