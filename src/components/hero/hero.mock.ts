/*
 * MOCK data for Hero. Account D replaces this with src/data/site.ts (SiteMeta)
 * and final copy. Marked TODO(D). The request path hops are real and come from
 * docs/FACTS.md (Cloudflare Tunnel, ingress-nginx, Nginx, Django, PostgreSQL).
 */
import type { HeroCopy, HeroProps } from './Hero.tsx';

export const MOCK_HERO_COPY: HeroCopy = {
  eyebrow: 'DevOps / Bengaluru', // TODO(D)
  headline: { before: 'I build and run', emphasis: 'delivery', after: 'pipelines.' }, // TODO(D)
  sentence:
    'MCA graduate, 2025. I run CampusCart on a Kubernetes cluster I built myself with kubeadm.', // TODO(D)
  primaryLabel: 'Explore projects',
  resumeLabel: 'View resume',
  requestPath: ['Browser', 'Cloudflare', 'Tunnel', 'Ingress', 'Nginx', 'Django', 'PostgreSQL'],
  requestPathLabel: 'Request path through the kubeadm cluster',
};

export const MOCK_HERO: HeroProps = {
  site: {
    name: 'Bharath Moger',
    githubUrl: 'https://github.com/bharathMoger18',
    linkedinUrl: 'https://www.linkedin.com/in/bharathmoger',
    portraitPath: '/portrait.webp',
  },
  copy: MOCK_HERO_COPY,
  resumeTo: '/resume',
  projectsAnchor: 'work',
  ghostText: 'BHARATH',
};
