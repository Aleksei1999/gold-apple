import type { ComponentPropsWithoutRef } from 'react';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/cn';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  src: string;
  // пустая строка — для декоративных картинок
  alt: string;
  // первый экран: грузить сразу и с высоким приоритетом
  priority?: boolean;
  ratio?: string;
};

export function Image({ src, alt, priority, ratio, sizes, className, style, ...rest }: Props) {
  return (
    <img
      src={asset(src)}
      alt={alt}
      sizes={sizes ?? '100vw'}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={cn('block h-auto w-full object-cover', className)}
      style={ratio ? { aspectRatio: ratio, ...style } : style}
      {...rest}
    />
  );
}
