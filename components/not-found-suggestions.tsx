'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * "Did you mean": searches the static index for the dead path's words. Old
 * URLs are 301'd by public/_redirects before they get here, so reaching this
 * page means a redirect is missing: the GA event makes those visible.
 */
export function NotFoundSuggestions() {
  const { setSearch, query } = useDocsSearch({ client: staticClient({ from: '/api/search.json' }) });

  useEffect(() => {
    const path = location.pathname;
    setSearch(path.split(/[/_.-]+/).filter((w) => w && w !== 'html').join(' '));
    sendGAEvent('event', 'page_not_found', { path });
  }, [setSearch]);

  const pages = query.data !== 'empty' ? (query.data ?? []).filter((r) => r.type === 'page').slice(0, 5) : [];
  if (!pages.length) return null;

  return (
    <div className="mt-8 text-start">
      <p className="text-sm text-fd-muted-foreground mb-2">Maybe you were looking for:</p>
      <ul className="flex flex-col gap-1">
        {pages.map((r) => (
          <li key={r.id}>
            <Link href={r.url} className="text-fd-primary hover:underline">
              {typeof r.content === 'string' ? r.content : r.url}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
