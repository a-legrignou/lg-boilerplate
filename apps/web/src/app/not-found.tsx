export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-20 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">404</p>
        <h1 className="mt-6 text-4xl font-semibold text-white">
          Page introuvable
        </h1>
        <p className="mt-4 text-slate-300">
          Le chemin demandé n’existe pas ou a été déplacé.
        </p>
      </div>
    </div>
  );
}
