import { defineLab } from '../layout/lab.ts';
import EngineerBadge from './EngineerBadge.tsx';
import { MOCK_BADGE } from './about.mock.ts';

export default defineLab({
  id: 'engineer-badge',
  title: 'EngineerBadge (B)',
  note: 'Gentle CSS sway; off under prefers-reduced-motion. No ID number, no barcode.',
  render: () => (
    <div className="container" style={{ padding: 'var(--space-6) var(--gutter)' }}>
      <EngineerBadge {...MOCK_BADGE} />
    </div>
  ),
});
