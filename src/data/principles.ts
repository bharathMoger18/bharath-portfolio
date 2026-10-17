/*
 * Working principles. Owner: Account D (Content).
 * Each principle is backed by something real in the audited repo. The Principle
 * type lives here because types.ts has none yet (request to Account A in
 * docs/INTEGRATION.md). Wording stays inside DECISIONS #11, #12 and #13:
 * no "least privilege", no image sizes, no alerting, no tested restore.
 *   secrets-out-of-git          FACTS V-01, V-02, S-02
 *   scan-before-build           FACTS K-05, K-06
 *   limit-what-automation-does  FACTS K-17, K-30
 *   undo-a-failed-deploy        FACTS K-10
 *   person-before-apply         FACTS A-02
 */
import type { EvidenceLink } from './types.ts';
import { ev } from './evidence.ts';

export interface Principle {
  id: string;
  title: string;
  /** Short sentences, first person. */
  body: string;
  evidence: EvidenceLink[];
}

export const PRINCIPLES: Principle[] = [
  {
    id: 'secrets-out-of-git',
    title: 'Keep secrets out of images and Git.',
    body:
      'My Django pods read their database credentials and app secrets from Vault when they run. The repo ignores .env files, Terraform state and Terraform variable files.',
    evidence: [
      ev('Database credentials come from Vault', 'k8s/web.yaml', '92-94'),
      ev('.gitignore: .env files', '.gitignore', '20-21'),
      ev('.gitignore: Terraform state and variable files', '.gitignore', '61-69'),
    ],
  },
  {
    id: 'scan-before-build',
    title: 'Scan before you build.',
    body:
      'In my kubeadm pipeline, bandit and pip-audit run before Kaniko builds an image. If a scan fails, no image reaches the registry.',
    evidence: [
      ev('Security Scan stage and why it comes first', 'Jenkinsfile', '183-190'),
      ev('bandit and pip-audit commands', 'Jenkinsfile', '217-223'),
    ],
  },
  {
    id: 'limit-what-automation-does',
    title: 'Give automation a narrow job.',
    body:
      'Jenkins deploys as its own ServiceAccount, with a Role limited to one namespace. The Role lets it update Deployments and Services, read Pods and run Jobs there. It has no rule for Secrets.',
    evidence: [
      ev('Role: what the deployer may do', 'k8s/jenkins-deployer-rbac.yaml', '15-54'),
      ev('RoleBinding to the Jenkins ServiceAccount', 'k8s/jenkins-deployer-rbac.yaml', '57-71'),
    ],
  },
  {
    id: 'undo-a-failed-deploy',
    title: 'Let a failed deploy undo itself.',
    body:
      'My kubeadm pipeline waits for each rollout. If the new pods are not ready in time, it runs kubectl rollout undo.',
    evidence: [ev('Rollout check and undo', 'Jenkinsfile', '378-406')],
  },
  {
    id: 'person-before-apply',
    title: 'Put a person between plan and apply.',
    body:
      'My AWS pipeline shows the Terraform plan and then waits for a manual approval before it applies. The wait times out after 30 minutes.',
    evidence: [ev('Approve Infrastructure Changes stage', 'Jenkinsfile.aws', '102-113')],
  },
];
