import clsx from 'clsx';
import type { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const STYLES: Record<AlertVariant, string> = {
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
};

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  className?: string;
  children: ReactNode;
};

export function Alert({
  variant = 'info',
  title,
  className,
  children,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        'rounded-xl border px-4 py-3 text-sm',
        STYLES[variant],
        className
      )}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
