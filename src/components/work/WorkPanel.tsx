import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../data/types.ts';
import StatusBadge from './StatusBadge.tsx';
import './WorkPanel.css';

export interface WorkPanelProps {
  project: Project;
  /** 1-based, shown as "Project 01". */
  index: number;
  /**
   * Optional full-width slot under the text. The diagram components follow the
   * viewport width, not their container's, so give them the full panel width only.
   */
  media?: ReactNode;
}

/** Home summary of one project. Panels are stacked by the caller, not a carousel. */
export default function WorkPanel({ project, index, media }: WorkPanelProps) {
  const titleId = `work-${project.slug}-title`;
  return (
    <article className="work-panel" aria-labelledby={titleId}>
      <div className="work-panel__side">
        <p className="label">Project {String(index).padStart(2, '0')}</p>
        <StatusBadge status={project.status} />
      </div>

      <h3 id={titleId} className="work-panel__title">
        {project.title}
      </h3>

      <div className="work-panel__body">
        <p className="work-panel__summary">{project.summary}</p>

        {project.tags.length > 0 ? (
          <ul role="list" className="work-panel__tags">
            {project.tags.map((tag) => (
              <li key={tag} className="label">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <Link className="work-panel__link" to={`/work/${project.slug}`}>
          Read the case study
          <span className="visually-hidden">: {project.title}</span>
        </Link>
      </div>

      {media ? <div className="work-panel__media">{media}</div> : null}
    </article>
  );
}
