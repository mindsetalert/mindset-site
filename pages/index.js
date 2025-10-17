import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";
import LanguageToggle from "../components/LanguageToggle";

export default function MindsetLanding() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400/40">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo très grand */}
            <div className="relative h-40 w-[10rem]">
              <Image
                src="/logo.png"  // Mets ton logo dans /public/logo.png
                alt="Logo Mindset – Alert Strategy"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-xl font-bold tracking-wider text-neutral-200">
              Mindset – Alert Strategy
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('features'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.features')}</a>
            <a href="#how" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('how'); if (element) { const y = element.offsetTop - 200; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.how')}</a>
            <a href="#pricing" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('pricing'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.pricing')}</a>
            <a href="#faq" className="hover:text-amber-300" onClick={(e) => { e.preventDefault(); const element = document.getElementById('faq'); if (element) { const y = element.offsetTop - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>{t('nav.faq')}</a>
            <Link href="/contact" className="hover:text-amber-300">{t('nav.contact')}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {t('hero.title')} <span className="text-amber-400">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
            </h1>
            <p className="mt-4 text-neutral-300 max-w-prose">
              {t('hero.description')} <strong>{t('hero.appName')}</strong> {t('hero.description2')}
              <em> {t('hero.description3')}</em> {t('hero.description4')}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <Link href="/payment" className="px-5 py-3 rounded-2xl bg-green-500 text-black font-semibold hover:bg-green-600">
                  {t('hero.buyNow')}
                </Link>
                <a href="#how" className="px-5 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-500" onClick={(e) => { e.preventDefault(); const element = document.getElementById('how'); if (element) { const y = element.offsetTop - 200; window.scrollTo({ top: y, behavior: 'smooth' }); } }}>
                  {t('hero.seeHow')}
                </a>
              </div>
              <Link href="/register" className="px-5 py-3 rounded-2xl bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400 text-center w-full md:w-auto">
                {t('hero.createAccount')}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl bg-neutral-900/50 ring-1 ring-neutral-800 p-3">
              <div className="h-full w-full rounded-xl bg-neutral-900 overflow-hidden">
                <Image
                  src="/interface-preview.png.png"
                  alt="Interface Mindset - Alert Strategy"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block h-20 w-20 rounded-2xl bg-amber-500/20 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-neutral-800 bg-neutral-950/60">
        <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-6 text-sm text-neutral-300">
          <div className="rounded-xl p-4 bg-neutral-900/40">{t('socialProof.voiceAlerts')}</div>
          <div className="rounded-xl p-4 bg-neutral-900/40">{t('socialProof.ocrMultiBroker')}</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {t('features.items').map((f, i) => (
            <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <h3 className="text-lg font-semibold text-neutral-50">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-300">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 p-6">
          <h2 className="text-2xl font-bold">{t('howItWorks.title')}</h2>
          <ol className="mt-4 space-y-3 text-neutral-300 list-decimal list-inside">
            {t('howItWorks.steps').map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing (2 boîtes) */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-extrabold">{t('pricing.title')}</h2>
        <p className="mt-2 text-neutral-300">{t('pricing.subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Mensuel */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
            <h3 className="text-xl font-semibold">{t('pricing.monthly.title')}</h3>
            <p className="text-sm text-neutral-300">{t('pricing.monthly.description')}</p>
            <div className="text-4xl font-black mt-4">
              {t('pricing.monthly.price')} <span className="text-base font-semibold text-neutral-400">{t('pricing.monthly.period')}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t('pricing.monthly.features').map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <Link href="/payment?plan=monthly" className="block mt-6 px-4 py-3 rounded-xl bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400 text-center">
              {t('pricing.monthly.button')}
            </Link>
            <p className="mt-2 text-xs text-neutral-400">{t('pricing.monthly.note')}</p>
          </div>

          {/* Annuel -10% */}
          <div className="rounded-2xl border-2 border-amber-500 bg-neutral-900/60 p-6 flex flex-col">
            <div className="text-xs px-2 py-1 rounded-full bg-green-700/20 text-green-400 w-max">{t('pricing.yearly.discount')}</div>
            <h3 className="text-xl font-semibold mt-2">{t('pricing.yearly.title')}</h3>
            <p className="text-sm text-neutral-300">{t('pricing.yearly.description')}</p>
            <div className="text-4xl font-black mt-4">
              {t('pricing.yearly.price')} <span className="text-base font-semibold text-neutral-400">{t('pricing.yearly.period')}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t('pricing.yearly.features').map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <Link href="/payment?plan=yearly" className="block mt-6 px-4 py-3 rounded-xl bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400 text-center">
              {t('pricing.yearly.button')}
            </Link>
            <p className="mt-2 text-xs text-neutral-400">{t('pricing.yearly.note')}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral-400">{t('pricing.disclaimer')}</p>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="text-3xl font-extrabold">{t('faq.title')}</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {t('faq.questions').map((qa, i) => (
            <div key={i} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <div className="font-semibold">{qa.question}</div>
              <div className="mt-2 text-neutral-300 text-sm">{qa.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-400">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>{t('footer.copyright', { year: new Date().getFullYear() })}</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-300">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-amber-300">{t('footer.terms')}</a>
              <a href="#" className="hover:text-amber-300">{t('footer.support')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
