---
icon: material/cloud
title: Overview
---

# Welcome to Colyseus Cloud

[Colyseus Cloud](https://cloud.colyseus.io/) provides a managed infrastructure for your Colyseus application.

![Colyseus Cloud Dashboard](images/dashboard.png)

## Project template

In order to deploy your Colyseus application to Colyseus Cloud, you need to follow the project template from `npm create colyseus-app@latest` command:

<center>
![Project structure](images/project-structure.png)
</center>

The key important configurations the template provide are:

1. Usage of `@colyseus/tools` to start the application
2. An `ecosystem.config.js` file at the root of the project (with the `"script"` pointing to your application's entrypoint)

=== ":octicons-file-code-16: `src/index.ts`"

    ```typescript hl_lines="1 7"
    import { listen } from "@colyseus/tools";

    // Import Colyseus config
    import app from "./app.config";

    // Create and listen on 2567 (or PORT environment variable.)
    listen(app);
    ```

=== ":octicons-file-code-16: `src/app.config.ts`"

    ```typescript
    import config from "@colyseus/tools";
    import { MyRoom } from "./rooms/MyRoom";

    export default config({
        initializeGameServer: (gameServer) => {
            gameServer.define('my_room', MyRoom);
        },
        initializeExpress: (app) => {
            // ...
        },
        beforeListen: () => {
            // ...
        }
    });
    ```

=== ":octicons-file-code-16: `ecosystem.config.js`"

    ```typescript hl_lines="6"
    const os = require('os');

    module.exports = {
        apps : [{
            name: "colyseus-app",
            script: 'build/index.js',
            time: true,
            watch: false,
            instances: os.cpus().length,
            exec_mode: 'fork',
            wait_ready: true,
            env_production: {
                NODE_ENV: 'production'
            }
        }],
    };
    ```

---

## Deploying your application

From your terminal, run the following command to deploy your application to Colyseus Cloud.

=== ":octicons-terminal-16: Terminal"

``` bash
npx @colyseus/cloud deploy
```

You will be redirected to your browser, where you will be asked to select which application you want to deploy.

This will generate a `.colyseus-cloud.json` file at the root of your project with credentials capable of deploying your application in the future. Keep this file safe!

### Available command-line options:

- `--env [env]`: The deployment environment. Default is `production`. (The `.colyseus-cloud.json` file stores the configuration per environment.)
- `--remote [remote]`: Force a specific git remote to deploy from. Value is stored on `.colyseus-cloud.json`
- `--branch [branch]`: Force a specific git branch to deploy from. Value is stored on `.colyseus-cloud.json`
- `--reset`: Reset application selection for deployment
- `--preview`: Open web interface to preview the deployment.

---

## Customizing build steps

By default, Colyseus Cloud is going to build your server-side code using the `build` script from your `package.json` file:

```json
{
  "scripts": {
    "build": "tsc"
  }
}
```

You can customize how your server-side code is built by updating the "Build Command" in your Colyseus Cloud application settings, under "Build settings".