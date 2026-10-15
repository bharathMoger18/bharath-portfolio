import Seo from '../components/layout/Seo.tsx';
import { OWNER } from '../siteConfig.ts';
import './pages.css';

/** TODO(A, step 6): render with CaseStudyLayout. TODO(D): project data. */
export default function CaseKubeadm() {
  return (
    <article className="container page">
      <Seo
        title={`Self-Built Kubernetes Platform | ${OWNER}`}
        description="Case study: a self-built Kubernetes platform. Architecture, pipeline, key decisions and evidence."
        path="/work/kubeadm"
      />
      <p className="label">Case study</p>
      <h1>
        Self-built <em>Kubernetes</em> platform.
      </h1>
      <p className="page__lead">TODO(D): case study content, status line and evidence.</p>
    </article>
  );
}
