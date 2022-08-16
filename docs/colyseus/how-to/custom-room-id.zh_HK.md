您可以重寫新房間的房間 ID 設置方式.

為確保我們不會在無意中重復使用相同的房間 ID, 我們用 Presence API, 操作如下:

1. 用 Presence API 獲取已註冊的房間 ID.
2. 生成房間 ID (直到生成一個未被占用的 ID 為止).
3. 用 Presence API 註冊新房間 ID.

步驟 2 即使有數百萬個房間, 這裏也很可能只需要使用 4 個字母長度的房間 ID 進行一次叠代.以該方式使用 Presence API 還能讓您在多臺機器上執行您的伺服器(通過切換到 [RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts)).

參見下方代碼:

```typescript
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> {
    // The channel where we register the room IDs.
    // This can be anything you want, it doesn't have to be `$mylobby`.
    LOBBY_CHANNEL = "$mylobby"

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

        await this.presence.sadd(this.LOBBY_CHANNEL, id);
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
}
```

**警告**: 這段代碼中存在一個小競爭機製, 即調用兩個 onCreate 時, 其中任一個調用註冊前會隨機生成相同的代碼. 這將導致兩個不同房間擁有同一個 ID. 然而這種競爭是完全不可能發生的(即使有 100 萬個活躍的房間且存在隨機性, 發生的概率仍為 15 萬億分之一).
