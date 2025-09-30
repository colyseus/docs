import { HomeIcon, FileCodeIcon, ServerIcon, ThumbsupIcon, DevicesIcon, DatabaseIcon, ToolsIcon, QuestionIcon, VersionsIcon, HeartFillIcon, DownloadIcon, CodeIcon, ZapIcon, BookIcon, SyncIcon, PasskeyFillIcon, RocketIcon, ListOrderedIcon, RepoIcon, TasklistIcon, ListUnorderedIcon, CodeSquareIcon, FlameIcon, LightBulbIcon, CreditCardIcon, RowsIcon, PeopleIcon, StackIcon } from '@primer/octicons-react';

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

    "getting-started": { title: <span><ZapIcon/> Getting Started</span> }, // "Getting Started"
    "tutorial": { title: <span><FileCodeIcon/> Tutorials</span>},

    '-- API Reference': { type: 'separator', title: 'API Reference' },
    "client": { title: <span><DevicesIcon/> Client SDK</span>},
    "server": { title: <span><ServerIcon/> Server</span> },
    "room": { title: <span><PeopleIcon/> Rooms</span> },
    "state": { title: <span><SyncIcon/> State Synchronization</span> },
    "auth": { title: <span><PasskeyFillIcon/> Authentication</span> },
    "tools": { title: <span><ToolsIcon/> Tools</span> },
    "deployment": { title: <span><RocketIcon/> Deployment</span> },

    '-- More': { type: 'separator', title: 'More' },
    "database": { title: <span><DatabaseIcon/> Database</span> },
    "payments": { title: <span><CreditCardIcon/> Payments</span> },
    "recipes": { title: <span><LightBulbIcon /> Recipes</span> },
    "examples": { title: <span><RepoIcon /> Example Projects</span> },

    '-- Extra': { type: 'separator', title: 'Extra' },
    "recommendations": { title: <span><ThumbsupIcon/> Recommendations</span> },
    "community": { title: <span><HeartFillIcon/> Community</span> },
    "upgrading": { title: <span><VersionsIcon/> Upgrading Versions</span> }, // "Upgrading Versions"
    "faq": {title: <span><QuestionIcon/> FAQ</span>},

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
            { title: '0.15 ↗', href: 'https://0-15-x.docs.colyseus.io/', newWindow: true },
            { title: '0.14 ↗', href: 'https://0-14-x.docs.colyseus.io/', newWindow: true },
            { title: '0.13 ↗', href: 'https://0-13-x.docs.colyseus.io/', newWindow: true },
            { title: '0.12 ↗', href: 'https://0-12-x.docs.colyseus.io/', newWindow: true },
            { title: '0.11 ↗', href: 'https://0-11-x.docs.colyseus.io/', newWindow: true },
            { title: '0.10 ↗', href: 'https://0-10-x.docs.colyseus.io/', newWindow: true }

        ]
    },

}
