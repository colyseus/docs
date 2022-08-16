# 加載測試 / 壓力測試 (`@colyseus/loadtest`)

當您想對服務器進行壓力測試,以便了解項目上線後的表現時,`@colyseus/loadtest` 裏的工具會很有用.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## 安裝

安裝 `@colyseus/loadtest` 模塊:

```
npm install --save-dev @colyseus/loadtest
```

## 用法

`colyseus-loadtest` 命令需要的參數有:

- `script`: 要使用的自定義腳本
- `--endpoint`: 您的服務器入口(默認使用 `ws://localhost:2567`)
- `--room`: 要連接的房間名
- `--numClients`: 進入房間的客戶端數量

### 示例

這是一個示例腳本文件. 基於每個已連接客戶端上 room 的生命周期, 可以實現一個 "bot", 與房間進行交互.

```typescript fct_label="TypeScript"
// script.ts
import { Client, Room } from "colyseus.js";
import { Options } from "@colyseus/loadtest";

export async function main(options: Options) {
    const client = new Client(options.endpoint);
    const room: Room = await client.joinOrCreate(options.roomName, {
        // 這裏是加入房間的參數...
    });

    console.log("joined successfully!");

    room.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });

    room.onStateChange((state) => {
        console.log(room.sessionId, "new state:", state);
    });

    room.onError((err) => {
        console.log(room.sessionId, "!! ERROR !!", err.message);
    })

    room.onLeave((code) => {
        console.log(room.sessionId, "left.");
    });
}
```

```typescript fct_label="JavaScript"
// script.js
exports.main = function (options) {
    const client = new Client(options.endpoint);
    const room = await client.joinOrCreate(options.roomName, {
        // 這裏是加入房間的參數...
    });

    console.log("joined successfully!");

    room.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });

    room.onStateChange((state) => {
        console.log(room.sessionId, "new state:", state);
    });

    room.onError((err) => {
        console.log(room.sessionId, "!! ERROR !!", err.message);
    })

    room.onLeave((code) => {
        console.log(room.sessionId, "left.");
    });
}
```

### 測試 50 個客戶端連接進入 `"battle"` 房間

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```