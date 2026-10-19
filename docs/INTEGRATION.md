# INTEGRATION.md: data map

Owner: Account D (Content). Updated 2026-10-19 to match `main` at `a9ec728`.

## Status

The switch from mock files to `src/data` is finished. Every page imports from `src/data`, the mock files are deleted, `vite.config.ts` reads `src/data/site.ts`, and `EvidenceLink.commit` is optional. The old switch table and the requests to the Lead described work that is done, so they were removed (they stay in git history).

This file now holds one thing: which FACTS rows back each data field. `stack.ts`, `projects.ts` and `principles.ts` point here for that.

## Open item

- The `Principle` type still lives in `src/data/principles.ts`, not in `types.ts`. Moving it is optional and changes nothing on the site.

## FACTS row map (every data field, by source row)

| File: field | FACTS rows |
|---|---|
| `site.ts`: name, email, github, linkedin | RS-01 |
| `site.ts`: role | RS-02, P-06 |
| `site.ts`: location | P-08 |
| `site.ts`: description, title | P-08, K-24, A-14 (DECISIONS #1 for the domain) |
| `site.ts`: OG alt | describes `public/og-image.png`; no FACTS row needed |
| `site.ts`: url, resumePath, ogImage | DECISIONS #1; resume committed (G-2) |
| `hero.ts`: eyebrow | P-08 |
| `hero.ts`: headline | DECISIONS #19 |
| `hero.ts`: sentence | RS-10, K-24, RS-21 |
| `about.ts`: paragraph 1 | P-06, P-08 |
| `about.ts`: paragraph 2 | DECISIONS #19 (exact wording) |
| `about.ts`: badge | P-06, RS-01 |
| `education.ts` | P-05, P-06, RS-28 |
| `contact.ts` | RS-01 |
| `numbers.ts`: 3, 5, 9, 7 | K-24 (owner output), K-01, A-01 with A-03 and A-04 (as deployed, `774df40`), A-06. The AWS caption also uses A-35 (later edit). |
| `principles.ts`: secrets | V-01, V-02, S-02 |
| `principles.ts`: scan first | K-05, K-06, K-33 |
| `principles.ts`: narrow job | K-17, K-30 |
| `principles.ts`: undo | K-10 |
| `principles.ts`: approval | A-02 |
| `stack.ts`: docker | K-25 |
| `stack.ts`: docker-compose | RS-05 |
| `stack.ts`: kubernetes, kubectl | K-12, K-10, A-01 |
| `stack.ts`: kubeadm | K-24 (owner output), RS-10 |
| `stack.ts`: jenkins, kaniko | K-01, A-01 (as deployed), A-35, K-07, K-31, A-05 |
| `stack.ts`: terraform, git | A-06, A-07, S-02 |
| `stack.ts`: eks, ecr, rds, elasticache | A-14, A-05, A-15 with A-16, A-17 |
| `stack.ts`: s3, vpc, iam | A-10, A-11, A-12, A-13, A-24 |
| `stack.ts`: ec2 | RS-07 (owner; learning) |
| `stack.ts`: prometheus, grafana | M-01, M-02, M-04, M-06 (with M-03) |
| `stack.ts`: vault, cert-manager | V-01 to V-04, K-19, K-21 |
| `stack.ts`: linux, tcp-ip, dns, http | RS-09 (learning, no evidence) |
| `stack.ts`: bash, python, nginx | RS-09, V-03, DECISIONS #19, K-27 |
| `projects.ts` kubeadm: status | K-23, DECISIONS #6. QA set `QA_CONFIRMED_LIVE` to true in commit `9a28871` after an HTTP/2 200 on 2026-10-18. The FACTS K-23 row itself still says UNVERIFIED and needs updating. |
| `projects.ts` kubeadm: summary, overview | RS-14, K-24, K-12, DECISIONS #19 |
| `projects.ts` kubeadm: decisions | K-07 and K-31; K-05, K-06, K-33; K-25, K-27, K-28; K-17, K-18, K-30; V-01 to V-04; K-19, K-21; K-22 |
| `projects.ts` kubeadm: securityAndOps | V-02; K-27, K-28; K-12, K-13; K-09; K-10; K-14, K-15; M-01, M-04, M-06 |
| `projects.ts` kubeadm: nextImprovements | M-05; K-16; M-03; K-20, V-06; K-26, K-27 (DECISIONS #16) |
| `projects.ts` AWS: status | A-32, DECISIONS #2 |
| `projects.ts` AWS: summary, overview | RS-21, RS-22, A-06, A-01 (as deployed), A-14, RS-23 |
| `projects.ts` AWS: decisions | A-06 to A-08; A-02; A-10, A-11; A-13, A-14; A-15 to A-18; A-19 to A-21, A-23 with DECISIONS #3 and #10; A-05 with RS-27 |
| `projects.ts` AWS: securityAndOps | A-14; A-15, A-19; A-24; A-30; A-23; A-26; A-04, A-01 (as deployed); A-35 (stages added after teardown) |
| `projects.ts` AWS: nextImprovements | A-27, A-29; A-35 and A-04 (run the added stages, add a rollback); A-16; A-31; M-05 (DECISIONS #16) |
| `diagrams.ts` | K-01 to K-15, K-19 to K-22, A-01 to A-30 (all as deployed at `774df40`), A-35 (the note about stages added later) |
| `evidence.ts`: Grafana caption | DECISIONS #14 (exact) |
