> 該文件是一項正在進行中的工作。

要將 Colyseus 擴展到多個處理序或伺服器，您需要擁有 Redis、MongoDB 和動態代理。

## Redis

下載並安裝 [Redis](https://redis.io/topics/quickstart)。使用 `RedisPresence`：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence(), }); \`\`\`

`presence` 用於將房間「座位保留」功能從一個處理序調用到另一個處理序，並允許開發人員利用一些跨房間的資料共享功能。請參閱 [Presence API](/server/presence/#api)。

每個 Colyseus 處理序還將自己的 `processId` 和網路位置註冊到 `presence` API，稍後由[動態代理](#dynamic-proxy)服務使用。在正常關閉期間，處理序會自行取消註冊。

## MongoDB

[下載並安裝 MongoDB](https://docs.mongodb.com/manual/administration/install-community/)並安裝 `mongoose` 套件：

``` npm install --save mongoose ```

使用 `MongooseDriver`：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus"; import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({ // ... driver: new MongooseDriver(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus"); const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({ // ... driver: new MongooseDriver(), }); \`\`\`


您可以將 MongoDB 連接 URI 傳遞給 `new MongooseDriver(uri)` 建構函式，或設定`MONGO_URI` 環境變數。

`driver` 用於儲存和查詢可用房間進行匹配。

## 執行多個 Colyseus 處理序

要在同一台伺服器上執行多個 Colyseus 實例，您需要每個實例都接聽不同的埠口編號。建議使用埠口 `3001`、`3002`、`003` 等。Colyseus 處理序**不\\**應該公開。只有 [dynamic proxy](#dynamic-proxy) 是。

強烈建議使用 [PM2 處理序管理員](http://pm2.keymetrics.io/)來管理多個 Node.js 應用實例。

PM2 提供了一個 `NODE_APP_INSTANCE` 環境變數，包含每個處理序的不同編號。用它來定義您的埠口編號。

\`\`\`typescript import { Server } from "colyseus";

// 將伺服器的每個實例綁定到不同的埠口。 const PORT = Number(process.env.PORT) + Number(process.env.NODE\_APP\_INSTANCE);

const gameServer = new Server({ /* ... \*/ })

gameServer.listen(PORT); console.log("Listening on", PORT); \`\`\`

``` npm install -g pm2 ```

使用以下 `ecosystem.config.js` 配置：

```javascript // ecosystem.config.js const os = require('os'); module.exports = { apps: [{ port :3000, name : "colyseus", script : "lib/index.js", // your entrypoint file watch : true, // optional instances : os.cpus().length, exec\_mode : 'fork', // IMPORTANT: do not use cluster mode. env: { DEBUG: "colyseus:errors", NODE\_ENV: "production", } }] } ```

現在您已準備好啟動多個 Colyseus 處理序。

``` pm2 start ```

!!!提示 “PM2 和 TypeScript” 建議在執行 `pm2 start`之前透過 `npx tsc` 編譯您的 .ts 文件。或者，您可以為 PM2 安裝 TypeScript 解釋器 (`pm2 install typescript`) 並設定 `exec_interpreter: "ts-node"` ([深入了解](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2))。


## 動態代理

[@colyseus/proxy](https://github.com/colyseus/proxy) 是一個動態代理，它會在 Colyseus 處理序啟動和關閉時自動接聽，允許 WebSocket 連接轉到正確的處理序和已在其上建立房間的伺服器。

代理應綁定到埠口 `80`/`443`，因為它是您的應用程式唯一的公共端點。所有請求都必須透過代理。

``` npm install -g @colyseus/proxy ```

### 環境變數

配置以下環境變數以滿足您的需求：

- `PORT` 是代理將執行的埠口。
- `REDIS_URL` 是您在 Colyseus 處理序上使用的同一個 Redis 執行個體的路徑。

### 執行代理

\`\`\` colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0} \`\`\`
