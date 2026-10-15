import type { Education, SiteMeta } from '../../data/types.ts';
import QrCode from './QrCode.tsx';
import './EngineerBadge.css';

export interface EngineerBadgeProps {
  site: Pick<SiteMeta, 'name' | 'role' | 'location' | 'email' | 'url'>;
  /** The MCA entry. Shown as "MCA, VTU, 2025" with its grade. */
  education: Pick<Education, 'degree' | 'institution' | 'period' | 'grade'>;
  /** Short institution name for the card, e.g. "VTU". */
  institutionShort: string;
  /** Small mono heading on the card, e.g. "Engineer ID". */
  cardLabel: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * Hanging ID card on a lanyard. Real content only: no ID number, no barcode.
 * The sway is CSS only and is switched off under prefers-reduced-motion.
 */
export default function EngineerBadge({
  site,
  education,
  institutionShort,
  cardLabel,
}: EngineerBadgeProps) {
  const host = site.url.replace(/^https?:\/\//, '');
  return (
    <figure className="badge">
      <div className="badge__swing">
        <div className="badge__strap" aria-hidden="true">
          <span className="badge__clip" />
        </div>
        <div className="badge__card">
          <p className="label badge__label">{cardLabel}</p>
          <div className="badge__id">
            <span className="badge__initials" aria-hidden="true">
              {initials(site.name)}
            </span>
            <div>
              <p className="badge__name">{site.name}</p>
              <p className="badge__role">{site.role}</p>
            </div>
          </div>

          <dl className="badge__facts">
            <div>
              <dt className="label">Education</dt>
              <dd>
                {education.degree}, {institutionShort}, {education.period}
              </dd>
            </div>
            {education.grade ? (
              <div>
                <dt className="label">{education.grade.label}</dt>
                <dd>{education.grade.value}</dd>
              </div>
            ) : null}
            <div>
              <dt className="label">Based in</dt>
              <dd>{site.location}</dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
          </dl>

          <div className="badge__qr">
            <QrCode value={site.url} label={`QR code linking to ${host}`} size={88} />
            <p className="badge__qr-text">
              <span className="label">Live site</span>
              <span>
                {host.split('.').map((part, i, all) => (
                  <span key={i}>
                    {part}
                    {i < all.length - 1 ? <>.<wbr /></> : null}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
