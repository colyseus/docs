# 監控面板  (`@colyseus/monitor`)

`@colyseus/monitor` 是一個方便易用的工具,可以實時監察服務器生成的房間列表.

**功能**

- 所有活動房間列表
    - 強製釋放指定房間
- 檢查特定房間
    - 查看房間狀態
    - 向客戶端發送 / 廣播信息
    - 強製斷開客戶端

<img src="https://github.com/colyseus/colyseus/raw/master/packages/monitor/media/demo.gif?raw=true" />

## 安裝

安裝模塊:

```
npm install --save @colyseus/monitor
```

在項目中引入:

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


## 使用密碼限製面板訪問

可以使用 express 的中間件, 在監控面板設置身份驗證, 例如 `express-basic-middleware`:

```
npm install --save express-basic-auth
```

使用 `express-basic-auth` 創建用戶和密碼.

```typescript
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // 用戶名/密碼列表
    users: {
        "admin": "admin",
    },
    // 發送 WWW-Authenticate 響應頭, 提示用戶
    // 填寫用戶名和密碼
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());
```

## 自定義房間屬性列

```typescript
app.use("/colyseus", basicAuthMiddleware, monitor({
  columns: [
    'roomId',
    'name',
    'clients',
    { metadata: "spectators" }, // 顯示元數據裏的 'spectators'
    'locked',
    'elapsedTime'
  ]
}));
```

如果未指定, 默認房間屬性列是: `['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']`.
