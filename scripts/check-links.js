/**
 * Internal link checker for the docs.
 *
 * Validates every internal markdown/JSX link in `pages/`:
 *
 * - **page links** (`/room`) resolve to an `.mdx` file or a directory route
 * - **anchors** (`/room#game-loop`, `#game-loop`) resolve to a real heading on
 *   the target page, slugged with `github-slugger` — the same slugger Nextra
 *   uses, so the results match what actually ships
 * - **assets** (`/images/foo.png`) resolve to a file in `public/`
 *
 * Anchor checking is the point: a link to a heading that was renamed still
 * loads the page, so it never shows up as a 404 and rots silently.
 *
 * Usage: `npm run check-links`. Exits non-zero when anything is broken.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import GithubSlugger from 'github-slugger'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = path.join(root, 'pages')
const publicDir = path.join(root, 'public')

const ASSET_RE = /\.(png|jpe?g|gif|svg|webp|ico|pdf|mp4|webm|mp3|wav|zip|json|txt)$/i

// `pages/404.mdx` holds the redirect map — its "links" are old URLs by design.
const SKIP_FILES = new Set([path.join(pagesDir, '404.mdx')])

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full, out)
        else if (entry.name.endsWith('.mdx')) out.push(full)
    }
    return out
}

/** Replace a matched span with blanks, preserving its newlines (line numbers stay put). */
const blank = (s) => s.replace(/[^\n]/g, ' ')

/**
 * Blank out regions that only look like content: fenced code blocks and
 * JSX/HTML comments (commented-out `<Cards.Card href>` entries are common here).
 * Line numbers are preserved so reports stay accurate.
 */
function stripNonContent(content) {
    let fenced = false
    return content.split('\n').map((line) => {
        if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return '' }
        return fenced ? '' : line
    }).join('\n')
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank)
        .replace(/<!--[\s\S]*?-->/g, blank)
}

/** Lines safe to scan for headings. Inline code is kept — `### `roomId`` is a real heading. */
const headingLines = (content) => stripNonContent(content).split('\n')

/** Lines safe to scan for links. Also drops inline code, so `` `[a](/b)` `` isn't a link. */
const linkLines = (content) => stripNonContent(content).replace(/`[^`\n]*`/g, blank).split('\n')

function routeOf(file) {
    const rel = path.relative(pagesDir, file).replace(/\\/g, '/').replace(/\.mdx$/, '')
    return rel === 'index' ? '/' : '/' + rel.replace(/\/index$/, '')
}

const files = walk(pagesDir)

// route -> Set of heading slugs. One slugger per file so duplicate headings get
// the same -1/-2 suffixes Nextra assigns.
const anchors = new Map()
for (const file of files) {
    const slugger = new GithubSlugger()
    const slugs = new Set()
    for (const line of headingLines(fs.readFileSync(file, "utf8"))) {
        const m = /^#{1,6}\s+(.+?)\s*$/.exec(line)
        if (!m) continue
        // Slug the *rendered* heading text: unwrap `[label](url)`, drop code ticks
        // and emphasis, so `## Self-hosting on [Vultr](https://…)` -> self-hosting-on-vultr.
        const text = m[1]
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/[`*_]/g, '')
            .trim()
        slugs.add(slugger.slug(text))
    }
    const route = routeOf(file)
    anchors.set(route, slugs)
}

// Directory routes (a folder with pages under it) are valid link targets even
// without their own .mdx.
const dirRoutes = new Set()
for (const route of anchors.keys()) {
    const parts = route.split('/').filter(Boolean)
    for (let i = 1; i < parts.length; i++) dirRoutes.add('/' + parts.slice(0, i).join('/'))
}

const LINK_PATTERNS = [
    /\]\((\/[^)\s]*|#[^)\s]*)\)/g,        // markdown [text](/path#anchor)
    /(?:href|src)="(\/[^"]*|#[^"]*)"/g,   // JSX href/src
    // Bare "/path#anchor" string literals in JSX props — covers the <MovedAnchors>
    // redirect maps, whose targets would otherwise never be validated.
    /"(\/[^"\s]*#[^"\s]*)"/g,
]

function extractLinks(content) {
    const links = new Map() // "line:target" -> entry, so overlapping patterns don't double-report
    linkLines(content).forEach((line, i) => {
        for (const re of LINK_PATTERNS) {
            for (const m of line.matchAll(re)) links.set(`${i + 1}:${m[1]}`, { target: m[1], line: i + 1 })
        }
    })
    return [...links.values()]
}

const broken = []

// ---- 404.mdx redirect-map lint ----
// The map's entries aren't markdown links, so the main pass skips the file.
// Three failure modes rot silently without this: a `to:` target that doesn't
// resolve (page or anchor), a `from:` that matches a live route (the entry can
// never fire — usually a reversed mapping), and an entry shadowed by an earlier
// one (matching is `currentPath.includes(from)` + first-hit).
{
    const file = path.join(pagesDir, '404.mdx')
    const src = fs.readFileSync(file, 'utf8')
    const lineAt = (idx) => src.slice(0, idx).split('\n').length
    const report = (line, target, reason) => broken.push({ file, line, target, reason })

    const entries = []
    for (const m of src.matchAll(/from:\s*"([^"]+)"/g)) entries.push({ from: m[1], line: lineAt(m.index) })

    for (const m of src.matchAll(/to:\s*"([^"]+)"/g)) {
        const line = lineAt(m.index)
        const hashAt = m[1].indexOf('#')
        const route = (hashAt === -1 ? m[1] : m[1].slice(0, hashAt)).replace(/\/$/, '') || '/'
        const anchor = hashAt === -1 ? '' : m[1].slice(hashAt + 1)
        if (!anchors.has(route)) {
            if (!dirRoutes.has(route)) report(line, m[1], 'redirect target not found')
        } else if (anchor && !anchors.get(route).has(anchor)) {
            report(line, m[1], `no such heading on ${route}`)
        }
    }

    for (let i = 0; i < entries.length; i++) {
        const { from, line } = entries[i]
        // A live route serves 200 (with or without a fragment), so the 404 page
        // — and this entry — can never run for it.
        const fromRoute = (from.split('#')[0]).replace(/\/$/, '') || '/'
        if (anchors.has(fromRoute)) {
            report(line, from, 'from: matches a live route — entry can never fire')
        }
        const shadow = entries.slice(0, i).find((e) => from.includes(e.from))
        if (shadow) report(line, from, `shadowed by earlier entry "${shadow.from}" (line ${shadow.line})`)
    }
}

for (const file of files) {
    if (SKIP_FILES.has(file)) continue
    const selfRoute = routeOf(file)

    for (const { target, line } of extractLinks(fs.readFileSync(file, 'utf8'))) {
        const hashAt = target.indexOf('#')
        let route = hashAt === -1 ? target : target.slice(0, hashAt)
        const anchor = hashAt === -1 ? '' : target.slice(hashAt + 1)

        // Bare "#anchor" points at the current page.
        route = route === '' ? selfRoute : route.replace(/\/$/, '') || '/'

        const report = (reason) => broken.push({ file, line, target, reason })

        if (ASSET_RE.test(route)) {
            if (!fs.existsSync(path.join(publicDir, route))) report('asset not found')
            continue
        }

        if (!anchors.has(route)) {
            if (!dirRoutes.has(route)) report('page not found')
            continue // directory route — no page of its own, so no anchors to check
        }

        if (anchor && !anchors.get(route).has(anchor)) {
            report(`no such heading on ${route}`)
        }
    }
}

if (broken.length === 0) {
    console.log(`✓ ${files.length} pages checked — no broken internal links`)
    process.exit(0)
}

const byFile = new Map()
for (const b of broken) {
    const key = path.relative(root, b.file)
    if (!byFile.has(key)) byFile.set(key, [])
    byFile.get(key).push(b)
}

for (const [file, items] of [...byFile].sort()) {
    console.log(`\n${file}`)
    for (const b of items) console.log(`  ${b.line}: ${b.target}  — ${b.reason}`)
}
console.log(`\n✗ ${broken.length} broken internal link(s) across ${byFile.size} file(s)`)
process.exit(1)
