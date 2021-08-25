# 内置房间 » 中继室

内置的中继室{1>RelayRoom<1}对简单的用例很有用：除了与服务器连接的客户端之外，您无需在服务器上保存任何状态。

仅需通过简单的消息转发（将消息从一个客户端转发给其他客户端），客户端即可验证这些消息，而服务器端则无法进行验证操作。

！！！提示 {1>{2>RelayRoom<2}的源代码<1}非常简单。我们一般建议在您认为适当的时候在服务器端的验证下执行自己的版本。

## 服务器端

\`\`\`typescript import { RelayRoom } from "colyseus";

// Expose your relayed room gameServer.define("your\_relayed\_room", RelayRoom, { maxClients:4, allowReconnectionTime:120 }); \`\`\`

## 客户端

了解如何为加入、离开、发送和接收中继室消息的玩家注册回调。

### 接入房间

\`\`\`typescript import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

// // 加入中继室 // const relay = await client.joinOrCreate("your\_relayed\_room", { name:"This is my name!" }); \`\`\`

### 在玩家加入和离开时注册回调


\`\`\`typescript // // 玩家加入房间时执行检测 // relay.state.players.onAdd = (player, sessionId) => { if (relay.sessionId === sessionId) { console.log("It's me!", player.name);

  } else { console.log("It's an opponent", player.name, sessionId); } }

// // 玩家离开房间时执行检测 // relay.state.players.onRemove = (player, sessionId) => { console.log("Opponent left!", player, sessionId); }

// // 玩家的连接性发生变化时执行检测 // （）仅当您在服务器端提供了 {1>allowReconnection: true<1} 的前提下才可用） // relay.state.players.onChange = (player, sessionId) => { if (player.connected) { console.log("Opponent has reconnected!", player, sessionId);

  } else { console.log("Opponent has disconnected!", player, sessionId); } } \`\`\`

### 发送接收消息

\`\`\`typescript // // 发送一条消息，其他所有客户端都将接收到同名消息 // 消息只发送给其他已连接的客户端，当前客户端不包括在内。// relay.send("fire", { x:100, y:200 });

// //  为您感兴趣的其他客户端的消息注册回调。 // relay.onMessage("fire", (\[sessionId, message]) => {

  // // 消息发送者的 {1>sessionId<1} // console.log(sessionId, "sent a message!");

  // // 另一个客户端发送的实际消息 // console.log("fire at", message); }); \`\`\`
