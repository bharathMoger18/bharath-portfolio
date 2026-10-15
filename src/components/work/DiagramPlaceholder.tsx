import type { CaseDiagram } from '../../data/types.ts';

/**
 * Default diagram slot until Account C's components are wired in.
 * The text alternative is real content, so the section is useful without a diagram.
 */
export default function DiagramPlaceholder({ diagram }: { diagram: CaseDiagram }) {
  return (
    <figure className="case__figure">
      <div className="case__diagram-box">
        <p className="label">TODO(C): diagram renders here</p>
        <p className="label">{diagram.diagramId}</p>
      </div>
      <figcaption className="case__alt">
        <span className="label">Read as text</span>
        <span>{diagram.textAlternative}</span>
      </figcaption>
    </figure>
  );
}
