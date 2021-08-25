# 負載測試 / 壓力測試 ({1>@colyseus/loadtest<1})

{1>@colyseus/loadtest<1} 工具在您要對伺服器進行競技測試時相當實用，並查看其即時環境下執行的效能。

{1>{2>asciicast<2}<1}

## 安裝

安裝 {1>@colyseus/loadtest<1} 模組：

{1> npm install --save-dev @colyseus/loadtest <1}

## 使用方式

{1>colyseus-loadtest<1} 命令需要數個引數以執行：

- {1>指令碼<1}：要使用的自訂指令碼工具
- {1>--endpoint<1}：您的伺服器端點（預設使用 {2>ws://localhost:2567<2}）
- {1>--room<1}：您要連接的房間名稱
- {1>--numClients<1}：您要連接至房間的用戶端數。

### 範例

這是範例指令碼檔案。根據每個連接的用戶端房間生命週期事件，您可以實作「bot」以與房間互動。

\`\`\`typescript fct\_label="TypeScript" // script.ts import { Room, Client } from "colyseus.js";

export function requestJoinOptions (this:Client, i: number) { return { requestNumber: i }; }

export function onJoin(this:Room) { console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

export function onLeave(this:Room) { console.log(this.sessionId, "left."); }

export function onError(this:Room, err) { console.error(this.sessionId, "!!ERROR !!", err.message); }

export function onStateChange(this:Room, state) { } \`\`\`

\`\`\`typescript fct\_label="JavaScript" // script.js exports.requestJoinOptions = function (i) { return { requestNumber: i }; }

exports.onJoin = function () { console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

exports.onLeave = function () { console.log(this.sessionId, "left."); }

exports.onError = function (err) { console.log(this.sessionId, "!!ERROR !!", err.message); }

exports.onStateChange = function (state) { } \`\`\`

### 將 50 個用戶端連接至{1>「競技」<1}房間

{1> npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567 <1}