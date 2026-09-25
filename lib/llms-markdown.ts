import type { LLMsOptions } from 'fumadocs-core/mdx-plugins';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import { premiumDemos } from './premium-demos';

/**
 * How each MDX component reads in the `.md` twins and llms-full.txt. Agents read
 * these for the API, so code must survive intact and nothing may leak as JSX.
 * A capitalized component with no rule here throws, so a new component gets a
 * rule instead of silently mangling the twins.
 */

type El = MdxJsxFlowElement | MdxJsxTextElement;

// Decorative, or navigation that means nothing off-site.
const DROP = new Set(['Hero', 'Logo', 'PremiumDemos', 'DemoSource', 'script', 'style']);

// Rendered as their children, with no wrapper of their own.
const CHILDREN_ONLY = new Set([
  'Steps', 'Cards', 'ScenarioGrid', 'ClientList',
  'details', 'div', 'span', 'p', 'center', 'figure', 'thead', 'tbody', 'label',
]);

const CALLOUT_LABELS: Record<string, string> = { warning: 'Warning', warn: 'Warning', error: 'Important' };

const attr = (el: El, name: string) => {
  const a = el.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  return a && typeof a.value === 'string' ? a.value : undefined;
};

const oneLine = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

export const llmsOptions: LLMsOptions = {
  headingIds: false,
  filterElement(node) {
    // `{/* MDX comments */}`
    if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
      return !/^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value);
    }
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return true;
    const name = node.name ?? '';
    if (DROP.has(name) || /Icon$/.test(name)) return false;
    if (CHILDREN_ONLY.has(name)) return 'children-only';
    return true;
  },
  stringify(node, _parent, state, info) {
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
    const el = node as El;
    const inner = (n: El = el) =>
      n.type === 'mdxJsxTextElement' ? state.containerPhrasing(n, info) : state.containerFlow(n, info);

    const name = el.name ?? '';
    if (DROP.has(name) || /Icon$/.test(name)) return '';
    if (CHILDREN_ONLY.has(name)) return inner();

    switch (name) {
      case 'Callout': {
        const label = CALLOUT_LABELS[attr(el, 'type') ?? ''] ?? 'Note';
        return inner()
          .split('\n')
          .map((l, i) => (i === 0 ? `> **${label}:** ${l}` : l ? `> ${l}` : '>'))
          .join('\n');
      }
      case 'Tabs':
      case 'LangTabs':
        return inner();
      case 'Tab':
        return `**${attr(el, 'value')}**\n\n${inner()}`;
      case 'CodeBlockTabs': {
        // package-manager tabs from ```npm fences: the npm variant is enough
        const first = el.children.find(
          (c): c is MdxJsxFlowElement => c.type === 'mdxJsxFlowElement' && c.name === 'CodeBlockTab',
        );
        return first ? inner(first) : '';
      }
      case 'CodeBlockTab':
      case 'CodeBlockTabsList':
      case 'CodeBlockTabsTrigger':
        return inner();
      case 'Files': {
        // a plain-text tree in a fence, the way a terminal shows it
        const lines: string[] = [];
        const walk = (n: El, depth: number) => {
          for (const c of n.children) {
            if (c.type !== 'mdxJsxFlowElement' || (c.name !== 'Folder' && c.name !== 'File')) continue;
            lines.push('  '.repeat(depth) + attr(c, 'name') + (c.name === 'Folder' ? '/' : ''));
            if (c.name === 'Folder') walk(c, depth + 1);
          }
        };
        walk(el, 0);
        return '```\n' + lines.join('\n') + '\n```';
      }
      case 'Card':
      case 'ScenarioCard': {
        const title = attr(el, 'title') ?? '';
        const href = attr(el, 'href');
        const desc = oneLine(inner().replace(/!\[[^\]]*\]\([^)]*\)/g, '')); // card art means nothing here
        return `- ${href ? `[${title}](${href})` : `**${title}**`}${desc ? `: ${desc}` : ''}`;
      }
      case 'Client': {
        const platforms = attr(el, 'platformsFull') ?? attr(el, 'platforms');
        const links = (['Play', 'Source'] as const)
          .map((label) => [label, attr(el, label.toLowerCase())] as const)
          .filter(([, url]) => url)
          .map(([label, url]) => `[${label}](${url})`);
        return `- **${attr(el, 'name')}**${platforms ? ` (${platforms})` : ''}${links.length ? `: ${links.join(', ')}` : ''}`;
      }
      case 'PremiumDemoCount':
        return String(premiumDemos.length);
      case 'Mermaid':
        return '```mermaid\n' + attr(el, 'chart') + '\n```';
      case 'table': {
        const rows: El[] = [];
        const collect = (n: El) =>
          n.children.forEach((c) => {
            if (c.type !== 'mdxJsxFlowElement' && c.type !== 'mdxJsxTextElement') return;
            if (c.name === 'tr') rows.push(c);
            else collect(c);
          });
        collect(el);
        const cells = rows.map((r) =>
          r.children
            .filter((c): c is El => (c.type === 'mdxJsxFlowElement' || c.type === 'mdxJsxTextElement') && (c.name === 'th' || c.name === 'td'))
            .map((c) => oneLine(inner(c)).replace(/\|/g, '\\|')),
        );
        if (!cells.length) return '';
        const width = Math.max(...cells.map((r) => r.length));
        const pad = (r: string[]) => [...r, ...Array(width - r.length).fill('')];
        return [
          `| ${pad(cells[0]).join(' | ')} |`,
          `| ${Array(width).fill('---').join(' | ')} |`,
          ...cells.slice(1).map((r) => `| ${pad(r).join(' | ')} |`),
        ].join('\n');
      }
      case 'summary':
      case 'b':
      case 'strong':
        return `**${oneLine(inner())}**`;
      case 'i':
      case 'em':
      case 'figcaption':
        return `*${oneLine(inner())}*`;
      case 'code':
        return `\`${oneLine(inner())}\``;
      case 'br':
        return '\n';
      case 'a': {
        const href = attr(el, 'href');
        return href ? `[${oneLine(inner())}](${href})` : inner();
      }
      case 'img': {
        const src = attr(el, 'src');
        return src ? `![${attr(el, 'alt') ?? ''}](${src})` : '';
      }
      case 'iframe': {
        const src = attr(el, 'src');
        return src ? `[Video](${src})` : '';
      }
    }
    if (/^[A-Z]/.test(name)) throw new Error(`llms-markdown: no rule for <${name}>`);
    return inner();
  },
};
