import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

export default function VideosPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
            ← {t('account.backToHome')}
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('videos.title')}</h1>
        <p className="text-neutral-300">{t('videos.comingSoon')}</p>
      </div>
    </div>
  );
}


