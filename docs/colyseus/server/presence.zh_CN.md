# 服务器 API &raquo; 状态

在多处理器和/或机器上扩展服务器时,需要为 `Server` 提供 [`Presence`](/server/api/#optionspresence) 选项. `Presence` 的作用是允许不同进程之间的通信和数据共享, 特别是在匹配期间.

- [`LocalPresence`](#localpresence)(默认)
- [`RedisPresence`](#redispresence-clientopts)

`presence` 实例也可以用于所有 `Room` 处理程序.可以使用它的 [API](#api) 保留数据和通过 PUB/SUB 进行房间之间的通信.

### `LocalPresence`

这是默认选项.在单进程中运行  Colyseus 时,应使用此选项.

### `RedisPresence (clientOpts?)`

在多进程和/或多机器上运行  Colyseus 时,应使用此选项.

**Parameters:**

- `clientOpts`: redis 客户端选项(主机/凭证).[查看完整选项列表](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52).

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

`Presence` API 高度基于 Redis 的API, 后者是一个键-值数据库.

每个 [`Room`](/server/room) 实例都有一个 [`presence`](/server/room/#presence-presence) 属性, 实现以下方法：

### `subscribe(topic: string, callback:Function)`

订阅给定的 `topic`. 每当有关于 `topic` 的消息[发布](#publishtopic-string-data-any)时, 就会触发 `callback`.

### `unsubscribe(topic: string)`

取消订阅给定的 `topic`.

### `publish(topic: string, data: any)`

发布给定 `topic` 的消息.

### `exists(key: string):Promise<boolean>`

如果键值存在,则返回.

### `setex(key: string, value: string, seconds: number)`

设置键值,以保存字符串值,设置键值,从而在指定秒数后超时.

### `get(key: string)`

获取键值.

### `del(key: string): void`

移除特定的键.

### `sadd(key: string, value: any)`

将特定的成员添加至存储在键值中的集合. 忽略已属于此集合的成员的特定成员. 如果键值不存在, 则创建一个新的集合, 然后添加特定成员.

### {1>smembers(key: string)<1}

返回存储在键值中的集合的所有成员.

### `sismember(member: string)`

如果成员 `member` 是存储在键值中的集合的成员,则返回.

**Return value**

- `1` 如果元素是集合的成员.
- `0`  如果元素不是集合的成员,或键值不存在.

### `srem(key: string, value: any)`

移除存储在键值中的集合中的特定成员.忽略不属于此集合的成员的特定成员.如果键值不存在,则视它为空集合,此命令返回 0.

### `scard(key: string)`

返回存储在键值中的集合的势(元素的数量).

### `sinter(...keys: string[])`

返回由所有给定集合的交集产生的集合成员.

### `hset(key: string, field: string, value: string)`

将存储在键中的散列中的字段设置为值.如果键值不存在,则创建一个包含哈希值的新键值.如果字段已存在于哈希值中,则将其覆盖.

### `hincrby(key: string, field: string, value: number)`

按增量递增存储在键值中的哈希字段中的数量.如果键值不存在,则创建一个包含哈希值的新键值.如果字段不存在,则在执行操作之前将值设置为 0.

### `hget(key: string, field: string):Promise<string>`

返回与存储在键值的哈希值中的字段相关联的值.

### `hgetall(key: string):Promise<{\[field: string]: string}>`

返回存储在键值的哈希值中的所有字段和值.

### `hdel(key: string, field: string)`

移除存储在键值中的集合中的特定成员.将忽略在此哈希值中不存在的特定字段.如果键值不存在,则将其视为空哈希值,此命令返回 0.

### `hlen(key: string):Promise<number>`

返回存储在键值中的哈希值所包含的字段数量

### `incr(key: string)`

将存储在键值中的数量增加 1.如果键值不存在,则在执行操作前将其设置为 0.如果键值包含错误类型的值或包含不能表示为整数的字符串,则返回错误.此操作仅限于 64 位有符号整数.

### `decr(key: string)`

将存储在键值中的数量减 1.如果键值不存在,则在执行操作前将其设置为 0.如果键值包含错误类型的值或包含不能表示为整数的字符串,则返回错误.此操作仅限于 64 位有符号整数.
