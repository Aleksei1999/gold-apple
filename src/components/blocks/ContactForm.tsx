'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input, Textarea } from '@/components/ui/Field';
import { mailtoHref, submitForm } from '@/lib/submit';
import { site } from '@/site.config';

type Status = 'idle' | 'sending' | 'ok' | 'error';

type Props = {
  // поле в заявке, по которому видно, откуда она: «Форма внизу», «Квиз»
  source?: string;
  submitLabel?: string;
  success?: ReactNode;
};

export function ContactForm({ source = 'Форма', submitLabel = 'Отправить', success }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [last, setLast] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Имя: String(fd.get('name') ?? '').trim(),
      Контакт: String(fd.get('contact') ?? '').trim(),
      Сообщение: String(fd.get('message') ?? '').trim(),
      Источник: source,
    };
    const next: Record<string, string> = {};
    if (!data.Имя) next.name = 'Как к вам обращаться?';
    if (data.Контакт.length < 5) next.contact = 'Телефон или почта, чтобы мы могли ответить';
    if (!fd.get('consent')) next.consent = 'Нужно согласие на обработку данных';
    setErrors(next);
    if (Object.keys(next).length) return;

    // ловушка для ботов: живой человек это поле не видит
    if (fd.get('_honey')) return setStatus('ok');

    setLast(data);
    setStatus('sending');
    setStatus(await submitForm(data));
  };

  if (status === 'ok') {
    return (
      <div role="status" className="border-t border-fg pt-6">
        {success ?? (
          <>
            <p className="text-h4 font-medium">Заявка отправлена</p>
            <p className="mt-3 text-muted">Ответим в рабочее время, обычно в течение дня.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Имя" name="name" autoComplete="name" error={errors.name} />
        <Input
          label="Телефон или почта"
          name="contact"
          autoComplete="tel"
          inputMode="email"
          error={errors.contact}
        />
      </div>
      <Textarea label="Коротко о задаче" name="message" hint="Необязательно" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" />
      <div>
        <Checkbox
          name="consent"
          defaultChecked
          label={
            <>
              Согласен на обработку персональных данных по{' '}
              <Link href={site.legal[0].href} className="underline underline-offset-4">
                политике
              </Link>
            </>
          }
        />
        {errors.consent && <p className="mt-2 text-small text-danger">{errors.consent}</p>}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправляем…' : submitLabel}
        </Button>
        {status === 'error' && (
          <p role="alert" className="text-small text-danger">
            Не получилось отправить.{' '}
            <a href={mailtoHref(last)} className="underline underline-offset-4">
              Написать письмом
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
