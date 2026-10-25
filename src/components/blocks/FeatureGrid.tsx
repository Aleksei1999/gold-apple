import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { SectionHead } from './SectionHead';

export type Feature = { title: string; text: ReactNode };

type Props = {
  id?: string;
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  items: Feature[];
  columns?: 2 | 3 | 4;
  theme?: 'light' | 'dark';
};

const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 xl:grid-cols-4' };

export function FeatureGrid({ id, title, eyebrow, lead, items, columns = 3, theme }: Props) {
  return (
    <Section id={id} theme={theme}>
      <Container>
        <SectionHead title={title} eyebrow={eyebrow} lead={lead} />
        <ul className={cn('grid gap-x-10 gap-y-12', cols[columns])}>
          {items.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.06} className="border-t border-fg pt-6">
              <h3 className="text-h4 font-medium">{f.title}</h3>
              <div className="mt-4 text-muted">{f.text}</div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
