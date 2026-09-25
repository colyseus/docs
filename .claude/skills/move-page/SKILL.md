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
| A page route | A rule in `public/_redirects` |
| A whole subtree, heading slugs preserved | A `/old/*  /new/:splat  301` rule |
| A heading off a page that still exists | `movedAnchors` in the **source** page's frontmatter |
| A heading renamed in place | `movedAnchors` on that page, keyed on the old slug |
| A page moved between sidebar tabs (route groups) | Nothing: `(group)` folders are not part of the URL |

The split exists because Netlify only applies `_redirects` to a path that has no
page. `/room#lock-room` is served by `/room`, which still exists, and browsers
never send the fragment to the server anyway. The page itself has to redirect
the anchor, in the browser: see `components/mdx/moved-anchors.tsx`.

A 301 keeps the fragment, so an anchor on a page that moved *and* was renamed
lands on the new page: map it there with `movedAnchors`.

## Steps

1. **Move the files.** `git mv` the `.mdx` (a page with children is
   `folder/index.mdx`). A move is its own commit when it touches many pages, so
   rename detection keeps `git log --follow` and blame intact.

2. **Update the owning `meta.json`.** Remove the slug from the old parent's
   `pages`, add it to the new one in the position the sidebar should show it.
   A page missing from `pages` drops out of the sidebar, and `check:ai-nav`
   fails on it.

3. **Add the redirect** to `public/_redirects`:

   ```
   /old/page                     /new/page                          301
   /old/page/*                   /new/page/:splat                   301
   ```

   - First match wins, top to bottom. Put the specific rule above the general
     one: `/room/built-in/relay` must precede `/room/built-in/*`.
   - `/x/*` also matches deeper paths. With `:splat` the rest of the path
     carries over; without it, everything under `/x` lands on one page.
   - A rule for a path that still has a page never fires.

4. **Add `movedAnchors`** to every page that kept its route but lost a heading:

   ```yaml
   ---
   title: "Rooms"
   # Visibility moved to the Matchmaking section.
   movedAnchors:
     lock-room: "/matchmaker/visibility#lock-room"
   ---
   ```

   Keys are bare slugs, no leading `#`. Values are absolute paths. A heading you
   reworded is a moved anchor too, even though the file never moved. A YAML
   comment above the map says why, for the next person.

5. **Regenerate the navigation surface:** `pnpm generate:ai-nav`. It rewrites
   `public/llms.txt`, `sitemap.xml`, and `robots.txt` from the page tree.
   Never hand-edit those three.

6. **Check:** `pnpm check-links && pnpm check:ai-nav`.

## What the checks already cover

`scripts/check-links.js` validates every internal link and anchor against the
heading ids Fumadocs renders. It lints `public/_redirects`: each target
resolves, and no rule is dead, shadowed by an earlier one, or loops. It checks
that every `movedAnchors` target resolves and that no key is still a live
heading. Do not re-verify those by hand.

It cannot tell you that an anchor was *supposed* to be preserved. Nothing links
to `/room#lock-room` from inside the repo, so nothing flags its disappearance.
That judgement is step 4, and it is the step that gets skipped.

## Done when

- `pnpm check-links` and `pnpm check:ai-nav` both pass.
- Every route the page answered to before still reaches content.
- Every heading slug that left a surviving page has a `movedAnchors` key.
- Each specific rule in `public/_redirects` sits above its general one.
