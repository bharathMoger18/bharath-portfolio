import { NUMBERS } from '../../data/numbers.ts';
import { defineLab } from '../layout/lab.ts';
import NumbersStrip from './NumbersStrip.tsx';

export default defineLab({
  id: 'numbers-strip',
  title: 'NumbersStrip (B)',
  note: 'Four verified counts from data/numbers.ts, each with a source caption.',
  render: () => <NumbersStrip facts={NUMBERS} />,
});
