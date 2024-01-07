# 服务器 API &raquo; 服务器

Colyseus 的 `Server` 实例保存着服务器的配置选项, 比如传输层配置, presence, matchmaking 驱动等.

- **Transport** 是实现服务器和客户端之间双向通信的逻辑层.
- **Presence** 实现房间之间通信以及多 Node.js 进程间通信.
- **Driver** 是存储驱动程序, 用于房间的存储以及 matchmaking 期间的房间检索.

## `new Server (options)`

### `options.transport`

Colyseus 默认使用其内置 WebSocket 传输. 详见 [自定义传输层](/server/transport/).

### `options.driver`

房间 matchmaking 驱动. 用于房间缓存和检索的地方. 需要考虑服务扩展时不要使用 `LocalDriver`.

**配置参数可以是:**

- `LocalDriver` - 默认.
- `RedisDriver` - 取自 `@colyseus/redis-driver`
- `MongooseDriver` - 取自`@colyseus/mongoose-driver`

### `options.presence`

通过多进程/机器扩展 Colyseus 时, 您需要提供一个 presence 服务. 详见 [扩展性](/scalability/) 和 [`Presence API`](/server/presence/#api).

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

---

### `options.gracefullyShutdown`

注册关闭自动处理程序. 默认值是 `true`.
如果被禁用, 您需要在关闭服务时手动
调用 [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) 方法.

---

### `options.server`

!!! Warning "该配置参数将被弃用"
    详见 [WebSocket 传输配置选项](/server/transport/#optionsserver)

WebSocket 服务器绑定到的宿主服务器. 可以把 [`express`](https://www.npmjs.com/package/express) 当作宿主服务器.

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
// Colyseus (不带宿主服务器)
import { Server } from "colyseus";
const port = process.env.port || 3000;

const gameServer = new Server();
gameServer.listen(port);
```

```typescript fct_label="JavaScript (barebones)"
// Colyseus (不带宿主服务器)
const colyseus = require("colyseus");
const port = process.env.port || 3000;

const gameServer = new colyseus.Server();
gameServer.listen(port);
```

---

## `define (roomName: string, room:Room, options?: any)`

为 matchmaker 定义一种房间类型.

- `.define()` 时房间 **并未被创建**
- 房间的创建视客户端请求 ([参见客户端方法](/client/#methods)) 而定

**参数:**

- `roomName: string` - 房间的类型名称. 客户端加入房间时, 需要提供该名称
- `room: Room` - `房间` 类
- `options?: any` - 房间初始化使用的自定义房间参数

```typescript
// 定义 "chat" 房间
gameServer.define("chat", ChatRoom);

// 定义 "battle" 房间
gameServer.define("battle", BattleRoom);

// 定义 "battle" 房间及其自定义房间参数
gameServer.define("battle_woods", BattleRoom, { map: "woods" });
```

!!! Tip "多次定义同一个房间类型"
    允许使用不同的 `房间参数` 多次定义相同类型的房间. 当 [Room#onCreate()](/server/room/#oncreate-options) 被触发时, 最终的 `房间参数` 为 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上定义的房间参数 + 房间创建时提供的参数的混合体.

---

### 房间参数

#### `filterBy(options)`

用 `create()` 或 `joinOrCreate()` 方法创建的房间, 只有 `filterBy()` 的 `options` 被保存在内部, 以便之后 `join()` 或 `joinOrCreate()` 时用来筛选房间.

**参数:**

- `options: string[]` - 一组参数的名字


**示例:** 允许不同的 "game modes".

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['mode']);
```

创建房间时, `mode` 会被存储在房间实例内部.

```typescript
client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */});
```

可以在房间的 `onCreate()` 和 `onJoin()` 里根据房间参数做不同处理, 以实现不同功能.

```typescript
class BattleRoom extends Room {
  onCreate(options) {
    if (options.mode === "duo") {
      // 这种模式下的处理
    }
  }
  onJoin(client, options) {
    if (options.mode === "duo") {
      // 把玩家加入队伍!
    }
  }
}
```

**示例:** 用内置房间参数 `maxClients` 进行房间筛选

`maxClients` 是一个内置的房间参数, 可用于 matchmaking 和房间过滤.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['maxClients']);
```

然后客户端可以指定请求加入某种容量的房间.

```typescript
client.joinOrCreate("battle", { maxClients: 10 }).then(room => {/* ... */});
client.joinOrCreate("battle", { maxClients: 20 }).then(room => {/* ... */});
```

---

#### `sortBy(options)`

基于房间创建时的属性, 可以为房间设置优先级.

`options` 是一个键值对象, 键是属性名, 值是排序方法. 排序方法可以是: `-1`, `"desc"`, `"descending"`, `1`, `"asc"` 或 `"ascending"`.

**示例:** 基于内置属性 `clients` 排序

`clients` 是一个房间内置变量, 用于 matchmaking, 变量值表示当前已连接到该房间的客户端的数量. 在下面的示例中, 拥有最多客户端连接数的房间最优先. 使用 `-1`, `"desc"` 或 `"descending"` 进行降序排序:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: -1 });
```

想要以最少玩家数量为最优先排序, 把参数值反向即可. 即使用 `1`, `"asc"` 或 `"ascending"` 进行升序排序:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: 1 });
```

---

#### 大厅实时房间列表

要让 `LobbyRoom` 接收到某指定类型房间的更新信息, 就要在房间定义的时候开启实时列表功能:

```typescript
gameServer
  .define("battle", BattleRoom)
  .enableRealtimeListing();
```

[更多详情请见 `LobbyRoom`](/builtin-rooms/lobby/)

---

#### 生命周期事件

可以从房间代码之外监听 matchmaking 事件, 例如:

- `"create"` - 当房间被创建时
- `"dispose"` - 当房间被销毁时
- `"join"` - 当客户端加入房间时
- `"leave"` - 当客户端离开房间时
- `"lock"` - 当房间被锁定时
- `"unlock"` - 当房间被解锁时

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
    我们不建议使用这些事件监听器来维护房间 state. 而应使用房间中的 [抽象方法](/server/room/#abstract-methods).

## `simulateLatency (milliseconds: number)`

这是一种在本地开发中模拟客户端 "延迟" 的好方法.

```typescript
// 记得不要在生产环境中使用 `simulateLatency()` 方法.
if (process.env.NODE_ENV !== "production") {

  // 模拟服务器与客户端之间 200ms 的延迟.
  gameServer.simulateLatency(200);
}
```

---

## `listen (port: number)`

将 WebSocket 服务器绑定至指定端口.

---

## `onShutdown (callback:Function)`

注册一个回调, 在处理服务系统关闭之前被调用. 详情请见 [优雅关闭](/server/graceful-shutdown/).

---

## `gracefullyShutdown (exit: boolean)`

关闭所有房间并清理其缓存数据.
当清理完成时, 返回一个已完成的 promise.

该方法会自动被调用, 除非在 `Server` 构造函数中写明 `gracefullyShutdown: false`.
