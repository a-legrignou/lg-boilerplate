export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span
        aria-label="Chargement…"
        role="status"
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400"
      />
    </div>
  );
}
