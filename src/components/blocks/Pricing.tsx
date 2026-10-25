import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { SectionHead } from './SectionHead';

export type Tier = {
  name: string;
  price: string;
  // за что цена: «за м²», «за проект», «в месяц»
  unit?: string;
  text?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

type Props = {
  id?: string;
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  tiers: Tier[];
  note?: ReactNode;
  theme?: 'light' | 'dark';
};

export function Pricing({ id, title, eyebrow, lead, tiers, note, theme }: Props) {
  return (
    <Section id={id} theme={theme}>
      <Container>
        <SectionHead title={title} eyebrow={eyebrow} lead={lead} />
        <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal
              as="li"
              key={t.name}
              delay={i * 0.06}
              className={cn('flex flex-col bg-bg p-6 md:p-8', t.featured && 'bg-surface')}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-h4 font-medium">{t.name}</h3>
                {t.featured && <span className="text-small text-accent">Чаще выбирают</span>}
              </div>
              <p className="mt-8 font-display text-h2">
                {t.price}
                {t.unit && <span className="ml-2 font-sans text-small text-muted">{t.unit}</span>}
              </p>
              {t.text && <p className="mt-4 text-small text-muted">{t.text}</p>}
              <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6 text-small">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-fg/50" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href={t.cta.href}
                variant={t.featured ? 'primary' : 'secondary'}
                className="mt-10 w-full"
              >
                {t.cta.label}
              </Button>
            </Reveal>
          ))}
        </ul>
        {note && <p className="mt-6 max-w-[70ch] text-small text-muted">{note}</p>}
      </Container>
    </Section>
  );
}
