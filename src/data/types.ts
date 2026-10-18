/**
 * Shared data contract for the portfolio.
 * Owner: Account A (Lead Engineer). Do not edit from other branches;
 * request changes in your final summary instead.
 *
 * Rules baked into the types:
 *  - Components take these types by props. Only pages import data files.
 *  - Every technical claim carries evidence (EvidenceLink) or is not shipped.
 *  - Status is explicit and honest: AWS is never "live" (docs/DECISIONS.md #2).
 */

/* ------------------------------------------------------------------ */
/* Evidence                                                            */
/* ------------------------------------------------------------------ */

/** Permalink to the exact file in the audited repo. */
export interface EvidenceLink {
  /** Short visible label, e.g. "Jenkinsfile: stage names". */
  label: string;
  /** Repo-relative path, e.g. "Jenkinsfile". */
  path: string;
  /** Full permalink at the audited commit. */
  url: string;
  /**
   * Audited commit, e.g. "774df40". Absent for evidence that is not a file in
   * the audited repo (a screenshot committed under public/evidence/), so no
   * "@ commit" is shown for it.
   */
  commit?: string;
  /** Optional line or range, e.g. "363-369". */
  lines?: string;
}

/* ------------------------------------------------------------------ */
/* Stack table                                                         */
/* ------------------------------------------------------------------ */

export type StackCategory =
  | 'containers'
  | 'cicd-iac'
  | 'cloud'
  | 'observability-security'
  | 'systems';

/** Where a tool was actually used. No percentages, no depth claims. */
export type UsedIn = 'kubeadm' | 'aws' | 'learning';

export interface StackItem {
  /** Stable id, kebab-case, unique. */
  id: string;
  /** Two-letter tile symbol, e.g. "Kb". */
  symbol: string;
  /** Display name, e.g. "Kubernetes". */
  name: string;
  category: StackCategory;
  /** Non-empty. A tool used in neither project is tagged ["learning"]. */
  usedIn: UsedIn[];
  /** One factual sentence. */
  note: string;
  /** Links shown in StackDetail. Empty only when usedIn is ["learning"]. */
  evidence: EvidenceLink[];
}

/* ------------------------------------------------------------------ */
/* Pipelines                                                           */
/* ------------------------------------------------------------------ */

export type PipelineId = 'kubeadm' | 'aws';

/** Common rail used by PipelineCompare, in display order. */
export type RailStage =
  | 'source'
  | 'pipeline'
  | 'test'
  | 'scan'
  | 'build'
  | 'registry'
  | 'migrate'
  | 'deploy'
  | 'verify';

export const RAIL_ORDER: readonly RailStage[] = [
  'source',
  'pipeline',
  'test',
  'scan',
  'build',
  'registry',
  'migrate',
  'deploy',
  'verify',
] as const;

/**
 * standard    normal stage
 * approval    manual gate; must be distinct by shape and label, not color
 * conditional runs only when a condition holds (see conditionNote)
 */
export type StageKind = 'standard' | 'approval' | 'conditional';

export interface PipelineStage {
  /** Unique within its pipeline, e.g. "security-scan". */
  id: string;
  /** 1-based position in the pipeline (kubeadm: 1..5, aws: 1..9). */
  order: number;
  /** Visible label, exactly as in the Jenkinsfile where possible. */
  label: string;
  kind: StageKind;
  /** One factual sentence about what the stage does. */
  detail?: string;
  /** Required when kind is "conditional". */
  conditionNote?: string;
  /** Steps inside the stage, e.g. Deploy: migrate, apply, rollout check. */
  substeps?: string[];
  evidence?: EvidenceLink[];
}

/** Whether a rail slot exists in a pipeline. Absent stages read "not in this pipeline". */
export type RailCell =
  | { present: true; stageIds: string[] }
  | { present: false };

export interface Pipeline {
  id: PipelineId;
  title: string;
  /** Jenkinsfile name, e.g. "Jenkinsfile.aws". */
  source: string;
  stages: PipelineStage[];
  rail: Record<RailStage, RailCell>;
  /** Honest limits, e.g. "No test stage, no scan stage, no rollback". */
  notIncluded?: string[];
}

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */

export interface NumberFact {
  id: string;
  /** Verified count only. */
  value: number;
  /** Short label, e.g. "Terraform modules". */
  label: string;
  /** Caption that names the source, shown under the number. */
  caption: string;
  evidence: EvidenceLink[];
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface Education {
  id: string;
  kind: 'degree' | 'independent';
  /** Institution, or "Independent DevOps projects" for kind "independent". */
  institution: string;
  location?: string;
  /** e.g. "MCA", "BCA". */
  degree?: string;
  /** Free text, e.g. "2023" or "2026 to present". */
  period: string;
  grade?: { label: string; value: string };
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Projects and case studies                                           */
/* ------------------------------------------------------------------ */

/**
 * live                  only after QA confirms the URL responds on launch day
 * pending-confirmation  default for kubeadm until QA confirms
 * completed-torn-down   AWS: "Completed deployment, infrastructure torn down"
 */
export type ProjectStatusKind =
  | 'live'
  | 'pending-confirmation'
  | 'completed-torn-down';

export interface ProjectStatus {
  kind: ProjectStatusKind;
  /** Visible label. Must match the kind and docs/DECISIONS.md. */
  label: string;
}

export type DiagramId =
  | 'kubeadm-architecture'
  | 'kubeadm-pipeline'
  | 'aws-architecture'
  | 'aws-pipeline';

export interface CaseDiagram {
  diagramId: DiagramId;
  /** Text alternative shown in "Read as text". */
  textAlternative: string;
}

export interface KeyDecision {
  title: string;
  /** Why, in first person, short sentences. */
  why: string;
  evidence?: EvidenceLink[];
}

export interface Project {
  /** Route slug: "kubeadm" or "aws" (maps to /work/:slug). */
  slug: string;
  title: string;
  /** One-sentence summary for WorkPanel on Home. */
  summary: string;
  status: ProjectStatus;
  /** Link to the running site. Optional. Never set for AWS (docs/DECISIONS.md #2). */
  liveUrl?: string;
  tags: string[];

  /* Case study template, 8 parts (PLAYBOOK section 4). Part 1 is `status`. */
  overview: string[];
  architecture: CaseDiagram;
  pipeline: CaseDiagram;
  decisions: KeyDecision[];
  securityAndOps: string[];
  nextImprovements: string[];
  evidence: EvidenceLink[];
}

/* ------------------------------------------------------------------ */
/* Site metadata                                                       */
/* ------------------------------------------------------------------ */

export interface SiteMeta {
  name: string;
  role: string;
  location: string;
  title: string;
  description: string;
  /** Canonical origin, no trailing slash, e.g. "https://portfolio.bharathops.online". */
  url: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  /** Public path of the resume PDF, e.g. "/Bharath-Moger-DevOps-Resume.pdf". */
  resumePath: string;
  /** Public path of the OG image, e.g. "/og-image.png". */
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  locale: string;
  themeColor: string;
  /** Hero reads this only if the file exists. No placeholder person image. */
  portraitPath: string;
}
