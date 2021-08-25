# Server API » Server

Colyseus {1>Server<1} 執行個體包含伺服器配置選項，例如傳輸選項、在線狀態、匹配驅動程式等。

- {1>Transport<1} 是伺服器和用戶端之間的雙向通信層。
- {1>Presence<1} 是支持聊天室和/或 Node.js 處理序之間通信的實作。
- {1>Driver<1} 是匹配時用於儲存和查詢房間的儲存驅動程式。

## {1>new Server (options)<1}

### {1>options.transport<1}

Colyseus 預設使用其內建的 WebSocket 傳輸。查看如何{1>在此處自訂傳輸層<1}。

### {1>options.presence<1}

當透過多個處理序/機器擴展 Colyseus 時，您需要提供一個在線伺服器。詳細了解{1>可擴縮性<1}和 {2>{3>Presence API<3}<2}。

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence() }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() }); \`\`\`

目前可用的 Presence 伺服器包括：

- {1>RedisPresence<1}（在單台伺服器和多台伺服器上擴展）

---

### {1>options.gracefullyShutdown<1}

自動註冊關機程式。預設為 {1>true<1}如果停用，您應該在關閉過程中手動調用 {2>{3>gracefullyShutdown()<3}<2} 方法。

---

### {1>options.server<1}:

!!!警告「此選項將被棄用」請參閱 {1>WebSocket 傳輸選項<1}

要將 WebSocket 伺服器綁定到的 HTTP 伺服器。您也可以將 {1>{2>express<2}<1} 用於您的伺服器。

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

!!!警告「此選項將被棄用」請參閱 {1>WebSocket 傳輸選項<1}

伺服器「偵測」用戶端的毫秒數。預設：{1}

如果用戶端在{1>pingMaxRetries<1} 重試後無法回應，則會強制中斷連接。

---

### {1>options.pingMaxRetries<1}

!!!警告「此選項將被棄用」請參閱 {1>WebSocket 傳輸選項<1}

無回應下允許的最大偵測數。預設：{1}

---

### {1>options.verifyClient<1}

!!!警告「此選項將被棄用」請參閱 {1>WebSocket 傳輸選項<1}

WebSocket 交換信號前會發生此方法。如果 {1>verifyClient<1} 未設定，則會自動接受信號交換。

- {1>info<1}（物件）
    - {1>origin<1}（字串）用戶端指示的原始標頭中的值。
    - {1>req<1} (http.IncomingMessage) 用戶端 HTTP GET 請求。
    - {1>secure<1}（布林值）{2>true<2} 如果 {3>req.connection.authorized<3} 或 {4>req.connection.encrypted<4} 已設定。

- {1>next<1}（函式）使用者在檢查 {2>info<2} 欄位時必須調用的回調。此回調的引數為：
    - {1>result<1}（布林值）接受或不接受信號交換。
    - {1>code<1}（數字）當 {2>result<2} 為 {3>false<3} 時，此欄位會決定要傳送給用戶端的 HTTP 錯誤狀態代碼。
    - {1>name<1}（字串）當 {2>result<2} 為 {3>false<3} 時，此欄位會決定 HTTP 原因說明。

\`\`\`typescript fct\_label="TypeScript" import { Server } from "colyseus";

const gameServer = new Server({ // ...

  verifyClient: function (info, next) { // 驗證 'info' // // - next(false) 將拒絕 websocket 握手 // - next(true) 將接受 websocket 握手 } }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ...

  verifyClient: function (info, next) { // 驗證 'info' // // - next(false) 將拒絕 websocket 握手 // - next(true) 將接受 websocket 握手 } }); \`\`\`

---

## {1}define (roomName: string, room:Room, options?: any){2}

為媒人定義新的房間類型。

- 在 {2>.define()<2} 期間{1>未建立<1}房間
- 房間是根據用戶端請求建立的（{1>請參閱用戶端方法<1}）

{1>參數：<1}

- {1>roomName: string<1} - 房間的公共名稱。從用戶端加入房間時，您將使用此名稱
- {1>--room<1}：離開房間
- {1>options?: any<1} - 房間初始化的自訂選項

\`\`\`typescript // 定義「聊天」房間 gameServer.define("chat", ChatRoom);

// 定義「戰鬥」房間 gameServer.define("battle", BattleRoom);

// 使用自訂選項定義「戰鬥」房間 gameServer.define("battle\_woods", BattleRoom, { map: "woods" }); \`\`

!!!提示「多次定義同一個房間處理程序」 您可以使用不同的 {1>options<1} 多次定義同一個房間處理程序。當調用 {2>Room#onCreate()<2} 時，{3>options<3} 將包含您在 {4>Server#define()<4} 上指定的合併值 + 房間建立時提供的選項。

---

### 房間定義選項

#### {1>filterBy(options)<1}

每當透過 {1>create()<1} 或 {2>joinOrCreate()<2} 方法建立房間時，只有 {4>filterBy()<4} 方法定義的 {3>options<3} 將儲存在內部，並用於在進一步的 {5>join()<5} 或 {6>joinOrCreate()<6} 調用中過濾掉房間。

{1>參數：<1}

- {1>options: string\[]<1} - 選項名稱列表


{1>Example:<1}允許不同的「遊戲模式」。

{1>typescript gameServer .define("battle", BattleRoom) .filterBy(\['mode']); <1}

無論何時建立房間，{1>mode<1} 選項都將在內部儲存。

{1>typescript client.joinOrCreate("battle", { mode: "duo" }).then(room => {/* ... \*/}); <1}

您可以處理 {1>onCreate()<1} 和/或 {2>onJoin()<2} 中提供的選項，以在您的房間實作中實現請求的功能。

{1>typescript class BattleRoom extends Room { onCreate(options) { if (options.mode === "duo") { // do something! } } onJoin(client, options) { if (options.mode === "duo") { // put this player into a team! } } } <1}

{1>示例：<1} 透過內建 {2>maxClients<2} 篩選

{1>maxClients<1} 是為匹配而儲存的內部變數，也可用於篩選。

{1>typescript gameServer .define("battle", BattleRoom) .filterBy(\['maxClients']); <1}

然後用戶端可以要求加入一個能夠處理一定數量玩家的房間。

{1}typescript client.joinOrCreate("battle", { maxClients:10 }).then(room => {/* ... \*/}); client.joinOrCreate("battle", { maxClients:20 }).then(room => {/* ... \*/}); {2}

---

#### {1>sortBy(options)<1}

您還可以根據建立時的資訊為加入房間提供不同的優先級。

{1>options<1} 參數是一個鍵值物件，左邊是欄位名稱，右邊是排序方向。排序方向可以是以下值之一：{2>-1<2}、{3>"desc"<3}、{4>"descending"<4}、{5>1<5}、{6>" asc"<6} 或 {7>"ascending"<7}。

{1>示例：<1} 按內建 {2>clients<2} 排序

{1>clients<1} 是為匹配儲存的內部變數，其中包含目前連接的用戶端數量。在下面的示例中，連接的用戶端數量最多的房間將具有優先權。使用 {2> -1 <2}, {3> "desc" <3} 或 {4> "descending" <4} 進行降序：

{1}typescript gameServer .define("battle", BattleRoom) .sortBy({ clients:

要按最少的玩家數量排序，您可以執行相反的操作。使用 {1>1<1}、{2>"asc"<2} 或 {3>"ascending"<3} 進行升序：

{1}typescript gameServer .define("battle", BattleRoom) .sortBy({ clients:{1}

---

#### 大廳即時列表

要允許 {1>LobbyRoom<1} 接收來自特定房間類型的更新，您應該在啟用即時列表的情況下定義它們：

{1>typescript gameServer .define("battle", BattleRoom) .enableRealtimeListing(); <1}

{1>查看有關 {2>LobbyRoom<2}<1} 的更多資訊

---

#### 公共生命週期事件

您可以從房間執行個體範圍之外接聽匹配事件，例如：

- {1>"create"<1} - 建立房間時
- {1>"dispose"<1} - 當房間已被處置時
- {1>"join"<1} - 當客戶加入房間時
- {1>"leave"<1} - 當客戶離開房間時
- {1>"lock"<1} - 當房間被鎖定時
- {1> "unlock" <1} - 當房間被解鎖時

使用方式

{1>typescript gameServer .define("chat", ChatRoom) .on("create", (room) => console.log("room created:", room.roomId)) .on("dispose", (room) => console.log("room disposed:", room.roomId)) .on("join", (room, client) => console.log(client.id, "joined", room.roomId)) .on("leave", (room, client) => console.log(client.id, "left", room.roomId)); <1}

!!!警告 完全不鼓勵透過這些事件來操縱房間的狀態。請改用房間處理常式中的 {1>abstract methods<1}。

## {1>simulateLatency (milliseconds: number)<1}

這是一種在本機開發過程中模擬「滯後」用戶端的便捷方法。

\`\`\`typescript // 確保永遠不要在生產中調用 {1>simulateLatency()<1} 方法。if (process.env.NODE\_ENV !== "production") {

  // 模擬伺服器和用戶端之間的 200 毫秒延遲。 gameServer.simulateLatency(200); }\`\`\`

## {1>attach (options: any)<1}

> 您通常不需要調用它。僅當您有非常具體的理由時才使用它。

附加或建立 WebSocket 伺服器。

- {1>options.server<1}:要附加 WebSocket 伺服器的 HTTP 伺服器。
- {1>options.ws<1}:要重用的現有 WebSocket 伺服器。

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

將 WebSocket 伺服器綁定到指定埠口。

## {1}onShutdown (callback:Function){2}

註冊一個應該在處理序關閉之前調用的回調。有關詳情，請參閱{1>順利關機<1}。

## {1>gracefullyShutdown (exit: boolean)<1}

關閉所有房間並清理其快取資料。傳回會在檢查完成時滿足的承諾。

此方法會自動呼叫，除非已在{2>伺服器<2}建構函式提供了 {1>gracefullyShutdown: false<1}。
