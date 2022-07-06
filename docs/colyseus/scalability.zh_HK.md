**Colyseus 如何實現可擴展性?**

- 增加處理器數量可以讓系統創建更多的房間.
- 房間在多處理器之間平均分配.
- 每個處理器的使用情況儲存在 Redis 數據庫中.
- 每個房間隸屬於一個 Colyseus 進程.
    - 每個房間有其可承載的 **最大玩家數量**.
    - 每個房間的最大玩家數量由多種因素決定. [參考常見問題](/colyseus/faq/#how-many-ccu-a-colyseus-server-can-handle).
- 每個客戶端連接隸屬於一個進程.
    - 使用 proxy 方案時, 客戶端與服務器的交流由代理程序負責.
    - 使用 direct 方案時, 客戶端與服務器的交流直接完成.

## 配置共享 `Presence` 與 `Driver`

首先, 下載並安裝 [Redis](https://redis.io/topics/quickstart).

```typescript fct_label="TypeScript"
import { Server } from "colyseus";
import { RedisPresence } from "@colyseus/redis-presence";
import { RedisDriver } from "@colyseus/redis-driver";

const gameServer = new Server({
  // ...
  presence: new RedisPresence(),
  driver: new RedisDriver(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const { RedisPresence } = require("@colyseus/redis-presence");
const { RedisDriver } = require("@colyseus/redis-driver");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence(),
  driver: new colyseus.RedisDriver(),
});
```

其中 `presence` 用於進程間調用房間的 "seat reservation" 功能, 還用於讓開發者可以在房間之間共享數據. 詳情請參閱 [Presence API](/server/presence/#api).

其中 `driver` 表示可用房間的共享緩存, 以及實現 Colyseus 進程的房間檢索功能.

每個 Colyseus 進程還會用 `presence` API 註冊自身的 `processId` 和網絡位置, 以便使用 [動態代理](#dynamic-proxy) 服務. 優雅關閉時, 進程會自我註銷.

## 方案 1: 使用動態代理

安裝好 [@colyseus/proxy](https://github.com/colyseus/proxy).

```
npm install --save @colyseus/proxy
```

動態代理自動監聽 Colyseus 進程的運行情況. 可以把客戶端請求路由到正確的 Colyseus 進程中.

所有客戶端請求必須經由代理進入. 這種方案下, 客戶端捕魚服務器 **直接** 交流, 而是通過代理完成.

生產環境下, 代理需要綁定端口 `80` / `443`.

### 環境變量

根據需要配置下列環境變量:

- `PORT` 代理綁定的端口號.
- `REDIS_URL` 配合 Colyseus 進程運行的 Redis 實例路徑.

### 啟動代理

```
npx colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```

## 方案 2: 不使用代理

!!! Warning "註意"
    該方案是試驗性的.

另一種選擇, 可以配置每個 Colyseus 進程使用自己的公開地址, 以便客戶端直接與之通信.

```typescript
const server = new Server({
    // ...
    presence: new RedisPresence(),
    driver: new RedisDriver(),

    // 每個進程一個唯一公開地址
    publicAddress: "server-1.yourdomain.com"
});
```

理想情況下, 應該有一個負責載入均衡的程序來處理所有的 Colyseus 進程 - 而這個程序應作為所有客戶端的連接入口.

## 運行多個 Colyseus 進程

想要在一個服務器中運行多個 Colyseus 實例, 您需要讓每個實例監聽不同的端口號. 推薦使用 `3001`, `3002`, `3003` 這樣的端口. Colyseus 進程 **不應** 對外公開, 而應該只公開 [動態代理](#dynamic-proxy).

- If you're [using `@colyseus/proxy` (alternative 1.)](#alternative-1-using-a-dynamic-proxy), the Colyseus processes should **NOT** be exposed publicly. Only internally for the proxy.
- If you're [not using using `@colyseus/proxy` (alternative 2.)](#alternative-2-without-the-proxy), each Colyseus process must have its own public address.

強烈推薦使用 [PM2 process manager](http://pm2.keymetrics.io/) 管理多個 Node.js 應用實例.

PM2 提供名為 `NODE_APP_INSTANCE` 的環境變量, 對於每個進程這個變量數字是唯一的, 可以用其界定端口號.

```typescript
import { Server } from "colyseus";

// 給每個實例綁定各不相同的端口號.
const PORT = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);

const gameServer = new Server({ /* ... */ })

gameServer.listen(PORT);
console.log("Listening on", PORT);
```

```
npm install -g pm2
```

使用如下 `ecosystem.config.js` 配置:

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
        exec_mode   : 'fork',         // 註意: 不要使用 cluster 模式.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
        }
    }]
}
```

現在您就可以開啟多個 Colyseus 進程了.

```
pm2 start
```

!!! Tip "PM2 和 TypeScript"
    建議在運行 `pm2 start` 之前, 使用 `npx tsc` 編譯 .ts 文件. 或者您可以為 PM2 安裝 TypeScript 解釋器 (`pm2 install typescript`) 並設置 `exec_interpreter: "ts-node"` ([更多參考](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)).