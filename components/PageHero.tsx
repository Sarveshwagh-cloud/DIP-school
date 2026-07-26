export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-meadow-light">
      <div className="absolute -top-10 -right-10 w-56 h-56 bg-sun-light blob2 opacity-70" />
      <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-blossom-light blob opacity-60" />
      <div className="relative max-w-6xl mx-auto px-5 py-16 md:py-20 text-center">
        <p className="eyebrow text-meadow mb-3">{eyebrow}</p>
        <h1 className="font-display font-semibold text-ink leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-ink/70 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      <svg className="block w-full -mb-1" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "60px" }}>
        <path d="M0 50C240 20 480 20 720 40s480 45 720 15v25H0z" fill="#FFFDF7" />
      </svg>
    </section>
  );
}
