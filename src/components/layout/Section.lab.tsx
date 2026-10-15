import { defineLab } from './lab.ts';
import Section from './Section.tsx';

export default defineLab({
  id: 'section',
  title: 'Section (A)',
  note: 'Three tones. The heading uses one italic word.',
  render: () => (
    <div>
      <Section id="lab-sec-default" index={1} label="Default" heading={<>Plain <em>section</em>.</>}>
        <p>Body content goes here.</p>
      </Section>
      <Section id="lab-sec-tint" index={2} label="Tint" tone="tint" heading={<>Tinted <em>section</em>.</>}>
        <p>Body content goes here.</p>
      </Section>
      <Section id="lab-sec-dark" index={3} label="Dark" tone="dark" heading={<>Dark <em>section</em>.</>}>
        <p>Body content goes here.</p>
      </Section>
    </div>
  ),
});
