import type { AnchorHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const styles = clsx(
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors',
    variant === 'primary' && 'bg-sky-500 text-slate-950 hover:bg-sky-400',
    variant === 'secondary' &&
      'border border-slate-700 text-slate-100 hover:border-slate-500 hover:text-white',
    className
  );

  return <a className={styles} {...props} />;
}
