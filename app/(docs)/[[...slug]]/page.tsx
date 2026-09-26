import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { getMDXComponents } from '@/components/mdx';
import { MovedAnchors } from '@/components/mdx/moved-anchors';
import { SponsorsSidebar } from '@/components/sponsors-sidebar';
import { editUrl, markdownUrl, source } from '@/lib/source';
import site from '@/site.config.json';

export const dynamicParams = false;

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const md = markdownUrl(page.url);
  const edit = editUrl(page);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        footer: (
          <>
            <EditOnGitHub href={edit} />
            <SponsorsSidebar />
          </>
        ),
      }}
      tableOfContentPopover={{ footer: <EditOnGitHub href={edit} /> }}
    >
      {page.data.movedAnchors && <MovedAnchors path={page.url} map={page.data.movedAnchors} />}
      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-row gap-2 items-center border-b pb-4 not-prose">
        <MarkdownCopyButton markdownUrl={md} />
        <ViewOptionsPopover markdownUrl={md} githubUrl={edit} />
      </div>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const { title, description } = page.data;
  return {
    title,
    description,
    alternates: { canonical: page.url, types: { 'text/markdown': markdownUrl(page.url) } },
    // Next doesn't template og:title or deep-merge openGraph, so spell them out.
    openGraph: {
      title: `${title} – ${site.name}`,
      description,
      url: page.url,
      siteName: site.name,
      type: 'article',
      images: ['/fb-share.png'],
    },
    twitter: { card: 'summary_large_image', site: '@colyseus', images: ['/fb-share.png'] },
  };
}
