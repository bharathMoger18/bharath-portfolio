import type { Pipeline } from '../../data/types.ts';
import DiagramFrame from './DiagramFrame.tsx';
import { NotIncluded, StageTimeline } from './DiagramParts.tsx';
import { AWS_PIPELINE } from './pipelineDefs.ts';

export interface AwsPipelineProps {
  /** Plain text version, from the case-study data. */
  textAlternative: string;
  /** Override the built-in verified definition (Jenkinsfile.aws at 774df40). */
  pipeline?: Pipeline;
  title?: string;
  caption?: string;
}

/** The AWS Jenkinsfile: 9 stages in order, manual approval gate distinct by shape and label. */
export default function AwsPipeline({
  textAlternative,
  pipeline = AWS_PIPELINE,
  title = 'AWS pipeline: 9 stages as deployed',
  caption = 'From Jenkinsfile.aws. The octagon is a manual approval gate: the pipeline waits for a person before Terraform Apply.',
}: AwsPipelineProps) {
  return (
    <DiagramFrame
      title={title}
      caption={caption}
      textAlternative={textAlternative}
      visualLabel={`${pipeline.title}, ${pipeline.stages.length} stages as deployed, in order: ${pipeline.stages
        .map((s) => s.label)
        .join(', ')}. Stage ${pipeline.stages.find((s) => s.kind === 'approval')?.order ?? ''} is a manual approval gate.`}
    >
      <StageTimeline stages={pipeline.stages} />
      {pipeline.notIncluded ? <NotIncluded items={pipeline.notIncluded} /> : null}
    </DiagramFrame>
  );
}
