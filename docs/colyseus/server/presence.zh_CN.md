# 服务器 API &raquo; Presence

在多处理器/机器上扩展服务器时, 需要为 `Server` 提供 [`Presence`](/server/api/#optionspresence) 配置. `Presence` 的作用是实现不同进程之间的通信和数据共享, 特别是用在 match-making 的时候.

- [`LocalPresence`](#localpresence)(默认)
- [`RedisPresence`](#redispresence-clientopts)

`presence` 实例可以在任何 `Room` 中获取. 可以使用它的 [API](#api) 来做数据持久化和进行房间之间的 PUB/SUB 通信.

### `LocalPresence`

这是默认配置. 在单进程中运行 Colyseus 时, 应使用此配置.

### `RedisPresence (clientOpts?)`

在多进程或多机器上运行 Colyseus 时, 应使用此配置.

**参数:**

- `clientOpts`: redis 客户端配置 (主机/凭证). [完整配置详见这里](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52).

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

`Presence` API 高度基于 Redis 的 key-value 数据库的 API.

每个 [`Room`](/server/room) 实例都有一个 [`presence`](/server/room/#presence-presence) 属性:

```typescript
export class MyRoom extends Room {
    onCreate() {
        this.presence // 从这里开始使用 Presence API
    }
}
```

或者, 可以从任何地方导入 [Match-maker API](/colyseus/server/matchmaker/), 然后使用 `matchMaker.presence`, :

```typescript
import { matchMaker } from "colyseus";

matchMaker.presence // 从这里开始使用 Presence API
```

### `subscribe(topic: string, callback:Function)`

订阅指定的 `topic`. 每当有关于 `topic` 的消息 [发布](#publishtopic-string-data-any) 时, 就会触发 `callback`.

```typescript
this.presence.subscribe("global-event", (data) => {
    console.log("received message:", data);
});
```

### `unsubscribe(topic: string)`

取消指定的 `topic` 的订阅.

**示例:** 取消所有关于 "global-event" 订阅的回调.

```typescript
//
this.presence.unsubscribe("global-event");
```

**示例:** 取消某 "topic" 指定的回调.

```typescript
function callback(data) { }
this.presence.subscribe("global-event", callback);

// 取消订阅这个回调
this.presence.unsubscribe("global-event", callback);
```

### `publish(topic: string, data: any)`

向给定 `topic` 发布消息.

```typescript
this.presence.publish("global-event", { any: 1, data: 2, here: "3" });
```

### `setex(key: string, value: string, seconds: number)`

保存 key 的 value 一个指定的时间段 seconds, 超时即删除.

**示例:** 保存 `"global-key"` 全局变量时长 2 分钟.

```typescript
this.presence.setex("global-key", "a string value", 120);
```

### `get(key: string)`

获取指定 key 的值.

```typescript
const globalKeyValue = await this.presence.get("global-key");
```

### `del(key: string): void`

删除指定的 key.

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

如果指定的 key 不存在, 默认从 0 开始累加.

如果指定的 key 的 value 类型错误或者是不能被转换为整数值的字符串, 则返回错误.

该操作对象限制为 64 位有符号整数.

```typescript
await this.presence.incr("global-count");
await this.presence.incr("global-count");
await this.presence.incr("global-count");

// 取得键 "global-count" 的值
const count = await this.presence.get("global-count");
console.log(count) // => 3
```

### `decr(key: string)`

指定 key 的 value 减 1.

如果指定的 key 不存在, 默认从 0 开始累加.

如果指定 key 的 value 类型错误或者是不能被转换为整数值的字符串, 则返回错误.

该操作对象限制为 64 位有符号整数.

```typescript
await this.presence.decr("global-count");
await this.presence.decr("global-count");
await this.presence.decr("global-count");

// 取得键 "global-count" 的值
const count = await this.presence.get("global-count");
console.log(count) // => 33
```

### `sadd(key: string, value: any)`

向 key 集合里保存成员 value.

如果集合里已存在成员 value 则操作取消.

如果 key 集合不存在, 则创建一个新的集合, 集合成员为 value.

```typescript
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-one"); // 忽略, 不会重复添加
await this.presence.sadd("global-set1", "member-two");
await this.presence.sadd("global-set1", "member-three");
```

### `smembers(key: string)`

返回 key 集合的所有成员.

```typescript
const globalSetMembers = await this.presence.smembers("global-set1");
console.log(globalSetMembers) // => ["member-one", "member-two", "member-three"]
```

### `sismember(key: string, member: string)`

返回成员 `member` 是否为集合 key 的成员.

**返回值**

- `1` member 是 key 的成员.
- `0` key 集合不存在或者 member 不是 key 的成员.

```typescript
const isMember = await this.presence.sismember("global-set1", "member-three");

if (isMember) {
    console.log("member-three IS present on 'global-set1'");

} else {
    console.log("member-three IS NOT present on 'global-set1'");
}
```

### `srem(key: string, value: any)`

删除存储在 key 集合中的成员 value.

如果集合里不存在成员 value 则操作取消.

如果 key 集合不存在, 则创建一个新的集合, 集合成员为空, 该命令返回 0.

```typescript
await this.presence.srem("global-set1", "member-three");
```

### `scard(key: string)`

返回集合 key 的成员数量 (cardinality).

```typescript
const cardinality = await this.presence.scard("global-set1");
console.log(cardinality) // => 2
```

### `sinter(...keys: string[])`

返回由指定集合成员的交集.

```typescript
// 向集合 "global-set1" 添加成员
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-two");

// 向集合 "global-set2" 添加成员
await this.presence.sadd("global-set2", "member-three");
await this.presence.sadd("global-set2", "member-four");

// 获得交集
const intersection = await this.presence.sinter("global-set1", "global-set2");
console.log(intersection); // => ["member-one", "member-two", "member-three", "member-four"]
```

### `hset(key: string, field: string, value: string)`

将哈希表 key 中的字段 field 赋值为 value.

如果哈希表不存在, 则创建一个新的哈希表, 包含字段 field 及其值 value.

如果字段已经存在于哈希表中, 则覆盖旧值.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");
```

### `hincrby(key: string, field: string, value: number)`

将哈希表 key 中的字段 field 的值增加 value.

如果哈希表不存在, 则创建一个新的哈希表, 包含字段 field.

如果字段不存在, 则先设置哈希值为 0, 再执行该操作.

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

删除哈希表 key 中的指定字段 field.

如果指定字段 field 不存在则操作取消.

如果哈希表 key 不存在, 则设置字段 field 为空哈希值, 该命令返回 0.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// delete "key2" from "global-hashmap1".
await this.presence.hset("global-hashmap1", "key2");
```

### `hlen(key: string):Promise<number>`

返回哈希表 key 中所包含的字段数量.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// 获取哈希表 "global-hashmap1" 的字段数量.
const length = await this.presence.hlen("global-hashmap1");
console.log(length) // => 2
```
