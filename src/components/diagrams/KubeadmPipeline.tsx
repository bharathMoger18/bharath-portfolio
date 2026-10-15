import type { Pipeline } from '../../data/types.ts';
import DiagramFrame from './DiagramFrame.tsx';
import { StageTimeline } from './DiagramParts.tsx';
import { KUBEADM_PIPELINE } from './pipelineDefs.ts';

export interface KubeadmPipelineProps {
  /** Plain text version, from the case-study data. */
  textAlternative: string;
  /** Override the built-in verified definition (Jenkinsfile at 774df40). */
  pipeline?: Pipeline;
  title?: string;
  caption?: string;
}

/** The kubeadm Jenkinsfile: exactly 5 stages, Deploy expanded. */
export default function KubeadmPipeline({
  textAlternative,
  pipeline = KUBEADM_PIPELINE,
  title = 'kubeadm pipeline: 5 stages',
  caption = 'From Jenkinsfile. Dashed stages are conditional: Test and Scan are skipped when the web image tag is already in the registry. Migrate is a step inside Deploy, not its own stage.',
}: KubeadmPipelineProps) {
  return (
    <DiagramFrame
      title={title}
      caption={caption}
      textAlternative={textAlternative}
      visualLabel={`${pipeline.title}, ${pipeline.stages.length} stages in order: ${pipeline.stages
        .map((s) => s.label)
        .join(', ')}.`}
    >
      <StageTimeline stages={pipeline.stages} />
    </DiagramFrame>
  );
}
