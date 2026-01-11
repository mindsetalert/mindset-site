import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";
import LanguageToggle from "../components/LanguageToggle";

export default function MindsetLanding() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400/40">
      {/* Header global gÃ©rÃ© par SiteHeader */}

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
            <div className="rounded-xl bg-neutral-900/50 ring-1 ring-neutral-800 p-2 overflow-hidden">
              <Image
                src="/image.png"
                alt="Interface Mindset - Alert Strategy"
                width={1272}
                height={924}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block h-20 w-20 rounded-2xl bg-amber-500/20 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Discord Section */}
      <section id="discord" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-neutral-800 flex-shrink-0">
            <Image src="/discord-logo.png" alt={t('discordSection.logoAlt')} fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold">{t('discordSection.title')}</h2>
            <p className="mt-2 text-neutral-300 text-lg">{t('discordSection.subtitle')}</p>
          </div>
        </div>
        
        <p className="text-neutral-400 text-base mb-8 mt-6 max-w-3xl">
          {t('discordSection.description')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Discord Only */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
            <h3 className="text-xl font-semibold">{t('discordSection.discordOnly.title')}</h3>
            <p className="text-sm text-neutral-300">{t('discordSection.discordOnly.description')}</p>
            <div className="text-4xl font-black mt-4">
              {t('discordSection.discordOnly.price')}{" "}
              <span className="text-base font-semibold text-neutral-400">{t('discordSection.discordOnly.period')}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t('discordSection.discordOnly.features').map((feature, i) => (
                <li key={i}>âœ” {feature}</li>
              ))}
            </ul>
            <Link
              href="/discord"
              className="block mt-6 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 text-center"
            >
              {t('discordSection.discordOnly.cta')}
            </Link>
          </div>

          {/* Bundle */}
          <div className="rounded-2xl border-2 border-indigo-500 bg-neutral-900/60 p-6 flex flex-col relative">
            <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold">
              {t('discordSection.bundle.badge')}
            </div>
            <h3 className="text-xl font-semibold">{t('discordSection.bundle.title')}</h3>
            <p className="text-sm text-neutral-300">{t('discordSection.bundle.description')}</p>
            <div className="text-4xl font-black mt-4 text-indigo-300">
              {t('discordSection.bundle.price')}{" "}
              <span className="text-base font-semibold text-neutral-400">{t('discordSection.bundle.period')}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t('discordSection.bundle.features').map((feature, i) => (
                <li key={i}>âœ” {feature}</li>
              ))}
            </ul>
            <Link
              href="/discord"
              className="block mt-6 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 text-center"
            >
              {t('discordSection.bundle.cta')}
            </Link>
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral-400">{t('discordSection.keepExisting')}</p>
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

      {/* Pricing (2 boÃ®tes) */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold">{t('pricing.title')}</h2>
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

      {/* CompatibilitÃ© (remplace l'ancienne FAQ visuelle) */}
      <section id="faq" className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold">{t('compatCards.title')}</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="font-semibold">{t('compatCards.osTitle')}</div>
            <div className="mt-2 text-neutral-300 text-sm">{t('compatCards.osText')}</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="font-semibold">{t('compatCards.redownloadTitle')}</div>
            <div className="mt-2 text-neutral-300 text-sm">{t('compatCards.redownloadText')}</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 md:col-span-2">
            <div className="font-semibold">{t('compatCards.brokersTitle')}</div>
            <div className="mt-2 text-neutral-300 text-sm">{t('compatCards.brokersText')}</div>
          </div>
        </div>
      </section>

      {/* Mentions lÃ©gales & compatibilitÃ© */}
      <section id="compatibility" className="border-t border-neutral-800 bg-neutral-950/40">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div id="legal" />
          <h3 className="text-sm font-semibold text-neutral-200">{t('legal.disclaimerTitle')}</h3>
          <p className="mt-2 text-xs text-neutral-400">{t('legal.disclaimerText1')}</p>
          <p className="mt-2 text-xs text-neutral-400">{t('legal.disclaimerText2')}</p>
          <p className="mt-2 text-xs text-neutral-300 font-semibold">{t('legal.nonAffiliationEmphasis')}</p>

          <h3 className="mt-6 text-sm font-semibold text-neutral-200">{t('legal.compatibilityTitle')}</h3>
          <p className="mt-2 text-xs text-neutral-400">{t('legal.compatibilityText')}</p>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-200">{t('compatibility.osTitle')}</h4>
            <p className="mt-2 text-xs text-neutral-400">{t('compatibility.osText')}</p>

            <h4 className="mt-4 text-sm font-semibold text-neutral-200">{t('compatibility.currentSupportTitle')}</h4>
            <p className="mt-2 text-xs text-neutral-400">{t('compatibility.currentSupportText')}</p>
          </div>
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
