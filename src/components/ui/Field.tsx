import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-md border border-line bg-transparent px-4 text-body text-fg placeholder:text-muted/70 ' +
  'transition-colors duration-200 hover:border-fg/40 focus:border-fg focus:outline-none ' +
  'aria-[invalid=true]:border-danger';

type FieldProps = { label: string; hint?: string; error?: string };

function Shell({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-small text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-small text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: FieldProps & ComponentPropsWithoutRef<'input'>) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} hint={hint} error={error}>
      <input
        id={fid}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fid}-msg` : undefined}
        className={cn(control, 'h-12', className)}
        {...rest}
      />
    </Shell>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  rows = 4,
  ...rest
}: FieldProps & ComponentPropsWithoutRef<'textarea'>) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} hint={hint} error={error}>
      <textarea
        id={fid}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fid}-msg` : undefined}
        className={cn(control, 'resize-y py-3', className)}
        {...rest}
      />
    </Shell>
  );
}

export function Checkbox({
  label,
  className,
  id,
  ...rest
}: { label: ReactNode } & Omit<ComponentPropsWithoutRef<'input'>, 'type'>) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <label
      htmlFor={fid}
      className={cn('flex cursor-pointer items-start gap-3 text-small', className)}
    >
      <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0">
        <input id={fid} type="checkbox" className="peer absolute inset-0 opacity-0" {...rest} />
        <span
          aria-hidden
          className="pointer-events-none flex h-full w-full items-center justify-center rounded-sm border border-fg/40 text-transparent transition-colors peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
      </span>
      <span className="text-muted">{label}</span>
    </label>
  );
}
