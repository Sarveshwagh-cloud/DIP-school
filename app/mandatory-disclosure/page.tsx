import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure | DIPS Umred",
  description:
    "Mandatory Public Disclosure of Deoraoji Itankar Public School, Umred, as required under the CBSE Affiliation Bye-Laws (Appendix IX) — general information, documents, results and infrastructure.",
};

/* ------------------------------------------------------------------ *
 *  SCHOOL DETAILS  —  Sarvesh, edit the values inside quotes here.
 *  Anything that still says "To be updated" needs a real value.
 *  (Or just send me the details and I'll fill them in for you.)
 * ------------------------------------------------------------------ */

const GENERAL: { label: string; value: string }[] = [
  { label: "Name of the school", value: "Deoraoji Itankar Public School, Umred" },
  { label: "Managed by (society/trust)", value: "Uday Mahila Seva Sanstha" },
  { label: "CBSE affiliation number", value: "1130888" },
  { label: "CBSE school code", value: "To be updated" },
  {
    label: "Complete address with pin code",
    value:
      "Near Hirwa Talaw, Budhwari Peth, Umred, Tah. Umred, Dist. Nagpur, Maharashtra — 441203",
  },
  { label: "Principal's name", value: "To be updated" },
  { label: "Principal's qualification", value: "To be updated" },
  { label: "School email", value: "dips.umred@gmail.com" },
  { label: "Contact number", value: "98227 27300" },
  { label: "Year of establishment", value: "2014" },
  { label: "Classes offered", value: "Std 1 to Std 10" },
];

/* Documents that open as PDF files.
 * Each file must be placed in the  public/disclosure  folder,
 * named EXACTLY as the "file" value below (all lowercase). */

const DOCS_LEGAL: { label: string; file: string }[] = [
  { label: "Affiliation letter (with latest extension)", file: "affiliation-letter.pdf" },
  { label: "Society / trust registration certificate", file: "society-registration.pdf" },
  { label: "No Objection Certificate (NOC)", file: "noc.pdf" },
  { label: "Recognition certificate (RTE Act, 2009)", file: "recognition-certificate.pdf" },
  { label: "Building safety certificate", file: "building-safety-certificate.pdf" },
  { label: "Fire safety certificate", file: "fire-safety-certificate.pdf" },
  { label: "Self-certification / DEO certificate", file: "self-certification.pdf" },
  { label: "Water, health & sanitation certificate", file: "water-health-sanitation-certificate.pdf" },
];

const DOCS_ACADEMIC: { label: string; file: string }[] = [
  { label: "Fee structure", file: "fee-structure.pdf" },
  { label: "Annual academic calendar", file: "academic-calendar.pdf" },
  { label: "School Management Committee (SMC) — members", file: "smc-members.pdf" },
  { label: "Parent–Teacher Association (PTA) — members", file: "pta-members.pdf" },
  { label: "Board results — last three years (Class X)", file: "board-results.pdf" },
];

const STAFF: { label: string; value: string }[] = [
  { label: "Principal", value: "1" },
  { label: "Total number of teachers", value: "To be updated" },
  { label: "PGT (Post Graduate Teachers)", value: "To be updated" },
  { label: "TGT (Trained Graduate Teachers)", value: "To be updated" },
  { label: "PRT (Primary Teachers)", value: "To be updated" },
  { label: "Teacher–section ratio", value: "To be updated" },
  { label: "Special educator", value: "To be updated" },
  { label: "Counsellor / wellness teacher", value: "To be updated" },
];

const INFRA: { label: string; value: string }[] = [
  { label: "Total campus area (sq. metres)", value: "To be updated" },
  { label: "Number of classrooms", value: "To be updated" },
  { label: "Size of each classroom (sq. metres)", value: "To be updated" },
  { label: "Number of laboratories (incl. computer lab)", value: "To be updated" },
  { label: "Size of each laboratory (sq. metres)", value: "To be updated" },
  { label: "Internet facility", value: "Yes" },
  { label: "Number of girls' toilets", value: "To be updated" },
  { label: "Number of boys' toilets", value: "To be updated" },
];

// Paste the full YouTube link of the school inspection video here.
const INSPECTION_VIDEO: string = "To be updated";

/* ------------------------------------------------------------------ *
 *  Small building blocks (no editing needed below)
 * ------------------------------------------------------------------ */

function SectionHeading({ tag, title }: { tag: string; title: string }) {
  return (
    <header className="mb-8 text-center">
      <p className="eyebrow text-meadow mb-2">{tag}</p>
      <h2 className="font-display font-semibold text-2xl md:text-3xl text-ink">{title}</h2>
    </header>
  );
}

function InfoCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="reveal bg-white rounded-3xl p-6 md:p-8 border-2 border-meadow/10 max-w-3xl mx-auto">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3.5 border-b border-meadow/10 last:border-0"
        >
          <span className="font-bold text-ink text-[15px]">{row.label}</span>
          <span className="text-ink/70 sm:text-right">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function DocLink({ label, file }: { label: string; file: string }) {
  return (
    <a
      href={`/disclosure/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-white border-2 border-meadow/10 rounded-2xl p-4 hover:border-meadow/40 hover:shadow-sm transition"
    >
      <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-blossom-light text-blossom-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </span>
      <span className="flex-1 font-semibold text-ink text-[15px] leading-snug">{label}</span>
      <span className="shrink-0 text-meadow font-bold text-sm flex items-center gap-1">
        View
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */

export default function MandatoryDisclosurePage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Mandatory Public Disclosure"
        subtitle="The information below is published as required under the CBSE Affiliation Bye-Laws (Appendix IX)."
      />

      {/* Section A — General information */}
      <section id="general" className="max-w-6xl mx-auto px-5 py-16">
        <SectionHeading tag="Section A" title="General information" />
        <InfoCard rows={GENERAL} />
      </section>

      {/* Section B — Documents & information */}
      <section id="documents" className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <SectionHeading tag="Section B" title="Documents & information" />
          <div className="reveal grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {DOCS_LEGAL.map((d) => (
              <DocLink key={d.file} label={d.label} file={d.file} />
            ))}
          </div>
          <p className="text-center text-sm text-ink/50 mt-6">Each document opens as a PDF in a new tab.</p>
        </div>
      </section>

      {/* Section C — Result & academics */}
      <section id="academics" className="max-w-6xl mx-auto px-5 py-16">
        <SectionHeading tag="Section C" title="Result & academics" />
        <div className="reveal grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {DOCS_ACADEMIC.map((d) => (
            <DocLink key={d.file} label={d.label} file={d.file} />
          ))}
        </div>
      </section>

      {/* Section D — Staff (teaching) */}
      <section id="staff" className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <SectionHeading tag="Section D" title="Staff (teaching)" />
          <InfoCard rows={STAFF} />
        </div>
      </section>

      {/* Section E — School infrastructure */}
      <section id="infrastructure" className="max-w-6xl mx-auto px-5 py-16">
        <SectionHeading tag="Section E" title="School infrastructure" />
        <InfoCard rows={INFRA} />
        <div className="reveal max-w-3xl mx-auto mt-6 text-center">
          {INSPECTION_VIDEO === "To be updated" ? (
            <p className="text-sm text-ink/50">Link to the school inspection video will be added here.</p>
          ) : (
            <a
              href={INSPECTION_VIDEO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-meadow text-white font-bold px-6 py-3 rounded-full hover:brightness-95 transition"
            >
              Watch the school inspection video
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          )}
        </div>
      </section>

      {/* Closing note */}
      <section className="bg-ink text-white/80">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <p className="text-lg text-white">Need any of these documents or have a question?</p>
          <p className="mt-2 text-white/70">
            Please contact the school office at{" "}
            <a href="tel:9822727300" className="text-sun font-semibold hover:underline">98227 27300</a>{" "}
            or{" "}
            <a href="mailto:dips.umred@gmail.com" className="text-sun font-semibold hover:underline">dips.umred@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
