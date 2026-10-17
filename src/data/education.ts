/*
 * Education. Owner: Account D (Content).
 * Source: resume Education section (FACTS P-05, P-06, RS-28); DECISIONS #7.
 * Not independently verifiable. No "independent projects" entry: no dates are
 * confirmed for it, so it is not written (see Questions in the D2 summary).
 */
import type { Education } from './types.ts';

export const EDUCATION_MCA: Education = {
  id: 'mca-vtu',
  kind: 'degree',
  institution: 'Visvesvaraya Technological University',
  location: 'Mysuru',
  degree: 'MCA',
  period: '2025',
  grade: { label: 'CGPA', value: '9.05' },
  note: 'Master of Computer Applications. CGPA is out of 10.',
};

export const EDUCATION_BCA: Education = {
  id: 'bca-sgs',
  kind: 'degree',
  institution: 'Shree Guru Sudhindra BCA College',
  location: 'Bhatkal',
  degree: 'BCA',
  period: '2023',
  grade: { label: 'CGPA', value: '8.1' },
  note: 'Bachelor of Computer Applications. CGPA is out of 10.',
};

/** Newest first. */
export const EDUCATION: Education[] = [EDUCATION_MCA, EDUCATION_BCA];
