/*
 * Verified pipeline definitions, one per Jenkinsfile, at k8s-campuscart@774df40.
 * Typed with the shared contract (src/data/types.ts). Every stage carries
 * file:line evidence. Used as the default data by KubeadmPipeline, AwsPipeline,
 * PipelineCompare and renderDiagram, so the drawings match the files even
 * before Account D's src/data/pipelines exists. Components also accept a
 * `pipeline` / `pipelines` prop to override these.
 */
import type { EvidenceLink, Pipeline, PipelineId, RailStage } from '../../data/types.ts';

const COMMIT = '774df40';
const SHA = '774df4037e5e7984d7b95b4adebf143cfb216bcd';

function ev(label: string, path: string, lines: string): EvidenceLink {
  const anchor = lines.includes('-') ? lines.replace('-', '-L') : lines;
  return {
    label,
    path,
    url: `https://github.com/bharathMoger18/k8s-campuscart/blob/${SHA}/${path}#L${anchor}`,
    commit: COMMIT,
    lines,
  };
}

/** Marker for a substep that only runs when something fails. Rendered as a distinct, tagged branch. */
export const ON_FAILURE_PREFIX = 'On failure: ';

export const KUBEADM_PIPELINE: Pipeline = {
  id: 'kubeadm',
  title: 'kubeadm pipeline',
  source: 'Jenkinsfile',
  stages: [
    {
      id: 'checkout',
      order: 1,
      label: 'Checkout',
      kind: 'standard',
      detail:
        'Checks out the repo, tags each image by the last commit that touched its inputs, and asks the private registry whether each tag already exists.',
      evidence: [ev('Jenkinsfile: Checkout and WEB_EXISTS', 'Jenkinsfile', '15-62')],
    },
    {
      id: 'test',
      order: 2,
      label: 'Test',
      kind: 'conditional',
      detail: 'Runs python manage.py test --noinput against PostgreSQL 15 and Redis 7 sidecar containers.',
      conditionNote: 'Skipped when the web image tag already exists in the registry.',
      evidence: [
        ev('Jenkinsfile: Test stage and gate', 'Jenkinsfile', '75-80'),
        ev('Jenkinsfile: manage.py test', 'Jenkinsfile', '177'),
      ],
    },
    {
      id: 'security-scan',
      order: 3,
      label: 'Security Scan',
      kind: 'conditional',
      detail:
        'bandit fails on MEDIUM severity and above. pip-audit fails on any known vulnerability. It runs before the build, so a failed scan leaves no image in the registry.',
      conditionNote: 'Skipped when the web image tag already exists in the registry.',
      evidence: [ev('Jenkinsfile: Security Scan', 'Jenkinsfile', '183-223')],
    },
    {
      id: 'build-push',
      order: 4,
      label: 'Build and Push Images',
      kind: 'conditional',
      detail:
        'Kaniko builds the web and nginx images in separate containers and pushes them to the private registry.',
      conditionNote: 'Runs when the web or nginx image is missing. Each image is skipped if its own tag already exists.',
      evidence: [
        ev('Jenkinsfile: Build and Push gate', 'Jenkinsfile', '229-234'),
        ev('Jenkinsfile: kaniko-web and kaniko-nginx', 'Jenkinsfile', '255-310'),
      ],
    },
    {
      id: 'deploy',
      order: 5,
      label: 'Deploy',
      kind: 'standard',
      detail: 'Runs as the namespace-scoped ServiceAccount jenkins-deployer.',
      substeps: [
        'Migrate, inside Deploy: delete the old migrate Job, apply the new one, wait up to 180 s, print its logs if it fails.',
        'Apply: the web and nginx manifests.',
        'Rollout check: web up to 600 s, nginx up to 120 s.',
        `${ON_FAILURE_PREFIX}kubectl rollout undo when the new ReplicaSet has fewer ready pods than wanted, then wait up to 300 s.`,
      ],
      evidence: [
        ev('Jenkinsfile: Deploy ServiceAccount', 'Jenkinsfile', '327'),
        ev('Jenkinsfile: migrate Job steps', 'Jenkinsfile', '363-369'),
        ev('Jenkinsfile: apply', 'Jenkinsfile', '375-376'),
        ev('Jenkinsfile: rollout check and undo', 'Jenkinsfile', '378-406'),
      ],
    },
  ],
  rail: {
    source: { present: true, stageIds: ['checkout'] },
    pipeline: { present: false },
    test: { present: true, stageIds: ['test'] },
    scan: { present: true, stageIds: ['security-scan'] },
    build: { present: true, stageIds: ['build-push'] },
    registry: { present: true, stageIds: ['build-push'] },
    migrate: { present: true, stageIds: ['deploy'] },
    deploy: { present: true, stageIds: ['deploy'] },
    verify: { present: true, stageIds: ['deploy'] },
  },
};

export const AWS_PIPELINE: Pipeline = {
  id: 'aws',
  title: 'AWS pipeline',
  source: 'Jenkinsfile.aws',
  stages: [
    {
      id: 'checkout',
      order: 1,
      label: 'Checkout',
      kind: 'standard',
      detail: 'Checks out the repo.',
      evidence: [ev('Jenkinsfile.aws: Checkout', 'Jenkinsfile.aws', '11')],
    },
    {
      id: 'terraform-plan',
      order: 2,
      label: 'Terraform Plan',
      kind: 'standard',
      detail: 'terraform init, then terraform plan saved to a plan file.',
      evidence: [ev('Jenkinsfile.aws: Terraform Plan', 'Jenkinsfile.aws', '43-68')],
    },
    {
      id: 'show-terraform-plan',
      order: 3,
      label: 'Show Terraform Plan',
      kind: 'standard',
      detail: 'Prints the saved plan so a person can read it before approving.',
      evidence: [ev('Jenkinsfile.aws: Show Terraform Plan', 'Jenkinsfile.aws', '79-98')],
    },
    {
      id: 'approve',
      order: 4,
      label: 'Approve Infrastructure Changes',
      kind: 'approval',
      detail: 'The pipeline stops until a person approves. The wait times out after 30 minutes.',
      evidence: [ev('Jenkinsfile.aws: input() with 30 min timeout', 'Jenkinsfile.aws', '102-113')],
    },
    {
      id: 'terraform-apply',
      order: 5,
      label: 'Terraform Apply',
      kind: 'standard',
      detail: 'Applies the approved plan file.',
      evidence: [ev('Jenkinsfile.aws: Terraform Apply', 'Jenkinsfile.aws', '114-139')],
    },
    {
      id: 'prepare-aws-context',
      order: 6,
      label: 'Prepare AWS Context',
      kind: 'standard',
      detail: 'Looks up the AWS account and builds the ECR registry address for later stages.',
      evidence: [ev('Jenkinsfile.aws: Prepare AWS Context', 'Jenkinsfile.aws', '146-178')],
    },
    {
      id: 'build-push',
      order: 7,
      label: 'Build and Push Images',
      kind: 'standard',
      detail: 'Kaniko builds the backend and nginx images and pushes them to Amazon ECR.',
      evidence: [ev('Jenkinsfile.aws: kaniko-web and kaniko-nginx', 'Jenkinsfile.aws', '180-245')],
    },
    {
      id: 'render-manifests',
      order: 8,
      label: 'Render Manifests',
      kind: 'standard',
      detail: 'Reads the RDS and Redis endpoints and the ECR image URLs from terraform output and fills the manifests with envsubst.',
      evidence: [ev('Jenkinsfile.aws: terraform output and envsubst', 'Jenkinsfile.aws', '246-308')],
    },
    {
      id: 'deploy-to-eks',
      order: 9,
      label: 'Deploy to EKS',
      kind: 'standard',
      detail: 'Updates the kubeconfig, applies the manifests, then waits on rollout status: backend up to 180 s, nginx up to 120 s.',
      evidence: [
        ev('Jenkinsfile.aws: kubectl apply', 'Jenkinsfile.aws', '334-352'),
        ev('Jenkinsfile.aws: rollout status', 'Jenkinsfile.aws', '354-360'),
      ],
    },
  ],
  rail: {
    source: { present: true, stageIds: ['checkout'] },
    pipeline: {
      present: true,
      stageIds: [
        'terraform-plan',
        'show-terraform-plan',
        'approve',
        'terraform-apply',
        'prepare-aws-context',
      ],
    },
    test: { present: false },
    scan: { present: false },
    build: { present: true, stageIds: ['build-push'] },
    registry: { present: true, stageIds: ['build-push'] },
    migrate: { present: false },
    deploy: { present: true, stageIds: ['render-manifests', 'deploy-to-eks'] },
    verify: { present: true, stageIds: ['deploy-to-eks'] },
  },
  notIncluded: ['No test or scan stage when deployed (both added after teardown, never run)', 'No migrate step', 'No rollback (rollout status only)'],
};

export const PIPELINES: Pipeline[] = [KUBEADM_PIPELINE, AWS_PIPELINE];

/** One-line reading of each rail slot, shown under its name. */
export const RAIL_HINTS: Record<RailStage, string> = {
  source: 'Code checkout',
  pipeline: 'Infrastructure plan, approval, apply',
  test: 'Automated tests',
  scan: 'Security scan',
  build: 'Image build',
  registry: 'Image push',
  migrate: 'Database migration',
  deploy: 'Apply manifests',
  verify: 'Rollout check',
};

export const RAIL_LABELS: Record<RailStage, string> = {
  source: 'Source',
  pipeline: 'Pipeline',
  test: 'Test',
  scan: 'Scan',
  build: 'Build',
  registry: 'Registry',
  migrate: 'Migrate',
  deploy: 'Deploy',
  verify: 'Verify',
};

/** Extra, verified wording for specific rail cells. */
export const RAIL_NOTES: Record<PipelineId, Partial<Record<RailStage, string>>> = {
  kubeadm: {
    source: 'Also computes image tags and checks the registry.',
    test: 'Only when the web image tag is new.',
    scan: 'Only when the web image tag is new.',
    registry: 'Private registry.',
    migrate: 'A step inside Deploy, not its own stage.',
    verify: 'Rollout check, with rollout undo on failure.',
  },
  aws: {
    registry: 'Amazon ECR.',
    deploy: 'Manifests are rendered from terraform output first.',
    verify: 'rollout status only. No rollout undo.',
  },
};
