'use client';

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { Fragment } from 'react';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/cn';

// слова проявляются из размытия и чуть поднимаются, по очереди: при загрузке (onMount) или когда блок в кадре
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
  // после появления фильтр снимаем совсем, чтобы ничего не подрезал
  const shown = { y: '0em', opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } };
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
          {/* без overflow-hidden: росчерки каллиграфии выходят за строку и маска их режет */}
          <span className="inline-block">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '0.35em', opacity: 0, filter: 'blur(10px)' }, shown }}
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
  // запас 1em со всех сторон под росчерки; открытая надпись без маски вовсе
  const clipPath = useTransform(reveal, (v) =>
    v <= 0.5 ? 'none' : `inset(-1em calc(${v}% - ${((100 - v) / 100).toFixed(2)}em) -1em -1em)`,
  );
  const filter = useTransform(progress, [a, b], ['blur(4px)', 'blur(0px)']);
  return (
    <motion.span style={{ clipPath, filter }} className="inline-block">
      {text}
    </motion.span>
  );
}
