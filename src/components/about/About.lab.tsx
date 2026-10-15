import { defineLab } from '../layout/lab.ts';
import About from './About.tsx';
import { MOCK_ABOUT } from './about.mock.ts';

export default defineLab({
  id: 'about',
  title: 'About + EngineerBadge (B)',
  note: 'Copy is TODO(D). Badge facts are from the resume. QR encodes the site URL.',
  render: () => <About {...MOCK_ABOUT} />,
});
