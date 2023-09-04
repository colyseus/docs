# Server &raquo; Custom Web/API Routes

Colyseus comes with Express as a web server by default.

Here are some examples of how to add custom routes to your server:

=== "app.config.ts"

    ``` typescript
    import config from "@colyseus/tools";

    export default config({
        // ...
        initializeExpress: (app) => {

            //
            // Define your custom routes here
            //
            app.get("/hello_world", (req, res) => {
                res.json({ hello: "world" });
            });

        },
        // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "colyseus";
    import { createServer } from "http";
    import express from "express";

    const app = express();
    app.use(express.json());

    //
    // Define your custom routes here
    //
    app.get("/hello_world", (req, res) => {
        res.json({ hello: "world" });
    });

    const gameServer = new Server({ server: createServer(app) });
    gameServer.listen(2567);
    ```

---

For more information about Express, check out the [Express guides](https://expressjs.com/en/guide/routing.html).


