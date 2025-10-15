import React from 'react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-400">Paiement confirmé</h1>
        <p className="mt-3 text-neutral-300">Votre abonnement a été activé. Vous recevrez un email avec les instructions et votre lien de téléchargement.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/account" className="px-4 py-2 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400">Aller à mon compte</Link>
          <Link href="/" className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Retour à l’accueil</Link>
        </div>
      </div>
    </div>
  );
}







