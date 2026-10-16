import type { ReactNode } from 'react';
import type { PipelineStage } from '../../data/types.ts';
import { ON_FAILURE_PREFIX } from './pipelineDefs.ts';
import './diagrams.css';

/*
 * Small drawing primitives shared by the diagrams.
 * Encoding (never colour alone):
 *   workload  solid border
 *   job       dashed border (runs to completion)
 *   external  double border (outside the thing being drawn)
 *   store     tinted fill + thick base (data store)
 *   planned   dotted border (not built)
 *   gate      dark fill (manual gate)
 */

export type NodeVariant = 'workload' | 'job' | 'external' | 'store' | 'planned' | 'gate';

export interface DgNodeProps {
  name: string;
  /** Short type label, e.g. "Deployment x2". Shown above the name. */
  kind?: string;
  /** Namespace or placement line, shown in mono under the name. */
  meta?: string;
  detail?: ReactNode;
  tags?: string[];
  variant?: NodeVariant;
}

export function DgNode({ name, kind, meta, detail, tags, variant = 'workload' }: DgNodeProps) {
  return (
    <div className={`dgn dgn--${variant}`}>
      {kind ? <span className="dgn__kind">{kind}</span> : null}
      <span className="dgn__name">{name}</span>
      {meta ? <span className="dgn__meta">{meta}</span> : null}
      {detail ? <span className="dgn__detail">{detail}</span> : null}
      {tags && tags.length > 0 ? (
        <ul className="dgn__tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export interface DgConnProps {
  /** Visible label on the arrow, e.g. "HTTPS :443". */
  label: string;
  dashed?: boolean;
}

/** Arrow with a visible text label. Points down when stacked, right in a wide row. */
export function DgConn({ label, dashed }: DgConnProps) {
  return (
    <div className={`dgc${dashed ? ' dgc--dashed' : ''}`}>
      <svg viewBox="0 0 28 28" aria-hidden="true" focusable="false">
        <path
          d="M3 14h20M16 7l7 7-7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/** Nodes and connectors in order. Row at 1024px and up; stacked below. */
export function DgFlow({ children, column }: { children: ReactNode; column?: boolean }) {
  return <div className={`dgf${column ? '' : ' dgf--row'}`}>{children}</div>;
}

export function DgGrid({ children }: { children: ReactNode }) {
  return <div className="dgg">{children}</div>;
}

export interface DgZoneProps {
  title: string;
  /** Short qualifier next to the title, e.g. "Kubernetes v1.30". */
  tag?: string;
  variant?: 'plain' | 'cluster' | 'outside' | 'inner';
  children: ReactNode;
}

export function DgZone({ title, tag, variant = 'plain', children }: DgZoneProps) {
  return (
    <div className={`dgz${variant === 'plain' ? '' : ` dgz--${variant}`}`}>
      <div className="dgz__head">
        <span className="dgz__title">{title}</span>
        {tag ? <span className="dgz__tag">{tag}</span> : null}
      </div>
      {children}
    </div>
  );
}

export interface LegendItem {
  variant: NodeVariant;
  label: string;
}

export function DgLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="dgl" aria-label="Legend">
      {items.map((item) => (
        <li key={item.variant}>
          <span className={`dgl__swatch dgl__swatch--${item.variant}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Pipelines                                                           */
/* ------------------------------------------------------------------ */

const KIND_TAG: Record<PipelineStage['kind'], string | null> = {
  standard: null,
  conditional: 'Conditional',
  approval: 'Manual gate',
};

/**
 * Numbered stage list. The number is always shown. Shape and label carry the kind:
 *   standard     round marker, solid card
 *   conditional  square marker, dashed card, "Conditional" tag and the condition in words
 *   approval     octagon marker, dark double-border card, "Manual gate" tag
 * Substeps that start with "On failure: " render as a dashed, tagged branch.
 */
export function StageTimeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <ol className="dgs">
      {stages.map((stage) => {
        const tag = KIND_TAG[stage.kind];
        return (
          <li key={stage.id} className={`dgs__item dgs__item--${stage.kind}`}>
            <span className="dgs__marker" aria-hidden="true">
              {stage.order}
            </span>
            <div className="dgs__card">
              <div className="dgs__top">
                <span className="dgs__label">
                  <span className="visually-hidden">Stage {stage.order}: </span>
                  {stage.label}
                </span>
                {tag ? <span className="dgs__tag">{tag}</span> : null}
              </div>
              {stage.detail ? <p className="dgs__detail">{stage.detail}</p> : null}
              {stage.conditionNote ? <p className="dgs__cond">{stage.conditionNote}</p> : null}
              {stage.substeps && stage.substeps.length > 0 ? (
                <ol className="dgs__sub">
                  {stage.substeps.map((sub) => {
                    const fail = sub.startsWith(ON_FAILURE_PREFIX);
                    return (
                      <li key={sub} className={fail ? 'dgs__sub--fail' : undefined}>
                        <span>
                          {fail ? <span className="dgs__fail-tag">On failure</span> : null}
                          {fail ? sub.slice(ON_FAILURE_PREFIX.length) : sub}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Plain text note listing what a pipeline does not have. Not a stage, not drawn as one. */
export function NotIncluded({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="dg__note">
      <span className="dg__note-key">Not in this pipeline</span>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
