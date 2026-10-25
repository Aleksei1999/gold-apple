import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  // секунд на один проход
  speed?: number;
  reverse?: boolean;
  className?: string;
};

export function Marquee({ children, speed = 40, reverse, className }: Props) {
  return (
    <div
      className={cn('group relative flex overflow-hidden motion-reduce:overflow-x-auto', className)}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className="flex shrink-0 animate-[marquee_var(--speed)_linear_infinite] items-center gap-[var(--gap)] pr-[var(--gap)] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={
            {
              '--speed': `${speed}s`,
              '--gap': 'clamp(2rem, 1rem + 4vw, 5rem)',
              animationDirection: reverse ? 'reverse' : undefined,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      ))}
    </div>
  );
}
