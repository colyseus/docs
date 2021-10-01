# 服务器 API &raquo; 传输

Colyseus 目前提供两个 WebSocket 实现作为其 Transport 层.

每个 Transport 都有其自己的一组自定义选项.

- [默认 WebSocket Transport (`ws`)](#default-websocket-transport-via-ws)
- [Native C++ WebSocket Transport (`uWebSockets.js`)](#native-c-websocket-transport-via-uwebsocketsjs)

---

##  默认 WebSocket Transport (通过 `ws`)

默认 WebSocket 传输使用 [`websockets/ws`](https://github.com/websockets/ws) 实现.

如果没有 `transport` 提供给 [`Server`](/server/api/#new-server-options) 的构造函数, 则自动使用带有默认选项的 `WebSocketTransport`.

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

### 可用选项:

#### `options.server`:

供 WebSocket 服务器重复使用的一个 Node.js http 服务器. 如果您想将 Express 和 Colyseus 一起使用, 这就能派上用场.

```typescript fct_label="Example"
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(); // create the http server manually

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

如果不提供这个选项, 将会自动为您创建一个 http 服务器.

---

#### `options.pingInterval`

服务器 "ping" 客户端的毫秒数.

如果客户端在 [pingMaxRetries](#optionspingmaxretries) 次重试后未能响应, 将被强制断开连接.

默认: `3000`

---

#### `options.pingMaxRetries`

ping 无响应的最大允许数.

默认: `2`

---

#### `options.verifyClient`

该方法会在 WebSocket 握手之前发生. 如果 `verifyClient` 未设置, 则握手会被自动接受.

- `info` (Object)
    - `origin` (String) 客户端指定的 Origin 标头的值.
    - `req` (http.IncomingMessage) 客户端 HTTP GET 请求.
    - `secure` (Boolean) `true` 如果 `req.connection.authorized` 或 `req.connection.encrypted` 已设置.

- `next` (Function) 用户在 `info` 字段检查时必须调用的回调. 此回调中的参数为:
    - `result` (Boolean) 是否接受握手.
    - `code`(Number) When `result` is `false` 此字段决定要发给客户端的 HTTP 错误状态代码.
    - `name` (String) When `result` is `false` 此字段决定 HTTP 动作原因.

---

## 本机 C++ WebSocket Transport (通过 `uWebSockets.js`)

[`uWebSockets.js`](https://github.com/uNetworking/uWebSockets.js) 实现通常会在可容纳的 CCU 数量以及内存消耗方面比默认表现得好.

!!! Warning "HTTP 路由的运作方式与 `uWebSockets.js` 不同"
    使用 `uWebSockets.js` 的最大缺点在于其 HTTP/路由系统的运作方式与常规 Node.js/express 路径不同. 查看 [Custom HTTP routes with `uWebSockets.js`](#custom-http-routes-with-uwebsocketsjs) 了解更多相关信息

**安装**

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

### 可用选项:

#### `options.maxPayloadLength`

接收消息最大长度. 如果一个客户端尝试向您发送比它更大的信息, 连接会立即关闭.

默认 `1024 * 1024`.

---

#### `options.idleTimeout`

未发送或接受消息可经过的最大秒数. 如果超时, 连接将关闭. 超时分辨率(时间粒度)通常为 4 秒, 四舍五入取最接近的数值.

使用 `0` 来禁用.

默认 `120`.

---

#### `options.compression`

使用何种 permessage-deflate 压缩.
`uWS.DISABLED`, `uWS.SHARED_COMPRESSOR` 或任意 `uWS.DEDICATED_COMPRESSOR_xxxKB`.

默认 `uWS.DISABLED`

---

#### `options.maxBackpressure`

发布或发送消息时每个套接口所允许的反向压力最大长度. 高反向压力的缓慢接收器将被跳过, 直至其赶上或超时为止.

默认 `1024 * 1024`.

---

#### `options.key_file_name`

SSL 密钥文件的路径 (通过Node.js应用程序用于SSL终端.)

---

#### `options.cert_file_name`

SSL 证书文件的路径 (通过 Node.js 应用程序用于 SSL 终端.)

---

#### `options.passphrase`

SSL 文件的路径 (通过 Node.js 应用程序用于 SSL 终端.)

---

### 自定义 HTTP 的 `uWebSockets.js` 路由

#### 本机 `uWebSockets.js` 路由:

`uWebSocketsTransport` 会公布变量 `app`,作为 `uWebSockets.js` 函数库中的原始 `uws.App` 或 `uws.SSLApp`.

您可以直接使用 `transport.app` 来绑定使用 `uWebSockets.js` API 的 http 路由, 如下所示:

```typescript
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({
    /* ...options */
});

transport.app.get("/*", (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});
```

查看 [`uWebSockets.js` examples](https://github.com/uNetworking/uWebSockets.js/tree/master/examples) 了解更多信息.

#### 替代选项: express 兼容层

作为替代, 我们构建了一个薄的兼容层, 旨在提供与 Express 相同的功能, 但使用 `uWebSockets.js`高级选项.

!!! tip "此功能为实验性质"
    该 Express 兼容层为实验性质, 可能无法处理复杂代码

**安装**

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
