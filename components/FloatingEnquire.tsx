import Link from "next/link";

export default function FloatingEnquire() {
  return (
    <Link
      href="/admissions#enquiry"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 bg-blossom text-white font-bold px-5 py-3.5 rounded-full shadow-xl hover:brightness-95 transition"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      Enquire
    </Link>
  );
}
