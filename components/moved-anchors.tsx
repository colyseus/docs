import React from "react";

/**
 * Client-side redirect for anchors that moved off this page onto a child page.
 *
 * When a section is extracted from a large page, links like `/room#lock-room`
 * keep resolving to a page that still exists — Next serves it with a 200, so
 * `pages/404.mdx` never runs and its redirect map can't help. Server-side
 * redirects can't help either: browsers never send the fragment upstream.
 * A tiny inline script on the *source* page is the only thing that can catch it.
 *
 * Keeps external inbound links working — Discord answers, blog posts, bookmarks.
 *
 * Usage in MDX, right below the H1:
 *
 *   <MovedAnchors map={{
 *     "lock-room": "/room/visibility#lock-room",
 *     "on-create": "/room/lifecycle#on-create",
 *   }} />
 *
 * Keys are bare slugs (no leading `#`); values are absolute paths.
 * Uses `location.replace` so the stale URL doesn't linger in history.
 */
export function MovedAnchors({ map }: { map: Record<string, string> }) {
    const script = `(function () {
  var moved = ${JSON.stringify(map)};
  function go() {
    var to = moved[window.location.hash.replace(/^#/, "")];
    if (to) window.location.replace(to);
  }
  go();
  window.addEventListener("hashchange", go);
})();`;

    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
