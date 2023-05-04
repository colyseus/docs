# 内置房间 &raquo; 中继房间

内置的中继室 `RelayRoom` 对于简单的需求很有用: 除了保存与服务器连接的客户端之外, 您无需在服务器上保存任何 state.

通过简单的消息转发 (将消息从一个客户端转发给所有其他客户端) - 服务器端并不进行验证操作 - 验证的任务完全交给客户端.

!!! tip
    [`RelayRoom` 的源代码](https://github.com/colyseus/colyseus/blob/master/src/rooms/RelayRoom.ts) 非常简单. 我们建议在您在服务器端加入自己的验证机制.

## 服务器端

```typescript
import { RelayRoom } from "colyseus";

// 定义中继房间
gameServer.define("your_relayed_room", RelayRoom, {
  maxClients: 4,
  allowReconnectionTime: 120
});
```

## 客户端

了解如何为玩家的加入, 离开, 发送和接收中继室消息注册回调.

### 连入房间

```typescript
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

//
// 加入中继室
//
const relay = await client.joinOrCreate("your_relayed_room", {
  name: "This is my name!"
});
```

### 为玩家的加入和离开注册回调


```typescript
//
// 监测到玩家加入房间
//
relay.state.players.onAdd = (player, sessionId) => {
  if (relay.sessionId === sessionId) {
    console.log("It's me!", player.name);

  } else {
    console.log("It's an opponent", player.name, sessionId);
  }
}

//
// 监测到玩家离开房间
//
relay.state.players.onRemove = (player, sessionId) => {
  console.log("Opponent left!", player, sessionId);
}

//
// 监测到玩家断线 / 重连
// (要在服务端设置 `allowReconnection: true` 才有效)
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
// 发送一个消息, 所有其他玩家客户端就会收到同名消息
// 注意是连入房间的所有其他客户端, 不包括发送者本身.
//
relay.send("fire", {
  x: 100,
  y: 200
});

//
// 针对某消息注册回调.
//
relay.onMessage("fire", ([sessionId, message]) => {

  //
  // 发送者的 `sessionId`.
  //
  console.log(sessionId, "sent a message!");

  //
  // 发送者发出的消息内容
  //
  console.log("fire at", message);
});
```
