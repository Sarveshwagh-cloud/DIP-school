import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import DisclosureDocList from "@/components/DisclosureDocList";
import UploadedSchoolDocs from "@/components/UploadedSchoolDocs";

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
  ["School email", "dips.umred@gmail.com"],
  ["Classes offered", "Std 1 to Std 10"],
];


const DOCS: [string, string][] = [
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
   ["Parent Teacher Association For The Year 2026-2027", "parent_teacher_association.pdf"],
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

      <section className="max-w-4xl mx-auto px-5 py-16">
        <h2 className="font-display font-semibold text-2xl text-ink text-center mb-8">Documents</h2>
        <DisclosureDocList documents={DOCS} />
        <UploadedSchoolDocs />
      </section>
    </>
  );
}
