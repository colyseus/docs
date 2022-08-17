**Colyseus 如何实现可扩展性?**

- 增加处理器数量可以让系统创建更多的房间.
- 房间在多处理器之间平均分配.
- 每个处理器的使用情况储存在 Redis 数据库中.
- 每个房间隶属于一个 Colyseus 进程.
    - 每个房间有其可承载的 **最大玩家数量**.
    - 每个房间的最大玩家数量由多种因素决定. [参考常见问题](/colyseus/faq/#how-many-ccu-a-colyseus-server-can-handle).
- 每个客户端连接隶属于一个进程.
    - 使用 proxy 方案时, 客户端与服务器的交流由代理程序负责.
    - 使用 direct 方案时, 客户端与服务器的交流直接完成.

## 配置共享 `Presence` 与 `Driver`

首先, 下载并安装 [Redis](https://redis.io/topics/quickstart).

```typescript fct_label="TypeScript"
import { Server } from "colyseus";
import { RedisPresence } from "@colyseus/redis-presence";
import { RedisDriver } from "@colyseus/redis-driver";

const gameServer = new Server({
  // ...
  presence: new RedisPresence(),
  driver: new RedisDriver(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const { RedisPresence } = require("@colyseus/redis-presence");
const { RedisDriver } = require("@colyseus/redis-driver");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence(),
  driver: new colyseus.RedisDriver(),
});
```

其中 `presence` 用于进程间调用房间的 "seat reservation" 功能, 还用于让开发者可以在房间之间共享数据. 详情请参阅 [Presence API](/server/presence/#api).

其中 `driver` 表示可用房间的共享缓存, 以及实现 Colyseus 进程的房间检索功能.

每个 Colyseus 进程还会用 `presence` API 注册自身的 `processId` 和网络位置, 以便使用 [动态代理](#dynamic-proxy) 服务. 优雅关闭时, 进程会自我注销.

## 方案 1: 使用动态代理

安装好 [@colyseus/proxy](https://github.com/colyseus/proxy).

```
npm install --save @colyseus/proxy
```

动态代理自动监听 Colyseus 进程的运行情况. 可以把客户端请求路由到正确的 Colyseus 进程中.

所有客户端请求必须经由代理进入. 这种方案下, 客户端捕鱼服务器 **直接** 交流, 而是通过代理完成.

生产环境下, 代理需要绑定端口 `80` / `443`.

### 环境变量

根据需要配置下列环境变量:

- `PORT` 代理绑定的端口号.
- `REDIS_URL` 配合 Colyseus 进程运行的 Redis 实例路径.

### 启动代理

```
npx colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```

## 方案 2: 不使用代理

!!! Warning "注意"
    该方案是试验性的.

另一种选择, 可以配置每个 Colyseus 进程使用自己的公开地址, 以便客户端直接与之通信.

```typescript
const server = new Server({
    // ...
    presence: new RedisPresence(),
    driver: new RedisDriver(),

    // 每个进程一个唯一公开地址
    publicAddress: "server-1.yourdomain.com"
});
```

理想情况下, 应该有一个负责载入均衡的程序来处理所有的 Colyseus 进程 - 而这个程序应作为所有客户端的连接入口.

## 运行多个 Colyseus 进程

想要在一个服务器中运行多个 Colyseus 实例, 您需要让每个实例监听不同的端口号. 推荐使用 `3001`, `3002`, `3003` 这样的端口. Colyseus 进程 **不应** 对外公开, 而应该只公开 [动态代理](#dynamic-proxy).

- If you're [using `@colyseus/proxy` (alternative 1.)](#alternative-1-using-a-dynamic-proxy), the Colyseus processes should **NOT** be exposed publicly. Only internally for the proxy.
- If you're [not using using `@colyseus/proxy` (alternative 2.)](#alternative-2-without-the-proxy), each Colyseus process must have its own public address.

强烈推荐使用 [PM2 process manager](http://pm2.keymetrics.io/) 管理多个 Node.js 应用实例.

PM2 提供名为 `NODE_APP_INSTANCE` 的环境变量, 对于每个进程这个变量数字是唯一的, 可以用其界定端口号.

```typescript
import { Server } from "colyseus";

// 给每个实例绑定各不相同的端口号.
const PORT = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);

const gameServer = new Server({ /* ... */ })

gameServer.listen(PORT);
console.log("Listening on", PORT);
```

```
npm install -g pm2
```

使用如下 `ecosystem.config.js` 配置:

```javascript
// ecosystem.config.js
const os = require('os');
module.exports = {
    apps: [{
        port        : 3000,
        name        : "colyseus",
        script      : "lib/index.js", // 主入口页面
        watch       : true,           // 可选
        instances   : os.cpus().length,
        exec_mode   : 'fork',         // 注意: 不要使用 cluster 模式.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
        }
    }]
}
```

现在您就可以开启多个 Colyseus 进程了.

```
pm2 start
```

!!! Tip "PM2 和 TypeScript"
    建议在运行 `pm2 start` 之前, 使用 `npx tsc` 编译 .ts 文件. 或者您可以为 PM2 安装 TypeScript 解释器 (`pm2 install typescript`) 并设置 `exec_interpreter: "ts-node"` ([更多参考](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)).