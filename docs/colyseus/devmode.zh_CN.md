### 工作原理?

引入称作 `devMode` 的参数以便您在 **本地开发** 更新服务端代码时, 能更加方便快捷地迭代.

当更新你的服务端代码时, 在服务器重启之前, 所有活动房间都被保存在本地缓存中, 包括它们的 state 和之前已连接客户端的 sessionId (seat reservations). 服务器重启之后, 所有房间和缓存的 state 都会自动重建.

一旦服务端关闭, 客户端会持续进行重连尝试, 直到重连成功, 或者达到最大重连次数.

![devMode flow](devmode_flow.png)

_(客户端代码并不重载, 只有连接进行重建)_

---

### 开启 `devMode`

默认 `devMode` 是 **disabled** 状态, 可以通过 [Server option](/colyseus/server/api/#optionsdevmode) 打开:

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

!!! Note "注意客户端"
    在 devMode 中重建连接后, `onAdd` schema 回调会在客户端再次触发.
    开发时可能需要您自己忽略它.

!!! Warning "不要在生产环境下使用 `devMode`!"
    该功能影响性能而且对于大量房间没有进行优化. 请确保只在本地开发环境中使用. (Arena 托管并不支持该功能)

---

### 恢复 `state` 之外的数据

- 默认情况下, 只有 room 的 `state` 被缓存并在服务器重启时重建.
- 可以使用实现 `onCacheRoom()` 和 `onRestoreRoom()` 函数重建 `state` 之外的数据.
- 只能重建 JSON-serializable 的数据.

---

#### `onCacheRoom`

Room 被缓存与销毁之前, `onCacheRoom` 会被调用.

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

Room 被重建并且 state 被恢复之后, `onRestoreRoom` 会被调用.

为 `onRestoreRoom` 提供的参数就是前面 `onCacheRoom` 执行完返回的数据.

此时没有客户端建立连接.

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