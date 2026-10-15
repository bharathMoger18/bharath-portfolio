/*
 * MOCK data for StackTable. Account D replaces it with src/data/stack.ts.
 * Notes are TODO(D) on purpose: no real copy here. Which tools exist and where
 * they are tagged follows docs/FACTS.md only (CONFIRMED rows; Ubuntu, TCP/IP,
 * DNS, HTTP and Grafana are tagged "learning" with no evidence, per RS-09 and M-03).
 * Evidence links point at the audited repo and commit; D re-checks every one.
 */
import type { EvidenceLink, StackItem } from '../../data/types.ts';

const REPO = 'https://github.com/bharathMoger18/k8s-campuscart';
const COMMIT = '774df40';

function ev(label: string, path: string, lines?: string, tree = false): EvidenceLink {
  return {
    label,
    path,
    url: `${REPO}/${tree ? 'tree' : 'blob'}/${COMMIT}/${path}`,
    commit: COMMIT,
    ...(lines ? { lines } : {}),
  };
}

const NOTE = 'TODO(D): one factual sentence.';

export const MOCK_STACK: StackItem[] = [
  // Containers
  { id: 'docker', symbol: 'Dk', name: 'Docker', category: 'containers', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('Backend Dockerfile', 'campuscart-backend/Dockerfile')] },
  { id: 'docker-compose', symbol: 'Dc', name: 'Docker Compose', category: 'containers', usedIn: ['learning'], note: NOTE, evidence: [] },
  { id: 'kubernetes', symbol: 'Kb', name: 'Kubernetes', category: 'containers', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('kubeadm manifests', 'k8s', undefined, true), ev('AWS manifests', 'k8s-aws', undefined, true)] },
  { id: 'kubectl', symbol: 'Kc', name: 'kubectl', category: 'containers', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('Rollout check', 'Jenkinsfile', '382-406')] },
  { id: 'kubeadm', symbol: 'Kd', name: 'kubeadm', category: 'containers', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('kubeadm manifests', 'k8s', undefined, true)] },

  // CI/CD and IaC
  { id: 'jenkins', symbol: 'Jk', name: 'Jenkins', category: 'cicd-iac', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('kubeadm pipeline', 'Jenkinsfile'), ev('AWS pipeline', 'Jenkinsfile.aws')] },
  { id: 'kaniko', symbol: 'Kn', name: 'Kaniko', category: 'cicd-iac', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('Kaniko builds', 'Jenkinsfile')] },
  { id: 'terraform', symbol: 'Tf', name: 'Terraform', category: 'cicd-iac', usedIn: ['aws'], note: NOTE, evidence: [ev('Terraform modules', 'terraform/modules', undefined, true)] },
  { id: 'git', symbol: 'Gt', name: 'Git', category: 'cicd-iac', usedIn: ['learning'], note: NOTE, evidence: [] },

  // Cloud (AWS)
  { id: 'eks', symbol: 'Ek', name: 'AWS EKS', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('EKS module', 'terraform/modules/eks', undefined, true)] },
  { id: 'ecr', symbol: 'Er', name: 'Amazon ECR', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('ECR module', 'terraform/modules/ecr', undefined, true)] },
  { id: 'rds', symbol: 'Rd', name: 'Amazon RDS', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('RDS module', 'terraform/modules/rds', undefined, true)] },
  { id: 'elasticache', symbol: 'El', name: 'ElastiCache', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('ElastiCache module', 'terraform/modules/elasticache', undefined, true)] },
  { id: 's3', symbol: 'S3', name: 'Amazon S3', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('Remote state backend', 'terraform/environments/production/backend.tf')] },
  { id: 'vpc', symbol: 'Vp', name: 'AWS VPC', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('Networking module', 'terraform/modules/networking', undefined, true)] },
  { id: 'iam', symbol: 'Im', name: 'AWS IAM', category: 'cloud', usedIn: ['aws'], note: NOTE, evidence: [ev('IAM module', 'terraform/modules/iam', undefined, true)] },

  // Observability and security
  { id: 'prometheus', symbol: 'Pm', name: 'Prometheus', category: 'observability-security', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('Prometheus values', 'monitoring/values.yaml')] },
  { id: 'grafana', symbol: 'Gf', name: 'Grafana', category: 'observability-security', usedIn: ['learning'], note: NOTE, evidence: [] },
  { id: 'vault', symbol: 'Vl', name: 'HashiCorp Vault', category: 'observability-security', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('Vault at runtime', 'campuscart-backend/entrypoint.sh')] },
  { id: 'cert-manager', symbol: 'Cm', name: 'cert-manager', category: 'observability-security', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('Internal TLS certificates', 'k8s/internal-tls-certs.yaml')] },

  // Systems
  { id: 'linux', symbol: 'Lx', name: 'Linux (Ubuntu)', category: 'systems', usedIn: ['learning'], note: NOTE, evidence: [] },
  { id: 'bash', symbol: 'Ba', name: 'Bash', category: 'systems', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('Backend entrypoint', 'campuscart-backend/entrypoint.sh')] },
  { id: 'python', symbol: 'Py', name: 'Python', category: 'systems', usedIn: ['kubeadm'], note: NOTE, evidence: [ev('Backend app', 'campuscart-backend', undefined, true)] },
  { id: 'nginx', symbol: 'Ng', name: 'Nginx', category: 'systems', usedIn: ['kubeadm', 'aws'], note: NOTE, evidence: [ev('Nginx config', 'nginx/nginx.conf')] },
  { id: 'tcp-ip', symbol: 'Tc', name: 'TCP/IP', category: 'systems', usedIn: ['learning'], note: NOTE, evidence: [] },
  { id: 'dns', symbol: 'Dn', name: 'DNS', category: 'systems', usedIn: ['learning'], note: NOTE, evidence: [] },
  { id: 'http', symbol: 'Ht', name: 'HTTP/HTTPS', category: 'systems', usedIn: ['learning'], note: NOTE, evidence: [] },
];
