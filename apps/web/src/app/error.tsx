'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-20 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-white">Erreur inattendue</h1>
        <p className="mt-4 text-slate-300">
          Veuillez réessayer ou consulter les logs serveur.
        </p>
      </div>
    </div>
  );
}
