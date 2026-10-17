/*
 * Contact. Owner: Account D (Content).
 * Email, GitHub and LinkedIn only (FACTS RS-01). There is no phone field on
 * purpose (DECISIONS #18).
 */
import type { ContactProps } from '../components/contact/Contact.tsx';
import { SITE } from './site.ts';

export const CONTACT: ContactProps = {
  site: {
    email: SITE.email,
    githubUrl: SITE.githubUrl,
    linkedinUrl: SITE.linkedinUrl,
  },
  resumeTo: '/resume',
  intro: 'I am looking for my first DevOps role. Email me, or find me on GitHub and LinkedIn.',
};
