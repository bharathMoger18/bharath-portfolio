# Diagram evidence (k8s-campuscart@774df40)

Every drawn element, with `path:line` at commit 774df4037e5e7984d7b95b4adebf143cfb216bcd.

## KubeadmArchitecture
| Element | Evidence |
|---|---|
| Users, Cloudflare, public hostname via tunnel (implied, edge config is outside the repo) | k8s/cloudflare-tunnel/cloudflared-config.yaml:8,12 |
| cloudflared, 2 replicas, ns cloudflare-tunnel | cloudflared-deployment.yaml:5,7 |
| cloudflared to ingress-nginx over HTTPS :443, private CA pool | cloudflared-config.yaml:13-15 |
| ingress-nginx serves cloudflare-edge-tls, HTTPS to Nginx | k8s/ingress.yaml:7-10,16,23-25 |
| Nginx 1 replica, 8443 with nginx-backend-tls | k8s/nginx.yaml:21,29,54,92 |
| Nginx to Django plain HTTP web:8000 | nginx/nginx.conf:6,48 |
| Django Deployment x2, Service web | k8s/web.yaml:3-5,21-26 |
| Django to PostgreSQL, Redis (DB_HOST, REDIS_HOST) | k8s/configmap.yaml:12-15; k8s/web.yaml:152-154 |
| PostgreSQL StatefulSet x1, Service postgres | k8s/postgres.yaml:7-9,32,38 |
| Redis Deployment x1, Service redis | k8s/redis.yaml:8-10,29,34 |
| migrate Job, MIGRATE_ONLY, uses campuscart-config | k8s/migrate-job.yaml:5,15-17,60,63-64 |
| backup CronJob 02:00, pg_dump, postgres-backups volume | k8s/postgres-backup-cronjob.yaml:12,17,71-75,100,128 |
| cert-manager Certificates, ClusterIssuer campuscart-ca-issuer (issuer not defined in repo) | k8s/internal-tls-certs.yaml:4-21,26-41 |
| Vault Agent Injector, roles for web, migrate, backup, ns vault | k8s/web.yaml:39,43,46,92; k8s/migrate-job.yaml:27; k8s/postgres-backup-cronjob.yaml:31 |
| Prometheus, ServiceMonitors for web, postgres, redis, retention 10d | k8s/*-servicemonitor.yaml:2,14-15; monitoring/values.yaml:1-4 |
| Build stage: Kaniko pods push to private registry | Jenkinsfile:255-267,288-294 |
| Pods pull from registry | k8s/web.yaml:141; k8s/nginx.yaml:50; k8s/migrate-job.yaml:57 |
| Deploy stage as jenkins-deployer, ns jenkins-agents | Jenkinsfile:327; k8s/jenkins-deployer-rbac.yaml:9-12 |
| Namespace-scoped Role and RoleBinding | k8s/jenkins-deployer-rbac.yaml:15-18,20-54,57-71 |
| 3 nodes, v1.30 | owner output (FACTS K-24), not a repo file |

## KubeadmPipeline
Stages 1-5: Jenkinsfile:15,75,183,229,316. Gates: :76-80,188-190,230-234. Registry check: :56-62. Scan: :217-223. Kaniko: :255-310. Migrate: :363-369. Apply: :375-376. Rollout and undo: :378-406. ServiceAccount: :327.

## AwsArchitecture
| Element | Evidence |
|---|---|
| ALB internet-facing, target-type ip | k8s-aws/ingress.yaml:19,26 |
| Listener HTTP 80 only; certificate and redirect commented out | ingress.yaml:30,35,39 |
| /api, /ws to backend :8000, / to nginx :80 | ingress.yaml:50-72 |
| VPC, public and private subnets, 2 AZs | terraform/modules/networking/main.tf:8,50,86; variables.tf:19-22 |
| Single NAT, private route via NAT | networking/main.tf:149,207-213; variables.tf:45-48 |
| EKS 1.31, Spot, t3.medium, 2/1/3 | terraform/environments/production/variables.tf:53-83; modules/eks/main.tf:8,86-94 |
| EKS nodes, RDS, Redis in private subnets | eks/main.tf:86; rds/main.tf:80; elasticache/main.tf:30 |
| RDS PostgreSQL 16.15, single AZ, private, encrypted | modules/rds/variables.tf; rds/main.tf:92-111 |
| Redis 7.1, one node | modules/elasticache/variables.tf; main.tf:46-49 |
| Backend replicas 2, port 8000, app SA without IRSA | k8s-aws/backend-deployment.yaml:12,35,46; serviceaccount.yaml:9-13 |
| nginx port 80 | k8s-aws/nginx-deployment.yaml:35,49,56 |
| HPA 2 to 6 | k8s-aws/hpa.yaml:15,16,24,31 |
| DB_HOST, REDIS_HOST from ConfigMap | k8s-aws/configmap.yaml:21,25; backend-deployment.yaml:50-51 |
| External Secrets, 1h refresh, Secrets Manager | k8s-aws/externalsecret.yaml:16-28; secretstore.yaml:12-27; modules/rds/main.tf:14,34-41 |
| IRSA for ESO and ALB controller | terraform/environments/production-addons/main.tf:14-22,39,62-71,97 |
| ECR repos | modules/ecr/main.tf:17-24; production/main.tf:54-58 |
| S3 state, native locking | production/backend.tf:25,30,34; bootstrap/main.tf:15,36,54,74 |
| 7 modules | terraform/modules/* |
| Jenkins access entry, namespace campuscart | production/main.tf:86-107 |

## AwsPipeline
Stages 1-9: Jenkinsfile.aws:11,43,79,102,114,146,180,246,310. Approval 30 min: :102-113. No test, scan, migrate or undo: grep returns nothing.

## Not drawn (unverified or contradicted)
Grafana; Nginx to backend on AWS (nginx.conf upstream is `web`, AWS Service is `campuscart-backend`); pod-to-node and pod-to-AZ placement; Vault server install; cert-manager and ingress-nginx install; where the registry runs; TLS on the ALB; Multi-AZ RDS; Redis encryption; IRSA for app pods.
