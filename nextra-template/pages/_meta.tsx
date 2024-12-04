import { HomeIcon, FileCodeIcon, ServerIcon, ThumbsupIcon, DevicesIcon, DatabaseIcon, ToolsIcon, QuestionIcon, VersionsIcon, HeartFillIcon, DownloadIcon, CodeIcon, ZapIcon, BookIcon, SyncIcon, PasskeyFillIcon, RocketIcon } from '@primer/octicons-react';

export default {
    '-- Intro': {
        type: 'separator',
        title: 'Overview'
    },
    index: {
        title: <span><HomeIcon/> Introduction</span>, // 'Introduction'
        theme: {
            layout: "full"
        }
    },

    "getting-started": { title: <span><ZapIcon/> Getting Started</span> }, // "Getting Started"
    "concepts": "",
    "tutorial": { title: <span><FileCodeIcon/> Tutorials</span>},

    '-- API Reference': { type: 'separator', title: 'API Reference' },
    "server": { title: <span><ServerIcon/> Server API</span> },
    "client": { title: <span><DevicesIcon/> Client SDK</span>},
    "state": { title: <span><SyncIcon/> State Synchronization</span> },
    "auth": { title: <span><PasskeyFillIcon/> Authentication</span> },
    "database": { title: <span><DatabaseIcon/> Database</span> },
    "tools": { title: <span><ToolsIcon/> Tools</span> },
    "deployment": { title: <span><RocketIcon/> Deployment</span> },

    '-- Extra': { type: 'separator', title: 'Extra' },
    "recommendations": { title: <span><ThumbsupIcon/> Recommendations</span> },
    "community": { title: <span><HeartFillIcon/> Community</span> },
    "upgrading": { title: <span><VersionsIcon/> Upgrading Versions</span> }, // "Upgrading Versions"
    "faq": {title: <span><QuestionIcon/> FAQ</span>},

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
