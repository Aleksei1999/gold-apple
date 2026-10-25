import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';
import { nb } from '@/lib/typo';

type Props = {
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  // split — заголовок слева, текст справа; stack — друг под другом
  layout?: 'split' | 'stack';
  className?: string;
};

export function SectionHead({ title, eyebrow, lead, layout = 'split', className }: Props) {
  const split = layout === 'split' && Boolean(lead);
  return (
    <Reveal
      className={cn(
        'mb-12 md:mb-20',
        split && 'grid gap-6 md:grid-cols-12 md:items-end md:gap-10',
        className,
      )}
    >
      <div className={cn(split && 'md:col-span-7')}>
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <Heading>{title}</Heading>
      </div>
      {lead && (
        <p
          className={cn('max-w-[52ch] text-muted', split ? 'md:col-span-5 md:col-start-8' : 'mt-6')}
        >
          {nb(lead)}
        </p>
      )}
    </Reveal>
  );
}
