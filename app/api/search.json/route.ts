import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const revalidate = false;
export const dynamic = 'force-static';

// Static export: the whole index ships as one JSON file, searched in the browser.
// Results rank by relevance only, so skip the sort indexes (~1.7 MB of the file).
export const { staticGET: GET } = createFromSource(source, { sort: { enabled: false } });
