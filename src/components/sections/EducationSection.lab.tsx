import { EDUCATION } from '../../data/education.ts';
import { defineLab } from '../layout/lab.ts';
import EducationSection from './EducationSection.tsx';

export default defineLab({
  id: 'education-section',
  title: 'EducationSection (A)',
  note: 'Real entries from data/education.ts, newest first.',
  render: () => <EducationSection items={EDUCATION} />,
});
