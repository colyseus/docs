import { HomeIcon, FileCodeIcon, ServerIcon, ThumbsupIcon, DevicesIcon, DatabaseIcon, ToolsIcon, QuestionIcon, VersionsIcon, HeartFillIcon, DownloadIcon, CodeIcon, ZapIcon, SyncIcon, PasskeyFillIcon, RocketIcon, ListOrderedIcon, RepoIcon, TasklistIcon, ListUnorderedIcon, CodeSquareIcon, FlameIcon, LightBulbIcon, CreditCardIcon, RowsIcon, PeopleIcon, StackIcon, CloudIcon, PackageIcon, DuplicateIcon, ShieldLockIcon, NorthStarIcon } from '@primer/octicons-react';

export default {
    '-- Intro': {
        type: 'separator',
        title: 'Overview'
    },
    index: {
        title: <span><HomeIcon/> Introduction</span>, // 'Introduction'
        // theme: {
        //     layout: "full"
        // }
    },

    "getting-started": { title: <span><NorthStarIcon/> Getting Started</span> }, // "Getting Started"
    "learn": { title: <span><FileCodeIcon/> Learn</span>},

    // Ordered by the build loop: stand up a server → define a room → sync state →
    // connect a client → matchmake → lock it down → persist.
    '-- Building Your Game': { type: 'separator', title: 'Building Your Game' },
    "server": { title: <span><ServerIcon/> Server</span> },
    "room": { title: <span><PeopleIcon/> Rooms</span> },
    "state": { title: <span><SyncIcon/> State Sync</span> },
    "sdk": { title: <span><DevicesIcon/> Client SDK</span>},
    "matchmaker": { title: <span><StackIcon/> Matchmaking</span> },
    "auth": { title: <span><PasskeyFillIcon/> Authentication</span> },
    "database": { title: <span><DatabaseIcon/> Database</span> },

    '-- Advanced': { type: 'separator', title: 'Advanced' },
    "netcode": { title: <span><ZapIcon/> Netcode</span> },

    '-- Tools': { type: 'separator', title: 'Tools & Integrations' },
    "tools": { title: <span><ToolsIcon/> Built-in Tools</span> },
    "admin": { title: <span><ShieldLockIcon/> Admin Panel</span> },
    "payments": { title: <span><CreditCardIcon/> Payments</span> },
    "3rd-party-packages": { title: <span><PackageIcon/> 3rd Party Packages</span> },

    '-- Deploy & Scale': { type: 'separator', title: 'Deploy & Scale' },
    "deployment": { title: <span><RocketIcon/> Deployment</span> },
    "scalability": { title: <span><DuplicateIcon/> Scalability</span> },
    "cloud": { title: <span><CloudIcon/> Colyseus Cloud</span> },

    '-- Resources': { type: 'separator', title: 'Resources' },
    "recipes": { title: <span><LightBulbIcon /> Recipes & Guides</span> },
    "faq": {title: <span><QuestionIcon/> FAQ</span>},
    "migrating": { title: <span><VersionsIcon/> Migrating Versions</span> }, // "Migrating Versions"
    "community": { title: <span><HeartFillIcon/> Community</span> },

    '-- (final) --': { type: 'separator' },

    documentation: {
        title: "Documentation",
        type: "page",
        href: "/"
    },

    roadmap: {
        title: "Roadmap",
        type: "page",
    },

    sponsors: {
        title: "Sponsors",
        type: "page",
    },

    versions: {
        type: 'menu',
        title: 'Versions',
        items: [
            { title: '0.16 ↗', href: 'https://0-16-x.docs.colyseus.io/', newWindow: true },
            { title: '0.15 ↗', href: 'https://0-15-x.docs.colyseus.io/', newWindow: true },
            { title: '0.14 ↗', href: 'https://0-14-x.docs.colyseus.io/', newWindow: true },
            { title: '0.13 ↗', href: 'https://0-13-x.docs.colyseus.io/', newWindow: true },
            { title: '0.12 ↗', href: 'https://0-12-x.docs.colyseus.io/', newWindow: true },
            { title: '0.11 ↗', href: 'https://0-11-x.docs.colyseus.io/', newWindow: true },
            { title: '0.10 ↗', href: 'https://0-10-x.docs.colyseus.io/', newWindow: true }

        ]
    },

}
