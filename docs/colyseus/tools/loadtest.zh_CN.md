# 加载测试 / 压力测试 (`@colyseus/loadtest`)

当您想对服务器进行压力测试时,以了解其在上线时的表现时,`@colyseus/loadtest` 里的工具会很有用.

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

### 测试 50 个客户端连接进入 `"battle"` 房间

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```
