import { HomeIcon, FileCodeIcon, ServerIcon, DevicesIcon, DatabaseIcon, ToolsIcon, QuestionIcon, VersionsIcon, HeartFillIcon, DownloadIcon, CodeIcon, ZapIcon, BookIcon, SyncIcon, PasskeyFillIcon, RocketIcon } from '@primer/octicons-react';

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
    // "recipes": "",

    '-- API Reference': { type: 'separator', title: 'API Reference' },
    "server": { title: <span><ServerIcon/> Server</span> },
    "client": { title: <span><DevicesIcon/> Client SDK</span>},
    "state": { title: <span><SyncIcon/> State Synchronization</span> },
    "authentication": { title: <span><PasskeyFillIcon/> Authentication</span> },
    "database": { title: <span><DatabaseIcon/> Database</span> },
    "tools": { title: <span><ToolsIcon/> Tools</span> },
    "deployment": { title: <span><RocketIcon/> Deployment</span> },

    '-- Extra': { type: 'separator', title: 'Extra' },
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

}
