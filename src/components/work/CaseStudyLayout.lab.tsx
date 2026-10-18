import { renderDiagram } from '../diagrams/renderDiagram.tsx';
import { GRAFANA_NAMESPACE_CAPTION, GRAFANA_NAMESPACE_SHOT } from '../../data/evidence.ts';
import { KUBEADM_PROJECT } from '../../data/projects.ts';
import { defineLab } from '../layout/lab.ts';
import CaseStudyLayout from './CaseStudyLayout.tsx';

export default defineLab({
  id: 'case-study-layout',
  title: 'CaseStudyLayout (A)',
  note: 'The 8-part template with the real kubeadm case study and its screenshot, embedded at heading level 2.',
  render: () => (
    <CaseStudyLayout
      project={{ ...KUBEADM_PROJECT, slug: 'kubeadm-layout-lab' }}
      headingLevel={2}
      renderDiagram={renderDiagram}
      figure={{
        src: GRAFANA_NAMESPACE_SHOT.url,
        alt: 'Grafana dashboard for the k8s-campuscart namespace: utilisation panels and a CPU usage graph for the nginx, postgres, redis and web pods.',
        caption: GRAFANA_NAMESPACE_CAPTION,
        width: 2904,
        height: 996,
      }}
    />
  ),
});
