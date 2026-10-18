import { ABOUT } from '../../data/about.ts';
import { defineLab } from '../layout/lab.ts';
import About from './About.tsx';

export default defineLab({
  id: 'about',
  title: 'About + EngineerBadge (B)',
  note: 'Real copy from data/about.ts. Badge facts are from the resume. QR encodes the site URL.',
  render: () => <About {...ABOUT} />,
});
