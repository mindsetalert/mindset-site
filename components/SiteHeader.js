import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";
import LanguageToggle from "./LanguageToggle";

export default function SiteHeader() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between -translate-x-[60px] md:-translate-x-[200px]">
        <div className="flex items-center">
          <div className="relative h-24 w-64 md:h-48 md:w-[45rem]">
            <Image
              src="/logo-new.png"
              alt="Logo Mindset – Alert Strategy"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
            <div className="mb-4">
              <LanguageToggle />
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('features'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.features')}</a>
              <Link href="/software" className="hover:text-amber-300">{t('nav.software')}</Link>
              <a href="#how" className="hover:text-amber-300 whitespace-nowrap" onClick={(e) => { e.preventDefault(); const element = document.getElementById('how'); if (element) { const y = element.offsetTop - 200; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.how')}</a>
              <a href="#pricing" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('pricing'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.pricing')}</a>
              <Link href="/videos" className="hover:text-amber-300">{t('nav.video')}</Link>
              <a href="#compatibility" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('compatibility'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.compatibility')}</a>
              <a href="#legal" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('legal'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.legal')}</a>
              <Link href="/contact" className="hover:text-amber-300">{t('nav.contact')}</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-200 p-2"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800">
          <nav className="flex flex-col gap-4 p-4 text-sm">
            <a href="#features" className="hover:text-amber-300 py-2" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); const element = document.getElementById('features'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.features')}</a>
            <Link href="/software" className="hover:text-amber-300 py-2" onClick={() => setMobileMenuOpen(false)}>{t('nav.software')}</Link>
            <a href="#how" className="hover:text-amber-300 py-2 whitespace-nowrap" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); const element = document.getElementById('how'); if (element) { const y = element.offsetTop - 200; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.how')}</a>
            <a href="#pricing" className="hover:text-amber-300 py-2" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); const element = document.getElementById('pricing'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.pricing')}</a>
            <Link href="/videos" className="hover:text-amber-300 py-2" onClick={() => setMobileMenuOpen(false)}>{t('nav.video')}</Link>
            <a href="#compatibility" className="hover:text-amber-300 py-2" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); const element = document.getElementById('compatibility'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.compatibility')}</a>
            <a href="#legal" className="hover:text-amber-300 py-2" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); const element = document.getElementById('legal'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.legal')}</a>
            <Link href="/contact" className="hover:text-amber-300 py-2" onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</Link>
            <div className="pt-2"><LanguageToggle /></div>
          </nav>
        </div>
      )}
    </header>
  );
}


