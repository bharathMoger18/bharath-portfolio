import { renderDiagram } from '../components/diagrams/renderDiagram.tsx';
import Seo from '../components/layout/Seo.tsx';
import CaseStudyLayout from '../components/work/CaseStudyLayout.tsx';
import { AWS_PROJECT } from '../data/projects.ts';
import { SITE } from '../data/site.ts';

export default function CaseAws() {
  return (
    <>
      <Seo
        title={`${AWS_PROJECT.title} | ${SITE.name}`}
        description={AWS_PROJECT.summary}
        path="/work/aws"
      />
      <CaseStudyLayout project={AWS_PROJECT} renderDiagram={renderDiagram} />
    </>
  );
}
