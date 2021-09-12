# 伺服器 API &raquo; 傳輸

Colyseus 目前提供兩個 WebSocket 實現作為其 Transport 層.

每個 Transport 都有其自己的一組自定義選項.

- [預設 WebSocket Transport (`ws`)](#default-websocket-transport-via-ws)
- [Native C++ WebSocket Transport (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  預設 WebSocket Transport (通過 `ws`)

預設 WebSocket 傳輸使用 [`websockets/ws`](https://github.com/websockets/ws) 實現.

如果沒有 `transport` 提供給 [`Server`](/server/api/#new-server-options) 的構造函數, 則自動使用帶有預設選項的 `WebSocketTransport`.

<!--

**Installation**

```
npm install --save @colyseus/ws-transport
```

-->

**用法**

```typescript fct_label="Example"
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({
    transport: new WebSocketTransport({ /* transport options */ })
})
```

```typescript fct_label="@colyseus/arena"
import Arena from "@colyseus/arena";
import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({
  // ...

  initializeTransport: function() {
    return new WebSocketTransport({
      /* ...options */
    });
  },

  // ...
});
```

### 可用選項:

#### `options.server`:

供 WebSocket 伺服器重復使用的一個 Node.js http 伺服器. 如果您想將 Express 和 Colyseus 一起使用, 這就能派上用場.

```typescript fct_label="Example"
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});
```

```typescript fct_label="Example + express"
import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express();
const server = createServer(app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});
```

如果不提供這個選項, 將會自動為您創建一個 http 伺服器.

---

#### `options.pingInterval`

伺服器 "ping" 客戶端的毫秒數.

如果客戶端在 [pingMaxRetries](#optionspingmaxretries) 次重試後未能響應, 將被強製斷開連線.

預設: `3000`

---

#### `options.pingMaxRetries`

ping 無響應的最大允許數.

預設: `2`

---

#### `options.verifyClient`

該方法會在 WebSocket 握手之前發生. 如果 `verifyClient` 未設置, 則握手會被自動接受.

- `info` (Object)
    - `origin` (String) 客戶端指定的 Origin 標頭的值.
    - `req` (http.IncomingMessage) 客戶端 HTTP GET 請求.
    - `secure` (Boolean) `true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已設置.

- `next` (Function) 用戶在 `info` 字段檢查時必須調用的回呼. 此回呼中的參數為:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) When `result` is `false` 此字段決定要發給客戶端的 HTTP 錯誤狀態代碼.
    - `name` (String) When `result` is `false` 此字段決定 HTTP 動作原因.

---

## 本機 C++ WebSocket Transport (通過 `uWebSockets.js`)

[`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) 實現通常會在可容納的 CCU 數量以及內存消耗方面比預設表現得好.

!!! Warning "HTTP 路由的運作方式與 `uWebSockets.js` 不同"
    使用 `uWebSockets.js` 的最大缺點在於其 HTTP/路由系統的運作方式與常規 Node.js/express 路徑不同. 查看 [Custom HTTP routes with `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs) 了解更多相關資訊

**安裝**

```
npm install --save @colyseus/uwebsockets-transport
```

**用法**

```typescript
import { Server } from "@colyseus/core";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({
    transport: new uWebSocketsTransport({
        /* options */
    })
})
```

### 可用選項:

#### `options.maxPayloadLength`

接收消息最大長度. 如果一個客戶端嘗試向您發送比它更大的資訊, 連線會立即關閉.

預設 `1024 * 1024`.

---

#### `options.idleTimeout`

未發送或接受消息可經過的最大秒數. 如果超時, 連線將關閉. 超時分辨率(時間粒度)通常為 4 秒, 四舍五入取最接近的數值.

使用 `0` 來禁用.

預設 `120`.

---

#### `options.compression`

使用何種 permessage-deflate 壓縮.
`uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` 或任意 `uWS.DEDICATED_COMPRESSOR_xxxKB`.

預設 `uWS.DISABLED`

---

#### `options.maxBackpressure`

發布或發送消息時每個套接口所允許的反向壓力最大長度. 高反向壓力的緩慢接收器將被跳過, 直至其趕上或超時為止.

預設 `1024 * 1024`.

---

#### `options.key_file_name`

SSL 密鑰文件的路徑 (通過Node.js應用程序用於SSL終端.)

---

#### `options.cert_file_name`

SSL 證書文件的路徑 (通過 Node.js 應用程序用於 SSL 終端.)

---

#### `options.passphrase`

SSL 文件的路徑 (通過 Node.js 應用程序用於 SSL 終端.)

---

### 自定義 HTTP 的 `uWebSockets.js` 路由

#### 本機 `uWebSockets.js` 路由:

`uWebSocketsTransport` 會公布變數 `app`, 作為 `uWebSockets.js` 函數庫中的原始 `uws.App` 或 `uws.SSLApp`.

您可以直接使用 `transport.app` 來綁定使用 `uWebSockets.js` API 的 http 路由,如下所示:

```typescript
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...options */
});

transport.app.get("/*", (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});
```

查看 [`uWebSockets.js` examples](https://github.com/uNetworking/uWebSockets.js/tree/master/examples) 了解更多資訊.

#### 替代選項: express 兼容層

作為替代, 我們構建了一個薄的兼容層, 旨在提供與 Express 相同的功能, 但使用 `uWebSockets.js`高級選項.

!!! tip "此功能為實驗性質"
    該 Express 兼容層為實驗性質, 可能無法處理復雜代碼

**安裝**

```
npm install --save uwebsockets-express
```

**用法**

```typescript fct_label="Example"
import express from "express";
import expressify from "uwebsockets-express"
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...options */
});
const app = expressify(transport.app);

// use existing middleware implementations!
app.use(express.json());
app.use('/', serveIndex(path.join(__dirname, ".."), { icons: true, hidden: true }))
app.use('/', express.static(path.join(__dirname, "..")));

// register routes
app.get("/hello", (req, res) => {
  res.json({ hello: "world!" });
});
```

```typescript fct_label="@colyseus/arena"
import express from "express";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"
import Arena from "@colyseus/arena";

export default Arena({
  // ...
  initializeTransport: function() {
    return new uWebSocketsTransport({
      /* ...options */
    });
  },

  //
  // when using `@colyseus/arena`, the `uwebsockets-express` is loaded automatically.
  // you get the expressify(transport.app) as argument here.
  //
  initializeExpress: (app) => {
    // use existing middleware implementations!
    app.use('/', serveIndex(path.join(__dirname, ".."), { icons: true, hidden: true }))
    app.use('/', express.static(path.join(__dirname, "..")));

    // register routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });

  },
  // ...
})

```
