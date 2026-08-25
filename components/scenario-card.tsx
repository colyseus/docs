import React from "react";

/**
 * Reusable two-piece component for landing-page intent indexes.
 *
 * Usage in MDX:
 *
 *   <ScenarioGrid>
 *     <ScenarioCard icon={<SignInIcon size={18}/>} title="..." href="/...">
 *       Description text, may include <code>inline code</code>.
 *     </ScenarioCard>
 *   </ScenarioGrid>
 *
 * Styling lives in `style.css` (`.scenario-grid` / `.scenario-card`)
 * so it stays theme-agnostic and supports `:hover` / `:active` states.
 */

export function ScenarioGrid({ children }: { children: React.ReactNode }) {
    return <div className="scenario-grid">{children}</div>;
}

export function ScenarioCard({
    icon,
    title,
    href,
    children,
}: {
    icon: React.ReactNode;
    title: React.ReactNode;
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a href={href} className="scenario-card">
            <div className="scenario-card__title">{icon} {title}</div>
            <div className="scenario-card__desc">{children}</div>
        </a>
    );
}
