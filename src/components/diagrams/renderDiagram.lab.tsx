import { DIAGRAMS } from '../../data/diagrams.ts';
import { AWS_PROJECT, KUBEADM_PROJECT } from '../../data/projects.ts';
import { defineLab } from '../layout/lab.ts';
import CaseStudyLayout from '../work/CaseStudyLayout.tsx';
import WorkPanel from '../work/WorkPanel.tsx';
import { renderDiagram } from './renderDiagram.tsx';

export default defineLab({
  id: 'render-diagram',
  title: 'renderDiagram (C)',
  note: "Integration check: the Lead's CaseStudyLayout (renderDiagram prop) and WorkPanel (media prop) with the real components and the real project data. Slugs are changed so ids stay unique on this page.",
  render: () => (
    <>
      <WorkPanel
        index={1}
        project={{ ...KUBEADM_PROJECT, slug: 'kubeadm-media-lab' }}
        media={renderDiagram(DIAGRAMS['kubeadm-pipeline'])}
      />
      <CaseStudyLayout
        headingLevel={2}
        renderDiagram={renderDiagram}
        project={{ ...AWS_PROJECT, slug: 'aws-lab' }}
      />
    </>
  ),
});
