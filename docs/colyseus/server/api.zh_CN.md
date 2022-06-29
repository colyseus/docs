# 服务器 API &raquo; 服务器

Colyseus 的 `Server` 实例保存着服务器的配置选项, 比如传输层配置, presence, matchmaking 驱动等.

- **Transport** 是服务器和客户端之间双向通信的一个分层.
- **Presence** 是使房间和/或 Node.js 进程之间实现通信的执行.
- **Driver** 是用于在比赛匹配期间存储并查询房间的存储驱动程序.

## `new Server (options)`

### `options.transport`

Colyseus 默认使用其内置 WebSocket 传输. [点此查看如何自定义传输层](/server/transport/).

### `options.presence`

在多个进程/机器中扩展 Colyseus 时,您需要提供一个状态服务器. 了解更多关于 [扩展性](/scalability/) 和 [`Presence API`](/server/presence/#api) 的信息.

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  presence: new RedisPresence()
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence()
});
```

当前可用的状态服务器为:

- `RedisPresence` (在单一服务器或多个服务器上扩展)

---

### `options.gracefullyShutdown`

注册关闭例行程序自动生效. 默认值是 `true` 如果被禁用, 您需要从关闭进程中手动调用 [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) 方法.

---

### `options.server`

!!! Warning "该选项将被弃用"
    详见 [WebSocket 传输选项](/server/transport/#optionsserver)

要绑定 WebSocket Server 的 HTTP 服务器. 您也可以将 [`express`](https://www.npmjs.com/package/express) 用于您的服务器.

```typescript fct_label="TypeScript"
// Colyseus + Express
import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
const port = Number(process.env.port) || 3000;

const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app)
});

gameServer.listen(port);
```

```typescript fct_label="JavaScript"
// Colyseus + Express
const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const port = process.env.port || 3000;

const app = express();
app.use(express.json());

const gameServer = new colyseus.Server({
  server: http.createServer(app)
});

gameServer.listen(port);
```

```typescript fct_label="TypeScript (barebones)"
// Colyseus (barebones)
import { Server } from "colyseus";
const port = process.env.port || 3000;

const gameServer = new Server();
gameServer.listen(port);
```

```typescript fct_label="JavaScript (barebones)"
// Colyseus (barebones)
const colyseus = require("colyseus");
const port = process.env.port || 3000;

const gameServer = new colyseus.Server();
gameServer.listen(port);
```

---

### `options.pingInterval`

!!! Warning "该选项将被弃用"
    详见 [WebSocket 传输选项](/server/transport/#optionspinginterval)

服务器 "ping" 客户端的毫秒数. 默认: `3000`

如果客户端在 [pingMaxRetries](/server/api/#optionspingMaxRetries) 次重试后未能响应, 将被强制断开连接.

---

### `options.pingMaxRetries`

!!! Warning "该选项将被弃用"
    详见[WebSocket 传输选项](/server/transport/#optionspingmaxretries)

ping 无响应的最大允许数. 默认: `2`.

---

### `options.verifyClient`

!!! Warning "该选项将被弃用"
    详见[WebSocket 传输选项](/server/transport/#optionsverifyclient)

该方法会在 WebSocket 握手之前发生. 如果 `verifyClient` 未设置, 则握手会被自动接受.

- `info` (Object)
    - `origin` (String) 客户端指定的 Origin 标头的值.
    - `req` (http.IncomingMessage) 客户端 HTTP GET 请求.
    - `secure` (Boolean) `true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已设置.

- `next` (Function) 用户在 `info` 字段检查时必须调用的回调.此回调中的参数为:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) When `result` is `false` 此字段决定要发给客户端的 HTTP 错误状态代码.
    - `name` (String) When `result` is `false` 此字段决定 HTTP 动作原因.

```typescript fct_label="TypeScript"
import { Server } from "colyseus";

const gameServer = new Server({
  // ...

  verifyClient: function (info, next) {
    // validate 'info'
    //
    // - next(false) will reject the websocket handshake
    // - next(true) will accept the websocket handshake
  }
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...

  verifyClient: function (info, next) {
    // validate 'info'
    //
    // - next(false) will reject the websocket handshake
    // - next(true) will accept the websocket handshake
  }
});
```

---

## `define (roomName: string, room:Room, options?: any)`

为匹配器定义一种新类型的房间.

- `.define()` 期间房间 **未创建**
- 客户端请求时创建房间 ([参阅客户端方法](/client/#methods))

**Parameters:**

- `roomName: string` - 房间的公开名称. 从客户端加入房间时, 您需要使用该名称
- `--room: Room` - `Room` 类
- `options?: any` - 房间初始化自定义选项

```typescript
// Define "chat" room
gameServer.define("chat", ChatRoom);

// Define "battle" room
gameServer.define("battle", BattleRoom);

// Define "battle" room with custom options
gameServer.define("battle_woods", BattleRoom, { map: "woods" });
```

!!! Tip "多次定义同一个房间处理程序"
    您可能用不同的 `选项` 多次定义了同一个房间处理程序. 当调用 [Room#onCreate()](/server/room/#oncreate-options) 时, `选项` 将包含您在 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上指定的合并值 + 房间创建时提供的选项.

---

### 房间定义选项

#### `filterBy(options)`

用 `create()` 或 `joinOrCreate()` 方法创建房间时, 只有通过 `filterBy()` 方法定义的 `选项` 将存储在内部, 并在之后的 `join()` 或 `joinOrCreate()` 调用中用于筛选房间.

**Parameters:**

- `options: string[]` - 选项名称列表


**示例:** 允许不同的 "游戏模式".

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['mode']);
```

无论何时创建房间, `模式` 选项都将被存储在内部.

```typescript
client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */});
```

您可以在 `onCreate()` 和/或 `onJoin()` 中处理提供的选项,在房间实现中执行所需的特性.

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

**示例:** 由内置 `maxClients` 筛选

`maxClients` 是一个存储的内置变量, 用于匹配比赛,也可用于过滤.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['maxClients']);
```

客户端可以要求加入一个能够处理一定数量玩家的房间.

```typescript
client.joinOrCreate("battle", { maxClients: 10 }).then(room => {/* ... */});
client.joinOrCreate("battle", { maxClients: 20 }).then(room => {/* ... */});
```

---

#### `sortBy(options)`

根据房间创建时的資訊, 您可以为加入房间设置一个不同的优先级.

`options` 参数是一个键值对象, 左边是字段名称, 右边是排序方向. 排序方向可能为下列值之一: `-1`, `"desc"`, `"descending"`, `1`, `"asc"` 或 `"ascending"`.

**示例:** 由内置`客户端`筛选

`clients` 是一个存储的内置变量, 用于匹配比赛, 其包含已连接客户端的当前数量. 在下面的示例中, 拥有最高数量已连接客户端的房间将获得优先权. 使用 `-1`, `"desc"` 或 `"descending"` 进行降序排列:
an internal variable stored for matchmaking, which contains the current number of connected clients. On the example below, the rooms with the highest amount of clients connected will have priority. Use `-1`, `"desc"` or `"descending"` for descending order:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: -1 });
```

如想要以最少数量玩家排序,您可以反向操作. 使用 `1`, `"asc"` 或 `"ascending"` 进行升序排列:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: 1 });
```

---

#### 大厅实时列表

想要允许 `LobbyRoom` 从某种特定类型的房间接收更新, 您应该启用实时列表并对房间进行定义:

```typescript
gameServer
  .define("battle", BattleRoom)
  .enableRealtimeListing();
```

[查看有关 `LobbyRoom` 的更多内容](/builtin-rooms/lobby/)

---

#### 公共生命周期事件

您可以从房间实例范围外监听匹配比赛事件, 例如:

- `"create"` - 当一个房间被创建时
- `"dispose"` - 当一个房间被配置时
- `"join"` - 当一个客户端加入房间时
- `"leave"` - 当一个客户端离开房间时
- `"lock"` - 当一个房间被锁定时
- `"unlock"` - 当一个房间被解锁时

**用法:**

```typescript
gameServer
  .define("chat", ChatRoom)
  .on("create", (room) => console.log("room created:", room.roomId))
  .on("dispose", (room) => console.log("room disposed:", room.roomId))
  .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
  .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
```

!!! Warning
    我们完全不鼓励使用这些事件来操纵房间的状态. 使用房间处理程序中的 [abstract methods](/server/room/#abstract-methods) 作为替代.

## `simulateLatency (milliseconds: number)`

这是一种在本地开发中模拟 "延迟" 客户端的便捷方式.

```typescript
// Make sure to never call the `simulateLatency()` method in production.
if (process.env.NODE_ENV !== "production") {

  // simulate 200ms latency between server and client.
  gameServer.simulateLatency(200);
}
```

## `attach (options: any)`

> 您通常不需要调用它. 只有在您有非常具体的理由时使用.

附加或创建 WebSocket 服务器.

- `options.server`: 用于附加 WebSocket 服务器的 HTTP 服务器.
- `options.ws`: 要进行重复使用的现有 WebSocket 服务器.

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


## `listen (port: number)`

将 WebSocket 服务器绑定至特定端口.

## `onShutdown (callback:Function)`

注册一个回调, 其应该在进程关闭前被调用. 查看 [优雅关闭](/server/graceful-shutdown/) 了解更多详细資訊.

## `gracefullyShutdown (exit: boolean)`

关闭所有房间并清理其缓存数据. 每当清理完成时, 都会返回一个表示任务完成的承诺.

除非已在 `Server` 构造函数中提供 `gracefullyShutdown: false`, 否则会自动调用此方法.
