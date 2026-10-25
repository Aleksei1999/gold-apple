import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { nb } from '@/lib/typo';

type Level = 1 | 2 | 3 | 4;
type Size = 'display' | 'h1' | 'h2' | 'h3' | 'h4';

type Props = ComponentPropsWithoutRef<'h2'> & {
  level?: Level;
  // размер отвязан от уровня: h2 на странице может быть набран как display
  size?: Size;
};

const sizeClass: Record<Size, string> = {
  display: 'font-display text-display [font-weight:var(--weight-display)]',
  h1: 'font-display text-h1 [font-weight:var(--weight-display)]',
  h2: 'font-display text-h2 [font-weight:var(--weight-display)]',
  h3: 'font-display text-h3',
  h4: 'font-sans text-h4 font-medium',
};

export function Heading({ level = 2, size, className, children, ...rest }: Props) {
  const Tag = `h${level}` as const;
  const s = size ?? (`h${level}` as Size);
  return (
    <Tag className={cn(sizeClass[s], className)} {...rest}>
      {nb(children)}
    </Tag>
  );
}
