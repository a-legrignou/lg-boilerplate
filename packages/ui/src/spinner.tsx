import clsx from 'clsx';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      aria-label="Chargement..."
      role="status"
      className={clsx(
        'inline-block animate-spin rounded-full border-slate-600 border-t-sky-400',
        SIZE[size],
        className
      )}
    />
  );
}
