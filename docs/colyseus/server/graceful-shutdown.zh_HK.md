# 服務器 API &raquo; 優雅關閉

Colyseus 默認提供了一套完善的系統關閉機製. 即系統進程正式終止之前先執行這些操作:

- 異步斷開所有已連接的客戶端 (`Room#onLeave`)
- 異步銷毀所有已創建的房間 (`Room#onDispose`)
- 在正式終止進程 `Server#onShutdown` 之前異步調用回調函數

如果要在 `onLeave` / `onDispose` 函數中執行異步程序, 就應該先返回一個 `Promise`, 並在程序執行完時 resolve 掉. 對於 `onShutdown(callback)` 函數來說, 也是如此.


## 返回 `Promise`

通過返回 `Promise`, 服務器將等待它們完成, 然後才終止進程.

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

`async` 關鍵字讓函數隱式返回 `Promise`. [更多詳情請見 Async / Await](https://basarat.gitbooks.io/typescript/content/docs/async-await.html).

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

## 進程終止前回調

還可以通過設置 `onShutdown` 回調來監聽進程終止.

```typescript fct_label="Server"
import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () {
    console.log("master process is being shut down!");
});
```
