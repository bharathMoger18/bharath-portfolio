import type { ReactNode } from 'react';
import type { CaseDiagram } from '../../data/types.ts';
import AwsArchitecture from './AwsArchitecture.tsx';
import AwsPipeline from './AwsPipeline.tsx';
import KubeadmArchitecture from './KubeadmArchitecture.tsx';
import KubeadmPipeline from './KubeadmPipeline.tsx';

/**
 * Maps a CaseDiagram to its component, for CaseStudyLayout's renderDiagram prop
 * and for WorkPanel's media prop:
 *
 *   <CaseStudyLayout project={p} renderDiagram={renderDiagram} />
 *   <WorkPanel project={p} index={1} media={renderDiagram(p.architecture)} />
 *
 * The text alternative always comes from the data (diagram.textAlternative).
 */
export function renderDiagram(diagram: CaseDiagram): ReactNode {
  const textAlternative = diagram.textAlternative;
  switch (diagram.diagramId) {
    case 'kubeadm-architecture':
      return <KubeadmArchitecture textAlternative={textAlternative} />;
    case 'kubeadm-pipeline':
      return <KubeadmPipeline textAlternative={textAlternative} />;
    case 'aws-architecture':
      return <AwsArchitecture textAlternative={textAlternative} />;
    case 'aws-pipeline':
      return <AwsPipeline textAlternative={textAlternative} />;
    default: {
      const unreachable: never = diagram.diagramId;
      throw new Error(`renderDiagram: unknown diagramId ${String(unreachable)}`);
    }
  }
}
