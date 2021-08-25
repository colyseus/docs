# 服务器 API » 传输

Colyseus 目前提供两个 WebSocket 实现作为其 Transport 层。

每个 Transport 都有其自己的一组自定义选项。

- {1>默认 WebSocket Transport ({2>ws<2})<1}
- {1>Native C++ WebSocket Transport ({2>uWebSockets.js<2})<1}

---

##  默认 WebSocket Transport（通过 {1>ws<1}）

默认 WebSocket 传输使用 {1>{2>websockets/ws<2}<1} 实现。

如果没有 {2>transport<2} 提供给 {3>{4>Server<4}<3} 的构造函数，则自动使用带有默认选项的 {1>WebSocketTransport<1}。

<!--

**Installation**

```
npm install --save @colyseus/ws-transport
```

-->

**用法**

\`\`\`typescript fct\_label="Example" import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const gameServer = new Server({ transport: new WebSocketTransport({ /* transport options \*/ }) }) \`\`\`

\`\`\`typescript fct\_label="@colyseus/arena" import Arena from "@colyseus/arena"; import { WebSocketTransport } from "@colyseus/ws-transport"

export default Arena({ // ...

  initializeTransport: function() { return new WebSocketTransport({ /* ...options \*/ }); },

  // ... }); \`\`\`

### 可用选项：

#### {1>options.server<1}:

供 WebSocket 服务器重复使用的一个 Node.js http 服务器。如果您想将 Express 和 Colyseus 一起使用，这就能派上用场。

\`\`\`typescript fct\_label="Example" import { createServer } from "http"; import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const server = createServer(app); // create the http server manually

const gameServer = new Server({ transport: new WebSocketTransport({ server // provide the custom server for {1>WebSocketTransport<1} }) }); \`\`\`

\`\`\`typescript fct\_label="Example + express" import express from "express"; import { createServer } from "http"; import { Server } from "@colyseus/core"; import { WebSocketTransport } from "@colyseus/ws-transport"

const app = express(); const server = createServer(app); // create the http server manually

const gameServer = new Server({ transport: new WebSocketTransport({ server // provide the custom server for {1>WebSocketTransport<1} }) }); \`\`\`

如果不提供这个选项，将会自动为您创建一个 http 服务器。

---

#### {1>options.pingInterval<1}

服务器"ping"客户端的毫秒数。

如果客户端在 {1>pingMaxRetries<1} 次重试后未能响应，将被强制断开连接。

默认：{1}

---

#### {1>options.pingMaxRetries<1}

ping 无响应的最大允许数。

默认：`2`

---

#### {1>options.verifyClient<1}

该方法会在 WebSocket 握手之前发生。如果 {1>verifyClient<1} 未设置，则握手会被自动接受。

- {1>info<1} (Object)
    - {1>origin<1} (String) 客户端指定的 Origin 标头的值。
    - {1>req<1} (http.IncomingMessage) 客户端 HTTP GET 请求。
    - {1>secure<1} (Boolean) {2>true<2} 如果 {3>req.connection.authorized<3} 或 {4>req.connection.encrypted<4} 已设置。

- {1>next<1} (Function) 用户在 {2>info<2} 字段检查时必须调用的回调。此回调中的参数为：
    - {1>result<1} (Boolean) 是否接受握手。
    - {1>code<1} (Number) When {2>result<2} is {3>false<3} 此字段决定要发给客户端的 HTTP 错误状态代码。
    - {1>name<1} (String) When {2>result<2} is {3>false<3} 此字段决定 HTTP 动作原因。

---

## 本机 C++ WebSocket Transport (通过 {2>uWebSockets.js<2})<1}

{1>{2>uWebSockets.js<2}<1} 实现通常会在可容纳的 CCU 数量以及内存消耗方面比默认表现得好。

!!!警告：“HTTP 路由的运作方式与 {1>uWebSockets.js<1} 不同”使用 {2>uWebSockets.js<2} 的最大缺点在于其 HTTP/路由系统的运作方式与常规 Node.js/express 路径不同。查看 {3>Custom HTTP routes with {4>uWebSockets.js<4}<3} 了解更多相关信息

**安装**

{1> npm install --save @colyseus/uwebsockets-transport <1}

**用法**

\`\`\`typescript import { Server } from "@colyseus/core"; import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const gameServer = new Server({ transport: new uWebSocketsTransport({ /* options \*/ }) }) \`\`\`

### 可用选项：

#### {1>options.maxPayloadLength<1}

接收消息最大长度。如果一个客户端尝试向您发送比它更大的信息，连接会立即关闭。

默认 {1>1024 * 1024<1}。

---

#### {1>options.idleTimeout<1}

未发送或接受消息可经过的最大秒数。如果超时，连接将关闭。超时分辨率（时间粒度）通常为 4 秒，四舍五入取最接近的数值。

使用 {1>0<1} 来禁用。

默认 {1>1024 * 1024<1}。

---

#### {1>options.compression<1}

使用何种 permessage-deflate 压缩。
{1>uWS.DISABLED<1}、{2>uWS.SHARED\_COMPRESSOR<2} 或任意 {3>uWS.DEDICATED\_COMPRESSOR\_xxxKB<3}。

默认 {1>uWS.DISABLED<1}

---

#### {1>options.maxBackpressure<1}

发布或发送消息时每个套接口所允许的反向压力最大长度。高反向压力的缓慢接收器将被跳过，直至其赶上或超时为止。

默认 {1>1024 * 1024<1}。

---

#### {1>options.key\_file\_name<1}

SSL 密钥文件的路径（通过Node.js应用程序用于SSL终端。）

---

#### {1>options.cert\_file\_name<1}

SSL 证书文件的路径（通过 Node.js 应用程序用于 SSL 终端。）

---

#### {1>options.passphrase<1}

SSL 文件的路径（通过 Node.js 应用程序用于 SSL 终端。）

---

### 自定义 HTTP 的 {1>uWebSockets.js<1} 路由

#### 本机 {1>uWebSockets.js<1} 路由：

{1>uWebSocketsTransport<1} 会公布变量 {2>app<2}，作为 {5>uWebSockets.js<5} 函数库中的原始 {3>uws.App<3} 或 {4>uws.SSLApp<4}。

您可以直接使用 {1>transport.app<1} 来绑定使用 {2>uWebSockets.js<2} API 的 http 路由，如下所示：

\`\`\`typescript import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({ /* ...options \*/ });

transport.app.get("/\*", (res, req) => { res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!'); }); \`\`\`

查看 {1>{2>uWebSockets.js<2} examples<1} 了解更多信息。

#### 替代选项：express 兼容层

作为替代，我们构建了一个薄的兼容层，旨在提供与 Express 相同的功能，但使用 {1>uWebSockets.js<1}高级选项。

!!!提示：“此功能为实验性质”该 Express 兼容层为实验性质，可能无法处理复杂代码

**安装**

{1> npm install --save uwebsockets-express <1}

**用法**

\`\`\`typescript fct\_label="Example" import express from "express"; import expressify from "uwebsockets-express" import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

const transport = new uWebSocketsTransport({ /* ...options \*/ }); const app = expressify(transport.app);

// use existing middleware implementations! app.use(express.json()); app.use('/', serveIndex(path.join(\_\_dirname, ".."), { icons: true, hidden: true })) app.use('/', express.static(path.join(\_\_dirname, "..")));

// register routes app.get("/hello", (req, res) => { res.json({ hello: "world!" }); }); \`\`\`

\`\`\`typescript fct\_label="@colyseus/arena" import express from "express"; import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport" import Arena from "@colyseus/arena";

export default Arena({ // ... initializeTransport: function() { return new uWebSocketsTransport({ /* ...options \*/ }); },

  // // when using {1>@colyseus/arena<1}, the {2>uwebsockets-express<2} is loaded automatically. // you get the expressify(transport.app) as argument here. // initializeExpress: (app) => { // use existing middleware implementations! app.use('/', serveIndex(path.join(\_\_dirname, ".."), { icons: true, hidden: true })) app.use('/', express.static(path.join(\_\_dirname, "..")));

    // register routes
    app.get("/hello", (req, res) => {
      res.json({ hello: "world!" });
    });

  }, // ... })

\`\`\`