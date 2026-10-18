import { useEffect, useState } from 'react';
import type { LabEntry } from '../components/layout/lab.ts';
import Seo from '../components/layout/Seo.tsx';
import { SITE } from '../data/site.ts';
import './pages.css';

/*
 * Dev-facing gallery. Auto-discovers src/components/**\/*.lab.tsx (see
 * components/layout/lab.ts). Lazy: nothing here loads on other routes.
 */
const loaders = import.meta.glob<{ default: LabEntry }>('../components/**/*.lab.tsx');

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; entries: LabEntry[] };

export default function Lab() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const paths = Object.keys(loaders).sort();
    Promise.all(paths.map((path) => loaders[path]?.()))
      .then((modules) => {
        if (cancelled) return;
        const entries = modules
          .map((m) => m?.default)
          .filter((e): e is LabEntry => e !== undefined);
        const ids = new Set<string>();
        const dup = entries.find((e) => (ids.has(e.id) ? true : (ids.add(e.id), false)));
        if (dup) {
          setState({ status: 'error', message: `Duplicate lab id "${dup.id}".` });
        } else {
          setState({ status: 'ready', entries });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: 'error', message: String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container page">
      <Seo title={`Lab | ${SITE.name}`} path="/lab" noindex />
      <p className="label">Lab</p>
      <h1>
        Component <em>lab</em>.
      </h1>
      <p className="page__lead">
        Every component with mock data. Add a <code>Name.lab.tsx</code> next to your component to list it here.
      </p>

      {state.status === 'loading' ? <p role="status">Loading entries…</p> : null}
      {state.status === 'error' ? <p role="alert">Lab error: {state.message}</p> : null}
      {state.status === 'ready' && state.entries.length === 0 ? <p>No lab entries yet.</p> : null}

      {state.status === 'ready' && state.entries.length > 0 ? (
        <>
          <nav aria-label="Lab entries">
            <ul role="list" className="lab__toc">
              {state.entries.map((entry) => (
                <li key={entry.id}>
                  <a href={`#lab-${entry.id}`}>{entry.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          {state.entries.map((entry) => (
            <section
              key={entry.id}
              id={`lab-${entry.id}`}
              className="lab__entry"
              aria-labelledby={`lab-${entry.id}-title`}
            >
              <h2 id={`lab-${entry.id}-title`}>{entry.title}</h2>
              {entry.note ? <p className="lab__note">{entry.note}</p> : null}
              <div className="lab__stage">{entry.render()}</div>
            </section>
          ))}
        </>
      ) : null}
    </section>
  );
}
