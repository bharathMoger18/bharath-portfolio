import Section from '../components/layout/Section.tsx';
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
      {/* TODO(B): replace with <Hero />. Hero owns the page's single h1. */}
      <section className="container page">
        <p className="label">Foundation</p>
        <h1>
          Placeholder <em>home</em>.
        </h1>
      </section>

      <Section id="about" index={1} label="About" heading={<>Hi, I&apos;m <em>Bharath</em>.</>}>
        <p>TODO(B): About and EngineerBadge. TODO(D): copy.</p>
      </Section>
      <Section id="stack" index={2} label="Stack" tone="tint" heading={<>The tools I <em>use</em>.</>}>
        <p>TODO(B): StackTable. TODO(D): src/data/stack.ts.</p>
      </Section>
      <Section id="work" index={3} label="Work" heading={<>Things I&apos;ve <em>built</em>.</>}>
        <p>TODO(A, step 6): WorkPanel for each project.</p>
      </Section>
      <Section id="pipeline" index={4} label="Pipeline" tone="tint" heading={<>Two <em>pipelines</em>.</>}>
        <p>TODO(C): PipelineCompare.</p>
      </Section>
      <Section id="principles" index={5} label="Principles" heading={<>How I <em>work</em>.</>}>
        <p>TODO(D): principles copy.</p>
      </Section>
      <Section id="numbers" index={6} label="Numbers" tone="tint" heading={<>The system in <em>numbers</em>.</>}>
        <p>TODO(B): NumbersStrip. TODO(D): src/data/numbers.ts.</p>
      </Section>
      <Section id="education" index={7} label="Education" heading={<>Education &amp; <em>experience</em>.</>}>
        <p>TODO(D): src/data/education.ts.</p>
      </Section>
      <Section id="contact" index={8} label="Contact" tone="dark" heading={<>Let&apos;s <em>talk</em>.</>}>
        <p>TODO(B): Contact.</p>
      </Section>
    </>
  );
}
