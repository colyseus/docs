/**
 * Prose linter for the docs — runs Vale over `pages/` with the rules in
 * `styles/Colyseus/` and the terminology table in `STYLE.md`.
 *
 * Vale is a single Go binary and is intentionally *not* an npm dependency: the
 * only npm wrapper is pinned to Vale 2.x, and this repo keeps its dependency
 * tree small. CI installs it via `errata-ai/vale-action`.
 *
 * Missing binary is a warning, not a failure — CI is the authoritative gate, so
 * a contributor without Vale installed can still commit.
 *
 * Usage: `npm run lint:prose`. Exits non-zero on errors (terminology), not on
 * warnings (sentence length, ambiguous `This`, idioms).
 */
import { spawnSync } from 'node:child_process'

const result = spawnSync('vale', ['pages/'], { stdio: 'inherit' })

if (result.error?.code === 'ENOENT') {
    console.warn(
        '\n⚠ Vale is not installed — skipping the prose lint.\n' +
        '  macOS:  brew install vale\n' +
        '  other:  https://vale.sh/docs/install\n' +
        '  CI runs it regardless, so a violation will still be caught there.\n'
    )
    process.exit(0)
}

process.exit(result.status ?? 1)
