import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';
import { llmsOptions } from './llms-markdown';

// Evaluated at build time by the fumadocs-mdx macro: no React or asset imports here.
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      /** Shorter label for the sidebar (and llms.txt) when `title` is long. */
      sidebarTitle: z.string().optional(),
      /** Old heading slug -> new `/path#anchor`, for anchors that moved off this page. */
      movedAnchors: z.record(z.string().regex(/^[\w-]+$/), z.string().startsWith('/')).optional(),
    }),
    postprocess: { includeProcessedMarkdown: llmsOptions },
  },
  meta: { schema: metaSchema },
});
