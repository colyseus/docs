# 服务器 API &raquo; 优雅关闭

Colyseus 默认提供了一套完善的系统关闭机制. 即系统进程正式终止之前先执行这些操作:

- 异步断开所有已连接的客户端 (`Room#onLeave`)
- 异步销毁所有已创建的房间 (`Room#onDispose`)
- 在正式终止进程 `Server#onShutdown` 之前异步调用回调函数

如果要在 `onLeave` / `onDispose` 函数中执行异步程序, 就应该先返回一个 `Promise`, 并在程序执行完时 resolve 掉. 对于 `onShutdown(callback)` 函数来说, 也是如此.


## 返回 `Promise`

通过返回 `Promise`, 服务器将等待它们完成, 然后才终止进程.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    onLeave (client) {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    onDispose () {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
```

## 使用 `async`

`async` 关键字让函数隐式返回 `Promise`. [更多详情请见 Async / Await](https://basarat.gitbooks.io/typescript/content/docs/async-await.html).

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    async onLeave (client) {
        await doDatabaseOperation(client);
    }

    async onDispose () {
        await removeRoomFromDatabase();
    }
}
```

## 进程终止前回调

还可以通过设置 `onShutdown` 回调来监听进程终止.

```typescript fct_label="Server"
import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () {
    console.log("master process is being shut down!");
});
```
