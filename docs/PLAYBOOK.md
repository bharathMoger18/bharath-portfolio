# Bharath Moger Portfolio: Team Playbook

This file is the single source of truth for building the portfolio with several Claude accounts.
Commit it to the new portfolio repo as `docs/PLAYBOOK.md`. Every account reads sections 0 to 7 plus its own brief in section 8.

Status: PLAN ONLY. Nothing in here has been built yet.

---

## 0. How the team works

- Claude accounts cannot talk to each other. The only shared space is the GitHub repo `bharathMoger18/bharath-portfolio` and this file.
- Bharath is the relay. He pastes a brief into each account, then pastes each account's final summary back to the Manager.
- The Manager (the original chat) owns this playbook, decides conflicts, and reviews summaries. The Manager does not write app code.
- Each worker owns specific folders (section 6). Never edit another worker's folder. If you need a change there, write it in your final summary as a request.
- Work only on your own branch. Open a pull request. Never push to `main`.
- Never invent facts. Every technical claim on the site must trace to a line in `docs/FACTS.md`. If it is not there, it does not ship.

## 1. Verdict on the first version (static single page)

The first page was a static artifact. It is replaced, not patched. Five biggest weaknesses, in priority order:

1. **Wrong visual direction.** Dark navy "DevOps dashboard" look with badge chips. The reference is a light, warm, editorial portfolio with big type, a personal hero, an ID badge, and an interactive skills table. It does not look like the reference at all.
2. **No resume and no personality.** There is no resume download, no nav link to GitHub or resume, no photo, no About story. A recruiter cannot find the resume in 5 seconds.
3. **Diagrams contain errors.** They are flat PNGs with mistakes found in the repo audit (section 2): "6 Terraform modules" (repo has 7), a separate "Migrate" pipeline stage that is actually inside Deploy, and a 6-stage pipeline that is really 5.
4. **Content errors.** BCA college was written as Karnatak University. The resume says Shree Guru Sudhindra BCA College, Bhatkal, CGPA 8.1.
5. **Looks like a template.** Same card, same radius, same pill repeated. No interactive element that shows engineering skill. It is a page, not an application.

## 2. Verified facts from the repo audit (seed for docs/FACTS.md)

Audited repo: `https://github.com/bharathMoger18/k8s-campuscart`, commit `774df40`. Tracked secrets: none (only `.env.example` and `terraform.tfvars.example`).

### Confirmed in code
| Claim | Evidence |
|---|---|
| kubeadm pipeline has 5 stages: Checkout, Test, Security Scan, Build and Push Images, Deploy | `Jenkinsfile` stage names |
| Test and Security Scan run only when the web image tag is not already in the registry | `Jenkinsfile` `when { expression { env.WEB_EXISTS != 'true' } }` |
| Security scan: `bandit -r . -ll` and `pip-audit -r requirements.txt` | `Jenkinsfile` ~line 217 to 223 |
| Kaniko builds two images (web, nginx) in separate containers | `Jenkinsfile` `kaniko-web`, `kaniko-nginx` |
| Migration runs inside the Deploy stage: old Job deleted, new Job applied with `envsubst`, `kubectl wait` 180 s | `Jenkinsfile` ~line 363 to 369 |
| Rollout check: web 600 s, nginx 120 s; on failure `kubectl rollout undo` | `Jenkinsfile` `rollout_or_rollback` lines ~382 to 406 |
| Failure notification through a webhook stored as Jenkins credential `notify-webhook` | `Jenkinsfile` ~line 414 to 441 |
| Backend image is multi-stage and runs as non-root `appuser` | `campuscart-backend/Dockerfile` |
| Nightly PostgreSQL backup CronJob at 02:00 | `k8s/postgres-backup-cronjob.yaml` `schedule: "0 2 * * *"` |
| Namespace-scoped Jenkins RBAC: Role + RoleBinding for ServiceAccount `jenkins-deployer` | `k8s/jenkins-deployer-rbac.yaml` |
| cert-manager Certificates issued by a private ClusterIssuer `campuscart-ca-issuer` | `k8s/internal-tls-certs.yaml` |
| Cloudflare Tunnel manifests | `k8s/cloudflare-tunnel/` |
| ServiceMonitors for web, postgres, redis; Prometheus/Grafana values | `k8s/*-servicemonitor.yaml`, `monitoring/values.yaml` |
| AWS pipeline order: Checkout, Terraform Plan, Show Terraform Plan, Approve Infrastructure Changes, Terraform Apply, Prepare AWS Context, Build and Push Images, Render Manifests, Deploy to EKS | `Jenkinsfile.aws` |
| AWS Ingress uses the ALB controller with path routing: `/api` and `/ws` to backend (8000), `/` to nginx (80) | `k8s-aws/ingress.yaml` |
| HPA on backend: min 2, max 6, CPU target 70 %, memory target 80 % | `k8s-aws/hpa.yaml` |
| IRSA Terraform module exists, plus ServiceAccount and SecretStore manifests | `terraform/modules/iam-irsa`, `k8s-aws/serviceaccount.yaml`, `k8s-aws/secretstore.yaml` |

### Discrepancies: fix these everywhere (site, LinkedIn, Naukri, images, resume)
1. **Terraform modules: 7, not 6.** `networking, iam, iam-irsa, eks, rds, elasticache, ecr`. Previous text and the AWS diagram said 6.
2. **"TLS termination" on the ALB is NOT implemented in the repo.** `listen-ports` is HTTP 80 only. `certificate-arn` and `ssl-redirect` are commented out as placeholders. The resume says "path-based routing and TLS termination". Do not publish the TLS claim until Bharath shows a working HTTPS listener. List it as a "next improvement" instead. Bharath should also fix the resume line.
3. **kubeadm pipeline is 5 stages, not 6.** "Migrate" is a step inside Deploy, not its own stage. The old pipeline image is wrong.
4. **The AWS pipeline has no Test stage, no Security Scan stage, and no `rollout undo`.** It only does `rollout status`. Automatic rollback and bandit/pip-audit belong to the kubeadm pipeline only. Never present both pipelines as identical.
5. **The kubeadm registry is a private HTTP registry on a LAN address.** Do not publish the IP. Say "private registry".
6. **Only the backend image is multi-stage and non-root.** `nginx/Dockerfile` is a single `FROM nginx:alpine`. Say "backend image".
7. **The repo README is stale** (SQLite, Stripe, no DevOps content). A recruiter who clicks GitHub sees a generic Django app. Rewriting it is task D4.
8. **"Two environments in one repo."** kubeadm manifests are in `k8s/`, AWS manifests in `k8s-aws/`. Keep them clearly separate on the site.

### Still unknown: Bharath must answer (blocking where marked)
- (blocking) Is the AWS environment running right now, or destroyed? Default wording until answered: "completed deployment, torn down to avoid cost". Never write "live" for AWS.
- (blocking) Did IRSA work end to end when the AWS stack was deployed? Default: "IRSA module and ServiceAccount configured".
- (blocking) Is there any ALB HTTPS listener with an ACM certificate? Default: no.
- Where does Vault run (in-cluster or separate VM)? The repo references it in `entrypoint.sh`, `db_backend/base.py`, `web.yaml`, `migrate-job.yaml` and backup, but has no Vault server manifests. Default wording: "database credentials fetched from Vault at runtime", nothing about Vault deployment.
- Is `campuscart.bharathops.online` up on launch day? QA will check with `curl`.
- Which BCA college is correct? Resume wins: Shree Guru Sudhindra BCA College, Bhatkal, 2023, CGPA 8.1.

## 3. Reference analysis (video, 10 frames at 4 s)

The video is a phone recording of a laptop at an angle, so exact fonts and colors are estimated, not measured. Features observed:

| Element | What the reference does |
|---|---|
| Background | Warm light ivory, very light, near-flat |
| Type | Very large tight bold grotesk ("Full Stack Developer."), key words in an italic serif ("Lohitha.", "built.", "experience.", "moments."), small uppercase mono-like labels with numbering ("01 / ABOUT") |
| Nav | Small monogram top-left in a rounded square; pill group top-right with a dark active pill that follows the section |
| Hero | Giant ghost name behind the content (about 6 % opacity), left: label + huge headline + dark pill CTA + outline pill; right: standing full-length portrait cutout overlapping the ghost text |
| About | "Hi, I'm *Name*." with a hanging **ID badge on a lanyard** (photo, role, details, barcode) and a short italic quote |
| Skills | A **periodic-table grid** of tiles (symbol + small label); category tabs (Languages, Frontend, Backend, Databases, Tools, Core) highlight matching tiles and dim the rest; hover enlarges one tile with a detail panel |
| Work | "Things I've *built*." large panels shown one at a time with side labels |
| Education | "Education & *experience*." large type, minimal layout |
| Achievements | "Proud *moments*." big-number cards (280+, 20+) |
| Motion | Sections ease in, tiles react on hover, the badge sways. Nothing loops loudly. |

### Mapping to Bharath (what we copy and what we change)
| Reference | Bharath version |
|---|---|
| Ghost name | "BHARATH" ghost text, 5 to 7 % opacity |
| Portrait cutout | Real photo cutout if Bharath supplies one (section 10). Fallback: no portrait, a large typographic hero with the request-path diagram strip. Never a stock or AI-generated person. |
| ID badge | "Engineer ID" card: name, role, MCA VTU 2025 CGPA 9.05, Bengaluru, focus areas, email. No fake employee number, no fake barcode. A QR code to the live site is allowed (real). |
| Periodic table | **Stack table** of real tools: tile = 2 letter symbol + name. Category tabs: Containers, CI/CD and IaC, Cloud, Observability and Security, Systems. Selecting a tile shows where it was used and links to the case study and FACTS evidence. Tiles show *used in kubeadm / used in AWS / learning*. No percentages. |
| Things I've built | Two large case-study panels, stacked, not a carousel. Each has a diagram and links to its own page. |
| Proud moments | **"The system in numbers"**: only verified counts (3 nodes, 5 pipeline stages, 9 AWS pipeline stages, 7 Terraform modules). No invented achievements. |
| Education & experience | Education plus one "Independent DevOps projects, 2026 to present" entry. No fake employment. |

Palette (from Bharath's own design plan, kept): ivory `#F5F1E9`, charcoal `#222522`, sage `#D8E3D5`, sand `#E6DDD0`, muted green `#47644F` (single accent), soft white `#FFFDF9`.
Fonts: Manrope or Plus Jakarta Sans (display), an italic serif accent (Instrument Serif or Fraunces italic) used only on one word per heading, Inter (body), JetBrains Mono (labels). Self-host with Fontsource.

## 4. Product spec

### Sitemap (a real React app, client-side routing)
```
/                     Home (all sections below)
/work/kubeadm         Case study A: Self-Built Kubernetes Platform
/work/aws             Case study B: AWS Infrastructure and EKS Deployment
/resume               Embedded PDF preview + download button
404                   Friendly not-found with link home
```
Home order: Hero, About (badge), Stack (periodic table), Work (2 panels), Pipeline (kubeadm vs AWS), Principles, Numbers, Education, Contact, Footer.
Nav: About, Stack, Work, Pipeline, Contact, plus **Resume** (dark pill), GitHub icon link. Active-section highlight. Mobile: menu button with focus trap.

### Case study page template (both projects)
1. Status line (honest): kubeadm "Live" only if QA confirms; AWS "Completed deployment" unless Bharath says otherwise.
2. Overview and goal
3. Architecture diagram + text alternative
4. Pipeline diagram + text alternative
5. Key decisions and why (Kaniko, non-root, namespace RBAC, private CA, Cloudflare Tunnel, S3 native locking, Spot nodes, manual approval)
6. Security and operations
7. What I would improve next (AWS: ACM certificate and HTTPS listener already stubbed in `ingress.yaml`; add tests and scan stage to the AWS pipeline)
8. Evidence: permalinks to the exact files at commit `774df40`

### Pipelines on the site
Two tabs, never merged. Common rail: Source, Pipeline, Test, Scan, Build, Registry, Migrate, Deploy, Verify. Under each tab, light up only the stages that exist and show "not in this pipeline" for the rest.
- kubeadm: Checkout, Test, Security Scan, Build and Push (Kaniko), Deploy (migration Job, apply, rollout check, undo on failure).
- AWS: Checkout, Terraform Plan, Show Plan, Manual Approval, Terraform Apply, Prepare AWS Context, Build and Push (Kaniko to ECR), Render Manifests, Deploy to EKS (rollout status).
Stages need a number or label, not color only.

## 5. Architecture and quality bars

Stack: Vite, React, TypeScript (strict), React Router, plain CSS with custom properties (or Tailwind if Lead prefers), Lucide icons, Fontsource fonts. No animation library unless it removes a real problem. Hand-written SVG or HTML for diagrams.

```
bharath-portfolio/
  docs/PLAYBOOK.md  docs/FACTS.md
  public/ Bharath-Moger-DevOps-Resume.pdf  og-image.png  _redirects  favicon.svg
  src/
    main.tsx  App.tsx
    styles/ tokens.css  global.css
    data/ types.ts  projects.ts  stack.ts  numbers.ts  education.ts  site.ts
    components/
      layout/    Header.tsx  MobileMenu.tsx  Footer.tsx  Section.tsx
      hero/      Hero.tsx  GhostName.tsx
      about/     EngineerBadge.tsx  About.tsx
      stack/     StackTable.tsx  StackTile.tsx  StackDetail.tsx
      work/      WorkPanel.tsx  CaseStudyLayout.tsx
      diagrams/  DiagramFrame.tsx  KubeadmArchitecture.tsx  KubeadmPipeline.tsx
                 AwsArchitecture.tsx  AwsPipeline.tsx  PipelineCompare.tsx
      numbers/   NumbersStrip.tsx
      contact/   Contact.tsx
    pages/ Home.tsx  CaseKubeadm.tsx  CaseAws.tsx  Resume.tsx  NotFound.tsx  Lab.tsx
  e2e/ smoke.spec.ts  a11y.spec.ts  links.spec.ts
  scripts/ check-links.mjs
```

Quality bars (all measured, none assumed):
- `npm run build` and `npm run typecheck` and `npm run lint` pass with zero errors.
- Lighthouse mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- Initial JS <= 170 KB gzip. Images are WebP or AVIF with width/height set. Fonts are self-hosted woff2 with `font-display: swap`.
- No horizontal overflow at 360, 390, 768, 1024, 1440.
- axe: zero serious or critical issues. Visible focus on every control. `prefers-reduced-motion` respected. Diagrams have a text alternative.
- Console: zero errors. Every link returns 200 (checked by script).
- No secrets, private IPs, account IDs, ARNs, or state contents anywhere.

## 6. Team, ownership, branches

| Role | Account | Owns (only they edit) | Branch |
|---|---|---|---|
| Manager | this chat | PLAYBOOK, decisions, profile-image fixes | none |
| A Lead Engineer | account 1 | `package.json`, config, `index.html`, `src/main.tsx`, `App.tsx`, `styles/*`, `components/layout/*`, `components/work/*`, `pages/*`, `data/types.ts`, `public/*` except the PDF, CI workflow | `feat/foundation` |
| B Experience Designer | account 2 | `components/hero/*`, `about/*`, `stack/*`, `numbers/*`, `contact/*`, `hooks/*` | `feat/experience` |
| C Diagram Engineer | account 3 | `components/diagrams/*` | `feat/diagrams` |
| D Verifier, Content, QA | account 4 | `docs/FACTS.md`, `src/data/*` except `types.ts`, `e2e/*`, `scripts/*`, README, PRs against `k8s-campuscart` | `feat/content`, `chore/qa` |

With 3 accounts: merge D into the Manager's review duty and let A also do QA at the end. With 2 accounts: A+C and B+D.

Shared contract: A publishes `src/data/types.ts` in the first hour. B and C build against mock data of those types and mount their components on `/lab` (owned by A, one line per component). D fills real data later. Components take data by props, never import data files directly (except pages).

## 7. Phases and gates

| Gate | Condition | Who decides |
|---|---|---|
| G0 | Bharath answers the blocking questions in section 10 and creates the repo | Bharath |
| G1 | `feat/foundation` merged: builds, routes work, tokens, types, `/lab` exist | Manager reviews summary |
| G2 | `docs/FACTS.md` complete and approved by Bharath | Bharath + Manager |
| G3 | B, C branches build clean and render on `/lab` at 360 and 1440 | Lead merges |
| G4 | Real data wired, QA report has zero blocking issues | D |
| G5 | Deployed to Cloudflare Pages, domain connected, links re-checked | Bharath |

Order: G0, then G1 (A) in parallel with FACTS (D) and mock-data components (B, C). Then G3. Then integrate (A), QA (D), fix, deploy.
After G2, the Manager regenerates the LinkedIn/Naukri/portfolio images and the text fixes in section 2.

## 8. Briefs (paste one into each account)

Each worker also gets: this playbook, the resume PDF, the reference video, the repo URLs.

### Brief A: Lead Engineer
```
You are the Lead Engineer on Bharath Moger's portfolio. Read docs/PLAYBOOK.md fully before writing code.
Repo: github.com/bharathMoger18/bharath-portfolio. Work only on branch feat/foundation. Open a PR; never push to main.

Build the foundation, in this order:
1. Vite + React + TypeScript (strict) + React Router. Add scripts: dev, build, typecheck, lint, preview.
2. src/styles/tokens.css with the palette, type scale, spacing scale, radius, shadow, and focus ring from playbook section 3. global.css with reset, base type, reduced-motion rules. Self-host fonts with Fontsource.
3. src/data/types.ts: types for Project, StackItem (symbol, name, category, usedIn[], note, evidence[]), PipelineStage, NumberFact, Education, SiteMeta. Commit and push this FIRST, within your first hour, because B and C depend on it.
4. components/layout: Header (monogram, section pills with active state, Resume pill, GitHub link, mobile menu with focus trap), Footer (auto year), Section wrapper with the "01 / LABEL" heading style.
5. Routes: /, /work/kubeadm, /work/aws, /resume, 404, and /lab (mounts each component with mock data, one line per component).
6. components/work: WorkPanel (home summary) and CaseStudyLayout (the 8-part template in playbook section 4).
7. SEO: title, description, Open Graph, Twitter card, canonical, favicon, robots, sitemap. public/_redirects for SPA fallback on Cloudflare Pages.
8. CI workflow: install, typecheck, lint, build.

Rules: no new dependencies without a stated reason. Semantic HTML, one h1 per page. Do not touch folders owned by B, C or D. Do not invent content: use placeholder text marked TODO(D) where D will supply data.
Final summary must contain: files created, the real output of npm run typecheck / lint / build, bundle size, and anything you need from others.
```

### Brief B: Experience Designer
```
You are the Experience Designer on Bharath Moger's portfolio. Read docs/PLAYBOOK.md fully, then watch/inspect the reference video.
Branch: feat/experience. You own components/hero, about, stack, numbers, contact, hooks. Do not edit other folders.
Start only after A has pushed src/styles/tokens.css and src/data/types.ts. Build against mock data typed with those types. Mount your components on /lab through the one-line entries A provides.

Build:
1. Hero: ghost "BHARATH" text (about 6% opacity), eyebrow, huge headline with one italic-serif word, one honest sentence, dark pill "Explore projects", outline pill "View resume", GitHub and LinkedIn links. Portrait slot: use a real photo only if public/portrait.webp exists; otherwise render the typographic fallback with a small real request-path strip (Browser, Cloudflare, tunnel, ingress, Nginx, Django, PostgreSQL). No stock images.
2. EngineerBadge (About): hanging ID card on a lanyard with a gentle CSS sway (disabled under reduced motion). Real content only: name, role, MCA VTU 2025 CGPA 9.05, Bengaluru, email, a QR code to the live site. No fake ID number, no fake barcode.
3. StackTable: periodic-table tile grid. 2-letter symbol + name. Category tabs filter and dim tiles. Hover/focus/click opens StackDetail with: where it was used (kubeadm, AWS, learning), one factual sentence, and links to evidence. Tiles are real buttons: keyboard operable, aria-pressed, a plain text list fallback for screen readers. No percentages, no equal-depth implication.
4. NumbersStrip: big numbers from data only (3 nodes, 5 and 9 pipeline stages, 7 Terraform modules). Each number has a caption naming its source.
5. Contact: dark charcoal section, one clear email button, GitHub, LinkedIn, resume link. No form.
6. A small reveal-on-scroll hook using IntersectionObserver. Content must be visible without JavaScript animation finishing; reduced motion shows everything immediately.

Quality: mobile first, 360px to 1440px, no horizontal overflow, 44px touch targets, visible focus, contrast AA. Do not add decoration (extra gradients, glows, blobs). Hierarchy, spacing and type carry the design.
Final summary: screenshots at 360 and 1440 of /lab, real typecheck/lint/build output, a11y notes, and requests for other roles.
```

### Brief C: Diagram Engineer
```
You are the Diagram Engineer on Bharath Moger's portfolio. Read docs/PLAYBOOK.md, especially section 2 (verified facts) and section 4 (pipelines).
Branch: feat/diagrams. You own components/diagrams/* only.
Clone github.com/bharathMoger18/k8s-campuscart at commit 774df40 and verify every box and arrow against the files before drawing it. If a relationship is not in the files, do not draw it; list it in your summary as unverified.

Build React components (inline SVG or HTML+CSS, no images, no diagram library):
1. DiagramFrame: wrapper with title, caption, an accessible text alternative (visible "Read as text" disclosure), and horizontal scroll only as a labeled last resort. Mobile must stay legible: stack vertically below 640px instead of shrinking.
2. KubeadmArchitecture: 3-node kubeadm cluster; users, Cloudflare, cloudflared, ingress-nginx, Nginx, Django (2 replicas), PostgreSQL StatefulSet, Redis, migrate Job, backup CronJob, cert-manager private CA, Vault integration, Prometheus/Grafana, Jenkins deploy path with namespace RBAC. Do not show private IPs.
3. KubeadmPipeline: exactly 5 stages (Checkout, Test, Security Scan, Build and Push, Deploy) with Deploy expanded into migrate, apply, rollout check, undo on failure. Show that Test and Scan are skipped when the image tag already exists.
4. AwsArchitecture: VPC across 2 AZs, public/private subnets, NAT, EKS managed nodes, RDS PostgreSQL 16, ElastiCache Redis, ECR, S3 remote state, Secrets Manager, ALB with path rules (/api and /ws to backend, / to nginx), HPA, IRSA. Draw the ALB listener as HTTP only. Add a small marked "planned: ACM certificate and HTTPS" note.
5. AwsPipeline: the 9 stages in order from Jenkinsfile.aws, with the manual approval gate visually distinct (shape and label, not color only). No test stage, no scan stage, no rollback: do not draw them.
6. PipelineCompare: tabbed view (kubeadm, AWS) on the common rail Source, Pipeline, Test, Scan, Build, Registry, Migrate, Deploy, Verify. Stages missing from a pipeline read "not in this pipeline". Tabs are keyboard accessible.

Use only tokens from styles/tokens.css. Labels at least 14px on mobile. Colour is never the only signal.
Final summary: a table of every diagram element with file:line evidence, list of unverified items, screenshots at 360 and 1440, real typecheck/lint/build output.
```

### Brief D: Verifier, Content and QA
```
You are the Verifier, Content writer and QA lead on Bharath Moger's portfolio. Read docs/PLAYBOOK.md, especially section 2.
Branches: feat/content, then chore/qa. You own docs/FACTS.md, src/data/* (except types.ts), e2e/*, scripts/*.

Task D1 (first, blocks everyone): complete docs/FACTS.md. Clone github.com/bharathMoger18/k8s-campuscart at commit 774df40. For every claim on the resume and in the playbook, add a row: claim, status (CONFIRMED / CONTRADICTED / UNVERIFIED), file:line evidence. Cover at least: Vault usage, cert-manager, Cloudflare Tunnel, RBAC, backup, monitoring, Dockerfiles, both Jenkinsfiles, all Terraform modules and environments, ALB, HPA, IRSA, External Secrets, S3 backend and locking. Never copy secret values; flag any you see.
Task D2: write src/data/*.ts using only CONFIRMED rows. Case-study copy in first person, short sentences, honest status labels, a "What I would improve next" list. No invented metrics, uptime, cost savings or traffic.
Task D3: scripts/check-links.mjs (every external and internal link returns 200), e2e Playwright tests: smoke, nav anchors, resume download, a11y with axe at 360 and 1440, no console errors, no horizontal overflow at 360/390/768/1024/1440.
Task D4: separate PR against k8s-campuscart: rewrite README.md (current one is stale: SQLite, Stripe, no DevOps content). Sections: what it is, two environments, architecture, pipelines, how to run, status. Honest wording only.
Task D5 (after integration): run the full QA. Report REAL command output for install, typecheck, lint, build, e2e, Lighthouse mobile. Compare screenshots with the reference frames. File blocking issues in the summary; never claim a test passed without running it.
```

## 9. Definition of done

- The Lead's build passes and the site is deployed (Cloudflare Pages, free) at a domain Bharath chooses, for example `portfolio.bharathops.online`.
- Recruiter test (30 s): identity, two projects, tools, GitHub, resume, contact are each findable in one click.
- Interviewer test (5 min): diagrams match the code, decisions are explained, evidence links open the exact files, status is honest.
- `docs/FACTS.md` has zero CONTRADICTED rows left on the site.
- The profile corrections in section 2 (7 modules, no ALB TLS claim, 5-stage kubeadm pipeline, BCA college) are applied on LinkedIn, Naukri and the resume.

## 10. Inputs needed from Bharath (G0)

Blocking:
1. Create the public repo `bharathMoger18/bharath-portfolio` and make sure each Claude account is connected to the same GitHub login.
2. Answers to the three blocking questions in section 2 (AWS running? IRSA worked? any HTTPS on ALB?).
3. Commit the resume PDF as `public/Bharath-Moger-DevOps-Resume.pdf`.
4. Domain choice (recommended: `portfolio.bharathops.online` on Cloudflare Pages).

Optional but strongly recommended:
5. One clear photo, standing or half-body, plain background, good light, for the cutout. Without it the hero uses the typographic fallback.
6. Real screenshots: Grafana dashboards, `kubectl get nodes/pods`, Jenkins stage view, Terraform plan summary, with secrets and IPs hidden. Real screenshots beat any drawing.
7. Which BCA college to show (resume says Shree Guru Sudhindra BCA College, Bhatkal).
