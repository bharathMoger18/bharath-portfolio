import type { ReactNode } from 'react';

/**
 * /lab discovers every file matching src/components/**\/*.lab.tsx.
 * To mount a component, add e.g. src/components/hero/Hero.lab.tsx:
 *
 *   import { defineLab } from '../layout/lab.ts';
 *   import Hero from './Hero.tsx';
 *   export default defineLab({ id: 'hero', title: 'Hero', render: () => <Hero {...mock} /> });
 *
 * One file per component. Mock data must use the types in src/data/types.ts.
 */
export interface LabEntry {
  /** Unique, kebab-case. Used as the anchor (#lab-<id>). */
  id: string;
  title: string;
  /** Optional one-line note shown under the title. */
  note?: string;
  render: () => ReactNode;
}

export function defineLab(entry: LabEntry): LabEntry {
  return entry;
}
