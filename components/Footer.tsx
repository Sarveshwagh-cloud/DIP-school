import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="Deoraoji Itankar Public School Logo"
              width={44}
              height={48}
              className="h-11 w-auto object-contain shrink-0 bg-white/10 p-1 rounded-xl"
            />
            <span className="font-display font-semibold text-white text-lg leading-tight">DIPS Umred</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">A CBSE school run by Uday Mahila Seva Sanstha, growing young minds in the green heart of Umred since 2014.</p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://www.facebook.com/DIPSumred/" aria-label="Facebook" className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-meadow transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg></a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-meadow transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-sun transition">About us</Link></li>
            <li><Link href="/academics" className="hover:text-sun transition">Academics</Link></li>
            <li><Link href="/admissions" className="hover:text-sun transition">Admissions</Link></li>
            <li><Link href="/gallery" className="hover:text-sun transition">Gallery</Link></li>
            <li><Link href="/notices" className="hover:text-sun transition">Notice Board</Link></li>
            <li><Link href="/mandatory-disclosure" className="hover:text-sun transition">Mandatory Disclosure</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Quick links</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/admissions#enquiry" className="hover:text-sun transition">Enquire now</Link></li>
            <li><Link href="/contact" className="hover:text-sun transition">Contact us</Link></li>
            <li><a href="tel:9822727300" className="hover:text-sun transition">Call the school</a></li>
            <li><Link href="/admin" className="hover:text-sun text-white/50 transition flex items-center gap-1.5 pt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Staff Portal
            </Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Reach us</h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex gap-3"><svg className="shrink-0 mt-0.5" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2FA36B" strokeWidth="2.2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>Near Hirwa Talaw, Budhwari Peth, Umred, Tah. Umred, Dist. Nagpur (MS) — 441203</li>
            <li className="flex gap-3"><svg className="shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2FA36B" strokeWidth="2.2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg><a href="tel:9822727300" className="hover:text-sun transition">98227 27300</a></li>
            <li className="flex gap-3"><svg className="shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2FA36B" strokeWidth="2.2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg><a href="mailto:dips.umred@gmail.com" className="hover:text-sun transition">dips.umred@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-2 text-sm text-white/50">
          <span>© {year} Deoraoji Itankar Public School, Umred. CBSE Affiliation No. 1130888.</span>
          <span>Made with care 🌱</span>
        </div>
      </div>
    </footer>
  );
}
