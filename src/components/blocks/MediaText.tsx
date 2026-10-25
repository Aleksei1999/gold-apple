import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

type Props = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  media: { src: string; alt: string; ratio?: string };
  // картинка справа
  reverse?: boolean;
  theme?: 'light' | 'dark';
};

export function MediaText({ id, eyebrow, title, children, media, reverse, theme }: Props) {
  return (
    <Section id={id} theme={theme}>
      <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
        <div className={cn('md:col-span-6', reverse && 'md:order-2 md:col-start-7')}>
          <Parallax
            src={media.src}
            alt={media.alt}
            ratio={media.ratio ?? '4 / 5'}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <Reveal className={cn('md:col-span-5', reverse ? 'md:order-1' : 'md:col-start-8')}>
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <Heading>{title}</Heading>
          <div className="mt-8 space-y-5 text-fg/80">{children}</div>
        </Reveal>
      </Container>
    </Section>
  );
}
