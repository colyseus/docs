/**
 * Shared page index for the docs scripts.
 *
 * `generate-ai-nav.js` and `emit-markdown.js` both need the same route list and
 * the same frontmatter, so it lives here rather than in two copies that drift.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const pagesDir = path.join(root, 'pages')
export const publicDir = path.join(root, 'public')
export const outDir = path.join(root, 'out')

export const SITE = 'https://docs.colyseus.io'

export function frontmatter(src) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
    if (!m) return {}
    const out = {}
    for (const line of m[1].split('\n')) {
        const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
        if (kv) out[kv[1]] = kv[2].trim().replace(/^(["'])(.*)\1$/, '$2')
    }
    return out
}

const humanize = (slug) => slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * route -> { file, source, title, description }.
 *
 * `_`-prefixed files are MDX partials, not pages, and `404.mdx` is the redirect
 * map rather than content — both are excluded.
 */
export function indexPages(dir = pagesDir, pages = new Map()) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) { indexPages(full, pages); continue }
        if (!entry.name.endsWith('.mdx') || entry.name === '404.mdx') continue

        const src = fs.readFileSync(full, 'utf8')
        const fm = frontmatter(src)
        const rel = path.relative(pagesDir, full).replace(/\\/g, '/').replace(/\.mdx$/, '')
        const route = rel === 'index' ? '/' : '/' + rel.replace(/\/index$/, '')

        pages.set(route, {
            route,
            file: path.relative(root, full).replace(/\\/g, '/'),
            source: full,
            title: fm.title || /^#\s+(.+)$/m.exec(src)?.[1]?.trim() || humanize(path.basename(rel)),
            description: fm.description || '',
        })
    }
    return pages
}
