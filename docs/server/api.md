# Web-Socket Server

## Server

The [`Server`](#server) is responsible for providing the WebSocket server to enable communication between server and client.

### `constructor (options)`

#### `options.server`

The HTTP server to bind the WebSocket Server into. You may use [`express`](https://www.npmjs.com/package/express) for your server too.

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const http = require("http");
const port = process.env.port || 3000;

const gameServer = new colyseus.Server({
  server: http.createServer()
});

gameServer.listen(port);
```

```typescript fct_label="TypeScript"
import { Server } from "colyseus";
import { createServer } from "http";
const port = process.env.port || 3000;

const gameServer = new Server({
  server: createServer()
});

gameServer.listen(port);
```

```typescript fct_label="JavaScript (express)"
const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const port = process.env.port || 3000;

const app = express();
const gameServer = new colyseus.Server({
  server: http.createServer(app)
});

gameServer.listen(port);
```

```typescript fct_label="TypeScript (express)"
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
const port = process.env.port || 3000;

const app = express();
const gameServer = new Server({
  server: createServer(app)
});

gameServer.listen(port);
```

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

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const http = require("http");

const gameServer = new colyseus.Server({
  server: createServer(),
  verifyClient: function (info, next) {
    // validate 'info'
    //
    // - next(false) will reject the websocket handshake
    // - next(true) will accept the websocket handshake
  }
});
```

```typescript fct_label="TypeScript"
import { Server } from "colyseus";
import { createServer } from "http";

const gameServer = new Server({
  server: createServer(),
  verifyClient: function (info, next) {
    // validate 'info'
    //
    // - next(false) will reject the websocket handshake
    // - next(true) will accept the websocket handshake
  }
});
```

#### `options.presence`

When scaling Colyseus through multiple processes / machines, you need to provide a presence server. Read more about [`Presence`](/server/presence).

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const http = require("http");

const gameServer = new colyseus.Server({
  server: http.createServer(),
  presence: new colyseus.RedisPresence()
});
```

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";
import { createServer } from "http";

const gameServer = new Server({
  server: createServer(),
  presence: new RedisPresence()
});
```

The currently avaialble Presence servers are currently:

- `RedisPresence` (scales on a single server and multiple servers)
- `MemsharedPresence` (scales on a single server)

#### `options.gracefullyShutdown`

Register shutdown routine automatically. Default is `true`. If disabled, you
should call [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) method
manually in your shutdown process.

### `register (name: string, handler: Room, options?: any)`

Register a new room handler.

!!! Tip "Registering the same room handler multiple times"
    You may register the same room handler multiple times with different `options`. When [Room#onInit()](http://localhost:8000/server/room/#oninit-options) is called, the `options` will contain the merged values you specified on [Server#register()](/server/api/#register-name-string-handler-room-options-any) + the options provided by the first client on `client.join()`

**Parameters:**

- `name: string` - The public name of the room. You'll use this name when joining the room from the client-side.
- `handler: Room` - Reference to the `Room` handler class.
- `options?: any` - Custom options for room initialization.

```typescript
// Register "chat" room
gameServer.register("chat", ChatRoom);

// Register "battle" room
gameServer.register("battle", BattleRoom);

// Register "battle" room with custom options
gameServer.register("battle_woods", BattleRoom, { map: "woods" });
```

#### Listening to matchmake events

The `register` method will return the registered handler instance, which you can listen to match-making events from outside the room instance scope. Such as:

- `"create"` - when a room has been created
- `"dispose"` - when a room has been disposed
- `"join"` - when a client join a room
- `"leave"` - when a client leave a room
- `"lock"` - when a room has been locked
- `"unlock"` - when a room has been unlocked

**Usage:**

```typescript
gameServer.register("chat", ChatRoom).then((handler) => {
  handler.
    on("create", (room) => console.log("room created:", room.roomId)).
    on("dispose", (room) => console.log("room disposed:", room.roomId)).
    on("join", (room, client) => console.log(client.id, "joined", room.roomId)).
    on("leave", (room, client) => console.log(client.id, "left", room.roomId));
})
```

!!! Warning
    It's completely discouraged to manipulate a room's state through these events. Use the [abstract methods](/server/room/#abstract-methods) in your room handler instead.

### `attach (options: any)`

Attaches or creates the WebSocket server.

- `options.server`: The HTTP server to attach the WebSocket server on.
- `options.ws`: An existing WebSocket server to be re-used.

```javascript fct_label="Express"
import express from "express";
import { Server } from "colyseus";

const app = new express();
const gameServer = new Server();

gameServer.attach({ server: app });
```

```javascript fct_label="http.createServer"
import http from "http";
import { Server } from "colyseus";

const httpServer = http.createServer();
const gameServer = new Server();

gameServer.attach({ server: httpServer });
```

```javascript fct_label="WebSocket.Server"
import http from "http";
import express from "express";
import ws from "ws";
import { Server } from "colyseus";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
    // your custom WebSocket.Server setup.
});

const gameServer = new Server();
gameServer.attach({ ws: wss });
```


### `listen (port: number)`

Binds the WebSocket server into the specified port.

### `onShutdown (callback: Function)`

Register a callback that should be called before the process shut down. See [graceful shutdown](/server/graceful-shutdown/) for more details.

### `gracefullyShutdown (exit: boolean)`

Shutdown all rooms and clean-up its cached data. Returns a promise that fulfils
whenever the clean-up has been complete.

This method is called automatically unless `gracefullyShutdown: false` has been provided on `Server` constructor.
