'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Image } from '@/components/ui/Image';
import { Reveal } from '@/components/motion/Reveal';
import {
  ScrollSequence,
  type SequenceCallout,
  type SequenceFrames,
} from '@/components/motion/ScrollSequence';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';
import { nb } from '@/lib/typo';

type Base = {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: string;
  actions?: ReactNode;
  // строка под первым экраном: адрес, сроки, факт — не выдуманные цифры
  aside?: ReactNode;
};

type BigType = Base & { variant: 'big-type' };
type Media = Base & {
  variant: 'media';
  media: { src: string; alt: string; video?: string };
};
type Sequence = Base & {
  variant: 'sequence';
  frames: SequenceFrames;
  length?: number;
  keyframes?: [number[], number[]];
  callouts?: SequenceCallout[];
  // доля прокрутки, за которую уходит заголовок
  introOut?: number;
  // что показать поверх кадров дальше по скроллу
  overlay?: (progress: MotionValue<number>) => ReactNode;
};

export type HeroProps = BigType | Media | Sequence;

export function Hero(props: HeroProps) {
  if (props.variant === 'media') return <MediaHero {...props} />;
  if (props.variant === 'sequence') return <SequenceHero {...props} />;
  return <BigTypeHero {...props} />;
}

function Copy({ title, lead, eyebrow, actions, aside, className }: Base & { className?: string }) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow className="mb-6 text-fg/70">{eyebrow}</Eyebrow>}
      <h1 className="font-display text-display [font-weight:var(--weight-display)]">{nb(title)}</h1>
      {(lead || actions) && (
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          {lead && <p className="max-w-[46ch] text-body text-fg/80">{nb(lead)}</p>}
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      )}
      {aside && (
        <div className="mt-12 border-t border-line pt-5 text-small text-muted">{aside}</div>
      )}
    </div>
  );
}

function BigTypeHero(props: BigType) {
  return (
    <section data-theme="light" className="bg-bg text-fg">
      <Container className="flex min-h-[88svh] flex-col justify-end pb-[calc(var(--section-y)*0.5)] pt-[calc(var(--header-h)+4rem)]">
        <Reveal>
          <Copy {...props} />
        </Reveal>
      </Container>
    </section>
  );
}

function MediaHero({ media, ...props }: Media) {
  return (
    <section
      data-theme="dark"
      className="relative isolate flex min-h-svh items-end overflow-hidden"
    >
      {media.video ? (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={asset(media.video)}
          poster={asset(media.src)}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      ) : (
        <Image src={media.src} alt={media.alt} priority className="absolute inset-0 -z-10 h-full" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />
      <Container className="pb-[calc(var(--section-y)*0.5)] pt-[calc(var(--header-h)+4rem)]">
        <Reveal>
          <Copy {...props} />
        </Reveal>
      </Container>
    </section>
  );
}

function SequenceHero({
  frames,
  length,
  keyframes,
  callouts,
  introOut = 0.08,
  overlay,
  ...copy
}: Sequence) {
  return (
    <ScrollSequence
      frames={frames}
      length={length}
      keyframes={keyframes}
      callouts={callouts}
      label={typeof copy.title === 'string' ? copy.title : undefined}
    >
      {(progress) => (
        <>
          <SequenceIntro progress={progress} out={introOut} {...copy} />
          {overlay?.(progress)}
        </>
      )}
    </ScrollSequence>
  );
}

function SequenceIntro({
  progress,
  out,
  ...copy
}: Base & { progress: MotionValue<number>; out: number }) {
  const opacity = useTransform(progress, [0, out], [1, 0]);
  const y = useTransform(progress, [0, out], [0, -60]);
  const hint = useTransform(progress, [0, out * 0.4], [1, 0]);
  return (
    <>
      <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-[12svh]">
        <Container>
          <Copy {...copy} />
        </Container>
      </motion.div>
      <motion.p
        style={{ opacity: hint }}
        className={cn(
          'absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap',
          'text-eyebrow uppercase text-fg/60',
        )}
      >
        Листайте вниз
      </motion.p>
    </>
  );
}
