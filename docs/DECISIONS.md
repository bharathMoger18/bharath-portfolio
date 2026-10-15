# Decisions log (overrides PLAYBOOK where they differ)

Date: 2026-10-15

1. Domain: portfolio.bharathops.online, hosted on Cloudflare Pages.
2. AWS environment is NOT running (torn down). Label it "Completed deployment, infrastructure torn down". Never write "live" for AWS. No live demo link for AWS.
3. IRSA: say "IRSA module and ServiceAccount configured in Terraform and manifests". Do not claim it was verified end to end.
4. ALB: HTTP listener only. HTTPS/ACM is listed under "What I would improve next". Do not claim TLS termination on the ALB.
5. Photo: added at the end. Build the hero with the typographic fallback and a photo slot that reads public/portrait.webp if the file exists. No placeholder person image.
6. kubeadm environment: label "Live" only after QA confirms the URL responds on launch day.
7. BCA college: Shree Guru Sudhindra BCA College, Bhatkal, 2023, CGPA 8.1 (resume).
8. Terraform has 7 modules (networking, iam, iam-irsa, eks, rds, elasticache, ecr). kubeadm pipeline has 5 stages. AWS pipeline has 9 stages and no test, scan, or rollback stage.
9. The final summary of every account goes back to the Manager through Bharath.
