### 工作原理?

引入称作 `devMode` 的参数以便您在 **本地开发** 更新服务端代码时, 能更加方便快捷地迭代.

当更新你的服务端代码时, 在服务器重启之前, 所有活动房间都被保存在本地缓存中, 包括它们的 state 和之前已连接客户端的 sessionId (seat reservations). 服务器重启之后, 所有房间和缓存的 state 都会自动重建.

The clients are going to try to reconnect as soon as the server goes down, and keep trying a few times until they are successful, or the attempt limit is reached.

![devMode flow](devmode_flow.png)

_(The client-side code is not reloaded, only the connection is re-established)_

---

### Enabling `devMode`

The `devMode` is **disabled** by default and it can be enabled via [Server option](/colyseus/server/api/#optionsdevmode):

```typescript fct_label="Self-hosted"
import { Server } from "colyseus";

const gameServer = new Server({
  // ...
  devMode: true
});
```

```typescript fct_label="arena.config.ts"
import Arena from "@colyseus/arena";

export default Arena({
    // ...
    options: {
        devMode: true
    },
    // ...
});
```

!!! Note "Attention on the client-side"
    Upon re-establishing a connection on devMode, the `onAdd` schema callback will be triggered again on the client-side.
    Be prepared to possibly ignore it during development.

!!! Warning "Do not use `devMode` in production!"
    This feature is very costly and is not optimized for a large amount of rooms. Use it for local development only. (Arena hosting does not support this feature)

---

### Restoring data outside the room's `state`

- By default, only the `state` of the room is cached and restored when the server restarts.
- You can restore data outside the room's `state` by implementing the `onCacheRoom()` and `onRestoreRoom()` methods.
- Only JSON-serializable data is allowed.

---

#### `onCacheRoom`

The `onCacheRoom` will be executed before the room is cached and disposed.

```typescript fct_label="JavaScript"
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

```typescript fct_label="JavaScript"
export class MyRoom extends Room<MyRoomState> {
  // ...

  onRestoreRoom(cachedData: any): void {
    console.log("restoring room", cachedData);

    this.state.players.forEach(player => {
      player.method(cachedData["foo"]);
    });
  }
}
```