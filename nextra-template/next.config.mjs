import nextra from "nextra";

const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',

    latex: true,
    search: {
        codeblocks: false
    }

})

export default withNextra({
    output: 'export',
    images: {
        unoptimized: true // mandatory, otherwise won't export
    },
});