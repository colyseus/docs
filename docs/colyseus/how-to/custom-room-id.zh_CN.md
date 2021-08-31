您可以覆蓋為新房間設定房間 ID 的方式。

為了確保我們不會意外地兩次使用同一個房間 ID，我們使用了 Presence API，如下所示：

1. 獲取已使用 Presence API 註冊的房間 ID。
2. 生成房間 ID，直到生成尚未使用的房間 ID 為止。
3. 使用 Presence API 註冊新的房間 ID。

此處的第 2 步很可能只需要一次迭代，即使有數百萬個房間，房間 ID 為 4 個字母。以這種方式使用 Presence API 還有一個好處，那就是讓您能夠在多台機器上執行伺服器（透過切換到 [RedisPresence](https://docs.colyseus.io/server/presence/#redispresence-clientopts)）。

請參閱下方代碼：

```typescript const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class MyRoom extends Room<MyRoomState> { // 我們註冊房間 ID 的頻道。 // 這可以是你想要的任何東西，不一定是 `$mylobby`。LOBBY\_CHANNEL = "$mylobby"

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

**警告**：這段代碼中有一個小問題，其中兩個 onCreate 調用可以在其中的任何一個註冊之前隨機生成相同的代碼。這將導致兩個房間具有相同的 ID。然而，這場比賽是極不可能的（有 100 萬個活躍房間和真正的隨機性，可能性仍然是 15 萬億分之一）。
