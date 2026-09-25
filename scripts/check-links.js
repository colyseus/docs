/**
 * Internal link checker for the docs.
 *
 * Validates, against the same page tree and heading ids the site ships:
 *
 * - **page links** (`/room`) resolve to a page
 * - **anchors** (`/room#game-loop`, `#game-loop`) resolve to a real heading,
 *   slugged by Fumadocs' own `remarkHeading`
 * - **assets** (`/images/foo.png`) resolve to a file in `public/`
 * - **`movedAnchors`** frontmatter: targets resolve, and no key is still a live
 *   heading on its own page (the redirect would hijack a working anchor)
 * - **`public/_redirects`**: targets resolve, no rule is dead, shadowed, or loops
 *
 * Plus the content conventions a build would only catch as a runtime bug:
 * no imports (components are global), no relative links, no links inside
 * headings (nested <a> breaks hydration), and tabs with explicit values.
 *
 * Anchor checking is the point: a link to a heading that was renamed still
 * loads the page, so it never shows up as a 404 and rots silently.
 *
 * Usage: `pnpm check-links`. Exits non-zero when anything is broken.
 */
import fs from 'node:fs'
import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'
import { remarkHeading } from 'fumadocs-core/mdx-plugins'
import { loadSource, publicDir, root } from './lib/pages.js'

const ASSET_RE = /\.(png|jpe?g|gif|svg|webp|ico|pdf|mp4|webm|mp3|wav|zip|json|txt|xml|md)$/i
// Written by the build, so not in public/.
const GENERATED = new Set(['/llms-full.txt', '/sitemap.xml', '/api/search.json'])
const LANGUAGES = new Set(['TypeScript', 'JavaScript', 'C#', 'Lua', 'Haxe', 'GDScript', 'Dart'])

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkFrontmatter).use(remarkHeading)

const { source, pages } = loadSource()
const broken = []
const report = (file, line, target, reason) => broken.push({ file, line, target, reason })

// ---- pass 1: parse every page, collect heading ids ------------------------

const parsed = new Map() // route -> { page, tree }
const anchors = new Map() // route -> Set of heading ids
for (const page of pages.values()) {
    const file = { value: fs.readFileSync(page.source, 'utf8'), data: {} }
    const tree = processor.runSync(processor.parse(file.value), file)
    const ids = new Set()
    visit(tree, 'heading', (h) => { if (h.data?.hProperties?.id) ids.add(h.data.hProperties.id) })
    anchors.set(page.route, ids)
    parsed.set(page.route, { page, tree })
}

/** `null` when `target` resolves, else the reason it doesn't. */
function resolve(target, selfRoute) {
    const hashAt = target.indexOf('#')
    let route = hashAt === -1 ? target : target.slice(0, hashAt)
    const anchor = hashAt === -1 ? '' : decodeURIComponent(target.slice(hashAt + 1))
    route = route === '' ? selfRoute : route.replace(/\/$/, '') || '/'
    if (ASSET_RE.test(route)) {
        return GENERATED.has(route) || fs.existsSync(path.join(publicDir, route)) ? null : 'asset not found'
    }
    if (!anchors.has(route)) return 'page not found'
    if (anchor && !anchors.get(route).has(anchor)) return `no such heading on ${route}`
    return null
}

const attr = (node, name) => node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name)?.value

// ---- pass 2: links and conventions per page -------------------------------

for (const { page, tree } of parsed.values()) {
    const file = page.file
    const check = (target, line) => {
        if (/^(\.\.?\/|[\w-]+\.mdx?(#|$))/.test(target)) return report(file, line, target, 'relative link: use the absolute route')
        if (!target.startsWith('/') && !target.startsWith('#')) return // external
        const reason = resolve(target, page.route)
        if (reason) report(file, line, target, reason)
    }

    visit(tree, (node) => {
        const line = node.position?.start.line
        switch (node.type) {
            case 'link':
            case 'definition':
            case 'image':
                check(node.url, line)
                break
            case 'mdxjsEsm':
                report(file, line, 'import', 'no imports in content: register the component in components/mdx.tsx')
                break
            case 'heading': {
                let hasLink = false
                visit(node, 'link', () => { hasLink = true })
                if (hasLink) report(file, line, 'heading', 'link inside a heading: the heading anchor wraps it, and a nested <a> breaks hydration')
                break
            }
            case 'mdxJsxFlowElement':
            case 'mdxJsxTextElement': {
                for (const name of ['href', 'src']) {
                    const v = attr(node, name)
                    if (typeof v === 'string') check(v, line)
                }
                if (node.name === 'Tabs' || node.name === 'LangTabs') {
                    // a one-line <Tab> parses as inline JSX inside a paragraph
                    const tabs = node.children.flatMap((c) => (c.type === 'paragraph' ? c.children : [c]))
                    const values = tabs.filter((c) => c.name === 'Tab').map((t) => attr(t, 'value'))
                    if (values.some((v) => typeof v !== 'string')) report(file, line, node.name, '<Tab> without a string value')
                    if (new Set(values).size !== values.length) report(file, line, node.name, 'duplicate <Tab> values')
                    if (node.name === 'LangTabs') {
                        for (const v of values) if (typeof v === 'string' && !LANGUAGES.has(v)) report(file, line, v, `not a LangTabs language (${[...LANGUAGES].join(', ')})`)
                    }
                }
                break
            }
        }
    })

    for (const [slug, target] of Object.entries(page.data.movedAnchors ?? {})) {
        if (anchors.get(page.route).has(slug)) report(file, 1, `movedAnchors.${slug}`, 'still a live heading on this page')
        const reason = resolve(target, page.route)
        if (reason) report(file, 1, `movedAnchors.${slug}: ${target}`, reason)
    }
}

// ---- meta.json link items ---------------------------------------------------

{
    const walk = (dir) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, e.name)
            if (e.isDirectory()) walk(full)
            else if (e.name === 'meta.json') {
                for (const item of JSON.parse(fs.readFileSync(full, 'utf8')).pages ?? []) {
                    const m = /^(?:\[[^\]]*\])?\[[^\]]*\]\((\/[^)]*)\)$/.exec(item)
                    if (!m) continue
                    const reason = resolve(m[1], '/')
                    if (reason) report(path.relative(root, full), 1, m[1], reason)
                }
            }
        }
    }
    walk(path.join(root, 'content', 'docs'))
}

// ---- public/_redirects --------------------------------------------------------
// Netlify: first match wins; `/x/*` matches `/x` and everything under it;
// a rule never fires for a path that is a live page (no `!` force).

{
    const file = 'public/_redirects'
    const rules = []
    fs.readFileSync(path.join(root, file), 'utf8').split('\n').forEach((raw, i) => {
        const line = raw.trim()
        if (!line || line.startsWith('#')) return // `#` mid-line is a URL fragment, not a comment
        const [from, to, status = '301', ...rest] = line.split(/\s+/)
        const r = { from, to, status, line: i + 1 }
        if (rest.length || !to) return report(file, r.line, raw.trim(), 'expected: from  to  [status]')
        if (!/^\/[^*]*(\/\*)?$/.test(from)) return report(file, r.line, from, '`*` only as a trailing `/*`')
        if (!/^(301|302)!?$/.test(status)) return report(file, r.line, status, 'use 301 (or 302)')
        rules.push(r)
    })

    const isSplat = (r) => r.from.endsWith('/*')
    const prefix = (r) => r.from.slice(0, -2)
    const matches = (r, p) => (isSplat(r) ? p === prefix(r) || p.startsWith(prefix(r) + '/') : p === r.from)
    const apply = (r, p) => (isSplat(r) ? r.to.replace(':splat', p.slice(prefix(r).length + 1)).replace(/\/$/, '') || '/' : r.to)
    const live = (p) => anchors.has(p.split('#')[0])

    rules.forEach((r, i) => {
        // target
        const target = r.to.includes(':splat') ? r.to.split('/:splat')[0] || '/' : r.to
        if (target.startsWith('/')) {
            const reason = resolve(target, '/')
            if (reason) report(file, r.line, r.to, reason)
        }
        // dead: Netlify serves the live page and skips the rule
        if (!isSplat(r) && live(r.from)) report(file, r.line, r.from, 'from is a live page: the rule can never fire')
        // shadowed by an earlier rule
        const probe = isSplat(r) ? prefix(r) + '/__probe' : r.from
        const earlier = rules.slice(0, i).find((e) => matches(e, probe) && (isSplat(r) ? isSplat(e) : true))
        if (earlier) report(file, r.line, r.from, `shadowed by line ${earlier.line} (${earlier.from})`)
        // loops and dead ends
        let p = probe
        const seen = new Set([p])
        for (let hop = 0; hop < 5; hop++) {
            if (live(p)) break
            const next = rules.find((x) => matches(x, p.split('#')[0]))
            if (!next) {
                if (!isSplat(r)) report(file, r.line, r.from, `redirect chain ends at ${p}, which is not a page`)
                break
            }
            p = apply(next, p.split('#')[0])
            if (seen.has(p)) { report(file, r.line, r.from, `redirect loop through ${p}`); break }
            seen.add(p)
        }
    })
}

// ---- report ----------------------------------------------------------------

if (broken.length === 0) {
    console.log(`✓ ${pages.size} pages checked — no broken internal links`)
    process.exit(0)
}

const byFile = new Map()
for (const b of broken) {
    if (!byFile.has(b.file)) byFile.set(b.file, [])
    byFile.get(b.file).push(b)
}
for (const [file, items] of [...byFile].sort()) {
    console.log(`\n${file}`)
    for (const b of items) console.log(`  ${b.line}: ${b.target}  — ${b.reason}`)
}
console.log(`\n✗ ${broken.length} problem(s) across ${byFile.size} file(s)`)
process.exit(1)
