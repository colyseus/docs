# 服務器 API &raquo; 優雅關閉

Colyseus 默認提供合理的關閉機製. 將在進程終止之前執行這些操作：

- 異步斷開所有連接的客戶端 (`Room#onLeave`)
- 異步處理所有生成的房間 (`Room#onDispose`)
- 在關閉進程之前執行可選的異步回調 `Server#onShutdown`

如果在 `onLeave` / `onDispose` 時執行異步任務,您應該返回一個 `Promise`,並在任務準備好時完成它. 對於 `onShutdown(callback)`, 也是如此.


## 返回一個 `Promise`

通過返回 `Promise`, 服務器將等待它們完成,然後終止工作進程.

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

## 使用 `異步`

`async` 關鍵字將使函數在後臺返回一個 `Promise`. [閱讀更多有關異步/等待的信息](https://basarat.gitbooks.io/typescript/content/docs/async-await.html).

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

## 進程關閉回調

還可以通過設置 `onShutdown` 回調來監聽進程關閉.

```typescript fct_label="Server"
import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () {
    console.log("master process is being shut down!");
});
```
