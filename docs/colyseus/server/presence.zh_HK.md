# 服務器 API &raquo; Presence

在多處理器/機器上擴展服務器時, 需要為 `Server` 提供 [`Presence`](/server/api/#optionspresence) 配置. `Presence` 的作用是實現不同進程之間的通信和數據共享, 特別是用在 match-making 的時候.

- [`LocalPresence`](#localpresence)(默認)
- [`RedisPresence`](#redispresence-clientopts)

`presence` 實例可以在任何 `Room` 中獲取. 可以使用它的 [API](#api) 來做數據持久化和進行房間之間的 PUB/SUB 通信.

### `LocalPresence`

這是默認配置. 在單進程中運行 Colyseus 時, 應使用此配置.

### `RedisPresence (clientOpts?)`

在多進程或多機器上運行 Colyseus 時, 應使用此配置.

**參數:**

- `clientOpts`: redis 客戶端配置 (主機/憑證). [完整配置詳見這裏](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52).

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

`Presence` API 高度基於 Redis 的 key-value 數據庫的 API.

每個 [`Room`](/server/room) 實例都有一個 [`presence`](/server/room/#presence-presence) 屬性:

```typescript
export class MyRoom extends Room {
    onCreate() {
        this.presence // 從這裏開始使用 Presence API
    }
}
```

或者, 可以從任何地方導入 [Match-maker API](/colyseus/server/matchmaker/), 然後使用 `matchMaker.presence`, :

```typescript
import { matchMaker } from "colyseus";

matchMaker.presence // 從這裏開始使用 Presence API
```

### `subscribe(topic: string, callback:Function)`

訂閱指定的 `topic`. 每當有關於 `topic` 的消息 [發布](#publishtopic-string-data-any) 時, 就會觸發 `callback`.

```typescript
this.presence.subscribe("global-event", (data) => {
    console.log("received message:", data);
});
```

### `unsubscribe(topic: string)`

取消指定的 `topic` 的訂閱.

**示例:** 取消所有關於 "global-event" 訂閱的回調.

```typescript
//
this.presence.unsubscribe("global-event");
```

**示例:** 取消某 "topic" 指定的回調.

```typescript
function callback(data) { }
this.presence.subscribe("global-event", callback);

// 取消訂閱這個回調
this.presence.unsubscribe("global-event", callback);
```

### `publish(topic: string, data: any)`

向給定 `topic` 發布消息.

```typescript
this.presence.publish("global-event", { any: 1, data: 2, here: "3" });
```

### `setex(key: string, value: string, seconds: number)`

保存 key 的 value 一個指定的時間段 seconds, 超時即刪除.

**示例:** 保存 `"global-key"` 全局變量時長 2 分鐘.

```typescript
this.presence.setex("global-key", "a string value", 120);
```

### `get(key: string)`

獲取指定 key 的值.

```typescript
const globalKeyValue = await this.presence.get("global-key");
```

### `del(key: string): void`

刪除指定的 key.

```typescript
await this.presence.del("global-key");
```

### `exists(key: string):Promise<boolean>`

返回指定 key 是否存在.

```typescript
const globalKeyExists = await this.presence.exists("global-key");
```

### `incr(key: string)`

指定 key 的 value 加 1.

如果指定的 key 不存在, 默認從 0 開始累加.

如果指定的 key 的 value 類型錯誤或者是不能被轉換為整數值的字符串, 則返回錯誤.

該操作對象限製為 64 位有符號整數.

```typescript
await this.presence.incr("global-count");
await this.presence.incr("global-count");
await this.presence.incr("global-count");

// 取得鍵 "global-count" 的值
const count = await this.presence.get("global-count");
console.log(count) // => 3
```

### `decr(key: string)`

指定 key 的 value 減 1.

如果指定的 key 不存在, 默認從 0 開始累加.

如果指定 key 的 value 類型錯誤或者是不能被轉換為整數值的字符串, 則返回錯誤.

該操作對象限製為 64 位有符號整數.

```typescript
await this.presence.decr("global-count");
await this.presence.decr("global-count");
await this.presence.decr("global-count");

// 取得鍵 "global-count" 的值
const count = await this.presence.get("global-count");
console.log(count) // => 33
```

### `sadd(key: string, value: any)`

向 key 集合裏保存成員 value.

如果集合裏已存在成員 value 則操作取消.

如果 key 集合不存在, 則創建一個新的集合, 集合成員為 value.

```typescript
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-one"); // 忽略, 不會重復添加
await this.presence.sadd("global-set1", "member-two");
await this.presence.sadd("global-set1", "member-three");
```

### `smembers(key: string)`

返回 key 集合的所有成員.

```typescript
const globalSetMembers = await this.presence.smembers("global-set1");
console.log(globalSetMembers) // => ["member-one", "member-two", "member-three"]
```

### `sismember(key: string, member: string)`

返回成員 `member` 是否為集合 key 的成員.

**返回值**

- `1` member 是 key 的成員.
- `0` key 集合不存在或者 member 不是 key 的成員.

```typescript
const isMember = await this.presence.sismember("global-set1", "member-three");

if (isMember) {
    console.log("member-three IS present on 'global-set1'");

} else {
    console.log("member-three IS NOT present on 'global-set1'");
}
```

### `srem(key: string, value: any)`

刪除存儲在 key 集合中的成員 value.

如果集合裏不存在成員 value 則操作取消.

如果 key 集合不存在, 則創建一個新的集合, 集合成員為空, 該命令返回 0.

```typescript
await this.presence.srem("global-set1", "member-three");
```

### `scard(key: string)`

返回集合 key 的成員數量 (cardinality).

```typescript
const cardinality = await this.presence.scard("global-set1");
console.log(cardinality) // => 2
```

### `sinter(...keys: string[])`

返回由指定集合成員的交集.

```typescript
// 向集合 "global-set1" 添加成員
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-two");

// 向集合 "global-set2" 添加成員
await this.presence.sadd("global-set2", "member-three");
await this.presence.sadd("global-set2", "member-four");

// 獲得交集
const intersection = await this.presence.sinter("global-set1", "global-set2");
console.log(intersection); // => ["member-one", "member-two", "member-three", "member-four"]
```

### `hset(key: string, field: string, value: string)`

將哈希表 key 中的字段 field 賦值為 value.

如果哈希表不存在, 則創建一個新的哈希表, 包含字段 field 及其值 value.

如果字段已經存在於哈希表中, 則覆蓋舊值.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");
```

### `hincrby(key: string, field: string, value: number)`

將哈希表 key 中的字段 field 的值增加 value.

如果哈希表不存在, 則創建一個新的哈希表, 包含字段 field.

如果字段不存在, 則先設置哈希值為 0, 再執行該操作.

```typescript
await this.presence.hset("global-hashmap1", "key1", "2");
const incr = await this.presence.hincrby("global-hashmap1", "key1", "5");
console.log(incr) // => "7"
```

### `hget(key: string, field: string):Promise<string>`

返回哈希表 key 中的字段 field 的值.

```typescript
await this.presence.hset("global-hashmap1", "key", "value");
const value = await this.presence.hget("global-hashmap1", "key");
console.log(value) // => "value"
```

### `hgetall(key: string): Promise<{[field: string]: string}>`

返回哈希表 key 中所有字段及其哈希值.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

const value = await this.presence.hgetall("global-hashmap1");
console.log(value) // => {"key1": "1", "key2": "2"}
```

### `hdel(key: string, field: string)`

刪除哈希表 key 中的指定字段 field.

如果指定字段 field 不存在則操作取消.

如果哈希表 key 不存在, 則設置字段 field 為空哈希值, 該命令返回 0.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// delete "key2" from "global-hashmap1".
await this.presence.hset("global-hashmap1", "key2");
```

### `hlen(key: string):Promise<number>`

返回哈希表 key 中所包含的字段數量.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// 獲取哈希表 "global-hashmap1" 的字段數量.
const length = await this.presence.hlen("global-hashmap1");
console.log(length) // => 2
```
