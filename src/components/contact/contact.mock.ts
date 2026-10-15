/*
 * MOCK data for Contact. Account D replaces it with src/data/site.ts.
 * Email, GitHub and LinkedIn are from the resume header (FACTS RS-01).
 * The phone number is deliberately absent everywhere (DECISIONS #18).
 */
import type { ContactProps } from './Contact.tsx';

export const MOCK_CONTACT: ContactProps = {
  site: {
    email: 'bharath.m.moger@gmail.com',
    githubUrl: 'https://github.com/bharathMoger18',
    linkedinUrl: 'https://www.linkedin.com/in/bharathmoger',
  },
  resumeTo: '/resume',
  intro: 'TODO(D): one short line inviting contact.',
};
