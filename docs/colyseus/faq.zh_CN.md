# 常见问题

### 一个 Colyseus 服务器能够承载多少 CCU?!

一个 Colyseus 服务器能够承载的最大并发用户数将取决于您的游戏的 CPU 运算密集程度以及您的服务器向客户端发送的数据流量.

Linux 默认的 "file descriptor limit" (最大连接数) 限制为 1024 —— 可以根据需要酌情调整. 所以, 即使是最便宜的云端服务器也能够容纳1024个并发用户. 据说有人通过配置打开了 [60万个 WebSocket 连接](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/), 即使是没有数据传输的空连接 —— 这也证明了通过配置完全可以容纳超过 1024 个连接的限制.

### `"Error: seat reservation expired"` 是什么意思??

该错误意味着客户端未能在一定时间段内与房间完成连接. 通常在商用环境下会经常见到该错误. [可以适当提高超时设置](/server/room/#setseatreservationtime-seconds).

### 我该如何将 `state` 数据只同步给一位特定客户端?

您可以使用 [schema filters](/state/schema/#filtering-data-per-client),或者通过 [room 的 send 方法](/server/client/#sendtype-message) 将数据手动发送给每个客户端.

### Colyseus 是否会帮助我进行客户端预测?

Colyseus 本身不提供现成的客户端预测方法. 像 [wilds.io](http://wilds.io/) 和 [mazmorra.io](https://mazmorra.io/) 这样的游戏并没有使用任何形式的客户端预测. 把用户坐标进行 [`补间插值`](http://gamestd.io/mathf/globals.html#lerp) 的效果通常不错.

### 爆出这个错误: `"Class constructor Room cannot be invoked without 'new'"`, 我该怎么办?

请确定在您的 `tsconfig.json` 文件里开启了 `es2015` 或更新的编译配置:

```javascript
{
    "compilerOptions": {
        // ...
        "target": "es2015",
        // ...
    },
    // ...
}
```