import type { ReactNode } from 'react';
import Link from 'next/link';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { Banner } from 'fumadocs-ui/components/banner';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  return (
    <>
      <Banner id="released-0.18">
        <Link href="/migrating/0.18">
          <strong>Colyseus 0.18 is out! 🚀</strong> Read the migration guide.
        </Link>
      </Banner>
      <DocsLayout
        tree={source.getPageTree()}
        {...base}
        nav={{ ...nav, mode: 'top' }}
        tabMode="navbar"
        tabs={false}
        sidebar={{
          defaultOpenLevel: 0,
          footer: <p className="px-2 text-xs text-fd-muted-foreground">© {new Date().getFullYear()} Endel Dreyer</p>,
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
