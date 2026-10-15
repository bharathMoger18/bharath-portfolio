import { defineLab } from '../layout/lab.ts';
import Reveal from './Reveal.tsx';

export default defineLab({
  id: 'reveal',
  title: 'Reveal + useReveal (B)',
  note: 'Fade and rise on scroll. Visible with no JS, with reduced motion, and when already on screen.',
  render: () => (
    <div className="container" style={{ display: 'grid', gap: 'var(--space-5)', padding: 'var(--space-6) var(--gutter)' }}>
      {[0, 1, 2].map((i) => (
        <Reveal key={i} step={i}>
          <p
            style={{
              padding: 'var(--space-5)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Reveal block {i + 1}. Content is readable even if the animation never runs.
          </p>
        </Reveal>
      ))}
    </div>
  ),
});
