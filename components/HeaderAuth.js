import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';

export default function HeaderAuth() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!isMounted) return;
        setUser(data?.user ?? null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      isMounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-amber-400 hover:underline">{t('header.home')}</Link>
        {loading ? (
          <div className="text-neutral-400 text-sm">{t('header.loading')}</div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-neutral-300 text-sm hidden sm:inline">{user.email}</span>
            <Link href="/account" className="text-amber-400 hover:underline">{t('header.myAccount')}</Link>
            <button onClick={handleLogout} className="text-neutral-300 hover:text-red-400">{t('header.logout')}</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-amber-400 hover:underline">{t('header.login')}</Link>
            <Link href="/register" className="text-neutral-300 hover:underline">{t('header.register')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}


