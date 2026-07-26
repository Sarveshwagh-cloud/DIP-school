import Link from "next/link";
import CountUp from "@/components/CountUp";
import EnquiryForm from "@/components/EnquiryForm";

const facilities = [
  { icon: "💻", bg: "bg-sky-light", title: "Smart digital classrooms", desc: "Audio-visual learning in every room." },
  { icon: "🔬", bg: "bg-blossom-light", title: "Science & computer labs", desc: "Hands-on discovery and coding." },
  { icon: "⚽", bg: "bg-sun-light", title: "Big playground & sports", desc: "Indoor and outdoor games." },
  { icon: "🎵", bg: "bg-meadow-light", title: "Music, dance & culture", desc: "Keyboard, harmonium and drums." },
  { icon: "🧘", bg: "bg-sky-light", title: "Yoga & meditation", desc: "Calm minds, every morning." },
  { icon: "📚", bg: "bg-blossom-light", title: "Library & e-learning", desc: "Books plus digital resources." },
  { icon: "🛡️", bg: "bg-sun-light", title: "Safe campus", desc: "CCTV-monitored throughout." },
  { icon: "🚌", bg: "bg-meadow-light", title: "Bus & transport", desc: "Safe pick-up and drop." },
  { icon: "❤️", bg: "bg-blossom-light", title: "Parent counselling", desc: "We grow together with you." },
];

const pillars = [
  { icon: "📖", bg: "bg-sky-light", title: "Academic excellence", desc: "Strong CBSE foundations with dedicated, caring support for every learner." },
  { icon: "🧠", bg: "bg-blossom-light", title: "Curiosity & thinking", desc: "Questions, problem-solving and real-world learning — never just rote memorising." },
  { icon: "🎨", bg: "bg-sun-light", title: "Creativity & skills", desc: "Art, music, dance and hands-on making that help each child discover their talent." },
  { icon: "🌿", bg: "bg-meadow-light", title: "Health & well-being", desc: "Yoga, sport and a balanced routine for happy, healthy bodies and calm minds." },
  { icon: "🤝", bg: "bg-sky-light", title: "Values & community", desc: "Empathy, teamwork and a sense of responsibility towards a better world." },
  { icon: "🛡️", bg: "bg-blossom-light", title: "Safe & caring", desc: "A secure, CCTV-monitored campus where every child feels right at home." },
];

const gallery = [
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7473.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7435.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7630.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2019/04/05-3.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2019/04/IMG-20190410-WA0055.jpg",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-sky-light blob2 opacity-70" />
        <div className="absolute top-24 right-0 w-64 h-64 bg-blossom-light blob opacity-60" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-sun-light blob2 opacity-60" />

        <div className="relative max-w-6xl mx-auto px-5 pt-14 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-meadow mb-4">CBSE · Umred · Since 2014</p>
            <a href="#enquiry" className="inline-flex items-center gap-2 bg-blossom-light text-blossom-ink font-bold text-sm px-4 py-1.5 rounded-full mb-5 hover:brightness-95 transition">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blossom opacity-60" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blossom" /></span>
              Admissions open for 2026–27
            </a>
            <h1 className="font-semibold text-ink leading-[1.05]" style={{ fontSize: "clamp(2.4rem,6vw,4.4rem)" }}>
              A happy place to<br />
              <span className="relative inline-block text-meadow">grow, bloom
                <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none"><path d="M2 9C40 3 90 3 128 7s60 5 70 1" fill="none" stroke="#FFC53D" strokeWidth="5" strokeLinecap="round" /></svg>
              </span>
              <span className="text-sky"> &amp; learn.</span>
            </h1>
            <p className="mt-6 text-lg text-ink/70 max-w-xl leading-relaxed">
              Deoraoji Itankar Public School nurtures every child from preschool through Std&nbsp;10 — with caring teachers, smart classrooms, and plenty of room to play, in the green heart of Umred.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquiry" className="inline-flex items-center gap-2 bg-meadow text-white font-bold text-lg px-7 py-3.5 rounded-full hover:bg-meadow-dark transition shadow-lg shadow-meadow/25">
                Enquire for admission
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <Link href="/gallery" className="inline-flex items-center gap-2 bg-white text-ink font-bold text-lg px-7 py-3.5 rounded-full border-2 border-ink/10 hover:border-meadow hover:text-meadow transition">
                Take a look around
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div><div className="font-display font-semibold text-2xl text-ink">2014</div><div className="text-sm text-ink/55 font-semibold">Established</div></div>
              <div className="w-px bg-ink/10 hidden sm:block" />
              <div><div className="font-display font-semibold text-2xl text-ink">1000+</div><div className="text-sm text-ink/55 font-semibold">Happy students</div></div>
              <div className="w-px bg-ink/10 hidden sm:block" />
              <div><div className="font-display font-semibold text-2xl text-ink">Std 1–10</div><div className="text-sm text-ink/55 font-semibold">+ Preschool</div></div>
            </div>
          </div>

          <div className="relative">
            <div className="blob overflow-hidden aspect-[4/5] bg-meadow-light bg-cover bg-center shadow-2xl shadow-meadow/20 rotate-1" style={{ backgroundImage: "url('https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_9986.jpg')" }} />
            <div className="float-slow absolute -top-6 -left-6 w-20 h-20 grid place-items-center rounded-3xl bg-sun shadow-lg text-3xl rotate-[-8deg]">🌻</div>
            <div className="float-med absolute top-8 -right-4 w-16 h-16 grid place-items-center rounded-2xl bg-white shadow-lg text-2xl">📚</div>
            <div className="float-fast absolute bottom-10 -left-8 w-16 h-16 grid place-items-center rounded-2xl bg-blossom shadow-lg text-2xl">🎨</div>
            <div className="float-med absolute -bottom-5 right-8 flex items-center gap-2 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-meadow text-white text-lg">✓</span>
              <span className="text-sm font-bold text-ink leading-tight">Safe &amp; caring<br /><span className="text-ink/50 font-semibold">campus</span></span>
            </div>
          </div>
        </div>

        <svg className="block w-full -mb-1" viewBox="0 0 1440 90" preserveAspectRatio="none" style={{ height: "70px" }}><path d="M0 60C240 20 480 20 720 45s480 55 720 20v25H0z" fill="#E7F6EE" /></svg>
      </section>

      {/* Stat counters */}
      <section className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="reveal"><div className="font-display font-semibold text-4xl md:text-5xl text-meadow"><CountUp target={10} suffix="+" /></div><div className="mt-1 font-semibold text-ink/70">Years of joyful learning</div></div>
          <div className="reveal"><div className="font-display font-semibold text-4xl md:text-5xl text-sky"><CountUp target={1000} suffix="+" /></div><div className="mt-1 font-semibold text-ink/70">Happy students</div></div>
          <div className="reveal"><div className="font-display font-semibold text-4xl md:text-5xl text-blossom"><CountUp target={13} /></div><div className="mt-1 font-semibold text-ink/70">Grades, Nursery to 10</div></div>
          <div className="reveal"><div className="font-display font-semibold text-4xl md:text-5xl text-sun-ink"><CountUp target={20} suffix="+" /></div><div className="mt-1 font-semibold text-ink/70">Activities, sports &amp; clubs</div></div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <p className="eyebrow text-blossom mb-3">Our little garden</p>
          <h2 className="font-semibold text-ink leading-tight mb-5" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Where every child is planted with care</h2>
          <p className="text-ink/70 text-lg leading-relaxed mb-4">Founded in 2014 and run by Uday Mahila Seva Sanstha, Deoraoji Itankar Public School began with a single Std&nbsp;1 class. In just ten years it has flourished into a full-bloom garden — now home to nearly a thousand students from Std&nbsp;1 to Std&nbsp;10.</p>
          <p className="text-ink/70 text-lg leading-relaxed mb-6">A perfect blend of technology and warmth: smart classes, hi-tech facilities, and a fully trained, caring staff who make learning feel like play.</p>
          <Link href="/academics" className="inline-flex items-center gap-2 font-bold text-meadow hover:gap-3 transition-all">Explore our academics
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="reveal bg-sky-light rounded-3xl p-7"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-sky text-white text-2xl mb-4">🎯</div><h3 className="font-semibold text-xl text-ink mb-2">Our mission</h3><p className="text-ink/70 leading-relaxed">To provide a stimulating, purposeful, cheerful, safe and secure environment, enabling all children to develop academically and socially.</p></div>
          <div className="reveal bg-sun-light rounded-3xl p-7 sm:mt-8"><div className="w-12 h-12 grid place-items-center rounded-2xl bg-sun text-ink text-2xl mb-4">🌟</div><h3 className="font-semibold text-xl text-ink mb-2">Our vision</h3><p className="text-ink/70 leading-relaxed">To contribute to the formation of an advanced India through the education we imbibe in every young mind.</p></div>
        </div>
      </section>

      {/* Holistic approach */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="eyebrow text-meadow mb-3">The whole child</p>
          <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>More than marks — a holistic way to grow</h2>
          <p className="mt-3 text-ink/60 text-lg">We nurture head, heart and hands together, so every child grows up curious, kind and confident.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="reveal bg-cream rounded-3xl p-7 border border-meadow/10 hover:-translate-y-1 transition">
              <div className={`w-14 h-14 grid place-items-center rounded-2xl ${p.bg} text-3xl mb-4`}>{p.icon}</div>
              <h3 className="font-semibold text-xl text-ink mb-2">{p.title}</h3>
              <p className="text-ink/65 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="bg-cream">
        <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "60px" }}><path d="M0 40C360 80 720 0 1080 30s300 30 360 20V0H0z" fill="#E7F6EE" /></svg>
        <div className="bg-meadow-light">
          <div className="max-w-6xl mx-auto px-5 py-20">
            <div className="text-center max-w-2xl mx-auto mb-14 reveal">
              <p className="eyebrow text-meadow mb-3">From tiny tots to teens</p>
              <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Academics that grow with your child</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-7">
              <div className="reveal bg-white rounded-3xl p-8 border-b-4 border-blossom hover:-translate-y-1.5 transition shadow-sm"><div className="w-16 h-16 grid place-items-center rounded-2xl bg-blossom-light text-4xl mb-5">🧸</div><span className="eyebrow text-blossom-ink">Kids Pyramid</span><h3 className="font-semibold text-2xl text-ink mt-1 mb-3">Preschool &amp; Nursery</h3><p className="text-ink/70 leading-relaxed">Play-way learning in natural surroundings, puppet theatre, and classrooms designed just for little ones taking their very first steps.</p></div>
              <div className="reveal bg-white rounded-3xl p-8 border-b-4 border-sun hover:-translate-y-1.5 transition shadow-sm"><div className="w-16 h-16 grid place-items-center rounded-2xl bg-sun-light text-4xl mb-5">✏️</div><span className="eyebrow text-sun-ink">Primary</span><h3 className="font-semibold text-2xl text-ink mt-1 mb-3">Std 1 to 5</h3><p className="text-ink/70 leading-relaxed">Strong foundations in reading, numbers and curiosity — built the joyful way, with activity-led lessons and lots of encouragement.</p></div>
              <div className="reveal bg-white rounded-3xl p-8 border-b-4 border-sky hover:-translate-y-1.5 transition shadow-sm"><div className="w-16 h-16 grid place-items-center rounded-2xl bg-sky-light text-4xl mb-5">🔬</div><span className="eyebrow text-sky">Secondary</span><h3 className="font-semibold text-2xl text-ink mt-1 mb-3">Std 6 to 10</h3><p className="text-ink/70 leading-relaxed">CBSE academics powered by smart classes and well-equipped labs — nurturing confident, capable, well-rounded young people.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why DIPS */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="eyebrow text-sky mb-3">Everything under one roof</p>
          <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Why families choose DIPS</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {facilities.map((f) => (
            <div key={f.title} className="reveal flex items-start gap-4 bg-cream rounded-2xl p-5 border border-meadow/10">
              <span className={`grid place-items-center w-12 h-12 rounded-xl ${f.bg} text-2xl shrink-0`}>{f.icon}</span>
              <div><h3 className="font-semibold text-ink">{f.title}</h3><p className="text-sm text-ink/60 mt-1">{f.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section className="bg-sky-light">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="max-w-2xl mb-12 reveal">
            <p className="eyebrow text-sky mb-3">Beyond the classroom</p>
            <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Learning that lights them up</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            <div className="reveal bg-white rounded-3xl overflow-hidden shadow-sm"><div className="h-40 bg-blossom-light grid place-items-center text-6xl">🎭</div><div className="p-6"><h3 className="font-semibold text-xl text-ink mb-2">Music, dance &amp; culture</h3><p className="text-ink/70">Two dedicated music teachers, a model activity room, and instruments from keyboard to drums.</p></div></div>
            <div className="reveal bg-white rounded-3xl overflow-hidden shadow-sm"><div className="h-40 bg-meadow-light grid place-items-center text-6xl">🧘‍♀️</div><div className="p-6"><h3 className="font-semibold text-xl text-ink mb-2">Yoga &amp; meditation</h3><p className="text-ink/70">A calming daily practice after assembly, guided by a trained teacher, building focus and balance.</p></div></div>
            <div className="reveal bg-white rounded-3xl overflow-hidden shadow-sm"><div className="h-40 bg-sun-light grid place-items-center text-6xl">🔭</div><div className="p-6"><h3 className="font-semibold text-xl text-ink mb-2">Science &amp; discovery</h3><p className="text-ink/70">Charts, models and projects that turn everyday curiosity into real understanding.</p></div></div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 reveal">
            <div>
              <p className="eyebrow text-sky mb-3">Campus buzz</p>
              <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Latest from our garden</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            <article className="reveal bg-white rounded-3xl overflow-hidden shadow-sm hover:-translate-y-1 transition"><div className="h-44 bg-blossom-light grid place-items-center text-6xl">🧸</div><div className="p-6"><span className="inline-block bg-blossom-light text-blossom-ink text-xs font-bold px-3 py-1 rounded-full mb-3">Preschool</span><h3 className="font-semibold text-lg text-ink mb-2 leading-snug">Kids Pyramid preschool is now open</h3><p className="text-ink/65 text-sm leading-relaxed">A joyful new early-years wing with play-way learning, puppet theatre and classrooms built just for little ones.</p></div></article>
            <article className="reveal bg-white rounded-3xl overflow-hidden shadow-sm hover:-translate-y-1 transition"><div className="h-44 bg-sun-light grid place-items-center text-6xl">📝</div><div className="p-6"><span className="inline-block bg-sun-light text-sun-ink text-xs font-bold px-3 py-1 rounded-full mb-3">Admissions</span><h3 className="font-semibold text-lg text-ink mb-2 leading-snug">Nursery admissions open for 2026–27</h3><p className="text-ink/65 text-sm leading-relaxed">Seats are filling up for our youngest learners. Enquire today to book a campus visit and meet our teachers.</p></div></article>
            <article className="reveal bg-white rounded-3xl overflow-hidden shadow-sm hover:-translate-y-1 transition"><div className="h-44 bg-sky-light grid place-items-center text-6xl">🎶</div><div className="p-6"><span className="inline-block bg-sky-light text-sky text-xs font-bold px-3 py-1 rounded-full mb-3">Campus life</span><h3 className="font-semibold text-lg text-ink mb-2 leading-snug">Music, yoga &amp; science in full swing</h3><p className="text-ink/65 text-sm leading-relaxed">From morning meditation to hands-on science projects, there&apos;s always something happening at DIPS.</p></div></article>
          </div>
        </div>
      </section>

      {/* Leaders */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid md:grid-cols-2 gap-8">
        <div className="reveal bg-meadow rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="flex items-center gap-4 mb-5 relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 bg-cover bg-center" style={{ backgroundImage: "url('https://www.dipsumred.org/wp-content/uploads/2025/11/Director.jpeg')" }} />
            <div><div className="font-semibold text-lg">Director&apos;s message</div><div className="text-white/70 text-sm font-semibold">Deoraoji Itankar Public School</div></div>
          </div>
          <p className="text-lg leading-relaxed text-white/95 relative">&ldquo;Our aim is to help every child realise their own unique potential, in the light of the modern pedagogy shaping classrooms around the world.&rdquo;</p>
        </div>
        <div className="reveal bg-white border-2 border-meadow/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-meadow-light bg-cover bg-center" style={{ backgroundImage: "url('https://www.dipsumred.org/wp-content/uploads/2025/11/Principal.jpeg')" }} />
            <div><div className="font-semibold text-lg text-ink">Principal&apos;s message</div><div className="text-ink/55 text-sm font-semibold">Welcoming every family</div></div>
          </div>
          <p className="text-lg leading-relaxed text-ink/75">&ldquo;Education is the most powerful weapon which you can use to change the world. We&apos;re delighted to walk that journey with our students, parents and guardians — every single day.&rdquo;</p>
          <p className="mt-3 text-sm font-bold text-meadow">— after Nelson Mandela</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sky-light">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <p className="eyebrow text-sky mb-3">Happy families</p>
            <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>What parents say about DIPS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            <figure className="reveal bg-white rounded-3xl p-7 shadow-sm"><div className="font-display text-blossom text-5xl leading-none mb-2">&ldquo;</div><blockquote className="text-ink/75 leading-relaxed">My daughter runs into school every morning. The teachers are so warm, and I&apos;ve watched her grow in confidence month after month.</blockquote><figcaption className="mt-5 flex items-center gap-3"><span className="grid place-items-center w-11 h-11 rounded-full bg-meadow text-white font-display font-semibold">P</span><span><span className="block font-semibold text-ink">Parent of a Std 2 student</span><span className="block text-sm text-ink/50">DIPS Umred</span></span></figcaption></figure>
            <figure className="reveal bg-white rounded-3xl p-7 shadow-sm"><div className="font-display text-sky text-5xl leading-none mb-2">&ldquo;</div><blockquote className="text-ink/75 leading-relaxed">The smart classes and activities keep my son genuinely excited about learning. Safety and communication are excellent too.</blockquote><figcaption className="mt-5 flex items-center gap-3"><span className="grid place-items-center w-11 h-11 rounded-full bg-sky text-white font-display font-semibold">R</span><span><span className="block font-semibold text-ink">Parent of a Std 6 student</span><span className="block text-sm text-ink/50">DIPS Umred</span></span></figcaption></figure>
            <figure className="reveal bg-white rounded-3xl p-7 shadow-sm"><div className="font-display text-sun-ink text-5xl leading-none mb-2">&ldquo;</div><blockquote className="text-ink/75 leading-relaxed">We chose DIPS for the caring, family feel — and it has more than lived up to it. It really does feel like a garden where children bloom.</blockquote><figcaption className="mt-5 flex items-center gap-3"><span className="grid place-items-center w-11 h-11 rounded-full bg-blossom text-white font-display font-semibold">S</span><span><span className="block font-semibold text-ink">Parent of a Nursery student</span><span className="block text-sm text-ink/50">DIPS Umred</span></span></figcaption></figure>
          </div>
          <p className="text-center text-ink/45 text-sm mt-8">Sample testimonials — to be replaced with real parent quotes.</p>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 reveal">
            <div>
              <p className="eyebrow text-blossom mb-3">Life at DIPS</p>
              <h2 className="font-semibold text-ink leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Moments from our garden</h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 font-bold text-meadow hover:gap-3 transition-all">See full gallery
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <div key={src} className={`rounded-3xl overflow-hidden aspect-square bg-meadow-light bg-cover bg-center ${i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1" : ""}`} style={{ backgroundImage: `url('${src}')` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="bg-meadow-light scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="eyebrow text-meadow mb-3">Begin your journey</p>
            <h2 className="font-semibold text-ink leading-tight mb-4" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)" }}>Enquire about admission</h2>
            <p className="text-ink/70 text-lg leading-relaxed mb-7">Tell us a little about your child and we&apos;ll get in touch with the next steps — or simply call us. We&apos;d love to welcome you for a visit around our green campus.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">📞</span><div><div className="font-bold text-ink">Call us</div><a href="tel:9822727300" className="text-meadow font-semibold hover:underline">98227 27300</a></div></li>
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">✉️</span><div><div className="font-bold text-ink">Email us</div><a href="mailto:dips.umred@gmail.com" className="text-meadow font-semibold hover:underline">dips.umred@gmail.com</a></div></li>
              <li className="flex items-center gap-4"><span className="grid place-items-center w-12 h-12 rounded-2xl bg-white text-2xl shadow-sm">📍</span><div><div className="font-bold text-ink">Visit us</div><span className="text-ink/60">Budhwari Peth, Umred, Nagpur</span></div></li>
            </ul>
          </div>
          <div className="reveal bg-white rounded-[2rem] p-7 md:p-9 shadow-xl border border-meadow/10">
            <EnquiryForm variant="admission" />
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-meadow text-white px-8 py-14 md:px-16 text-center">
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 blob" />
          <div className="absolute -right-8 -top-12 w-40 h-40 bg-sun/25 blob2" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-sun text-ink font-bold text-sm px-4 py-1.5 rounded-full mb-5">🎉 Now open · Nursery to Std 10</span>
            <h2 className="font-semibold leading-tight mb-4" style={{ fontSize: "clamp(1.9rem,4.5vw,3rem)" }}>Admissions are open. Let&apos;s help your child bloom.</h2>
            <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8">Come visit our green campus in the heart of Umred, meet our caring teachers, and see the joyful DIPS difference for yourself.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="tel:9822727300" className="inline-flex items-center gap-2 bg-white text-meadow font-bold text-lg px-7 py-3.5 rounded-full hover:bg-cream transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call 98227 27300
              </a>
              <a href="#enquiry" className="inline-flex items-center gap-2 bg-sun text-ink font-bold text-lg px-7 py-3.5 rounded-full hover:brightness-95 transition">Enquire online</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
