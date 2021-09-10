# 伺服器 API » 傳輸

Colyseus 目前提供兩個 WebSocket 實作作為其傳輸層.

每個傳輸都具有其用於自訂的選項集合.

- [預設 WebSocket 傳輸 (`ws`)](#default-websocket-transport-via-ws)
- [原生 C++ WebSocket 傳輸 (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  預設 WebSocket 傳輸(透過 `ws`)

預設 WebSocket 傳輸使用 [`websockets/ws`](https://github.com/websockets/ws) 實作.

如果沒有任何`傳輸`提供給[`伺服器`](/server/api/#new-server-options)的建構函式,則會自動使用 `WebSocketTransport` 與其預設選項.

<!--

**Installation**

```
npm install --save @colyseus/ws-transport
```

-->

**使用方式**

```typescript fct\_label="Example" import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({ transport: new WebSocketTransport({ /* transport options \*/ }) }) ```

```typescript fct\_label="@colyseus/arena" import Arena from "@colyseus/arena"; import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({ // ...

  initializeTransport: function() { return new WebSocketTransport({ /* ...options \*/ }); },

  // ... }); ```

### 可用選項：

#### `options.server`

要為 WebSocket 伺服器重新使用的 Node.js http 伺服器執行個體.在您要使用 Express 搭配 Colyseus 時會很實用.

```typescript fct\_label="Example" import { createServer } from "http"; import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(app); // create the http server manually

const gameServer = new Server({ transport: new WebSocketTransport({ server // provide the custom server for `WebSocketTransport` }) }); ```

```typescript fct\_label="Example + express" import express from "express"; import { createServer } from "http"; import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express(); const server = createServer(app); // create the http server manually

const gameServer = new Server({ transport: new WebSocketTransport({ server // provide the custom server for `WebSocketTransport` }) }); ```

透過不提供此選項,http 伺服器會為您自動建立.

---

#### `options.pingInterval`

伺服器(偵測)用戶端的毫秒數.

如果用戶端在[pingMaxRetries](#optionspingmaxretries) 重試後無法回應,則會強制中斷連接.

預設：`3000`

---

#### `options.pingMaxRetries`

無回應下允許的最大偵測數.

預設：`2`

---

#### `options.verifyClient`

WebSocket 交換信號前會發生此方法.如果 `verifyClient` 未設定,則會自動接受信號交換.

- `info`(物件)
    - `origin`(字串)用戶端指示的原始標頭中的值.
    - `req` (http.IncomingMessage) 用戶端 HTTP GET 請求.
    - `secure`(布林值)`true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已設定.

- `next`(函式)使用者在檢查 `info` 欄位時必須調用的回調.此回調的引數為：
    - `result`(布林值)接受或不接受信號交換.
    - `code`(數字)當 `result` 為 `false` 時,此欄位會決定要傳送給用戶端的 HTTP 錯誤狀態代碼.
    - `name`(字串)當 `result` 為 `false` 時,此欄位會決定 HTTP 原因說明.

---

## 原生 C++ WebSocket 傳輸(透過 `uWebSockets.js`)

[`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) 實作,在其可保存的 CCU 數和記憶體耗用上,一般執行會比預設的還好.

!!!警告(HTTP 路由與 `uWebSockets.js` 的運作方式不同)使用 `uWebSockets.js` 的主要優勢是其 HTTP/路由系統與一般 Node.js/express 路由的運作方式完全不同.在[自訂 HTTP 路由與 `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs) 查看更多相關資訊

**安裝**

``` npm install --save @colyseus/uwebsockets-transport ```

**使用方式**

```typescript import { Server } from "@colyseus/core"; import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({ transport: new uWebSocketsTransport({ /* options \*/ }) }) ```

### 可用選項：

#### `options.maxPayloadLength`

收到訊息的長度上限.如果用戶端嘗試向您傳送的訊息大於此長度,則連接會立即關閉.

預設為 `1024 * 1024`.

---

#### `options.idleTimeout`

在沒有傳送或收到訊息時可能經過的秒數上限.如果此逾時經過,則關閉連接.逾時的解析(細微性)一般是 4 秒,會四捨五入至最接近的數值.

透過使用 `0` 進行停用.

預設為 `102`.

---

#### `options.compression`

要使用什麼 permessage-deflate 壓縮.`uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` 或任何 `uWS.DEDICATED_COMPRESSOR_xxxKB`.

預設為 `uWS.DISABLED`

---

#### `options.maxBackpressure`

當發佈或傳送訊息時,每個通訊端允許的背壓長度上限.具有太高背壓的慢速接收者,在跟上速度或逾時前會被略過.

預設為 `1024 * 1024`.

---

#### `options.key_file_name`

SSL 金鑰檔案的路徑.(用於透過 Node.js 應用程式的 SSL 終止.)

---

#### `options.cert_file_name`

SSL 憑證檔案的路徑.(用於透過 Node.js 應用程式的 SSL 終止.)

---

#### `options.passphrase`

SSL 檔案的密碼.(用於透過 Node.js 應用程式的 SSL 終止.)

---

### 自訂 HTTP 路徑與 `uWebSockets.js`

#### 原生 `uWebSockets.js` 路徑：

`uWebSocketsTransport` 公開變數`應用程式`作為 `uWebSockets.js` 程式庫之原始 `uws.App` 或 `uws.SSLApp` 的參考.

您可以直接使用 `transport.app` 以使用 `uWebSockets.js` API 繫結 http 路由,請看以下：

```typescript import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({ /* ...options \*/ });

transport.app.get("/\*", (res, req) => { res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!'); }); ```

查看 [`uWebSockets.js` 範例](https://github.com/uNetworking/uWebSockets.js/tree/master/examples)以瞭解更多資訊.

#### 替代方案：快速相容性層

或者,我們建置了精簡快速相容性層,其目的為提供 Express 的相同功能,但使用的是基礎 `uWebSockets.js`.

!!! 提示(此為實驗性功能)快速相容性層為實驗性,且可能無法與複雜程式碼一同運作

**安裝**

``` npm install --save uwebsockets-express ```

**使用方式**

```typescript fct\_label="Example" import express from "express"; import expressify from "uwebsockets-express" import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({ /* ...options \*/ }); const app = expressify(transport.app);

// use existing middleware implementations! app.use(express.json()); app.use('/', serveIndex(path.join(\_\_dirname, ".."), { icons: true, hidden: true })) app.use('/', express.static(path.join(\_\_dirname, "..")));

// register routes app.get("/hello", (req, res) => { res.json({ hello: "world!" }); }); ```

```typescript fct\_label="@colyseus/arena" import express from "express"; import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport" import Arena from "@colyseus/arena";

export default Arena({ // ... initializeTransport: function() { return new uWebSocketsTransport({ /* ...options \*/ }); },

  // // when using `@colyseus/arena`, the `uwebsockets-express` is loaded automatically. // you get the expressify(transport.app) as argument here. // initializeExpress: (app) => { // use existing middleware implementations! app.use('/', serveIndex(path.join(\_\_dirname, ".."), { icons: true, hidden: true })) app.use('/', express.static(path.join(\_\_dirname, "..")));

    // register routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });

  }, // ... })

```
