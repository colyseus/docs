/**
 * Converts a Nextra MDX page into plain markdown for machine consumption.
 *
 * The output feeds the `.md` twins served next to every page and the
 * `llms-full.txt` corpus. Fidelity of code examples is the whole point: an
 * agent reading these is looking for the API, so a mangled fence is worse than
 * no file at all.
 *
 * Three things make this less trivial than a regex pass:
 *
 * 1. Code must be protected first. `Room<Client>` and `Room<State>` appear as
 *    inline code and inside fences all over the docs, and they parse as JSX
 *    tags if you let them.
 * 2. MDX indents content inside `<Tabs.Tab>` and `<Steps>` by four spaces,
 *    which is a code block in plain markdown. Container bodies are dedented by
 *    the common indent of their own text, and fences are normalised against
 *    their opening line.
 * 3. Tags span lines (`<MovedAnchors map={{...}}>`) and carry `>` inside prop
 *    braces (`icon={<EyeClosedIcon size={18}/>}`), so tag scanning is
 *    character-level with brace and quote tracking, not line-level.
 *
 * Unknown components are reported rather than silently dropped: that is how a
 * newly introduced component gets noticed here instead of quietly mangling
 * output for months.
 */

const SITE = 'https://docs.colyseus.io'
const ASSET_RE = /\.(png|jpe?g|gif|svg|webp|ico|pdf|mp4|webm|mp3|wav|zip)$/i

// <SDKTabs> wraps <Tabs> with this fixed item list — see components/SDKTabs.tsx.
const SDK_TAB_LABELS = ['TypeScript', 'C#', 'Lua', 'Haxe', 'GDScript', 'Dart']

const CALLOUT_LABELS = { info: 'Note', warning: 'Warning', error: 'Important' }

// Rendered as nothing: decorative, or navigation that means nothing off-site.
const DROPPED = new Set([
    'MovedAnchors', 'Snowfall', 'PremiumDemos', 'DemoCard', 'DemoSource',
    'NotFoundPage', 'script', 'style',
])

// Rendered as their children, with no wrapper of their own.
const TRANSPARENT = new Set([
    'Steps', 'ScenarioGrid', 'Cards', 'ClientList', 'details',
    'div', 'span', 'center', 'figure', 'thead', 'tbody', 'p',
])

// A NUL never occurs in the source, so a stashed block is unmistakable.
const PLACEHOLDER = '\u0000'

// ---- indentation ---------------------------------------------------------

/** Visual width of a line's leading whitespace, tabs advancing to the next multiple of 4. */
function indentWidth(line) {
    let w = 0
    for (const ch of line) {
        if (ch === ' ') w++
        else if (ch === '\t') w += 4 - (w % 4)
        else break
    }
    return w
}

/** Drop `width` visual columns of leading whitespace, re-padding when a tab straddles the cut. */
function stripIndent(line, width) {
    let w = 0, i = 0
    while (i < line.length && w < width) {
        if (line[i] === ' ') w++
        else if (line[i] === '\t') w += 4 - (w % 4)
        else break
        i++
    }
    return ' '.repeat(Math.max(0, w - width)) + line.slice(i)
}

/**
 * Common indent of a container's body, measured on its raw text children only.
 *
 * Line 0 of a text node is skipped: it continues whatever preceded it on the
 * same line (`, ` between two `<code>` spans, say) and its leading whitespace
 * is not an indent.
 *
 * A trailing whitespace-only line counts, though. It is the indent leading into
 * the next child element, which is the only measurement available in a
 * container that holds nothing but elements, such as `<ScenarioGrid>`.
 */
function bodyIndent(children) {
    const widths = []
    for (const child of children) {
        if (child.text === undefined) continue
        const lines = child.text.split('\n')
        lines.forEach((l, i) => {
            if (i === 0) return
            if (l.trim() || (i === lines.length - 1 && l.length)) widths.push(indentWidth(l))
        })
    }
    return widths.length ? Math.min(...widths) : 0
}

const stripBody = (text, width) => width === 0 ? text : text.split('\n')
    .map((l, i) => (i === 0 ? l : l.trim() ? stripIndent(l, width) : ''))
    .join('\n')

// ---- code protection -----------------------------------------------------

const stash = (store, text) => (store.push(text), `${PLACEHOLDER}${store.length - 1}${PLACEHOLDER}`)

/**
 * Swap fenced blocks and inline code for opaque placeholders so the JSX scanner
 * cannot see into them. A fence is dedented against its own opening line, so a
 * fence nested inside a tab comes out flush.
 */
function protectCode(source, store) {
    const lines = source.split('\n')
    const out = []
    let prev = '' // nearest preceding non-blank line

    for (let i = 0; i < lines.length; i++) {
        const open = /^(\s*)(`{3,}|~{3,})/.exec(lines[i])
        if (!open) {
            if (lines[i].trim()) prev = lines[i]
            out.push(lines[i])
            continue
        }

        const [, indent, marker] = open
        const width = indentWidth(indent)
        const close = new RegExp(`^\\s*${marker[0]}{${marker.length},}\\s*$`)
        const block = [stripIndent(lines[i], width)]

        while (++i < lines.length) {
            block.push(stripIndent(lines[i], width))
            if (close.test(lines[i])) break
        }

        // MDX indents fences inside <Tabs.Tab> and <Steps>, and authors are not
        // consistent about it, so the container dedent can't be relied on to
        // remove it. At 4 spaces a fence stops being a fence in plain markdown,
        // so flatten it. The exception is a fence nested under a list item,
        // where the indent is what binds it to the item.
        const nested = /^\s*([-*+]|\d+\.)\s/.test(prev)
        out.push((nested ? indent : '') + stash(store, block.join('\n')))
        prev = ''
    }

    // Inline spans last, so a stray backtick inside a fence can't pair with one in prose.
    return out.join('\n').replace(/(`+)([^`\n]+)\1/g, (m) => stash(store, m))
}

/**
 * Put the protected code back, re-applying whatever gutter the placeholder ended
 * up behind. Without this a fence inside a `<Callout>` loses its `> ` on every
 * line after the first.
 */
function restoreCode(text, store) {
    return text.replace(new RegExp(`(.*?)${PLACEHOLDER}(\\d+)${PLACEHOLDER}`, 'g'), (_, before, idx) => {
        const gutter = /^[\s>]*$/.test(before) ? before : ' '.repeat(before.length)
        return before + store[Number(idx)].split('\n').join('\n' + gutter)
    })
}

// ---- JSX parsing ---------------------------------------------------------

/**
 * Read a tag starting at `i` (which must point at `<`). Tracks quotes and brace
 * depth so a `>` inside a prop expression doesn't end the tag early, and so a
 * tag may span lines.
 */
function readTag(src, i) {
    const m = /^<(\/?)([A-Za-z][\w.-]*)/.exec(src.slice(i))
    if (!m) return null

    let j = i + m[0].length, depth = 0, quote = null
    for (; j < src.length; j++) {
        const ch = src[j]
        if (quote) { if (ch === quote) quote = null; continue }
        if (ch === '"' || ch === "'") quote = ch
        else if (ch === '{') depth++
        else if (ch === '}') depth--
        else if (ch === '>' && depth === 0) break
    }
    if (j >= src.length) return null

    const raw = src.slice(i, j + 1)
    const selfClosing = /\/>$/.test(raw)
    return {
        tag: m[2],
        closing: m[1] === '/',
        selfClosing,
        attrs: raw.slice(m[0].length, selfClosing ? -2 : -1),
        end: j + 1,
    }
}

/** Grab one prop's value, whether quoted or a `{...}` expression. */
function attr(attrs, name) {
    const quoted = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`).exec(attrs)
    if (quoted) return quoted[2] ?? quoted[3]

    const at = attrs.search(new RegExp(`\\b${name}\\s*=\\s*\\{`))
    if (at === -1) return null

    const open = attrs.indexOf('{', at)
    let depth = 0
    for (let j = open; j < attrs.length; j++) {
        if (attrs[j] === '{') depth++
        else if (attrs[j] === '}' && --depth === 0) return attrs.slice(open + 1, j)
    }
    return null
}

/** Split on top-level commas, ignoring those nested in braces, brackets or quotes. */
function splitTop(s) {
    const parts = ['']
    let depth = 0, quote = null
    for (const ch of s) {
        if (quote) { parts[parts.length - 1] += ch; if (ch === quote) quote = null; continue }
        if (ch === '"' || ch === "'") quote = ch
        else if (ch === '{' || ch === '[') depth++
        else if (ch === '}' || ch === ']') depth--
        else if (ch === ',' && depth === 0) { parts.push(''); continue }
        parts[parts.length - 1] += ch
    }
    return parts
}

/** Build a node tree. Text nodes hold raw markdown, code placeholders intact. */
function parse(src) {
    const root = { tag: null, children: [] }
    const stack = [root]
    let text = ''
    const flush = () => { if (text) stack.at(-1).children.push({ text }); text = '' }

    for (let i = 0; i < src.length;) {
        if (src[i] !== '<') { text += src[i++]; continue }

        const t = readTag(src, i)
        if (!t) { text += src[i++]; continue }
        flush()
        i = t.end

        if (t.closing) {
            // Unwind to the matching open; tolerate a stray closer rather than derailing.
            const at = stack.findLastIndex((n) => n.tag === t.tag)
            if (at > 0) stack.length = at
            continue
        }
        const node = { tag: t.tag, attrs: t.attrs, children: [] }
        stack.at(-1).children.push(node)
        if (!t.selfClosing) stack.push(node)
    }
    flush()
    return root
}

// ---- rendering -----------------------------------------------------------

/** Strip JSX from an attribute value, e.g. a `<><Icon/> Client API</>` tab label. */
const attrText = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const unquote = (s) => s.replace(/^(["'`])([\s\S]*)\1$/, '$2')

/** `items={["A", "B"]}` -> ["A", "B"]. */
function tabLabels(attrs) {
    const raw = attr(attrs, 'items')
    if (!raw) return []
    return splitTop(raw.trim().replace(/^\[/, '').replace(/\]$/, ''))
        .map((s) => unquote(attrText(s)))
        .filter(Boolean)
}

const inline = (s) => s.replace(/\s*\n\s*/g, ' ').trim()

/** Render a container's children, dedented by the common indent of its body. */
const body = (node, ctx) => render(node.children, ctx, bodyIndent(node.children))

function renderTabs(node, labels, ctx) {
    return node.children
        .filter((c) => c.tag === 'Tabs.Tab')
        .map((tab, i) => `**${labels[i] || `Option ${i + 1}`}**\n\n${body(tab, ctx).trim()}`)
        .join('\n\n')
}

function renderTable(node, ctx) {
    const rows = []
    const collect = (n) => n.children?.forEach((c) => {
        if (c.tag === 'Tr') rows.push(c)
        else if (c.tag) collect(c)
    })
    collect(node)
    if (!rows.length) return ''

    const cells = rows.map((r) => r.children.filter((c) => c.tag === 'Th' || c.tag === 'Td')
        .map((c) => inline(body(c, ctx)).replace(/\|/g, '\\|')))
    const width = Math.max(...cells.map((r) => r.length))
    const pad = (r) => [...r, ...Array(width - r.length).fill('')]

    return [
        `| ${pad(cells[0]).join(' | ')} |`,
        `| ${Array(width).fill('---').join(' | ')} |`,
        ...cells.slice(1).map((r) => `| ${pad(r).join(' | ')} |`),
    ].join('\n')
}

function renderFileTree(node, depth = 0) {
    return node.children.filter((c) => c.tag).map((c) => {
        const name = attr(c.attrs, 'name') || ''
        const line = '  '.repeat(depth) + (c.tag === 'FileTree.Folder' ? `${name}/` : name)
        return c.children.length ? [line, renderFileTree(c, depth + 1)].join('\n') : line
    }).join('\n')
}

function renderNode(node, ctx) {
    const { tag, attrs = '' } = node

    if (DROPPED.has(tag) || /Icon$/.test(tag)) return ''
    if (TRANSPARENT.has(tag)) return body(node, ctx)

    switch (tag) {
        case 'Callout': {
            const label = CALLOUT_LABELS[attr(attrs, 'type')] || 'Note'
            const lines = [`**${label}:**`, '', ...body(node, ctx).trim().split('\n')]
            return lines.map((l) => (l ? `> ${l}` : '>')).join('\n')
        }
        case 'Tabs': return renderTabs(node, tabLabels(attrs), ctx)
        case 'SDKTabs': return renderTabs(node, SDK_TAB_LABELS, ctx)
        case 'Tabs.Tab': return body(node, ctx) // an orphan tab, outside <Tabs>

        case 'Cards.Card': {
            const title = attr(attrs, 'title') || inline(body(node, ctx))
            const href = attr(attrs, 'href')
            return href ? `- [${title}](${href})` : `- ${title}`
        }
        case 'ScenarioCard': {
            const title = attr(attrs, 'title') || ''
            const href = attr(attrs, 'href')
            const desc = inline(body(node, ctx))
            return `- ${href ? `[${title}](${href})` : `**${title}**`}${desc ? `: ${desc}` : ''}`
        }
        case 'Client': {
            const name = attr(attrs, 'name') || ''
            const platforms = attr(attrs, 'platformsFull') || attr(attrs, 'platforms') || ''
            const links = [['Play', attr(attrs, 'play')], ['Source', attr(attrs, 'source')]]
                .filter(([, url]) => url).map(([label, url]) => `[${label}](${url})`)
            return `- **${name}**${platforms ? ` (${platforms})` : ''}${links.length ? `: ${links.join(', ')}` : ''}`
        }

        case 'Table': return renderTable(node, ctx)
        case 'Tr': case 'Th': case 'Td': return inline(body(node, ctx)) // outside a <Table>
        case 'FileTree': return '```\n' + renderFileTree(node) + '\n```'
        case 'FileTree.Folder': case 'FileTree.File': return ''

        case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
            // A heading holding nothing but an image (the homepage hero) carries its text
            // in the alt, which is how a crawler reads it too.
            const img = node.children.find((c) => c.tag === 'img' || c.tag === 'Image')
            const text = img && !node.children.some((c) => c.text?.trim())
                ? inline(attr(img.attrs, 'alt') || '')
                : inline(body(node, ctx))
            return text ? `${'#'.repeat(Number(tag[1]))} ${text}` : ''
        }
        case 'summary': return `**${inline(body(node, ctx))}**`
        case 'figcaption': return `*${inline(body(node, ctx))}*`
        case 'code': return `\`${inline(body(node, ctx))}\``
        case 'b': case 'strong': return `**${inline(body(node, ctx))}**`
        case 'i': case 'em': return `*${inline(body(node, ctx))}*`
        case 'br': return '\n'
        case 'a': {
            const href = attr(attrs, 'href')
            return href ? `[${inline(body(node, ctx))}](${href})` : inline(body(node, ctx))
        }
        case 'img': case 'Image': {
            const src = attr(attrs, 'src')
            return src ? `![${attr(attrs, 'alt') || ''}](${src})` : ''
        }
        case 'iframe': {
            const src = attr(attrs, 'src')
            return src ? `[Video](${src})` : ''
        }
    }

    ctx.unknown.add(tag)
    return body(node, ctx)
}

function render(nodes, ctx, strip = 0) {
    return nodes
        .map((n) => (n.text !== undefined ? stripBody(n.text, strip) : renderNode(n, ctx)))
        .join('')
}

// ---- links ---------------------------------------------------------------

/** `/room#lock-room` -> `https://docs.colyseus.io/room.md#lock-room`, so a followed link stays in markdown. */
function absolutise(target) {
    const hash = target.indexOf('#')
    const route = (hash === -1 ? target : target.slice(0, hash)).replace(/\/$/, '')
    const anchor = hash === -1 ? '' : target.slice(hash)
    return ASSET_RE.test(route) ? SITE + route : `${SITE}${route || '/index'}.md${anchor}`
}

// ---- entry point ---------------------------------------------------------

/**
 * @param source raw `.mdx` contents
 * @param page   `{ route, title }` from the page index
 * @returns `{ markdown, unknown }` — `unknown` holds any component with no rule,
 *          which the caller should treat as a build failure.
 */
export function mdxToMarkdown(source, page) {
    const store = []
    const ctx = { unknown: new Set() }

    let src = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    src = protectCode(src, store)
    src = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    src = src.replace(/^[ \t]*import\s[\s\S]*?from\s*['"][^'"]*['"];?[ \t]*$/gm, '')

    let out = render(parse(src).children, ctx)
    out = out.replace(/\]\((\/[^)\s]*)\)/g, (_, t) => `](${absolutise(t)})`)

    // Normalise while the code is still stashed: trailing spaces and blank runs
    // are meaningful inside a fence, and this pass must not reach them.
    out = out.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n')
    out = restoreCode(out, store).trim()

    // Most pages open with their own h1; only add one when the body has none.
    const header = /^#\s+\S/.test(out) ? [] : [`# ${page.title}`, '']
    const source_url = `${SITE}${page.route === '/' ? '/' : page.route}`

    return {
        markdown: [...header, out, '', '---', `Source: ${source_url}`, ''].join('\n'),
        unknown: ctx.unknown,
    }
}
