# 服務器 API &raquo; 服務器

Colyseus 的 `Server` 實例保存著服務器的配置選項, 比如傳輸層配置, presence, matchmaking 驅動等.

- **Transport** 是實現服務器和客戶端之間雙向通信的邏輯層.
- **Presence** 實現房間之間通信以及多 Node.js 進程間通信.
- **Driver** 是存儲驅動程序, 用于房間的存儲以及 matchmaking 期間的房間檢索.

## `new Server (options)`

### `options.transport`

Colyseus 默認使用其內置 WebSocket 傳輸. 詳見 [自定義傳輸層](/server/transport/).

### `options.driver`

房間 matchmaking 驅動. 用于房間緩存和檢索的地方. 需要考慮服務擴展時不要使用 `LocalDriver`.

**配置參數可以是:**

- `LocalDriver` - 默認.
- `RedisDriver` - 取自 `@colyseus/redis-driver`
- `MongooseDriver` - 取自`@colyseus/mongoose-driver`

### `options.presence`

通過多進程/機器擴展 Colyseus 時, 您需要提供壹個 presence 服務. 詳見 [擴展性](/scalability/) 和 [`Presence API`](/server/presence/#api).

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

注冊關閉自動處理程序. 默認值是 `true`.
如果被禁用, 您需要在關閉服務時手動
調用 [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) 方法.

---

### `options.devMode`

叠代開發階段基于服務器重啓恢複先前房間.
默認值爲 `false`. 詳情參見 [`devMode`](/colyseus/devmode).

---

### `options.server`

!!! Warning "該配置參數將被棄用"
    詳見 [WebSocket 傳輸配置選項](/server/transport/#optionsserver)

WebSocket 服務器綁定到的宿主服務器. 可以把 [`express`](https://www.npmjs.com/package/express) 當作宿主服務器.

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
// Colyseus (不帶宿主服務器)
import { Server } from "colyseus";
const port = process.env.port || 3000;

const gameServer = new Server();
gameServer.listen(port);
```

```typescript fct_label="JavaScript (barebones)"
// Colyseus (不帶宿主服務器)
const colyseus = require("colyseus");
const port = process.env.port || 3000;

const gameServer = new colyseus.Server();
gameServer.listen(port);
```

---

## `define (roomName: string, room:Room, options?: any)`

爲 matchmaker 定義壹種房間類型.

- `.define()` 時房間 **並未被創建**
- 房間的創建視客戶端請求 ([參見客戶端方法](/client/#methods)) 而定

**參數:**

- `roomName: string` - 房間的類型名稱. 客戶端加入房間時, 需要提供該名稱
- `room: Room` - `房間` 類
- `options?: any` - 房間初始化使用的自定義房間參數

```typescript
// 定義 "chat" 房間
gameServer.define("chat", ChatRoom);

// 定義 "battle" 房間
gameServer.define("battle", BattleRoom);

// 定義 "battle" 房間及其自定義房間參數
gameServer.define("battle_woods", BattleRoom, { map: "woods" });
```

!!! Tip "多次定義同壹個房間類型"
    允許使用不同的 `房間參數` 多次定義相同類型的房間. 當 [Room#onCreate()](/server/room/#oncreate-options) 被觸發時, 最終的 `房間參數` 爲 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上定義的房間參數 + 房間創建時提供的參數的混合體.

---

### 房間參數

#### `filterBy(options)`

用 `create()` 或 `joinOrCreate()` 方法創建的房間, 只有 `filterBy()` 的 `options` 被保存在內部, 以便之後 `join()` 或 `joinOrCreate()` 時用來篩選房間.

**參數:**

- `options: string[]` - 壹組參數的名字


**示例:** 允許不同的 "game modes".

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['mode']);
```

創建房間時, `mode` 會被存儲在房間實例內部.

```typescript
client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */});
```

可以在房間的 `onCreate()` 和 `onJoin()` 裏根據房間參數做不同處理, 以實現不同功能.

```typescript
class BattleRoom extends Room {
  onCreate(options) {
    if (options.mode === "duo") {
      // 這種模式下的處理
    }
  }
  onJoin(client, options) {
    if (options.mode === "duo") {
      // 把玩家加入隊伍!
    }
  }
}
```

**示例:** 用內置房間參數 `maxClients` 進行房間篩選

`maxClients` 是壹個內置的房間參數, 可用于 matchmaking 和房間過濾.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['maxClients']);
```

然後客戶端可以指定請求加入某種容量的房間.

```typescript
client.joinOrCreate("battle", { maxClients: 10 }).then(room => {/* ... */});
client.joinOrCreate("battle", { maxClients: 20 }).then(room => {/* ... */});
```

---

#### `sortBy(options)`

基于房間創建時的屬性, 可以爲房間設置優先級.

`options` 是壹個鍵值對象, 鍵是屬性名, 值是排序方法. 排序方法可以是: `-1`, `"desc"`, `"descending"`, `1`, `"asc"` 或 `"ascending"`.

**示例:** 基于內置屬性 `clients` 排序

`clients` 是壹個房間內置變量, 用于 matchmaking, 變量值表示當前已連接到該房間的客戶端的數量. 在下面的示例中, 擁有最多客戶端連接數的房間最優先. 使用 `-1`, `"desc"` 或 `"descending"` 進行降序排序:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: -1 });
```

想要以最少玩家數量爲最優先排序, 把參數值反向即可. 即使用 `1`, `"asc"` 或 `"ascending"` 進行升序排序:

```typescript
gameServer
  .define("battle", BattleRoom)
  .sortBy({ clients: 1 });
```

---

#### 大廳實時房間列表

要讓 `LobbyRoom` 接收到某指定類型房間的更新信息, 就要在房間定義的時候開啓實時列表功能:

```typescript
gameServer
  .define("battle", BattleRoom)
  .enableRealtimeListing();
```

[更多詳情請見 `LobbyRoom`](/builtin-rooms/lobby/)

---

#### 生命周期事件

可以從房間代碼之外監聽 matchmaking 事件, 例如:

- `"create"` - 當房間被創建時
- `"dispose"` - 當房間被銷毀時
- `"join"` - 當客戶端加入房間時
- `"leave"` - 當客戶端離開房間時
- `"lock"` - 當房間被鎖定時
- `"unlock"` - 當房間被解鎖時

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
    我們不建議使用這些事件監聽器來維護房間 state. 而應使用房間中的 [抽象方法](/server/room/#abstract-methods).

## `simulateLatency (milliseconds: number)`

這是壹種在本地開發中模擬客戶端 "延遲" 的好方法.

```typescript
// 記得不要在生産環境中使用 `simulateLatency()` 方法.
if (process.env.NODE_ENV !== "production") {

  // 模擬服務器與客戶端之間 200ms 的延遲.
  gameServer.simulateLatency(200);
}
```

---

## `listen (port: number)`

將 WebSocket 服務器綁定至指定端口.

---

## `onShutdown (callback:Function)`

注冊壹個回調, 在處理服務系統關閉之前被調用. 詳情請見 [優雅關閉](/server/graceful-shutdown/).

---

## `gracefullyShutdown (exit: boolean)`

關閉所有房間並清理其緩存數據.
當清理完成時, 返回壹個已完成的 promise.

該方法會自動被調用, 除非在 `Server` 構造函數中寫明 `gracefullyShutdown: false`.
