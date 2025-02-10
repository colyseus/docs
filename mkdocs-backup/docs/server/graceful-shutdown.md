# Graceful Shutdown Process

Colyseus listens for `SIGTERM` and `SIGINT` signals to gracefully shut down the process.

!!! Note "The Graceful Shutdown behaviour has been improved on `@colyseus/core` version `0.15.55`"
    The step to exclude from matchmaking, lock rooms and calling a custom `room.onBeforeShutdown()` method has been introduced on version `@colyseus/core@0.15.55`.

These actions will be performed, in order, before the process is killed:

1. The custom [`gameServer.onBeforeShutdown()`](/server/#on-before-shutdown-callback-function) is called, if defined.
2. The process is excluded from match-making.
3. All existing rooms are locked  ([`room.lock()`](/server/room/#lock)),
4. All rooms [`room.onBeforeShutdown()`](/server/room/#on-before-shutdown) is called.
    - You may override `room.onBeforeShutdown()` to perform custom actions before the room is disposed.
    - By default, `room.onBeforeShutdown()` simply calls `room.disconnect()`, which will trigger `room.onLeave()` for all clients, and then `room.onDispose()`.
5. The server waits for all rooms to be disposed (room count must be zero).
6. The Transport, Presence, and Driver are closed and disconnected.
7. The custom [`gameServer.onShutdown()`](/server/#on-shutdown-callback-function) is called, if defined.

You may use `async` functions or return a `Promise` to perform asynchronous operations on `onLeave` and `onDispose` methods, as well as `gameServer.onBeforeShutdown()` and `gameServer.onShutdown()`.

---

## Returning a `Promise`

By returning a `Promise`, the server will wait for them to be completed before killing the worker process.

``` typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    onLeave (client) {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    onDispose () {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
```

## Using `async`

The `async` keyword will make your function return a `Promise` under the hood. [Read more about Async / Await](https://basarat.gitbook.io/typescript/future-javascript/async-await).

``` typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    async onLeave (client) {
        await doDatabaseOperation(client);
    }

    async onDispose () {
        await removeRoomFromDatabase();
    }
}
```

## Process shutdown callback

You can also listen for process shutdown by setting a `onShutdown` callback.

``` typescript
import { Server } from "colyseus";

const gameServer = new Server();

gameServer.onShutdown(function () {
    console.log("process has shut down!");
});
```
