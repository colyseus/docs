# 內置房間 &raquo; 中繼房間

內置的中繼室 `RelayRoom` 對於簡單的需求很有用: 除了保存與服務器連接的客戶端之外, 您無需在服務器上保存任何 state.

通過簡單的消息轉發 (將消息從一個客戶端轉發給所有其他客戶端) - 服務器端並不進行驗證操作 - 驗證的任務完全交給客戶端.

!!! tip
    [`RelayRoom` 的源代碼](https://github.com/colyseus/colyseus/blob/master/src/rooms/RelayRoom.ts) 非常簡單. 我們建議在您在服務器端加入自己的驗證機製.

## 服務器端

```typescript
import { RelayRoom } from "colyseus";

// 定義中繼房間
gameServer.define("your_relayed_room", RelayRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
});
```

## 客戶端

了解如何為玩家的加入, 離開, 發送和接收中繼室消息註冊回調.

### 連入房間

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

//
// 加入中繼室
//
const relay = await client.joinOrCreate("your_relayed_room", {
  name: "This is my name!"
});
```

### 為玩家的加入和離開註冊回調


```typescript
//
// 監測到玩家加入房間
//
relay.state.players.onAdd = (player, sessionId) => {
  if (relay.sessionId === sessionId) {
    console.log("It's me!", player.name);

  } else {
    console.log("It's an opponent", player.name, sessionId);
  }
}

//
// 監測到玩家離開房間
//
relay.state.players.onRemove = (player, sessionId) => {
  console.log("Opponent left!", player, sessionId);
}

//
// 監測到玩家斷線 / 重連
// (要在服務端設置 `allowReconnection: true` 才有效)
//
relay.state.players.onChange = (player, sessionId) => {
  if (player.connected) {
    console.log("Opponent has reconnected!", player, sessionId);

  } else {
    console.log("Opponent has disconnected!", player, sessionId);
  }
}
```

### 發送接收消息

```typescript
//
// 發送一個消息, 所有其他玩家客戶端就會收到同名消息
// 註意是連入房間的所有其他客戶端, 不包括發送者本身.
//
relay.send("fire", {
  x: 100,
  y: 200
});

//
// 針對某消息註冊回調.
//
relay.onMessage("fire", ([sessionId, message]) => {

  //
  // 發送者的 `sessionId`.
  //
  console.log(sessionId, "sent a message!");

  //
  // 發送者發出的消息內容
  //
  console.log("fire at", message);
});
```
