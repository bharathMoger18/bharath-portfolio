import type { StackItem } from '../../data/types.ts';
import { CATEGORY_LABEL, USED_IN_MARK, usedInText } from './stack.labels.ts';

export interface StackTileProps {
  item: StackItem;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}

/** One element tile: 2-letter symbol + name. A real button; aria-pressed marks the selection. */
export default function StackTile({ item, selected, dimmed, onSelect }: StackTileProps) {
  return (
    <button
      type="button"
      className="stack-tile"
      data-dimmed={dimmed ? 'true' : undefined}
      aria-pressed={selected}
      aria-controls="stack-detail"
      aria-label={`${item.name}, ${CATEGORY_LABEL[item.category]}. ${usedInText(item.usedIn)}.`}
      onClick={() => onSelect(item.id)}
      onFocus={() => onSelect(item.id)}
    >
      <span className="stack-tile__marks" aria-hidden="true">
        {item.usedIn.map((u) => (
          <span key={u}>{USED_IN_MARK[u]}</span>
        ))}
      </span>
      <span className="stack-tile__symbol" aria-hidden="true">
        {item.symbol}
      </span>
      <span className="stack-tile__name" aria-hidden="true">
        {item.name}
      </span>
    </button>
  );
}
