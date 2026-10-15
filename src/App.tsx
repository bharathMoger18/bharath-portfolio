import { Route, Routes } from 'react-router-dom';
import Section from './components/layout/Section.tsx';
import SiteLayout from './components/layout/SiteLayout.tsx';
import type { SiteLayoutProps } from './components/layout/SiteLayout.tsx';

/*
 * TEMPORARY wiring for Brief A step 4. Step 5 replaces this with real routes
 * (pages/*), and Account D's src/data/site.ts replaces these constants.
 */

// TODO(D): replace with src/data/site.ts (SiteMeta). Email and LinkedIn are unknown, so omitted.
const OWNER = 'Bharath Moger';
const GITHUB_URL = 'https://github.com/bharathMoger18';
const RESUME_PDF = '/Bharath_Moger_DevOps_Resume.pdf';

const layout: SiteLayoutProps = {
  header: {
    monogram: 'B',
    ownerName: OWNER,
    nav: [
      { id: 'about', label: 'About' },
      { id: 'stack', label: 'Stack' },
      { id: 'work', label: 'Work' },
      { id: 'pipeline', label: 'Pipeline' },
      { id: 'contact', label: 'Contact' },
    ],
    resumeTo: '/resume',
    githubUrl: GITHUB_URL,
  },
  footer: {
    name: OWNER,
    links: [
      { label: 'GitHub', href: GITHUB_URL, external: true },
      { label: 'Resume (PDF)', href: RESUME_PDF, download: true },
    ],
  },
};

// TODO(A, step 5): move into pages/Home.tsx; sections B and D fill in later.
function HomePlaceholder() {
  return (
    <>
      <section className="container" style={{ paddingBlock: 'var(--section-pad-y)' }}>
        <p className="label">Foundation</p>
        <h1>
          Placeholder <em>home</em>.
        </h1>
      </section>
      <Section id="about" index={1} label="About" heading={<>Hi, I&apos;m <em>Bharath</em>.</>}>
        <p>TODO(D): About content.</p>
      </Section>
      <Section id="stack" index={2} label="Stack" tone="tint" heading={<>The tools I <em>use</em>.</>}>
        <p>TODO(B): StackTable.</p>
      </Section>
      <Section id="work" index={3} label="Work" heading={<>Things I&apos;ve <em>built</em>.</>}>
        <p>TODO(A, step 6): WorkPanel.</p>
      </Section>
      <Section id="pipeline" index={4} label="Pipeline" tone="tint" heading={<>Two <em>pipelines</em>.</>}>
        <p>TODO(C): PipelineCompare.</p>
      </Section>
      <Section id="contact" index={5} label="Contact" tone="dark" heading={<>Let&apos;s <em>talk</em>.</>}>
        <p>TODO(B): Contact.</p>
      </Section>
    </>
  );
}

function TodoPage({ title }: { title: string }) {
  return (
    <section className="container" style={{ paddingBlock: 'var(--section-pad-y)' }}>
      <h1>{title}</h1>
      <p>TODO(A, step 5): real page.</p>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout {...layout} />}>
        <Route index element={<HomePlaceholder />} />
        <Route path="*" element={<TodoPage title="Not built yet" />} />
      </Route>
    </Routes>
  );
}
