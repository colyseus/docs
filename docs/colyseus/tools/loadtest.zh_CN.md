# 負載測試 / 壓力測試 (`@colyseus/loadtest`)

`@colyseus/loadtest` 工具在您要對伺服器進行競技測試時相當實用，並查看其即時環境下執行的效能。

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## 安裝

安裝 `@colyseus/loadtest` 模組：

``` npm install --save-dev @colyseus/loadtest ```

## 使用方式

`colyseus-loadtest` 命令需要數個引數以執行：

- `指令碼`：要使用的自訂指令碼工具
- `--endpoint`:您的伺服器端點（預設使用 `ws://localhost:2567`）
- `--room`:您要連接的房間名稱
- `--numClients`:您要連接至房間的用戶端數。

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

### 將 50 個用戶端連接至`「競技」`房間

``` npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567 ```