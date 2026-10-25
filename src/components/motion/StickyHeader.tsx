'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Theme = 'light' | 'dark';

type Props = {
  children: ReactNode;
  // над первым экраном шапка прозрачная, фон появляется после прокрутки
  transparentAtTop?: boolean;
  // прятать при прокрутке вниз, показывать при прокрутке вверх
  autoHide?: boolean;
  className?: string;
};

// берёт тему секции, которая сейчас под шапкой: тёмный блок — светлый текст, и наоборот
export function StickyHeader({ children, transparentAtTop = true, autoHide, className }: Props) {
  const [theme, setTheme] = useState<Theme>('light');
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const probe = 36;

    const check = () => {
      raf = 0;
      const y = window.scrollY;
      let found: Theme = 'light';
      for (const el of document.querySelectorAll<HTMLElement>('[data-theme]')) {
        if (el.closest('header')) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) found = el.dataset.theme as Theme;
      }
      setTheme(found);
      setAtTop(y < 8);
      if (autoHide) setHidden(y > 200 && y > lastY);
      lastY = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [autoHide]);

  const clear = transparentAtTop && atTop;

  return (
    <header
      data-theme={theme}
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-[var(--header-h)] text-fg transition-[background-color,color,transform,border-color] duration-300 ease-out',
        clear ? 'border-b border-transparent bg-transparent' : 'border-b border-line',
        hidden && '-translate-y-full',
        className,
      )}
    >
      {children}
    </header>
  );
}
