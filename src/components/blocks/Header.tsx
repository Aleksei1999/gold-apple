'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StickyHeader } from '@/components/motion/StickyHeader';
import { cn } from '@/lib/cn';
import { site } from '@/site.config';

export function Header({ transparentAtTop = true }: { transparentAtTop?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <StickyHeader transparentAtTop={transparentAtTop && !open} alwaysClear={!open}>
      <div className="mx-auto flex h-full max-w-[var(--container)] items-center justify-between gap-6 px-[var(--gutter)]">
        <Link href="/" className="display-script text-[2.25rem] leading-none">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-small text-fg/75 transition-colors hover:text-fg"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Button href={site.cta.href} size="sm">
              {site.cta.label}
            </Button>
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span
              className={cn(
                'absolute h-px w-6 bg-current transition-transform duration-300',
                open ? 'rotate-45' : '-translate-y-[4px]',
              )}
            />
            <span
              className={cn(
                'absolute h-px w-6 bg-current transition-transform duration-300',
                open ? '-rotate-45' : 'translate-y-[4px]',
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        data-lenis-prevent
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-bg px-[var(--gutter)] pb-10 pt-6 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-h3"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Button href={site.cta.href} onClick={() => setOpen(false)} className="mt-8 w-full">
          {site.cta.label}
        </Button>
        <div className="mt-8 flex flex-col gap-1 text-small text-muted">
          <span>{site.tagline}</span>
          <a href={`mailto:${site.contacts.email}`}>{site.contacts.email}</a>
        </div>
      </div>
    </StickyHeader>
  );
}
