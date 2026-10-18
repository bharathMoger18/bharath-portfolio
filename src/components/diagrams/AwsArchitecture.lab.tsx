import { defineLab } from '../layout/lab.ts';
import AwsArchitecture from './AwsArchitecture.tsx';
import { AWS_ARCHITECTURE_TEXT } from '../../data/diagrams.ts';
export default defineLab({
  id: 'aws-architecture',
  title: 'AwsArchitecture (C)',
  note: 'Status line reads Completed deployment, infrastructure torn down. ALB is HTTP only.',
  render: () => <AwsArchitecture textAlternative={AWS_ARCHITECTURE_TEXT} />,
});
