import React from 'react'
import Image from 'next/image'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { SponsorsSidebar } from './components/sponsors-sidebar';

const logo = <Image src={require('./images/logo.svg')} width={0} height={0} style={{ width: 'auto', height: '28px' }} alt="Colyseus" />;

const config: DocsThemeConfig = {
    logo: <>
        {logo}
        <span style={{ fontSize: "0.8em", marginLeft: "0.6em", paddingTop: "0.7em", color: "GrayText" }}>v0.17</span>
    </>,
    project: {
        link: 'https://github.com/colyseus/colyseus',
    },
    chat: {
        link: 'http://chat.colyseus.io/',
    },
    docsRepositoryBase: 'https://github.com/colyseus/docs/tree/master/',

    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true
    },

    banner: {
        key: "new-version",
        content: (
            <>
                Version 0.17 is rolling out! Only the TypeScript SDK is supported at this time. Other SDKs will follow soon. 
            </>
        )
    },

    // banner: {
    //     key: "merch",
    //     content: (
    //         <a href="https://shop.colyseus.io" target="_blank">
    //             🧢 We've released a new merch collection! Check it out at the Colyseus Shop. 👕
    //         </a>
    //     )
    // },

    // color: {
    //     hue: 265,
    //     saturation: 100,
    //     lightness: {
    //         dark: 78,
    //         light: 60,
    //     }
    // },

    toc: {
        float: true,
        extraContent: <SponsorsSidebar />,
    },

    footer: {
        content: (new Date().getFullYear()) + ' © Endel Dreyer',
    },

    head: function useHead() {
        const config = useConfig()
        const title = `${config.title} – Colyseus`
        const description =
            config.frontMatter.description || 'Colyseus: Multiplayer Framework for Node.js'

        const image = config.frontMatter.image || 'https://docs.colyseus.io/fb-share.png';

        return (
            <>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="og:image" content={image} />

                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="apple-mobile-web-app-title" content="Colyseus" />
                <meta name="msapplication-TileImage" content="/icon1.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="https://docs.colyseus.io" />

                <link rel="apple-touch-icon" href="/apple-icon.png" />
                <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </>
        )
    }
}

export default config
