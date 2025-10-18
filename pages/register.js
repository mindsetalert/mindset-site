import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">{t('register.title')}</h1>
        
        {success ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-green-900/30 border border-green-700 p-6">
              <div className="text-red-600 font-extrabold text-xl mb-3 uppercase">
                IMPORTANT!
              </div>
              <h2 className="text-xl font-semibold text-green-300 mb-3">
                ✅ {t('register.successTitle')}
              </h2>
              <p className="text-neutral-200 mb-3">
                {t('register.verifyEmail')}
              </p>
              <p className="text-sm text-neutral-400">
                {t('register.checkSpam')}
              </p>
            </div>
            <Link 
              href="/login" 
              className="block w-full py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 text-center"
            >
              {t('register.goToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="space-y-4">
              <input 
                className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" 
                placeholder={t('register.emailPlaceholder')} 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
              />
              <input 
                className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" 
                placeholder={t('register.passwordPlaceholder')} 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
              />
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button 
                disabled={loading} 
                className="w-full py-3 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60"
              >
                {loading ? t('register.creating') : t('register.createButton')}
              </button>
            </form>
            <p className="mt-4 text-sm text-neutral-400">
              {t('register.alreadyHaveAccount')} <Link className="text-amber-400" href="/login">{t('register.login')}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}


