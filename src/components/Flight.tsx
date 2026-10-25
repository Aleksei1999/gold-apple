'use client';

import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useState } from 'react';
import { ScrollSequence } from '@/components/motion/ScrollSequence';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ScrollWrite, Words } from '@/components/Words';
import { cn } from '@/lib/cn';
import { SCENTS, site, type Scent } from '@/site.config';

// одна лента: стекло 0–95, растворение 96–119, ароматы 120–374 (сцены на 120, 184, 248, 311, 374)
const COUNT = 375;
const LENGTH = 18;

// стекло — 3 экрана, растворение — меньше экрана, ароматы — остальное; без остановок
const KEYFRAMES: [number[], number[]] = [
  [0, 0.1667, 0.2111, 0.9444],
  [0, 95, 120, 374],
];

// девушка за стеклом правее центра, в сценах — между флаконом и девушкой
const FOCUS: [number[], number[]] = [
  [0, 95, 120, 374],
  [0.56, 0.56, 0.52, 0.52],
];

// на телефоне стекло на весь экран, а с растворения кадр съезжает в полосу над текстом
const PORTRAIT = { scale: 1.9, y: 0.4, matte: '#0c0b0a', ramp: [96, 120] as [number, number] };

const RANGES: [number, number][] = [
  [0.205, 0.3],
  [0.35, 0.44],
  [0.535, 0.625],
  [0.715, 0.805],
  [0.88, 1],
];

export function Flight() {
  return (
    <div id="scents">
      <ScrollSequence
        frames={{ dir: '/flight', count: COUNT }}
        length={LENGTH}
        keyframes={KEYFRAMES}
        focus={FOCUS}
        portrait={PORTRAIT}
        scrim={false}
        label="Gold Apple Eau de Parfum"
      >
        {(p) => (
          <>
            <Shade progress={p} />
            <Intro progress={p} />
            {SCENTS.map((s, i) => (
              <Chapter key={s.id} scent={s} progress={p} range={RANGES[i]} last={i === 4} />
            ))}
            <Strip progress={p} />
          </>
        )}
      </ScrollSequence>
    </div>
  );
}

// слева темнее под заголовком у стекла, снизу темнее под названиями ароматов
function Shade({ progress }: { progress: MotionValue<number> }) {
  const glass = useTransform(progress, [0.15, 0.2], [1, 0]);
  const scents = useTransform(progress, [0.18, 0.22], [0, 1]);
  return (
    <>
      <motion.div
        style={{ opacity: glass }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent"
      />
      <motion.div
        style={{ opacity: scents }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/25"
      />
    </>
  );
}

function Intro({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.11, 0.15], [1, 1, 0]);
  const y = useTransform(progress, [0.11, 0.15], [0, -40]);
  const hint = useTransform(progress, [0, 0.012], [1, 0]);
  return (
    <>
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-x-0 bottom-[10svh] md:bottom-[12svh]"
      >
        <Container>
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-small font-medium uppercase text-fg/70"
          >
            Gold Apple · Eau de Parfum
          </motion.p>
          <h1 className="display-script mt-4 max-w-[9ch] text-[clamp(3.25rem,1.6rem+7vw,8.5rem)]">
            <Words text="Every scent reveals a new you" onMount delay={0.3} />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <Button href={site.cta.href} size="lg">
              {site.cta.label}
            </Button>
            <span className="text-small text-fg/70">Five characters. One bottle.</span>
          </motion.div>
        </Container>
      </motion.div>
      <motion.p
        style={{ opacity: hint }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-small uppercase tracking-[0.2em] text-fg/60"
      >
        Scroll to wipe the glass
      </motion.p>
    </>
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
    last ? [a, a + 0.001] : [a, a + 0.001, b - edge, b],
    last ? [0, 1] : [0, 1, 1, 0],
  );
  const out = useTransform(progress, [b - edge, b], [0, last ? 0 : -30]);
  const mood = useTransform(progress, [a, a + edge * 0.6], [0, 1]);
  const side = useTransform(progress, [a + edge * 0.6, a + edge * 1.4], [0, 1]);
  const sideY = useTransform(progress, [a + edge * 0.6, a + edge * 1.4], [20, 0]);
  return (
    <motion.div
      style={{ opacity, y: out }}
      className="pointer-events-none absolute inset-x-0 bottom-[calc(5.5rem+4svh)] md:bottom-[calc(5rem+6svh)]"
    >
      <Container className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <motion.p
            style={{ opacity: mood }}
            className="text-small uppercase tracking-[0.2em] text-fg/75"
          >
            {scent.mood}
          </motion.p>
          <h2 className="display-script mt-3 text-[clamp(3rem,1.4rem+6.5vw,7.5rem)]">
            <ScrollWrite text={scent.name} progress={progress} range={[a, a + edge * 1.2]} />
          </h2>
        </div>
        <motion.div
          style={{ opacity: side, y: sideY }}
          className="max-md:hidden md:col-span-4 md:col-start-9"
        >
          <p className="text-body text-fg/85">{scent.text}</p>
          <p className="mt-4 text-small uppercase tracking-[0.16em] text-fg/65">
            {scent.notes.join(' · ')}
          </p>
        </motion.div>
      </Container>
    </motion.div>
  );
}

// полоска с названиями внизу, как вкладки: подсвечено то, что сейчас на экране
function Strip({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  const opacity = useTransform(progress, [0.19, 0.23], [0, 1]);
  useMotionValueEvent(progress, 'change', (v) => {
    let i = 0;
    RANGES.forEach(([a], k) => {
      if (v >= a - 0.03) i = k;
    });
    if (i !== active) setActive(i);
  });
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-x-0 bottom-0 border-t border-white/15"
    >
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
    </motion.div>
  );
}
