import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else window.location.href = '/account';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Connexion</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Mot de passe" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button disabled={loading} className="w-full py-3 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60">{loading? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm">
          <Link className="text-neutral-300 hover:text-amber-400" href="/reset">Mot de passe oublié ?</Link>
          <p className="text-neutral-400">Pas de compte ? <Link className="text-amber-400" href="/register">Créer un compte</Link></p>
        </div>
      </div>
    </div>
  );
}


