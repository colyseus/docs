# 服务器 API » 状态

在多处理器和/或机器上扩展服务器时，需要为 {3>Server<3} 提供 {1>{2>Presence<2}<1} 选项。{4>Presence<4} 的作用是允许不同进程之间的通信和数据共享，特别是在匹配期间。

- {1>{2>LocalPresence<2}<1}（默认）
- {1>{2>RedisPresence<2}<1}

{1>presence<1} 实例也可以用于所有 {2>Room<2} 处理程序。可以使用它的 {3>API<3} 保留数据和通过 PUB/SUB 进行房间之间的通信。

### {1>LocalPresence<1}

这是默认选项。在单进程中运行  Colyseus 时，应使用此选项。

### {1>RedisPresence (clientOpts?)<1}

在多进程和/或多机器上运行  Colyseus 时，应使用此选项。

{1>Parameters:<1}

- {1>clientOpts<1}:redis 客户端选项（主机/凭证）。{2>查看完整选项列表<2}。

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

// This happens on the slave processes. const gameServer = new Server({ // ... presence: new RedisPresence() });

gameServer.listen(2567); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require('colyseus');

// This happens on the slave processes. const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() });

gameServer.listen(2567); \`\`\`

## API

{1>Presence<1} API 高度基于 Redis 的API，后者是一个键-值数据库。

每个 {1>{2>Room<2}<1} 实例都有一个 {3>{4>presence<4}<3} 属性，实现以下方法：

### {1}subscribe(topic: string, callback:Function){2}

订阅给定的 {1>topic<1}。每当有关于 {4>topic<4} 的消息{3>发布<3}时，就会触发 {2>callback<2}。

### {1>unsubscribe(topic: string)<1}

取消订阅给定的 {1>topic<1}。

### {1>publish(topic: string, data: any)<1}

发布给定 {1>topic<1} 的消息。

### {1}exists(key: string):Promise<boolean>{2}

如果键值存在，则返回。

### {1>setex(key: string, value: string, seconds: number)<1}

设置键值，以保存字符串值，设置键值，从而在指定秒数后超时。

### {1>get(key: string)<1}

获取键值。

### {1>del(key: string): void<1}

移除特定的键。

### {1>sadd(key: string, value: any)<1}

将特定的成员添加至存储在键值中的集合。忽略已属于此集合的成员的特定成员。如果键值不存在，则创建一个新的集合，然后添加特定成员。

### {1>smembers(key: string)<1}

返回存储在键值中的集合的所有成员。

### {1>sismember(member: string)<1}

如果成员 {1>member<1} 是存储在键值中的集合的成员，则返回。

{1>Return value<1}

- 1>1<1} 如果元素是集合的成员。
- {1>0<1}  如果元素不是集合的成员，或键值不存在。

### {1>srem(key: string, value: any)<1}

移除存储在键值中的集合中的特定成员。忽略不属于此集合的成员的特定成员。如果键值不存在，则视它为空集合，此命令返回 0。

### {1>scard(key: string)<1}

返回存储在键值中的集合的势（元素的数量）。

### {1>sinter(...keys: string\[])<1}

返回由所有给定集合的交集产生的集合成员。

### {1>hset(key: string, field: string, value: string)<1}

将存储在键中的散列中的字段设置为值。如果键值不存在，则创建一个包含哈希值的新键值。如果字段已存在于哈希值中，则将其覆盖。

### {1>hincrby(key: string, field: string, value: number)<1}

按增量递增存储在键值中的哈希字段中的数量。如果键值不存在，则创建一个包含哈希值的新键值。如果字段不存在，则在执行操作之前将值设置为 0。

### {1}hget(key: string, field: string):Promise<string>{2}

返回与存储在键值的哈希值中的字段相关联的值。

### {1}hgetall(key: string):Promise<{\[field: string]: string}>{2}

返回存储在键值的哈希值中的所有字段和值。

### {1>hdel(key: string, field: string)<1}

移除存储在键值中的集合中的特定成员。将忽略在此哈希值中不存在的特定字段。如果键值不存在，则将其视为空哈希值，此命令返回 0。

### {1}hlen(key: string):Promise<number>{2}

返回存储在键值中的哈希值所包含的字段数量

### {1>incr(key: string)<1}

将存储在键值中的数量增加 1。如果键值不存在，则在执行操作前将其设置为 0。如果键值包含错误类型的值或包含不能表示为整数的字符串，则返回错误。此操作仅限于 64 位有符号整数。

### {1>decr(key: string)<1}

将存储在键值中的数量减 1。如果键值不存在，则在执行操作前将其设置为 0。如果键值包含错误类型的值或包含不能表示为整数的字符串，则返回错误。此操作仅限于 64 位有符号整数。
