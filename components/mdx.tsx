import type { ComponentProps } from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import type { MDXComponents } from 'mdx/types';
import { Logo } from '@/lib/icons';
import { Mermaid } from './mdx/mermaid';

/** Fumadocs' built-in components, available in every page without an import. */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    // Keep inactive panels in the static HTML (hidden), so every language's code is crawlable.
    Tab: (props: ComponentProps<typeof TabsComponents.Tab>) => <TabsComponents.Tab keepMounted {...props} />,
    Steps,
    Step,
    Accordions,
    Accordion,
    Files,
    Folder,
    File,
    Mermaid,
    Logo,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
