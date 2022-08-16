# 加载测试 / 压力测试 (`@colyseus/loadtest`)

当您想对服务器进行压力测试,以便了解项目上线后的表现时,`@colyseus/loadtest` 里的工具会很有用.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## 安装

安装 `@colyseus/loadtest` 模块:

```
npm install --save-dev @colyseus/loadtest
```

## 用法

`colyseus-loadtest` 命令需要的参数有:

- `script`: 要使用的自定义脚本
- `--endpoint`: 您的服务器入口(默认使用 `ws://localhost:2567`)
- `--room`: 要连接的房间名
- `--numClients`: 进入房间的客户端数量

### 示例

这是一个示例脚本文件. 基于每个已连接客户端上 room 的生命周期, 可以实现一个 "bot", 与房间进行交互.

```typescript fct_label="TypeScript"
// script.ts
import { Client, Room } from "colyseus.js";
import { Options } from "@colyseus/loadtest";

export async function main(options: Options) {
    const client = new Client(options.endpoint);
    const room: Room = await client.joinOrCreate(options.roomName, {
        // 这里是加入房间的参数...
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
        // 这里是加入房间的参数...
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

### 测试 50 个客户端连接进入 `"battle"` 房间

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```