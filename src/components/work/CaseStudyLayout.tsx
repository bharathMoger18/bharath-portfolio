import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CaseDiagram, EvidenceLink, Project } from '../../data/types.ts';
import DiagramPlaceholder from './DiagramPlaceholder.tsx';
import StatusBadge from './StatusBadge.tsx';
import './CaseStudyLayout.css';

export interface CaseStudyLayoutProps {
  project: Project;
  /** Page heading. Wrap one word in <em>. Falls back to project.title. */
  heading?: ReactNode;
  /** 1 on a case-study page; 2 when embedded under another h1 (e.g. /lab). */
  headingLevel?: 1 | 2;
  /** Maps a diagram to Account C's component. Defaults to a text-only placeholder. */
  renderDiagram?: (diagram: CaseDiagram) => ReactNode;
}

function EvidenceLinks({ items }: { items: EvidenceLink[] }) {
  return (
    <ul role="list" className="case__evidence">
      {items.map((item) => (
        <li key={`${item.path}:${item.lines ?? ''}:${item.label}`}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.label}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <code className="case__evidence-ref">
            {item.path}
            {item.lines ? `:${item.lines}` : ''} @ {item.commit}
          </code>
        </li>
      ))}
    </ul>
  );
}

/**
 * The 8-part case-study template (PLAYBOOK section 4):
 * 1 status, 2 overview, 3 architecture, 4 pipeline, 5 decisions,
 * 6 security and operations, 7 what I would improve next, 8 evidence.
 * Parts whose list is empty are omitted (never shown as empty headings).
 */
export default function CaseStudyLayout({
  project,
  heading,
  headingLevel = 1,
  renderDiagram,
}: CaseStudyLayoutProps) {
  const Title = headingLevel === 1 ? 'h1' : 'h2';
  const Sub = headingLevel === 1 ? 'h2' : 'h3';
  const Item = headingLevel === 1 ? 'h3' : 'h4';
  const id = (part: string) => `${project.slug}-${part}`;
  const diagram = (d: CaseDiagram) => (renderDiagram ? renderDiagram(d) : <DiagramPlaceholder diagram={d} />);

  const parts: { key: string; num: number; label: string; show: boolean }[] = [
    { key: 'overview', num: 2, label: 'Overview', show: project.overview.length > 0 },
    { key: 'architecture', num: 3, label: 'Architecture', show: true },
    { key: 'pipeline', num: 4, label: 'Pipeline', show: true },
    { key: 'decisions', num: 5, label: 'Decisions', show: project.decisions.length > 0 },
    { key: 'security', num: 6, label: 'Security and operations', show: project.securityAndOps.length > 0 },
    { key: 'next', num: 7, label: 'Next', show: project.nextImprovements.length > 0 },
    { key: 'evidence', num: 8, label: 'Evidence', show: project.evidence.length > 0 },
  ];
  const shown = parts.filter((p) => p.show);
  const num = (n: number) => String(n).padStart(2, '0');

  return (
    <article className="case" aria-labelledby={id('title')}>
      <header className="container case__header">
        <Link className="case__back" to={{ pathname: '/', hash: '#work' }}>
          <span aria-hidden="true">&larr; </span>All work
        </Link>
        <p className="label">Case study</p>
        <Title id={id('title')} className="case__title">
          {heading ?? project.title}
        </Title>
        <p className="case__summary">{project.summary}</p>

        {/* Part 1: status line */}
        <div className="case__status">
          <p className="label">{num(1)} / Status</p>
          <StatusBadge status={project.status} />
          {project.status.kind === 'live' && project.liveUrl ? (
            <a className="case__live" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit the running site
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>

        {project.tags.length > 0 ? (
          <ul role="list" className="case__tags">
            {project.tags.map((tag) => (
              <li key={tag} className="label">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <nav aria-label="On this page" className="case__toc">
          <ul role="list">
            {shown.map((p) => (
              <li key={p.key}>
                <a href={`#${id(p.key)}`}>{p.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {parts[0]?.show ? (
        <section id={id('overview')} className="container case__section" aria-labelledby={id('overview-h')}>
          <p className="label">{num(2)} / Overview</p>
          <Sub id={id('overview-h')} className="case__h">
            Overview and <em>goal</em>
          </Sub>
          <div className="case__text">
            {project.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      <section id={id('architecture')} className="container case__section" aria-labelledby={id('architecture-h')}>
        <p className="label">{num(3)} / Architecture</p>
        <Sub id={id('architecture-h')} className="case__h">
          <em>Architecture</em>
        </Sub>
        {diagram(project.architecture)}
      </section>

      <section id={id('pipeline')} className="container case__section" aria-labelledby={id('pipeline-h')}>
        <p className="label">{num(4)} / Pipeline</p>
        <Sub id={id('pipeline-h')} className="case__h">
          The <em>pipeline</em>
        </Sub>
        {diagram(project.pipeline)}
      </section>

      {parts[3]?.show ? (
        <section id={id('decisions')} className="container case__section" aria-labelledby={id('decisions-h')}>
          <p className="label">{num(5)} / Decisions</p>
          <Sub id={id('decisions-h')} className="case__h">
            Key <em>decisions</em>
          </Sub>
          <ul role="list" className="case__decisions">
            {project.decisions.map((d) => (
              <li key={d.title}>
                <Item className="case__item">{d.title}</Item>
                <p>{d.why}</p>
                {d.evidence && d.evidence.length > 0 ? <EvidenceLinks items={d.evidence} /> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {parts[4]?.show ? (
        <section id={id('security')} className="container case__section" aria-labelledby={id('security-h')}>
          <p className="label">{num(6)} / Security and operations</p>
          <Sub id={id('security-h')} className="case__h">
            Security and <em>operations</em>
          </Sub>
          <ul className="case__list case__text">
            {project.securityAndOps.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {parts[5]?.show ? (
        <section id={id('next')} className="container case__section" aria-labelledby={id('next-h')}>
          <p className="label">{num(7)} / Next</p>
          <Sub id={id('next-h')} className="case__h">
            What I would improve <em>next</em>
          </Sub>
          <ul className="case__list case__text">
            {project.nextImprovements.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {parts[6]?.show ? (
        <section id={id('evidence')} className="container case__section" aria-labelledby={id('evidence-h')}>
          <p className="label">{num(8)} / Evidence</p>
          <Sub id={id('evidence-h')} className="case__h">
            <em>Evidence</em>
          </Sub>
          <EvidenceLinks items={project.evidence} />
        </section>
      ) : null}
    </article>
  );
}
