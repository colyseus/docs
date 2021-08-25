# 内置房间 » 大厅房间

!!!警告“在 Colyseus 1.0.0 中，将更改大厅房间客户端 API” 。目前，内置大厅房间依赖于发送消息，向客户端通知有关可用房间的信息。当 {1>@filter()<1} 变得稳定时，LobbyRoom 将改为使用该状态。

## 服务器端

在具有“实时列表”的房间有更新时，内置的 {1>LobbyRoom<1} 会自动通知其连接的客户端。

\`\`\`typescript import { LobbyRoom } from "colyseus";

// Expose the "lobby" room. gameServer .define("lobby", LobbyRoom);

// Expose your game room with realtime listing enabled. gameServer .define("your\_game", YourGameRoom) .enableRealtimeListing(); \`\`\`

在 {2>onCreate()<2}, {3>onJoin()<3}, {4>onLeave()<4} 和 {5>onDispose()<5} 期间，将自动通知 {1>LobbyRoom<1}。

如果您已经{1>更新了您的房间的{2>元数据<2}<1}，并且还需要更新游戏大厅，那么您可以在元数据更新后马上调用 {3>updateLobby()<3}：

\`\`\`typescript import { Client, RoomAvailable } from "colyseus.js";

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

## 客户端

您需要根据{1>LobbyRoom<1}发送到客户端的信息来游戏房间的添加、删除和更新等状态。

\`\`\`typescript import { Client, RoomAvailable } from "colyseus.js";

const client = new Client("ws://localhost:2567"); const lobby = await client.joinOrCreate("lobby");

let allRooms:RoomAvailable\[] = \[];

lobby.onMessage("rooms", (rooms) => { allRooms = rooms; });

lobby.onMessage("+", (\[roomId, room]) => { const roomIndex = allRooms.findIndex((room) => room.roomId === roomId); if (roomIndex !== -1) { allRooms\[roomIndex] = room;

  } else { allRooms.push(room); } });

lobby.onMessage("-", (roomId) => { allRooms = allRooms.filter((room) => room.roomId !== roomId); }); \`\`\`