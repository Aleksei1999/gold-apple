import type { Metadata } from 'next';
import { LegalPage } from '@/components/blocks/LegalPage';
import { site } from '@/site.config';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" updated="25 October 2026">
      <p>
        This policy explains how {site.name} handles personal data from visitors to{' '}
        {site.url.replace(/^https?:\/\//, '')}.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>the details you give us when you email us;</li>
        <li>technical data about the visit: page address, browser type and time of visit.</li>
      </ul>
      <h2>Why</h2>
      <p>To reply to your message. We do not send marketing without your consent.</p>
      <h2>Your rights</h2>
      <p>
        Under UK GDPR you can ask to see, correct or delete your data at any time. Write to{' '}
        {site.contacts.email} and we will reply within one month.
      </p>
    </LegalPage>
  );
}
