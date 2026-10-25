import type { ReactNode } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';

export type Question = { q: string; a: string };

type Props = {
  id?: string;
  title: ReactNode;
  eyebrow?: string;
  aside?: ReactNode;
  items: Question[];
  theme?: 'light' | 'dark';
};

export function FAQ({ id, title, eyebrow, aside, items, theme }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
  return (
    <Section id={id} theme={theme}>
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <Heading>{title}</Heading>
          {aside && <div className="mt-6 text-muted">{aside}</div>}
        </div>
        <Accordion
          className="md:col-span-7 md:col-start-6"
          items={items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))}
        />
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
