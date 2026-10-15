import About from '../components/about/About.tsx';
import { MOCK_ABOUT } from '../components/about/about.mock.ts';
import Contact from '../components/contact/Contact.tsx';
import { MOCK_CONTACT } from '../components/contact/contact.mock.ts';
import Hero from '../components/hero/Hero.tsx';
import { MOCK_HERO } from '../components/hero/hero.mock.ts';
import Section from '../components/layout/Section.tsx';
import NumbersStrip from '../components/numbers/NumbersStrip.tsx';
import { MOCK_NUMBERS } from '../components/numbers/numbers.mock.ts';
import StackTable from '../components/stack/StackTable.tsx';
import { MOCK_STACK } from '../components/stack/stack.mock.ts';
import Seo from '../components/layout/Seo.tsx';
import { SITE_TITLE } from '../siteConfig.ts';

/*
 * Home composes the sections in playbook order. Until the real components land,
 * each section is a placeholder owned by the role named in its TODO.
 * Integration (replacing these placeholders) is Account A's job after G3.
 */
export default function Home() {
  return (
    <>
      <Seo title={SITE_TITLE} path="/" />
      {/* TODO(D): swap the mock props for src/data/site.ts (SiteMeta) and final copy. */}
      <Hero {...MOCK_HERO} />

      <About {...MOCK_ABOUT} />
      <StackTable items={MOCK_STACK} />
      <Section id="work" index={3} label="Work" heading={<>Things I&apos;ve <em>built</em>.</>}>
        <p>TODO(A, step 6): WorkPanel for each project.</p>
      </Section>
      <Section id="pipeline" index={4} label="Pipeline" tone="tint" heading={<>Two <em>pipelines</em>.</>}>
        <p>TODO(C): PipelineCompare.</p>
      </Section>
      <Section id="principles" index={5} label="Principles" heading={<>How I <em>work</em>.</>}>
        <p>TODO(D): principles copy.</p>
      </Section>
      <NumbersStrip facts={MOCK_NUMBERS} />
      <Section id="education" index={7} label="Education" heading={<>Education &amp; <em>experience</em>.</>}>
        <p>TODO(D): src/data/education.ts.</p>
      </Section>
      <Contact {...MOCK_CONTACT} />
    </>
  );
}
