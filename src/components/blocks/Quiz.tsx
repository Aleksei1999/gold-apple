'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { duration, ease } from '@/lib/motion';
import { mailtoHref, submitForm } from '@/lib/submit';

export type QuizStep = { question: string; options: string[]; multiple?: boolean };

type Props = {
  steps: QuizStep[];
  final?: { title: string; text?: string };
  source?: string;
};

type Status = 'idle' | 'sending' | 'ok' | 'error';

export function Quiz({ steps, final, source = 'Квиз' }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(() => steps.map(() => []));
  const [status, setStatus] = useState<Status>('idle');
  const [payload, setPayload] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const total = steps.length + 1;
  const onContacts = step === steps.length;
  const current = steps[step];

  const pick = (option: string) =>
    setAnswers((all) =>
      all.map((a, i) => {
        if (i !== step) return a;
        if (!current.multiple) return [option];
        return a.includes(option) ? a.filter((x) => x !== option) : [...a, option];
      }),
    );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const contact = String(fd.get('contact') ?? '').trim();
    if (!name || contact.length < 5) return setError('Оставьте имя и телефон или почту');
    setError('');
    const data: Record<string, string> = { Имя: name, Контакт: contact, Источник: source };
    steps.forEach((s, i) => (data[s.question] = answers[i].join(', ') || '—'));
    setPayload(data);
    setStatus('sending');
    setStatus(await submitForm(data));
  };

  if (status === 'ok') {
    return (
      <div role="status" className="rounded-md border border-line p-6 md:p-10">
        <p className="font-display text-h3">Спасибо, ответы у нас</p>
        <p className="mt-3 text-muted">Свяжемся и обсудим задачу подробнее.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-line p-6 md:p-10">
      <div className="flex items-center justify-between text-small text-muted">
        <span>
          Шаг {step + 1} из {total}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="underline underline-offset-4 hover:text-fg"
          >
            Назад
          </button>
        )}
      </div>
      <div
        className="mt-4 h-px w-full bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-label="Прогресс"
      >
        <div
          className="h-px bg-fg transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: duration.base, ease: ease.out }}
          className="mt-8"
        >
          {onContacts ? (
            <form noValidate onSubmit={submit} className="flex flex-col gap-6">
              <div>
                <p className="font-display text-h3">{final?.title ?? 'Куда прислать ответ?'}</p>
                {final?.text && <p className="mt-3 text-muted">{final.text}</p>}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Input label="Имя" name="name" autoComplete="name" />
                <Input label="Телефон или почта" name="contact" autoComplete="tel" />
              </div>
              {error && (
                <p role="alert" className="text-small text-danger">
                  {error}
                </p>
              )}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button type="submit" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Отправляем…' : 'Получить расчёт'}
                </Button>
                {status === 'error' && (
                  <p role="alert" className="text-small text-danger">
                    Не получилось отправить.{' '}
                    <a href={mailtoHref(payload)} className="underline underline-offset-4">
                      Написать письмом
                    </a>
                  </p>
                )}
              </div>
            </form>
          ) : (
            <fieldset>
              <legend className="font-display text-h3">{current.question}</legend>
              {current.multiple && (
                <p className="mt-2 text-small text-muted">Можно несколько вариантов</p>
              )}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((o) => {
                  const active = answers[step].includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        pick(o);
                        if (!current.multiple) setStep((s) => s + 1);
                      }}
                      className={cn(
                        'min-h-14 rounded-md border px-5 py-3 text-left transition-colors duration-200',
                        active ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg/50',
                      )}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
              {current.multiple && (
                <Button
                  className="mt-8"
                  disabled={!answers[step].length}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Дальше
                </Button>
              )}
            </fieldset>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
