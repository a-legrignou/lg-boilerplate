'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';

type NavLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /** Additional class applied when the link is active */
  activeClassName?: string;
  /** Exact match (default: true) — false allows prefix matching for nested routes */
  exact?: boolean;
};

/** Navigation link that automatically receives an active style based on the current path. */
export function NavLink({
  href,
  className,
  activeClassName = 'text-white',
  exact = true,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const hrefStr = typeof href === 'string' ? href : (href.pathname ?? '');
  const isActive = exact ? pathname === hrefStr : pathname.startsWith(hrefStr);

  return (
    <Link
      href={href}
      className={clsx(
        'text-sm transition-colors hover:text-white',
        isActive ? activeClassName : 'text-slate-400',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    />
  );
}
