import { defineLab } from '../layout/lab.ts';
import CaseStudyLayout from './CaseStudyLayout.tsx';
import { MOCK_PROJECT } from './mock.ts';

export default defineLab({
  id: 'case-study-layout',
  title: 'CaseStudyLayout (A)',
  note: 'The 8-part template with placeholder data, embedded at heading level 2.',
  render: () => <CaseStudyLayout project={MOCK_PROJECT} headingLevel={2} />,
});
