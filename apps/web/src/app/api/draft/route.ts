/**
 * /api/draft — Active le Draft Mode Next.js
 *
 * Permet de prévisualiser un contenu Directus non publié (status = draft).
 * Équivalent du bouton "Aperçu" dans WordPress.
 *
 * Directus → Settings → Collections → [votre collection]
 *   Preview URL : https://votre-site.fr/api/draft?secret=TOKEN&slug={{slug}}&collection={{collection}}
 *
 * Sécurisé par DRAFT_SECRET (même valeur que NEXT_REVALIDATE_TOKEN, ou dédié).
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

// Mapping collection Directus → route Next.js
const COLLECTION_ROUTES: Record<string, string> = {
  pages: '/[slug]',
  articles: '/blog/[slug]',
  products: '/products/[slug]',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const collection = searchParams.get('collection') ?? 'pages';

  const token = process.env.DRAFT_SECRET ?? process.env.NEXT_REVALIDATE_TOKEN;

  if (!token || secret !== token) {
    return NextResponse.json({ message: 'Token invalide.' }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json(
      { message: 'Paramètre slug manquant.' },
      { status: 400 }
    );
  }

  // Active le Draft Mode (cookie __prerender_bypass)
  (await draftMode()).enable();

  // Redirige vers la page correspondante
  const routePattern = COLLECTION_ROUTES[collection] ?? '/[slug]';
  const path = routePattern.replace('[slug]', slug);

  redirect(path);
}

/**
 * /api/draft/disable — Désactive le Draft Mode
 * Accessible via : /api/draft/disable
 */
export async function DELETE() {
  (await draftMode()).disable();
  return NextResponse.json({ message: 'Draft mode désactivé.' });
}
