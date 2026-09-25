import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { NotFoundSuggestions } from '@/components/not-found-suggestions';

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto w-full max-w-xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-fd-muted-foreground">
          This page doesn&apos;t exist. Try the search, or go back to the <Link href="/" className="text-fd-primary hover:underline">introduction</Link>.
        </p>
        <NotFoundSuggestions />
      </main>
    </HomeLayout>
  );
}
