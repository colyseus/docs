# 監視面板 (`@colyseus/monitor`)

`@colyseus/monitor` 是讓您檢視並檢查由伺服器產生的房間清單的實用工具.

**功能**

- 所有使用中房間的清單
    - 強制處置特定房間
- 檢查特定房間
    - 檢視房間狀態
    - 為用戶端傳送/廣播訊息
    - 強制中斷用戶端的連線

<img src="https://github.com/colyseus/colyseus-monitor/raw/master/media/demo.gif?raw=true" />

## 安裝

安裝模組:

```
npm install --save @colyseus/monitor
```

將其包含至您的專案:

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


## 使用密碼限制對面板的訪問

您可以使用 express 中間件軟體以啟用監視器路由的驗證,例如 `express-basic-middleware`:

```
npm install --save express-basic-auth
```

使用 `express-basic-auth` 建立使用者和密碼.

```typescript
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // 用戶名/密碼列表
    users: {
        "admin": "admin",
    },
    // 發送 WWW-Authenticate 響應頭部, 提示用戶
    // 填寫用戶名和密碼
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());
```

## 設定自訂房間清單欄

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

如果未指定, 則預設房間清單欄為: `['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']`.
