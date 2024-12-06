import React from 'react'
import Image from 'next/image'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { SponsorsSidebar } from './components/sponsors-sidebar';

const logo = <Image src={require('./images/logo.svg')} width={0} height={0} style={{ width: 'auto', height: '28px' }} alt="Colyseus" />;

const config: DocsThemeConfig = {
    logo: <>
        {logo}
        <span style={{ fontSize: "0.8em", marginLeft: "0.6em", paddingTop: "0.7em", color: "GrayText" }}>v0.16</span>
    </>,
    // logo,
    project: {
        link: 'https://github.com/colyseus/colyseus',
    },
    chat: {
        link: 'http://chat.colyseus.io/',
    },
    docsRepositoryBase: 'https://github.com/colyseus/docs',

    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true
    },

    // color: {
    //     hue: 265,
    //     saturation: 100,
    //     lightness: {
    //         dark: 72,
    //         light: 60,
    //     }
    // },

    toc: {
        float: true,
        extraContent: <SponsorsSidebar />,
    },

    footer: {
        content: '2024 © Endel Dreyer',
    },

    head: function useHead() {
        const config = useConfig()
        const title = `${config.title} – Colyseus`
        const description =
            config.frontMatter.description || 'Colyseus: Multiplayer Framework for Node.js'

        const image = config.frontMatter.image || 'https://colyseus.io/images/fb-share.png'

        return (
            <>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta name="og:image" content={image} />

                <meta name="msapplication-TileColor" content="#fff" />
                <meta httpEquiv="Content-Language" content="en" />
                <meta name="apple-mobile-web-app-title" content="Colyseus" />
                <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="https://nextra.site" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-icon-180x180.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/android-icon-192x192.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
            </>
        )
    }
}

export default config
