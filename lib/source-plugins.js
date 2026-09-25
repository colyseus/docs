/**
 * Sidebar label override: frontmatter `sidebarTitle` wins over `title` in the page tree.
 * Plain JS so Node scripts can import it too.
 * @returns {import('fumadocs-core/source').LoaderPlugin}
 */
export function sidebarTitle() {
  return {
    name: 'colyseus:sidebar-title',
    transformPageTree: {
      file(node, filePath) {
        if (!filePath) return node;
        const file = this.storage.read(filePath);
        if (file?.format === 'page' && typeof file.data.sidebarTitle === 'string') {
          node.name = file.data.sidebarTitle;
        }
        return node;
      },
    },
  };
}
