import type { ElementType, ReactNode } from 'react';
import { useReveal } from './useReveal.ts';
import './Reveal.css';

export interface RevealProps {
  as?: ElementType;
  className?: string;
  /** Stagger index: delays the transition by index * 60ms (max 6 steps). */
  step?: number;
  children?: ReactNode;
}

/** Thin wrapper around useReveal. Fade and 12px rise; nothing else. */
export default function Reveal({ as, className, step = 0, children }: RevealProps) {
  const Tag: ElementType = as ?? 'div';
  const { ref, armed, revealed } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-reveal={armed ? (revealed ? 'in' : 'out') : undefined}
      style={step > 0 ? { transitionDelay: `${Math.min(step, 6) * 60}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
