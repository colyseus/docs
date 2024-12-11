# Server API &raquo; Transport

Colyseus currently provides two WebSocket implementations as its Transport layer.

Each Transport has its own set of options for customization.

- [Default WebSocket Transport (`ws`)](#default-websocket-transport-via-ws)
- [Native C++ WebSocket Transport (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)
- [WebTransport](#webtransport)
- [Bun WebSockets](#bun-websockets)

---

## Default WebSocket Transport (via `ws`)

The default WebSocket transport uses the [`websockets/ws`](https://github.com/websockets/ws) implementation.

A `WebSocketTransport` with its default options is going to be used automatically if no `transport` is provided for [`Server`](/server/api/#new-server-options)'s constructor.

<!--

**Installation**

```
npm install --save @colyseus/ws-transport
```

-->

**Usage**

=== "app.config.ts"

    ``` typescript
    import config from "@colyseus/tools";
    import { WebSocketTransport } from "@colyseus/ws-transport"

    export default config({
      // ...

      initializeTransport: function(opts) {
        return new WebSocketTransport({
          ...opts,
          pingInterval: 6000,
          pingMaxRetries: 4,
          maxPayload: 1024 * 1024 * 1, // 1MB Max Payload
        });
      },

      // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "@colyseus/core";
    import { WebSocketTransport } from "@colyseus/ws-transport"

    const gameServer = new Server({
        transport: new WebSocketTransport({
            pingInterval: 6000,
            pingMaxRetries: 4,
        })
    })
    ```

### Available options

#### `options.server`

A Node.js http server instance to re-use for the WebSocket server. Useful when you'd like to use Express along with Colyseus.

=== "Example"

    ``` typescript
    import { createServer } from "http";
    import { Server } from "@colyseus/core";
    import { WebSocketTransport } from "@colyseus/ws-transport"

    const server = createServer(); // create the http server manually

    const gameServer = new Server({
      transport: new WebSocketTransport({
        server // provide the custom server for `WebSocketTransport`
      })
    });
    ```

=== "Example + Express"

    ``` typescript
    import express from "express";
    import { createServer } from "http";
    import { Server } from "@colyseus/core";
    import { WebSocketTransport } from "@colyseus/ws-transport"

    const app = express();
    const server = createServer(app); // create the http server manually

    const gameServer = new Server({
      transport: new WebSocketTransport({
        server // provide the custom server for `WebSocketTransport`
      })
    });
    ```

By not providing this option, an http server is going to be created automatically for you.

---

#### `options.pingInterval`

Number of milliseconds for the server to "ping" the clients.

The clients are going to be forcibly disconnected if they can't respond after [pingMaxRetries](#optionspingmaxretries) retries.

Default: `3000`

---

#### `options.pingMaxRetries`

Maximum allowed number of pings without a response.

Default: `2`

---

#### `options.maxPayload`

Maximum payload clients can send per message to the server.

Default: `4096` (4kb)

---

#### `options.verifyClient`

This method happens before WebSocket handshake. If `verifyClient` is not set
then the handshake is automatically accepted.

- `info` (Object)
    - `origin` (String) The value in the Origin header indicated by the client.
    - `req` (http.IncomingMessage) The client HTTP GET request.
    - `secure` (Boolean) `true` if `req.connection.authorized` or `req.connection.encrypted` is set.

- `next` (Function) A callback that must be called by the user upon inspection of the `info` fields. Arguments in this callback are:
    - `result` (Boolean) Whether or not to accept the handshake.
    - `code` (Number) When `result` is `false` this field determines the HTTP error status code to be sent to the client.
    - `name` (String) When `result` is `false` this field determines the HTTP reason phrase.

---

## Native C++ WebSocket Transport (via `uWebSockets.js`)

The [`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) implementation generally performs better than the default, in terms of number of CCU it can hold, and memory consumption.

**Installation**

``` bash
npm install --save @colyseus/uwebsockets-transport
```

**Usage**

=== "app.config.ts"

    ``` typescript
    import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"
    import config from "@colyseus/tools";

    export default config({
      // ...
      initializeTransport: function() {
        return new uWebSocketsTransport({
          /* ...options */
        });
      },

      //
      // bind express routes
      //
      initializeExpress: (app) => {

        app.get("/hello", (req, res) => {
          res.json({ hello: "world!" });
        });

      },
      // ...
    })
    ```

=== "Raw usage"

    ``` typescript
    import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

    const transport = new uWebSocketsTransport({
        /* ...options */
    });
    const app = transport['expressApp'];

    // bind express routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });
    ```

### Available options

- `options.maxPayloadLength`: (default: `4096`) Maximum length of received message. If a client tries to send you a message larger than this, the connection is immediately closed.
- `options.idleTimeout`: (default: `120`) Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest. Disable by using `0`.
- `options.sendPingsAutomatically`: (default: `true`) Whether or not we should automatically send pings to uphold a stable connection given `idleTimeout`.
- `options.compression`: (default: `uWS.DISABLED`) What permessage-deflate compression to use. `uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` or any of the `uWS.DEDICATED_COMPRESSOR_xxxKB`.
- `options.maxBackpressure`: (default: `1024 * 1024`) Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout.
- `options.key_file_name`: Path to the SSL key file. (for SSL termination through the Node.js application.)
- `options.cert_file_name`: Path to the SSL certificate file. (for SSL termination through the Node.js application.)
- `options.passphrase`: Password for the SSL file. (for SSL termination through the Node.js application.)

---

## WebTransport

WebTransport support is experimental, and currently on the [`@fails-components/webtransport`](https://github.com/fails-components/webtransport) server-side implementation of HTTP3/WebTransport.

!!! Warning "Experimental"
    This WebTransport implementation hasn't been battle tested. Feedback is very welcome - WebTransport is still an emerging technology and [not available by every browser](https://caniuse.com/webtransport).


```bash
npm install --save @colyseus/h3-transport
```

**Usage**

=== "app.config.ts"

    ``` typescript
    import config from "@colyseus/tools";
    import { H3Transport } from "@colyseus/h3-transport"

    export default config({
      // ...
      initializeTransport: function(options) {
        return new H3Transport({
          // more H3Transport options
          ...options,
        });
      },

      //
      // bind express routes
      //
      initializeExpress: (app) => {

        app.get("/hello", (req, res) => {
          res.json({ hello: "world!" });
        });

      },
      // ...
    })
    ```

=== "Raw usage"

    ``` typescript
    import { H3Transport } from "@colyseus/h3-transport"

    const transport = new H3Transport({
        /* ...options */
    });
    const app = transport['expressApp'];

    // register routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });
    ```

### Available options

- `app`: The Express app.
- `cert`: Certificate contents (cert.pem)
- `key`: Private key contents (key.pem)
- `secret`: (?)
- `server`: The `http.Server` instance to be used.
- `localProxy`: (optional) Fallback every URL through the this local proxy.

---

## Bun WebSockets

Bun support on Colyseus is still experimental. Please report any issues you may find.

**Installation**

``` bash
bun add @colyseus/bun-websockets
```

=== "app.config.ts"

    ``` typescript
    import config from "@colyseus/tools";
    import { BunWebSockets } from "@colyseus/bun-websockets"

    export default config({
      // ...
      initializeTransport: function() {
        return new BunWebSockets({
            /* Bun.serve options */
        });
      },

      //
      // BunWebSockets comes with Express compatibility layer.
      //
      initializeExpress: (app) => {
        // register routes
        app.get("/hello", (req, res) => {
          res.json({ hello: "world!" });
        });
      },
      // ...
    })
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "@colyseus/core";
    import { BunWebSockets } from "@colyseus/bun-websockets"

    const gameServer = new Server({
        transport: new BunWebSockets({
            /* Bun.serve options */
        })
    })

    const app = gameServer.transport['expressApp'];

    // register routes
    app.get("/hello", (req, res) => {
        res.json({ hello: "world!" });
    });
    ```
