import type { FooterLink } from './types.ts';
import './Footer.css';

export interface FooterProps {
  name: string;
  links: FooterLink[];
  /** Optional honest one-liner, e.g. "Built with React and Vite." */
  note?: string;
}

// Evaluated once when the app loads: the year updates itself, no manual edits.
const YEAR = new Date().getFullYear();

function backToTop() {
  window.scrollTo({ top: 0 });
  document.getElementById('main')?.focus({ preventScroll: true });
}

export default function Footer({ name, links, note }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__meta">
          <p>
            &copy; {YEAR} {name}
          </p>
          {note ? <p className="footer__note">{note}</p> : null}
        </div>

        <nav aria-label="Footer">
          <ul role="list" className="footer__links">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="footer__link"
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  {...(link.download ? { download: '' } : {})}
                >
                  {link.label}
                  {link.external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
            <li>
              <button type="button" className="footer__link" onClick={backToTop}>
                Back to top
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
