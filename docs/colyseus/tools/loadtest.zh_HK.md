# 加载测试 / 压力测试 (`@colyseus/loadtest`)

当您想要实战测试服务器，以了解其在实时环境下的表现时，`@colyseus/loadtest` 工具很有用。

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## 安装

安装 `@colyseus/loadtest` 模块：

``` npm install --save-dev @colyseus/loadtest ```

## 用法

`colyseus-loadtest` 命令需要一些参数才能工作：

- `脚本`：自定义脚本工具将使用
- `--endpoint`:您的服务器终端（默认使用 `ws://localhost:2567`)
- `--room`:想要连接的房间名称
- `--numClients`:想要连接进入房间的客户端数量。

### 示例

这是一个示例脚本文件。在每个已连接客户端的房间生命周期事件基础上，可以实现一个“bot”，与房间互动。

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

### 50 个客户端连接进入 `"battle"` 房间

``` npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567 ```