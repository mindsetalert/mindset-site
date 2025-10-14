import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function HeaderAuth() {
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
        <div />
        {loading ? (
          <div className="text-neutral-400 text-sm">Chargement…</div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-neutral-300 text-sm hidden sm:inline">{user.email}</span>
            <Link href="/account" className="text-amber-400 hover:underline">Mon compte</Link>
            <button onClick={handleLogout} className="text-neutral-300 hover:text-red-400">Déconnexion</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-amber-400 hover:underline">Connexion</Link>
            <Link href="/register" className="text-neutral-300 hover:underline">Créer un compte</Link>
          </div>
        )}
      </div>
    </div>
  );
}


