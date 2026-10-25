import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHead } from './SectionHead';

// только настоящие отзывы с разрешения клиента; без них блок лучше убрать
export type Testimonial = { quote: string; name: string; role?: string; photo?: string };

type Props = {
  id?: string;
  title?: ReactNode;
  eyebrow?: string;
  items: Testimonial[];
  theme?: 'light' | 'dark';
};

export function Testimonials({ id, title, eyebrow, items, theme }: Props) {
  const [first, ...rest] = items;
  return (
    <Section id={id} theme={theme}>
      <Container>
        {title && <SectionHead title={title} eyebrow={eyebrow} />}
        {first && (
          <Reveal>
            <figure>
              <blockquote className="font-display text-h2 md:max-w-[24ch]">
                «{first.quote}»
              </blockquote>
              <Author t={first} />
            </figure>
          </Reveal>
        )}
        {rest.length > 0 && (
          <ul className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-24 md:grid-cols-2 md:gap-16">
            {rest.map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 0.06}>
                <figure>
                  <blockquote className="text-h4">«{t.quote}»</blockquote>
                  <Author t={t} />
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}

function Author({ t }: { t: Testimonial }) {
  return (
    <figcaption className="mt-6 flex items-center gap-4 text-small">
      {t.photo && (
        <Image src={t.photo} alt="" ratio="1 / 1" className="h-11 w-11 rounded-full" sizes="44px" />
      )}
      <span>
        <span className="block font-medium">{t.name}</span>
        {t.role && <span className="block text-muted">{t.role}</span>}
      </span>
    </figcaption>
  );
}
