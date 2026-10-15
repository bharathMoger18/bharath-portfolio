import { OWNER, RESUME_PDF } from '../siteConfig.ts';
import './pages.css';

export default function Resume() {
  return (
    <section className="container page">
      <title>{`Resume | ${OWNER}`}</title>
      <p className="label">Resume</p>
      <h1>
        My <em>resume</em>.
      </h1>
      <p className="page__lead">Read it here or download the PDF.</p>

      <div className="page__actions">
        <a className="pill pill--dark" href={RESUME_PDF} download>
          Download PDF
        </a>
        <a className="pill pill--outline" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
          Open in a new tab
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>

      {/* Phones often cannot render PDFs inline; the fallback keeps the download one tap away. */}
      <object className="resume__frame" data={RESUME_PDF} type="application/pdf" aria-label="Resume PDF preview">
        <div className="resume__fallback">
          <p>Your browser cannot show the PDF here.</p>
          <p>
            <a href={RESUME_PDF} download>
              Download the resume (PDF)
            </a>
          </p>
        </div>
      </object>
    </section>
  );
}
