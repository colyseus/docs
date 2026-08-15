/**
 * Generates the machine-readable navigation surface for the docs:
 *
 * - `public/llms.txt`     — llms.txt index, one line per page carrying that
 *                           page's frontmatter description
 * - `public/sitemap.xml`  — every route, with `lastmod` from git
 * - `public/robots.txt`   — points crawlers at the sitemap
 *
 * All three are derived from the `_meta` files under `pages/` and from each
 * page's frontmatter, so the index cannot drift out of sync with the sidebar
 * the way a hand-written one does. Sections come from the top-level separators,
 * order comes from the meta keys, and any page missing from a meta file is
 * appended rather than dropped — coverage is structural, not curated.
 *
 * Usage: `npm run generate:ai-nav` (runs automatically as `prebuild`).
 * `--check` regenerates in memory and exits non-zero if the committed files are
 * stale, so CI catches a sidebar change that was never rebuilt.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { indexPages, pagesDir, publicDir, root, SITE } from './lib/pages.js'

const SITE_TITLE = 'Colyseus'

// Entries after the last titled separator in pages/_meta.tsx (roadmap, sponsors)
// have no section of their own.
const FALLBACK_SECTION = 'Project'

const META_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.json']

// ---- _meta loading -------------------------------------------------------
// The meta files are TSX with JSX titles and icon imports, so they can't be
// imported from plain node. They are also plain object literals, so stripping
// the imports and reducing each JSX title to its text leaves valid JS.

/** Drop balanced `{...}` expression containers, e.g. the `{unity({...})}` icon calls. */
function stripExpressions(s) {
    let out = '', depth = 0
    for (const ch of s) {
        if (ch === '{') depth++
        else if (ch === '}') depth = Math.max(0, depth - 1)
        else if (depth === 0) out += ch
    }
    return out
}

/** `<span><ZapIcon/> Netcode</span>` -> `"Netcode"`. */
const jsxToString = (src) =>
    src.replace(/<span[^>]*>([\s\S]*?)<\/span>/g, (_, inner) =>
        JSON.stringify(stripExpressions(inner).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()))

function loadMeta(dir) {
    const file = META_EXTS.map((ext) => path.join(dir, `_meta${ext}`)).find((f) => fs.existsSync(f))
    if (!file) return {}

    const src = fs.readFileSync(file, 'utf8')
    if (file.endsWith('.json')) return JSON.parse(src)

    const js = jsxToString(src)
        .replace(/^\s*import\s[\s\S]*?from\s*['"][^'"]*['"];?[ \t]*$/gm, '')
        .replace(/export\s+default\s*/, 'return ')
    try {
        return new Function(js)() ?? {}
    } catch (err) {
        throw new Error(`could not read ${path.relative(root, file)}: ${err.message}`)
    }
}

// ---- sidebar walk --------------------------------------------------------

/** Meta keys first (sidebar order), then anything on disk the meta forgot. */
function orderedKeys(dir, meta) {
    const onDisk = new Set()
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
        if (entry.isDirectory()) onDisk.add(entry.name)
        else if (entry.name.endsWith('.mdx') && entry.name !== '404.mdx') onDisk.add(entry.name.replace(/\.mdx$/, ''))
    }
    const keys = Object.keys(meta)
    for (const key of [...onDisk].sort()) if (!keys.includes(key)) keys.push(key)
    return keys
}

/**
 * Flattens the sidebar into `{ route, title, section }`, depth-first.
 * `section` is inherited from the top-level separator the entry sits under.
 */
function walkNav(dir, prefix, section, out, pages, depth = 0) {
    const meta = loadMeta(dir)

    for (const key of orderedKeys(dir, meta)) {
        const entry = meta[key] ?? ''

        if (entry?.type === 'separator') {
            // Only the top level maps separators onto llms.txt sections; the
            // nested ones (Setup/Development/Production) just group visually.
            if (depth === 0) section = entry.title || FALLBACK_SECTION
            continue
        }
        // Menus and `href` entries point off-tree or duplicate an existing route.
        if (entry?.type === 'menu' || entry?.href) continue

        const route = key === 'index' && depth === 0 ? '/' : `${prefix}/${key}`
        const page = pages.get(route)
        if (page) {
            const metaTitle = typeof entry === 'string' ? entry : entry?.title
            out.push({ route, title: (typeof metaTitle === 'string' && metaTitle) || page.title, section })
        }

        const childDir = path.join(dir, key)
        if (fs.existsSync(childDir) && fs.statSync(childDir).isDirectory()) {
            walkNav(childDir, route === '/' ? '' : route, section, out, pages, depth + 1)
        }
    }
    return out
}

// ---- git lastmod ---------------------------------------------------------

/**
 * file -> ISO date of the commit that last touched it, in one `git log` pass.
 * Shallow clones only know the tip commit, which would stamp every page with
 * the same date — worse than no `lastmod` at all, so bail out.
 */
function lastModified() {
    const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    const dates = new Map()
    try {
        if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') return dates
        let date = null
        for (const line of git(['log', '--format=%cI', '--name-only', '--no-renames', '--', 'pages']).split('\n')) {
            if (!line.trim()) continue
            if (/^\d{4}-\d{2}-\d{2}T/.test(line)) date = line.trim()
            else if (date && !dates.has(line)) dates.set(line, date) // first hit = newest
        }
    } catch {
        // not a git checkout, or git unavailable — omit lastmod
    }
    return dates
}

// ---- renderers -----------------------------------------------------------

function renderLlms(nav, pages) {
    const home = pages.get('/')
    const version = /v(\d+\.\d+)/.exec(fs.readFileSync(path.join(root, 'theme.config.tsx'), 'utf8'))?.[1]

    const lines = [`# ${SITE_TITLE}`, '']
    if (home?.description) lines.push(`> ${home.description}`, '')
    if (version) lines.push(`Documentation for Colyseus ${version}.`, '')

    // Without this the markdown twins exist but nothing points at them.
    lines.push(
        `Every page is also available as raw markdown: append \`.md\` to any URL, e.g. ${SITE}/room.md.`,
        `The full corpus is at ${SITE}/llms-full.txt.`,
        '',
    )

    let section = null
    for (const item of nav) {
        if (item.section !== section) {
            section = item.section
            if (lines.at(-1) !== '') lines.push('')
            lines.push(`## ${section}`, '')
        }
        // The home page's description is already the `>` blurb above.
        const description = item.route === '/' ? '' : pages.get(item.route).description
        const url = item.route === '/' ? `${SITE}/` : SITE + item.route
        lines.push(`- [${item.title}](${url})${description ? `: ${description}` : ''}`)
    }
    return lines.join('\n').trimEnd() + '\n'
}

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderSitemap(nav, pages) {
    const dates = lastModified()
    const urls = [...new Set(nav.map((i) => i.route))].sort().map((route) => {
        const lastmod = dates.get(pages.get(route).file)
        return [
            '  <url>',
            `    <loc>${xmlEscape(route === '/' ? `${SITE}/` : SITE + route)}</loc>`,
            ...(lastmod ? [`    <lastmod>${lastmod.slice(0, 10)}</lastmod>`] : []),
            '  </url>',
        ].join('\n')
    })
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n')
}

const renderRobots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`

// ---- main ----------------------------------------------------------------

const pages = indexPages()
const nav = walkNav(pagesDir, '', FALLBACK_SECTION, [], pages)

const covered = new Set(nav.map((i) => i.route))
const orphans = [...pages.keys()].filter((r) => !covered.has(r))
const undescribed = nav.filter((i) => !pages.get(i.route).description)

const outputs = {
    'llms.txt': renderLlms(nav, pages),
    'sitemap.xml': renderSitemap(nav, pages),
    'robots.txt': renderRobots(),
}

const check = process.argv.includes('--check')
const stale = []

for (const [name, content] of Object.entries(outputs)) {
    const file = path.join(publicDir, name)
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (current === content) continue
    if (check) stale.push(name)
    else fs.writeFileSync(file, content)
}

for (const item of undescribed) console.warn(`! ${item.route} has no frontmatter description`)
for (const route of orphans) console.warn(`! ${route} is not reachable from the sidebar`)

if (check && stale.length) {
    console.log(`\n✗ stale: ${stale.join(', ')} — run \`npm run generate:ai-nav\` and commit the result`)
    process.exit(1)
}

console.log(`✓ ${check ? 'up to date' : 'generated'}: ${Object.keys(outputs).join(', ')} (${nav.length} pages)`)
