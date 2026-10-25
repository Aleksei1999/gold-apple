import { Footer } from '@/components/blocks/Footer';
import { Header } from '@/components/blocks/Header';
import { GlassHero } from '@/components/GlassHero';
import { Reveal } from '@/components/motion/Reveal';
import { ScentsFlight } from '@/components/ScentsFlight';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { SCENTS } from '@/site.config';

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <GlassHero />
        <ScentsFlight />

        <section data-theme="light" id="find" className="bg-bg py-[var(--section-y)] text-fg">
          <Container>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 className="display-caps max-w-[11ch] text-[clamp(2.75rem,1.4rem+5vw,6rem)]">
                Who do you want to be today?
              </h2>
              <p className="max-w-[34ch] text-muted">
                Same bottle, same gold apple on top. What changes is the person who wears it.
              </p>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:grid-cols-5 md:gap-x-5">
              {SCENTS.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 0.06} className="group">
                  <div className="overflow-hidden rounded-sm">
                    <Image
                      src={`/img/card-${s.id}.webp`}
                      alt={`Model holding ${s.name} by Gold Apple`}
                      ratio="900/1118"
                      sizes="(min-width: 768px) 20vw, 50vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.tint }} />
                    <h3 className="display-caps text-[1.75rem]">{s.name}</h3>
                  </div>
                  <p className="mt-2 text-small text-muted">{s.notes.join(' · ')}</p>
                  <p className="mt-1 text-small text-muted">Eau de Parfum · 50 ml</p>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>

        <section data-theme="dark" id="bottle" className="bg-bg py-[var(--section-y)] text-fg">
          <Container className="grid items-center gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-5">
              <Image
                src="/img/bottle.webp"
                alt="The Gold Apple perfume bottle with a gold apple-shaped cap"
                ratio="1000/1340"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="rounded-sm"
              />
            </Reveal>
            <div className="md:col-span-6 md:col-start-7">
              <h2 className="display-caps max-w-[10ch] text-[clamp(2.75rem,1.4rem+5vw,6rem)]">
                A gold apple on every bottle
              </h2>
              <div className="mt-8 space-y-4 text-fg/80">
                <p>
                  Heavy clear glass, so you can see the colour of each character. The cap is a small
                  polished apple in gold.
                </p>
                <p>One bottle for all five scents, in 50 ml and 100 ml.</p>
              </div>
              <dl className="mt-10 grid grid-cols-3 border-t border-line pt-6">
                {[
                  ['Scents', '5'],
                  ['Sizes', '50 / 100 ml'],
                  ['Type', 'Eau de Parfum'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-small uppercase tracking-[0.16em] text-muted">{k}</dt>
                    <dd className="mt-2 text-h4">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        <section data-theme="dark" className="relative isolate overflow-hidden bg-bg text-fg">
          <Image
            src="/img/finale.webp"
            alt="Five women walking towards the camera, each dressed in the colour of one scent"
            ratio="1920/1072"
            sizes="100vw"
            className="min-h-[80svh] object-cover md:min-h-[70svh]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
          <Container className="absolute inset-x-0 top-[calc(var(--header-h)+1rem)] flex justify-between gap-6 md:top-[8%]">
            <p className="display-caps text-[clamp(2.5rem,1rem+6vw,7.5rem)]">Wear</p>
            <p className="display-caps text-right text-[clamp(2.5rem,1rem+6vw,7.5rem)]">
              your gold
            </p>
          </Container>
          <Container className="absolute inset-x-0 bottom-8 flex justify-center">
            <Button href="/#find" size="lg">
              Find your scent
            </Button>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
