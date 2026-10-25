import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { SectionHead } from './SectionHead';

export type Work = {
  title: string;
  meta: string;
  src: string;
  alt: string;
  href?: string;
};

type Props = {
  id?: string;
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  items: Work[];
  theme?: 'light' | 'dark';
};

// ритм сетки: крупная карточка, две поменьше со сдвигом — чтобы не было ровной плитки
const layout = [
  'md:col-span-7',
  'md:col-span-5 md:mt-32',
  'md:col-span-5 md:mt-12',
  'md:col-span-6 md:col-start-7',
];
const ratios = ['4 / 3', '4 / 5', '4 / 5', '3 / 2'];

export function Showcase({ id, title, eyebrow, lead, items, theme }: Props) {
  return (
    <Section id={id} theme={theme}>
      <Container>
        <SectionHead title={title} eyebrow={eyebrow} lead={lead} />
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-12 md:gap-y-24">
          {items.map((w, i) => (
            <Reveal as="li" key={w.title} className={layout[i % layout.length]}>
              <Card work={w} ratio={ratios[i % ratios.length]} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function Card({ work, ratio }: { work: Work; ratio: string }) {
  const body = (
    <>
      <div className="overflow-hidden rounded-sm bg-surface">
        <Image
          src={work.src}
          alt={work.alt}
          ratio={ratio}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h3 className="text-h4 font-medium">{work.title}</h3>
        <p className="shrink-0 text-small text-muted">{work.meta}</p>
      </div>
    </>
  );
  return work.href ? (
    <Link href={work.href} className={cn('group block')}>
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  );
}
