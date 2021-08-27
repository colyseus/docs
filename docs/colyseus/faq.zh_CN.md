# 常见问题

### 一个Colyseus服务器能够承载多少CCU？！

一个Colyseus服务器能够承载的最大并发用户数将根据你的游戏循环的cpu密集程度以及你的服务器向客户端发送多少流量而有所不同。

Linux服务器的默认“文件描述符限制”（你能拥有的打开连接数量）大约为1024——超过该值，责任由你自行承担。所以，你可以放心假设最便宜的云端服务器能够容纳1024个并发用户。有报告称有人设法拥有[600k open WebSocket connections](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/)，即使这些是空闲连接，没有传输数据——不过这证明了通过微调服务器规格和配置，您可以承载超过1024个并发连接。

### `"Error: seat reservation expired"`是什么意思？？

该错误意味着客户端未能在有效时间内与房间建立连接。通常在生产环境下，你会经常见到该错误发生。[You may increase limit](/server/room/#setseatreservationtime-seconds)。

### 我该如何将`state`数据只同步给一位特定客户端？

你可以使用[schema filters](/state/schema/#filtering-data-per-client)，和/或通过[room's send method](/server/client/#sendtype-message)将数据手动发送给每位客户端。

### Colyseus是否会帮助我进行客户端预测？

Colyseus不提供任何现成的客户端预测解决方案。像[wilds.io](http://wilds.io/)和[mazmorra.io](https://mazmorra.io/)这样的游戏不使用任何形式的客户端预测。[`lerp`](http://gamestd.io/mathf/globals.html#lerp)用户坐标通常会给出合理的结果。

### 我出现了这个错误：`Class constructor Room cannot be invoked without 'new'"`，我该怎么办？

请确定你的`tsconfig.json`拥有`es2015`或更高：

```javascript { "compilerOptions": { // ... "target": "es2015", // ... }, // ... } ```
