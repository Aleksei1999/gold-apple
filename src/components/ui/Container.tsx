import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/cn';

type Props<T extends ElementType> = {
  as?: T;
  narrow?: boolean;
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = 'div'>({
  as,
  narrow,
  className,
  ...rest
}: Props<T>) {
  const Tag = as ?? 'div';
  return (
    <Tag
      className={cn(
        'mx-auto w-full px-[var(--gutter)]',
        narrow
          ? 'max-w-[calc(var(--container-narrow)+2*var(--gutter))]'
          : 'max-w-[var(--container)]',
        className,
      )}
      {...rest}
    />
  );
}
