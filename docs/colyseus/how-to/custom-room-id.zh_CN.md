您可以重写新房间的 ID 设置方法.

为确保我们不会在无意中搞出俩相同的房间 ID, 我们使用了 Presence API, 方法如下:

1. 用 Presence API 获取已注册的房间 ID.
2. 不断生成房间 ID 直到生成一个未被使用的 ID 为止.
3. 用 Presence API 注册新房间 ID.

即使有数百万个房间, 这里的步骤 2 要生成一个 4 字母长的房间 ID 很可能只需进行一次迭代. 这么使用 Presence API 还有个好处就是支持多机器运行服务器 (切换到使用 [RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts) 即可).

参考如下代码:

```typescript
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> {
    // 注册房间 ID 所使用的频道.
    // 任何字符串都行, 不必须是 `$mylobby`.
    LOBBY_CHANNEL = "$mylobby"

    // 生成 4 字母长的房间 ID.
    generateRoomIdSingle(): string {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        return result;
    }

    // 1. 用 Presence API 获取已注册的房间 ID.
    // 2. 不断生成房间 ID 直到生成一个未被使用的 ID 为止.
    // 3. 用 Presence API 注册新房间 ID.
    async generateRoomId(): Promise<string> {
        const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
        let id;
        do {
            id = this.generateRoomIdSingle();
        } while (currentIds.includes(id));

        await this.presence.sadd(this.LOBBY_CHANNEL, id);
        return id;
    }

    // 把新生成的房间 ID 赋值给 `this.roomId`.
    async onCreate(options: any) {
        this.roomId = await this.generateRoomId();
    }

    // 释放该房间使用的 ID.
    async onDispose(options: any) {
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    }
}
```

**警告**: 这段代码中存在一个小竞争机制, 即同时调用两个 onCreate 时, 有可能在两个房间都没被注册前生成两个一模一样的房间 ID. 这将导致两个不同房间拥有同一个 ID. 然而这种可能性超级小 (即使存在 100 万个活跃的房间而且完全随机, 发生的概率仅为 15 万亿分之 1).
