> 該文件是一項正在進行中的工作。

要將 Colyseus 擴展到多個處理序或伺服器，您需要擁有 Redis、MongoDB 和動態代理。

## Redis

下載並安裝 {1>Redis<1}。使用 {2>RedisPresence<2}：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence(), }); \`\`\`

{1>presence<1} 用於將房間「座位保留」功能從一個處理序調用到另一個處理序，並允許開發人員利用一些跨房間的資料共享功能。請參閱 {2>Presence API<2}。

每個 Colyseus 處理序還將自己的 {1>processId<1} 和網路位置註冊到 {2>presence<2} API，稍後由{3>動態代理<3}服務使用。在正常關閉期間，處理序會自行取消註冊。

## MongoDB

{1>下載並安裝 MongoDB<1}並安裝 {2>mongoose<2} 套件：

{1> npm install --save mongoose <1}

使用 {1>MongooseDriver<1}：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus"; import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({ // ... driver: new MongooseDriver(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus"); const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({ // ... driver: new MongooseDriver(), }); \`\`\`


您可以將 MongoDB 連接 URI 傳遞給 {1>new MongooseDriver(uri)<1} 建構函式，或設定 {2>MONGO\_URI<2} 環境變數。

{1>driver<1} 用於儲存和查詢可用房間進行匹配。

## 執行多個 Colyseus 處理序

要在同一台伺服器上執行多個 Colyseus 實例，您需要每個實例都接聽不同的埠口編號。建議使用埠口 {1>3001<1}、{2>3002<2}、{3>3003<3} 等。Colyseus 處理序{4>不<4}應該公開。只有 {5>dynamic proxy<5} 是。

強烈建議使用 {1>PM2 處理序管理員<1}來管理多個 Node.js 應用實例。

PM2 提供了一個 {1>NODE\_APP\_INSTANCE<1} 環境變數，包含每個處理序的不同編號。用它來定義您的埠口編號。

\`\`\`typescript import { Server } from "colyseus";

// 將伺服器的每個實例綁定到不同的埠口。 const PORT = Number(process.env.PORT) + Number(process.env.NODE\_APP\_INSTANCE);

const gameServer = new Server({ /* ... \*/ })

gameServer.listen(PORT); console.log("Listening on", PORT); \`\`\`

{1> npm install -g pm2 <1}

使用以下 {1>ecosystem.config.js<1} 配置：

{1}javascript // ecosystem.config.js const os = require('os'); module.exports = { apps: \[{ port :3000, name : "colyseus", script : "lib/index.js", // your entrypoint file watch : true, // optional instances : os.cpus().length, exec\_mode : 'fork', // IMPORTANT: do not use cluster mode. env: { DEBUG: "colyseus:errors", NODE\_ENV: "production", } }] } {2}

現在您已準備好啟動多個 Colyseus 處理序。

{1> pm2 start <1}

!!!提示 “PM2 和 TypeScript” 建議在執行 {1>pm2 start<1} 之前透過 {2>npx tsc<2} 編譯您的 .ts 文件。或者，您可以為 PM2 安裝 TypeScript 解釋器 ({3>pm2 install typescript<3}) 並設定 {4>exec\_interpreter: "ts-node"<4} ({5>深入了解<5})。


## 動態代理

{1>@colyseus/proxy<1} 是一個動態代理，它會在 Colyseus 處理序啟動和關閉時自動接聽，允許 WebSocket 連接轉到正確的處理序和已在其上建立房間的伺服器。

代理應綁定到埠口 {1>80<1}/{2>443<2}，因為它是您的應用程式唯一的公共端點。所有請求都必須透過代理。

{1> npm install -g @colyseus/proxy <1}

### 環境變數

配置以下環境變數以滿足您的需求：

- {1>PORT<1} 是代理將執行的埠口。
- {1>REDIS\_URL<1} 是您在 Colyseus 處理序上使用的同一個 Redis 執行個體的路徑。

### 執行代理

\`\`\` colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0} \`\`\`
