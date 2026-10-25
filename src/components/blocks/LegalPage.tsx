import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Footer } from './Footer';
import { Header } from './Header';

type Props = { title: string; updated: string; children: ReactNode };

export function LegalPage({ title, updated, children }: Props) {
  return (
    <>
      <Header transparentAtTop={false} />
      <main data-theme="light" className="bg-bg pb-24 pt-[calc(var(--header-h)+4rem)] text-fg">
        <Container narrow>
          <h1 className="font-display text-h2 md:text-h1">{title}</h1>
          <p className="mt-4 text-small text-muted">Last updated {updated}</p>
          <article className="mt-12 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-h4 [&_h2]:font-medium [&_li]:mt-1 [&_p]:mt-3 [&_p]:text-fg/85 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
