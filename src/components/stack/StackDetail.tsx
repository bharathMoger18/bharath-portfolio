import type { StackItem } from '../../data/types.ts';
import { CATEGORY_LABEL, USED_IN_LABEL } from './stack.labels.ts';

export interface StackDetailProps {
  item: StackItem | null;
}

/**
 * Where a tool was used, one factual sentence, evidence links.
 * Not a live region: focusing tiles with the keyboard changes it often, and
 * the plain list below the table carries the same information for screen readers.
 */
export default function StackDetail({ item }: StackDetailProps) {
  return (
    <div id="stack-detail" className="stack-detail">
      {item ? (
        <>
          <p className="label">{CATEGORY_LABEL[item.category]}</p>
          <h3 className="stack-detail__title">
            <span className="stack-detail__symbol" aria-hidden="true">
              {item.symbol}
            </span>
            {item.name}
          </h3>
          <ul role="list" className="stack-detail__used">
            {item.usedIn.map((u) => (
              <li key={u}>{USED_IN_LABEL[u]}</li>
            ))}
          </ul>
          <p className="stack-detail__note">{item.note}</p>
          {item.evidence.length > 0 ? (
            <ul role="list" className="stack-detail__evidence" aria-label="Evidence">
              {item.evidence.map((e) => (
                <li key={e.url}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer">
                    {e.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                  <span className="stack-detail__commit">
                    {e.path}
                    {e.lines ? `:${e.lines}` : ''} @ {e.commit}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="stack-detail__empty">Select a tile to see where I used it.</p>
      )}
    </div>
  );
}
