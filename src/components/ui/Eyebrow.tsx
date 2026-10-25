import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

// подпись над заголовком: ставить только там, где она что-то сообщает, не над каждым блоком
export function Eyebrow({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-eyebrow font-medium uppercase text-muted', className)} {...rest} />;
}
