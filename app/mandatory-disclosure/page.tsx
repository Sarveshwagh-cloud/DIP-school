import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure | DIPS Umred",
  description:
    "Mandatory Public Disclosure of Deoraoji Itankar Public School, Umred — school information, infrastructure and statutory documents published as required under the CBSE Affiliation Bye-Laws.",
};

const GENERAL: { label: string; value: string }[] = [
  { label: "Name of the school", value: "Deoraoji Itankar Public School, Umred" },
  { label: "Managed by (society/trust)", value: "Uday Mahila Seva Sanstha" },
  { label: "CBSE affiliation number", value: "1130888" },
  { label: "CBSE school code", value: "30867" },
  { label: "UDISE code", value: "27091119434" },
  {
    label: "Complete address with pin code",
    value:
      "Near Hirwa Talaw, Budhwari Peth, Umred, Tah. Umred, Dist. Nagpur, Maharashtra — 441203",
  },
  { label: "Principal's name", value: "Pallavi Shekhar Wankhede" },
  { label: "School email", value: "dips.umred@gmail.com" },
  { label: "Contact number", value: "98227 27300" },
  { label: "Year of establishment", value: "2014" },
  { label: "Classes offered", value: "Nursery to Std 10" },
];

const INFRA: { label: string; value: string }[] = [
  { label: "Total campus / land area (sq. metres)", value: "17,400" },
  { label: "Total built-up area (sq. metres)", value: "3,852" },
  { label: "Number of classrooms", value: "26" },
  { label: "Size of each classroom (sq. metres)", value: "Approx. 50 to 61" },
  { label: "Number of laboratories (incl. computer labs)", value: "4 (Science, Maths, and two Computer labs)" },
  { label: "Size of each laboratory (sq. metres)", value: "Approx. 61" },
  { label: "Internet facility", value: "Yes" },
  { label: "Number of girls' toilets", value: "4" },
  { label: "Number of boys' toilets", value: "4" },
];

const DOCS: { label: string; file: string }[] = [
  { label: "Affiliation letter (up to Secondary, valid to 31.03.2027)", file: "affiliation-letter.pdf" },
  { label: "Recognition / Self-Financed Scheme permission", file: "recognition-certificate.pdf" },
  { label: "Society / trust registration certificate", file: "society-registration.pdf" },
  { label: "Trust — list of members", file: "trust-members.pdf" },
  { label: "No Objection Certificate (NOC)", file: "noc.pdf" },
  { label: "Certificate of land", file: "certificate-of-land.pdf" },
  { label: "Building safety certificate", file: "building-safety-certificate.pdf" },
  { label: "Built-up area certificate", file: "built-up-area-certificate.pdf" },
  { label: "Fire safety certificate", file: "fire-safety-certificate.pdf" },
  { label: "Self-certification", file: "self-certification.pdf" },
  { label: "Water, health & sanitation certificate", file: "water-health-sanitation-certificate.pdf" },
  { label: "Fee structure (2026-27)", file: "fee-structure.pdf" },
  { label: "Annual academic calendar (2026-27)", file: "academic-calendar.pdf" },
  { label: "School Management Committee (SMC) — members", file: "smc-members.pdf" },
  { label: "Board results — last three years (Class X)", file: "board-results.pdf" },
];

function Heading({ title }: { title: string }) {
  return (
    <h2 className="font-display font-semibold text-2xl md:text-3xl text-ink text-center mb-8">{title}</h2>
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
    
      href={`/disclosure/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-white border-2 border-meadow/10 rounded-2xl p-4 hover:border-meadow/40 hover:shadow-sm transition"
    >
      <span className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-blossom-light text-blossom-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0
