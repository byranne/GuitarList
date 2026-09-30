import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';

type ButtonProps = Omit<ComponentProps<'button'>, 'children' | 'className'> & {
  label: string;
  variant?: 'primary' | 'ghost';
  loading?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        'flex h-12 w-full items-center justify-center rounded-full px-6 text-base transition-opacity active:opacity-80',
        isPrimary ? 'bg-accent font-semibold text-on-accent' : 'bg-transparent font-medium text-muted',
        isDisabled ? 'opacity-50' : '',
      ].join(' ')}
      {...buttonProps}
    >
      {loading ? <LoaderCircle aria-label="Loading" className="size-5 animate-spin" /> : label}
    </button>
  );
}
