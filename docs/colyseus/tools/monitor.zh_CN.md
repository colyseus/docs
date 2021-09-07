# 监控面板  (`@colyseus/monitor`)

`@colyseus/monitor` 是一个方便易用的工具，可以实时监察服务器生成的房间列表.

**功能**

- 所有活动房间列表
    - 强制释放指定房间
- 检查特定房间
    - 查看房间状态
    - 向客户端发送 / 广播信息
    - 强制断开客户端

<img src="https://github.com/colyseus/colyseus-monitor/raw/master/media/demo.gif?raw=true" />

## 安装

安装模块:

```
npm install --save @colyseus/monitor
```

在项目中引入:

```typescript fct_label="TypeScript"
// ...
import { monitor } from "@colyseus/monitor";

// ...
app.use("/colyseus", monitor());
```

```javascript fct_label="JavaScript"
// ...
const monitor = require("@colyseus/monitor").monitor;

// ...
app.use("/colyseus", monitor());
```


## 使用密码限制面板访问

可以使用 express 的中间件, 在监控面板设置身份验证, 例如 `express-basic-middleware`:

```
npm install --save express-basic-auth
```

使用 `express-basic-auth` 创建用户和密码.

```typescript
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // 用户名/密码列表
    users: {
        "admin": "admin",
    },
    // 发送 WWW-Authenticate 响应头, 提示用户
    // 填写用户名和密码
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());
```

## 自定义房间属性列

```typescript
app.use("/colyseus", basicAuthMiddleware, monitor({
  columns: [
    'roomId',
    'name',
    'clients',
    { metadata: "spectators" }, // 显示元数据里的 'spectators'
    'locked',
    'elapsedTime'
  ]
}));
```

如果未指定, 默认房间属性列是: `['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']`.

