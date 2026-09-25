import { loader, type InferPageType } from 'fumadocs-core/source';
import { docs } from './collections';
import { resolveIcon } from './icons';
import { sidebarTitle } from './source-plugins.js';
import site from '@/site.config.json';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  icon: resolveIcon,
  plugins: [sidebarTitle()],
});

export type Page = InferPageType<typeof source>;

/**
 * The page's markdown twin. The build writes `out/<route>.md`; in dev the files
 * don't exist yet, so point at the route handler that renders them.
 */
export function markdownUrl(url: string) {
  const path = `${url === '/' ? '/index' : url}.md`;
  return process.env.NODE_ENV === 'development' ? `/md${path}` : path;
}

export function editUrl(page: Page) {
  return `https://github.com/${site.repo}/blob/${site.branch}/content/docs/${page.path}`;
}

/** `/room#x` -> `https://docs.colyseus.io/room.md#x`, so a followed link stays in markdown. */
function absolutise(target: string) {
  const hash = target.indexOf('#');
  const route = (hash === -1 ? target : target.slice(0, hash)).replace(/\/$/, '');
  const anchor = hash === -1 ? '' : target.slice(hash);
  if (/\.\w+$/.test(route)) return site.url + route; // asset
  return `${site.url}${route || '/index'}.md${anchor}`;
}

export async function pageMarkdown(page: Page) {
  const body = (await page.data.getText('processed')).replace(/^\s+/, '');
  const md = `# ${page.data.title}\n\n${body}`.replace(/\]\((\/[^)\s]*)\)/g, (_, t) => `](${absolutise(t)})`);
  return `${md.trimEnd()}\n\n---\nSource: ${site.url}${page.url}\n`;
}
