import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer.tsx';
import type { FooterProps } from './Footer.tsx';
import Header from './Header.tsx';
import type { HeaderProps } from './Header.tsx';
import ScrollToHash from './ScrollToHash.tsx';
import './SiteLayout.css';

export interface SiteLayoutProps {
  header: HeaderProps;
  footer: FooterProps;
}

/** Skip link, header, routed content in <main id="main">, footer. */
export default function SiteLayout({ header, footer }: SiteLayoutProps) {
  return (
    <>
      <ScrollToHash />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header {...header} />
      <main id="main" tabIndex={-1} className="site-main">
        <Suspense
          fallback={
            <div className="container site-main__loading" role="status">
              <span className="visually-hidden">Loading page</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer {...footer} />
    </>
  );
}
