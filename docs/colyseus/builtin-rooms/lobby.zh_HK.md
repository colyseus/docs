# 內置房間 &raquo; 大廳房間

!!! Warning "在 Colyseus 1.0.0 中, 將更改大廳房間客戶端 API"
    目前, 內置大廳房間依賴於發送消息, 向客戶端通知有關可用房間的信息. 當 `@filter()` 變得穩定時, LobbyRoom 將改為使用 state.

## 服務器端

在具有 "實時列表" 的房間有更新時, 內置的 `LobbyRoom` 會自動通知其連接的客戶端.

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

在 `onCreate()`, `onJoin()`, `onLeave()` 和 `onDispose()` 期間,將自動通知 `LobbyRoom`.

如果您已經 [更新了您的房間的`元數據`](/server/room/#setmetadata-metadata), 並且還需要更新遊戲大廳, 那麽您可以在元數據更新後馬上調用 `updateLobby()`:

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

## 客戶端

您需要根據 `LobbyRoom` 發送到客戶端的信息來遊戲房間的添加, 刪除和更新等狀態.

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