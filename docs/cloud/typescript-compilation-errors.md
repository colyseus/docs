---
icon: octicons/alert-16
title: TypeScript compilation errors
---

If you haven't created your Colyseus application via `npm create colyseus-app@latest`, make sure you have the following configurations in your `tsconfig.json`:

=== ":octicons-file-code-16: `tsconfig.json`"

```javascript
{
  "compilerOptions": {
    "outDir": "build",
    "target": "ESNext",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "allowJs": true,
    "strictNullChecks": false,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": false
  },
  "include": [
    "src"
  ]
}
```

Make sure you are able to compile your application locally before deploying it to Colyseus Cloud:

=== ":octicons-terminal-16: Terminal"

```bash
npm run build
```

---

## Disabling TypeScript strict mode (not recommended)

This is not recommend as it will make your application more prone to runtime errors, but you can disable TypeScript strict mode by modifying the following configuration to your `tsconfig.json`:

=== ":octicons-file-code-16: `tsconfig.json`"

```javascript
{
  "compilerOptions": {
    // ...
    "strict": false,
    "skipLibCheck": true,
  }
}
```

---

## Complex monorepo setup

If you are using a monorepo setup, we recommend using the `pnpm` package manager instead of `npm`. (See [pnpm docs](https://pnpm.io/workspaces) for more information)

=== ":octicons-terminal-16: Terminal"

```
npm install -g pnpm
```

#### Configure your workspaces

`pnpm` requires you to configure your workspaces in a `pnpm-workspace.yaml` file. See example below:

=== ":octicons-file-code-16: `pnpm-workspace.yaml`"

```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of components/
  - 'components/**'
  # exclude packages that are inside test directories
  - '!**/test/**'
```

#### Installing dependencies

Before installing your dependencies with `pnpm`, make sure to remove `node_modules` and `package-lock.json` from your previous package manager from your project.

=== ":octicons-terminal-16: Terminal"

```
pnpm install
```

**Push `pnpm-lock.yaml` and `pnpm-workspace.yaml`**

Make sure to push the `pnpm-lock.yaml` and `pnpm-workspace.yaml` files to your repository, so Colyseus Cloud can install your dependencies correctly.