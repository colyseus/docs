import React from "react";
import { HeartFillIcon } from "@primer/octicons-react";
import { DemoGrid, DemoCard } from "./demo-card";

/**
 * The premium showcase prototypes — free to play, sponsor-only source — and the
 * single source of truth rendered on both `/netcode` and `/learn`. Edit
 * `premiumDemos` and both pages follow.
 *
 * Usage in MDX:
 *
 *   import { PremiumDemos, premiumDemos } from '../components/premium-demos'
 *   <PremiumDemos />
 *
 * Pages that want the count in their prose should read `premiumDemos.length`
 * rather than spelling the number out, so adding a prototype can't leave stale
 * copy behind.
 */

export interface PremiumDemo {
    title: string;
    image: string;
    description: string;
    /** Engines this prototype is implemented on, web client first. */
    engines: string[];
    /**
     * Public playable build, rendered on the card. Anyone can play; only the
     * source is sponsor-gated.
     *
     * Every one of these is a static Vercel build talking to the shared game
     * server at demos.colyseus.cloud, one path prefix per demo. Note that
     * `check-links` does not validate external URLs, so a host that goes down
     * will not fail CI.
     */
    play: string;
    /**
     * Sponsor-only, deliberately NOT rendered: these repositories are private,
     * so linking them publicly would hand every non-sponsor a 404. Sponsorship
     * is the way in — see SPONSOR_URL. Kept here for whoever wires up access.
     */
    source: string;
}

export const SPONSOR_URL = "https://github.com/sponsors/endel";

export const premiumDemos: PremiumDemo[] = [
    {
        title: "Air Hockey",
        image: "/demos/netcode/air-hockey.webp",
        description: "3D air hockey where everything is predicted: your mallet, the puck, hits and even goals resolve locally and are settled by the server. First to 7 wins.",
        engines: ["Three.js", "Godot", "Unity"],
        play: "https://air-hockey-colyseus.vercel.app/",
        source: "https://github.com/colyseus/air-hockey-demo",
    },
    {
        title: "ColyBlast (FPS)",
        image: "/demos/netcode/fps.webp",
        description: "First-person shooter: predicted movement with reconciliation, server-validated hitscan with lag compensation, and objective game modes.",
        engines: ["Three.js"],
        play: "https://colyblast-colyseus.vercel.app/",
        source: "https://github.com/colyseus/fps-demo",
    },
    {
        title: "MOBA",
        image: "/demos/netcode/moba.webp",
        description: "A 3-lane MOBA on a deterministic shared simulation: fixed timestep and client prediction driving heroes, creeps, towers and 5v5 bot matches.",
        engines: ["Three.js"],
        play: "https://moba-colyseus.vercel.app/",
        source: "https://github.com/endel/moba-colyseus",
    },
    {
        title: "Platformer",
        image: "/demos/netcode/platformer.webp",
        description: "2.5D platformer built as a prediction harness: reconciled movement, rideable moving platforms, and stomps and dashes that hold up under lag.",
        engines: ["Three.js"],
        play: "https://platformer-colyseus.vercel.app/",
        source: "https://github.com/colyseus/platformer-demo",
    },
    {
        title: "Colyseus Karts",
        image: "/demos/netcode/racing.webp",
        description: "Kart racing with hold-to-drift mini-turbos, item boxes and rockets: rollback prediction, dead-reckoned projectiles, and rewind-based hit checks.",
        engines: ["Three.js"],
        play: "https://racing-colyseus.vercel.app/",
        source: "https://github.com/colyseus/racing-demo",
    },
];

export function PremiumDemos() {
    return (
        <>
            <DemoGrid>
                {premiumDemos.map((demo) => (
                    <DemoCard key={demo.title} title={demo.title} image={demo.image} play={demo.play}>
                        {demo.description}
                        <span className="demo-card__engines">{demo.engines.join(" · ")}</span>
                    </DemoCard>
                ))}
            </DemoGrid>
            {/* the offer comes AFTER the grid on purpose — the reader meets the
                playable games first, the sponsor ask once they've seen them */}
            <p className="premium-note">
                The source code is the sponsor-only part: these repositories are private,
                available to <a href={SPONSOR_URL} target="_blank" rel="noopener">Colyseus sponsors</a>.
            </p>
            <p className="premium-cta">
                <a href={SPONSOR_URL} target="_blank" rel="noopener">
                    <HeartFillIcon size={16} /> Become a sponsor for the source code
                </a>
            </p>
        </>
    );
}
