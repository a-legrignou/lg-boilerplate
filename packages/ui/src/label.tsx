import clsx from 'clsx';
import type { LabelHTMLAttributes } from 'react';

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx('block text-sm font-medium text-slate-300', className)}
      {...props}
    />
  );
}
