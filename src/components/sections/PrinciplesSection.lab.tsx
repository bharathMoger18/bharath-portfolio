import { PRINCIPLES } from '../../data/principles.ts';
import { defineLab } from '../layout/lab.ts';
import PrinciplesSection from './PrinciplesSection.tsx';

export default defineLab({
  id: 'principles-section',
  title: 'PrinciplesSection (A)',
  note: 'Real entries from data/principles.ts, each with its evidence links.',
  render: () => <PrinciplesSection items={PRINCIPLES} />,
});
