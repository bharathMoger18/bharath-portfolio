import { defineLab } from '../layout/lab.ts';
import { DgConn, DgFlow, DgGrid, DgLegend, DgNode, DgZone, NotIncluded, StageTimeline } from './DiagramParts.tsx';
import type { PipelineStage } from '../../data/types.ts';

const STAGES: PipelineStage[] = [
  { id: 'a', order: 1, label: 'Standard stage', kind: 'standard', detail: 'Round marker, solid card.' },
  {
    id: 'b',
    order: 2,
    label: 'Conditional stage',
    kind: 'conditional',
    detail: 'Square marker, dashed card.',
    conditionNote: 'Runs only when a condition holds.',
  },
  { id: 'c', order: 3, label: 'Manual gate', kind: 'approval', detail: 'Octagon marker, dark double-border card.' },
  {
    id: 'd',
    order: 4,
    label: 'Stage with substeps',
    kind: 'standard',
    substeps: ['A normal substep.', 'On failure: a branch that only runs on failure.'],
  },
];

export default defineLab({
  id: 'diagram-parts',
  title: 'DiagramParts (C)',
  note: 'Primitives: nodes, connectors, zones, legend, stage timeline. Sample labels only.',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
      <DgLegend
        items={[
          { variant: 'workload', label: 'workload' },
          { variant: 'job', label: 'job' },
          { variant: 'store', label: 'store' },
          { variant: 'external', label: 'external' },
          { variant: 'planned', label: 'planned' },
          { variant: 'gate', label: 'gate' },
        ]}
      />
      <DgZone title="Zone" tag="with a tag" variant="cluster">
        <DgFlow>
          <DgNode name="Node A" kind="Kind" meta="namespace x" detail="Detail text." tags={['tag one', 'tag two']} />
          <DgConn label="label" />
          <DgNode name="Node B" kind="Kind" variant="job" />
          <DgConn label="dashed" dashed />
          <DgNode name="Node C" kind="Kind" variant="store" />
        </DgFlow>
        <DgGrid>
          <DgNode name="External" variant="external" />
          <DgNode name="Planned" variant="planned" />
          <DgNode name="Gate" variant="gate" />
        </DgGrid>
      </DgZone>
      <StageTimeline stages={STAGES} />
      <NotIncluded items={['Sample missing thing']} />
    </div>
  ),
});
