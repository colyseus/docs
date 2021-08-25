> 该文件属于半成品。

要想将 Colyseus 扩展至多进程或多服务器，您需要拥有 Redis、MongoDB和一个动态代理。

## Redis

下载并安装 {1>Redis<1}。使用 {2>RedisPresence<2}：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... presence: new RedisPresence(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus");

const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence(), }); \`\`\`

{1>presence<1} 用于从一个进程至另一个进程调用房间"seat reservation"功能，使开发者可以在房间之间利用一些同类数据分享功能。参阅 {2>Presence API<2}。

每个 Colyseus 进程还会在 {2>presence<2} API 上注册自身的 {1>processId<1} 和网络位置，之后将用于 {3>动态<3} 服务。在平稳关闭期间，进程将自我注销。

## MongoDB

{1>下载和安装 MongoDB<1}并安装 {2>mongoose<2}包：

{1> npm install --save mongoose <1}

使用 {1>MongooseDriver<1}：

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus"; import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({ // ... driver: new MongooseDriver(), }); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus"); const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({ // ... driver: new MongooseDriver(), }); \`\`\`


您可以将 MongoDB 连接 URI 传输至 {1>new MongooseDriver(uri)<1} 构造函数，或设置一个 {2>MONGO\_URI<2} 环境变量。

{1>driver<1} 用于为比赛匹配存储并查询可用房间。

## 运行多个 Colyseus 进程

想要在同一个服务器中运行多个 Colyseus 实例，您需要让每个实例监听不同的端口号。推荐使用 {1>3001<1}、 {2>3002<2}、{3>3003<3}，以此类推。Colyseus 进程{4>不<4}应公开。只需公开{5>动态代理<5}。

强烈推荐使用{1>PM2 process manager<1}管理多Node.js app实例。

PM2 提供一个 {1>NODE\_APP\_INSTANCE<1} 环境变量，其中每个进程包含一个不同数字。用其界定您的端口号。

\`\`\`typescript import { Server } from "colyseus";

// binds each instance of the server on a different port. const PORT = Number(process.env.PORT) + Number(process.env.NODE\_APP\_INSTANCE);

const gameServer = new Server({ /* ... \*/ })

gameServer.listen(PORT); console.log("Listening on", PORT); \`\`\`

{1> npm install -g pm2 <1}

使用如下 {1>ecosystem.config.js<1} 配置：

{1}javascript // ecosystem.config.js const os = require('os'); module.exports = { apps: \[{ port :3000, name : "colyseus", script : "lib/index.js", // your entrypoint file watch : true, // optional instances : os.cpus().length, exec\_mode : 'fork', // IMPORTANT: do not use cluster mode. env: { DEBUG: "colyseus:errors", NODE\_ENV: "production", } }] } {2}

现在您可以开始多个 Colyseus 进程了。

{1> pm2 start <1}

!!!提示 推荐在经由 {2>npx tsc<2} 运行 {1>pm2 start<1} 之前，使用"PM2 and TypeScript"编译您的 .ts 文件。或者您可以为 PM2 ({3>pm2 install typescript<3}) 安装 TypeScript 解译器并设置 {4>exec\_interpreter: "ts-node"<4} ({5>阅读更多<5})。


## 动态代理

{1>@colyseus/proxy<1} 是一个动态代理，会自动监听 Colyseus 的上下波动，使 WebSocket 连接可以前往所创建房间的正确进程和服务器。

动态代理应绑定至端口 {1>80<1}/{2>443<2}，这是您的应用中唯一的公共端点。所有请求必须经过代理。

{1> npm install -g @colyseus/proxy <1}

### 环境变量

配置下列环境变量来满足您的需求：

- {1>PORT<1} 是代理运行的端口。
- {1>REDIS\_URL<1} 是您在 Colyseus 进程上使用的同一个 Redis 实例的路径。

### 运行代理

\`\`\` colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0} \`\`\`
