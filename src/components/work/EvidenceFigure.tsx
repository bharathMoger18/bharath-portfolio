import './EvidenceFigure.css';

export interface EvidenceFigureProps {
  /** Site-relative path, e.g. "/evidence/grafana-namespace-pods.png". */
  src: string;
  /** What the picture shows, for people who cannot see it. */
  alt: string;
  /** Visible caption. Pass the approved wording unchanged. */
  caption: string;
  /** Intrinsic pixel size, so the browser reserves space before it loads. */
  width: number;
  height: number;
}

/**
 * A screenshot with its caption. The picture links to the full-size file because
 * a wide dashboard is small on a phone.
 */
export default function EvidenceFigure({ src, alt, caption, width, height }: EvidenceFigureProps) {
  return (
    <figure className="evidence-figure">
      <a className="evidence-figure__link" href={src} target="_blank" rel="noopener noreferrer">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        <span className="visually-hidden"> (opens full size in a new tab)</span>
      </a>
      <figcaption className="evidence-figure__caption">{caption}</figcaption>
    </figure>
  );
}
