import type { ProjectStatus } from '../../data/types.ts';
import './StatusBadge.css';

export interface StatusBadgeProps {
  status: ProjectStatus;
}

/**
 * Honest status. The visible label is the signal; the shape beside it
 * (dot, ring, square) differs per kind so color is never the only cue.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <p className={`status status--${status.kind}`}>
      <span className="status__mark" aria-hidden="true" />
      <span className="visually-hidden">Status: </span>
      {status.label}
    </p>
  );
}
