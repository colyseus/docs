import type { LLMsOptions } from 'fumadocs-core/mdx-plugins';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import { defaultHandlers } from 'mdast-util-to-markdown';

/**
 * How each MDX component reads in the `.md` twins and llms-full.txt. Agents read
 * these for the API, so code must survive intact and nothing may leak as JSX.
 * A capitalized component with no rule here throws, so a new component gets a
 * rule instead of silently mangling the twins.
 */

type El = MdxJsxFlowElement | MdxJsxTextElement;

// Decorative, or navigation that means nothing off-site.
const DROP = new Set(['Logo', 'script', 'style']);

// Rendered as their children, with no wrapper of their own.
const CHILDREN_ONLY = new Set(['Steps', 'Step', 'Cards', 'Accordions', 'div', 'span', 'p', 'figure', 'thead', 'tbody']);

const CALLOUT_LABELS: Record<string, string> = { warning: 'Warning', warn: 'Warning', error: 'Important' };

// `// [!code highlight:3]` marker lines: rendering instructions, not code
const NOTATION_LINE = /^\s*(\/\/|#|--) \[!code [^\]]+\]\s*$/;

const attr = (el: El, name: string) => {
  const a = el.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
  return a && typeof a.value === 'string' ? a.value : undefined;
};

const oneLine = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

export const llmsOptions: LLMsOptions = {
  headingIds: false,
  handlers: {
    code(node, parent, state, info) {
      const value = (node.value as string).split('\n').filter((l: string) => !NOTATION_LINE.test(l)).join('\n');
      return defaultHandlers.code({ ...node, value }, parent, state, info);
    },
  },
  filterElement(node) {
    // `{/* MDX comments */}`
    if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
      return !/^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value);
    }
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return true;
    const name = node.name ?? '';
    if (DROP.has(name)) return false;
    if (CHILDREN_ONLY.has(name)) return 'children-only';
    return true;
  },
  stringify(node, _parent, state, info) {
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
    const el = node as El;
    const inner = (n: El = el) =>
      n.type === 'mdxJsxTextElement' ? state.containerPhrasing(n, info) : state.containerFlow(n, info);

    const name = el.name ?? '';
    if (DROP.has(name)) return '';
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
        return inner();
      case 'Tab':
        return `**${attr(el, 'value')}**\n\n${inner()}`;
      case 'Accordion':
        return `**${attr(el, 'title')}**\n\n${inner()}`;
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
      case 'Card': {
        const title = attr(el, 'title') ?? '';
        const href = attr(el, 'href');
        const desc = oneLine(inner().replace(/!\[[^\]]*\]\([^)]*\)/g, '')); // card art means nothing here
        return `- ${href ? `[${title}](${href})` : `**${title}**`}${desc ? `: ${desc}` : ''}`;
      }
      case 'Mermaid':
        return '```mermaid\n' + attr(el, 'chart') + '\n```';
      case 'b':
      case 'strong':
        return `**${oneLine(inner())}**`;
      case 'i':
      case 'em':
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
