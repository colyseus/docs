# 加载测试 / 压力测试 ({1>@colyseus/loadtest<1})

当您想要实战测试服务器，以了解其在实时环境下的表现时，{1>@colyseus/loadtest<1} 工具很有用。

{1>{2>asciicast<2}<1}

## 安装

安装 {1>@colyseus/loadtest<1} 模块：

{1> npm install --save-dev @colyseus/loadtest <1}

## 用法

{1>colyseus-loadtest<1} 命令需要一些参数才能工作：

- {1>脚本<1}：自定义脚本工具将使用
- {1>--endpoint<1}:您的服务器终端（默认使用 {2>ws://localhost:2567<2})
- {1>--room<1}:想要连接的房间名称
- {1>--numClients<1}:想要连接进入房间的客户端数量。

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

### 50 个客户端连接进入 {1>"battle"<1} 房间

{1> npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567 <1}