import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

// одна-две на страницу, для фактов вроде «Новое» или «Сдан в 2025»; не для украшения
export function Badge({ className, ...rest }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-line px-2 py-1 text-eyebrow uppercase text-muted',
        className,
      )}
      {...rest}
    />
  );
}
