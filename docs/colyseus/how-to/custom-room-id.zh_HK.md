您可以重寫新房間的 ID 設置方法.

為確保我們不會在無意中搞出倆相同的房間 ID, 我們使用了 Presence API, 方法如下:

1. 用 Presence API 獲取已註冊的房間 ID.
2. 不斷生成房間 ID 直到生成一個未被使用的 ID 為止.
3. 用 Presence API 註冊新房間 ID.

即使有數百萬個房間, 這裏的步驟 2 要生成一個 4 字母長的房間 ID 很可能只需進行一次叠代. 這麽使用 Presence API 還有個好處就是支持多機器運行服務器 (切換到使用 [RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts) 即可).

參考如下代碼:

```typescript
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> {
    // 註冊房間 ID 所使用的頻道.
    // 任何字符串都行, 不必須是 `$mylobby`.
    LOBBY_CHANNEL = "$mylobby"

    // 生成 4 字母長的房間 ID.
    generateRoomIdSingle(): string {
        let result = '';
        for (var i = 0; i < 4; i++) {
            result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        return result;
    }

    // 1. 用 Presence API 獲取已註冊的房間 ID.
    // 2. 不斷生成房間 ID 直到生成一個未被使用的 ID 為止.
    // 3. 用 Presence API 註冊新房間 ID.
    async generateRoomId(): Promise<string> {
        const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
        let id;
        do {
            id = this.generateRoomIdSingle();
        } while (currentIds.includes(id));

        await this.presence.sadd(this.LOBBY_CHANNEL, id);
        return id;
    }

    // 把新生成的房間 ID 賦值給 `this.roomId`.
    async onCreate(options: any) {
        this.roomId = await this.generateRoomId();
    }

    // 釋放該房間使用的 ID.
    async onDispose(options: any) {
        this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    }
}
```

**警告**: 這段代碼中存在一個小競爭機製, 即同時調用兩個 onCreate 時, 有可能在兩個房間都沒被註冊前生成兩個一模一樣的房間 ID. 這將導致兩個不同房間擁有同一個 ID. 然而這種可能性超級小 (即使存在 100 萬個活躍的房間而且完全隨機, 發生的概率僅為 15 萬億分之 1).
