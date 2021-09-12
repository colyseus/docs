# 伺服器 API &raquo; 伺服器

Colyseus `Server` 實例會保存伺服器配置選項, 比如傳輸選項, 狀態, 比賽匹配驅動程序等.

- **Transport** 是伺服器和客戶端之間雙向通信的一個分層.
- **Presence** 是使房間和/或 Node.js 進程之間實現通信的執行.
- **Driver** 是用於在比賽匹配期間存儲並查詢房間的存儲驅動程序.

## `new Server (options)`

### `options.transport`

Colyseus 預設使用其內置 WebSocket 傳輸. [點此查看如何自定義傳輸層](/server/transport/).

### `options.presence`

在多個進程/機器中擴展 Colyseus 時,您需要提供一個狀態伺服器.了解更多關於[擴展性](/scalability/)和 [`Presence API`](/server/presence/#api) 的資訊.

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

當前可用的狀態伺服器為:

- `RedisPresence` (在單一伺服器或多個伺服器上擴展)

---

### `options.gracefullyShutdown`

註冊關閉例行程序自動生效.預設值是 `true` 如果被禁用,您需要從關閉進程中手動調用 [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) 方法.

---

### `options.server`

!!! Warning "該選項將被棄用"
    詳見 [WebSocket 傳輸選項](/server/transport/#optionsserver)

要綁定 WebSocket Server 的 HTTP 伺服器.您也可以將 [`express`](https://www.npmjs.com/package/express) 用於您的伺服器.

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

!!! Warning "該選項將被棄用"
    詳見 [WebSocket 傳輸選項](/server/transport/#optionspinginterval)

伺服器"ping"客戶端的毫秒數. 預設:  `3000`

如果客戶端在 [pingMaxRetries](/server/api/#optionspingMaxRetries) 次重試後未能響應, 將被強製斷開連線.

---

### `options.pingMaxRetries`

!!! Warning "該選項將被棄用"
    詳見[WebSocket 傳輸選項](/server/transport/#optionspingmaxretries)

ping 無響應的最大允許數.預設: `2`.

---

### `options.verifyClient`

!!! Warning "該選項將被棄用"
    詳見[WebSocket 傳輸選項](/server/transport/#optionsverifyclient)

該方法會在 WebSocket 握手之前發生.如果 `verifyClient` 未設置, 則握手會被自動接受.

- `info` (Object)
    - `origin` (String) 客戶端指定的 Origin 標頭的值.
    - `req` (http.IncomingMessage) 客戶端 HTTP GET 請求.
    - `secure` (Boolean) `true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已設置.

- `next` (Function) 用戶在 `info`字段檢查時必須調用的回呼.此回呼中的參數為:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) When `result` is `false` 此字段決定要發給客戶端的 HTTP 錯誤狀態代碼.
    - `name` (String) When `result` is `false` 此字段決定 HTTP 動作原因.

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

為匹配器定義一種新類型的房間.

- `.define()` 期間房間 **未創建**
- 客戶端請求時創建房間 ([參閱客戶端方法](/client/client/#methods))

**Parameters:**

- `roomName: string` - 房間的公開名稱.從客戶端加入房間時,您需要使用該名稱
- `--room: Room` - `Room` 類
- `options?: any` - 房間初始化自定義選項

```typescript
// Define "chat" room
gameServer.define("chat", ChatRoom);

// Define "battle" room
gameServer.define("battle", BattleRoom);

// Define "battle" room with custom options
gameServer.define("battle_woods", BattleRoom, { map: "woods" });
```

!!! Tip "多次定義同一個房間處理程序"
    您可能用不同的`選項`多次定義了同一個房間處理程序.當調用 [Room#onCreate()](/server/room/#oncreate-options) 時,`選項` 將包含您在 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上指定的合並值+房間創建時提供的選項.

---

### 房間定義選項

#### `filterBy(options)`

用 `create()` 或 `joinOrCreate()` 方法創建房間時, 只有通過 `filterBy()` 方法定義的 `選項` 將存儲在內部,並在之後的 `join()` 或 `joinOrCreate()` 調用中用於篩選房間.

**Parameters:**

- `options: string[]` - 選項名稱列表


**示例: ** 允許不同的 "遊戲模式".

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['mode']);
```

無論何時創建房間, `模式` 選項都將被存儲在內部.

```typescript
client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */});
```

您可以在 `onCreate()` 和/或 `onJoin()` 中處理提供的選項,在房間實現中執行所需的特性.

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

**示例: ** 由內置 `maxClients` 篩選

`maxClients` 是一個存儲的內置變數,用於匹配比賽,也可用於過濾.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['maxClients']);
```

客戶端可以要求加入一個能夠處理一定數量玩家的房間.

```typescript
client.joinOrCreate("battle", { maxClients: 10 }).then(room => {/* ... */});
client.joinOrCreate("battle", { maxClients: 20 }).then(room => {/* ... */});
```

---

#### `sortBy(options)`

根據房間創建時的資訊,您可以為加入房間設置一個不同的優先級.

`options` 參數是一個鍵值對象, 左邊是字段名稱, 右邊是排序方向. 排序方向可能為下列值之一: `-1`, `"desc"`, `"descending"`, `1`, `"asc"` 或 `"ascending"`.

**示例: ** 由內置`客戶端`篩選

`clients` 是一個存儲的內置變數, 用於匹配比賽, 其包含已連線客戶端的當前數量. 在下面的示例中, 擁有最高數量已連線客戶端的房間將獲得優先權. 使用 `-1`, `"desc"` 或 `"descending"` 進行降序排列:
an internal variable stored for matchmaking, which contains the current number of connected clients. On the example below, the rooms with the highest amount of clients connected will have priority. Use `-1`, `"desc"` or `"descending"` for descending order:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: -1 });
```

如想要以最少數量玩家排序,您可以反向操作.使用 `1`, `"asc"` 或 `"ascending"` 進行升序排列:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: 1 });
```

---

#### 大廳實時列表

想要允許 `LobbyRoom` 從某種特定類型的房間接收更新,您應該啟用實時列表並對房間進行定義:

```typescript
gameServer
  .define("battle", BattleRoom)
  .enableRealtimeListing();
```

[查看有關 `LobbyRoom` 的更多內容](/builtin-rooms/lobby/)

---

#### 公共生命周期事件

您可以從房間實例範圍外監聽匹配比賽事件,例如:

- `"create"` - 當一個房間被創建時
- `"dispose"` - 當一個房間被配置時
- `"join"` - 當一個客戶端加入房間時
- `"leave"` - 當一個客戶端離開房間時
- `"lock"` - 當一個房間被鎖定時
- `"unlock"` - 當一個房間被解鎖時

**用法: **

```typescript
gameServer
  .define("chat", ChatRoom)
  .on("create", (room) => console.log("room created:", room.roomId))
  .on("dispose", (room) => console.log("room disposed:", room.roomId))
  .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
  .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
```

!!! Warning
    我們完全不鼓勵使用這些事件來操縱房間的狀態. 使用房間處理程序中的 [abstract methods](/server/room/#abstract-methods) 作為替代.

## `simulateLatency (milliseconds: number)`

這是一種在本地開發中模擬 "延遲" 客戶端的便捷方式.

```typescript
// Make sure to never call the `simulateLatency()` method in production.
if (process.env.NODE_ENV !== "production") {

  // simulate 200ms latency between server and client.
  gameServer.simulateLatency(200);
}
```

## `attach (options: any)`

> 您通常不需要調用它. 只有在您有非常具體的理由時使用.

附加或創建 WebSocket 伺服器.

- `options.server`: 用於附加 WebSocket 伺服器的 HTTP 伺服器.
- `options.ws`: 要進行重復使用的現有 WebSocket 伺服器.

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

將 WebSocket 伺服器綁定至特定端口.

## `onShutdown (callback:Function)`

註冊一個回呼, 其應該在進程關閉前被調用. 查看 [優雅關閉](/server/graceful-shutdown/) 了解更多詳細資訊.

## `gracefullyShutdown (exit: boolean)`

關閉所有房間並清理其緩存數據. 每當清理完成時, 都會返回一個表示任務完成的承諾.

除非已在 `Server` 構造函數中提供 `gracefullyShutdown: false`, 否則會自動調用此方法.
