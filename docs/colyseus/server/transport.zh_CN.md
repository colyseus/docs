# 服务器 API &raquo; 传输

Colyseus 目前提供两个 WebSocket 实现以作为其传输之用.

每种套接字都有自己的一组自定义选项.

- [默认 WebSocket 传输 (`ws`)](#default-websocket-transport-via-ws)
- [原生 C++ WebSocket 传输 (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  默认 WebSocket 传输 (协议为 `ws`)

默认 WebSocket 传输使用 [`websockets/ws`](https://github.com/websockets/ws) 协议.

如果没有在 [`Server`](/server/api/#new-server-options) 的构造函数中提供 `transport` 参数, 则默认使用自带的 `WebSocketTransport`.

<!--

**安装**

```
npm install --save @colyseus/ws-transport
```

-->

**使用方法**

```typescript fct_label="Example"
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({
    transport: new WebSocketTransport({ /* 传输选项 */ })
})
```

```typescript fct_label="@colyseus/arena"
import Arena from "@colyseus/arena";
import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({
  // ...

  initializeTransport: function() {
    return new WebSocketTransport({
      /* ...选项 */
    });
  },

  // ...
});
```

### 可用选项:

#### `options.server`:

一个基于 Node.js 的 http 服务器, 可供 WebSocket 服务共用. 便于让 Express 和 Colyseus 一起使用.

```typescript fct_label="Example"
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(); // 手动创建 http 服务器

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // 为 `WebSocketTransport` 提供自定义服务器
  })
});
```

```typescript fct_label="Example + express"
import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express();
const server = createServer(app); // 手动创建 http 服务器

const gameServer = new Server({
  transport: new WebSocketTransport({
      server // 为 `WebSocketTransport` 提供自定义服务器
  })
});
```

此选项未提供的话, 默认自动创建 http 服务器.

---

#### `options.pingInterval`

服务器 "ping" 客户端的间隔毫秒数.

如果客户端在 [pingMaxRetries](#optionspingmaxretries) 次重试后仍然未能响应, 将被强制断开连接.

默认: `3000`

---

#### `options.pingMaxRetries`

服务器 ping 客户端的最大重试次数数.

默认: `2`

---

#### `options.verifyClient`

在 WebSocket 握手之前进行客户端验证. 如果 `verifyClient` 未设置, 则默认客户端通过验证.

- `info` (Object)
    - `origin` (String) 客户端指定的 Origin header.
    - `req` (http.IncomingMessage) 客户端 HTTP GET 请求.
    - `secure` (Boolean) 如果已设置 `req.connection.authorized` 或 `req.connection.encrypted` 则返回 `true`.

- `next` (Function) 用户在 `info` 字段检查时必须调用的回调. 此回调中的参数为:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) 如果 `result` 为 `false`, 此字段决定要发给客户端的 HTTP 错误状态代码.
    - `name` (String) 如果 `result` 为 `false`, 此字段决定要发给客户端的 HTTP 错误原因.

---

## 原生 C++ WebSocket 传输 (协议为 `uWebSockets.js`)

[`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) 协议通常在 CCU 数量以及内存消耗方面比默认传输性能更好.

!!! Warning "HTTP 的传输方法与 `uWebSockets.js` 不同"
    使用 `uWebSockets.js` 的最大缺点在于其 HTTP/路由 的运作方式与常规 Node.js/express 不同. 了解更多信息请参考 [自定义 HTTP 路由的 `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs)

**安装**

```
npm install --save @colyseus/uwebsockets-transport
```

**使用方法**

```typescript
import { Server } from "@colyseus/core";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({
    transport: new uWebSocketsTransport({
        /* 选项 */
    })
})
```

### 可用选项:

#### `options.maxPayloadLength`

接收消息最大长度. 如果一个客户端尝试发送更大消息, 连接会立即关闭.

默认 `1024 * 1024`.

---

#### `options.idleTimeout`

消息等待最大秒数. 如果超时, 连接将关闭. 超时分辨率 (刷新粒度) 通常为 4 秒左右, 四舍五入.

使用 `0` 来禁用.

默认 `120`.

---

#### `options.compression`

使用何种消息压缩方法.
`uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` 或自定义 `uWS.DEDICATED_COMPRESSOR_xxxKB`.

默认 `uWS.DISABLED`

---

#### `options.maxBackpressure`

广播或发布消息时每个连接允许的最大背压. 高背压下, 速度慢的客户端会被掠过, 直至其赶上或超时为止.

默认 `1024 * 1024`.

---

#### `options.key_file_name`

SSL 密钥文件的路径 (通过 Node.js 程序作用于 SSL 终端.)

---

#### `options.cert_file_name`

SSL 证书文件的路径 (通过 Node.js 程序作用于 SSL 终端.)

---

#### `options.passphrase`

SSL 文件的密码 (通过 Node.js 程序作用于 SSL 终端.)

---

### 使用 `uWebSockets.js` 自定义 HTTP 路由

#### 原生 `uWebSockets.js` 传输:

`uWebSocketsTransport` 公开变量 `app` 作为 `uWebSockets.js` 中原生 `uws.App` 或 `uws.SSLApp` 的引用.

您可以直接使用 `transport.app` 来绑定原本使用 `uWebSockets.js` API 的 http 传输功能, 如下所示:

```typescript
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...选项 */
});

// 异步路由
transport.app.get("/async_route", (res, req) => {
    /* 没有响应或者中断处理的话, 不应从这里 return 或者 yield */
    res.onAborted(() => {
        res.aborted = true;
    });

    /* 中断程序去底层执行 C++, 此时 onAborted 函数应已被调用 */
    let result = await someAsyncTask();

    /* 中断状态下, 不应该响应 */
    if (!res.aborted) {
        res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end(result);
    }
});

// 同步路由
transport.app.get("/sync_route", (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});
```

更多详情请参考 [`uWebSockets.js` 示例](https://github.com/uNetworking/uWebSockets.js/tree/master/examples).

#### 另一种选择: express 兼容层

作为另一种方法, 我们构建了一个轻兼容层, 旨在提供与 Express 相同的功能的同时, 使用 `uWebSockets.js` 作为底层.

**安装**

```
npm install --save uwebsockets-express
```

**使用方法**

```typescript fct_label="Example"
import express from "express";
import expressify from "uwebsockets-express"
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...选项 */
});
const app = expressify(transport.app);

// 使用已有的中间件!
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
      /* ...选项 */
    });
  },

  //
  // 使用 `@colyseus/arena` 时, `uwebsockets-express` 被自动加载.
  // 您可以通过这里的参数获取其引用 (transport.app).
  //
  initializeExpress: (app) => {
    // 使用已有的中间件!
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
