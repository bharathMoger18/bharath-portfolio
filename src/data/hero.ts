/*
 * Hero copy. Owner: Account D (Content).
 * The request path lists the real hops of the kubeadm cluster (FACTS K-22,
 * diagram text): Cloudflare, cloudflared (Tunnel), ingress-nginx, Nginx,
 * Django, PostgreSQL. No "live" claim here (DECISIONS #6).
 */
import type { HeroCopy, HeroProps } from '../components/hero/Hero.tsx';
import { SITE } from './site.ts';

export const HERO_COPY: HeroCopy = {
  eyebrow: 'DevOps fresher / Bengaluru',
  headline: { before: 'I build the', emphasis: 'platform', after: 'around the app.' },
  sentence:
    'MCA graduate, 2025. I built a 3-node Kubernetes cluster with kubeadm and an AWS EKS deployment with Terraform.',
  primaryLabel: 'Explore projects',
  resumeLabel: 'View resume',
  requestPath: ['Browser', 'Cloudflare', 'Tunnel', 'Ingress', 'Nginx', 'Django', 'PostgreSQL'],
  requestPathLabel: 'Request path through the kubeadm cluster',
};

export const HERO: HeroProps = {
  site: {
    name: SITE.name,
    githubUrl: SITE.githubUrl,
    linkedinUrl: SITE.linkedinUrl,
    portraitPath: SITE.portraitPath,
  },
  copy: HERO_COPY,
  resumeTo: '/resume',
  projectsAnchor: 'work',
  ghostText: 'BHARATH',
};
