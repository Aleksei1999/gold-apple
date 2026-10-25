import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';
import { asset } from '@/lib/asset';

export type Logo = { name: string; src?: string };

type Props = {
  title?: string;
  logos: Logo[];
  // бегущая строка для 7+ логотипов, иначе ровный ряд
  marquee?: boolean;
};

function Item({ logo }: { logo: Logo }) {
  return logo.src ? (
    <img
      src={asset(logo.src)}
      alt={logo.name}
      loading="lazy"
      className="h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-8"
    />
  ) : (
    <span className="whitespace-nowrap font-display text-h4 text-fg/60">{logo.name}</span>
  );
}

export function LogoStrip({ title, logos, marquee = logos.length > 6 }: Props) {
  return (
    <section data-theme="light" className="border-y border-line bg-bg py-10 text-fg md:py-14">
      {title && (
        <Container>
          <p className="mb-8 text-small text-muted">{title}</p>
        </Container>
      )}
      {marquee ? (
        <Marquee>
          {logos.map((l) => (
            <Item key={l.name} logo={l} />
          ))}
        </Marquee>
      ) : (
        <Container>
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {logos.map((l) => (
              <li key={l.name}>
                <Item logo={l} />
              </li>
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
}
