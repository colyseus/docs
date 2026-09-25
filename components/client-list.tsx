import React from "react";
import { LinkExternalIcon, MarkGithubIcon } from "@primer/octicons-react";
import { Logo, type LogoName } from "@/lib/icons";

/**
 * The engine line-up for a demo project — one compact row per client
 * implementation, replacing a wide markdown table with a per-row screenshot.
 *
 * Every client of a given demo renders the same game, so a screenshot per row
 * carries no signal; the engine logo is what actually identifies the row.
 *
 * Usage in MDX:
 *
 *   <ClientList>
 *     <Client engine="unity" name="Unity"
 *         platforms="Desktop · Web · Mobile"
 *         platformsFull="Windows, macOS, Linux, WebGL, iOS, Android"
 *         play="https://…" source="https://…" />
 *   </ClientList>
 *
 * `engine` keys into the logo registry in `lib/icons.tsx`; omit it for clients with no logo
 * on hand and the row falls back to its name alone. `platforms` is the short
 * scannable label, `platformsFull` the exact list, surfaced on hover.
 *
 * Styling lives in `style.css` (`.client-list` / `.client-row`), same approach
 * as demo-card.tsx.
 */

export function ClientList({ children }: { children: React.ReactNode }) {
    return <div className="client-list">{children}</div>;
}

/**
 * The repository behind a demo project, rendered as a subtitle right under the
 * demo's heading so the source is one click away before reading the section.
 *
 * Usage in MDX:
 *
 *   ### Realtime Tanks Multiplayer
 *
 *   <DemoSource repo="colyseus/realtime-tanks-demo" />
 *
 * `repo` is the `owner/name` slug, shown verbatim and linked to GitHub.
 * Styling lives in `style.css` (`.demo-source`).
 */
export function DemoSource({ repo }: { repo: string }) {
    return (
        <a className="demo-source" href={`https://github.com/${repo}`} target="_blank" rel="noopener">
            <MarkGithubIcon size={15} />
            {repo}
        </a>
    );
}

export function Client({
    engine,
    name,
    platforms,
    platformsFull,
    play,
    source,
}: {
    engine?: LogoName;
    name: string;
    platforms: string;
    platformsFull?: string;
    play?: string;
    source?: string;
}) {
    return (
        <div className="client-row">
            <div className="client-row__name">
                <span className="client-row__icon">{engine && <Logo name={engine} className="w-[22px] h-auto" />}</span>
                {name}
            </div>
            <div className="client-row__platforms" title={platformsFull || platforms}>
                {platforms}
            </div>
            <div className="client-row__links">
                {play && <a href={play} target="_blank" rel="noopener"><LinkExternalIcon size={14} /> Play</a>}
                {source && <a href={source} target="_blank" rel="noopener"><MarkGithubIcon size={14} /> Source</a>}
            </div>
        </div>
    );
}
