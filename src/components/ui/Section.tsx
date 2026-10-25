import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'section'> & {
  theme?: 'light' | 'dark';
  // flush — без вертикальных полей, для полноэкранных блоков
  spacing?: 'default' | 'tight' | 'flush';
};

const spacingClass = {
  default: 'py-[var(--section-y)]',
  tight: 'py-[calc(var(--section-y)*0.55)]',
  flush: '',
};

export function Section({ theme = 'light', spacing = 'default', className, ...rest }: Props) {
  return (
    <section
      data-theme={theme}
      data-section=""
      className={cn(
        'relative bg-bg text-fg',
        spacingClass[spacing],
        // две секции одной темы подряд: верхнее поле второй съедаем, иначе между ними двойной зазор
        spacing === 'default' &&
          (theme === 'light'
            ? '[[data-section][data-theme=light]+&]:pt-0'
            : '[[data-section][data-theme=dark]+&]:pt-0'),
        className,
      )}
      {...rest}
    />
  );
}
