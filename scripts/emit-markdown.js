/**
 * Emits the raw-markdown surface of the docs, after `next build`:
 *
 * - `out/<route>.md`      — a markdown twin of every page
 * - `out/llms-full.txt`   — the same content as one corpus
 *
 * These are build artifacts, not committed. They are deterministic, ~1 MB in
 * total, and would bury every real change in review noise.
 *
 * Why twins at all: an agent that fetches a docs page gets HTML, and the code
 * fences and per-language tabs that carry the actual API survive that badly.
 * `llms.txt` advertises the convention so a crawler can find it.
 *
 * Two conditions fail the build rather than shipping degraded output:
 * an unknown component (nobody wrote a conversion rule for it), and JSX that
 * survived into the output outside a code fence.
 *
 * Usage: `npm run emit-markdown`, wired into `npm run build`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { indexPages, outDir, root, SITE } from './lib/pages.js'
import { mdxToMarkdown } from './lib/mdx-to-md.js'

/**
 * JSX that made it into the output, ignoring fenced blocks and inline code.
 * Fence tracking allows a `> ` gutter, since a fence inside a `<Callout>` is
 * legitimately blockquoted.
 */
function leakedJsx(markdown) {
    const hits = []
    let fenced = false

    markdown.split('\n').forEach((line, i) => {
        const bare = line.replace(/^[\s>]*/, '')
        if (/^(```|~~~)/.test(bare)) { fenced = !fenced; return }
        if (fenced) return

        const m = /<\/?[A-Za-z][\w.-]*/.exec(bare.replace(/(`+)[^`\n]+\1/g, ''))
        if (m) hits.push({ line: i + 1, text: line.trim().slice(0, 100) })
    })
    return hits
}

const pages = [...indexPages().values()].sort((a, b) => a.route.localeCompare(b.route))

if (!fs.existsSync(outDir)) {
    console.error(`✗ ${path.relative(root, outDir)}/ not found — run \`next build\` first`)
    process.exit(1)
}

const problems = []
const corpus = [
    '# Colyseus documentation',
    '',
    `Full text of every page at ${SITE}. Individual pages are available as markdown`,
    'by appending `.md` to any documentation URL.',
    '',
]

for (const page of pages) {
    const { markdown, unknown } = mdxToMarkdown(fs.readFileSync(page.source, 'utf8'), page)

    if (unknown.size) problems.push(`${page.file}: no conversion rule for <${[...unknown].join('>, <')}>`)
    for (const hit of leakedJsx(markdown)) problems.push(`${page.file}:${hit.line}: JSX in output — ${hit.text}`)

    const file = path.join(outDir, `${page.route === '/' ? '/index' : page.route}.md`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, markdown)

    corpus.push(markdown, '')
}

if (problems.length) {
    for (const p of problems) console.error(`  ${p}`)
    console.error(`\n✗ ${problems.length} conversion problem(s) — see scripts/lib/mdx-to-md.js`)
    process.exit(1)
}

const full = corpus.join('\n')
fs.writeFileSync(path.join(outDir, 'llms-full.txt'), full)

console.log(`✓ ${pages.length} markdown twins + llms-full.txt (${(full.length / 1024).toFixed(0)} KB)`)
