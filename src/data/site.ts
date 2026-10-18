/*
 * Site metadata. Owner: Account D (Content).
 * Sources: resume header (FACTS RS-01), docs/DECISIONS.md #1 (domain), #18 (no
 * phone number on any page or data file). Bengaluru and "fresher" come from
 * the content brief (FACTS P-08).
 */
import type { SiteMeta } from './types.ts';

export const SITE: SiteMeta = {
  name: 'Bharath Moger',
  role: 'DevOps-focused MCA graduate',
  location: 'Bengaluru',
  title: 'Bharath Moger | DevOps Portfolio',
  description:
    'Bharath Moger, a DevOps fresher in Bengaluru. A self-built Kubernetes platform and an AWS EKS deployment, with Terraform, Jenkins and Docker.',
  url: 'https://portfolio.bharathops.online',
  email: 'bharath.m.moger@gmail.com',
  githubUrl: 'https://github.com/bharathMoger18',
  linkedinUrl: 'https://www.linkedin.com/in/bharathmoger',
  resumePath: '/Bharath_Moger_DevOps_Resume.pdf',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  locale: 'en_IN',
  themeColor: '#f5f1e9',
  portraitPath: '/portrait.webp',
};

/** Describes public/og-image.png as it is: name, monogram and URL on a cream background. */
export const OG_IMAGE_ALT =
  'Bharath Moger. DevOps portfolio at portfolio.bharathops.online, on a cream background with a dark B monogram.';
