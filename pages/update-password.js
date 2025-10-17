import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk(false);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setOk(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Choisir un nouveau mot de passe</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Nouveau mot de passe" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {ok && <div className="text-green-400 text-sm">Mot de passe mis à jour. Vous pouvez fermer cette page et vous reconnecter.</div>}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="w-full py-3 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
}











