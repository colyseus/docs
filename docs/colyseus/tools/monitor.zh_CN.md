# 監視面板 ({1>@colyseus/monitor<1})

{1>@colyseus/monitor<1} 是讓您檢視並檢查由伺服器產生的目前房間清單的實用工具。

{1>功能<1}

- 所有使用中房間的清單
    - 強制處置特定房間
- 檢查特定房間
    - 檢視房間狀態
    - 為用戶端傳送/廣播訊息
    - 強制中斷用戶端的連接。

}; \`\`\`

## 安裝

安裝模組：

{1> npm install --save @colyseus/monitor <1}

將其包含至您的專案：

\`\`\`typescript fct\_label="TypeScript" // ... import { monitor } from "@colyseus/monitor";

// ... app.use("/colyseus", monitor()); \`\`\`

\`\`\`javascript fct\_label="JavaScript" // ... const monitor = require("@colyseus/monitor").monitor;

// ... app.use("/colyseus", monitor()); \`\`\`


## 使用密碼限制對面板的存取

您可以使用快速中介軟體以啟用監視器路由的驗證，例如 {1>express-basic-middleware<1}：

{1> npm install --save express-basic-auth <1}

使用 {1>express-basic-auth<1} 建立使用者和密碼。

\`\`\`typescript import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({ // list of users and passwords users: { "admin": "admin", }, // 傳送 WWW-Authenticate 標頭，其會提示使用者填滿 // challenge: true 中的認證 });

app.use("/colyseus", basicAuthMiddleware, monitor()); \`\`\`

## 設定自訂房間清單欄

{1>typescript app.use("/colyseus", basicAuthMiddleware, monitor({ columns: \[ 'roomId', 'name', 'clients', { metadata: "spectators" }, // display 'spectators' from metadata 'locked', 'elapsedTime' ] })); <1}

如果未指定，則預設房間清單欄為：{1>\['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']<1}。
