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
        <h1 className="text-3xl font-bold mb-6">{t('videos.title')}</h1>

        {/* 1) Explication complète - FIRST */}
        <div className="text-sm text-neutral-400 mb-3">{t('videos.fullTitle')}</div>
        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/40 mb-8">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/xD7gx7hjmqY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* 2) Capture de PNL */}
        <div className="text-sm text-neutral-400 mb-3">{t('videos.pnlCaption')}</div>
        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/40">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/gF5pcxdKwLc"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}


