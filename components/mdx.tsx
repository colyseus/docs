import defaultMdxComponents from 'fumadocs-ui/mdx';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import * as Octicons from '@primer/octicons-react';
import type { MDXComponents } from 'mdx/types';
import { Logo } from '@/lib/icons';
import { LangTabs, Tab, Tabs } from './mdx/tabs';
import { Steps } from './mdx/steps';
import { Mermaid } from './mdx/mermaid';
import { Hero } from './mdx/hero';
import { Img } from './mdx/image';
import { ScenarioCard, ScenarioGrid } from './scenario-card';
import { Client, ClientList, DemoSource } from './client-list';
import { PremiumDemoCount, PremiumDemos } from './premium-demos';

// Every octicon (`<PeopleIcon/>`) is usable in MDX without an import.
const octicons = Object.fromEntries(
  Object.entries(Octicons).filter(([name]) => name.endsWith('Icon')),
) as Record<string, React.ComponentType<Octicons.IconProps>>;

/** Every component a page can use. Pages import nothing. */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...octicons,
    ...defaultMdxComponents,
    img: Img,
    Tabs,
    Tab,
    LangTabs,
    Steps,
    Mermaid,
    Files,
    Folder,
    File,
    Logo,
    Hero,
    ScenarioGrid,
    ScenarioCard,
    ClientList,
    Client,
    DemoSource,
    PremiumDemos,
    PremiumDemoCount,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
