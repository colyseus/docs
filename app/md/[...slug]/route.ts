import { notFound } from 'next/navigation';
import { pageMarkdown, source } from '@/lib/source';

export const revalidate = false;
export const dynamic = 'force-static';

// /md/room/lifecycle.md -> out/md/room/lifecycle.md; scripts/place-markdown.js
// moves it to out/room/lifecycle.md, next to the page.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugs = [...slug.slice(0, -1), slug.at(-1)!.replace(/\.md$/, '')];
  const page = source.getPage(slugs.length === 1 && slugs[0] === 'index' ? [] : slugs);
  if (!page) notFound();
  return new Response(await pageMarkdown(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => {
    const slugs = page.slugs.length ? [...page.slugs] : ['index'];
    slugs[slugs.length - 1] += '.md';
    return { slug: slugs };
  });
}
