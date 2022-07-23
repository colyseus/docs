# 內建房間 &raquo; 大廳房間

!!! Warning "大廳房間的用戶端 API 將在 Colyseus 1.0.0 上更改"
    內建大廳房間目前依賴於發送訊息來通知用戶端有關可用房間的資訊. 當 `@filter()` 變得穩定時, LobbyRoom 將改為使用該狀態.

## 伺服器端

內建 `大廳房間` 會在具有(即時列表)的房間有更新時自動通知其連線的用戶端.

```typescript
import { LobbyRoom } from "colyseus";

// Expose the "lobby" room.
gameServer
  .define("lobby", LobbyRoom);

// Expose your game room with realtime listing enabled.
gameServer
  .define("your_game", YourGameRoom)
  .enableRealtimeListing();
```

`LobbyRoom` 會在 `onCreate()`, `onJoin()`, `onLeave()` 和 `onDispose()` 期間自動收到通知.

如果您 [已更新了房間的 `中繼資料` ](/server/room/#setmetadata-metadata), 且必須觸發大廳的更新, 可以在中繼資料更新完後立即呼叫 `updateLobby()`:

```typescript
import { Room, updateLobby } from "colyseus";

class YourGameRoom extends Room {

  onCreate() {

    //
    // This is just a demonstration
    // on how to call `updateLobby` from your Room
    //
    this.clock.setTimeout(() => {

      this.setMetadata({
        customData: "Hello world!"
      }).then(() => updateLobby(this));

    }, 5000);

  }

}
```

## 用戶端

您必須透過傳送到 `LobbyRoom` 用戶端的訊息,來追蹤新增, 移除和更新的房間.

```typescript
import { Client, RoomAvailable } from "colyseus.js";

const client = new Client("ws://localhost:2567");
const lobby = await client.joinOrCreate("lobby");

let allRooms: RoomAvailable[] = [];

lobby.onMessage("rooms", (rooms) => {
  allRooms = rooms;
});

lobby.onMessage("+", ([roomId, room]) => {
  const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    allRooms[roomIndex] = room;

  } else {
    allRooms.push(room);
  }
});

lobby.onMessage("-", (roomId) => {
  allRooms = allRooms.filter((room) => room.roomId !== roomId);
});
```
