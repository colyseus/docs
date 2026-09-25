import type * as PageTree from 'fumadocs-core/page-tree';
import { pageMarkdown, source, type Page } from '@/lib/source';
import site from '@/site.config.json';

export const revalidate = false;
export const dynamic = 'force-static';

/** Pages in sidebar order. */
function ordered(): Page[] {
  const pages: Page[] = [];
  const walk = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type === 'page' && !node.external) {
        const page = source.getNodePage(node);
        if (page) pages.push(page);
      } else if (node.type === 'folder') {
        if (node.index) {
          const page = source.getNodePage(node.index);
          if (page) pages.push(page);
        }
        walk(node.children);
      }
    }
  };
  walk(source.getPageTree().children);
  return pages;
}

export async function GET() {
  const header = [
    `# ${site.name} documentation`,
    '',
    `Full text of every page at ${site.url}. Individual pages are available as markdown`,
    'by appending `.md` to any documentation URL.',
  ].join('\n');
  const bodies = await Promise.all(ordered().map(pageMarkdown));
  return new Response([header, ...bodies].join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
