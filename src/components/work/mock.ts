/*
 * Placeholder data for /lab only. Every string is TODO(D): no project claims.
 * Real data comes from Account D's src/data/projects.ts.
 */
import type { EvidenceLink, Project } from '../../data/types.ts';

const EVIDENCE: EvidenceLink[] = [
  {
    label: 'TODO(D): evidence label',
    path: 'TODO(D)/path',
    url: 'https://github.com/bharathMoger18/k8s-campuscart',
    commit: '774df40',
    lines: '1-2',
  },
  {
    label: 'TODO(D): second evidence label',
    path: 'TODO(D)/other-path',
    url: 'https://github.com/bharathMoger18/k8s-campuscart',
    commit: '774df40',
  },
];

export const MOCK_PROJECT: Project = {
  slug: 'todo-d',
  title: 'TODO(D): project title',
  summary: 'TODO(D): one-sentence summary of the project.',
  status: { kind: 'pending-confirmation', label: 'TODO(D): status label' },
  tags: ['TODO(D) tag', 'TODO(D) tag'],
  overview: ['TODO(D): overview paragraph one.', 'TODO(D): overview paragraph two.'],
  architecture: {
    diagramId: 'kubeadm-architecture',
    textAlternative: 'TODO(D): text alternative for the architecture diagram.',
  },
  pipeline: {
    diagramId: 'kubeadm-pipeline',
    textAlternative: 'TODO(D): text alternative for the pipeline diagram.',
  },
  decisions: [
    { title: 'TODO(D): decision title', why: 'TODO(D): why, in first person.', evidence: EVIDENCE },
    { title: 'TODO(D): second decision title', why: 'TODO(D): why, in first person.' },
  ],
  securityAndOps: ['TODO(D): security or operations item.', 'TODO(D): second item.'],
  nextImprovements: ['TODO(D): next improvement.', 'TODO(D): second improvement.'],
  evidence: EVIDENCE,
};

export const MOCK_STATUSES: Project['status'][] = [
  { kind: 'live', label: 'TODO(D): live label' },
  { kind: 'pending-confirmation', label: 'TODO(D): pending label' },
  { kind: 'completed-torn-down', label: 'TODO(D): completed label' },
];
