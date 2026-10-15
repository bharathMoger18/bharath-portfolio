import { OWNER } from '../siteConfig.ts';
import './pages.css';

/** TODO(A, step 6): render with CaseStudyLayout. TODO(D): project data. */
export default function CaseAws() {
  return (
    <article className="container page">
      <title>{`AWS Infrastructure and EKS Deployment | ${OWNER}`}</title>
      <p className="label">Case study</p>
      <h1>
        AWS infrastructure and <em>EKS</em> deployment.
      </h1>
      <p className="page__lead">TODO(D): case study content, status line and evidence.</p>
    </article>
  );
}
