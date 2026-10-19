/*
 * Numbers strip. Owner: Account D (Content).
 * Four verified counts only (DECISIONS #8, #15). Each caption names its source.
 * No uptime, traffic, cost, user or test counts (DECISIONS #13).
 *   kubeadm-nodes      FACTS K-24 (owner output, no repo link)
 *   kubeadm-stages     FACTS K-01
 *   aws-stages         FACTS A-01, A-03, A-04 (as deployed), A-35 (later edit)
 *   terraform-modules  FACTS A-06
 */
import type { NumberFact } from './types.ts';
import { ev, evTree } from './evidence.ts';

export const NUMBERS: NumberFact[] = [
  {
    id: 'kubeadm-nodes',
    value: 3,
    label: 'Nodes in the kubeadm cluster',
    caption:
      'Source: my kubectl get nodes output. One control plane node and two workers, Kubernetes v1.30.',
    evidence: [
      ev('Worker nodes named in the backup volume manifest', 'k8s/backup-storage.yaml', '4-28'),
    ],
  },
  {
    id: 'kubeadm-stages',
    value: 5,
    label: 'kubeadm pipeline stages',
    caption: 'Source: the five stage names in the Jenkinsfile.',
    evidence: [ev('Jenkinsfile: the five stage blocks', 'Jenkinsfile', '15-316')],
  },
  {
    id: 'aws-stages',
    value: 9,
    label: 'AWS pipeline stages',
    caption:
      'Source: the nine stage names in Jenkinsfile.aws as deployed (commit 774df40). It had no test, scan or rollback stage. I added Test and Security Scan stages after teardown; they have never run.',
    evidence: [ev('Jenkinsfile.aws: the nine stage blocks as deployed', 'Jenkinsfile.aws', '11-310')],
  },
  {
    id: 'terraform-modules',
    value: 7,
    label: 'Terraform modules',
    caption: 'Source: the seven folders under terraform/modules.',
    evidence: [evTree('terraform/modules', 'terraform/modules')],
  },
];
