import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/update-password` : undefined,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Email d'instructions envoyé (si l'adresse existe). Vérifiez votre boîte de réception.");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Réinitialiser le mot de passe</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          {message && <div className="text-green-400 text-sm">{message}</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button disabled={loading} className="w-full py-3 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60">{loading? 'Envoi…' : 'Envoyer le lien'}</button>
        </form>
        <p className="mt-4 text-sm text-neutral-400"><Link className="text-amber-400" href="/login">Retour à la connexion</Link></p>
      </div>
    </div>
  );
}








