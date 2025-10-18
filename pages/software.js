import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import LanguageToggle from '../components/LanguageToggle';

export default function SoftwarePage() {
  const { t } = useTranslation();

  const screenshots = [
    {
      key: 'alertWindow',
      image: '/principal-alert-window.png',
      title: t('software.screenshots.alertWindow.title'),
      description: t('software.screenshots.alertWindow.description')
    },
    {
      key: 'statsCalendar',
      image: '/stats-calendar.png',
      title: t('software.screenshots.statsCalendar.title'),
      description: t('software.screenshots.statsCalendar.description')
    },
    {
      key: 'statsChart',
      image: '/stats-chart.png',
      title: t('software.screenshots.statsChart.title'),
      description: t('software.screenshots.statsChart.description')
    },
    {
      key: 'dailyGoal',
      image: '/daily-goal-week-research.png',
      title: t('software.screenshots.dailyGoal.title'),
      description: t('software.screenshots.dailyGoal.description')
    },
    {
      key: 'monthlyGoal',
      image: '/monthly-goal.png',
      title: t('software.screenshots.monthlyGoal.title'),
      description: t('software.screenshots.monthlyGoal.description')
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider text-neutral-200 hover:text-amber-400">
            Mindset – Alert Strategy
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
            {t('software.backToHome')}
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-3">{t('software.title')}</h1>
        <p className="text-neutral-300 text-lg mb-12">{t('software.subtitle')}</p>

        {/* Screenshots */}
        <div className="space-y-16">
          {screenshots.map((screenshot, index) => (
            <div key={screenshot.key} className="space-y-4">
              {/* Titre et description */}
              <div>
                <h2 className="text-2xl font-semibold text-amber-400 mb-2">
                  {index + 1}. {screenshot.title}
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  {screenshot.description}
                </p>
              </div>

              {/* Image */}
              <div className="rounded-xl bg-neutral-900/50 ring-1 ring-neutral-800 p-2 overflow-hidden">
                <div className="relative w-full">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    width={1920}
                    height={1080}
                    className="w-full h-auto rounded-lg"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30">
          <h3 className="text-2xl font-bold mb-4">Prêt à transformer votre trading ?</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/payment" className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-600">
              Acheter maintenant
            </Link>
            <Link href="/register" className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

