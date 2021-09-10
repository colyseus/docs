# 內建房間 &raquo; 轉送房間

內建 `RelayRoom` 對於簡易使用的案例相當實用,除了連接其中的用戶端外,你不需要在伺服器端保持任何狀態.

只要透過轉送訊息(將其自用戶端轉寄給其他所有人)－伺服器端無法驗證任何訊息－伺服器端為執行驗證者.

!!! tip
    [`RelayRoom` 的原始程式碼](https://github.com/colyseus/colyseus/blob/master/src/rooms/RelayRoom.ts) 非常簡單. 一般建議是在你看到時, 便使用伺服器端驗證來建置你自己的版本.

## 伺服器端

```typescript
import { RelayRoom } from "colyseus";

// Expose your relayed room
gameServer.define("your_relayed_room", RelayRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
});
```

## 用戶端

查看如何為玩家自轉送房間的加入, 離開和接收訊息來登錄回呼.

### 正在連線至房間

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

//
// Join the relayed room
//
const relay = await client.joinOrCreate("your_relayed_room", {
  name: "This is my name!"
});
```

### 在玩家加入和離開時登錄回呼


```typescript
//
// Detect when a player joined the room
//
relay.state.players.onAdd = (player, sessionId) => {
  if (relay.sessionId === sessionId) {
    console.log("It's me!", player.name);

  } else {
    console.log("It's an opponent", player.name, sessionId);
  }
}

//
// Detect when a player leave the room
//
relay.state.players.onRemove = (player, sessionId) => {
  console.log("Opponent left!", player, sessionId);
}

//
// Detect when the connectivity of a player has changed
// (only available if you provided `allowReconnection: true` in the server-side)
//
relay.state.players.onChange = (player, sessionId) => {
  if (player.connected) {
    console.log("Opponent has reconnected!", player, sessionId);

  } else {
    console.log("Opponent has disconnected!", player, sessionId);
  }
}
```

### 傳送接收訊息

```typescript
//
// By sending a message, all other clients will receive it under the same name
// Messages are only sent to other connected clients, never the current one.
//
relay.send("fire", {
  x: 100,
  y: 200
});

//
// Register a callback for messages you're interested in from other clients.
//
relay.onMessage("fire", ([sessionId, message]) => {

  //
  // The `sessionId` from who sent the message
  //
  console.log(sessionId, "sent a message!");

  //
  // The actual message sent by the other client
  //
  console.log("fire at", message);
});
```
