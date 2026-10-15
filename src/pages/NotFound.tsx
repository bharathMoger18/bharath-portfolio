import { Link } from 'react-router-dom';
import { OWNER } from '../siteConfig.ts';
import './pages.css';

export default function NotFound() {
  return (
    <section className="container page">
      <title>{`Page not found | ${OWNER}`}</title>
      <meta name="robots" content="noindex" />
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
