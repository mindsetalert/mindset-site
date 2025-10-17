import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import LanguageToggle from '../components/LanguageToggle';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Erreur');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

      {/* Contact Form */}
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
            {t('contact.backToHome')}
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-3">{t('contact.title')}</h1>
        <p className="text-neutral-300 mb-8">{t('contact.subtitle')}</p>

        {status === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-700 text-green-300">
            {t('contact.success')}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-300">
            {t('contact.error')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('contact.namePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('contact.emailPlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              {t('contact.subject')}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder={t('contact.subjectPlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              {t('contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              placeholder={t('contact.messagePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-6 py-4 rounded-xl bg-amber-500 text-neutral-900 font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'sending' ? t('contact.sending') : t('contact.send')}
          </button>
        </form>

        <div className="mt-8 p-6 rounded-xl bg-neutral-900/40 border border-neutral-800">
          <h3 className="font-semibold mb-2">Email direct</h3>
          <a href="mailto:mindsetalertstrategy@hotmail.com" className="text-amber-400 hover:text-amber-300">
            mindsetalertstrategy@hotmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

