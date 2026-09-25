'use client';
import { useEffect } from 'react';

/**
 * Redirects anchors that moved off this page, e.g. `/room#lock-room` →
 * `/matchmaker/visibility#lock-room`. Fragments never reach the server, so
 * Netlify's `_redirects` can't do this; it has to run in the browser.
 *
 * Declared per page as `movedAnchors` frontmatter. Runs on mount and on
 * `hashchange`, scoped to this page so the listener dies on navigation.
 */
export function MovedAnchors({ path, map }: { path: string; map: Record<string, string> }) {
  useEffect(() => {
    const go = () => {
      if (location.pathname !== path) return;
      const to = map[decodeURIComponent(location.hash.slice(1))];
      if (to) location.replace(to);
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, [path, map]);
  return null;
}
