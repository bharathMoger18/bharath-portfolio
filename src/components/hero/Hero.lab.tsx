import { defineLab } from '../layout/lab.ts';
import Hero from './Hero.tsx';
import { MOCK_HERO } from './hero.mock.ts';

export default defineLab({
  id: 'hero',
  title: 'Hero (B)',
  note: 'Mock copy (TODO(D)). Typographic fallback with request-path strip; portrait appears only if public/portrait.webp exists. Lab renders it as h2 because /lab has its own h1.',
  render: () => <Hero {...MOCK_HERO} headingLevel="h2" />,
});
