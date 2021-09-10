> 该文档可能随时更新.

要想将 Colyseus 扩展至多进程或多服务器,您需要拥有 Redis, MongoDB 以及一个动态代理.

## Redis

下载并安装 [Redis](https://redis.io/topics/quickstart). 然后创建 `RedisPresence`：

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  presence: new RedisPresence(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...
  presence: new colyseus.RedisPresence(),
});
```

其中 `presence` 用于进程间调用房间的 "预留席位" 功能, 还用于让开发者可以在房间之间共享数据. 详情请参阅 [Presence API](/server/presence/#api).

每个 Colyseus 进程还会用 `presence` API 注册自身的 `processId` 和网络位置, 以便使用 [动态代理](#dynamic-proxy) 服务. 优雅关闭时, 进程会自我注销.

## MongoDB

下载安装 [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) 并安装 `mongoose` 包：

```
npm install --save mongoose
```

使用 `MongooseDriver`:

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";
import { MongooseDriver } from "@colyseus/mongoose-driver"

const gameServer = new Server({
  // ...
  driver: new MongooseDriver(),
});
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const MongooseDriver = require("@colyseus/mongoose-driver").MongooseDriver;

const gameServer = new colyseus.Server({
  // ...
  driver: new MongooseDriver(),
});
```


您可以将 MongoDB 的连接 URI 传递给 `new MongooseDriver(uri)` 构造函数, 或者设置并赋值一个名为 `MONGO_URI` 的环境变量.

这里的 `driver` 用于在房间匹配时存储和查询可用的房间.

## 运行多个 Colyseus 进程

想要在一个服务器中运行多个 Colyseus 实例, 您需要让每个实例监听不同的端口号. 推荐使用 `3001`, `3002`, `3003` 这样的端口. Colyseus 进程 **不应** 对外公开, 而应该只公开 [动态代理](#dynamic-proxy).

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

使用如下 `ecosystem.config.js` 配置：

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


## 动态代理

[@colyseus/proxy](https://github.com/colyseus/proxy) 作为动态代理, 自动监控 Colyseus 进程的创建和释放, 以确保 WebSocket 连接通向正确的服务器上正确进程的正确房间.

动态代理应该作为唯一公开门户绑定至 `80` / `443` 端口. 所有请求必须通过这个代理.

```
npm install -g @colyseus/proxy
```

### 环境变量

配置下列环境变量来满足您的需求：

- `PORT` 是代理运行的端口.
- `REDIS_URL` 是各个 Colyseus 进程里使用的同一个 Redis 实例的路径.

### 运行代理

```
colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```

