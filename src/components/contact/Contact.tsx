import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SiteMeta } from '../../data/types.ts';
import { ArrowUpRightIcon, GithubIcon } from '../layout/icons.tsx';
import Section from '../layout/Section.tsx';
import './Contact.css';

export interface ContactProps {
  /** Email, GitHub and LinkedIn only. There is no phone prop on purpose (DECISIONS #18). */
  site: Pick<SiteMeta, 'email' | 'githubUrl' | 'linkedinUrl'>;
  /** Route of the resume page, e.g. "/resume". */
  resumeTo: string;
  /** Section number shown as "08". Default 8. */
  index?: number;
  /** Defaults to "Let's <em>talk</em>." */
  heading?: ReactNode;
  /** One short line above the button. Supplied by Account D. */
  intro?: string;
}

/** Dark closing section. One email button, three plain links, no form. */
export default function Contact({ site, resumeTo, index = 8, heading, intro }: ContactProps) {
  return (
    <Section
      id="contact"
      index={index}
      label="Contact"
      tone="dark"
      heading={
        heading ?? (
          <>
            Let&apos;s <em>talk</em>.
          </>
        )
      }
    >
      <div className="contact">
        {intro ? <p className="contact__intro">{intro}</p> : null}
        <a className="contact__email" href={`mailto:${site.email}`}>
          Email me
        </a>
        <p className="contact__address">{site.email}</p>

        <ul role="list" className="contact__links" aria-label="Elsewhere">
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
          <li>
            <Link to={resumeTo}>Resume</Link>
          </li>
        </ul>
      </div>
    </Section>
  );
}
