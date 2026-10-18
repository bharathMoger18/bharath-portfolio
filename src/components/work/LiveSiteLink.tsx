import './LiveSiteLink.css';

export interface LiveSiteLinkProps {
  /** Address of the running site. Render this component only when a project has one. */
  href: string;
}

/** Secondary pill that opens the running site in a new tab. */
export default function LiveSiteLink({ href }: LiveSiteLinkProps) {
  return (
    <a className="live-site-link" href={href} target="_blank" rel="noopener noreferrer">
      Visit live site<span aria-hidden="true"> ↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
