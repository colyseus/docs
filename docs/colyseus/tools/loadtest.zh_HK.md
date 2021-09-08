# 加載測試 / 壓力測試 (`@colyseus/loadtest`)

當您想對伺服器進行壓力測試時，以了解其在上線時的表現時，`@colyseus/loadtest` 裏的工具會很有用.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## 安裝

安裝 `@colyseus/loadtest` 模組:

```
npm install --save-dev @colyseus/loadtest
```

## 用法

`colyseus-loadtest` 命令需要的參數有:

- `script`: 要使用的自定義腳本
- `--endpoint`: 您的伺服器入口（默認使用 `ws://localhost:2567`)
- `--room`: 要連接的房間名
- `--numClients`: 進入房間的客戶端數量

### 範例

這是一個範例腳本文件. 基於每個已連接客戶端上 room 的生命周期, 可以實現一個 "bot", 與房間進行交互.

```typescript fct_label="TypeScript"
// script.ts
import { Room, Client } from "colyseus.js";

export function requestJoinOptions (this: Client, i: number) {
    return { requestNumber: i };
}

export function onJoin(this: Room) {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

export function onLeave(this: Room) {
    console.log(this.sessionId, "left.");
}

export function onError(this: Room, err) {
    console.error(this.sessionId, "!! ERROR !!", err.message);
}

export function onStateChange(this: Room, state) {
}
```

```typescript fct_label="JavaScript"
// script.js
exports.requestJoinOptions = function (i) {
    return { requestNumber: i };
}

exports.onJoin = function () {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });
}

exports.onLeave = function () {
    console.log(this.sessionId, "left.");
}

exports.onError = function (err) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

exports.onStateChange = function (state) {
}
```

### 測試 50 個客戶端連接進入 `"battle"` 房間

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```
