# 內建房間 » 轉送房間

內建 {1>RelayRoom<1} 對於簡易使用的案例相當實用，除了連接其中的用戶端外，你不需要在伺服器端保持任何狀態。

只要透過轉送訊息（將其自用戶端轉寄給其他所有人）－伺服器端無法驗證任何訊息－伺服器端為執行驗證者。

!!! 提示 {1>{2>RelayRoom<2} 的原始程式碼<1} 非常簡單。一般建議是在你看到時，便使用伺服器端驗證來建置你自己的版本。

## 伺服器端

\`\`\`typescript import { RelayRoom } from "colyseus";

// 公開你的轉送房間 gameServer.define("your\_relayed\_room", RelayRoom, { maxClients:4, allowReconnectionTime:120 }); \`\`\`

## 用戶端

查看如何為玩家自轉送房間的加入、離開和接收訊息來登錄回呼。

### 正在連線至房間

\`\`\`typescript import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");

// // 加入轉送房間 // const relay = await client.joinOrCreate("your\_relayed\_room", { name:"This is my name!" }); \`\`\`

### 在玩家加入和離開時登錄回呼


\`\`\`typescript // // 當玩家加入房間時進行偵測 // relay.state.players.onAdd = (player, sessionId) => { if (relay.sessionId === sessionId) { console.log("It's me!", player.name);

  } else { console.log("It's an opponent", player.name, sessionId); } }

// // 當玩家離開房間時進行偵測 // relay.state.players.onRemove = (player, sessionId) => { console.log("Opponent left!", player, sessionId); }

// // 當玩家的連線狀態變更時進行偵測 // （僅在伺服器端提供 {1>allowReconnection: true<1} 時才能使用） // relay.state.players.onChange = (player, sessionId) => { if (player.connected) { console.log("Opponent has reconnected!", player, sessionId);

  } else { console.log("Opponent has disconnected!", player, sessionId); } } \`\`\`

### 傳送接收訊息

\`\`\`typescript // // 透過傳送訊息，其他所有用戶端都將以相同的名稱收到該訊息。
 // 訊息只會傳送到其他連線的用戶端，絕對不會傳送至目前的用戶端 // relay.send("fire", { x:100, y:200 });

// // 對你感興趣的其他用戶端的訊息登錄回呼。 // relay.onMessage("fire", (\[sessionId, message]) => {

  // // 傳送訊息者的 {1>sessionId<1} // console.log(sessionId, "sent a message!");

  // // 其他用戶端傳送的實際訊息 // console.log("fire at", message); }); \`\`\`
