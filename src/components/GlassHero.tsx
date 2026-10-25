'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ScrollSequence } from '@/components/motion/ScrollSequence';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/site.config';

// девушка за стеклом стоит правее центра: на телефоне держим её в кадре
const FOCUS: [number[], number[]] = [
  [0, 95],
  [0.56, 0.56],
];

export function GlassHero() {
  return (
    <ScrollSequence
      frames={{ dir: '/glass', count: 96 }}
      length={4}
      // ладонь протирает стекло за первые три экрана, последний экран — золотая вспышка
      keyframes={[
        [0, 0.72],
        [0, 95],
      ]}
      focus={FOCUS}
      scrim={false}
      label="Gold Apple Eau de Parfum"
    >
      {(p) => (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
          <Intro progress={p} />
          <Glow progress={p} />
        </>
      )}
    </ScrollSequence>
  );
}

function Intro({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.55, 0.7], [1, 1, 0]);
  const hint = useTransform(progress, [0, 0.05], [1, 0]);
  return (
    <>
      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-[10svh] md:bottom-[12svh]"
      >
        <Container>
          <p className="text-small font-medium uppercase tracking-[0.2em] text-fg/70">
            Gold Apple · Eau de Parfum
          </p>
          <h1 className="display-caps mt-4 max-w-[9ch] text-[clamp(3.25rem,1.6rem+7vw,8.5rem)]">
            Every scent reveals a new you
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={site.cta.href} size="lg">
              {site.cta.label}
            </Button>
            <span className="text-small text-fg/70">Five characters. One bottle.</span>
          </div>
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

// пар на стекле разгорается золотом: этим же светом открывается следующий блок
function Glow({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.7, 0.93], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_55%_45%,#fff3d1_0%,#f0c46e_45%,#b07a2a_100%)]"
    />
  );
}
