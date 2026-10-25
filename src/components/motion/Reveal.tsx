'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { duration, ease } from '@/lib/motion';

type Props = {
  children: ReactNode;
  // откуда приезжает: снизу, слева, справа или просто проявляется
  from?: 'up' | 'left' | 'right' | 'none';
  delay?: number;
  distance?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
};

export function Reveal({
  children,
  from = 'up',
  delay = 0,
  distance = 28,
  className,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const offset = {
    up: { y: distance },
    left: { x: -distance },
    right: { x: distance },
    none: {},
  }[from];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    >
      {children}
    </Tag>
  );
}
