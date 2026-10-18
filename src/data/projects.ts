/*
 * Projects and case studies. Owner: Account D (Content).
 * Rules applied:
 *  - Status: DECISIONS #2 (AWS "Completed deployment, infrastructure torn down",
 *    never "live") and #6 (kubeadm "Live" only after QA confirms).
 *  - Authorship: DECISIONS #19 wording. Never "I wrote the app".
 *  - IRSA: #3 and #10. TLS: #4 and #11. Image: #12. Never-claim list: #13.
 *  - Versions: #15 (kubeadm v1.30, EKS 1.31). Never mixed.
 *  - Improvements: #16.
 *  - No account ID, tunnel ID, registry address, private IP or phone (#18).
 * FACTS rows per field are listed in docs/INTEGRATION.md.
 */
import type { EvidenceLink, KeyDecision, Project } from './types.ts';
import { DIAGRAMS } from './diagrams.ts';
import { GRAFANA_NAMESPACE_CAPTION, GRAFANA_NAMESPACE_SHOT, ev, evTree } from './evidence.ts';

/* ------------------------------------------------------------------ */
/* QA switch (DECISIONS #6)                                            */
/* ------------------------------------------------------------------ */

/**
 * QA flips this to true ONLY after the URL below answers on launch day.
 * Until then the project reads "Deployed on my own kubeadm cluster".
 */
export const QA_CONFIRMED_LIVE: boolean = true;
export const KUBEADM_LIVE_URL = 'https://campuscart.bharathops.online';

/* ------------------------------------------------------------------ */
/* Case study A: kubeadm                                               */
/* ------------------------------------------------------------------ */

const kubeadmDecisions: KeyDecision[] = [
  {
    title: 'Kaniko in Jenkins agent pods, one container per image',
    why:
      'Kaniko builds images without a Docker daemon, so the builds run inside Jenkins agent pods. I gave each image its own container because Kaniko uses a lot of memory. One build could leave the next one short of memory and get it killed.',
    evidence: [ev('Kaniko containers and the reason for two', 'Jenkinsfile', '244-266')],
  },
  {
    title: 'Scan first, then build',
    why:
      'bandit and pip-audit run before Kaniko builds anything. If the scan fails, no image reaches the registry. A retry of the same commit cannot skip both the scan and the build because the image tag already exists.',
    evidence: [
      ev('Why the scan runs before the build', 'Jenkinsfile', '183-190'),
      ev('bandit and pip-audit', 'Jenkinsfile', '217-223'),
    ],
  },
  {
    title: 'A multi-stage backend Docker image running as a non-root user',
    why:
      'I run containers as non-root so a process inside one does not start with root rights. The backend image is multi-stage. In the cluster, Nginx runs as user 101, and Django, PostgreSQL, Redis and the backup job set runAsNonRoot.',
    evidence: [
      ev('Non-root user in the backend image', 'campuscart-backend/Dockerfile', '108-110'),
      ev('Nginx as user 101', 'k8s/nginx.yaml', '42-44'),
      ev('Web pods as non-root', 'k8s/web.yaml', '121'),
    ],
  },
  {
    title: 'Namespace-scoped permissions for Jenkins',
    why:
      'The identity that builds images is separate from the one that deploys. The deployer has a Role in one namespace. It can update Deployments and Services, read Pods and create or delete Jobs. It has no rule for Secrets.',
    evidence: [
      ev('Role', 'k8s/jenkins-deployer-rbac.yaml', '15-54'),
      ev('RoleBinding', 'k8s/jenkins-deployer-rbac.yaml', '57-71'),
    ],
  },
  {
    title: 'Vault for secrets',
    why:
      'I did not want passwords in images or in Git. The web pods read Django secrets and database credentials from Vault. The migrate Job and the backup job each use their own Vault role.',
    evidence: [
      ev('Django secrets from Vault', 'k8s/web.yaml', '63-65'),
      ev('Database credentials from Vault', 'k8s/web.yaml', '92-94'),
      ev('Backup job Vault role', 'k8s/postgres-backup-cronjob.yaml', '30-31'),
    ],
  },
  {
    title: 'Internal TLS with cert-manager and a private CA',
    why:
      'cert-manager issues certificates from a private CA for Nginx and for the ingress. The ingress checks the Nginx certificate when it connects to the backend.',
    evidence: [
      ev('Certificates', 'k8s/internal-tls-certs.yaml', '4-41'),
      ev('Ingress verifies the backend', 'k8s/ingress.yaml', '7-10'),
    ],
  },
  {
    title: 'Cloudflare Tunnel for the public link',
    why:
      'I run cloudflared inside the cluster as two replicas. It reaches Cloudflare from the inside and passes requests to the ingress controller over HTTPS, checked against my private CA.',
    evidence: [
      ev('cloudflared Deployment, two replicas', 'k8s/cloudflare-tunnel/cloudflared-deployment.yaml', '2-7'),
      ev('Route to the ingress over HTTPS', 'k8s/cloudflare-tunnel/cloudflared-config.yaml', '11-15'),
    ],
  },
];

const kubeadmEvidence: EvidenceLink[] = [
  ev('Pipeline: the five stages', 'Jenkinsfile', '15-316'),
  ev('Deploy: migrate Job, apply, rollout check, undo', 'Jenkinsfile', '363-406'),
  ev('Web Deployment, two replicas, probes and PodDisruptionBudget', 'k8s/web.yaml', '21-26'),
  ev('PostgreSQL StatefulSet', 'k8s/postgres.yaml', '32-38'),
  ev('Redis Deployment', 'k8s/redis.yaml', '29-34'),
  ev('Nightly backup CronJob', 'k8s/postgres-backup-cronjob.yaml', '12-17'),
  ev('Backup volume pinned to worker1', 'k8s/backup-storage.yaml', '2-28'),
  ev('Jenkins deployer Role and RoleBinding', 'k8s/jenkins-deployer-rbac.yaml', '15-71'),
  ev('Internal TLS certificates', 'k8s/internal-tls-certs.yaml', '4-41'),
  ev('Vault: database credentials', 'k8s/web.yaml', '92-94'),
  ev('Prometheus values', 'monitoring/values.yaml', '1-20'),
  ev('Backend image: multi-stage, non-root', 'campuscart-backend/Dockerfile', '4-110'),
  GRAFANA_NAMESPACE_SHOT,
];

export const KUBEADM_PROJECT: Project = {
  slug: 'kubeadm',
  title: 'Self-Built Kubernetes Platform',
  summary:
    'I built a 3-node Kubernetes cluster with kubeadm and a Jenkins pipeline that tests, scans, builds and deploys CampusCart to it.',
  status: QA_CONFIRMED_LIVE
    ? { kind: 'live', label: 'Live' }
    : { kind: 'pending-confirmation', label: 'Deployed on my own kubeadm cluster' },
  liveUrl: KUBEADM_LIVE_URL,
  tags: ['kubeadm', 'Jenkins', 'Vault', 'cert-manager', 'Cloudflare Tunnel', 'Prometheus'],

  overview: [
    'The goal was to run a real web app on a Kubernetes cluster that I set up myself, with a pipeline that tests, scans, builds and deploys it. The cluster has three nodes: one control plane and two workers, on Kubernetes v1.30. The app is CampusCart, a Django web app with Nginx, PostgreSQL and Redis.',
    'I built CampusCart with AI coding tools. My own work is the platform around it: Kubernetes, CI/CD, secrets, TLS, monitoring and AWS infrastructure in Terraform.',
  ],
  architecture: DIAGRAMS['kubeadm-architecture'],
  pipeline: DIAGRAMS['kubeadm-pipeline'],
  decisions: kubeadmDecisions,
  securityAndOps: [
    'Vault gives Django its secrets and database credentials at runtime. Nothing secret is in an image or in Git.',
    'The web, Redis, PostgreSQL and backup pods set runAsNonRoot. Nginx runs as user 101.',
    'The web Deployment runs two replicas. It has a PodDisruptionBudget (one pod may be unavailable) and startup, readiness and liveness probes.',
    'A migrate Job runs database migrations inside the Deploy stage, before the new Deployments are applied.',
    'The Deploy stage checks each rollout. If the new pods are not ready in time, it runs kubectl rollout undo.',
    'A CronJob runs pg_dump every day at 02:00 UTC. The backup volume is pinned to worker1, apart from the worker that holds Vault data.',
    'Prometheus scrapes Django, PostgreSQL and Redis through ServiceMonitors, and Django exposes its own metrics.',
    GRAFANA_NAMESPACE_CAPTION + '.',
  ],
  nextImprovements: [
    'Add alerting rules and notifications. Today Prometheus only collects metrics.',
    'Test a restore from the nightly PostgreSQL backup, and write the steps down.',
    'Keep my Grafana dashboards in the repo. Today they are not stored there.',
    'Put the Vault setup and the private CA issuer in the repo. The manifests use them, but the repo does not define them.',
    'Make the Nginx image itself non-root. Today the non-root user is set by the Kubernetes securityContext, not by the image.',
  ],
  evidence: kubeadmEvidence,
};

/* ------------------------------------------------------------------ */
/* Case study B: AWS                                                   */
/* ------------------------------------------------------------------ */

const awsDecisions: KeyDecision[] = [
  {
    title: 'Seven Terraform modules',
    why:
      'I split the infrastructure into networking, iam, iam-irsa, eks, rds, elasticache and ecr. Each module has one job, so I can change one part without touching the others. The production environment uses six of them, and a second environment uses iam-irsa.',
    evidence: [
      evTree('terraform/modules', 'terraform/modules'),
      ev('Production environment wires six modules', 'terraform/environments/production/main.tf', '10-70'),
      ev('iam-irsa used by the add-ons environment', 'terraform/environments/production-addons/main.tf', '14-22'),
    ],
  },
  {
    title: 'A manual approval between plan and apply',
    why:
      'The pipeline shows the Terraform plan, then waits up to 30 minutes for a person to approve. Nothing is applied until I have read the plan.',
    evidence: [
      ev('Show Terraform Plan and the approval stage', 'Jenkinsfile.aws', '79-113'),
    ],
  },
  {
    title: 'Remote state in S3 with native locking',
    why:
      'I used S3 native state locking, so I did not need a separate DynamoDB table. The state bucket has versioning and encryption.',
    evidence: [
      ev('Backend: native locking and encryption', 'terraform/environments/production/backend.tf', '25-34'),
      ev('State bucket: versioning and encryption', 'terraform/bootstrap/main.tf', '36-60'),
    ],
  },
  {
    title: 'Spot nodes and one NAT gateway',
    why:
      'I built this environment to test and then destroy it, so I chose low cost over resilience. The node group uses Spot capacity and the VPC has one NAT gateway. That means it is not built for high availability.',
    evidence: [
      ev('Spot is the default capacity type', 'terraform/environments/production/variables.tf', '65-69'),
      ev('One NAT gateway, for a test-and-destroy workflow', 'terraform/modules/networking/variables.tf', '45-48'),
    ],
  },
  {
    title: 'RDS and ElastiCache instead of in-cluster databases',
    why:
      'The kubeadm project runs PostgreSQL and Redis inside the cluster. On AWS I moved them to managed services in private subnets. RDS is encrypted and not publicly accessible. It runs in a single availability zone.',
    evidence: [
      ev('RDS instance', 'terraform/modules/rds/main.tf', '90-111'),
      ev('ElastiCache cluster', 'terraform/modules/elasticache/main.tf', '44-49'),
    ],
  },
  {
    title: 'External Secrets Operator for the database password',
    why:
      'Terraform generates the database password and stores it in AWS Secrets Manager. External Secrets Operator copies it into a Kubernetes Secret that the backend reads. I configured an IRSA module and ServiceAccounts in Terraform and manifests for the External Secrets Operator and the AWS Load Balancer Controller only. The app pods do not use IRSA.',
    evidence: [
      ev('Password generated and stored in Secrets Manager', 'terraform/modules/rds/main.tf', '14-41'),
      ev('IRSA for External Secrets Operator', 'terraform/environments/production-addons/main.tf', '14-22'),
      ev('ExternalSecret', 'k8s-aws/externalsecret.yaml', '11-28'),
      ev('App ServiceAccount has no role annotation', 'k8s-aws/serviceaccount.yaml', '9-13'),
    ],
  },
  {
    title: 'Kaniko to ECR, manifests rendered from Terraform outputs',
    why:
      'The pipeline builds the backend and Nginx images with Kaniko and pushes them to ECR. A Render Manifests stage reads the database and Redis endpoints and the image URLs from terraform output, so I did not copy them by hand.',
    evidence: [
      ev('Kaniko push to ECR', 'Jenkinsfile.aws', '224-238'),
      ev('Render Manifests', 'Jenkinsfile.aws', '246-305'),
    ],
  },
];

const awsEvidence: EvidenceLink[] = [
  ev('Pipeline: the nine stages', 'Jenkinsfile.aws', '11-310'),
  ev('Manual approval stage', 'Jenkinsfile.aws', '102-113'),
  evTree('Terraform modules', 'terraform/modules'),
  ev('Production environment', 'terraform/environments/production/main.tf', '10-70'),
  ev('Remote state backend', 'terraform/environments/production/backend.tf', '25-34'),
  ev('EKS node group', 'terraform/modules/eks/main.tf', '77-94'),
  ev('RDS instance', 'terraform/modules/rds/main.tf', '90-111'),
  ev('IRSA for External Secrets Operator and the ALB controller', 'terraform/environments/production-addons/main.tf', '14-22'),
  ev('Ingress: HTTP listener only', 'k8s-aws/ingress.yaml', '30'),
  ev('Ingress: certificate and redirect lines are commented out', 'k8s-aws/ingress.yaml', '35-39'),
  ev('HorizontalPodAutoscaler', 'k8s-aws/hpa.yaml', '5-31'),
  ev('App ServiceAccount', 'k8s-aws/serviceaccount.yaml', '9-13'),
];

export const AWS_PROJECT: Project = {
  slug: 'aws',
  title: 'AWS Infrastructure and EKS Deployment',
  summary:
    'I wrote Terraform for a VPC, EKS, RDS and ElastiCache, and a Jenkins pipeline that plans, waits for approval, applies and deploys the app.',
  status: { kind: 'completed-torn-down', label: 'Completed deployment, infrastructure torn down' },
  tags: ['Terraform', 'EKS', 'RDS', 'ElastiCache', 'ECR', 'Jenkins'],

  overview: [
    'This is the same CampusCart app, which I built with AI coding tools, deployed to AWS. The goal was to build the infrastructure as Terraform code, in seven modules, and deploy with a nine-stage Jenkins pipeline, as deployed. I completed the deployment and then tore the infrastructure down.',
    'The app runs on EKS (Kubernetes 1.31) on managed Spot nodes. It uses RDS PostgreSQL and ElastiCache Redis instead of the database and cache I ran inside the kubeadm cluster.',
  ],
  architecture: DIAGRAMS['aws-architecture'],
  pipeline: DIAGRAMS['aws-pipeline'],
  decisions: awsDecisions,
  securityAndOps: [
    'Worker nodes run only in private subnets.',
    'RDS is encrypted at rest and not publicly accessible. Terraform generates its password and keeps it in AWS Secrets Manager.',
    'Jenkins reaches EKS through an access entry limited to one namespace.',
    'The backend Deployment starts with two replicas. A HorizontalPodAutoscaler is set from 2 to 6 replicas, at 70 percent CPU and 80 percent memory.',
    'The backend and Nginx pods set runAsNonRoot. The app ServiceAccount does not mount a service account token.',
    'The load balancer has an HTTP listener on port 80 only. It routes /api and /ws to the backend and / to Nginx.',
    'Deploy to EKS waits on rollout status: backend up to 180 seconds, Nginx up to 120 seconds. The pipeline as deployed has no rollback.',
    'After teardown I added Test and Security Scan stages to Jenkinsfile.aws. They have never run, because the environment no longer exists.',
  ],
  nextImprovements: [
    'Add an ACM certificate and an HTTPS listener to the load balancer. The certificate and redirect lines in the ingress file are commented out.',
    'Run the Test and Security Scan stages I added to Jenkinsfile.aws after teardown, and add a rollback step.',
    'Make RDS Multi-AZ. It runs in a single availability zone today.',
    'Harden the Nginx container and fix its ports. The AWS manifest uses port 80, but the Nginx config in the image listens on 8080 and 8443.',
    'Add alerting rules and notifications.',
  ],
  evidence: awsEvidence,
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** Home order: kubeadm first, AWS second. */
export const PROJECTS: Project[] = [KUBEADM_PROJECT, AWS_PROJECT];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
