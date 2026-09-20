import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure | DIPS Umred",
  description: "Mandatory Public Disclosure of Deoraoji Itankar Public School, Umred.",
};

const GENERAL = [
  ["Name of the school", "Deoraoji Itankar Public School, Umred"],
  ["Managed by (society/trust)", "Uday Mahila Seva Sanstha"],
  ["CBSE affiliation number", "1130888"],
  ["CBSE school code", "30867"],
  ["UDISE code", "27091119434"],
  ["Complete address with pin code", "Near Hirwa Talaw, Budhwari Peth, Umred, Tah. Umred, Dist. Nagpur, Maharashtra - 441203"],
  ["Principal's name", "Pallavi Shekhar Wankhede"],
  ["School email", "dips.umred@gmail.com"],
  ["Contact number", "98227 27300"],
  ["Year of establishment", "2014"],
  ["Classes offered", "Nursery to Std 10"],
];

const INFRA = [
  ["Total campus / land area (sq. metres)", "17,400"],
  ["Total built-up area (sq. metres)", "3,852"],
  ["Number of classrooms", "26"],
  ["Size of each classroom (sq. metres)", "Approx. 50 to 61"],
  ["Number of laboratories (incl. computer labs)", "4 (Science, Maths, and two Computer labs)"],
  ["Size of each laboratory (sq. metres)", "Approx. 61"],
  ["Internet facility", "Yes"],
  ["Number of girls toilets", "4"],
  ["Number of boys toilets", "4"],
];

const DOCS = [
  ["Affiliation letter (up to Secondary, valid to 31.03.2027)", "affiliation-letter.pdf"],
  ["Recognition / Self-Financed Scheme permission", "recognition-certificate.pdf"],
  ["Society / trust registration certificate", "society-registration.pdf"],
  ["Trust - list of members", "trust-members.pdf"],
  ["No Objection Certificate (NOC)", "noc.pdf"],
  ["Certificate of land", "certificate-of-land.pdf"],
  ["Building safety certificate", "building-safety-certificate.pdf"],
  ["Built-up area certificate", "built-up-area-certificate.pdf"],
  ["Fire safety certificate", "fire-safety-certificate.pdf"],
  ["Self-certification", "self-certification.pdf"],
  ["Water, health and sanitation certificate", "water-health-sanitation-certificate.pdf"],
  ["Fee structure (2026-27)", "fee-structure.pdf"],
  ["Annual academic calendar (2026-27)", "academic-calendar.pdf"],
  ["School Management Committee (SMC) - members", "smc-members.pdf"],
  ["Board results - last three years (Class X)", "board-results.pdf"],
];

function Rows({ data }: { data: string[][] }) {
  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-meadow/10 max-w-3xl mx-auto">
      {data.map((row) => (
        <div key={row[0]} className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3 border-b border-meadow/10 last:border-0">
          <span className="font-bold text-ink text-[15px]">{row[0]}</span>
          <span className="text-ink/70 sm:text-right">{row[1]}</span>
        </div>
      ))}
    </div>
  );
}

export default function MandatoryDisclosurePage() {
  return (
    <>
      <PageHero eyebrow="Transparency" title="Mandatory Public Disclosure" subtitle="Published as required under the CBSE Affiliation Bye-Laws." />

      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="font-display font-semibold text-2xl text-ink text-center mb-8">School information</h2>
        <Rows data={GENERAL} />
      </section>

      <section className="bg-meadow-light">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <h2 className="font-display font-semibold text-2xl text-ink text-center mb-8">School infrastructure</h2>
          <Rows data={INFRA} />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 py-16">
        <h2 className="font-display font-semibold text-2xl text-ink text-center mb-8">Documents</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {DOCS.map((doc) => (
            <a key={doc[1]} href={"/disclosure/" + doc[1]} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 bg-white border-2 border-meadow/10 rounded-2xl p-4 hover:border-meadow/40 transition">
              <span className="font-semibold text-ink text-[15px]">{doc[0]}</span>
              <span className="shrink-0 text-meadow font-bold text-sm">View</span>
            </a>
          ))}
        </div>
        <p className="text-center text-sm text-ink/50 mt-6">Each document opens as a PDF in a new tab.</p>
      </section>
    </>
  );
}
