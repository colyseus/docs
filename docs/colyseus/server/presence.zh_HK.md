# 伺服器 API &raquo; 狀態

在多處理器和/或機器上擴展伺服器時,需要為 `Server` 提供 [`Presence`](/server/api/#optionspresence) 選項. `Presence` 的作用是允許不同進程之間的通信和數據共享, 特別是在匹配期間.

- [`LocalPresence`](#localpresence)(預設)
- [`RedisPresence`](#redispresence-clientopts)

`presence` 實例也可以用於所有 `Room` 處理程序.可以使用它的 [API](#api) 保留數據和通過 PUB/SUB 進行房間之間的通信.

### `LocalPresence`

這是預設選項.在單進程中執行  Colyseus 時,應使用此選項.

### `RedisPresence (clientOpts?)`

在多進程和/或多機器上執行  Colyseus 時,應使用此選項.

**Parameters:**

- `clientOpts`: redis 客戶端選項(主機/憑證).[查看完整選項列表](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52).

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

// This happens on the slave processes.
const gameServer = new Server({
    // ...
    presence: new RedisPresence()
});

gameServer.listen(2567);
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

// This happens on the slave processes.
const gameServer = new colyseus.Server({
    // ...
    presence: new colyseus.RedisPresence()
});

gameServer.listen(2567);
```

## API

`Presence` API 高度基於 Redis 的API, 後者是一個鍵-值數據庫.

每個 [`Room`](/server/room) 實例都有一個 [`presence`](/server/room/#presence-presence) 屬性, 實現以下方法：

### `subscribe(topic: string, callback:Function)`

訂閱給定的 `topic`. 每當有關於 `topic` 的消息[發布](#publishtopic-string-data-any)時, 就會觸發 `callback`.

### `unsubscribe(topic: string)`

取消訂閱給定的 `topic`.

### `publish(topic: string, data: any)`

發布給定 `topic` 的消息.

### `exists(key: string):Promise<boolean>`

如果鍵值存在,則返回.

### `setex(key: string, value: string, seconds: number)`

設置鍵值,以保存字符串值,設置鍵值,從而在指定秒數後超時.

### `get(key: string)`

獲取鍵值.

### `del(key: string): void`

移除特定的鍵.

### `sadd(key: string, value: any)`

將特定的成員添加至存儲在鍵值中的集合. 忽略已屬於此集合的成員的特定成員. 如果鍵值不存在, 則創建一個新的集合, 然後添加特定成員.

### {1>smembers(key: string)<1}

返回存儲在鍵值中的集合的所有成員.

### `sismember(member: string)`

如果成員 `member` 是存儲在鍵值中的集合的成員,則返回.

**Return value**

- `1` 如果元素是集合的成員.
- `0`  如果元素不是集合的成員,或鍵值不存在.

### `srem(key: string, value: any)`

移除存儲在鍵值中的集合中的特定成員.忽略不屬於此集合的成員的特定成員.如果鍵值不存在,則視它為空集合,此指令返回 0.

### `scard(key: string)`

返回存儲在鍵值中的集合的勢(元素的數量).

### `sinter(...keys: string[])`

返回由所有給定集合的交集產生的集合成員.

### `hset(key: string, field: string, value: string)`

將存儲在鍵中的散列中的字段設置為值.如果鍵值不存在,則創建一個包含哈希值的新鍵值.如果字段已存在於哈希值中,則將其覆蓋.

### `hincrby(key: string, field: string, value: number)`

按增量遞增存儲在鍵值中的哈希字段中的數量.如果鍵值不存在,則創建一個包含哈希值的新鍵值.如果字段不存在,則在執行操作之前將值設置為 0.

### `hget(key: string, field: string):Promise<string>`

返回與存儲在鍵值的哈希值中的字段相關聯的值.

### `hgetall(key: string):Promise<{\[field: string]: string}>`

返回存儲在鍵值的哈希值中的所有字段和值.

### `hdel(key: string, field: string)`

移除存儲在鍵值中的集合中的特定成員.將忽略在此哈希值中不存在的特定字段.如果鍵值不存在,則將其視為空哈希值,此指令返回 0.

### `hlen(key: string):Promise<number>`

返回存儲在鍵值中的哈希值所包含的字段數量

### `incr(key: string)`

將存儲在鍵值中的數量增加 1.如果鍵值不存在,則在執行操作前將其設置為 0.如果鍵值包含錯誤類型的值或包含不能表示為整數的字符串,則返回錯誤.此操作僅限於 64 位有符號整數.

### `decr(key: string)`

將存儲在鍵值中的數量減 1.如果鍵值不存在,則在執行操作前將其設置為 0.如果鍵值包含錯誤類型的值或包含不能表示為整數的字符串,則返回錯誤.此操作僅限於 64 位有符號整數.
