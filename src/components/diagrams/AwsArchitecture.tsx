import DiagramFrame from './DiagramFrame.tsx';
import { DgConn, DgFlow, DgGrid, DgLegend, DgNode, DgZone } from './DiagramParts.tsx';

export interface AwsArchitectureProps {
  /** Plain text version, from the case-study data. */
  textAlternative: string;
  title?: string;
  caption?: string;
}

/*
 * Every box and arrow below was checked against k8s-campuscart@774df40
 * (terraform/, k8s-aws/, Jenkinsfile.aws). Evidence is in EVIDENCE.md.
 * Deliberately NOT drawn: Multi-AZ RDS, Redis encryption, any TLS on the ALB,
 * IRSA on the app pods, an arrow from Nginx to the backend (the nginx image
 * proxies to host "web", the AWS Service is "campuscart-backend"), pod-to-AZ
 * placement, AWS account ID, ARNs.
 * Status wording follows docs/DECISIONS.md #2: never "live".
 */
export default function AwsArchitecture({
  textAlternative,
  title = 'AWS architecture: Terraform, EKS, RDS, ElastiCache and an ALB',
  caption = 'Provisioned with Terraform in ap-south-1. Arrows follow the request. Secrets, images and state are labeled links.',
}: AwsArchitectureProps) {
  return (
    <DiagramFrame
      title={title}
      caption={caption}
      status="Completed deployment, infrastructure torn down"
      textAlternative={textAlternative}
      visualLabel="Architecture on AWS: internet clients reach an ALB over HTTP, which routes /api and /ws to the backend and / to Nginx on EKS. The backend uses RDS PostgreSQL and ElastiCache Redis."
    >
      <DgLegend
        items={[
          { variant: 'workload', label: 'Workload or AWS service' },
          { variant: 'store', label: 'Data store' },
          { variant: 'external', label: 'Outside the VPC' },
          { variant: 'planned', label: 'Planned, not built' },
        ]}
      />

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <DgFlow column>
          <DgNode name="Internet clients" kind="Visitors" variant="external" />
          <DgConn label="HTTP :80" />
        </DgFlow>

        <DgZone title="AWS region ap-south-1" variant="cluster">
          <DgZone title="VPC" tag="2 availability zones (a, b)" variant="inner">
            <DgZone title="Public subnets" tag="one per AZ" variant="plain">
              <DgGrid>
                <DgNode
                  name="Application Load Balancer"
                  kind="Internet-facing · listener HTTP :80 only"
                  detail="Created by the AWS Load Balancer Controller from the Ingress. Targets are pod IPs."
                  tags={['/api → backend :8000', '/ws → backend :8000', '/ → nginx :80']}
                />
                <DgNode
                  name="Planned: ACM certificate and HTTPS"
                  kind="Not built"
                  detail="The certificate and redirect lines in the Ingress are commented out. The listener is HTTP only."
                  variant="planned"
                />
                <DgNode name="NAT gateway" kind="Single gateway" detail="Private subnets route outbound traffic through it." />
              </DgGrid>
            </DgZone>

            <DgFlow column>
              <DgConn label="path rules" />
            </DgFlow>

            <DgZone title="Private subnets" tag="one per AZ" variant="plain">
              <DgZone title="EKS cluster" tag="Kubernetes 1.31 · managed Spot node group" variant="inner">
                <DgGrid>
                  <DgNode
                    name="nginx"
                    kind="Deployment · namespace campuscart"
                    detail="Container port 80. Receives / from the ALB."
                  />
                  <DgNode
                    name="backend"
                    kind="Deployment · min 2 replicas"
                    detail="Port 8000. HorizontalPodAutoscaler scales 2 to 6 on CPU and memory. Receives /api and /ws."
                    tags={['HPA 2 to 6', 'no IRSA']}
                  />
                  <DgNode
                    name="External Secrets Operator"
                    kind="Add-on"
                    detail="Copies the DB password from Secrets Manager into a Kubernetes Secret, refreshed every hour. The backend reads that Secret."
                    tags={['IRSA configured']}
                  />
                  <DgNode
                    name="AWS Load Balancer Controller"
                    kind="Add-on"
                    detail="Builds the ALB from the Ingress."
                    tags={['IRSA configured']}
                  />
                </DgGrid>
              </DgZone>

              <DgFlow column>
                <DgConn label="DB_HOST and REDIS_HOST" />
              </DgFlow>

              <DgGrid>
                <DgNode name="RDS PostgreSQL 16" kind="Managed database" detail="Single AZ. Not publicly accessible. Encrypted at rest." variant="store" />
                <DgNode name="ElastiCache Redis 7.1" kind="Managed cache" detail="One cache node." variant="store" />
              </DgGrid>
            </DgZone>
          </DgZone>

          <DgZone title="AWS services outside the VPC" variant="inner">
            <DgGrid>
              <DgNode
                name="Amazon ECR"
                kind="Image registry"
                detail="Repositories campuscart-backend and campuscart-nginx. Kaniko pushes. The Deployments pull."
                variant="external"
              />
              <DgNode
                name="Secrets Manager"
                kind="Secret store"
                detail="Holds the generated DB password."
                variant="external"
              />
              <DgNode
                name="S3 state bucket"
                kind="Terraform remote state"
                detail="Native state locking, no DynamoDB table. Versioning and encryption on."
                variant="external"
              />
            </DgGrid>
          </DgZone>
        </DgZone>

        <DgZone title="Provisioning and delivery">
          <DgGrid>
            <DgNode
              name="Terraform"
              kind="7 modules"
              detail="Three roots: bootstrap, environments/production, environments/production-addons. The iam-irsa module is used by production-addons."
              tags={['ecr', 'eks', 'elasticache', 'iam', 'iam-irsa', 'networking', 'rds']}
            />
            <DgNode
              name="Jenkins pipeline"
              kind="Jenkinsfile.aws · 9 stages as deployed"
              detail="Plan, manual approval, apply, then build, push and deploy. Jenkins reaches EKS through an access entry limited to the campuscart namespace."
            />
          </DgGrid>
        </DgZone>
      </div>
    </DiagramFrame>
  );
}
