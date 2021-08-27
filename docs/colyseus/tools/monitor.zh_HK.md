# 监控面板  (`@colyseus/monitor`)

`@colyseus/monitor` 是一个方便易用的工具，允许查看和检查服务器生成的当前房间列表。

**功能**

- 所有活动房间列表
    - 强制销毁特定房间
- 检查特定房间
    - 查看房间状态
    - 向客户端发送/广播息
    - 强制断开客户端

<img src="https://github.com/colyseus/colyseus-monitor/raw/master/media/demo.gif?raw=true" />

## 安装

安装模块：

``` npm install --save @colyseus/monitor ```

包括在你的项目之中：

\`\`\`typescript fct\_label="TypeScript" // ... import { monitor } from "@colyseus/monitor";

// ... app.use("/colyseus", monitor()); \`\`\`

\`\`\`javascript fct\_label="JavaScript" // ... const monitor = require("@colyseus/monitor").monitor;

// ... app.use("/colyseus", monitor()); \`\`\`


## 使用密码限制面板访问

可以使用快速型中间，在监控路径上启用身份验证，例如 `express-basic-middleware`：

``` npm install --save express-basic-auth ```

使用 `express-basic-auth` 创建用户和密码。

\`\`\`typescript import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({ // list of users and passwords users: { "admin": "admin", }, // sends WWW-Authenticate header, which will prompt the user to fill // credentials in challenge: true });

app.use("/colyseus", basicAuthMiddleware, monitor()); \`\`\`

## 设置自定义房间列表栏

```typescript app.use("/colyseus", basicAuthMiddleware, monitor({ columns: [ 'roomId', 'name', 'clients', { metadata: "spectators" }, // display 'spectators' from metadata 'locked', 'elapsedTime' ] })); ```

如果未指定，默认房间列表栏是：`['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']`。
