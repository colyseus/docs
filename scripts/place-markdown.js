/**
 * Moves the markdown twins next to their pages after `next build`.
 *
 * The `/md/[...slug]` route renders every page as markdown (rules in
 * `lib/llms-markdown.ts`) into `out/md/<route>.md`; Netlify serves static files
 * only, so they have to sit at `out/<route>.md` for "append `.md` to any URL"
 * to hold.
 *
 * Also the last line of defence for the twins: an agent reading them is after
 * the API, so JSX leaking out of a component with no rule fails the build.
 */
import fs from 'node:fs'
import path from 'node:path'
import { outDir } from './lib/pages.js'

const mdDir = path.join(outDir, 'md')

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full, out)
        else if (entry.name.endsWith('.md')) out.push(full)
    }
    return out
}

/** JSX tags or MDX comments outside code: something with no markdown rule leaked through. */
function leaks(markdown) {
    let fenced = false
    const found = []
    markdown.split('\n').forEach((raw, i) => {
        const line = raw.replace(/^(\s*>)+/, '') // fences inside callouts (blockquotes)
        if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return }
        if (fenced) return
        const prose = line.replace(/`[^`]*`/g, '')
        if (/<\/?[A-Z][\w.]*[\s/>]|\{\/\*|\u0000/.test(prose)) found.push(`${i + 1}: ${raw.trim()}`)
    })
    return found
}

if (!fs.existsSync(mdDir)) {
    console.error('✗ out/md not found: run `next build` first')
    process.exit(1)
}

const files = walk(mdDir)
const problems = []
for (const file of files) {
    const rel = path.relative(mdDir, file)
    const markdown = fs.readFileSync(file, 'utf8')
    for (const leak of leaks(markdown)) problems.push(`${rel}:${leak}`)
    const dest = path.join(outDir, rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.renameSync(file, dest)
}
fs.rmSync(mdDir, { recursive: true })

if (problems.length) {
    console.error(`✗ JSX leaked into the markdown twins (add a rule in lib/llms-markdown.ts):\n  ${problems.join('\n  ')}`)
    process.exit(1)
}

const full = fs.statSync(path.join(outDir, 'llms-full.txt')).size
console.log(`✓ ${files.length} markdown twins + llms-full.txt (${(full / 1024).toFixed(0)} KB)`)
