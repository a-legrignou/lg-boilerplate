import type { ReactNode } from 'react';

import { Label } from './label';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

/** Wrapper that pairs a Label, an input slot, optional hint and inline error. */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
