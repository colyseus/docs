import { defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    // Keep image URLs as-is: public/ has uppercase .PNG files a bundler import rejects.
    remarkImageOptions: { useImport: false },
    remarkNpmOptions: { persist: { id: 'package-manager' } },
    rehypeCodeOptions: { ...rehypeCodeDefaultOptions, fallbackLanguage: 'plaintext' },
  },
});
