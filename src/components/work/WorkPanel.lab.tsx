import { PROJECTS } from '../../data/projects.ts';
import { defineLab } from '../layout/lab.ts';
import WorkPanel from './WorkPanel.tsx';

export default defineLab({
  id: 'work-panel',
  title: 'WorkPanel (A)',
  note: 'The two real projects from data/projects.ts, stacked, without a diagram (the Work section on Home passes one through media).',
  render: () => (
    <div style={{ padding: 'var(--space-5)' }}>
      {PROJECTS.map((project, i) => (
        <WorkPanel key={project.slug} project={{ ...project, slug: `${project.slug}-panel-lab` }} index={i + 1} />
      ))}
    </div>
  ),
});
