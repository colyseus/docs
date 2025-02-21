# Server API &raquo; Server

The Colyseus `Server` instance holds the server configuration options, such as transport options, presence, matchmaking driver, etc.

- [**Transport**](/server/transport) is the layer for bidirectional communication between server and client.
- [**Presence**](/server/presence) is the implementation that enables communication between rooms and/or Node.js processes.
- [**Driver**](#optionsdriver) is the storage driver used for storing and querying rooms during matchmaking.

## Overview

The recommended structure to initialize a new Colyseus server is created using `npm create colyseus-app@latest` command:

``` bash
npm create colyseus-app@latest ./my-server
```

Customize the server configuration, available room handlers, and API routes:

=== "Recommended: use `@colyseus/tools`"

    ``` typescript
    import config from "@colyseus/tools";
    import { MyRoom } from "./rooms/MyRoom";

    export default config({
        options: {
            // transport: new uWebSocketsTransport(),
            // driver: new RedisDriver(),
            // presence: new RedisPresence(),
        },
        initializeGameServer: (gameServer) => {
            /**
             * Define your room handlers:
             */
            gameServer.define('my_room', MyRoom);
        },

        initializeExpress: (app) => {
            /**
             * Bind your custom express routes here:
             */
            app.get("/", (req, res) => {
                res.send("It's time to kick ass and chew bubblegum!");
            });
        },

        beforeListen: () => {
            /**
             * Before before gameServer.listen() is called.
             */
        }
    });
    ```

=== "Raw usage with Express"

    ``` typescript
    import express from "express";
    import { createServer } from "http";
    import { Server } from "colyseus";
    import { MyRoom } from "./rooms/MyRoom";

    const app = express();
    app.use(express.json());

    const gameServer = new Server({
      server: createServer(app),
      // transport: new uWebSocketsTransport(),
      // driver: new RedisDriver(),
      // presence: new RedisPresence(),
    });

    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom);

    gameServer.listen(2567);
    ```

=== "Raw usage"

    ```typescript
    import { Server } from "colyseus";
    import { MyRoom } from "./rooms/MyRoom";

    const gameServer = new Server({
      // transport: new uWebSocketsTransport(),
      // driver: new RedisDriver(),
      // presence: new RedisPresence(),
    });

    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom);
    gameServer.listen(2567);
    ```

---

## `new Server (options)`

### `options.transport`

Colyseus uses its built-in WebSocket transport by default. See how to [customize the transport layer here](/server/transport/).

### `options.driver`

The matchmaking driver. This is where rooms are going to be cached and queried. You must provide a different value than `LocalDriver` when considering scalability.

**Options available are:**

- `LocalDriver` - default.
- `RedisDriver` - available from `@colyseus/redis-driver`
- `MongooseDriver` - available from `@colyseus/mongoose-driver`

### `options.presence`

When scaling Colyseus through multiple processes / machines, you need to provide a presence server. Read more about [scalability](/scalability/), and the [`Presence API`](/server/presence/#api).

=== "TypeScript"

    ``` typescript
    import { Server, RedisPresence } from "colyseus";

    const gameServer = new Server({
        // ...
        presence: new RedisPresence()
    });
    ```

=== "JavaScript"

    ``` typescript
    const colyseus = require("colyseus");

    const gameServer = new colyseus.Server({
        // ...
        presence: new colyseus.RedisPresence()
    });
    ```

---

### `options.gracefullyShutdown`

Register shutdown routine automatically. Default is `true`. If disabled, you
should call [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) method
manually in your shutdown process.

---

### `options.selectProcessIdToCreateRoom`

A callback that allows you to customize which processs the new rooms should be created at, when you use
multiple Colyseus processes.

By default, the process with the **least amount of rooms** is selected:

=== "Server constructor"

    ```typescript
    import { Server, RedisPresence } from "colyseus";

    const gameServer = new Server({
        // ...
        selectProcessIdToCreateRoom: async function (roomName: string, clientOptions: any) {
            return (await matchMaker.stats.fetchAll())
                .sort((p1, p2) => p1.roomCount > p2.roomCount ? 1 : -1)[0]
                .processId;
        }
    });
    ```

=== "`app.config.ts`"

    ```typescript
    import config from "@colyseus/tools";

    export default config({
        // ...
        options: {
            selectProcessIdToCreateRoom: async function (roomName: string, clientOptions: any) {
                return (await matchMaker.stats.fetchAll())
                    .sort((p1, p2) => p1.roomCount > p2.roomCount ? 1 : -1)[0]
                    .processId;
            }
        },
        // ...
    });
    ```

A common alternative is to use the process with least amount of **connections**:

=== "Server constructor"

    ```typescript
    import { Server, RedisPresence } from "colyseus";

    const gameServer = new Server({
        // ...
        selectProcessIdToCreateRoom: async function (roomName: string, clientOptions: any) {
            return (await matchMaker.stats.fetchAll())
                .sort((p1, p2) => p1.ccu > p2.ccu ? 1 : -1)[0]
                .processId;
        }
    });
    ```

=== "`app.config.ts`"

    ```typescript
    import config from "@colyseus/tools";

    export default config({
        // ...
        options: {
            selectProcessIdToCreateRoom: async function (roomName: string, clientOptions: any) {
                return (await matchMaker.stats.fetchAll())
                    .sort((p1, p2) => p1.ccu > p2.ccu ? 1 : -1)[0]
                    .processId;
            }
        },
        // ...
    });
    ```

---

### `options.devMode`

Restore previous rooms and states upon server restarting when engaging in iterative development.
Default is `false`. See more in [`devMode`](/devmode).

---

### `options.server`

!!! Warning "This option is going to be deprecated"
    See [WebSocket Transport Options](/server/transport/#optionsserver)

The HTTP server to bind the WebSocket Server into. You may use [`express`](https://www.npmjs.com/package/express) for your server too.

=== "TypeScript"

    ``` typescript
    // Colyseus + Express
    import { Server } from "colyseus";
    import { createServer } from "http";
    import express from "express";

    const app = express();
    app.use(express.json());

    const gameServer = new Server({
      server: createServer(app)
    });

    gameServer.listen(2567);
    ```

=== "JavaScript"

    ``` typescript
    // Colyseus + Express
    const colyseus = require("colyseus");
    const http = require("http");
    const express = require("express");

    const app = express();
    app.use(express.json());

    const gameServer = new colyseus.Server({
      server: http.createServer(app)
    });

    gameServer.listen(2567);
    ```

=== "TypeScript (barebones)"

    ``` typescript
    // Colyseus (barebones)
    import { Server } from "colyseus";

    const gameServer = new Server();
    gameServer.listen(2567);
    ```

=== "JavaScript (barebones)"

    ``` typescript
    // Colyseus (barebones)
    const colyseus = require("colyseus");

    const gameServer = new colyseus.Server();
    gameServer.listen(2567);
    ```

---

## `define (roomName: string, room: Room, options?: any)`

Define a new type of room for the matchmaker.

- Rooms are **not created** during `.define()`
- Rooms are created upon client request ([See client-side methods](/client/#methods))

**Parameters:**

- `roomName: string` - The public name of the room. You'll use this name when joining the room from the client-side
- `room: Room` - The `Room` class
- `options?: any` - Custom options for room initialization

```typescript
// Define "chat" room
gameServer.define("chat", ChatRoom);

// Define "battle" room
gameServer.define("battle", BattleRoom);

// Define "battle" room with custom options
gameServer.define("battle_woods", BattleRoom, { map: "woods" });
```

!!! Tip "Defining the same room handler multiple times"
    You may define the same room handler multiple times with different `options`. When [Room#onCreate()](/server/room/#oncreate-options) is called, the `options` will contain the merged values you specified on [Server#define()](/server/api/#define-roomname-string-room-room-options-any) + the options provided when the room is created.

---

### Room definition options

#### `filterBy(options)`

Whenever a room is created by the `create()` or `joinOrCreate()` methods, only the `options` defined by the `filterBy()` method are going to be stored internally, and used to filter out rooms in further `join()` or `joinOrCreate()` calls.

**Parameters**

- `options: string[]` - a list of option names


**Example:** allowing different "game modes".

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['mode']);
```

Whenever the room is created, the `mode` option is going to be stored internally.

```typescript
client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */});
```

You can handle the provided option in the `onCreate()` and/or `onJoin()` to implement the requested feature inside your room implementation.

```typescript
class BattleRoom extends Room {
  onCreate(options) {
    if (options.mode === "duo") {
      // do something!
    }
  }
  onJoin(client, options) {
    if (options.mode === "duo") {
      // put this player into a team!
    }
  }
}
```

**Example:** filtering by built-in `maxClients`

The `maxClients` is an internal variable stored for matchmaking, and can be used for filtering too.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['maxClients']);
```

The client can then ask to join a room capable of handling a certain number of players.

```typescript
client.joinOrCreate("battle", { maxClients: 10 }).then(room => {/* ... */});
client.joinOrCreate("battle", { maxClients: 20 }).then(room => {/* ... */});
```

---

#### `sortBy(options)`

You can also give a different priority for joining rooms depending on their information upon creation.

The `options` parameter is a key-value object containing the field name in the left, and the sorting direction in the right. Sorting direction can be one of these values: `-1`, `"desc"`, `"descending"`, `1`, `"asc"` or `"ascending"`.

**Example:** sorting by the built-in `clients`

The `clients` is an internal variable stored for matchmaking, which contains the current number of connected clients. On the example below, the rooms with the highest amount of clients connected will have priority. Use `-1`, `"desc"` or `"descending"` for descending order:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: -1 });
```

To sort by the fewest amount of players, you can do the opposite. Use `1`, `"asc"` or `"ascending"` for ascending order:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: 1 });
```

---

#### Realtime listing for Lobby

To allow the `LobbyRoom` to receive updates from a specific room type, you should define them with realtime listing enabled:

```typescript
gameServer
  .define("battle", BattleRoom)
  .enableRealtimeListing();
```

[See more about the `LobbyRoom`](/builtin-rooms/lobby/)

---

#### Public lifecycle events

You can listen for matchmaking events from outside the room instance scope, such as:

- `"create"` - when a room has been created
- `"dispose"` - when a room has been disposed
- `"join"` - when a client join a room
- `"leave"` - when a client leave a room
- `"lock"` - when a room has been locked
- `"unlock"` - when a room has been unlocked

**Usage:**

```typescript
gameServer
  .define("chat", ChatRoom)
  .on("create", (room) => console.log("room created:", room.roomId))
  .on("dispose", (room) => console.log("room disposed:", room.roomId))
  .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
  .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
```

!!! Warning
    It's completely discouraged to manipulate a room's state through these events. Use the [abstract methods](/server/room/#abstract-methods) in your room handler instead.

---

## `removeRoomType (roomName: string)`

Revert a `.define()` call. Makes a `roomName` unavailable for matchmaking. This
method is not recommended but may be helpful in some scenarios.

---

## `simulateLatency (milliseconds: number)`

This is a convenience method for simulating "lagged" clients during local development.

```typescript
// Make sure to never call the `simulateLatency()` method in production.
if (process.env.NODE_ENV !== "production") {

  // simulate 200ms latency between server and client.
  gameServer.simulateLatency(200);
}
```

---

## `listen (port: number)`

Binds the WebSocket server into the specified port.

---

## `onBeforeShutdown (callback: Function)`

Register a custom callback that is called **before** the graceful shutdown routine starts. See [graceful shutdown](/server/graceful-shutdown/).

```typescript
gameServer.onBeforeShutdown(async () => {
    // ... custom logic
});
```

---

## `onShutdown (callback: Function)`

Register a custom callback that is called **after** the graceful shutdown is fully complete. See [graceful shutdown](/server/graceful-shutdown/).

```typescript
gameServer.onShutdown(async () => {
    // ... custom logic
});
```

---

## `gracefullyShutdown (exit: boolean)`

Shutdown all rooms and clean-up its cached data. Returns a promise that fulfils
whenever the clean-up has been complete.

This method is called automatically unless `gracefullyShutdown: false` has been provided on `Server` constructor.
