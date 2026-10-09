"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/notices", label: "Notice Board" },
  { href: "/mandatory-disclosure", label: "Mandatory Disclosure" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-meadow text-white text-sm">
        <div className="max-w-6xl mx-auto px-5 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="tel:9822727300" className="flex items-center gap-1.5 hover:text-sun transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              98227 27300
            </a>
            <a href="mailto:dips.umred@gmail.com" className="flex items-center gap-1.5 hover:text-sun transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>
              dips.umred@gmail.com
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/85">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 7v6c0 5 3.8 8.3 9 9 5.2-.7 9-4 9-9V7z" /></svg>
              CBSE Affiliation No. 1130888
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/DIPSumred/" aria-label="Facebook" className="hover:text-sun transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg></a>
            <a href="https://www.instagram.com/" aria-label="Instagram" className="hover:text-sun transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-cream/90 backdrop-blur border-b border-meadow/10">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Deoraoji Itankar Public School Logo"
              width={52}
              height={57}
              className="h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
              priority
            />
            <span className="leading-tight min-w-0">
              <span className="block font-display font-semibold text-ink text-sm sm:text-base md:text-lg">DEORAOJI ITANKAR PUBLIC SCHOOL</span>
              <span className="block text-[11px] text-meadow font-bold tracking-wide">DIPS Umred</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-6 font-semibold text-[15px] text-ink/80">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="link-underline hover:text-meadow">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admissions#enquiry" className="hidden sm:inline-flex items-center gap-2 bg-sun text-ink font-bold px-5 py-2.5 rounded-full hover:brightness-95 transition shadow-sm">
              Admissions open
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} className="xl:hidden grid place-items-center w-11 h-11 rounded-xl bg-meadow/10 text-meadow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-meadow/10 bg-cream px-5 py-3 space-y-1 font-semibold text-ink/80">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2">{l.label}</Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
