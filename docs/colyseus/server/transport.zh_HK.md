# 服務器 API &raquo; 傳輸

Colyseus 目前提供兩個 WebSocket 實現以作為其傳輸之用.

每種套接字都有自己的一組自定義選項.

- [默認 WebSocket 傳輸 (`ws`)](#default-websocket-transport-via-ws)
- [原生 C++ WebSocket 傳輸 (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  默認 WebSocket 傳輸 (協議為 `ws`)

默認 WebSocket 傳輸使用 [`websockets/ws`](https://github.com/websockets/ws) 協議.

如果沒有在 [`Server`](/server/api/#new-server-options) 的構造函數中提供 `transport` 參數, 則默認使用自帶的 `WebSocketTransport`.

<!--

**安裝**

```
npm install --save @colyseus/ws-transport
```

-->

**使用方法**

```typescript fct_label="Example"
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({
    transport: new WebSocketTransport({ /* 傳輸選項 */ })
})
```

```typescript fct_label="@colyseus/arena"
import Arena from "@colyseus/arena";
import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({
  // ...

  initializeTransport: function() {
    return new WebSocketTransport({
      /* ...選項 */
    });
  },

  // ...
});
```

### 可用選項:

#### `options.server`:

一個基於 Node.js 的 http 服務器, 可供 WebSocket 服務共用. 便於讓 Express 和 Colyseus 一起使用.

```typescript fct_label="Example"
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(app); // 手動創建 http 服務器

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // 為 `WebSocketTransport` 提供自定義服務器
  })
});
```

```typescript fct_label="Example + express"
import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express();
const server = createServer(app); // 手動創建 http 服務器

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // 為 `WebSocketTransport` 提供自定義服務器
  })
});
```

此選項未提供的話, 默認自動創建 http 服務器.

---

#### `options.pingInterval`

服務器 "ping" 客戶端的間隔毫秒數.

如果客戶端在 [pingMaxRetries](#optionspingmaxretries) 次重試後仍然未能響應, 將被強製斷開連接.

默認: `3000`

---

#### `options.pingMaxRetries`

服務器 ping 客戶端的最大重試次數數.

默認: `2`

---

#### `options.verifyClient`

在 WebSocket 握手之前進行客戶端驗證. 如果 `verifyClient` 未設置, 則默認客戶端通過驗證.

- `info` (Object)
    - `origin` (String) 客戶端指定的 Origin header.
    - `req` (http.IncomingMessage) 客戶端 HTTP GET 請求.
    - `secure` (Boolean) 如果已設置 `req.connection.authorized` 或 `req.connection.encrypted` 則返回 `true`.

- `next` (Function) 用戶在 `info` 字段檢查時必須調用的回調. 此回調中的參數為:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) 如果 `result` 為 `false`, 此字段決定要發給客戶端的 HTTP 錯誤狀態代碼.
    - `name` (String) 如果 `result` 為 `false`, 此字段決定要發給客戶端的 HTTP 錯誤原因.

---

## 原生 C++ WebSocket 傳輸 (協議為 `uWebSockets.js`)

[`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) 協議通常在 CCU 數量以及內存消耗方面比默認傳輸性能更好.

!!! Warning "HTTP 的傳輸方法與 `uWebSockets.js` 不同"
使用 `uWebSockets.js` 的最大缺點在於其 HTTP/路由 的運作方式與常規 Node.js/express 不同. 了解更多信息請參考 [自定義 HTTP 路由的 `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs)

**安裝**

```
npm install --save @colyseus/uwebsockets-transport
```

**使用方法**

```typescript
import { Server } from "@colyseus/core";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({
    transport: new uWebSocketsTransport({
        /* 選項 */
    })
})
```

### 可用選項:

#### `options.maxPayloadLength`

接收消息最大長度. 如果一個客戶端嘗試發送更大消息, 連接會立即關閉.

默認 `1024 * 1024`.

---

#### `options.idleTimeout`

消息等待最大秒數. 如果超時, 連接將關閉. 超時分辨率 (刷新粒度) 通常為 4 秒左右, 四舍五入.

使用 `0` 來禁用.

默認 `120`.

---

#### `options.compression`

使用何種消息壓縮方法.
`uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` 或自定義 `uWS.DEDICATED_COMPRESSOR_xxxKB`.

默認 `uWS.DISABLED`

---

#### `options.maxBackpressure`

廣播或發布消息時每個連接允許的最大背壓. 高背壓下, 速度慢的客戶端會被掠過, 直至其趕上或超時為止.

默認 `1024 * 1024`.

---

#### `options.key_file_name`

SSL 密鑰文件的路徑 (通過 Node.js 程式作用於 SSL 終端.)

---

#### `options.cert_file_name`

SSL 證書文件的路徑 (通過 Node.js 程式作用於 SSL 終端.)

---

#### `options.passphrase`

SSL 文件的密碼 (通過 Node.js 程式作用於 SSL 終端.)

---

### 使用 `uWebSockets.js` 自定義 HTTP 路由

#### 原生 `uWebSockets.js` 傳輸:

`uWebSocketsTransport` 公開變量 `app` 作為 `uWebSockets.js` 中原生 `uws.App` 或 `uws.SSLApp` 的引用.

您可以直接使用 `transport.app` 來綁定原本使用 `uWebSockets.js` API 的 http 傳輸功能, 如下所示:

```typescript
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...選項 */
});

transport.app.get("/*", (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});
```

更多詳情請參考 [`uWebSockets.js` 示例](https://github.com/uNetworking/uWebSockets.js/tree/master/examples).

#### 另一種選擇: express 兼容層

作為另一種方法, 我們構建了一個輕兼容層, 旨在提供與 Express 相同的功能的同時, 使用 `uWebSockets.js` 作為底層.

!!! tip "此功能為實驗性質"
該 Express 兼容層為實驗性質, 可能無法處理復雜代碼

**安裝**

```
npm install --save uwebsockets-express
```

**使用方法**

```typescript fct_label="Example"
import express from "express";
import expressify from "uwebsockets-express"
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...選項 */
});
const app = expressify(transport.app);

// 使用已有的中間件!
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
      /* ...選項 */
    });
  },

  //
  // 使用 `@colyseus/arena` 時, `uwebsockets-express` 被自動加載.
  // 您可以通過這裏的參數獲取其引用 (transport.app).
  //
  initializeExpress: (app) => {
    // 使用已有的中間件!
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
