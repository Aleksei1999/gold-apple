'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';

type Props = {
  src: string;
  alt: string;
  ratio?: string;
  // насколько картинка отстаёт от скролла, в процентах высоты
  strength?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Parallax({
  src,
  alt,
  ratio = '4 / 5',
  strength = 8,
  sizes = '100vw',
  priority,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden bg-surface', className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.img
        src={asset(src)}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // запас по высоте, чтобы при сдвиге не открывались края
        style={reduced ? undefined : { y, scale: 1 + (strength * 2.2) / 100 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
