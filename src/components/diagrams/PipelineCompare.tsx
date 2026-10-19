import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Pipeline, PipelineId, RailStage } from '../../data/types.ts';
import { RAIL_ORDER } from '../../data/types.ts';
import DiagramFrame from './DiagramFrame.tsx';
import { NotIncluded } from './DiagramParts.tsx';
import { PIPELINES, RAIL_HINTS, RAIL_LABELS, RAIL_NOTES } from './pipelineDefs.ts';

export interface PipelineCompareProps {
  /** Plain text version, from the data. */
  textAlternative: string;
  /** Defaults to the verified kubeadm and AWS definitions. Order sets the tab order. */
  pipelines?: Pipeline[];
  /** Cell notes, keyed by pipeline then rail stage. Defaults to the verified wording. */
  railNotes?: Partial<Record<PipelineId, Partial<Record<RailStage, string>>>>;
  /** Tab shown first. Defaults to the first pipeline. */
  initial?: PipelineId;
  title?: string;
  caption?: string;
}

const TAB_LABEL: Record<PipelineId, string> = { kubeadm: 'kubeadm', aws: 'AWS' };

/**
 * Two pipelines on one common rail (Source, Pipeline, Test, Scan, Build,
 * Registry, Migrate, Deploy, Verify), never merged. Slots a pipeline does not
 * have read "not in this pipeline".
 * Tabs follow the WAI-ARIA tabs pattern: roving tabindex, Left/Right/Home/End,
 * aria-selected, aria-controls. Selection follows focus.
 */
export default function PipelineCompare({
  textAlternative,
  pipelines = PIPELINES,
  railNotes = RAIL_NOTES,
  initial,
  title = 'The kubeadm pipeline and the AWS pipeline as deployed, on one rail',
  caption = 'Pick a tab. Slots that a pipeline does not have say so. The AWS tab shows the pipeline as deployed (commit 774df40).',
}: PipelineCompareProps) {
  const uid = useId();
  const first = pipelines[0]?.id;
  const [active, setActive] = useState<PipelineId | undefined>(initial ?? first);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const current = pipelines.find((p) => p.id === active) ?? pipelines[0];
  if (!current) return null;

  const select = (id: PipelineId, focus: boolean) => {
    setActive(id);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = pipelines.length - 1;
    let next: number;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;
    event.preventDefault();
    const target = pipelines[next];
    if (target) select(target.id, true);
  };

  const stageById = new Map(current.stages.map((s) => [s.id, s]));
  const notes = railNotes[current.id] ?? {};
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  return (
    <DiagramFrame title={title} caption={caption} textAlternative={textAlternative}>
      <div className="dgt" role="tablist" aria-label="Pipeline">
        {pipelines.map((p, i) => {
          const selected = p.id === current.id;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabRefs.current[p.id] = el;
              }}
              id={tabId(p.id)}
              type="button"
              role="tab"
              className="dgt__tab"
              aria-selected={selected}
              aria-controls={panelId(p.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(p.id, false)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {TAB_LABEL[p.id]}
            </button>
          );
        })}
      </div>

      <div
        id={panelId(current.id)}
        className="dgt__panel"
        role="tabpanel"
        aria-labelledby={tabId(current.id)}
        tabIndex={0}
      >
        <p className="dgt__lead">
          {current.title} · {current.stages.length} stages · from {current.source}
        </p>
        <ol className="dgr">
          {RAIL_ORDER.map((slot, i) => {
            const cell = current.rail[slot];
            const note = notes[slot];
            return (
              <li key={slot} className={`dgr__cell${cell.present ? '' : ' dgr__cell--absent'}`}>
                <span className="dgr__pos">
                  {i + 1} of {RAIL_ORDER.length}
                </span>
                <span className="dgr__slot">{RAIL_LABELS[slot]}</span>
                <span className="dgr__hint">{RAIL_HINTS[slot]}</span>
                {cell.present ? (
                  <>
                    <ul className="dgr__stages">
                      {cell.stageIds.map((id) => {
                        const stage = stageById.get(id);
                        return (
                          <li key={id}>
                            <span>{stage ? `${stage.order}. ` : ''}</span>
                            {stage ? stage.label : id}
                            {stage && stage.kind !== 'standard'
                              ? ` (${stage.kind === 'approval' ? 'manual gate' : 'conditional'})`
                              : null}
                          </li>
                        );
                      })}
                    </ul>
                    {note ? <span className="dgr__note">{note}</span> : null}
                  </>
                ) : (
                  <span className="dgr__absent">not in this pipeline</span>
                )}
              </li>
            );
          })}
        </ol>
        {current.notIncluded ? <NotIncluded items={current.notIncluded} /> : null}
      </div>
    </DiagramFrame>
  );
}
