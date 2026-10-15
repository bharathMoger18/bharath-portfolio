import { defineLab } from '../layout/lab.ts';
import StackTable from './StackTable.tsx';
import { MOCK_STACK } from './stack.mock.ts';

export default defineLab({
  id: 'stack-table',
  title: 'StackTable (B)',
  note: 'Mock tiles (TODO(D) notes). Tabs filter and dim. Click or focus a tile for the detail panel.',
  render: () => <StackTable items={MOCK_STACK} />,
});
