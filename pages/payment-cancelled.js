import React from 'react';
import Link from 'next/link';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-400">Paiement annulé</h1>
        <p className="mt-3 text-neutral-300">Votre paiement a été annulé ou a échoué. Vous pouvez réessayer ou choisir une autre méthode.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/payment" className="px-4 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">Revenir au paiement</Link>
          <Link href="/" className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Retour à l’accueil</Link>
        </div>
      </div>
    </div>
  );
}





