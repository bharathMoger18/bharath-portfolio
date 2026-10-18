import { defineLab } from '../layout/lab.ts';
import StatusBadge from './StatusBadge.tsx';

export default defineLab({
  id: 'status-badge',
  title: 'StatusBadge (A)',
  note: 'The three status kinds. Labels here are lab-only; the real labels live in data/projects.ts. Shape differs per kind, so color is never the only cue.',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
      <StatusBadge status={{ kind: 'live', label: 'Live variant (lab only)' }} />
      <StatusBadge status={{ kind: 'pending-confirmation', label: 'Pending variant (lab only)' }} />
      <StatusBadge status={{ kind: 'completed-torn-down', label: 'Completed variant (lab only)' }} />
    </div>
  ),
});
