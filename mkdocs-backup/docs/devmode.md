### How `devMode` works?

The `devMode` option has been introduced to speed up **local development** while updating your room implementation.

!!! Warning "Do not use in production!"
    This feature is not optimized for a large amount of rooms. Use it for local development only.

Whenever you update your server code, before the server restarts, all active rooms are cached locally, including their state and sessionId's of previously connected clients (seat reservations). After the restart, all rooms are recreated and the cached state is restored.

The clients are going to try to reconnect as soon as the server goes down, and keep trying a few times until they are successful, or the attempt limit is reached.

![devMode flow](devmode_flow.png)

_(The client-side code is **not reloaded**, only the connection is re-established)_

---

### Enabling `devMode`

The `devMode` is disabled by default and it can be enabled via [Server option](/server/api/#optionsdevmode):

=== "app.config.ts"

    ``` typescript
    import config from "@colyseus/tools";

    export default config({
        // ...
        options: {
            devMode: true
        },
        // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "colyseus";

    const gameServer = new Server({
      // ...
      devMode: true
    });
    ```

!!! Note "Attention on the client-side"
    Upon re-establishing a connection on devMode, the `onAdd` schema callback will be triggered again on the client-side.
    Be prepared to ignore additional `onAdd` calls during development.

---

### Restoring data outside the room's `state`

- By default, only the `state` of the room is cached and restored when the server restarts.
- You can restore data outside the room's `state` by implementing the `onCacheRoom()` and `onRestoreRoom()` methods.
- Only JSON-serializable data is allowed.

---

#### `onCacheRoom`

The `onCacheRoom` will be executed before the room is cached and disposed.

``` typescript
export class MyRoom extends Room<MyRoomState> {
  // ...

  onCacheRoom() {
    return { foo: "bar" };
  }
}
```

---

#### `onRestoreRoom`

The `onRestoreRoom` will be executed after the room has been restored and the restored state is available.

The argument provided for the `onRestoreRoom` is the data previously returned by the `onCacheRoom` method.

No clients are connected yet at this point.

``` typescript
export class MyRoom extends Room<MyRoomState> {
  // ...

  onRestoreRoom(cachedData: any): void {
    console.log("restoring room", cachedData);

    this.state.players.forEach((player) => {
      player.method(cachedData["foo"]);
    });
  }
}
```
