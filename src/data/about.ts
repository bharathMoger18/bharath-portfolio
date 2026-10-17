/*
 * About copy and the engineer badge. Owner: Account D (Content).
 * Paragraph two uses the exact authorship wording from DECISIONS #19. Never
 * write "I wrote the app". The badge shows the MCA entry (FACTS RS-02, P-06):
 * no ID number, no barcode, no phone number (DECISIONS #18).
 */
import type { AboutProps } from '../components/about/About.tsx';
import type { EngineerBadgeProps } from '../components/about/EngineerBadge.tsx';
import { EDUCATION_MCA } from './education.ts';
import { SITE } from './site.ts';

export const BADGE: EngineerBadgeProps = {
  site: {
    name: SITE.name,
    role: SITE.role,
    location: SITE.location,
    email: SITE.email,
    url: SITE.url,
  },
  education: {
    degree: EDUCATION_MCA.degree,
    institution: EDUCATION_MCA.institution,
    period: EDUCATION_MCA.period,
    grade: EDUCATION_MCA.grade,
  },
  institutionShort: 'VTU',
  cardLabel: 'Engineer ID',
};

export const ABOUT: AboutProps = {
  paragraphs: [
    'I am Bharath, an MCA graduate from VTU (2025), based in Bengaluru. I am looking for my first DevOps role. I show my work: most claims on this site link to the exact file in my repo.',
    'I built CampusCart with AI coding tools. My own work is the platform around it: Kubernetes, CI/CD, secrets, TLS, monitoring and AWS infrastructure in Terraform.',
  ],
  badge: BADGE,
  headingName: 'Bharath',
};
