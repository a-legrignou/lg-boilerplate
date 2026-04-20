'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Input } from '@ui/input';
import { FormField } from '@ui/form-field';
import { Alert } from '@ui/alert';
import { Spinner } from '@ui/spinner';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.error ?? 'Identifiants incorrects.');
      return;
    }

    const next =
      new URLSearchParams(window.location.search).get('next') ?? '/account';
    router.push(next.startsWith('/') ? next : '/account');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/10"
    >
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          error={!!error}
        />
      </FormField>

      <FormField label="Mot de passe" htmlFor="password">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          error={!!error}
        />
      </FormField>

      {error && <Alert variant="danger">{error}</Alert>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Spinner size="sm" />}
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
