'use client';

import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useState } from 'react';
import { ScrollSequence } from '@/components/motion/ScrollSequence';
import { asset } from '@/lib/asset';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { SCENTS, type Scent } from '@/site.config';

const COUNT = 255;

// флакон по центру-слева, девушка справа: на телефоне ведём кадр между ними
const FOCUS: [number[], number[]] = [
  [0, 254],
  [0.52, 0.52],
];

// на телефоне кадр целиком по ширине ×1.9 над текстом, края уходят в чёрный фон секции
const PORTRAIT = { scale: 1.9, y: 0.4, matte: '#0c0b0a' };

// сцены сменяются на кадрах 0, 64, 128, 191, 254; прокрутка без остановок
const RANGES: [number, number][] = [
  [0.03, 0.12],
  [0.17, 0.3],
  [0.4, 0.53],
  [0.63, 0.76],
  [0.86, 1],
];

export function ScentsFlight() {
  return (
    // наезжает на последний экран первого блока: стекло растворяется прямо в первую сцену
    <div id="scents" className="relative z-10 -mt-[100svh]">
      <ScrollSequence
        frames={{ dir: '/scents', count: COUNT }}
        length={14}
        focus={FOCUS}
        portrait={PORTRAIT}
        scrim={false}
        label="The five scents"
      >
        {(p) => (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/25" />
            {SCENTS.map((s, i) => (
              <Chapter key={s.id} scent={s} progress={p} range={RANGES[i]} last={i === 4} />
            ))}
            <Strip progress={p} />
            <GlassOut progress={p} />
          </>
        )}
      </ScrollSequence>
    </div>
  );
}

function Chapter({
  scent,
  progress,
  range: [a, b],
  last,
}: {
  scent: Scent;
  progress: MotionValue<number>;
  range: [number, number];
  last: boolean;
}) {
  const edge = (b - a) * 0.25;
  const opacity = useTransform(
    progress,
    last ? [a, a + edge] : [a, a + edge, b - edge, b],
    last ? [0, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [a, a + edge], [30, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-0 bottom-[calc(5.5rem+4svh)] md:bottom-[calc(5rem+6svh)]"
    >
      <Container className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="text-small uppercase tracking-[0.2em] text-fg/75">{scent.mood}</p>
          <h2 className="display-script mt-3 text-[clamp(3rem,1.4rem+6.5vw,7.5rem)]">
            {scent.name}
          </h2>
        </div>
        <div className="max-md:hidden md:col-span-4 md:col-start-9">
          <p className="text-body text-fg/85">{scent.text}</p>
          <p className="mt-4 text-small uppercase tracking-[0.16em] text-fg/65">
            {scent.notes.join(' · ')}
          </p>
        </div>
      </Container>
    </motion.div>
  );
}

// полоска с названиями внизу, как вкладки: подсвечено то, что сейчас на экране
function Strip({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, 'change', (v) => {
    let i = 0;
    RANGES.forEach(([a], k) => {
      if (v >= a - 0.03) i = k;
    });
    if (i !== active) setActive(i);
  });
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-white/15">
      <Container className="flex gap-6 overflow-x-auto py-4 md:justify-between">
        {SCENTS.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap text-small uppercase tracking-[0.16em] transition-colors duration-500',
              i === active ? 'text-fg' : 'text-fg/40',
            )}
          >
            <span
              className="h-2 w-2 rounded-full transition-transform duration-500"
              style={{ background: s.tint, transform: `scale(${i === active ? 1 : 0.6})` }}
            />
            {s.name}
          </span>
        ))}
      </Container>
    </div>
  );
}

// последний кадр стекла поверх первой сцены: размывается и тает, пар уступает место золотой комнате
function GlassOut({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.004, 0.06], [1, 0]);
  const blur = useTransform(progress, [0.004, 0.05], ['blur(0px)', 'blur(18px)']);
  const scale = useTransform(progress, [0.004, 0.06], [1, 1.06]);
  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0">
      <motion.img
        src={asset('/glass/095.webp')}
        alt=""
        aria-hidden
        style={{ filter: blur, scale }}
        className="absolute inset-0 h-full w-full object-cover object-[56%_50%]"
      />
      {/* то же затемнение слева, что у первого блока, иначе на стыке кадр мигнёт */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
    </motion.div>
  );
}
