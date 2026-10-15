import { defineLab } from '../layout/lab.ts';
import CaseStudyLayout from '../work/CaseStudyLayout.tsx';
import WorkPanel from '../work/WorkPanel.tsx';
import { MOCK_PROJECT } from '../work/mock.ts';
import { DIAGRAM_MOCKS } from './diagrams.mock.ts';
import { renderDiagram } from './renderDiagram.tsx';

export default defineLab({
  id: 'render-diagram',
  title: 'renderDiagram (C)',
  note: 'Integration check: the Lead\'s CaseStudyLayout (renderDiagram prop) and WorkPanel (media prop) with the real components. Project copy is still TODO(D).',
  render: () => (
    <>
      <WorkPanel
        index={1}
        project={MOCK_PROJECT}
        media={renderDiagram(DIAGRAM_MOCKS['kubeadm-pipeline'])}
      />
      <CaseStudyLayout
        headingLevel={2}
        renderDiagram={renderDiagram}
        project={{
          ...MOCK_PROJECT,
          slug: 'aws-lab',
          architecture: DIAGRAM_MOCKS['aws-architecture'],
          pipeline: DIAGRAM_MOCKS['aws-pipeline'],
        }}
      />
    </>
  ),
});
