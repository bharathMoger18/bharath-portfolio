import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SiteMeta } from '../../data/types.ts';
import { ArrowUpRightIcon, GithubIcon } from '../layout/icons.tsx';
import GhostName from './GhostName.tsx';
import RequestPath from './RequestPath.tsx';
import './Hero.css';

export interface HeroCopy {
  eyebrow: string;
  /** Headline is split so exactly ONE word is set in italic serif. */
  headline: { before: string; emphasis: string; after?: string };
  /** One honest sentence. */
  sentence: string;
  primaryLabel: string;
  resumeLabel: string;
  /** Ordered request path, outermost first. Real hops only. */
  requestPath: string[];
  requestPathLabel: string;
}

export interface HeroProps {
  site: Pick<SiteMeta, 'name' | 'githubUrl' | 'linkedinUrl' | 'portraitPath'>;
  copy: HeroCopy;
  /** Route of the resume page. */
  resumeTo: string;
  /** Home-page anchor for the primary CTA, e.g. "work". */
  projectsAnchor: string;
  /** Ghost text behind the content, e.g. "BHARATH". */
  ghostText: string;
  /** The home page's single h1. The /lab gallery passes "h2" (it has its own h1). */
  headingLevel?: 'h1' | 'h2';
}

interface Portrait {
  src: string;
  width: number;
  height: number;
}

/**
 * Loads the portrait only if the file really exists and decodes as an image.
 * A missing file on a static host with an SPA fallback returns HTML, which
 * fails to decode, so the typographic fallback stays. No placeholder person.
 */
function usePortrait(src: string): Portrait | null {
  const [portrait, setPortrait] = useState<Portrait | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth > 0) {
        setPortrait({ src, width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [src]);
  return portrait;
}

export default function Hero({
  site,
  copy,
  resumeTo,
  projectsAnchor,
  ghostText,
  headingLevel = 'h1',
}: HeroProps) {
  const Heading = headingLevel;
  const portrait = usePortrait(site.portraitPath);
  const { before, emphasis, after } = copy.headline;

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <GhostName text={ghostText} />
      <div className={`container hero__inner${portrait ? ' hero__inner--portrait' : ''}`}>
        <div className="hero__copy">
          <p className="label hero__eyebrow">{copy.eyebrow}</p>
          <Heading id="hero-heading" className="hero__headline">
            {before} <em>{emphasis}</em>
            {after ? ` ${after}` : null}
          </Heading>
          <p className="hero__sentence">{copy.sentence}</p>

          <div className="hero__actions">
            <Link
              className="pill pill--dark"
              to={{ pathname: '/', hash: `#${projectsAnchor}` }}
            >
              {copy.primaryLabel}
            </Link>
            <Link className="pill pill--outline" to={resumeTo}>
              {copy.resumeLabel}
            </Link>
          </div>

          <ul role="list" className="hero__links" aria-label={`${site.name} online`}>
            <li>
              <a href={site.githubUrl} target="_blank" rel="noopener noreferrer">
                <GithubIcon width={20} height={20} />
                GitHub
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
                <ArrowUpRightIcon width={18} height={18} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          {portrait ? (
            <img
              className="hero__portrait"
              src={portrait.src}
              width={portrait.width}
              height={portrait.height}
              alt={`Portrait of ${site.name}`}
              decoding="async"
            />
          ) : (
            <RequestPath hops={copy.requestPath} label={copy.requestPathLabel} />
          )}
        </div>
      </div>
    </section>
  );
}
