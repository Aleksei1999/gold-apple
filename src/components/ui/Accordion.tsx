'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { duration, ease } from '@/lib/motion';

export type AccordionItem = { title: string; content: ReactNode };

type Props = {
  items: AccordionItem[];
  // несколько открытых одновременно
  multiple?: boolean;
  defaultOpen?: number[];
  className?: string;
};

export function Accordion({ items, multiple, defaultOpen = [], className }: Props) {
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const id = useId();

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : multiple ? [...cur, i] : [i]));

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const panel = `${id}-panel-${i}`;
        const button = `${id}-button-${i}`;
        return (
          <div key={item.title} className="border-b border-line">
            <h3>
              <button
                id={button}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left text-h4 font-medium"
              >
                {item.title}
                <span
                  aria-hidden
                  className={cn(
                    'relative mt-[0.45em] h-3 w-3 shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-45',
                  )}
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-current" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panel}
                  role="region"
                  aria-labelledby={button}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <div className="max-w-[62ch] pb-6 text-muted">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
