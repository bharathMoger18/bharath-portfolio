/*
 * TEMPORARY site constants for Brief A. Account D's src/data/site.ts (SiteMeta)
 * replaces this file; switching over is a one-file change.
 * TODO(D): email and LinkedIn are unknown, so they are not listed here.
 */
import type { SiteLayoutProps } from './components/layout/SiteLayout.tsx';
import type { NavItem } from './components/layout/types.ts';

export const OWNER = 'Bharath Moger';
export const GITHUB_URL = 'https://github.com/bharathMoger18';
/** Real filename as committed in public/. */
export const RESUME_PDF = '/Bharath_Moger_DevOps_Resume.pdf';

export const NAV: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'work', label: 'Work' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'contact', label: 'Contact' },
];

export const layoutProps: SiteLayoutProps = {
  header: {
    monogram: 'B',
    ownerName: OWNER,
    nav: NAV,
    resumeTo: '/resume',
    githubUrl: GITHUB_URL,
  },
  footer: {
    name: OWNER,
    links: [
      { label: 'GitHub', href: GITHUB_URL, external: true },
      { label: 'Resume (PDF)', href: RESUME_PDF, download: true },
    ],
  },
};
