import { defineLab } from '../layout/lab.ts';
import { MOCK_PROJECT, MOCK_STATUSES } from './mock.ts';
import WorkPanel from './WorkPanel.tsx';

export default defineLab({
  id: 'work-panel',
  title: 'WorkPanel (A)',
  note: 'Three stacked panels, one per status kind. All text is TODO(D).',
  render: () => (
    <div style={{ padding: 'var(--space-5)' }}>
      {MOCK_STATUSES.map((status, i) => (
        <WorkPanel
          key={status.kind}
          index={i + 1}
          project={{ ...MOCK_PROJECT, slug: `todo-d-${status.kind}`, status }}
          media={
            i === 0 ? <p className="label">TODO(C): diagram slot (media prop)</p> : undefined
          }
        />
      ))}
    </div>
  ),
});
