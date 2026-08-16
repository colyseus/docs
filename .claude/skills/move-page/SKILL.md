---
name: move-page
description: Move, rename, merge, or delete a docs page or a heading while keeping old URLs alive. Use when a page changes route, a section is split out of a page, a heading is renamed, or a page is deprecated.
---

Structural edits break inbound links from Discord answers, blog posts, and
bookmarks. Two different mechanisms cover two different breakages, and picking
the wrong one fails silently: the page still loads, so nothing reports an error.

## Which mechanism

| What moved | Mechanism |
| --- | --- |
| A page route | An entry in the `redirects` array in `pages/404.mdx` |
| A whole subtree, heading slugs preserved | Same entry, plus `replace: true` |
| A heading off a page that still exists | `<MovedAnchors>` on the **source** page |
| A heading renamed in place | `<MovedAnchors>` on that page, keyed on the old slug |

The split exists because `pages/404.mdx` only runs when Next actually serves a
404. `/room#lock-room` returns 200 when `/room` still exists, so the redirect map
never fires, and browsers never send the fragment to the server anyway. See
`components/moved-anchors.tsx` for the full reasoning.

A page that moves **and** loses headings needs both.

## Steps

1. **Move the files.** `git mv` the `.mdx`, and its sibling directory and
   `_meta.ts` when the page has children.

2. **Update the owning `_meta.ts`.** Remove the key from the old parent, add it
   to the new one, in the position the sidebar should show it.

3. **Add the redirect** to the `redirects` array in `pages/404.mdx`.

   Matching is `currentPath.includes(from)` against `pathname + hash`, resolved
   by `.find()`, so **the first entry that matches anywhere in the path wins**:

   - Put the specific entry above the general one. `/room/built-in/relay` must
     precede `/room/built-in`, or the bare entry swallows it.
   - `replace: true` rewrites the matched span and keeps the rest of the path
     and the hash. Use it for a subtree whose heading slugs survived the move.
     Without it, every URL under `from` lands on the single `to` page.
   - A bare parent entry is a prefix match on everything below it. Place it last
     within its group, and comment why when the ordering is load-bearing.

4. **Add `<MovedAnchors>`** to every page that kept its route but lost a heading,
   directly below the H1:

   ```mdx
   <MovedAnchors map={{
     "lock-room": "/matchmaker/visibility#lock-room",
   }} />
   ```

   Keys are bare slugs, no leading `#`. Values are absolute paths. A heading you
   reworded is a moved anchor too, even though the file never moved.

5. **Regenerate the navigation surface:** `pnpm generate:ai-nav`. It rewrites
   `public/llms.txt`, `sitemap.xml`, and `robots.txt` from the `_meta` files.
   Never hand-edit those three.

6. **Check:** `pnpm check-links && pnpm check:ai-nav`.

## What the checks already cover

`scripts/check-links.js` validates every internal link and anchor against real
heading slugs, lints the redirect map (each `to` resolves, and each `from` is
reported when it still serves a live route), and validates `<MovedAnchors>`
targets. Do not re-verify those by hand.

It cannot tell you that an anchor was *supposed* to be preserved. Nothing links
to `/room#lock-room` from inside the repo, so nothing flags its disappearance.
That judgement is step 4, and it is the step that gets skipped.

## Done when

- `pnpm check-links` and `pnpm check:ai-nav` both pass.
- Every route the page answered to before still reaches content.
- Every heading slug that left a surviving page has a `<MovedAnchors>` key.
- Ordering in `pages/404.mdx` puts each specific entry above its general one.
