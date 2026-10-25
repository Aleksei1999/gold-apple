import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, keyof Common>;
type AsButton = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    keyof Common
  >;

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-fg hover:text-bg',
  secondary: 'border border-fg/30 text-fg hover:border-fg hover:bg-fg hover:text-bg',
  ghost: 'text-fg underline decoration-fg/30 underline-offset-[6px] hover:decoration-fg',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-small',
  md: 'h-12 px-6 text-small',
  lg: 'h-14 px-8 text-body',
};

export function buttonClass({ variant = 'primary', size = 'md', className }: Partial<Common>) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium',
    'transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50',
    variant === 'ghost' ? 'h-auto px-0' : sizes[size],
    variants[variant],
    className,
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant, size, className, children, ...rest } = props;
  const cls = buttonClass({ variant, size, className });

  if (rest.href !== undefined) {
    const { href, ...a } = rest as AsLink;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      const blank = href.startsWith('http');
      return (
        <a
          href={href}
          className={cls}
          {...(blank ? { target: '_blank', rel: 'noreferrer' } : {})}
          {...a}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...a}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...b } = rest as AsButton;
  return (
    <button type={type} className={cls} {...b}>
      {children}
    </button>
  );
}
