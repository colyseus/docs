/**
 * Shared page index for the docs scripts.
 *
 * Runs the site's own Fumadocs `loader()` over `content/docs` (frontmatter and
 * meta.json only, no MDX compile), so routes, sidebar order, and sidebar labels
 * come from the same code that builds the site instead of a re-implementation.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as parseYaml } from 'js-yaml'
import { loader } from 'fumadocs-core/source'
import { sidebarTitle } from '../../lib/source-plugins.js'

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const docsDir = path.join(root, 'content', 'docs')
export const publicDir = path.join(root, 'public')
export const outDir = path.join(root, 'out')

export const site = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'))
export const SITE = site.url

export function frontmatter(src) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
    return m ? parseYaml(m[1]) ?? {} : {}
}

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full, out)
        else out.push(full)
    }
    return out
}

/**
 * `{ source, pages }`: the loader output, plus route -> { route, file, title,
 * description, data } where `file` is repo-relative (`content/docs/(docs)/room/index.mdx`).
 */
export function loadSource() {
    const files = walk(docsDir).flatMap((absolutePath) => {
        const rel = path.relative(docsDir, absolutePath).split(path.sep).join('/')
        const src = fs.readFileSync(absolutePath, 'utf8')
        if (rel.endsWith('meta.json')) return [{ type: 'meta', path: rel, absolutePath, data: JSON.parse(src) }]
        if (rel.endsWith('.mdx')) return [{ type: 'page', path: rel, absolutePath, data: frontmatter(src) }]
        return []
    })
    const source = loader({ baseUrl: '/', source: { files }, plugins: [sidebarTitle()] })

    const pages = new Map()
    for (const page of source.getPages()) {
        pages.set(page.url, {
            route: page.url,
            file: path.relative(root, page.absolutePath).split(path.sep).join('/'),
            source: page.absolutePath,
            title: page.data.title,
            description: page.data.description ?? '',
            data: page.data,
        })
    }
    return { source, pages }
}
