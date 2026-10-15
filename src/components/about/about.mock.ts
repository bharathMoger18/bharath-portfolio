/*
 * MOCK data for About and EngineerBadge. Account D replaces it with
 * src/data/site.ts and src/data/education.ts plus real copy (TODO(D)).
 * Badge facts come from the resume (FACTS RS-01, RS-28): name, MCA VTU 2025,
 * CGPA 9.05, Bengaluru, email. No ID number, no barcode, no phone number.
 */
import type { AboutProps } from './About.tsx';
import type { EngineerBadgeProps } from './EngineerBadge.tsx';

export const MOCK_BADGE: EngineerBadgeProps = {
  site: {
    name: 'Bharath Moger',
    role: 'DevOps-focused MCA graduate', // TODO(D): confirm wording
    location: 'Bengaluru',
    email: 'bharath.m.moger@gmail.com',
    url: 'https://portfolio.bharathops.online',
  },
  education: {
    degree: 'MCA',
    institution: 'Visvesvaraya Technological University',
    period: '2025',
    grade: { label: 'CGPA', value: '9.05' },
  },
  institutionShort: 'VTU',
  cardLabel: 'Engineer ID',
};

export const MOCK_ABOUT: AboutProps = {
  paragraphs: [
    'TODO(D): About copy, paragraph one.',
    'TODO(D): About copy, paragraph two.',
  ],
  badge: MOCK_BADGE,
  headingName: 'Bharath',
};
