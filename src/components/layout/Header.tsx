import { Link, NavLink, useLocation } from 'react-router-dom';
import { GithubIcon } from './icons.tsx';
import MobileMenu from './MobileMenu.tsx';
import type { NavItem } from './types.ts';
import { useActiveSection } from './useActiveSection.ts';
import './Header.css';

export interface HeaderProps {
  /** One or two letters for the rounded-square monogram. */
  monogram: string;
  /** Used in the home link's accessible name. */
  ownerName: string;
  nav: NavItem[];
  /** Route of the resume page, e.g. "/resume". */
  resumeTo: string;
  githubUrl: string;
}

export default function Header({ monogram, ownerName, nav, resumeTo, githubUrl }: HeaderProps) {
  const { pathname } = useLocation();
  const activeId = useActiveSection(
    nav.map((item) => item.id),
    pathname === '/',
  );

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__brand" aria-label={`${ownerName}, home`}>
          <span aria-hidden="true">{monogram}</span>
        </Link>

        <nav aria-label="Primary" className="header__nav">
          <ul role="list" className="header__group">
            {nav.map((item) => (
              <li key={item.id}>
                <Link
                  className="header__link"
                  to={{ pathname: '/', hash: `#${item.id}` }}
                  aria-current={activeId === item.id ? 'location' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <NavLink to={resumeTo} className="header__resume">
            Resume
          </NavLink>
          <a
            className="header__github"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon width={22} height={22} />
            <span className="visually-hidden">GitHub (opens in a new tab)</span>
          </a>
          <MobileMenu nav={nav} activeId={activeId} resumeTo={resumeTo} githubUrl={githubUrl} />
        </div>
      </div>
    </header>
  );
}
