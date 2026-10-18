import About from '../components/about/About.tsx';
import Contact from '../components/contact/Contact.tsx';
import PipelineCompare from '../components/diagrams/PipelineCompare.tsx';
import Hero from '../components/hero/Hero.tsx';
import Section from '../components/layout/Section.tsx';
import Seo from '../components/layout/Seo.tsx';
import NumbersStrip from '../components/numbers/NumbersStrip.tsx';
import EducationSection from '../components/sections/EducationSection.tsx';
import PrinciplesSection from '../components/sections/PrinciplesSection.tsx';
import StackTable from '../components/stack/StackTable.tsx';
import WorkPanel from '../components/work/WorkPanel.tsx';
import { ABOUT } from '../data/about.ts';
import { CONTACT } from '../data/contact.ts';
import { PIPELINE_COMPARE_TEXT } from '../data/diagrams.ts';
import { EDUCATION } from '../data/education.ts';
import { HERO } from '../data/hero.ts';
import { NUMBERS } from '../data/numbers.ts';
import { PRINCIPLES } from '../data/principles.ts';
import { PROJECTS } from '../data/projects.ts';
import { SITE } from '../data/site.ts';
import { STACK } from '../data/stack.ts';

/** Home: sections in playbook order, all from src/data. Hero owns the page's single h1. */
export default function Home() {
  return (
    <>
      <Seo title={SITE.title} path="/" />
      <Hero {...HERO} />
      <About {...ABOUT} />
      <StackTable items={STACK} />

      <Section id="work" index={3} label="Work" heading={<>Things I&apos;ve <em>built</em>.</>}>
        {PROJECTS.map((project, i) => (
          <WorkPanel key={project.slug} project={project} index={i + 1} />
        ))}
      </Section>

      <Section id="pipeline" index={4} label="Pipeline" tone="tint" heading={<>Two <em>pipelines</em>, compared.</>}>
        <PipelineCompare textAlternative={PIPELINE_COMPARE_TEXT} />
      </Section>

      <PrinciplesSection items={PRINCIPLES} />
      <NumbersStrip facts={NUMBERS} />
      <EducationSection items={EDUCATION} />
      <Contact {...CONTACT} />
    </>
  );
}
