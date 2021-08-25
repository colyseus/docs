# 內建房間 » 大廳房間

!!!警告「大廳房間的用戶端 API 將在 Colyseus 1.0.0 上更改」內建大廳房間目前依賴於發送訊息來通知用戶端有關可用房間的資訊。當 {1>@filter()<1} 變得穩定時，LobbyRoom 將改為使用該狀態。

## 伺服器端

內建{1>大廳房間<1}會在具有「即時列表」的房間有更新時自動通知其連接的用戶端。

\`\`\`typescript import { LobbyRoom } from "colyseus";

// Expose the "lobby" room. gameServer .define("lobby", LobbyRoom);

// Expose your game room with realtime listing enabled. gameServer .define("your\_game", YourGameRoom) .enableRealtimeListing(); \`\`\`

{1>LobbyRoom<1} 會在 {2>onCreate()<2}、{3>onJoin()<3}、{4>onLeave()<4} 和 {5>onDispose()<5} 期間自動收到通知。

如果你 {1>已更新了房間的 {2>中繼資料<2} <1}，且必須觸發大廳的更新，可以在中繼資料更新完後立即呼叫 {3>updateLobby()<3}：

\`\`\`typescript import { Room, updateLobby } from "colyseus";

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

} \`\`\`

## 用戶端

您必須透過傳送到 {1>LobbyRoom<1} 用戶端的訊息，來追蹤新增、移除和更新的房間。

\`\`\`typescript import { Client, RoomAvailable } from "colyseus.js";

const client = new Client("ws://localhost:2567"); const lobby = await client.joinOrCreate("lobby");

let allRooms:RoomAvailable\[] = \[];

lobby.onMessage("rooms", (rooms) => { allRooms = rooms; });

lobby.onMessage("+", (\[roomId, room]) => { const roomIndex = allRooms.findIndex((room) => room.roomId === roomId); if (roomIndex !== -1) { allRooms\[roomIndex] = room;

  } else { allRooms.push(room); } });

lobby.onMessage("-", (roomId) => { allRooms = allRooms.filter((room) => room.roomId !== roomId); }); \`\`\`