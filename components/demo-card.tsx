import React from "react";
import { LinkExternalIcon, MarkGithubIcon } from "@primer/octicons-react";

/**
 * Demo showcase cards — a gameplay screenshot linking to the live demo, plus
 * explicit Play / Source links (Nextra's Cards.Card is a single anchor, so it
 * can't carry both).
 *
 * Usage in MDX:
 *
 *   <DemoGrid>
 *     <DemoCard title="Air Hockey" image="/demos/netcode/air-hockey.webp"
 *         play="https://air-hockey-colyseus.vercel.app/" source="https://github.com/colyseus/air-hockey-demo">
 *       One-line description.
 *     </DemoCard>
 *   </DemoGrid>
 *
 * Styling lives in `style.css` (`.demo-grid` / `.demo-card`), same approach
 * as scenario-card.tsx.
 */

export function DemoGrid({ children }: { children: React.ReactNode }) {
    return <div className="demo-grid">{children}</div>;
}

export function DemoCard({
    title,
    image,
    play,
    source,
    children,
}: {
    title: string;
    image: string;
    play?: string;
    source?: string;
    children: React.ReactNode;
}) {
    const media = <img src={image} alt={`${title}, gameplay screenshot`} loading="lazy" />;
    return (
        <div className="demo-card">
            {play
                ? <a href={play} target="_blank" rel="noopener" className="demo-card__media">{media}</a>
                : <div className="demo-card__media">{media}</div>}
            <div className="demo-card__body">
                <div className="demo-card__title">{title}</div>
                <div className="demo-card__desc">{children}</div>
                {(play || source) && (
                    <div className="demo-card__links">
                        {play && <a href={play} target="_blank" rel="noopener"><LinkExternalIcon size={14} /> Play</a>}
                        {source && <a href={source} target="_blank" rel="noopener"><MarkGithubIcon size={14} /> Source</a>}
                    </div>
                )}
            </div>
        </div>
    );
}
