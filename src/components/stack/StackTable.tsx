import { useState } from 'react';
import type { ReactNode } from 'react';
import type { StackCategory, StackItem } from '../../data/types.ts';
import Section from '../layout/Section.tsx';
import StackDetail from './StackDetail.tsx';
import StackTile from './StackTile.tsx';
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  USED_IN_LABEL,
  USED_IN_MARK,
  usedInText,
} from './stack.labels.ts';
import './StackTable.css';

export interface StackTableProps {
  items: StackItem[];
  /** Section number shown as "02". Default 2. */
  index?: number;
  /** Defaults to "The tools I <em>use</em>." */
  heading?: ReactNode;
}

type Filter = 'all' | StackCategory;

/**
 * Periodic-table style tile grid. Category tabs filter and dim tiles.
 * No percentages, no skill levels. Tiles are buttons with aria-pressed.
 */
export default function StackTable({ items, index = 2, heading }: StackTableProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...CATEGORY_ORDER.map((c) => ({ id: c as Filter, label: CATEGORY_LABEL[c] })),
  ];

  return (
    <Section
      id="stack"
      index={index}
      label="Stack"
      tone="tint"
      heading={
        heading ?? (
          <>
            The tools I <em>use</em>.
          </>
        )
      }
    >
      <div className="stack">
        <div className="stack__filters" role="group" aria-label="Filter tools by category">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="stack__filter"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="stack__legend">
          {(['kubeadm', 'aws', 'learning'] as const).map((u) => (
            <span key={u}>
              <span className="stack__legend-mark" aria-hidden="true">
                {USED_IN_MARK[u]}
              </span>{' '}
              {USED_IN_LABEL[u]}
            </span>
          ))}
        </p>

        <div className="stack__layout">
          <ul role="list" className="stack__grid" aria-label="Tools">
            {items.map((item) => (
              <li key={item.id}>
                <StackTile
                  item={item}
                  selected={item.id === selectedId}
                  dimmed={filter !== 'all' && item.category !== filter}
                  onSelect={setSelectedId}
                />
              </li>
            ))}
          </ul>
          <StackDetail item={selected} />
        </div>

        <details className="stack__list">
          <summary>Read the stack as a plain list</summary>
          {CATEGORY_ORDER.map((c) => {
            const group = items.filter((i) => i.category === c);
            if (group.length === 0) return null;
            return (
              <section key={c} aria-label={CATEGORY_LABEL[c]}>
                <h3 className="stack__list-heading">{CATEGORY_LABEL[c]}</h3>
                <ul>
                  {group.map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>. {usedInText(item.usedIn)}. {item.note}
                      {item.evidence.map((e) => (
                        <span key={e.url}>
                          {' '}
                          <a href={e.url} target="_blank" rel="noopener noreferrer">
                            {e.label}
                            <span className="visually-hidden"> (opens in a new tab)</span>
                          </a>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </details>
      </div>
    </Section>
  );
}
