/*
 * MOCK data for NumbersStrip. Account D replaces it with src/data/numbers.ts.
 * Values and sources come from DECISIONS #8 and docs/FACTS.md (K-24 owner
 * output for the 3 nodes; Jenkinsfile stage names; terraform/modules).
 * Captions are placeholders that name the source (TODO(D) final wording).
 */
import type { NumberFact } from '../../data/types.ts';

const BLOB = 'https://github.com/bharathMoger18/k8s-campuscart/blob/774df40';
const TREE = 'https://github.com/bharathMoger18/k8s-campuscart/tree/774df40';

export const MOCK_NUMBERS: NumberFact[] = [
  {
    id: 'kubeadm-nodes',
    value: 3,
    label: 'Nodes in the kubeadm cluster',
    caption: 'Source: kubectl get nodes output (1 control plane, 2 workers).', // owner-supplied, FACTS K-24
    evidence: [],
  },
  {
    id: 'kubeadm-stages',
    value: 5,
    label: 'kubeadm pipeline stages',
    caption: 'Source: stage names in the Jenkinsfile.',
    evidence: [{ label: 'Jenkinsfile', path: 'Jenkinsfile', url: `${BLOB}/Jenkinsfile`, commit: '774df40' }],
  },
  {
    id: 'aws-stages',
    value: 9,
    label: 'AWS pipeline stages',
    caption: 'Source: stage names in Jenkinsfile.aws.',
    evidence: [{ label: 'Jenkinsfile.aws', path: 'Jenkinsfile.aws', url: `${BLOB}/Jenkinsfile.aws`, commit: '774df40' }],
  },
  {
    id: 'terraform-modules',
    value: 7,
    label: 'Terraform modules',
    caption: 'Source: directories under terraform/modules.',
    evidence: [{ label: 'terraform/modules', path: 'terraform/modules', url: `${TREE}/terraform/modules`, commit: '774df40' }],
  },
];
