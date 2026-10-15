import { defineLab } from '../layout/lab.ts';
import AwsPipeline from './AwsPipeline.tsx';
import { AWS_PIPELINE_TEXT } from './diagrams.mock.ts';
export default defineLab({
  id: 'aws-pipeline',
  title: 'AwsPipeline (C)',
  note: 'Nine stages. Stage 4 is the manual gate (octagon, dark card, label).',
  render: () => <AwsPipeline textAlternative={AWS_PIPELINE_TEXT} />,
});
