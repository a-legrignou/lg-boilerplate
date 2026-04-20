'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Accessible dialog using the native <dialog> element.
 * Closes on Escape and backdrop click.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  // Close on backdrop click
  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === ref.current) onClose();
  }

  return (
    <dialog
      ref={ref}
      onClick={handleClick}
      onClose={onClose}
      className={clsx(
        'rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl backdrop:bg-slate-950/60',
        'w-full max-w-lg text-slate-100 open:animate-in open:fade-in-0 open:zoom-in-95',
        className
      )}
    >
      {title && (
        <h2 className="mb-1 text-lg font-semibold text-white">{title}</h2>
      )}
      {description && (
        <p className="mb-4 text-sm text-slate-400">{description}</p>
      )}
      {children}
    </dialog>
  );
}
