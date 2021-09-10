您可以重写新房间的房间 ID 设置方式.

为确保我们不会在无意中重复使用相同的房间 ID,我们用 Presence API,操作如下：

1. 用 Presence API 获取已注册的房间 ID.
2. 生成房间 ID(直到生成一个未被占用的 ID 为止).
3. 用 Presence API 注册新房间 ID.

步骤 2 即使有数百万个房间,这里也很可能只需要使用 4 个字母长度的房间 ID 进行一次迭代.以该方式使用 Presence API 还能让您在多台机器上运行您的服务器(通过切换到[RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts)).

参见下方代码：

```typescript const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> { // The channel where we register the room IDs. // This can be anything you want, it doesn't have to be `$mylobby`.LOBBY\_CHANNEL = "$mylobby"

    // Generate a single 4 capital letter room ID.
    generateRoomIdSingle(): string {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        return result;
    }

    // 1. Get room IDs already registered with the Presence API.
    // 2. Generate room IDs until you generate one that is not already used.
    // 3. Register the new room ID with the Presence API.
    async generateRoomId(): Promise<string> {
        const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
        let id;
        do {
            id = this.generateRoomIdSingle();
        } while (currentIds.includes(id));

        await this.presence.sadd(this.LOBBY_CHANNEL, this.roomId);
        return id;
    }

    // Set `this.roomId` to the newly generated and registered room ID.
    async onCreate(options: any) {
        this.roomId = await this.generateRoomId();
    }

    // Free up the roomId that this room used.
    async onDispose(options: any) {
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    }
} ```

**警告**：这段代码中存在一个小竞争机制,即调用两个 onCreate 时,其中任一个调用注册前会随机生成相同的代码.这将导致两个不同房间拥有同一个 ID.然而这种竞争是完全不可能发生的(即使有 100 万个活跃的房间且存在随机性,发生的概率仍为 15 万亿分之一).
