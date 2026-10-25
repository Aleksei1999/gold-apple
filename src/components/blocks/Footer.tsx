import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { site } from '@/site.config';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-theme="dark" className="bg-bg pb-8 pt-16 text-fg md:pt-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="display-script text-[clamp(3rem,1.5rem+6vw,7rem)]">{site.name}</p>
            <p className="mt-4 max-w-[36ch] text-small text-muted">{site.tagline}.</p>
          </div>
          <nav aria-label="Sections" className="md:col-span-3 md:col-start-8 md:pt-4">
            <ul className="space-y-2 text-small">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-fg/75 hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-small text-muted md:flex-row md:justify-between">
          <span>© {year} Concept by Fomenko. Not an official Gold Apple website or product.</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
