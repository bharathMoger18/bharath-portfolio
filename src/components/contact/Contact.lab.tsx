import { defineLab } from '../layout/lab.ts';
import Contact from './Contact.tsx';
import { MOCK_CONTACT } from './contact.mock.ts';

export default defineLab({
  id: 'contact',
  title: 'Contact (B)',
  note: 'Dark charcoal, one email button, three links, no form, no phone number.',
  render: () => <Contact {...MOCK_CONTACT} />,
});
