**How does Colyseus achieve scalability?**

- Increasing the number of processes will increase the amount of rooms that can be created.
- Rooms are equally distributed across the available processes.
- The "health" of each process lives on the Redis server.
- Each Room belongs to a single Colyseus process.
    - Each room **has a maximum amount of players** it could handle.
    - The exact amount of players supported on each room depends on many factors. [See our FAQ](/colyseus/faq/#how-many-ccu-a-colyseus-server-can-handle).
- Each client connection is assigned to a process.
    - When using the proxy solution, the communication between the client and the server is done through the proxy.
    - When using the direct solution, the communication between the client and the server is done directly.

## Configure a shared `Presence` and `Driver`

First, download and install [Redis](https://redis.io/topics/quickstart).

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

The `presence` is used to call room "seat reservation" functions from one process to another, and allows the developer to take advantage of the some data sharing functions across rooms. See [Presence API](/server/presence/#api).

Each Colyseus process also registers its own `processId` and network location to the `presence` API, which is later used by the [dynamic proxy](#dynamic-proxy) service. During graceful shutdown, the process unregisters itself.

## Alternative 1: Using a Dynamic Proxy

Install the [@colyseus/proxy](https://github.com/colyseus/proxy).

```
npm install --save @colyseus/proxy
```

The Dynamic Proxy automatically listens whenever a Colyseus process goes up and down. It is responsible for routing the client requests to the correct Colyseus process.

All client requests must use the proxy as endpoint. Using this solution, clients do not communicate **directly** with the server, but through the proxy.

The proxy should be bound to port `80` / `443` on a production environment.

### Environment variables

Configure the following environment variables to meet your needs:

- `PORT` is the port the proxy will be running on.
- `REDIS_URL` is the path to the same Redis instance you're using on Colyseus' processes.

### Running the proxy

```
npx colyseus-proxy

> {"name":"redbird","hostname":"Endels-MacBook-Air.local","pid":33390,"level":30,"msg":"Started a Redbird reverse proxy server on port 80","time":"2019-08-20T15:26:19.605Z","v":0}
```

## Alternative 2: Without the Proxy

!!! Warning "Important"
    This alternative is experimental.

Altenatively, you can configure each Colyseus process to use its very own public address, so clients can connect directly to it.

```typescript
const server = new Server({
    // ...
    presence: new RedisPresence(),
    driver: new RedisDriver(),

    // use a unique public address for each process
    publicAddress: "server-1.yourdomain.com"
});
```

Ideally, you should have a regular load balancer to be sitting behind all the Colyseus processes - which should be the initial entrypoint for all your clients.

## Spawning multiple Colyseus processes

To run multiple Colyseus instances in the same server, you need each one of them to listen on a different port number. It's recommended to use ports `3001`, `3002`, `3003`, and so on.

- If you're [using `@colyseus/proxy` (alternative 1.)](#alternative-1-using-a-dynamic-proxy), the Colyseus processes should **NOT** be exposed publicly. Only internally for the proxy.
- If you're [not using using `@colyseus/proxy` (alternative 2.)](#alternative-2-without-the-proxy), each Colyseus process must have its own public address.

The [PM2 process manager](http://pm2.keymetrics.io/) is recommended for managing multiple Node.js app instances, although not mandatory.

PM2 provides a `NODE_APP_INSTANCE` environment variable, containing a different number for each process. Use it to define your port number.

```typescript
import { Server } from "colyseus";

// binds each instance of the server on a different port.
const PORT = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);

const gameServer = new Server({ /* ... */ })

gameServer.listen(PORT);
console.log("Listening on", PORT);
```

```
npm install -g pm2
```

Use the following `ecosystem.config.js` configuration:

```javascript
// ecosystem.config.js
const os = require('os');
module.exports = {
    apps: [{
        port        : 3000,
        name        : "colyseus",
        script      : "lib/index.js", // your entrypoint file
        watch       : true,           // optional
        instances   : os.cpus().length,
        exec_mode   : 'fork',         // IMPORTANT: do not use cluster mode.
        env: {
            DEBUG: "colyseus:errors",
            NODE_ENV: "production",
        }
    }]
}
```

Now you're ready to start multiple Colyseus proceses.

```
pm2 start
```

!!! Tip "PM2 and TypeScript"
    It's recommended compile your .ts files before running `pm2 start`, via `npx tsc`. Alternatively, you can install the TypeScript interpreter for PM2 (`pm2 install typescript`) and set the `exec_interpreter: "ts-node"` ([read more](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)).