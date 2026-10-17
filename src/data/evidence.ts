/*
 * Evidence helpers. Owner: Account D (Content). Every repo link points at one
 * audited commit of github.com/bharathMoger18/k8s-campuscart, never the repo
 * root. Line numbers come from docs/FACTS.md and were re-read at that commit.
 */
import type { EvidenceLink } from './types.ts';

export const AUDIT_REPO = 'https://github.com/bharathMoger18/k8s-campuscart';
export const AUDIT_COMMIT = '774df40';

/** "92-94" becomes "#L92-L94"; "4" becomes "#L4". */
function anchor(lines?: string): string {
  if (!lines) return '';
  const [from, to] = lines.split('-');
  return to ? `#L${from}-L${to}` : `#L${from}`;
}

/** Permalink to a file, optionally to a line or a line range. */
export function ev(label: string, path: string, lines?: string): EvidenceLink {
  return {
    label,
    path,
    url: `${AUDIT_REPO}/blob/${AUDIT_COMMIT}/${path}${anchor(lines)}`,
    commit: AUDIT_COMMIT,
    ...(lines ? { lines } : {}),
  };
}

/** Permalink to a folder. Use only when the folder itself is the evidence. */
export function evTree(label: string, path: string): EvidenceLink {
  return {
    label,
    path,
    url: `${AUDIT_REPO}/tree/${AUDIT_COMMIT}/${path}`,
    commit: AUDIT_COMMIT,
  };
}

/**
 * Screenshot committed in this site's own repo under public/evidence/
 * (docs/DECISIONS.md #14). It has no commit in the audited repo, so `commit`
 * holds the word "screenshot". The url is a site-relative path.
 */
export function shot(label: string, file: string): EvidenceLink {
  return {
    label,
    path: `public/evidence/${file}`,
    url: `/evidence/${file}`,
    commit: 'screenshot',
  };
}

/** The one caption DECISIONS #14 allows for the namespace dashboard. Do not reword. */
export const GRAFANA_NAMESPACE_CAPTION =
  'Grafana dashboard from my kubeadm cluster: CPU and memory for the k8s-campuscart namespace, scraped by Prometheus';

export const GRAFANA_NAMESPACE_SHOT = shot(
  GRAFANA_NAMESPACE_CAPTION,
  'grafana-namespace-pods.png',
);
