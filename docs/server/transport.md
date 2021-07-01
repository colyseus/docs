# Server API &raquo; Transport

Colyseus currently provides two WebSocket implementations as its Transport layer.

Each Transport has its own set of options for customization.

- [Default WebSocket Transport (`ws`)](#default-websocket-transport-via-ws)
- [Native C++ WebSocket Transport (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  Default WebSocket Transport (via `ws`)

The default WebSocket transport uses the [`websockets/ws`](https://github.com/websockets/ws) implementation.

**Installation**

```
npm install --save @colyseus/ws-transport
```

**Usage**

```typescript
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({
    transport: new WebSocketTransport({ /* transport options */ })
})
```

### Available options:

#### `options.server`

A Node.js http server instance to re-use for the WebSocket server. Useful when you'd like to use Express along with Colyseus.

By not providing this option, an http server is going to be created automatically for you.

```typescript fct_label="TypeScript"
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

---

#### `options.pingInterval`

Number of milliseconds for the server to "ping" the clients. Default: `3000`

The clients are going to be forcibly disconnected if they can't respond after [pingMaxRetries](/server/api/#optionspingMaxRetries) retries.

---

#### `options.pingMaxRetries`

Maximum allowed number of pings without a response. Default: `2`.

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

```
npm install --save @colyseus/uwebsockets-transport
```

**Usage**

```typescript
import { Server } from "@colyseus/core";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({
    transport: new uWebSocketsTransport({ /* transport options */ })
})
```

### Available options:

#### `options.maxPayloadLength`

Maximum length of received message. If a client tries to send you a message larger than this, the connection is immediately closed. Defaults to `16 * 1024`.

---

#### `options.idleTimeout`

Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest.

Disable by using `0`. Defaults to `120`.

---

#### `options.compression`

What permessage-deflate compression to use. `uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` or any of the `uWS.DEDICATED_COMPRESSOR_xxxKB`. Defaults to `uWS.DISABLED`

---

#### `options.maxBackpressure`

Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout. Defaults to `1024 * 1024`.