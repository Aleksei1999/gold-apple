import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHead } from './SectionHead';

// when — реальный срок этапа («2 недели», «после договора»), он полезнее порядкового номера
export type Step = { title: string; text: ReactNode; when?: string };

type Props = {
  id?: string;
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  steps: Step[];
  theme?: 'light' | 'dark';
};

export function Process({ id, title, eyebrow, lead, steps, theme = 'dark' }: Props) {
  return (
    <Section id={id} theme={theme}>
      <Container>
        <SectionHead title={title} eyebrow={eyebrow} lead={lead} />
        <ol className="border-t border-line">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 0.04}
              className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <p className="text-small text-muted md:col-span-3">{s.when}</p>
              <h3 className="font-display text-h3 md:col-span-4">{s.title}</h3>
              <div className="text-muted md:col-span-5">{s.text}</div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
