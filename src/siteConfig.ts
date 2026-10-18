/*
 * Layout wiring for the header and footer. Every value comes from
 * src/data/site.ts (SITE), the single source of site-wide facts.
 */
import { SITE } from './data/site.ts';
import type { SiteLayoutProps } from './components/layout/SiteLayout.tsx';
import type { NavItem } from './components/layout/types.ts';

export const NAV: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'work', label: 'Work' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'contact', label: 'Contact' },
];

export const layoutProps: SiteLayoutProps = {
  header: {
    monogram: SITE.name.charAt(0),
    ownerName: SITE.name,
    nav: NAV,
    resumeTo: '/resume',
    githubUrl: SITE.githubUrl,
  },
  footer: {
    name: SITE.name,
    links: [
      { label: 'GitHub', href: SITE.githubUrl, external: true },
      { label: 'Resume (PDF)', href: SITE.resumePath, download: true },
    ],
  },
};
