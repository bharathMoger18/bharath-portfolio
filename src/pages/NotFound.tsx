import { Link } from 'react-router-dom';
import Seo from '../components/layout/Seo.tsx';
import { SITE } from '../data/site.ts';
import './pages.css';

export default function NotFound() {
  return (
    <section className="container page">
      <Seo title={`Page not found | ${SITE.name}`} path="/404" noindex />
      <p className="label">404</p>
      <h1>
        That page <em>wandered</em> off.
      </h1>
      <p className="page__lead">The address does not match anything on this site.</p>
      <div className="page__actions">
        <Link className="pill pill--dark" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
