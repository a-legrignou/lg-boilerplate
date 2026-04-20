/**
 * DraftBanner — Barre de prévisualisation (visible uniquement en Draft Mode)
 *
 * Usage dans layout.tsx ou page.tsx :
 *   import { DraftBanner } from '@ui/draft-banner';
 *   <DraftBanner isEnabled={isEnabled} />
 *
 * Ou directement côté serveur :
 *   import { draftMode } from 'next/headers';
 *   const { isEnabled } = await draftMode();
 */
'use client';

interface DraftBannerProps {
  isEnabled: boolean;
}

export function DraftBanner({ isEnabled }: DraftBannerProps) {
  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg">
      <span>
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-700 animate-pulse" />
        Mode prévisualisation actif — contenu en brouillon visible
      </span>
      <button
        onClick={async () => {
          await fetch('/api/draft', { method: 'DELETE' });
          window.location.reload();
        }}
        className="rounded bg-amber-700/20 px-3 py-1 text-xs font-semibold hover:bg-amber-700/40 transition"
      >
        Quitter l'aperçu
      </button>
    </div>
  );
}
