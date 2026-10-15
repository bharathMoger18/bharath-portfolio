export interface RequestPathProps {
  /** Real hops, outermost first (Browser ... PostgreSQL). */
  hops: string[];
  /** Accessible name, e.g. "Request path through the kubeadm cluster". */
  label: string;
}

/**
 * Typographic fallback for the portrait slot: a small numbered request-path
 * strip. An ordered list, so the order is announced, not just drawn.
 */
export default function RequestPath({ hops, label }: RequestPathProps) {
  return (
    <figure className="request-path">
      <figcaption className="label request-path__label">{label}</figcaption>
      <ol className="request-path__list" role="list">
        {hops.map((hop, i) => (
          <li key={hop} className="request-path__hop">
            <span className="request-path__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="request-path__name">{hop}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
