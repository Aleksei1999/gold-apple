'use client';

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { Fragment } from 'react';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/cn';

// слова выезжают снизу из-под маски по очереди: при загрузке (onMount) или когда блок в кадре
export function Words({
  text,
  className,
  delay = 0,
  onMount,
}: {
  text: string;
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  if (reduced) return <span className={className}>{text}</span>;
  const shown = { y: '0%', opacity: 1, filter: 'blur(0px)' };
  return (
    <motion.span
      className={cn('inline', className)}
      initial="hidden"
      {...(onMount
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {words.map((w, i) => (
        // пробел снаружи маски: внутри inline-block он схлопывается
        <Fragment key={i}>
          {/* pb/-mb: хвосты каллиграфии не обрезаются маской */}
          <span className="-mb-[0.25em] inline-block overflow-hidden pb-[0.25em] pr-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '110%', opacity: 0, filter: 'blur(6px)' }, shown }}
              transition={{ duration: 0.9, ease: ease.out }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.span>
  );
}

// надпись «пишется» слева направо по прокрутке: маска открывает каллиграфию, не разрывая связки букв
export function ScrollWrite({
  text,
  progress,
  range: [a, b],
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const reveal = useTransform(progress, [a, b], [100, 0]);
  const clipPath = useTransform(reveal, (v) => `inset(-0.3em ${v}% -0.4em -0.2em)`);
  const filter = useTransform(progress, [a, b], ['blur(4px)', 'blur(0px)']);
  return (
    <motion.span style={{ clipPath, filter }} className="inline-block">
      {text}
    </motion.span>
  );
}
