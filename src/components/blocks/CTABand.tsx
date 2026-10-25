import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { nb } from '@/lib/typo';

type Props = {
  title: ReactNode;
  text?: ReactNode;
  actions: ReactNode;
  theme?: 'light' | 'dark';
};

export function CTABand({ title, text, actions, theme = 'dark' }: Props) {
  return (
    <Section theme={theme} spacing="tight">
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
          <div>
            <h2 className="max-w-[18ch] font-display text-h1 [font-weight:var(--weight-display)]">
              {nb(title)}
            </h2>
            {text && <p className="mt-6 max-w-[48ch] text-muted">{nb(text)}</p>}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
        </Reveal>
      </Container>
    </Section>
  );
}
