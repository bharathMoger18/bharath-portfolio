import DiagramFrame from './DiagramFrame.tsx';
import { DgConn, DgFlow, DgGrid, DgLegend, DgNode, DgZone } from './DiagramParts.tsx';

export interface KubeadmArchitectureProps {
  /** Plain text version, from the case-study data. */
  textAlternative: string;
  title?: string;
  caption?: string;
}

/*
 * Every box and arrow below was checked against k8s-campuscart@774df40.
 * Evidence (file:line) is listed in EVIDENCE.md next to this file.
 * Not drawn on purpose: node placement of pods (no nodeSelector for the app),
 * Grafana (not in the repo), how Vault and cert-manager were installed.
 * No private IPs, tunnel ID or registry address appear anywhere.
 */
export default function KubeadmArchitecture({
  textAlternative,
  title = 'kubeadm cluster architecture',
  caption = 'One self-built cluster. Arrows follow the request. Secrets, certificates, metrics and deploys are shown as labeled links.',
}: KubeadmArchitectureProps) {
  return (
    <DiagramFrame
      title={title}
      caption={caption}
      textAlternative={textAlternative}
      visualLabel="Architecture of the kubeadm cluster: users reach Cloudflare, a cloudflared tunnel, ingress-nginx, Nginx and Django, which use PostgreSQL and Redis."
    >
      <DgLegend
        items={[
          { variant: 'workload', label: 'Long-running workload' },
          { variant: 'job', label: 'Job or CronJob' },
          { variant: 'store', label: 'Data store' },
          { variant: 'external', label: 'Outside the cluster' },
        ]}
      />

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <DgZone title="Public internet" variant="outside">
          <DgFlow>
            <DgNode name="Users" kind="Visitors" detail="Browser requests to the public hostname." variant="external" />
            <DgConn label="public hostname" />
            <DgNode
              name="Cloudflare"
              kind="Edge and Tunnel"
              detail="The tunnel routes the hostname to cloudflared in the cluster."
              variant="external"
            />
          </DgFlow>
        </DgZone>

        <DgFlow column>
          <DgConn label="Cloudflare Tunnel" />
        </DgFlow>

        <DgZone title="kubeadm cluster" tag="Kubernetes v1.30 · 3 nodes: 1 control plane, 2 workers" variant="cluster">
          <DgZone title="Request path" variant="inner">
            <DgFlow>
              <DgNode name="cloudflared" kind="Deployment x2" meta="ns cloudflare-tunnel" detail="Tunnel client. Sends traffic to ingress-nginx." />
              <DgConn label="HTTPS :443" />
              <DgNode
                name="ingress-nginx"
                kind="Ingress controller"
                meta="ns ingress-nginx"
                detail="Serves the cloudflare-edge-tls certificate. Talks HTTPS to Nginx."
              />
              <DgConn label="HTTPS" />
              <DgNode name="Nginx" kind="Deployment x1" meta="ns k8s-campuscart" detail="Listens on 8443 with the nginx-backend-tls certificate." />
              <DgConn label="HTTP :8000" />
              <DgNode name="Django (web)" kind="Deployment x2" meta="ns k8s-campuscart" detail="Service web, port 8000. Exposes metrics for Prometheus." />
            </DgFlow>
          </DgZone>

          <DgZone title="Data stores · Django connects to both" variant="inner">
            <DgGrid>
              <DgNode name="PostgreSQL" kind="StatefulSet x1" meta="ns k8s-campuscart" detail="Service postgres, port 5432." variant="store" />
              <DgNode name="Redis" kind="Deployment x1" meta="ns k8s-campuscart" detail="Service redis, port 6379." variant="store" />
            </DgGrid>
          </DgZone>

          <DgZone title="Jobs · both use PostgreSQL" variant="inner">
            <DgGrid>
              <DgNode
                name="migrate Job"
                kind="Job"
                meta="ns k8s-campuscart"
                detail="Runs database migrations. The Deploy stage creates it before the new Deployments are applied."
                variant="job"
              />
              <DgNode
                name="postgres-backup"
                kind="CronJob · 02:00 daily"
                meta="ns k8s-campuscart"
                detail="Runs pg_dump and writes to the postgres-backups volume."
                variant="job"
              />
            </DgGrid>
          </DgZone>

          <DgZone title="Platform services" variant="inner">
            <DgGrid>
              <DgNode
                name="cert-manager"
                kind="Internal TLS, private CA"
                detail="Certificates nginx-backend-tls and cloudflare-edge-tls come from ClusterIssuer campuscart-ca-issuer. Used by Nginx and ingress-nginx."
                tags={['issuer defined outside the repo']}
              />
              <DgNode
                name="Vault"
                kind="Secrets, Agent Injector"
                meta="ns vault"
                detail="Injects secrets into Django (dynamic database credentials and KV), the migrate Job and the backup CronJob. Each has its own role."
                tags={['server install not in the repo']}
              />
              <DgNode
                name="Prometheus"
                kind="Metrics"
                detail="ServiceMonitors scrape Django, PostgreSQL and Redis. Retention 10 days."
              />
            </DgGrid>
          </DgZone>
        </DgZone>

        <DgZone title="Jenkins build and deploy path">
          <DgFlow>
            <DgNode name="Build and Push stage" kind="Jenkins agent pod" meta="Kaniko" detail="Builds the web and nginx images." />
            <DgConn label="push" />
            <DgNode name="Private registry" kind="Image registry" detail="Holds the web and nginx images." />
            <DgConn label="pull" />
            <DgNode
              name="Django, Nginx, migrate Job"
              kind="Pods in k8s-campuscart"
              detail="Their images come from the private registry."
            />
          </DgFlow>
          <DgFlow>
            <DgNode
              name="Deploy stage"
              kind="Jenkins agent pod · kubectl"
              meta="ns jenkins-agents"
              detail="Runs as ServiceAccount jenkins-deployer."
            />
            <DgConn label="Role + RoleBinding" />
            <DgNode
              name="Namespace k8s-campuscart"
              kind="Namespace-scoped access"
              detail="Can update Deployments and Services and create or delete Jobs, only in this namespace."
            />
          </DgFlow>
        </DgZone>
      </div>
    </DiagramFrame>
  );
}
