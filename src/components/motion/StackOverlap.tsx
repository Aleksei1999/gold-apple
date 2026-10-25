import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/*
  Следующий блок наезжает на предыдущий, пока тот стоит на месте.
  Предыдущий должен держать sticky-экран на последних 100svh своей высоты:
  ScrollSequence делает это сам, для обычного блока оберните его в <Pinned>.
*/
export function StackOverlap({
  theme = 'light',
  rounded = true,
  className,
  ...rest
}: ComponentPropsWithoutRef<'section'> & { theme?: 'light' | 'dark'; rounded?: boolean }) {
  return (
    <section
      data-theme={theme}
      className={cn(
        'relative z-10 -mt-[100svh] min-h-svh bg-bg text-fg shadow-[0_-24px_60px_rgb(0_0_0/0.28)]',
        rounded && 'rounded-t-[var(--round-lg)] md:rounded-t-[calc(var(--round-lg)*2)]',
        className,
      )}
      {...rest}
    />
  );
}

// держит содержимое прибитым к экрану на один лишний экран прокрутки
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative h-[200svh]', className)}>
      <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
    </div>
  );
}
