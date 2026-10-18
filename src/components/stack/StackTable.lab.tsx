import { STACK } from '../../data/stack.ts';
import { defineLab } from '../layout/lab.ts';
import StackTable from './StackTable.tsx';

export default defineLab({
  id: 'stack-table',
  title: 'StackTable (B)',
  note: 'Real tiles from data/stack.ts. Tabs filter and dim. Click or focus a tile for the detail panel.',
  render: () => <StackTable items={STACK} />,
});
