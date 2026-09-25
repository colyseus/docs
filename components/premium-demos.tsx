import React from "react";
import { HeartFillIcon } from "@primer/octicons-react";
import { DemoGrid, DemoCard } from "./demo-card";
import { premiumDemos, SPONSOR_URL } from "@/lib/premium-demos";

export function PremiumDemos() {
    return (
        <>
            <DemoGrid>
                {premiumDemos.map((demo) => (
                    <DemoCard key={demo.title} title={demo.title} image={demo.image} play={demo.play} source={demo.source}>
                        {demo.description}
                        <span className="demo-card__engines">{demo.engines.join(" · ")}</span>
                    </DemoCard>
                ))}
            </DemoGrid>
            {/* the offer comes AFTER the grid on purpose — the reader meets the
                playable games first, the sponsor ask once they've seen them */}
            <p className="premium-note">
                The source code is the sponsor-only part: every <em>Source</em> link above points
                to a private repository, open to <a href={SPONSOR_URL} target="_blank" rel="noopener">Colyseus sponsors</a>.
            </p>
            <p className="premium-cta">
                <a href={SPONSOR_URL} target="_blank" rel="noopener">
                    <HeartFillIcon size={16} /> Become a sponsor for the source code
                </a>
            </p>
        </>
    );
}

export function PremiumDemoCount() {
    return <>{premiumDemos.length}</>;
}
