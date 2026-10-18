import { CONTACT } from '../../data/contact.ts';
import { defineLab } from '../layout/lab.ts';
import Contact from './Contact.tsx';

export default defineLab({
  id: 'contact',
  title: 'Contact (B)',
  note: 'Dark charcoal, one email button, three links, no form, no phone number.',
  render: () => <Contact {...CONTACT} />,
});
