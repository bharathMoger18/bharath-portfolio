import { defineLab } from '../layout/lab.ts';
import PipelineCompare from './PipelineCompare.tsx';
import { PIPELINE_COMPARE_TEXT } from '../../data/diagrams.ts';
export default defineLab({
  id: 'pipeline-compare',
  title: 'PipelineCompare (C)',
  note: 'Tabs: Left, Right, Home, End. Absent slots read not in this pipeline.',
  render: () => <PipelineCompare textAlternative={PIPELINE_COMPARE_TEXT} />,
});
