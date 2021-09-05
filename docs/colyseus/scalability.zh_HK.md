> 該文檔可能隨時更新.

要想將 Colyseus 擴展至多處理序或多伺服器，您需要擁有 Redis, MongoDB 以及一個動態代理.

## Redis

下載並安裝 [Redis](https://redis.io/topics/quickstart). 然後創建 `RedisPresence`：

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  presence: new RedisPresence(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence(),
});
```

其中 `presence` 用於處理序間調用房間的 "預留席位" 功能, 還用於讓開發者可以在房間之間共享數據. 詳情請參閱 [Presence API](/server/presence/#api).

每個 Colyseus 處理序還會用 `presence` API 註冊自身的 `processId` 和網絡位置, 以便應用 [動態代理](#dynamic-proxy) 服務. 優雅關閉時, 處理序會自我註銷.

## MongoDB

下載安裝 [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) 並安裝 `mongoose` 包：

```
npm install --save mongoose
```

應用 `MongooseDriver`:

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({
  // ...
  driver: new MongooseDriver(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({
  // ...
  driver: new MongooseDriver(),
});
```


您可以將 MongoDB 的連接 URI 傳遞給 `new MongooseDriver(uri)` 構造函數, 或者設置並賦值一個名為 `MONGO_URI` 的環境變量.

這裏的 `driver` 用於在房間匹配時存儲和查詢可用的房間.

## 運行多個 Colyseus 處理序

想要在一個伺服器中運行多個 Colyseus 實例, 您需要讓每個實例監聽不同的埠口號. 推薦應用 `3001`, `3002`, `3003` 這樣的埠口. Colyseus 處理序 **不應** 對外公開, 而應該只公開 [動態代理](#dynamic-proxy).

強烈推薦應用 [PM2 process manager](http://pm2.keymetrics.io/) 管理多個 Node.js 應用實例.

PM2 提供名為 `NODE_APP_INSTANCE` 的環境變量, 對於每個處理序這個變量數字是唯一的, 可以用其界定埠口號.

```typescript
import { Server } from "colyseus";

// 給每個實例綁定各不相同的埠口號.
const PORT = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);

const gameServer = new Server({ /* ... */ })

gameServer.listen(PORT);
console.log("Listening on", PORT);
```

```
npm install -g pm2
```

應用如下 `ecosystem.config.js` 配置：

```javascript
// ecosystem.config.js
const os = require('os');
module.exports = {
    apps: [{
        port        : 3000,
        name        : "colyseus",
        script      : "lib/index.js", // 主入口頁面
        watch       : true,           // 可選
        instances   : os.cpus().length,
        exec_mode   : 'fork',         // 註意: 不要應用 cluster 模式.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
        }
    }]
}
```

現在您就可以開啟多個 Colyseus 處理序了.

```
pm2 start
```

!!! Tip "PM2 和 TypeScript"
建議在運行 `pm2 start` 之前, 應用 `npx tsc` 編譯 .ts 文件. 或者您可以為 PM2 安裝 TypeScript 解釋器 (`pm2 install typescript`) 並設置 `exec_interpreter: "ts-node"` ([更多參考](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)).


## 動態代理

[@colyseus/proxy](https://github.com/colyseus/proxy) 作為動態代理, 自動監控 Colyseus 處理序的創建和釋放, 以確保 WebSocket 連接通向正確的伺服器上正確處理序的正確房間.

動態代理應該作為唯一公開門戶綁定至 `80` / `443` 埠口. 所有請求必須透過這個代理.

```
npm install -g @colyseus/proxy
```

### 環境變量

配置下列環境變量來滿足您的需求：

- `PORT` 是代理運行的埠口.
- `REDIS_URL` 是各個 Colyseus 處理序裏應用的同一個 Redis 實例的路徑.

### 運行代理

```
colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```

