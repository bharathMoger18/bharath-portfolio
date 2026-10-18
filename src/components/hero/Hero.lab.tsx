import { HERO } from '../../data/hero.ts';
import { defineLab } from '../layout/lab.ts';
import Hero from './Hero.tsx';

export default defineLab({
  id: 'hero',
  title: 'Hero (B)',
  note: 'Real copy from data/hero.ts. Typographic fallback with request-path strip; portrait appears only if public/portrait.webp exists. Lab renders it as h2 because /lab has its own h1.',
  render: () => <Hero {...HERO} headingLevel="h2" />,
});
