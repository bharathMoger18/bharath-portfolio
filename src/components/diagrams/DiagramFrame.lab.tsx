import { defineLab } from '../layout/lab.ts';
import DiagramFrame from './DiagramFrame.tsx';

const TEXT = `This is the text alternative. It is always one click away under Read as text.

A second paragraph shows that blank lines split paragraphs.`;

export default defineLab({
  id: 'diagram-frame',
  title: 'DiagramFrame (C)',
  note: 'Title, caption, optional status, Read as text. The second frame uses the labeled sideways scroller, a last resort that no real diagram uses.',
  render: () => (
    <>
      <DiagramFrame
        title="Frame with a status line"
        caption="Caption text sits under the title."
        status="Completed deployment, infrastructure torn down"
        textAlternative={TEXT}
        visualLabel="Sample picture."
      >
        <p>Sample content.</p>
      </DiagramFrame>
      <DiagramFrame
        title="Frame with the scroll fallback"
        textAlternative={TEXT}
        scroll={{ minWidth: '56rem', label: 'Wide content: scroll sideways' }}
      >
        <p>Content wider than a phone screen, wrapped in a labeled, focusable scroll area.</p>
      </DiagramFrame>
    </>
  ),
});
