/*
 * Text alternatives for /lab, written from the verified files (k8s-campuscart@774df40).
 * Account D owns the real copy in src/data; these are a checked starting point.
 * Keep wording inside docs/DECISIONS.md (AWS never "live", IRSA "configured", ALB HTTP only).
 */
import type { CaseDiagram, DiagramId } from '../../data/types.ts';

export const KUBEADM_ARCHITECTURE_TEXT = `Visitors reach the public hostname through Cloudflare. A Cloudflare Tunnel carries the request to cloudflared, which runs as two replicas in the cloudflare-tunnel namespace inside the kubeadm cluster (Kubernetes v1.30, one control plane node and two workers). cloudflared sends the request over HTTPS to the ingress-nginx controller. ingress-nginx serves the cloudflare-edge-tls certificate and talks HTTPS to Nginx, which listens on port 8443 with the nginx-backend-tls certificate. Nginx forwards over plain HTTP to the web Service on port 8000, which is the Django Deployment with two replicas.

Django connects to PostgreSQL (a one-replica StatefulSet, Service postgres, port 5432) and to Redis (a one-replica Deployment, Service redis, port 6379).

Two jobs also use PostgreSQL. A migrate Job runs database migrations; the Deploy stage creates it before the new Deployments are applied. A CronJob runs pg_dump every day at 02:00 and writes to the postgres-backups volume.

Platform services: cert-manager issues the nginx-backend-tls and cloudflare-edge-tls certificates from a private CA ClusterIssuer, which the repo references but does not define. Vault injects secrets into Django (dynamic database credentials and key-value secrets), the migrate Job and the backup CronJob, each with its own role. The repo has no Vault server manifests. Prometheus scrapes Django, PostgreSQL and Redis through ServiceMonitors.

Build and deploy: in the Build and Push stage, Kaniko in a Jenkins agent pod pushes the web and nginx images to a private registry, and the Deployments and the migrate Job pull from it. The Deploy stage runs as the ServiceAccount jenkins-deployer in the jenkins-agents namespace. A Role and RoleBinding limited to the k8s-campuscart namespace let it update Deployments and Services and create or delete Jobs there.`;

export const KUBEADM_PIPELINE_TEXT = `The kubeadm pipeline, from Jenkinsfile, has five stages in this order: 1 Checkout, 2 Test, 3 Security Scan, 4 Build and Push Images, 5 Deploy.

Checkout tags each image by the last commit that touched its inputs and asks the private registry whether each tag already exists. Test and Security Scan are skipped when the web image tag already exists. Test runs the Django tests against PostgreSQL 15 and Redis 7 sidecar containers. Security Scan runs bandit and pip-audit before any image is built. Build and Push Images runs when the web or nginx image is missing; Kaniko builds each missing image and pushes it to the private registry.

Deploy has four steps. Migrate, inside Deploy: delete the old migrate Job, apply the new one, wait up to 180 seconds, and print its logs if it fails. Apply: the web and nginx manifests. Rollout check: web up to 600 seconds, nginx up to 120 seconds. On failure: kubectl rollout undo when the new ReplicaSet has fewer ready pods than wanted, then wait up to 300 seconds.`;

export const AWS_ARCHITECTURE_TEXT = `Status: completed deployment, infrastructure torn down.

Internet clients send HTTP requests on port 80 to an internet-facing Application Load Balancer in the public subnets of a VPC in ap-south-1 that spans two availability zones. The listener is HTTP only. An ACM certificate and HTTPS are planned and not built. The ALB, created by the AWS Load Balancer Controller from the Ingress, routes /api and /ws to the backend on port 8000 and / to nginx on port 80. The targets are pod IPs.

The pods run on an EKS cluster (Kubernetes 1.31, managed Spot node group) in the private subnets. The backend is a Deployment with at least two replicas and a HorizontalPodAutoscaler from 2 to 6. Its database and cache hosts come from a ConfigMap and point to RDS PostgreSQL 16 (single AZ) and ElastiCache Redis 7.1 (one node), both in the private subnets. One NAT gateway handles outbound traffic from the private subnets.

External Secrets Operator copies the database password from AWS Secrets Manager into a Kubernetes Secret, refreshed every hour, and the backend reads that Secret. IRSA is configured in Terraform and manifests for External Secrets Operator and the AWS Load Balancer Controller only. The application pods do not use IRSA.

Amazon ECR holds the campuscart-backend and campuscart-nginx images. Terraform remote state lives in an S3 bucket with native locking.

Terraform has seven modules: ecr, eks, elasticache, iam, iam-irsa, networking and rds. The iam-irsa module is used by the production-addons root. A Jenkins pipeline (Jenkinsfile.aws, nine stages) runs plan, manual approval and apply, then builds, pushes and deploys. Jenkins reaches EKS through an access entry limited to the campuscart namespace.`;

export const AWS_PIPELINE_TEXT = `The AWS pipeline, from Jenkinsfile.aws, has nine stages in this order: 1 Checkout, 2 Terraform Plan, 3 Show Terraform Plan, 4 Approve Infrastructure Changes, 5 Terraform Apply, 6 Prepare AWS Context, 7 Build and Push Images, 8 Render Manifests, 9 Deploy to EKS.

Stage 4 is a manual approval gate: the pipeline waits for a person, with a 30 minute timeout, before Terraform Apply. Kaniko builds the backend and nginx images and pushes them to Amazon ECR. Render Manifests reads the RDS and Redis endpoints and the ECR image URLs from terraform output. Deploy to EKS applies the manifests and then waits on rollout status: backend up to 180 seconds, nginx up to 120 seconds.

This pipeline has no test stage, no security scan stage, no migrate step and no rollback.`;

export const PIPELINE_COMPARE_TEXT = `Two pipelines are compared on one rail of nine slots: Source, Pipeline, Test, Scan, Build, Registry, Migrate, Deploy, Verify. A slot a pipeline does not have reads "not in this pipeline".

kubeadm: Source is Checkout. Pipeline is not in this pipeline. Test and Scan are present and run only when the web image tag is new. Build and Registry are Build and Push Images, to a private registry. Migrate, Deploy and Verify are all inside the Deploy stage, which ends with a rollout check and a rollout undo on failure.

AWS: Source is Checkout. Pipeline holds Terraform Plan, Show Terraform Plan, the manual approval, Terraform Apply and Prepare AWS Context. Test, Scan and Migrate are not in this pipeline. Build and Registry are Build and Push Images, to Amazon ECR. Deploy is Render Manifests and Deploy to EKS. Verify is rollout status only, with no rollback.`;

export const DIAGRAM_MOCKS: Record<DiagramId, CaseDiagram> = {
  'kubeadm-architecture': { diagramId: 'kubeadm-architecture', textAlternative: KUBEADM_ARCHITECTURE_TEXT },
  'kubeadm-pipeline': { diagramId: 'kubeadm-pipeline', textAlternative: KUBEADM_PIPELINE_TEXT },
  'aws-architecture': { diagramId: 'aws-architecture', textAlternative: AWS_ARCHITECTURE_TEXT },
  'aws-pipeline': { diagramId: 'aws-pipeline', textAlternative: AWS_PIPELINE_TEXT },
};
