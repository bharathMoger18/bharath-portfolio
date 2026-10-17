# FACTS.md: verified claims for the Bharath portfolio

Task D1. Owner: Account D (Verifier). Status: **DRAFT v4, awaiting Bharath approval (gate G2).** v4 (D2): DECISIONS #19 applied to RS-04; P-rows restored in section 7b; new rows K-30..K-33, A-34, M-06, M-07, P-08, S-09. v2 adds: DECISIONS.md (now on the remote), the resume PDF, Bharath's answers of 2026-10-15, and his `kubectl get nodes` output.

- Audited repo: `https://github.com/bharathMoger18/k8s-campuscart`
- Audited commit: `774df4037e5e7984d7b95b4adebf143cfb216bcd` (`774df40`)
- Method: `git clone`, `git checkout 774df40`, then `git grep` / `sed -n` on tracked files only. Evidence below is `path:line` at that commit.
- Rule: nothing ships on the site unless its row is **CONFIRMED**. UNVERIFIED rows need an answer from Bharath or a runtime check. CONTRADICTED rows must not appear on the site.
- Redaction rule: no secret values, private IPs, AWS account IDs, ARNs, tunnel IDs or domain-specific hostnames are copied into this file. Line numbers marked `~` were read from a range and are approximate.

Status legend: **CONFIRMED** = the files prove it. **CONTRADICTED** = the files disprove it. **UNVERIFIED** = the files neither prove nor disprove it.

Source tags on CONFIRMED rows: `(repo)` = proven by the audited files (default when no tag). `(owner)` = stated by Bharath in chat on 2026-10-15, not provable from the repo. `(resume)` = printed on his resume only. `(owner output)` = command output he pasted. Owner-sourced rows may ship, but they are labelled so QA can ask for proof.

**Precedence:** `docs/DECISIONS.md` (2026-10-15) overrides the PLAYBOOK. Where a DECISIONS rule limits the *wording* of a CONFIRMED fact, the row says so under "Site wording".

---

## 0. Source gaps (v2: all three from v1 are resolved)

| # | Gap | Status |
|---|---|---|
| G-1 | `docs/DECISIONS.md` was missing on the remote. | RESOLVED. It is on `origin/feat/foundation` at `f4d5fb5` (13 lines). Read in full and applied. See section 8b. |
| G-2 | The resume PDF was not in the repo. | RESOLVED. `public/Bharath_Moger_DevOps_Resume.pdf` is committed. Its SHA-256 equals the uploaded copy. Full line-by-line audit in section 7. Note the filename uses underscores; the PLAYBOOK said hyphens. The Lead's `siteConfig.ts:12` already uses the real name. |
| G-3 | The pushed branch and Bharath's local checkout differed. | RESOLVED on the remote side: it now has `public/` and `src/`. This branch is rebased onto `f4d5fb5`. |

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
| K-23 | `campuscart.bharathops.online` responds on launch day | UNVERIFIED | Bharath says it is live now (owner, 2026-10-15). DECISIONS #6: label "Live" only after QA confirms the URL responds. The audit container cannot resolve the host (`curl: (6) Could not resolve host`), so QA in D5 must run this from an allowed network. Until then the site wording is "Running on my own kubeadm cluster", not "Live". |
| K-24 | The cluster has 3 nodes: 1 control-plane + 2 workers, Kubernetes v1.30.14 | CONFIRMED (owner output) | Bharath's pasted `kubectl get nodes`: `k8s-master Ready control-plane v1.30.14`, `k8s-worker1 Ready worker v1.30.14`, `k8s-worker2 Ready worker v1.30.14`. Consistent with the repo's worker1/worker2 references (`k8s/backup-storage.yaml:4,28`). The numbers strip may show "3 nodes" for kubeadm. Never mix it with the EKS node group (desired 2). kubeadm is v1.30; EKS in Terraform is 1.31 (A-14). Keep both versions separate on the site. |
| K-25 | Backend image is multi-stage and runs as non-root `appuser` | CONFIRMED | `campuscart-backend/Dockerfile:4,47,78,110` (two `FROM`, `addgroup/adduser`, `USER appuser`) |
| K-26 | The nginx image is single-stage `FROM nginx:alpine` | CONFIRMED | `nginx/Dockerfile:1`. No multi-stage, no `USER`. |
| K-27 | nginx runs non-root in the cluster (via securityContext, not via the image) | CONFIRMED | `k8s/nginx.yaml:42-43` (`runAsNonRoot`, `runAsUser: 101`). Site wording: "runs non-root in the cluster". Never "non-root image". |
| K-28 | Web, Redis, Postgres, backup run with `runAsNonRoot: true` | CONFIRMED | `k8s/web.yaml:121`; `k8s/redis.yaml:48`; `k8s/postgres.yaml:53,115`; `k8s/postgres-backup-cronjob.yaml:62` |
| K-29 | A third pipeline `Jenkinsfile.security` exists: Dependency audit + Image scan with Trivy (HIGH/CRITICAL, fails the build) | CONFIRMED | `Jenkinsfile.security:15,46,72-73` (not in PLAYBOOK; new). Its trigger/schedule was not audited. |
| K-30 | The Jenkins deployer Role allows: Deployments and Services get/list/patch/update; Pods get/list/watch; Jobs get/list/watch/create/delete; Pod logs get; PodDisruptionBudgets get/create/patch/update; ReplicaSets and Events get/list. There is **no rule for Secrets**. | CONFIRMED | `k8s/jenkins-deployer-rbac.yaml:15-54`. The file's own comment ("ONLY update Deployments ... nothing else") overstates this; site copy follows the rules, not the comment. Do not write "least privilege". |
| K-31 | Two Kaniko containers (one per image) so one build cannot starve the other of memory; the debug Kaniko image is used because the distroless one has no shell | CONFIRMED | `Jenkinsfile:244-266` (design comment and containers) |
| K-32 | Checkout tags each image with the short hash of the last commit that touched its inputs and asks the registry whether the tag exists | CONFIRMED | `Jenkinsfile:35-48` |
| K-33 | Security Scan runs before Build on purpose: a failed scan leaves no image in the registry, so a retry cannot skip both | CONFIRMED | `Jenkinsfile:183-190` (stage and comment) |

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
| M-03 | Grafana is configured in the repo (`monitoring/values.yaml` "Prometheus/Grafana values") | CONTRADICTED | The file is 20 lines with one top-level key, `prometheus:`. The word "grafana" appears nowhere in the repo. No dashboards, no alert rules, no `PrometheusRule`. Do not show Grafana as a repo-backed component. **Update 2026-10-15:** Bharath says he has Grafana screenshots and dashboard JSON, but none has been supplied. This row stays CONTRADICTED for the repo. A separate row can become CONFIRMED (owner evidence) once the files are committed (suggest `public/evidence/`). Wording must be "dashboards from my cluster", never "monitoring is running now", unless he confirms the current state. |
| M-04 | The Django app exposes Prometheus metrics, including custom counters/gauges | CONFIRMED | `campuscart/settings.py:33,48,58`; `campuscart/urls.py:44`; `chat/metrics.py:1`, `orders/metrics.py:1`, `payments/metrics.py:1`, `users/metrics.py:1` |
| M-05 | Alerting is configured | CONTRADICTED | No Alertmanager config, no `PrometheusRule` anywhere in `k8s/`, `k8s-aws/`, `monitoring/`. List under "what I would improve next". |
| M-06 | Grafana dashboard "Kubernetes / Compute Resources / Namespace (Pods)", namespace `k8s-campuscart`, with pods nginx, postgres-0, redis and two web pods | CONFIRMED (owner evidence) | Screenshot committed as `public/evidence/grafana-namespace-pods.png` (2904x996, created 2026-10-15 11:01 IST; its 05:05 to 05:30 UTC time axis matches). No IPs or secrets visible. DECISIONS #14 caption only. |
| M-07 | Grafana "Node Exporter / Nodes" dashboard (upload `grafana-node-exporter.png`) | UNVERIFIED (not published) | Not the "microservices dashboard" the D2 brief names. Its `Instance` field shows a private IP, which DECISIONS #18 forbids, and no DECISIONS #14 caption covers it. Withheld. Needs a redacted copy plus a Manager-approved caption, or the real microservices screenshot. |

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
| A-22 | IRSA worked end to end when the stack was deployed | CONFIRMED (owner) | Bharath answered "yes" on 2026-10-15. **Conflict:** DECISIONS #3 says "Do not claim it was verified end to end." DECISIONS overrides. **Site wording:** "IRSA module and ServiceAccount configured in Terraform and manifests." Manager must decide whether to relax #3 (Q-12). The code evidence is A-21. |
| A-23 | The **app** ServiceAccount uses IRSA | CONTRADICTED | `k8s-aws/serviceaccount.yaml:9-13` (no `role-arn`, `automountServiceAccountToken: false`); `k8s-aws/backend-deployment.yaml:35` runs the app as that SA. The app has no AWS SDK (`git grep boto3` in `campuscart-backend`: 0 hits) and gets its DB password via External Secrets (`backend-deployment.yaml:53`). IRSA serves the controllers only. The ESO policy is scoped to one secret ARN (`production-addons/main.tf:6-12`). |
| A-24 | Jenkins gets EKS access via an access entry with `AmazonEKSAdminPolicy`, scoped to the `campuscart` namespace | CONFIRMED | `environments/production/main.tf:86-107`. Say "namespace-scoped". Do not say "least privilege": it is an admin policy inside that namespace. |
| A-25 | ALB Ingress uses the ALB controller (`scheme internet-facing`, `target-type ip`) with path rules `/api` and `/ws` to backend :8000, `/` to nginx :80 | CONFIRMED | `k8s-aws/ingress.yaml:14,19,26,50-56,58-64,66-72` |
| A-26 | The ALB listener is HTTP 80 only | CONFIRMED | `k8s-aws/ingress.yaml:30` (`listen-ports: '[{"HTTP": 80}]'`) |
| A-27 | **TLS termination** on the ALB | CONTRADICTED | `certificate-arn` (`:35`) and `ssl-redirect` (`:39`) are commented out. The comments at `:28-29,37-38` say "443" and "never serve real traffic unencrypted", but the code does not do that. The comments are misleading. Never publish a TLS claim for AWS. The resume line must be fixed. |
| A-28 | The Ingress has a hostname rule | CONTRADICTED | `k8s-aws/ingress.yaml:43` is commented out. No host-based routing. |
| A-29 | A real HTTPS listener with an ACM certificate exists or ever existed | CONTRADICTED (owner) | Bharath: "not yet" (2026-10-15). Matches the repo (A-26, A-27). HTTPS/ACM goes under "What I would improve next" (DECISIONS #4). |
| A-30 | HPA on backend: min 2, max 6, CPU 70 %, memory 80 % | CONFIRMED | `k8s-aws/hpa.yaml:15,16,21-24,28-31` |
| A-31 | AWS nginx container port matches the image | CONTRADICTED | `k8s-aws/nginx-deployment.yaml:35,49,56` use port **80** and run as UID 101. `nginx/nginx.conf:13-14` listens on **8080/8443**. `Jenkinsfile.aws:237` builds that same `nginx/Dockerfile`. A non-root process cannot bind 80. Bharath has not checked this at runtime (A-33). It is a file-level inconsistency, stated as such. It may be listed under "What I would improve next": "align the AWS nginx containerPort and probes with the image's 8080". |
| A-32 | AWS environment is running now | CONTRADICTED (owner) | Bharath: it is destroyed (2026-10-15). DECISIONS #2. **Site wording:** "Completed deployment, infrastructure torn down." Never "live". No live demo link for AWS. The repo agrees with the intent (`modules/networking/variables.tf` "test-and-destroy workflow"). |
| A-33 | The AWS stack served real traffic end to end (an HTTP response came back from the ALB) | UNVERIFIED | Bharath (2026-10-15): "I did not checked it, let's say yes." That is an assumption, not an observation, so it is not recorded as CONFIRMED. The AWS stack is destroyed, so it cannot be tested now. **Site wording:** "Completed deployment, infrastructure torn down" (DECISIONS #2). Never say it served traffic, never show a URL or a response. Evidence that could settle it: a Jenkins stage view or build log showing `Deploy to EKS` green, including `rollout status` for nginx (`Jenkinsfile.aws:358`), which would only pass if the readiness probe passed (see A-31). |
| A-34 | The AWS deployment has a step that creates the database schema | UNVERIFIED | `campuscart-backend/entrypoint.sh:41-46`: migrations run only when `MIGRATE_ONLY=true`, which only the kubeadm migrate Job sets (`k8s/migrate-job.yaml`). `k8s-aws/` has no migrate Job and `Jenkinsfile.aws` has no migrate step. Not on the site. Open question for Bharath: how was the AWS schema created? |

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
| S-09 | Evidence permalinks at `774df40` display whole files, including the identifiers flagged in S-04 to S-06 | CONFIRMED (risk) | The audited repo is public. The site's data files never copy those values, but a visitor who opens `k8s/web.yaml`, `cloudflared-config.yaml` or the Terraform files will see them. Fixing it needs a new commit in `k8s-campuscart`; pinned permalinks would still show the old content. Manager decision. |

## 6. README and repo hygiene (feeds task D4)

| ID | Claim | Status | Evidence |
|---|---|---|---|
| R-01 | The README is stale and has no DevOps content | CONFIRMED | `README.md` is 75 lines. Mentions of kubernetes, jenkins, terraform, docker, prometheus, vault: **0** each. |
| R-02 | The README says the database is SQLite | CONTRADICTED | `README.md` (1 mention). The code uses a custom PostgreSQL backend: `campuscart-backend/campuscart/settings.py:91` (`campuscart.db_backend`). |
| R-03 | "Stripe" in the README is stale (PLAYBOOK section 2, item 7) | CONTRADICTED | Stripe is real: `requirements.txt` `stripe==13.1.0`; `payments/views.py`, `payments/webhooks.py`. **PLAYBOOK correction:** keep Stripe in the README; only SQLite and the missing DevOps content are stale. |
| R-04 | Runtime stack | CONFIRMED | `requirements.txt`: Django 5.2.17, DRF 3.17.2, channels 4.3.1, daphne 4.2.2, psycopg2-binary 2.9.11, redis 7.0.0, django-prometheus 2.3.1 |
| R-05 | Two environments in one repo, kept separate: kubeadm in `k8s/`, AWS in `k8s-aws/` | CONFIRMED | `git ls-files` |
| R-06 | The app also has a static frontend duplicated in two places | CONFIRMED | `frontend/` and `campuscart-backend/frontend_static/` both tracked. `nginx/Dockerfile` copies `frontend`. |

## 7. Resume audit, line by line (source: `public/Bharath_Moger_DevOps_Resume.pdf`)

| ID | Resume claim | Status | Evidence / note |
|---|---|---|---|
| RS-01 | Name, email, GitHub, LinkedIn, site link | CONFIRMED (resume) | Resume header. Do not copy the phone number into any `src/data` file or page. The PLAYBOOK contact section is email, GitHub, LinkedIn, resume only. The PDF is public in `public/` with the phone number inside; that is Bharath's choice, so I flag it. |
| RS-02 | MCA 2025, CGPA 9.05 | CONFIRMED (resume) | See P-06 |
| RS-03 | Summary: hands-on with Docker, Kubernetes, Jenkins, Prometheus/Grafana, Terraform on AWS | CONFIRMED for Docker, Kubernetes, Jenkins, Prometheus, Terraform. **UNVERIFIED for Grafana** | M-01..M-04; Grafana per M-03. Pending the screenshots Bharath says he has. |
| RS-04 | "Designed, deployed, and monitored a fullstack web application" | CONFIRMED for deployment, containerisation and infra. **Authorship: DO NOT CLAIM** | DECISIONS #19 (2026-10-15): the Django app was built with AI tools. Never write "I wrote the app". Required wording: "I built CampusCart with AI coding tools. My own work is the platform around it: Kubernetes, CI/CD, secrets, TLS, monitoring and AWS infrastructure in Terraform." This **supersedes** the v3 owner answer ("yes"), which answered an either/or question. The site does not repeat the resume's "Designed ... a fullstack web application". |
| RS-05 | Skills: Docker, Docker Compose, kubeadm, kubectl, AWS EKS | CONFIRMED | `docker-compose.yml:4-70`; `modules/eks/main.tf:5,77`; kubeadm roles and version per K-24 (owner output). No kubeadm config file is in the repo. |
| RS-06 | Skills: Jenkins, Kaniko, Terraform, Git, GitHub | CONFIRMED | `Jenkinsfile*`, `terraform/`. There is no `.github/` and no GitHub Actions in this repo: do not mark a GitHub Actions tile as "used in" these projects. |
| RS-07 | Skills: AWS EC2 | UNVERIFIED for these projects; CONFIRMED (owner) as earlier practice | No `aws_instance` anywhere in Terraform. EC2 appears only as the EKS managed node group (`modules/eks/main.tf:77-94`). Bharath (2026-10-15): he used EC2 in earlier basic AWS learning projects, before moving to EKS with managed node groups. **Site wording:** an EC2 tile marked "learning / earlier projects", with no link to either case study and no "used in AWS" flag. ECR, RDS, ElastiCache, S3, VPC, IAM, EKS are CONFIRMED (A-06..A-20). |
| RS-08 | Skills: Prometheus, Grafana, Vault, cert-manager | CONFIRMED except Grafana | Prometheus M-01/M-02, Vault V-01..V-07, cert-manager K-19. Grafana per M-03. |
| RS-09 | Skills: Linux (Ubuntu), Bash, Python, Nginx; TCP/IP, DNS, HTTP/HTTPS | Bash, Python, Nginx CONFIRMED; Ubuntu, TCP/IP, DNS UNVERIFIED | `campuscart-backend/entrypoint.sh`; Django app; `nginx/nginx.conf`. Ubuntu, TCP/IP and DNS have no artifact in this repo. Show them as "learning/basics" tiles with no evidence link, never with a depth claim. |
| RS-10 | "Built a 3-node Kubernetes cluster from scratch with kubeadm on virtual machines" | CONFIRMED (owner output) | K-24. "From scratch" and "virtual machines" are owner statements. |
| RS-11 | Deployed Django with Nginx, PostgreSQL, Redis | CONFIRMED | K-12 |
| RS-12 | "The app is live on the internet" | UNVERIFIED | K-23. QA must confirm before the word "Live" ships (DECISIONS #6). |
| RS-13a | Multi-stage Docker build with a non-root user (backend image) | CONFIRMED | K-25 |
| RS-13b | "multi-stage Docker **builds**" (plural, implying all images) | CONTRADICTED | The nginx image is single-stage (K-26). Say "backend image". |
| RS-13c | "keeping production images small and clean" | UNVERIFIED | No image size recorded anywhere. Do not publish a size or a "small" claim. |
| RS-14 | Jenkins pipeline that tests, scans (bandit, pip-audit), builds with Kaniko, migrates and deploys, with automatic rollback | CONFIRMED | K-01..K-11 |
| RS-15 | Namespace-scoped RBAC for Jenkins; passwords in Vault, not in images or Git | CONFIRMED | K-17; V-01..V-04; S-01 |
| RS-16 | "HTTPS with cert-manager" | CONFIRMED (internal TLS only) | K-19, K-21, V-07. The `campuscart-ca-issuer` ClusterIssuer is not in the repo (K-20). Wording: "internal TLS with cert-manager and a private CA". |
| RS-17 | Public link through a Cloudflare Tunnel | CONFIRMED | K-22 |
| RS-18 | Prometheus and Grafana monitoring | Prometheus CONFIRMED, **Grafana UNVERIFIED** | M-01..M-04. Bharath says he has dashboard screenshots/JSON (2026-10-15). Not supplied yet. Becomes CONFIRMED (owner evidence) when committed. |
| RS-19 | Nightly PostgreSQL backup job | CONFIRMED | K-14. Restore is untested in the repo (K-16): never write "disaster recovery". |
| RS-20 | Project 2 title, tech list, and link to `github.com/bharathMoger18/k8s-campuscart` | CONFIRMED | Repo cloned at `774df40`. Both projects live in that one repo (R-05). |
| RS-21 | Modular Terraform for VPC, EKS, RDS, ElastiCache, IAM | CONFIRMED | A-06..A-17 (7 modules, plus ECR) |
| RS-22 | Manual approval gate between Terraform plan and apply | CONFIRMED | A-01, A-02 |
| RS-23 | Replaced in-cluster stateful workloads with RDS and ElastiCache | CONFIRMED | kubeadm has `k8s/postgres.yaml:32` and `k8s/redis.yaml:29`; `k8s-aws/` has no postgres or redis manifest; DB host comes from `${RDS_ENDPOINT}` (`k8s-aws/configmap.yaml:21`) |
| RS-24 | "configured IRSA so **application pods** authenticate to AWS without static credentials" | **CONTRADICTED** | A-23. IRSA is configured for External Secrets and the ALB controller (A-21). Accurate replacement: "IRSA module and ServiceAccounts configured in Terraform and manifests for External Secrets and the ALB controller" (also satisfies DECISIONS #3). Fix the resume. |
| RS-25 | ALB with path-based routing **and TLS termination** | Routing CONFIRMED; **TLS CONTRADICTED** | A-25 vs A-26, A-27, A-29. Fix the resume. |
| RS-26 | HPA "for automatic scaling under load" | HPA CONFIRMED; "under load" UNVERIFIED | A-30; metrics-server installed (A-20). No load test or scaling event is recorded. Wording: "HPA configured, 2 to 6 replicas". |
| RS-27 | Kaniko builds pushed to ECR; manifests templated from live Terraform outputs | CONFIRMED | A-05; `Jenkinsfile.aws:274-301` (`terraform output`, `envsubst`) |
| RS-28 | MCA (VTU, Mysuru, 2025, 9.05) and BCA (Shree Guru Sudhindra BCA College, Bhatkal, 2023, 8.1) | CONFIRMED (resume) | P-05, P-06; DECISIONS #7 |
| RS-29 | Resume says the AWS project has a Jenkins pipeline and the AWS stack ran | CONFIRMED (code) / CONFIRMED (owner) | A-01; A-32 (owner: deployed, now destroyed). |

## 7b. Profile rows (restored in v4; referenced by RS-02, RS-28 and the data files)

| ID | Claim | Status | Evidence / note |
|---|---|---|---|
| P-02 | "TLS termination" on the AWS ALB | CONTRADICTED | A-27, A-29. The resume line RS-25 must be fixed. |
| P-05 | BCA, Shree Guru Sudhindra BCA College, Bhatkal, 2023, CGPA 8.1 | CONFIRMED (resume) | Resume Education section; DECISIONS #7. Not independently verifiable. |
| P-06 | MCA, Visvesvaraya Technological University (Mysuru), 2025, CGPA 9.05 | CONFIRMED (resume) | Resume summary and Education section. |
| P-07 | Full resume line-by-line audit | CONFIRMED (done) | Section 7 (RS-01 to RS-29). |
| P-08 | Bharath is a fresher based in Bengaluru | CONFIRMED (owner) | Stated in the D2 content brief. It is **not** on the resume. |

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
11. The resume line on **IRSA for application pods** is contradicted (RS-24), and so is **TLS termination** (RS-25). **"multi-stage builds"** (RS-13b) is plural overreach. **EC2** (RS-07) and **Grafana** (RS-03, RS-18) lack repo evidence. Four resume edits are needed (see 8b).
12. **DECISIONS #3 conflicts with Bharath's latest answer** on IRSA (A-22). DECISIONS wins for site wording until the Manager says otherwise.

## 8b. DECISIONS.md applied (2026-10-15)

| # | Decision | How FACTS.md honours it |
|---|---|---|
| 1 | Domain `portfolio.bharathops.online`, Cloudflare Pages | Not a repo fact. Domain goes in `src/data/site.ts` only after the Lead confirms DNS. Not checkable here. |
| 2 | AWS torn down; label "Completed deployment, infrastructure torn down"; no live demo | A-32 |
| 3 | IRSA: "module and ServiceAccount configured in Terraform and manifests"; no end-to-end claim | A-21, A-22, A-23, RS-24 |
| 4 | ALB HTTP only; HTTPS/ACM under "What I would improve next" | A-26, A-27, A-29 |
| 5 | Hero uses typographic fallback; photo slot reads `public/portrait.webp` | Lead/Designer scope. No data row needed. |
| 6 | kubeadm "Live" only after QA confirms the URL | K-23 stays UNVERIFIED until D5 |
| 7 | BCA college per resume | P-05, RS-28 |
| 8 | 7 modules, 5-stage kubeadm pipeline, 9-stage AWS pipeline with no test, scan or rollback stage | A-06, K-01, A-01, A-03, A-04 |
| 9 | Summaries go to the Manager through Bharath | Final report |

**Resume edits Bharath should make** (all four are contradicted by the repo or by his own answers):
1. IRSA line: drop "application pods authenticate to AWS" (RS-24).
2. ALB line: remove "and TLS termination" (RS-25).
3. Docker line: "multi-stage Docker builds" becomes "multi-stage backend image" (RS-13b).
4. Grafana (RS-03, RS-18): keep once the screenshots are committed. EC2 (RS-07): fine as a skill, but it is earlier practice, not part of these two projects.

## 9. Open questions

Answered on 2026-10-15 (recorded above): Q-1 AWS running (destroyed, A-32), Q-2 IRSA (yes, A-22, limited by DECISIONS #3), Q-3 HTTPS listener (never, A-29), Q-4 node count (3, K-24), Q-6 resume and BCA (done, RS-28), Q-9 DECISIONS.md (found), Q-10 branch authority (resolved).

Answered since v2: Q-11 authorship (yes, wrote the app: RS-04), Q-13 EC2 (earlier practice projects only: RS-07).

| # | Still open | Blocks |
|---|---|---|
| Q-5 | QA must reach `campuscart.bharathops.online` from an allowed network and record the HTTP status. | "Live" label (K-23, RS-12) |
| Q-7 | Do you have the Jenkins stage view or log of the AWS pipeline run? Was `Deploy to EKS` green? | A-31, A-33 |
| Q-8 | PARTLY ANSWERED: the namespace dashboard screenshot is in `public/evidence/` (M-06). Still needed: the real CampusCart microservices dashboard screenshot, or a redacted node-exporter image plus a Manager-approved caption (M-07). | Second monitoring evidence |
| Q-12 | Manager: relax DECISIONS #3 now that Bharath says IRSA worked end to end? | IRSA wording (A-22) |
| Q-14 | Did you run a restore test of the nightly backup? If yes, paste the output (hide names and IPs). | Backup wording (K-16, RS-19) |

## 10. Not audited (honest scope)

- Application source beyond the DB backend, entrypoint, metrics modules and settings lines cited above.
- `Jenkinsfile.security`: trigger, schedule and result history.
- `nginx/nginx.conf` beyond the `listen` lines.
- Whether any pipeline actually ran or passed. Files show intent, not run history.
- Runtime state of any cluster or AWS account. No live checks were possible from the audit container.
- Test counts and coverage. Do not publish any number for them.
