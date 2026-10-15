import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRightIcon, CloseIcon, GithubIcon, MenuIcon } from './icons.tsx';
import type { NavItem } from './types.ts';
import './MobileMenu.css';

export interface MobileMenuProps {
  nav: NavItem[];
  /** Section id currently in view on the home page, or null. */
  activeId: string | null;
  resumeTo: string;
  githubUrl: string;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function MobileMenu({ nav, activeId, resumeTo, githubUrl }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close if the viewport grows to the desktop layout.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Focus trap: Tab and Shift+Tab cycle inside the panel, Escape closes.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;

    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;
    const current = document.activeElement;

    if (event.shiftKey && (current === first || current === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
        <span className="visually-hidden">Menu</span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        hidden={!open}
        onKeyDown={onKeyDown}
      >
        <div className="mobile-menu__top">
          <button
            ref={closeRef}
            type="button"
            className="mobile-menu__close"
            onClick={() => close(true)}
          >
            <CloseIcon />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul role="list" className="mobile-menu__list">
            {nav.map((item) => (
              <li key={item.id}>
                <Link
                  className="mobile-menu__link"
                  to={{ pathname: '/', hash: `#${item.id}` }}
                  aria-current={activeId === item.id ? 'location' : undefined}
                  onClick={() => close(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-menu__actions">
          <NavLink className="mobile-menu__resume" to={resumeTo} onClick={() => close(false)}>
            Resume
          </NavLink>
          <a
            className="mobile-menu__github"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon width={20} height={20} />
            GitHub
            <ArrowUpRightIcon width={18} height={18} />
            <span className="visually-hidden">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </>
  );
}
