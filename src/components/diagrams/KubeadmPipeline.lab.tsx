import { defineLab } from '../layout/lab.ts';
import KubeadmPipeline from './KubeadmPipeline.tsx';
import { KUBEADM_PIPELINE_TEXT } from './diagrams.mock.ts';
export default defineLab({
  id: 'kubeadm-pipeline',
  title: 'KubeadmPipeline (C)',
  note: 'Five stages. Test, Scan and Build are conditional. Deploy is expanded.',
  render: () => <KubeadmPipeline textAlternative={KUBEADM_PIPELINE_TEXT} />,
});
