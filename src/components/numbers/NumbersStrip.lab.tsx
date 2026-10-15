import { defineLab } from '../layout/lab.ts';
import NumbersStrip from './NumbersStrip.tsx';
import { MOCK_NUMBERS } from './numbers.mock.ts';

export default defineLab({
  id: 'numbers-strip',
  title: 'NumbersStrip (B)',
  note: 'Four verified counts, each with a source caption. Captions are TODO(D) wording.',
  render: () => <NumbersStrip facts={MOCK_NUMBERS} />,
});
