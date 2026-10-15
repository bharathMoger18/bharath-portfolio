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
10. IRSA is configured in Terraform for the External Secrets Operator and the AWS Load Balancer Controller only. App pods do not use IRSA. Never write "IRSA for the app".
11. TLS wording: "internal TLS with cert-manager and a private CA". Never write "HTTPS on every internal hop".
12. Image wording: "multi-stage backend Docker image running as a non-root user". Never claim image size (no "small", "slim" or MB figures).
13. Never claim anywhere on the site: TLS/HTTPS on the AWS ALB; Multi-AZ RDS; Redis encryption; alerting (rules or notifications); a tested backup restore; disaster recovery; that the AWS stack served real traffic; uptime or availability figures; image sizes; test counts or coverage.
14. Monitoring evidence only from screenshots committed under public/evidence/. Allowed captions: "Grafana dashboard from my kubeadm cluster: CPU and memory for the k8s-campuscart namespace, scraped by Prometheus" and "CampusCart microservices dashboard I built earlier, on the same kubeadm cluster". Never present the microservices dashboard as part of the k8s-campuscart project.
15. Versions: the kubeadm cluster is 3 nodes (1 control plane, 2 workers) on Kubernetes v1.30. The EKS cluster is Kubernetes 1.31 on managed Spot nodes. Never mix them.
16. "What I would improve next" (honest gaps): ACM certificate and HTTPS on the ALB; alerting rules and notifications; a tested backup restore; RDS Multi-AZ; hardening the Nginx container (it listens on port 80).
17. Authorship: see item 19.
18. Never publish on any site page or data file: AWS account ID, Cloudflare tunnel ID, LAN registry address, private IPs, phone number. Exception: the resume PDF keeps the phone number (Bharath's choice). Email is allowed.
19. Authorship: the Django app was built with AI tools. Never write "I wrote the app". Use: "I built CampusCart with AI coding tools. My own work is the platform around it: Kubernetes, CI/CD, secrets, TLS, monitoring and AWS infrastructure in Terraform."
