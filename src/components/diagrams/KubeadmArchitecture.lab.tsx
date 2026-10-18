import { defineLab } from '../layout/lab.ts';
import KubeadmArchitecture from './KubeadmArchitecture.tsx';
import { KUBEADM_ARCHITECTURE_TEXT } from '../../data/diagrams.ts';
export default defineLab({
  id: 'kubeadm-architecture',
  title: 'KubeadmArchitecture (C)',
  note: 'Verified against k8s-campuscart@774df40. Stacks below 1024px.',
  render: () => <KubeadmArchitecture textAlternative={KUBEADM_ARCHITECTURE_TEXT} />,
});
