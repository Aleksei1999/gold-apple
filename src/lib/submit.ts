import { site } from '@/site.config';

export type SubmitResult = 'ok' | 'error';

// FormSubmit принимает JSON по AJAX-адресу; при любой ошибке форма предлагает письмо
export async function submitForm(data: Record<string, string>): Promise<SubmitResult> {
  try {
    const res = await fetch(site.forms.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: site.forms.subject, _template: 'table', ...data }),
    });
    if (!res.ok) return 'error';
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
    return json.success === false || json.success === 'false' ? 'error' : 'ok';
  } catch {
    return 'error';
  }
}

export function mailtoHref(data: Record<string, string>) {
  const body = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `mailto:${site.contacts.email}?subject=${encodeURIComponent(site.forms.subject)}&body=${encodeURIComponent(body)}`;
}
