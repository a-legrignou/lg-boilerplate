import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-500/15 text-emerald-300',
  warning: 'bg-amber-500/15 text-amber-300',
  danger: 'bg-rose-500/15 text-rose-300',
  info: 'bg-sky-500/15 text-sky-300',
};

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

export function Badge({
  variant = 'default',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
