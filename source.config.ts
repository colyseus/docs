import { defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { transformerMetaHighlight } from '@shikijs/transformers';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    // Keep image URLs as-is (public/ has mixed-case extensions a bundler import
    // chokes on); local sizes are still read at build, remote ones never fetched.
    remarkImageOptions: { useImport: false, external: false },
    remarkNpmOptions: { persist: { id: 'package-manager' } },
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      fallbackLanguage: 'plaintext',
      // `{1,3-5}` line highlights in the fence meta
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerMetaHighlight()],
    },
  },
});
