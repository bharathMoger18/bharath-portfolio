# INTEGRATION.md: from mock data to real data

Owner: Account D (Content). The Lead (Account A) does the switch. D touches no component.
Rule from the PLAYBOOK: components take data by props. Only `src/pages/*` import `src/data/*`.

## 1. Switch table

| Mock file (export) | Real data file (export) | How the page should switch |
|---|---|---|
| `components/hero/hero.mock.ts` (`MOCK_HERO`) | `data/hero.ts` (`HERO`, `HERO_COPY`) | In `pages/Home.tsx`: `<Hero {...HERO} />`. `HERO` has the full `HeroProps` shape. |
| `components/about/about.mock.ts` (`MOCK_ABOUT`, `MOCK_BADGE`) | `data/about.ts` (`ABOUT`, `BADGE`) | `<About {...ABOUT} />`. The badge is inside `ABOUT.badge`. |
| `components/stack/stack.mock.ts` (`MOCK_STACK`) | `data/stack.ts` (`STACK`) | `<StackTable items={STACK} />`. 28 tiles (the mock had 27; `ec2` is new, tagged learning). The grid is `auto-fill`, so no layout change. |
| `components/numbers/numbers.mock.ts` (`MOCK_NUMBERS`) | `data/numbers.ts` (`NUMBERS`) | `<NumbersStrip facts={NUMBERS} />`. |
| `components/contact/contact.mock.ts` (`MOCK_CONTACT`) | `data/contact.ts` (`CONTACT`) | `<Contact {...CONTACT} />`. |
| Placeholder in `Home.tsx` (Education section) | `data/education.ts` (`EDUCATION`, newest first) | Render `EDUCATION.map(...)` inside `<Section id="education">`. |
| Placeholder in `Home.tsx` (Principles section) | `data/principles.ts` (`PRINCIPLES`, type `Principle`) | Render title, body and the evidence links of each entry. See 2.3. |
| `components/work/mock.ts` (`MOCK_PROJECT`, `MOCK_STATUSES`) | `data/projects.ts` (`PROJECTS`, `KUBEADM_PROJECT`, `AWS_PROJECT`, `getProject`) | Home: `PROJECTS.map((p, i) => <WorkPanel project={p} index={i + 1} />)`. `CaseKubeadm.tsx`: `<CaseStudyLayout project={KUBEADM_PROJECT} renderDiagram={renderDiagram} />`. `CaseAws.tsx`: same with `AWS_PROJECT`. |
| `components/diagrams/diagrams.mock.ts` (`DIAGRAM_MOCKS`) | `data/diagrams.ts` (`DIAGRAMS`) | Already used through `projects.ts`. The text is identical to the mock (re-verified). `/lab` may keep the mock. |
| `site.constants.ts` and `siteConfig.ts` | `data/site.ts` (`SITE`, `OG_IMAGE_ALT`) | See 2.2. `vite.config.ts` cannot import `data/site.ts` (it must stay import-free), so keep `site.constants.ts` in sync. |

## 2. Requests to the Lead (D cannot edit these files)

1. **`EvidenceLink` for screenshots.** `types.ts` requires `commit: string`. For the screenshot in `public/evidence/` I set `commit: 'screenshot'`, so the UI prints `public/evidence/grafana-namespace-pods.png @ screenshot`. Suggested change: make `commit` optional and hide the `@ commit` part when it is absent. The `url` is site-relative (`/evidence/...`); the link checker (D3) must treat it as a local file, not an HTTP link.
2. **SEO strings.** Replace these values in `site.constants.ts` so they match `data/site.ts`:
   - `SITE_DESCRIPTION`: `Bharath Moger, a fresher DevOps engineer in Bengaluru. A self-built Kubernetes platform and an AWS EKS deployment, with Terraform, Jenkins and Docker.`
   - `OG_IMAGE_ALT`: `Bharath Moger. DevOps portfolio at portfolio.bharathops.online, on a cream background with a dark B monogram.`
   - Resume file name: `/Bharath_Moger_DevOps_Resume.pdf` (underscores; the PLAYBOOK says hyphens).
3. **`Principle` type.** It lives in `data/principles.ts` because `types.ts` has none. Move it to `types.ts` if you prefer. Fields: `id`, `title`, `body`, `evidence: EvidenceLink[]`.
4. **kubeadm status flag.** `data/projects.ts` exports `QA_CONFIRMED_LIVE` (default `false`). QA flips it to `true` only after `https://campuscart.bharathops.online` answers on launch day (DECISIONS #6). It switches `status` to `{ kind: 'live', label: 'Live' }` and sets `liveUrl`. Never add a `liveUrl` to the AWS project.
5. **Resume page.** `public/Bharath_Moger_DevOps_Resume.pdf` still contains lines the site contradicts (see FACTS RS-13b, RS-24, RS-25). The PDF is Bharath's file; the Resume page should not add its own claims around it.

## 3. FACTS row map (every data field, by source row)

| File: field | FACTS rows |
|---|---|
| `site.ts`: name, email, github, linkedin | RS-01 |
| `site.ts`: role | RS-02, P-06 |
| `site.ts`: location | P-08 |
| `site.ts`: url, resumePath, ogImage | DECISIONS #1; resume committed (G-2) |
| `hero.ts`: eyebrow | P-08 |
| `hero.ts`: headline | DECISIONS #19 |
| `hero.ts`: sentence | RS-10, K-24, RS-21 |
| `hero.ts`: requestPath | K-22, K-19, K-21, K-12 |
| `about.ts`: paragraph 1 | P-06, P-08 |
| `about.ts`: paragraph 2 | DECISIONS #19 (exact wording) |
| `about.ts`: badge | P-06, RS-01 |
| `education.ts` | P-05, P-06, RS-28 |
| `contact.ts` | RS-01 |
| `numbers.ts`: 3, 5, 9, 7 | K-24 (owner output), K-01, A-01 with A-03 and A-04, A-06 |
| `principles.ts`: secrets | V-01, V-02, S-02 |
| `principles.ts`: scan first | K-05, K-06, K-33 |
| `principles.ts`: narrow job | K-17, K-30 |
| `principles.ts`: undo | K-10 |
| `principles.ts`: approval | A-02 |
| `stack.ts`: docker | K-25 |
| `stack.ts`: docker-compose | RS-05 |
| `stack.ts`: kubernetes, kubectl | K-12, K-10, A-01 |
| `stack.ts`: kubeadm | K-24 (owner output), RS-10 |
| `stack.ts`: jenkins, kaniko | K-01, A-01, K-07, K-31, A-05 |
| `stack.ts`: terraform, git | A-06, A-07, S-02 |
| `stack.ts`: eks, ecr, rds, elasticache | A-14, A-05, A-15 with A-16, A-17 |
| `stack.ts`: s3, vpc, iam | A-10, A-11, A-12, A-13, A-24 |
| `stack.ts`: ec2 | RS-07 (owner; learning) |
| `stack.ts`: prometheus, grafana | M-01, M-02, M-04, M-06 (with M-03) |
| `stack.ts`: vault, cert-manager | V-01 to V-04, K-19, K-21 |
| `stack.ts`: linux, tcp-ip, dns, http | RS-09 (learning, no evidence) |
| `stack.ts`: bash, python, nginx | RS-09, V-03, DECISIONS #19, K-27 |
| `projects.ts` kubeadm: status | K-23 (UNVERIFIED), DECISIONS #6 |
| `projects.ts` kubeadm: summary, overview | RS-14, K-24, K-12, DECISIONS #19 |
| `projects.ts` kubeadm: decisions | K-07 and K-31; K-05, K-06, K-33; K-25, K-27, K-28; K-17, K-18, K-30; V-01 to V-04; K-19, K-21; K-22 |
| `projects.ts` kubeadm: securityAndOps | V-02; K-27, K-28; K-12, K-13; K-09; K-10; K-14, K-15; M-01, M-04, M-06 |
| `projects.ts` kubeadm: nextImprovements | M-05; K-16; M-03; K-20, V-06; K-26, K-27 (DECISIONS #16) |
| `projects.ts` AWS: status | A-32, DECISIONS #2 |
| `projects.ts` AWS: summary, overview | RS-21, RS-22, A-06, A-01, A-14, RS-23 |
| `projects.ts` AWS: decisions | A-06 to A-08; A-02; A-10, A-11; A-13, A-14; A-15 to A-18; A-19 to A-21, A-23 with DECISIONS #3 and #10; A-05 with RS-27 |
| `projects.ts` AWS: securityAndOps | A-14; A-15, A-19; A-24; A-30; A-23; A-26; A-04, A-01 |
| `projects.ts` AWS: nextImprovements | A-27, A-29; A-03, A-04; A-16; A-31; M-05 (DECISIONS #16) |
| `diagrams.ts` | K-01 to K-15, K-19 to K-22, A-01 to A-30 (re-verified, unchanged) |
| `evidence.ts`: Grafana caption | DECISIONS #14 (exact) |
