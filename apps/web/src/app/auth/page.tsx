import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account.',
};

export default function AuthPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'true') notFound();
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            Espace membre
          </p>
          <h1 className="text-4xl font-bold text-white">Connexion</h1>
          <p className="text-slate-400">
            Connectez-vous pour accéder à votre compte et gérer vos préférences.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
