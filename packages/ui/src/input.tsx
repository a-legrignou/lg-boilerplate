import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500',
        'transition-colors focus:outline-none focus:ring-2',
        error
          ? 'border-rose-500 focus:ring-rose-500/30'
          : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
