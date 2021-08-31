# Server API » Server

Colyseus `Server` 執行個體包含伺服器配置選項，例如傳輸選項、在線狀態、匹配驅動程式等。

- **Transport** 是伺服器和用戶端之間的雙向通信層。
- **Presence** 是支持聊天室和/或 Node.js 處理序之間通信的實作。
- **Driver** 是匹配時用於儲存和查詢房間的儲存驅動程式。

## `new Server (options)`

### `options.transport`

Colyseus 預設使用其內建的 WebSocket 傳輸。查看如何[在此處自訂傳輸層](/server/transport/)。

### `options.presence`

當透過多個處理序/機器擴展 Colyseus 時，您需要提供一個在線伺服器。詳細了解[可擴縮性](/scalability/)和 \\[`Presence API`](/server/presence/#api)。

```typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence() }); ```

```typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() }); ```

目前可用的 Presence 伺服器包括：

- `RedisPresence`（在單台伺服器和多台伺服器上擴展）

---

### `options.gracefullyShutdown`

自動註冊關機程式。預設為 `true`如果停用，您應該在關閉過程中手動調用 [`gracefullyShutdown()`](#gracefullyshutdown-exit-boolean) 方法。

---

### `options.server`:

!!!警告「此選項將被棄用」請參閱 [WebSocket 傳輸選項](/server/transport/#optionsserver)

要將 WebSocket 伺服器綁定到的 HTTP 伺服器。您也可以將 [`express`](https://www.npmjs.com/package/express) 用於您的伺服器。

```typescript fct\_label="TypeScript" // Colyseus + Express import { Server } from "colyseus"; import { createServer } from "http"; import express from "express"; const port = Number(process.env.port) || 3000;

const app = express(); app.use(express.json());

const gameServer = new Server({ server: createServer(app) });

gameServer.listen(port); ```

```typescript fct\_label="JavaScript" // Colyseus + Express const colyseus = require("colyseus"); const http = require("http"); const express = require("express"); const port = process.env.port || 3000;

const app = express(); app.use(express.json());

const gameServer = new colyseus.Server({ server: http.createServer(app) });

gameServer.listen(port); ```

```typescript fct\_label="TypeScript (barebones)" // Colyseus (barebones) import { Server } from "colyseus"; const port = process.env.port || 3000;

const gameServer = new Server(); gameServer.listen(port); ```

```typescript fct\_label="JavaScript (barebones)" // Colyseus (barebones) const colyseus = require("colyseus"); const port = process.env.port || 3000;

const gameServer = new colyseus.Server(); gameServer.listen(port); ```

---

### `options.pingInterval`

!!!警告「此選項將被棄用」請參閱 [WebSocket 傳輸選項](/server/transport/#optionspinginterval)

伺服器「偵測」用戶端的毫秒數。預設：`3000`

如果用戶端在[pingMaxRetries](/server/api/#optionspingMaxRetries) 重試後無法回應，則會強制中斷連接。

---

### `options.pingMaxRetries`

!!!警告「此選項將被棄用」請參閱 [WebSocket 傳輸選項](/server/transport/#optionspingmaxretries)

無回應下允許的最大偵測數。預設：`2`.

---

### `options.verifyClient`

!!!警告「此選項將被棄用」請參閱 [WebSocket 傳輸選項](/server/transport/#optionsverifyclient)

WebSocket 交換信號前會發生此方法。如果 `verifyClient` 未設定，則會自動接受信號交換。

- `info`（物件）
    - `origin`（字串）用戶端指示的原始標頭中的值。
    - `req` (http.IncomingMessage) 用戶端 HTTP GET 請求。
    - `secure`（布林值）`true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已設定。

- `next`（函式）使用者在檢查 `info` 欄位時必須調用的回調。此回調的引數為：
    - `result`（布林值）接受或不接受信號交換。
    - `code`（數字）當 `result` 為 `false` 時，此欄位會決定要傳送給用戶端的 HTTP 錯誤狀態代碼。
    - `name`（字串）當 `result` 為 `false` 時，此欄位會決定 HTTP 原因說明。

```typescript fct\_label="TypeScript" import { Server } from "colyseus";

const gameServer = new Server({ // ...

  verifyClient: function (info, next) { // 驗證 'info' // // - next(false) 將拒絕 websocket 握手 // - next(true) 將接受 websocket 握手 } }); ```

```typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ...

  verifyClient: function (info, next) { // 驗證 'info' // // - next(false) 將拒絕 websocket 握手 // - next(true) 將接受 websocket 握手 } }); ```

---

## `define (roomName: string, room:Room, options?: any)`

為媒人定義新的房間類型。

- 在 `.define()` 期間**未建立**房間
- 房間是根據用戶端請求建立的（[請參閱用戶端方法](/client/client/#methods)）

**參數：**

- `roomName: string` \- 房間的公共名稱。從用戶端加入房間時，您將使用此名稱
- `--room`:Room` - `Room` 類別
- `options?: any` \- 房間初始化的自訂選項

```typescript // 定義「聊天」房間 gameServer.define("chat", ChatRoom);

// 定義「戰鬥」房間 gameServer.define("battle", BattleRoom);

// 使用自訂選項定義「戰鬥」房間 gameServer.define("battle\_woods", BattleRoom, { map: "woods" }); ``

!!!提示「多次定義同一個房間處理程序」 您可以使用不同的 `options` 多次定義同一個房間處理程序。當調用 [Room#onCreate()](/server/room/#oncreate-options) 時，`options` 將包含您在 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上指定的合併值 + 房間建立時提供的選項。

---

### 房間定義選項

#### `filterBy(options)`

每當透過 `create()` 或 `joinOrCreate()` 方法建立房間時，只有 `filterBy()` 方法定義的 `options` 將儲存在內部，並用於在進一步的 `join()` 或 `joinOrCreate()` 調用中過濾掉房間。

**參數：**

- `options: string[]` \- 選項名稱列表


**Example:**允許不同的「遊戲模式」。

```typescript gameServer .define("battle", BattleRoom) .filterBy(['mode']); ```

無論何時建立房間，`mode` 選項都將在內部儲存。

```typescript client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... */}); ```

您可以處理 `onCreate()` 和/或 `onJoin()` 中提供的選項，以在您的房間實作中實現請求的功能。

```typescript class BattleRoom extends Room { onCreate(options) { if (options.mode === "duo") { // do something! } } onJoin(client, options) { if (options.mode === "duo") { // put this player into a team! } } } ```

**>示例：** 透過內建 `maxClients` 篩選

`maxClients` 是為匹配而儲存的內部變數，也可用於篩選。

```typescript gameServer .define("battle", BattleRoom) .filterBy(['maxClients']); ```

然後用戶端可以要求加入一個能夠處理一定數量玩家的房間。

```typescript client.joinOrCreate("battle", { maxClients:10 }).then(room => {/* ... \*/}); client.joinOrCreate("battle", { maxClients:20 }).then(room => {/* ... \*/}); ```

---

#### `sortBy(options)`

您還可以根據建立時的資訊為加入房間提供不同的優先級。

`options` 參數是一個鍵值物件，左邊是欄位名稱，右邊是排序方向。排序方向可以是以下值之一：`-1`、`"desc"`、`"descending"`、`1`、`"asc"` 或 `"ascending"`。

**>示例：** 按內建 `clients` 排序

`clients` 是為匹配儲存的內部變數，其中包含目前連接的用戶端數量。在下面的示例中，連接的用戶端數量最多的房間將具有優先權。使用 ` -1 `, ` "desc" ` 或 ` "descending" ` 進行降序：

```typescript gameServer .define("battle", BattleRoom) .sortBy({ clients: -1 }); ```

要按最少的玩家數量排序，您可以執行相反的操作。使用`1`、`"asc"` 或 `"ascending"` 進行升序：

```typescript gameServer .define("battle", BattleRoom) .sortBy({ clients:1 }); ```

---

#### 大廳即時列表

要允許 `LobbyRoom` 接收來自特定房間類型的更新，您應該在啟用即時列表的情況下定義它們：

```typescript gameServer .define("battle", BattleRoom) .enableRealtimeListing(); ```

[查看有關 `LobbyRoom`](/builtin-rooms/lobby/) 的更多資訊

---

#### 公共生命週期事件

您可以從房間執行個體範圍之外接聽匹配事件，例如：

- `"create"` \- 建立房間時
- `"dispose"` \- 當房間已被處置時
- `"join"` \- 當客戶加入房間時
- `"leave"` \- 當客戶離開房間時
- `"lock"` \- 當房間被鎖定時
- `"unlock" ` \- 當房間被解鎖時

**使用方式**

```typescript gameServer .define("chat", ChatRoom) .on("create", (room) => console.log("room created:", room.roomId)) .on("dispose", (room) => console.log("room disposed:", room.roomId)) .on("join", (room, client) => console.log(client.id, "joined", room.roomId)) .on("leave", (room, client) => console.log(client.id, "left", room.roomId)); ```

!!!警告 完全不鼓勵透過這些事件來操縱房間的狀態。請改用房間處理常式中的 [abstract methods](/server/room/#abstract-methods)。

## `simulateLatency (milliseconds: number)`

這是一種在本機開發過程中模擬「滯後」用戶端的便捷方法。

```typescript // 確保永遠不要在生產中調用 `simulateLatency()` 方法。if (process.env.NODE\_ENV !== "production") {

  // 模擬伺服器和用戶端之間的 200 毫秒延遲。 gameServer.simulateLatency(200); }```

## `attach (options: any)`

> 您通常不需要調用它。僅當您有非常具體的理由時才使用它。

附加或建立 WebSocket 伺服器。

- `options.server`:要附加 WebSocket 伺服器的 HTTP 伺服器。
- `options.ws`:要重用的現有 WebSocket 伺服器。

```javascript fct\_label="Express" import express from "express"; import { Server } from "colyseus";

const app = new express(); const gameServer = new Server();

gameServer.attach({ server: app }); ```

```javascript fct\_label="http.createServer" import http from "http"; import { Server } from "colyseus";

const httpServer = http.createServer(); const gameServer = new Server();

gameServer.attach({ server: httpServer }); ```

```javascript fct\_label="WebSocket.Server" import http from "http"; import express from "express"; import ws from "ws"; import { Server } from "colyseus";

const app = express(); const server = http.createServer(app); const wss = new WebSocket.Server({ // your custom WebSocket.Server setup. });

const gameServer = new Server(); gameServer.attach({ ws: wss }); ```


## `listen (port: number)`

將 WebSocket 伺服器綁定到指定埠口。

## `onShutdown (callback:Function)`

註冊一個應該在處理序關閉之前調用的回調。有關詳情，請參閱[順利關機](/server/graceful-shutdown/)。

## `gracefullyShutdown (exit: boolean)`

關閉所有房間並清理其快取資料。傳回會在檢查完成時滿足的承諾。

此方法會自動呼叫，除非已在`伺服器`建構函式提供了 `gracefullyShutdown: false`。
