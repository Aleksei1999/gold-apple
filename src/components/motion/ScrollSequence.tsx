'use client';

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { preload } from 'react-dom';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';

export type SequenceFrames = {
  // папка в public: /demo/sequence → /demo/sequence/000.webp …
  dir: string;
  count: number;
  ext?: 'webp' | 'avif' | 'jpg';
  // ширина номера в имени файла: 3 → 000.webp
  pad?: number;
};

export type SequenceCallout = {
  title: string;
  text?: string;
  // точка на кадре в долях ширины и высоты исходного кадра (0..1)
  at: [number, number];
  atMobile?: [number, number];
  // в какую сторону от линии стоит подпись
  side?: 'left' | 'right';
  // отрезок прогресса скролла (0..1), за который выноска проявляется
  range: [number, number];
  // когда прячется; без него висит до конца
  hideAt?: number;
  // на телефоне две выноски рядом не помещаются: эта уходит раньше
  hideAtMobile?: number;
};

type Props = {
  frames: SequenceFrames;
  // длина прокрутки в высотах экрана; последний экран — стоп-кадр под StackOverlap
  length?: number;
  // ключевые точки прогресс → кадр, например [[0, 0.5, 0.7, 1], [0, 59, 59, 119]] для паузы
  keyframes?: [number[], number[]];
  callouts?: SequenceCallout[];
  // затемнение поверх кадра, чтобы читался текст
  scrim?: boolean;
  // светлый ролик — светлая тема, чтобы шапка и текст поверх были тёмными
  theme?: 'light' | 'dark';
  // на узком экране виден только кусок кадра: какую долю ширины держать в центре, по номеру кадра;
  // передавать константой модуля, иначе кадры перезагружаются на каждый рендер
  focus?: [number[], number[]];
  // на вертикальном экране не растягивать кадр на всю высоту: ширина кадра = scale × ширина экрана,
  // центр по высоте в доле y, края кадра растворяются в цвет фона matte
  portrait?: { scale: number; y: number; matte: string };
  label?: string;
  className?: string;
  children?: (progress: MotionValue<number>) => ReactNode;
};

const frameSrc = (dir: string, i: number, pad: number, ext: string) =>
  asset(`${dir}/${String(i).padStart(pad, '0')}.${ext}`);

// сначала каждый восьмой кадр, потом каждый второй, потом остальные: грубая анимация доступна сразу
function loadOrder(count: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export function ScrollSequence({
  frames,
  length = 5,
  keyframes,
  callouts = [],
  scrim = true,
  theme = 'dark',
  focus,
  portrait,
  label,
  className,
  children,
}: Props) {
  const { dir, count, ext = 'webp', pad = 3 } = frames;
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const loaded = useRef<boolean[]>([]);
  const current = useRef(0);
  const [view, setView] = useState({ w: 0, h: 0, aspect: 16 / 9 });

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  // последний экран прокрутки кадр стоит, пока следующий блок наезжает сверху
  const hold = 1 - 1 / length;
  const [input, output] = keyframes ?? [
    [0, hold],
    [0, count - 1],
  ];
  const frame = useTransform(scrollYProgress, input, output, { clamp: true });

  const draw = useCallback(
    (index: number) => {
      const c = canvas.current;
      if (!c) return;
      // нужный кадр ещё не пришёл — рисуем ближайший загруженный
      let i = -1;
      for (let d = 0; d < loaded.current.length; d++) {
        if (loaded.current[index - d]) i = index - d;
        else if (loaded.current[index + d]) i = index + d;
        if (i >= 0) break;
      }
      const img = i >= 0 ? images.current[i] : undefined;
      const ctx = c.getContext('2d');
      if (!img || !ctx) return;
      const tall = portrait && c.width < c.height;
      const s = tall
        ? (c.width * portrait.scale) / img.naturalWidth
        : Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      let fx = 0.5;
      const f = focus;
      if (f) {
        const [at, to] = f;
        const k = at.findIndex((v) => v >= index);
        if (k <= 0) fx = k === 0 ? to[0] : to[to.length - 1];
        else fx = to[k - 1] + ((index - at[k - 1]) / (at[k] - at[k - 1])) * (to[k] - to[k - 1]);
      }
      // сдвигаем кадр так, чтобы точка fx встала в центр, но без пустых полос по краям
      const x = Math.min(0, Math.max(c.width - w, c.width / 2 - fx * w));
      const y = tall ? c.height * portrait.y - h / 2 : (c.height - h) / 2;
      if (tall) {
        ctx.fillStyle = portrait.matte;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(img, x, y, w, h);
      if (tall) {
        const edge = h * 0.16;
        for (const [from, to] of [
          [y, y + edge],
          [y + h, y + h - edge],
        ]) {
          const g = ctx.createLinearGradient(0, from, 0, to);
          g.addColorStop(0, portrait.matte);
          g.addColorStop(1, `${portrait.matte}00`);
          ctx.fillStyle = g;
          ctx.fillRect(0, Math.min(from, to), c.width, edge);
        }
      }
    },
    [focus, portrait],
  );

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    images.current = [];
    loaded.current = Array(count).fill(false);
    let cancelled = false;
    let started = false;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (cancelled) return resolve();
          images.current[i] = img;
          loaded.current[i] = true;
          if (i === 0) setView((v) => ({ ...v, aspect: img.naturalWidth / img.naturalHeight }));
          if (Math.abs(i - current.current) < 8) draw(current.current);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(dir, i, pad, ext);
      });

    // по 6 параллельных запросов: не душим сеть и первый экран
    const start = async () => {
      if (started) return;
      started = true;
      const queue = loadOrder(count);
      await load(queue.shift()!);
      const worker = async () => {
        while (queue.length && !cancelled) await load(queue.shift()!);
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    };

    const io = new IntersectionObserver((e) => e[0].isIntersecting && start(), {
      rootMargin: '100% 0px',
    });
    io.observe(el);

    const resize = () => {
      const c = canvas.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      setView((v) => ({ ...v, w: c.clientWidth, h: c.clientHeight }));
      draw(current.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      cancelled = true;
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [dir, count, ext, pad, draw]);

  preload(frameSrc(dir, 0, pad, ext), { as: 'image', fetchPriority: 'high' });

  useMotionValueEvent(frame, 'change', (v) => {
    const i = Math.round(v);
    if (i === current.current) return;
    current.current = i;
    requestAnimationFrame(() => draw(i));
  });

  return (
    <section
      ref={section}
      data-theme={theme}
      aria-label={label}
      className={cn('relative', className)}
      style={{ height: `${length * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        {scrim && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/35" />
        )}
        {view.w > 0 &&
          callouts.map((c) => (
            <Callout key={c.title} callout={c} view={view} progress={scrollYProgress} />
          ))}
        {children?.(scrollYProgress)}
      </div>
    </section>
  );
}

function Callout({
  callout,
  view,
  progress,
}: {
  callout: SequenceCallout;
  view: { w: number; h: number; aspect: number };
  progress: MotionValue<number>;
}) {
  const [a, b] = callout.range;
  const span = b - a;
  const narrow = view.w < 768;
  const end = narrow ? (callout.hideAtMobile ?? callout.hideAt) : callout.hideAt;
  const dot = useTransform(progress, [a, a + span * 0.15], [0, 1]);
  const line = useTransform(progress, [a + span * 0.1, a + span * 0.55], [0, 1]);
  const card = useTransform(progress, [a + span * 0.5, b], [0, 1]);
  const cardY = useTransform(progress, [a + span * 0.5, b], [14, 0]);
  const fade = useTransform(progress, (v) =>
    end === undefined ? 1 : Math.min(1, Math.max(0, 1 - (v - end) / 0.03)),
  );

  // кадр вписан по cover: переводим доли исходного кадра в пиксели экрана
  const drawW = Math.max(view.w, view.h * view.aspect);
  const drawH = drawW / view.aspect;
  const [fx, fy] = narrow && callout.atMobile ? callout.atMobile : callout.at;
  const x = (view.w - drawW) / 2 + fx * drawW;
  const y = (view.h - drawH) / 2 + fy * drawH;
  // карточка над точкой не должна уезжать под шапку
  const lineH = Math.max(40, Math.min(view.h * 0.24, 220, y - 200));
  const cardW = Math.min(300, view.w - 32);
  const left =
    callout.side === 'left'
      ? Math.min(Math.max(x - cardW, 16), view.w - cardW - 16)
      : Math.min(Math.max(x, 16), view.w - cardW - 16);

  return (
    <motion.div style={{ opacity: fade }} className="pointer-events-none absolute inset-0">
      <motion.span
        style={{ opacity: dot, left: x, top: y }}
        className="absolute -ml-1 -mt-1 block h-2 w-2 rounded-full bg-white"
      />
      <motion.span
        style={{ scaleY: line, left: x, top: y - lineH, height: lineH - 4 }}
        className="absolute block w-px origin-bottom bg-white/80"
      />
      <motion.div
        style={{ opacity: card, y: cardY, left, bottom: view.h - (y - lineH), width: cardW }}
        className="absolute rounded-md bg-bg/90 p-5 text-fg"
      >
        <p className="text-eyebrow font-medium uppercase">{callout.title}</p>
        {callout.text && <p className="mt-3 text-small text-muted">{callout.text}</p>}
      </motion.div>
    </motion.div>
  );
}
