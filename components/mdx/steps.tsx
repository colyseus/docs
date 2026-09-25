import type { ReactNode } from 'react';

// Headings inside become numbered steps (h2–h4, as in Nextra).
export function Steps({ children }: { children: ReactNode }) {
  return <div className="fd-steps [&_h2]:fd-step [&_h3]:fd-step [&_h4]:fd-step">{children}</div>;
}
