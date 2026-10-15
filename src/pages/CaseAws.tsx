import Seo from '../components/layout/Seo.tsx';
import { OWNER } from '../siteConfig.ts';
import './pages.css';

/** TODO(A, step 6): render with CaseStudyLayout. TODO(D): project data. */
export default function CaseAws() {
  return (
    <article className="container page">
      <Seo
        title={`AWS Infrastructure and EKS Deployment | ${OWNER}`}
        description="Case study: AWS infrastructure and an EKS deployment with Terraform and Jenkins. Architecture, pipeline, key decisions and evidence."
        path="/work/aws"
      />
      <p className="label">Case study</p>
      <h1>
        AWS infrastructure and <em>EKS</em> deployment.
      </h1>
      <p className="page__lead">TODO(D): case study content, status line and evidence.</p>
    </article>
  );
}
