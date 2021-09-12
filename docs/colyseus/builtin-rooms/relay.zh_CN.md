# 内置房间 &raquo; 中继室

内置的中继室 `RelayRoom` 对简单的用例很有用: 除了与服务器连接的客户端之外, 您无需在服务器上保存任何状态.

仅需通过简单的消息转发(将消息从一个客户端转发给其他客户端), 客户端即可验证这些消息, 而服务器端则无法进行验证操作.

!!! tip
    [`RelayRoom`的源代码](https://github.com/colyseus/colyseus/blob/master/src/rooms/RelayRoom.ts) 非常简单. 我们一般建议在您认为适当的时候在服务器端的验证下执行自己的版本.

## 服务器端

```typescript
import { RelayRoom } from "colyseus";

// Expose your relayed room
gameServer.define("your_relayed_room", RelayRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
});
```

## 客户端

了解如何为加入, 离开, 发送和接收中继室消息的玩家注册回调.

### 接入房间

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

### 在玩家加入和离开时注册回调


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

### 发送接收消息

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
