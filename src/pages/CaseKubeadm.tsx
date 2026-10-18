import { renderDiagram } from '../components/diagrams/renderDiagram.tsx';
import Seo from '../components/layout/Seo.tsx';
import CaseStudyLayout from '../components/work/CaseStudyLayout.tsx';
import { GRAFANA_NAMESPACE_CAPTION, GRAFANA_NAMESPACE_SHOT } from '../data/evidence.ts';
import { KUBEADM_PROJECT } from '../data/projects.ts';
import { SITE } from '../data/site.ts';

/** Size of public/evidence/grafana-namespace-pods.png, so the page reserves its space. */
const SHOT_WIDTH = 2904;
const SHOT_HEIGHT = 996;

export default function CaseKubeadm() {
  return (
    <>
      <Seo
        title={`${KUBEADM_PROJECT.title} | ${SITE.name}`}
        description={KUBEADM_PROJECT.summary}
        path="/work/kubeadm"
      />
      <CaseStudyLayout
        project={KUBEADM_PROJECT}
        renderDiagram={renderDiagram}
        figure={{
          src: GRAFANA_NAMESPACE_SHOT.url,
          alt: 'Grafana dashboard for the k8s-campuscart namespace: utilisation panels and a CPU usage graph for the nginx, postgres, redis and web pods.',
          caption: GRAFANA_NAMESPACE_CAPTION,
          width: SHOT_WIDTH,
          height: SHOT_HEIGHT,
        }}
      />
    </>
  );
}
