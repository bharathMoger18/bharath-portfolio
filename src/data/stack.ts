/*
 * Stack tiles. Owner: Account D (Content).
 * A tool is tagged "learning" only when FACTS has no evidence for it
 * (linux, tcp-ip, dns, http, ec2). Wording follows DECISIONS #10 to #15.
 * FACTS rows per tile are listed in docs/INTEGRATION.md.
 */
import type { StackItem } from './types.ts';
import { GRAFANA_NAMESPACE_CAPTION, GRAFANA_NAMESPACE_SHOT, ev, evTree } from './evidence.ts';

export const STACK: StackItem[] = [
  // ---- Containers
  {
    id: 'docker', symbol: 'Dk', name: 'Docker', category: 'containers', usedIn: ['kubeadm', 'aws'],
    note: 'The backend is a multi-stage Docker image running as a non-root user.',
    evidence: [
      ev('Two FROM stages: builder and final', 'campuscart-backend/Dockerfile', '4-47'),
      ev('Non-root user', 'campuscart-backend/Dockerfile', '108-110'),
    ],
  },
  {
    id: 'docker-compose', symbol: 'Dc', name: 'Docker Compose', category: 'containers', usedIn: ['kubeadm'],
    note: 'The repo has a Compose file for the four app services: PostgreSQL, Redis, the web app and Nginx.',
    evidence: [ev('docker-compose.yml services', 'docker-compose.yml', '1-80')],
  },
  {
    id: 'kubernetes', symbol: 'Kb', name: 'Kubernetes', category: 'containers', usedIn: ['kubeadm', 'aws'],
    note: 'I deployed the app with Kubernetes manifests on my own kubeadm cluster and on EKS.',
    evidence: [evTree('kubeadm manifests', 'k8s'), evTree('AWS manifests', 'k8s-aws')],
  },
  {
    id: 'kubectl', symbol: 'Kc', name: 'kubectl', category: 'containers', usedIn: ['kubeadm', 'aws'],
    note: 'Both pipelines use kubectl to apply manifests and to check each rollout.',
    evidence: [
      ev('kubeadm: rollout check and undo', 'Jenkinsfile', '378-406'),
      ev('AWS: apply and rollout status', 'Jenkinsfile.aws', '340-358'),
    ],
  },
  {
    id: 'kubeadm', symbol: 'Kd', name: 'kubeadm', category: 'containers', usedIn: ['kubeadm'],
    note: 'I built the cluster myself: one control plane node and two workers, on Kubernetes v1.30.',
    evidence: [
      ev('Worker nodes named in the backup volume manifest', 'k8s/backup-storage.yaml', '4-28'),
      evTree('Manifests that run on the cluster', 'k8s'),
    ],
  },

  // ---- CI/CD and IaC
  {
    id: 'jenkins', symbol: 'Jk', name: 'Jenkins', category: 'cicd-iac', usedIn: ['kubeadm', 'aws'],
    note: 'I built a five-stage pipeline for the kubeadm cluster and a nine-stage pipeline for AWS.',
    evidence: [
      ev('kubeadm pipeline stages', 'Jenkinsfile', '15-316'),
      ev('AWS pipeline stages', 'Jenkinsfile.aws', '11-310'),
    ],
  },
  {
    id: 'kaniko', symbol: 'Kn', name: 'Kaniko', category: 'cicd-iac', usedIn: ['kubeadm', 'aws'],
    note: 'Kaniko builds the backend and Nginx images inside Jenkins agent pods, one container per image.',
    evidence: [
      ev('kubeadm: Kaniko containers and why', 'Jenkinsfile', '244-266'),
      ev('AWS: Kaniko containers', 'Jenkinsfile.aws', '188-200'),
    ],
  },
  {
    id: 'terraform', symbol: 'Tf', name: 'Terraform', category: 'cicd-iac', usedIn: ['aws'],
    note: 'My AWS infrastructure is Terraform code in seven modules.',
    evidence: [
      evTree('terraform/modules', 'terraform/modules'),
      ev('Production environment wires the modules', 'terraform/environments/production/main.tf', '10-70'),
    ],
  },
  {
    id: 'git', symbol: 'Gt', name: 'Git', category: 'cicd-iac', usedIn: ['kubeadm', 'aws'],
    note: 'The repo keeps .env files, Terraform state and Terraform variable files out of Git.',
    evidence: [
      ev('.gitignore: .env files', '.gitignore', '20-21'),
      ev('.gitignore: Terraform state and variable files', '.gitignore', '61-69'),
    ],
  },

  // ---- Cloud (AWS)
  {
    id: 'eks', symbol: 'Ek', name: 'AWS EKS', category: 'cloud', usedIn: ['aws'],
    note: 'EKS runs Kubernetes 1.31 on managed Spot nodes in private subnets.',
    evidence: [
      ev('EKS node group', 'terraform/modules/eks/main.tf', '77-94'),
      ev('Kubernetes version and Spot default', 'terraform/environments/production/variables.tf', '53-69'),
    ],
  },
  {
    id: 'ecr', symbol: 'Er', name: 'Amazon ECR', category: 'cloud', usedIn: ['aws'],
    note: 'Kaniko pushes the backend and Nginx images to ECR repositories that Terraform creates.',
    evidence: [
      ev('ECR repositories', 'terraform/modules/ecr/main.tf', '17-25'),
      ev('Kaniko push to ECR', 'Jenkinsfile.aws', '224-238'),
    ],
  },
  {
    id: 'rds', symbol: 'Rd', name: 'Amazon RDS', category: 'cloud', usedIn: ['aws'],
    note: 'Terraform creates an encrypted PostgreSQL 16 database in private subnets, in a single availability zone.',
    evidence: [ev('RDS instance', 'terraform/modules/rds/main.tf', '90-111')],
  },
  {
    id: 'elasticache', symbol: 'El', name: 'ElastiCache', category: 'cloud', usedIn: ['aws'],
    note: 'Terraform creates a single-node Redis 7.1 cache in private subnets.',
    evidence: [ev('ElastiCache cluster', 'terraform/modules/elasticache/main.tf', '44-49')],
  },
  {
    id: 's3', symbol: 'S3', name: 'Amazon S3', category: 'cloud', usedIn: ['aws'],
    note: 'Terraform state lives in an S3 bucket with versioning, encryption and native state locking.',
    evidence: [
      ev('Backend: region, native locking, encryption', 'terraform/environments/production/backend.tf', '25-34'),
      ev('State bucket: versioning and encryption', 'terraform/bootstrap/main.tf', '36-60'),
    ],
  },
  {
    id: 'vpc', symbol: 'Vp', name: 'AWS VPC', category: 'cloud', usedIn: ['aws'],
    note: 'Terraform builds a VPC over two availability zones, with public and private subnets and one NAT gateway.',
    evidence: [
      ev('Public and private subnets', 'terraform/modules/networking/main.tf', '50-87'),
      ev('One NAT gateway by default', 'terraform/modules/networking/variables.tf', '45-48'),
    ],
  },
  {
    id: 'iam', symbol: 'Im', name: 'AWS IAM', category: 'cloud', usedIn: ['aws'],
    note: 'Terraform defines the IAM roles for the EKS cluster and nodes, and limits Jenkins access to one namespace.',
    evidence: [
      ev('Cluster and node roles', 'terraform/modules/iam/main.tf', '44-60'),
      ev('Jenkins access scoped to one namespace', 'terraform/environments/production/main.tf', '100-107'),
    ],
  },
  {
    id: 'ec2', symbol: 'E2', name: 'Amazon EC2', category: 'cloud', usedIn: ['learning'],
    note: 'I used EC2 in earlier AWS practice projects, before I moved to EKS with managed node groups.',
    evidence: [],
  },

  // ---- Observability and security
  {
    id: 'prometheus', symbol: 'Pm', name: 'Prometheus', category: 'observability-security', usedIn: ['kubeadm'],
    note: 'Prometheus scrapes Django, PostgreSQL and Redis on my kubeadm cluster through ServiceMonitors.',
    evidence: [
      ev('Prometheus values', 'monitoring/values.yaml', '1-20'),
      ev('Web ServiceMonitor', 'k8s/web-servicemonitor.yaml', '2-16'),
      ev('PostgreSQL ServiceMonitor', 'k8s/postgres-servicemonitor.yaml', '2-15'),
      ev('Redis ServiceMonitor', 'k8s/redis-servicemonitor.yaml', '2-15'),
    ],
  },
  {
    id: 'grafana', symbol: 'Gf', name: 'Grafana', category: 'observability-security', usedIn: ['kubeadm'],
    note: GRAFANA_NAMESPACE_CAPTION + '.',
    evidence: [GRAFANA_NAMESPACE_SHOT],
  },
  {
    id: 'vault', symbol: 'Vl', name: 'HashiCorp Vault', category: 'observability-security', usedIn: ['kubeadm'],
    note: 'My Django pods get their database credentials and app secrets from Vault, not from images or Git.',
    evidence: [
      ev('Database credentials from Vault', 'k8s/web.yaml', '92-94'),
      ev('App secrets from Vault', 'k8s/web.yaml', '63-65'),
      ev('Backend reads the Vault credentials file', 'campuscart-backend/campuscart/db_backend/base.py', '20-24'),
    ],
  },
  {
    id: 'cert-manager', symbol: 'Cm', name: 'cert-manager', category: 'observability-security', usedIn: ['kubeadm'],
    note: 'cert-manager issues internal TLS certificates from a private CA for Nginx and for the ingress.',
    evidence: [
      ev('Nginx backend certificate', 'k8s/internal-tls-certs.yaml', '4-21'),
      ev('Ingress certificate', 'k8s/internal-tls-certs.yaml', '26-41'),
      ev('Ingress verifies the Nginx backend', 'k8s/ingress.yaml', '7-10'),
    ],
  },

  // ---- Systems
  {
    id: 'linux', symbol: 'Lx', name: 'Linux (Ubuntu)', category: 'systems', usedIn: ['learning'],
    note: 'I practise Linux on Ubuntu. No project file shows this, so I tag it as learning.',
    evidence: [],
  },
  {
    id: 'bash', symbol: 'Ba', name: 'Bash', category: 'systems', usedIn: ['kubeadm'],
    note: 'The backend entrypoint is a Bash script that loads the Vault secrets before it starts the app.',
    evidence: [ev('Entrypoint: load Vault secrets', 'campuscart-backend/entrypoint.sh', '8-16')],
  },
  {
    id: 'python', symbol: 'Py', name: 'Python', category: 'systems', usedIn: ['kubeadm', 'aws'],
    note: 'CampusCart is a Python and Django app that I built with AI coding tools.',
    evidence: [
      ev('Python base image', 'campuscart-backend/Dockerfile', '4'),
      ev('Pinned Django version', 'campuscart-backend/requirements.txt', '18'),
    ],
  },
  {
    id: 'nginx', symbol: 'Ng', name: 'Nginx', category: 'systems', usedIn: ['kubeadm', 'aws'],
    note: 'Nginx is the reverse proxy in front of Django. On my kubeadm cluster it runs as a non-root user.',
    evidence: [
      ev('Proxy to the backend', 'nginx/nginx.conf', '45-48'),
      ev('Runs as user 101 on kubeadm', 'k8s/nginx.yaml', '42-44'),
    ],
  },
  {
    id: 'tcp-ip', symbol: 'Tc', name: 'TCP/IP', category: 'systems', usedIn: ['learning'],
    note: 'I study TCP/IP basics. I do not cite project evidence for it.',
    evidence: [],
  },
  {
    id: 'dns', symbol: 'Dn', name: 'DNS', category: 'systems', usedIn: ['learning'],
    note: 'I study DNS basics. I do not cite project evidence for it.',
    evidence: [],
  },
  {
    id: 'http', symbol: 'Ht', name: 'HTTP/HTTPS', category: 'systems', usedIn: ['learning'],
    note: 'I study HTTP and HTTPS basics. I do not cite project evidence for it.',
    evidence: [],
  },
];
