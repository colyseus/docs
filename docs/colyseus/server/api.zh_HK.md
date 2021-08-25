# 服务器 API » 服务器

Colyseus{1>Server<1} 实例会保存服务器配置选项，比如传输选项、状态、比赛匹配驱动程序等。

- {1>Transport<1} 是服务器和客户端之间双向通信的一个分层。
- {1>Presence<1} 是使房间和/或 Node.js 进程之间实现通信的执行。
- {1>Driver<1} 是用于在比赛匹配期间存储并查询房间的存储驱动程序。

## {1>new Server (options)<1}

### {1>options.transport<1}

Colyseus 默认使用其内置 WebSocket 传输。{1>点此查看如何自定义传输层<1}。

### {1>options.presence<1}

在多个进程/机器中扩展 Colyseus 时，您需要提供一个状态服务器。了解更多关于{1>扩展性<1}和 {2>{3>Presence API<3}<2} 的信息。

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence() }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() }); \`\`\`

当前可用的状态服务器为：

- {1>RedisPresence<1}（在单一服务器或多个服务器上扩展）

---

### {1>options.gracefullyShutdown<1}

注册关闭例行程序自动生效。默认值是 {1>true<1}如果被禁用，您需要从关闭进程中手动调用 {2>{3>gracefullyShutdown()<3}<2} 方法。

---

### {1>options.server<1}:

!!!警告 “该选项将被弃用”见{1>WebSocket 传输选项<1}

要绑定 WebSocket Server 的 HTTP 服务器。您也可以将 {1>{2>express<2}<1} 用于您的服务器。

\`\`\`typescript fct\_label="TypeScript" // Colyseus + Express import { Server } from "colyseus"; import { createServer } from "http"; import express from "express"; const port = Number(process.env.port) || 3000;

const app = express(); app.use(express.json());

const gameServer = new Server({ server: createServer(app) });

gameServer.listen(port); \`\`\`

\`\`\`typescript fct\_label="JavaScript" // Colyseus + Express const colyseus = require("colyseus"); const http = require("http"); const express = require("express"); const port = process.env.port || 3000;

const app = express(); app.use(express.json());

const gameServer = new colyseus.Server({ server: http.createServer(app) });

gameServer.listen(port); \`\`\`

\`\`\`typescript fct\_label="TypeScript (barebones)" // Colyseus (barebones) import { Server } from "colyseus"; const port = process.env.port || 3000;

const gameServer = new Server(); gameServer.listen(port); \`\`\`

\`\`\`typescript fct\_label="JavaScript (barebones)" // Colyseus (barebones) const colyseus = require("colyseus"); const port = process.env.port || 3000;

const gameServer = new colyseus.Server(); gameServer.listen(port); \`\`\`

---

### {1>options.pingInterval<1}

!!!警告 “该选项将被弃用”见{1>WebSocket 传输选项<1}

服务器"ping"客户端的毫秒数。默认：{1}

如果客户端在 {1>pingMaxRetries<1} 次重试后未能响应，将被强制断开连接。

---

### {1>options.pingMaxRetries<1}

!!!警告 “该选项将被弃用”见{1>WebSocket 传输选项<1}

ping 无响应的最大允许数。默认：{1}

---

### {1>options.verifyClient<1}

!!!警告 “该选项将被弃用”见{1>WebSocket 传输选项<1}

该方法会在 WebSocket 握手之前发生。如果 {1>verifyClient<1} 未设置，则握手会被自动接受。

- {1>info<1} (Object)
    - {1>origin<1} (String) 客户端指定的 Origin 标头的值。
    - {1>req<1} (http.IncomingMessage) 客户端 HTTP GET 请求。
    - {1>secure<1} (Boolean) {2>true<2} 如果 {3>req.connection.authorized<3} 或 {4>req.connection.encrypted<4} 已设置。

- {1>next<1} (Function) 用户在 {2>info<2} 字段检查时必须调用的回调。此回调中的参数为：
    - {1>result<1} (Boolean) 是否接受握手。
    - {1>code<1} (Number) When {2>result<2} is {3>false<3} 此字段决定要发给客户端的 HTTP 错误状态代码。
    - {1>name<1} (String) When {2>result<2} is {3>false<3} 此字段决定 HTTP 动作原因。

\`\`\`typescript fct\_label="TypeScript" import { Server } from "colyseus";

const gameServer = new Server({ // ...

  verifyClient: function (info, next) { // validate 'info' // // - next(false) will reject the websocket handshake // - next(true) will accept the websocket handshake } }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ...

  verifyClient: function (info, next) { // validate 'info' // // - next(false) will reject the websocket handshake // - next(true) will accept the websocket handshake } }); \`\`\`

---

## {1}define (roomName: string, room:Room, options?: any){2}

为匹配器定义一种新类型的房间。

- {2>.define()<2} 期间房间{1>未创建<1}
- 客户端请求时创建房间({1>参阅客户端方法<1})

{1>Parameters:<1}

- {1>roomName: string<1} - 房间的公开名称。从客户端加入房间时，您需要使用该名称
- {1>--room<1}:从房间离开
- {1>options?: any<1} - 房间初始化自定义选项

\`\`\`typescript // Define "chat" room gameServer.define("chat", ChatRoom);

// Define "battle" room gameServer.define("battle", BattleRoom);

// Define "battle" room with custom options gameServer.define("battle\_woods", BattleRoom, { map: "woods" }); \`\`\`

!!!提示 “多次定义同一个房间处理程序” 您可能用不同的{1>选项<1}多次定义了同一个房间处理程序。当调用 {2>Room#onCreate()<2} 时，{3>选项<3} 将包含您在 {4>Server#define()<4} 上指定的合并值+房间创建时提供的选项。

---

### 房间定义选项

#### {1>filterBy(options)<1}

用 {1>create()<1} 或 {2>joinOrCreate()<2} 方法创建房间时，只有通过 {4>filterBy()<4} 方法定义的{3>选项<3}将存储在内部，并在之后的 {5>join()<5} 或 {6>joinOrCreate()<6} 调用中用于筛选房间。

{1>Parameters:<1}

- {1>options: string\[]<1} - 选项名称列表


{1>示例：<1}允许不同的“游戏模式”。

{1>typescript gameServer .define("battle", BattleRoom) .filterBy(\['mode']); <1}

无论何时创建房间，{1>模式<1}选项都将被存储在内部。

{1>typescript client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... \*/}); <1}

您可以在 {1>onCreate()<1} 和/或 {2>onJoin()<2} 中处理提供的选项，在房间实现中执行所需的特性。

{1>typescript class BattleRoom extends Room { onCreate(options) { if (options.mode === "duo") { // do something! } } onJoin(client, options) { if (options.mode === "duo") { // put this player into a team! } } } <1}

{1>示例：<1} 由内置 {2>maxClients<2} 筛选

{1>maxClients<1} 是一个存储的内置变量，用于匹配比赛，也可用于过滤。

{1>typescript gameServer .define("battle", BattleRoom) .filterBy(\['maxClients']); <1}

客户端可以要求加入一个能够处理一定数量玩家的房间。

{1}typescript client.joinOrCreate("battle", { maxClients:10 }).then(room => {/* ... \*/}); client.joinOrCreate("battle", { maxClients:20 }).then(room => {/* ... \*/}); {2}

---

#### {1>sortBy(options)<1}

根据房间创建时的信息，您可以为加入房间设置一个不同的优先级。

{1>options<1} 参数是一个键值对象，左边是字段名称，右边是排序方向。排序方向可能为下列值之一：{2>-1<2}、{3>"desc"<3}、{4>"descending"<4}、{5>1<5}、{6>"asc"<6}或{7>"ascending"<7}。

{1>示例：<1} 由内置{2>客户端<2}筛选

{1>clients<1} 是一个存储的内置变量，用于匹配比赛，其包含已连接客户端的当前数量。在下面的示例中，拥有最高数量已连接客户端的房间将获得优先权。使用 {2>-1<2}、{3>"desc"<3} 或 {4>"descending"<4} 进行降序排列：

{1}typescript gameServer .define("battle", BattleRoom) .sortBy({ clients:

如想要以最少数量玩家排序，您可以反向操作。使用 {1>1<1}、{2>"asc"<2} 或 {3>"ascending"<3} 进行升序排列：

{1}typescript gameServer .define("battle", BattleRoom) .sortBy({ clients:{1}

---

#### 大厅实时列表

想要允许 {1>LobbyRoom<1} 从某种特定类型的房间接收更新，您应该启用实时列表并对房间进行定义：

{1>typescript gameServer .define("battle", BattleRoom) .enableRealtimeListing(); <1}

{1>查看有关 {2>LobbyRoom<2} 的更多内容<1}

---

#### 公共生命周期事件

您可以从房间实例范围外监听匹配比赛事件，例如：

- {1>"create"<1} - 当一个房间被创建时
- {1>"dispose"<1} - 当一个房间被配置时
- {1>"join"<1} - 当一个客户端加入房间时
- {1>"leave"<1} - 当一个客户端离开房间时
- {1>"lock"<1} - 当一个房间被锁定时
- {1>"unlock"<1} - 当一个房间被解锁时

用法

{1>typescript gameServer .define("chat", ChatRoom) .on("create", (room) => console.log("room created:", room.roomId)) .on("dispose", (room) => console.log("room disposed:", room.roomId)) .on("join", (room, client) => console.log(client.id, "joined", room.roomId)) .on("leave", (room, client) => console.log(client.id, "left", room.roomId)); <1}

!!!我们完全不鼓励使用这些事件来操纵房间的状态。使用房间处理程序中的 {1>abstract methods<1} 作为替代。

## {1>simulateLatency (milliseconds: number)<1}

这是一种在本地开发中模拟“延迟”客户端的便捷方式。

\`\`\`typescript // Make sure to never call the {1>simulateLatency()<1} method in production. if (process.env.NODE\_ENV !== "production") {

  // simulate 200ms latency between server and client. gameServer.simulateLatency(200); } \`\`\`

## {1>attach (options: any)<1}

> 您通常不需要调用它。只有在您有非常具体的理由时使用。

附加或创建 WebSocket 服务器。

- {1>options.server<1}:用于附加 WebSocket 服务器的 HTTP 服务器。
- {1>options.ws<1}:要进行重复使用的现有 WebSocket 服务器.

\`\`\`javascript fct\_label="Express" import express from "express"; import { Server } from "colyseus";

const app = new express(); const gameServer = new Server();

gameServer.attach({ server: app }); \`\`\`

\`\`\`javascript fct\_label="http.createServer" import http from "http"; import { Server } from "colyseus";

const httpServer = http.createServer(); const gameServer = new Server();

gameServer.attach({ server: httpServer }); \`\`\`

\`\`\`javascript fct\_label="WebSocket.Server" import http from "http"; import express from "express"; import ws from "ws"; import { Server } from "colyseus";

const app = express(); const server = http.createServer(app); const wss = new WebSocket.Server({ // your custom WebSocket.Server setup. });

const gameServer = new Server(); gameServer.attach({ ws: wss }); \`\`\`


## {1>listen (port: number)<1}

将 WebSocket 服务器绑定至特定端口。

## {1}onShutdown (callback:Function){2}

注册一个回调，其应该在进程关闭前被调用。查看{1>优雅关闭<1}了解更多详细信息。

## {1>gracefullyShutdown (exit: boolean)<1}

关闭所有房间并清理其缓存数据。每当清理完成时，都会返回一个表示任务完成的承诺。

除非已在 {2>Server<2} 构造函数中提供 {1>gracefullyShutdown: false<1}，否则会自动调用此方法。
