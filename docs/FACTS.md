# FACTS.md: verified claims for the Bharath portfolio

Task D1. Owner: Account D (Verifier). Status: **DRAFT, awaiting Bharath approval (gate G2).**

- Audited repo: `https://github.com/bharathMoger18/k8s-campuscart`
- Audited commit: `774df4037e5e7984d7b95b4adebf143cfb216bcd` (`774df40`)
- Method: `git clone`, `git checkout 774df40`, then `git grep` / `sed -n` on tracked files only. Evidence below is `path:line` at that commit.
- Rule: nothing ships on the site unless its row is **CONFIRMED**. UNVERIFIED rows need an answer from Bharath or a runtime check. CONTRADICTED rows must not appear on the site.
- Redaction rule: no secret values, private IPs, AWS account IDs, ARNs, tunnel IDs or domain-specific hostnames are copied into this file. Line numbers marked `~` were read from a range and are approximate.

Status legend: **CONFIRMED** = the files prove it. **CONTRADICTED** = the files disprove it. **UNVERIFIED** = the files neither prove nor disprove it.

---

## 0. Source gaps found before auditing

| # | Gap | Effect |
|---|---|---|
| G-1 | `docs/DECISIONS.md` does not exist on `feat/foundation` (only `docs/PLAYBOOK.md`). The brief says DECISIONS overrides PLAYBOOK. | Everything below follows PLAYBOOK only. Any DECISIONS override is **not applied**. Needs the file from the Manager. |
| G-2 | The resume PDF is not in the repo (`public/` is absent on the remote branch). | Resume claims can only be checked where the PLAYBOOK quotes them (section 4). Education rows are UNVERIFIED by design: they are not in the infra repo. |
| G-3 | The remote `feat/foundation` has `src/data/types.ts` and `src/styles/tokens.css` but no `public/`. A local listing shared in chat shows `public/` and no `src/`. | The local checkout and the pushed branch differ. Needs a push from the local copy, or confirmation of which is authoritative. |

---

## 1. kubeadm environment (`k8s/`, `Jenkinsfile`)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| K-01 | kubeadm pipeline has exactly 5 stages: Checkout, Test, Security Scan, Build and Push Images, Deploy | CONFIRMED | `Jenkinsfile:15,75,183,229,316` |
| K-02 | Test runs `python manage.py test --noinput` against Postgres 15 and Redis 7 sidecar containers | CONFIRMED | `Jenkinsfile:75-182` (postgres `~133`, redis `~147`, `manage.py test` `~177`) |
| K-03 | Test and Security Scan run only when the web image tag is not already in the registry | CONFIRMED | `Jenkinsfile:61` sets `WEB_EXISTS`; `:76-80`, `:188-190` gate on `WEB_EXISTS != 'true'` |
| K-04 | Build stage runs when the web or nginx image is missing | CONFIRMED | `Jenkinsfile:230-234` |
| K-05 | Security scan runs `bandit -r . -q -ll` (fails on MEDIUM+) and `pip-audit -r requirements.txt --no-deps --disable-pip` (fails on any known vuln) | CONFIRMED | `Jenkinsfile:217,221,223`; intent comments `:219-222` |
| K-06 | Scan runs before build so a failed scan leaves no image in the registry | CONFIRMED | `Jenkinsfile:184-187` (comment states the design reason) |
| K-07 | Kaniko builds two images (web, nginx) in separate containers, with `--cache=true` | CONFIRMED | `Jenkinsfile:255-267` (`kaniko-web`, `kaniko-nginx`); `:281-310` |
| K-08 | Kaniko pushes to a registry over insecure HTTP (`--insecure`, `--insecure-pull`) | CONFIRMED | `Jenkinsfile:293-294,308-309`. Site wording: "private registry". Do not publish the address. |
| K-09 | Migration is a step inside Deploy, not its own stage: old Job deleted, new Job applied via `envsubst`, `kubectl wait` 180 s, logs on failure | CONFIRMED | `Jenkinsfile:363,365,367,369` |
| K-10 | Rollout check: web 600 s, nginx 120 s; on failure `kubectl rollout undo` then status 300 s | CONFIRMED | `Jenkinsfile:378-406` (`:400-401` undo, `:405-406` limits) |
| K-11 | Failure notification via webhook held in Jenkins credential `notify-webhook` (URL not in git) | CONFIRMED | `Jenkinsfile:414-441` (`:441` `withCredentials`) |
| K-12 | Web is a Deployment with 2 replicas; nginx 1 replica; PostgreSQL is a StatefulSet (1 replica); Redis is a Deployment (1 replica) | CONFIRMED | `k8s/web.yaml:26`; `k8s/nginx.yaml:29`; `k8s/postgres.yaml:32,38`; `k8s/redis.yaml:29,34` |
| K-13 | Web has a PodDisruptionBudget (`maxUnavailable: 1`) and startup, readiness and liveness probes | CONFIRMED | `k8s/web.yaml:205-208`; `:168,175,182` |
| K-14 | Nightly PostgreSQL backup CronJob at 02:00 | CONFIRMED | `k8s/postgres-backup-cronjob.yaml:12,17` (`schedule: "0 2 * * *"`) |
| K-15 | Backup volume is pinned to worker1, apart from Vault's data on worker2, so one disk failure cannot lose both | CONFIRMED | `k8s/backup-storage.yaml:2-6,28` (design comment + node pin) |
| K-16 | Backup restore has been tested | UNVERIFIED | No restore job, script or doc in the repo. Do not claim it. |
| K-17 | Namespace-scoped Jenkins RBAC: ServiceAccount `jenkins-deployer` in `jenkins-agents`, Role + RoleBinding in `k8s-campuscart` | CONFIRMED | `k8s/jenkins-deployer-rbac.yaml:9-12,15-18,57-71` |
| K-18 | A separate `jenkins-agent-role` exists for the agents namespace | CONFIRMED | `k8s/jenkins-agent-rbac.yaml:2-5,33-43` (not in PLAYBOOK; new) |
| K-19 | cert-manager `Certificate`s `nginx-backend-tls` and `cloudflare-edge-tls` reference ClusterIssuer `campuscart-ca-issuer` | CONFIRMED | `k8s/internal-tls-certs.yaml:4-21,26-41` |
| K-20 | The `campuscart-ca-issuer` ClusterIssuer itself is defined in the repo | CONTRADICTED | `git grep "^kind: (Cluster)?Issuer"` returns nothing. It is referenced, not defined. Say "private CA issuer", not "defined in repo". |
| K-21 | ingress-nginx talks HTTPS to the backend using a client/proxy secret | CONFIRMED | `k8s/ingress.yaml:9` (`proxy-ssl-secret` annotation, secret name only) |
| K-22 | Cloudflare Tunnel: `cloudflared` Deployment, 2 replicas, routes to the ingress-nginx controller over HTTPS; credentials come from a Secret not tracked in git | CONFIRMED | `k8s/cloudflare-tunnel/cloudflared-deployment.yaml:7,47`; `cloudflared-config.yaml:9,13` |
| K-23 | `campuscart.bharathops.online` is up on launch day | UNVERIFIED | Needs a runtime `curl`. The audit container's network allowlist blocks it. Re-check in D5. |
| K-24 | The cluster has 3 nodes | UNVERIFIED | The repo names `k8s-worker1` and `worker2` (`k8s/backup-storage.yaml:4,28`) but never states a node count or a control-plane node. Needs Bharath's `kubectl get nodes` output before "3 nodes" ships in the numbers strip. |
| K-25 | Backend image is multi-stage and runs as non-root `appuser` | CONFIRMED | `campuscart-backend/Dockerfile:4,47,78,110` (two `FROM`, `addgroup/adduser`, `USER appuser`) |
| K-26 | The nginx image is single-stage `FROM nginx:alpine` | CONFIRMED | `nginx/Dockerfile:1`. No multi-stage, no `USER`. |
| K-27 | nginx runs non-root in the cluster (via securityContext, not via the image) | CONFIRMED | `k8s/nginx.yaml:42-43` (`runAsNonRoot`, `runAsUser: 101`). Site wording: "runs non-root in the cluster". Never "non-root image". |
| K-28 | Web, Redis, Postgres, backup run with `runAsNonRoot: true` | CONFIRMED | `k8s/web.yaml:121`; `k8s/redis.yaml:48`; `k8s/postgres.yaml:53,115`; `k8s/postgres-backup-cronjob.yaml:62` |
| K-29 | A third pipeline `Jenkinsfile.security` exists: Dependency audit + Image scan with Trivy (HIGH/CRITICAL, fails the build) | CONFIRMED | `Jenkinsfile.security:15,46,72-73` (not in PLAYBOOK; new). Its trigger/schedule was not audited. |

## 2. Vault

| ID | Claim | Status | Evidence |
|---|---|---|---|
| V-01 | Pods use the Vault Agent Injector; web, migrate Job and backup CronJob each have their own Vault role | CONFIRMED | `k8s/web.yaml:43`; `k8s/migrate-job.yaml:26-27`; `k8s/postgres-backup-cronjob.yaml:30-31` |
| V-02 | The web pod gets **dynamic** database credentials from `database/creds/campuscart-app`, re-read on each new DB connection | CONFIRMED | `k8s/web.yaml:92-94`; `campuscart-backend/campuscart/db_backend/base.py:20-24,27-39,59-62` |
| V-03 | Django static secrets come from a Vault KV path | CONFIRMED | `k8s/web.yaml:63`; `campuscart-backend/entrypoint.sh:8-15` |
| V-04 | Migrate Job and backup use static KV credentials, not dynamic ones | CONFIRMED | `k8s/migrate-job.yaml:45`; `k8s/postgres-backup-cronjob.yaml:39` |
| V-05 | Vault runs in the cluster (Service `vault.vault.svc.cluster.local:8200`, data on worker2 via `local-storage`) | CONFIRMED (client side) | `k8s/migrate-job.yaml:28`; `k8s/backup-storage.yaml:2-4` |
| V-06 | The repo deploys Vault (server manifests, Helm values, init/unseal) | CONTRADICTED | No tracked file names Vault; no manifest runs a Vault image. Say "secrets fetched from Vault at runtime". Say nothing about how Vault was deployed. |
| V-07 | Vault is TLS-protected with a private CA | CONFIRMED | `k8s/migrate-job.yaml:29-30` (`agent-extra-secret`, `ca-cert`) |

## 3. Monitoring

| ID | Claim | Status | Evidence |
|---|---|---|---|
| M-01 | ServiceMonitors exist for web, postgres, redis | CONFIRMED | `k8s/web-servicemonitor.yaml:2,14-15`; `k8s/postgres-servicemonitor.yaml:2,14-15`; `k8s/redis-servicemonitor.yaml:2,14-15` |
| M-02 | Prometheus is configured via `monitoring/values.yaml` (retention 10d / 4GB, 5Gi PVC) | CONFIRMED | `monitoring/values.yaml:1-20` |
| M-03 | Grafana is configured in the repo (`monitoring/values.yaml` "Prometheus/Grafana values") | CONTRADICTED | The file is 20 lines with one top-level key, `prometheus:`. The word "grafana" appears nowhere in the repo. No dashboards, no alert rules, no `PrometheusRule`. Do not show Grafana as a repo-backed component. Bharath's own screenshots (PLAYBOOK item 6) are the only possible evidence. |
| M-04 | The Django app exposes Prometheus metrics, including custom counters/gauges | CONFIRMED | `campuscart/settings.py:33,48,58`; `campuscart/urls.py:44`; `chat/metrics.py:1`, `orders/metrics.py:1`, `payments/metrics.py:1`, `users/metrics.py:1` |
| M-05 | Alerting is configured | CONTRADICTED | No Alertmanager config, no `PrometheusRule` anywhere in `k8s/`, `k8s-aws/`, `monitoring/`. List under "what I would improve next". |

## 4. AWS environment (`terraform/`, `k8s-aws/`, `Jenkinsfile.aws`)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| A-01 | AWS pipeline has 9 stages in this order: Checkout, Terraform Plan, Show Terraform Plan, Approve Infrastructure Changes, Terraform Apply, Prepare AWS Context, Build and Push Images, Render Manifests, Deploy to EKS | CONFIRMED | `Jenkinsfile.aws:11,43,79,102,114,146,180,246,310` |
| A-02 | Manual approval gate: `input()` with a 30-minute timeout, before Apply | CONFIRMED | `Jenkinsfile.aws:102-113` |
| A-03 | AWS pipeline has no Test stage and no Security Scan stage | CONFIRMED | Stage list `Jenkinsfile.aws` above; `grep bandit/pip-audit/manage.py test` in that file returns nothing |
| A-04 | AWS pipeline has no `rollout undo`; it only runs `rollout status` | CONFIRMED | `Jenkinsfile.aws:354,358` (no `undo` anywhere) |
| A-05 | AWS pipeline builds with Kaniko and pushes to ECR | CONFIRMED | `Jenkinsfile.aws:200,224-226,236-238` |
| A-06 | **7** Terraform modules: `ecr, eks, elasticache, iam, iam-irsa, networking, rds` | CONFIRMED | `ls terraform/modules` (7 directories) |
| A-07 | `environments/production` wires 6 of the 7 modules (not `iam-irsa`) | CONFIRMED | `terraform/environments/production/main.tf:10,22,29,54,60,69` |
| A-08 | `iam-irsa` is used by a separate `production-addons` environment, twice (External Secrets Operator, ALB controller) | CONFIRMED | `terraform/environments/production-addons/main.tf:14,62` |
| A-09 | Three Terraform roots exist: `bootstrap`, `environments/production`, `environments/production-addons` | CONFIRMED | `ls terraform terraform/environments` (`production-addons` and `bootstrap` are not in the PLAYBOOK; new) |
| A-10 | Remote state in S3 with native locking (`use_lockfile = true`), encryption on, no DynamoDB table | CONFIRMED | `environments/production/backend.tf:30,34`; `environments/production-addons/backend.tf:6-7`; `bootstrap/main.tf` (no `dynamodb` resource) |
| A-11 | State bucket has versioning, SSE (AES256) and a public-access block | CONFIRMED | `terraform/bootstrap/main.tf:15,36,54,74` |
| A-12 | Region `ap-south-1`, 2 AZs (`a`, `b`), public + private subnets per AZ | CONFIRMED | `environments/production/backend.tf:25`; `modules/networking/variables.tf` (`availability_zones` default); `modules/networking/main.tf:50,86` |
| A-13 | One NAT gateway (not one per AZ) | CONFIRMED | `modules/networking/variables.tf` (`single_nat_gateway` default `true`, comment "cost-optimized for our test-and-destroy workflow") |
| A-14 | EKS 1.31, managed node group, **Spot** by default, t3.medium, desired 2 / min 1 / max 3 | CONFIRMED | `environments/production/variables.tf:59-68` and `node_*_size` vars; `modules/eks/main.tf:77-94` |
| A-15 | RDS PostgreSQL 16.15, `db.t3.micro`, encrypted at rest, not publicly accessible | CONFIRMED | `modules/rds/variables.tf` defaults; `modules/rds/main.tf:92-106` |
| A-16 | RDS is Multi-AZ | CONTRADICTED | `modules/rds/main.tf:111` `multi_az = false`. Also `backup_retention_period = 1` (`:120`), `deletion_protection = false` (`:134`), `skip_final_snapshot = true` (`:126`). Never imply high availability for the database. |
| A-17 | ElastiCache Redis 7.1, single `cache.t3.micro` node | CONFIRMED | `modules/elasticache/variables.tf`; `modules/elasticache/main.tf:46-49` |
| A-18 | Redis has encryption in transit/at rest and AUTH | CONTRADICTED | `modules/elasticache/main.tf:63-65` states these need a replication group and are not enabled. Do not claim Redis encryption. |
| A-19 | DB password is generated by `random_password`, stored in AWS Secrets Manager, synced to a k8s Secret by External Secrets (refresh 1 h) | CONFIRMED | `modules/rds/main.tf:14,34,39-41,102`; `k8s-aws/externalsecret.yaml:16,26-28`; `k8s-aws/secretstore.yaml:12-28` |
| A-20 | External Secrets Operator, AWS Load Balancer Controller and metrics-server are installed by Terraform `helm_release` | CONFIRMED | `environments/production-addons/main.tf:25,73,112` |
| A-21 | IRSA is configured: `iam-irsa` module creates the role; the `role-arn` annotation is set on the ESO and ALB-controller ServiceAccounts through Helm | CONFIRMED (code) | `environments/production-addons/main.tf:14-22,39,97` |
| A-22 | IRSA worked end to end when the stack was deployed | UNVERIFIED | Blocking question for Bharath. Default wording: "IRSA module and ServiceAccount configured". |
| A-23 | The **app** ServiceAccount uses IRSA | CONTRADICTED | `k8s-aws/serviceaccount.yaml:9-13`: no `role-arn` annotation, `automountServiceAccountToken: false`. IRSA is for the controllers, not the app pods. |
| A-24 | Jenkins gets EKS access via an access entry with `AmazonEKSAdminPolicy`, scoped to the `campuscart` namespace | CONFIRMED | `environments/production/main.tf:86-107`. Say "namespace-scoped". Do not say "least privilege": it is an admin policy inside that namespace. |
| A-25 | ALB Ingress uses the ALB controller (`scheme internet-facing`, `target-type ip`) with path rules `/api` and `/ws` to backend :8000, `/` to nginx :80 | CONFIRMED | `k8s-aws/ingress.yaml:14,19,26,50-56,58-64,66-72` |
| A-26 | The ALB listener is HTTP 80 only | CONFIRMED | `k8s-aws/ingress.yaml:30` (`listen-ports: '[{"HTTP": 80}]'`) |
| A-27 | **TLS termination** on the ALB | CONTRADICTED | `certificate-arn` (`:35`) and `ssl-redirect` (`:39`) are commented out. The comments at `:28-29,37-38` say "443" and "never serve real traffic unencrypted", but the code does not do that. The comments are misleading. Never publish a TLS claim for AWS. The resume line must be fixed. |
| A-28 | The Ingress has a hostname rule | CONTRADICTED | `k8s-aws/ingress.yaml:43` is commented out. No host-based routing. |
| A-29 | A real HTTPS listener with an ACM certificate exists | UNVERIFIED | Blocking question. Default: no. |
| A-30 | HPA on backend: min 2, max 6, CPU 70 %, memory 80 % | CONFIRMED | `k8s-aws/hpa.yaml:15,16,21-24,28-31` |
| A-31 | AWS nginx container port matches the image | CONTRADICTED | `k8s-aws/nginx-deployment.yaml:35,49,56` use port **80** and run as UID 101. `nginx/nginx.conf:13-14` listens on **8080/8443**. `Jenkinsfile.aws:237` builds that same `nginx/Dockerfile`. A non-root process cannot bind 80. The probes would fail unless the AWS deploy used something different. See open question Q-7. |
| A-32 | AWS environment is running now | UNVERIFIED | Blocking question. Default: "completed deployment, torn down to avoid cost". The repo supports "test-and-destroy" intent (`modules/networking/variables.tf` comment). Never write "live" for AWS. |
| A-33 | The AWS stack served real traffic end to end | UNVERIFIED | Not provable from files. See A-31. |

## 5. Secrets and sensitive data audit (values never copied)

| ID | Finding | Status | Evidence |
|---|---|---|---|
| S-01 | No credentials tracked: no AWS access key IDs, private-key blocks, GitHub tokens, Slack/Discord webhooks | CONFIRMED | Pattern scan over all tracked files (`AKIA…`, `-----BEGIN … PRIVATE KEY-----`, `gh[pousr]_…`, webhook hosts): 0 hits |
| S-02 | Only example files are tracked: `.env.example`, `campuscart-backend/.env.example`, `terraform/bootstrap/terraform.tfvars.example`; `.env`, `*.tfvars`, `*.tfstate` are gitignored | CONFIRMED | `git ls-files`; `.gitignore:20-21,61-63,68-69` |
| S-03 | Example env files contain placeholders, not real Stripe keys | CONFIRMED | Pattern scan for `sk_live_`, `sk_test_…`, `whsec_…`, `pk_live_`: 0 hits in both files |
| S-04 | **FLAG:** the 12-digit AWS account ID is committed (state bucket name in 3 files; an IAM user ARN in 1) | CONFIRMED (risk) | `terraform/environments/production/backend.tf:17`; `production-addons/backend.tf:3`; `production-addons/provider.tf:38`; `production/main.tf:88`. **Never publish.** Not a credential, but the PLAYBOOK bars account IDs and ARNs. |
| S-05 | **FLAG:** a LAN registry address is committed in 3 pipeline/manifest files | CONFIRMED (risk) | `Jenkinsfile:56,291,306`; `Jenkinsfile.security:72-73`; `k8s/web.yaml:141`; `k8s/nginx.yaml:50`; `k8s/migrate-job.yaml:57`. Never publish. Say "private registry". |
| S-06 | **FLAG:** the Cloudflare Tunnel UUID is committed | CONFIRMED (risk) | `k8s/cloudflare-tunnel/cloudflared-config.yaml:8`. An identifier, not a credential (`credentials.json` is mounted from a Secret). Do not publish. |
| S-07 | Grep hits for `secret/password` in k8s manifests are annotation keys naming a Secret, not values | CONFIRMED | `k8s/ingress.yaml:9`; `k8s/migrate-job.yaml:29`; `k8s/postgres-backup-cronjob.yaml:33`; `k8s/web.yaml:52` |
| S-08 | Test files contain literal fixture passwords | CONFIRMED (low) | `campuscart-backend/*/tests.py` (e.g. `cart/tests.py:32`). The repo's own scan comment calls these Low findings (`Jenkinsfile:219-220`). Not shipped on the site. |

## 6. README and repo hygiene (feeds task D4)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| R-01 | The README is stale and has no DevOps content | CONFIRMED | `README.md` is 75 lines. Mentions of kubernetes, jenkins, terraform, docker, prometheus, vault: **0** each. |
| R-02 | The README says the database is SQLite | CONTRADICTED | `README.md` (1 mention). The code uses a custom PostgreSQL backend: `campuscart-backend/campuscart/settings.py:91` (`campuscart.db_backend`). |
| R-03 | "Stripe" in the README is stale (PLAYBOOK section 2, item 7) | CONTRADICTED | Stripe is real: `requirements.txt` `stripe==13.1.0`; `payments/views.py`, `payments/webhooks.py`. **PLAYBOOK correction:** keep Stripe in the README; only SQLite and the missing DevOps content are stale. |
| R-04 | Runtime stack | CONFIRMED | `requirements.txt`: Django 5.2.17, DRF 3.17.2, channels 4.3.1, daphne 4.2.2, psycopg2-binary 2.9.11, redis 7.0.0, django-prometheus 2.3.1 |
| R-05 | Two environments in one repo, kept separate: kubeadm in `k8s/`, AWS in `k8s-aws/` | CONFIRMED | `git ls-files` |
| R-06 | The app also has a static frontend duplicated in two places | CONFIRMED | `frontend/` and `campuscart-backend/frontend_static/` both tracked. `nginx/Dockerfile` copies `frontend`. |

## 7. Resume and profile claims (only those quoted in the PLAYBOOK)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| P-01 | "Path-based routing" on the AWS ALB | CONFIRMED | See A-25 |
| P-02 | "TLS termination" on the AWS ALB | CONTRADICTED | See A-27. Fix the resume line. |
| P-03 | "6 Terraform modules" | CONTRADICTED | See A-06. It is 7. |
| P-04 | A "6-stage" kubeadm pipeline with a separate Migrate stage | CONTRADICTED | See K-01 and K-09. It is 5 stages; migrate is inside Deploy. |
| P-05 | BCA at Shree Guru Sudhindra BCA College, Bhatkal, 2023, CGPA 8.1 | UNVERIFIED | Not in the infra repo. PLAYBOOK says the resume wins. Needs the resume PDF. |
| P-06 | MCA, VTU, 2025, CGPA 9.05 | UNVERIFIED | Same. Needed for the badge. |
| P-07 | Full resume line-by-line audit | UNVERIFIED | Resume PDF not provided (G-2). |

---

## 8. PLAYBOOK corrections found by this audit

1. **Grafana** is not configured in the repo (M-03). PLAYBOOK section 2 lists "Prometheus/Grafana values".
2. **Stripe** in the old README is real, not stale (R-03).
3. **Three** pipelines exist, not two: `Jenkinsfile.security` (K-29).
4. **Three** Terraform roots exist: `bootstrap` and `production-addons` are missing from the PLAYBOOK (A-09).
5. **IRSA** belongs to the controllers (ESO, ALB), not the app ServiceAccount (A-23).
6. **Vault** location is partly answerable: in-cluster Service address and data on worker2 (V-05), but no server manifests (V-06).
7. **Dynamic DB credentials** are confirmed for the web pod (V-02): stronger than the default wording "fetched at runtime".
8. The AWS **account ID** is committed (S-04). "Tracked secrets: none" is true for credentials, not for identifiers.
9. **3 nodes** has no repo evidence (K-24). The numbers strip should not ship it until proven.
10. The AWS **nginx port mismatch** (A-31) is a latent defect that affects the "completed deployment" story.

## 9. Open questions for Bharath

| # | Question | Blocks |
|---|---|---|
| Q-1 | Is the AWS environment running now, or destroyed? | AWS status line |
| Q-2 | Did IRSA work end to end when deployed? | IRSA wording (A-22) |
| Q-3 | Was there ever an HTTPS listener with an ACM certificate on the ALB? | TLS wording (A-29) |
| Q-4 | Paste `kubectl get nodes` (hide IPs). | "3 nodes" number (K-24) |
| Q-5 | Is `campuscart.bharathops.online` up on launch day? | "Live" label (K-23) |
| Q-6 | Send the resume PDF and confirm the BCA college. | Education rows (P-05..P-07) |
| Q-7 | Did the AWS site respond over HTTP? Was nginx's port changed outside the repo? | A-31, A-33 |
| Q-8 | Do you have Grafana screenshots or dashboard JSON? | Grafana tile (M-03) |
| Q-9 | Where is `docs/DECISIONS.md`? | G-1 |
| Q-10 | Which is authoritative: the pushed `feat/foundation` or your local copy? | G-3 |

## 10. Not audited (honest scope)

- Application source beyond the DB backend, entrypoint, metrics modules and settings lines cited above.
- `Jenkinsfile.security`: trigger, schedule and result history.
- `nginx/nginx.conf` beyond the `listen` lines.
- Whether any pipeline actually ran or passed. Files show intent, not run history.
- Runtime state of any cluster or AWS account. No live checks were possible from the audit container.
- Test counts and coverage. Do not publish any number for them.
