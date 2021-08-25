# 服务器 API » 房间

Room 类的作用是实现游戏会话，并且/或作为一组客户端之间的通信通道。

- 默认情况下，在匹配期间  {1>on demand<1} 创建房间
- 必须使用 {1>{2>.define()<2}<1} 发布 Room 类

\`\`\`typescript fct\_label="TypeScript" import http from "http"; import { Room, Client } from "colyseus";

export class MyRoom extends Room { // When room is initialized onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) { }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
} \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room { // When room is initialized onCreate (options) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) { }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
} \`\`\`

## 房间生命周期事件

- 自动调用房间生命周期事件。 
- 每个生命周期事件都支持 {1>{2>async<2}/{3>await<3}<1} 选项。

### {1>onCreate (options)<1}

在匹配器创建房间之后，进行一次调用。 

{1>The {2>options<2} argument is provided by the client upon room creation:<1}

\`\`\`typescript // Client-side - JavaScript SDK client.joinOrCreate("my\_room", { name:"Jake", map: "de\_dust2" })

// onCreate() - options are: // { // name:"Jake", // map: "de\_dust2" // } \`\`\`

{1>The server may overwrite options during {2>{3>.define()<3}<2} for authortity:<1}

\`\`\`typescript fct\_label="Definition" // Server-side gameServer.define("my\_room", MyRoom, { map: "cs\_assault" })

// onCreate() - options are: // { // name:"Jake", // map: "cs\_assault" // } \`\`\`

在本例中，在 `onCreate()` 期间, `map` 选项是 `"cs_assault"` , 在 `onJoin()` 期间是选项是 `"de_dust2"`。

---

### {1>onAuth (client, options, request)<1}

在 {2>onJoin()<2}之前，将执行 {1>onAuth()<1} 方法。在客户进入房间时，可以使用此方法验证身份。

- 如果 {1>onAuth()<1} 返回一个 {2>truthy<2} 值，将调用 {3>onJoin()<3}，并将返回值作为第三个参数。
- 如果 {1>onAuth()<1} 返回 {2>falsy<2} 值，将立即拒绝客户，导致在客户端调用匹配函数失败。
- 也可以抛出一个 {1>ServerError<1}，以便在客户端处理自定义错误。

如果此方法未被实现，将始终返回  {1>true<1}，从而允许任何客户连接。

!!!提示“正在获取玩家的 IP 地址” 可以使用 {1>request<1} 变量检索用户的 IP 地址、http 标头和更多信息。例如： {2>request.headers\['x-forwarded-for'] || request.connection.remoteAddress<2}

{1>Implementations examples<1}

\`\`\`typescript fct\_label="async / await" import { Room, ServerError } from "colyseus";

class MyRoom extends Room { async onAuth (client, options, request) { /\** * Alternatively, you can use {1>async<1} / {2>await<2}, * which will return a {3>Promise<3} under the hood. \*/ const userData = await validateToken(options.accessToken); if (userData) { return userData;

    } else {
        throw new ServerError(400, "bad access token");
    }
  } } \`\`\`

\`\`\`typescript fct\_label="Synchronous" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request): boolean { /\** * You can immediatelly return a {1>boolean<1} value. \*/ if (options.password === "secret") { return true;

     } else {
       throw new ServerError(400, "bad access token");
     }
  } } \`\`\`

\`\`\`typescript fct\_label="Promises" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request):Promise{1} { /\** * You can return a {2>Promise<2}, and perform some asynchronous task to validate the client. \*/ return new Promise((resolve, reject) => { validateToken(options.accessToken, (err, userData) => { if (!err) { resolve(userData); } else { reject(new ServerError(400, "bad access token")); } }); }); } } \`\`\`

{1>Client-side examples<1}

在客户端，可以使用来自于您选择的身份验证服务（例如Facebook）的令牌调用匹配方法({1>join<1}, {2>joinOrCreate<2}等 ）：

\`\`\`javascript fct\_label="JavaScript" client.joinOrCreate("world", { accessToken: yourFacebookAccessToken

}).then((room) => { // success

}).catch((err) => { // handle error... err.code // 400 err.message // "bad access token" }); \`\`\`

\`\`\`csharp fct\_label="C#" try { var room = await client.JoinOrCreate{1}("world", new { accessToken = yourFacebookAccessToken }); // success

} catch (err) { // handle error... err.code // 400 err.message // "bad access token" } \`\`\`

\`\`\`lua fct\_label="Lua" client:join\_or\_create("world", { accessToken = yourFacebookAccessToken

}, function(err, room) if err then -- handle error... err.code -- 400 err.message -- "bad access token" return end

  -- success end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.joinOrCreate("world", { accessToken: yourFacebookAccessToken

}, YourStateClass, function (err, room) { if (err != null) { // handle error... err.code // 400 err.message // "bad access token" return; }

  // success }) \`\`\`

\`\`\`cpp fct\_label="C++" client.joinOrCreate("world", { { "accessToken", yourFacebookAccessToken }

}, \[=\](MatchMakeError {1>err, Room{2}<1} room) { if (err != "") { // handle error... err.code // 400 err.message // "bad access token" return; }

  // success }); \`\`\`

---

### {1>onJoin (client, options, auth?)<1}

{1>Parameters:<1}

- 客户端客户端实例：
- {1>options<1}:  在 {2>Server#define()<2} 中指定的合并值，带有客户 {3>{4>client.join()<4}<3} 时提供的选项
- {2>{3>onAuth<3}<2} 方法返回的身份验证数据 {1>auth<1}：（可选）

在 {1>requestJoin<1} and {2>onAuth<2} 完成后，客户成功进入房间时调用。

---

### {1>onLeave (client, consented)<1}

当客户离开房间时调用。如果由 {1>initiated by the client<1} 发起断开，{2>consented<2} 参数将是 {3>true<3}，否则将是 {4>false<4}。

可以将此函数定义为 {1>async<1}。参见 {1>graceful shutdown<1}。

{1>typescript fct\_label="Synchronous" onLeave(client, consented) { if (this.state.players.has(client.sessionId)) { this.state.players.delete(client.sessionId); } } <1}

{1>typescript fct\_label="Asynchronous" async onLeave(client, consented) { const player = this.state.players.get(client.sessionId); await persistUserOnDatabase(player); } <1}

---

### {1>onDispose ()<1}

在销毁房间之前调用 {1>onDispose()<1} 方法，在发生以下情况时调用：

- 房间里没有客户，而且 {1>autoDispose<1} 被设置为 {2>true<2}（默认值）
- 可以手动调用 {1>{2>.disconnect()<2}<1}。

可以将 {1>async onDispose()<1} 定义为异步方法， 以便在数据库中保留一些数据。事实上，在游戏结束后，很适合使用此方法在数据库中保留玩家的数据。

参见 {1>graceful shutdown<1}。

---

### 示例房间
此示例演示实现 {1>onCreate<1}, {2>onJoin<2} 和 {3>onMessage<3} 方法的完整房间。

\`\`\`typescript fct\_label="TypeScript" import { Room, Client } from "colyseus"; import { Schema, MapSchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position export class Player extends Schema { @type("number") x: number = 0.11;

  @type("number") y: number = 2.22; }

// Our custom game state, an ArraySchema of type Player only at the moment export class State extends Schema { @type({ map:Player }) players = new MapSchema{1}(); } \`\`\`

export class GameRoom extends Room{1} { // Colyseus will invoke when creating the room instance onCreate(options: any) { // initialize empty room state this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins onJoin(client:Client, options: any) { this.state.players.set(client.sessionId, new Player()); } } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require('colyseus'); const schema = require('@colyseus/schema');

// An abstract player object, demonstrating a potential 2D world position exports.Player = class Player extends schema.Schema { constructor() { super(); this.x = 0.11; this.y = 2.22; } } schema.defineTypes(Player, { x: "number", y: "number", });

// Our custom game state, an ArraySchema of type Player only at the moment exports.State = class State extends schema.Schema { constructor() { super(); this.players = new schema.MapSchema(); } } defineTypes(State, { players: { map:Player } });

exports.GameRoom = class GameRoom extends colyseus.Room { // Colyseus will invoke when creating the room instance onCreate(options) { // initialize empty room state this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins onJoin(client, options) { this.state.players.set(client.sessionId, new Player()); } } \`\`\`

---

## 公用方法

房间句柄提供这些方法。

### {1>onMessage (type, callback)<1}

注册一个回调，以处理客户端发送的某种类型的信息。

{1>type<1} 参数可以是 {2>string<2} 或 {3>number<3}

{1>Callback for specific type of message<1}

{1>typescript onCreate () { this.onMessage("action", (client, message) => { console.log(client.sessionId, "sent 'action' message: ", message); }); } <1}

{1>Callback for ALL messages<1}

可以注册单个回调，以处理所有其它类型的消息。

\`\`\`typescript onCreate () { this.onMessage("action", (client, message) => { // // Triggers when 'action' message is sent. // });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
} \`\`\`

!!! tip "Use {1>room.send()<1} from the client-side SDK to send messages" Check out {2>{3>room.send()<3}<2} section.

---

### {1>setState (object)<1}

设置同步房间状态。参见 {1>State Synchronization<1} 和 {2>Schema<2} 了解更多信息。

!!!提示：通常，可以在 {1>{2>onCreate()<2}<1} 期间调用此方法一次

!!!警告：不要调用 {1>.setState()<1} 来进行每次房间更新。每次调用时，将会重置二叉树路径算法。

---

### {1>setSimulationInterval (callback\[, milliseconds=16.6])<1}

(可选)设置一个可以更改游戏状态的模拟间隔期。此模拟间隔期间是您的游戏循环周期。默认模拟间隔期：16.6ms (60fps)

\`\`\`typescript onCreate () { this.setSimulationInterval((deltaTime) => this.update(deltaTime)); }

update (deltaTime) { // implement your physics or world updates here! // this is a good place to update the room state } \`\`\`

---

### {1>setPatchRate (milliseconds)<1}

设置将补丁状态发送至所有客户端的频率。默认值为 {1>50<1}ms (20fps)

---


### {1>setPrivate (bool)<1}

将房间列表设置为私有（或转换为公有，如果提供 {1>false<1}）。

在 {1>{2>getAvailableRooms()<2}<1} 方法中未列出私有房间。

---

### {1>setMetadata (metadata)<1}

为此房间设置元数据。每个房间实例都可能附加了元数据 - 附加元数据的唯一目的是在从客户端获取可用房间列表时，将一个房间与另一个房间区分开来，通过 {1>roomId<1} 连接到房间，并使用 {2>{3>client.getAvailableRooms()<3}<2}。

{1>typescript // server-side this.setMetadata({ friendlyFire: true }); <1}

现在，房间已经有附加的元数据，举例来说，客户端可以检查哪个房间有 {1>friendlyFire<1}，并且可以通过其 {2>roomId<2} 直接连接到房间：

{1>javascript // client-side client.getAvailableRooms("battle").then(rooms => { for (var i=0; i<rooms.length; i++) { if (room.metadata && room.metadata.friendlyFire) { // // join the room with \`friendlyFire\` by id: // var room = client.join(room.roomId); return; } } }); <1}

!!!提示 {1>See how to call {2>getAvailableRooms()<2} in other languages.<1}

---

### {1>setSeatReservationTime (seconds)<1}

设置房间可以等待客户端有效加入的秒数。应该考虑 {1>{2>onAuth()<2}<1} 需要等待多长时间，以设置不同的座位预订时间。默认值为 15 秒。

如果想要全局更改座位预订时间，可以设置 
 {1>COLYSEUS\_SEAT\_RESERVATION\_TIME<1} 环境变量。

---


### {1>send (client, message)<1}

!!!警告 "已弃用" {1>this.send()<1} 已被弃用。请使用 {2>{3>client.send()<3} instead<2}。

---


### {1>broadcast (type, message, options?)<1}

向所有连接的客户端发送一条消息。

可用的选项为：

- {1>{2>except<2}<1}: a {3>{4>Client<4}<3} 不会发送消息至
- {1>{2>afterNextPatch<2}<1}: 等待，直到下一补丁广播消息

#### 广播示例

向所有客户端广播一条消息：

{1>typescript onCreate() { this.onMessage("action", (client, message) => { // broadcast a message to all clients this.broadcast("action-taken", "an action has been taken!"); }); } <1}

向所有客户端广播一条消息，发送者除外：

{1>typescript onCreate() { this.onMessage("fire", (client, message) => { // sends "fire" event to every client, except the one who triggered it. this.broadcast("fire", message, { except: client }); }); } <1}

仅在应用状态变更之后，向所有客户端广播一条消息：

\`\`\`typescript onCreate() { this.onMessage("destroy", (client, message) => { // perform changes in your state! this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
} \`\`\`

广播一条架构编码消息：

\`\`\`typescript class MyMessage extends Schema { @type("string") message: string; }

// ... onCreate() { this.onMessage("action", (client, message) => { const data = new MyMessage(); data.message = "an action has been taken!"; this.broadcast(data); }); } \`\`\`

!!!提示 {1>参见如何在客户端处理这些 onMessage()。<1}

---

### {1>lock ()<1}

锁定房间将会从供新客户连接的房间池中删除房间。

---

### {1>unlock ()<1}

解锁房间会将房间返回至可供新客户连接的房间池。

---

### {1>allowReconnection (client, seconds?)<1}

允许指定的客户 {1>{2>reconnect<2}<1} 房间。必须在 {3>{4>onLeave()<4}<3} 方法中使用。

如果提供 {1>{2>seconds<2}<1}，将在提供的秒数之后取消重新连接。

{1>Return type:<1}

- {1>allowReconnection()<1} 返回一个 {2>Deferred<Client><2} 实例。
- {1>Deferred<1} 是一个类似于 pormise 的类型 
- {1>Deferred<1} 类型可以通过调用{2>.reject()<2}强制拒绝 promise（参见第二个示例）

**示例**在 20 秒超时后拒绝重新连接。

\`\`\`typescript async onLeave (client:Client, consented: boolean) { // flag client as inactive for other users this.state.players\[client.sessionId].connected = false;

  try { if (consented) { throw new Error("consented leave"); }

    // allow disconnected client to reconnect into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  } } \`\`\`


**示例**使用自定义逻辑拒绝重新连接。

\`\`\`typescript async onLeave (client:Client, consented: boolean) { // flag client as inactive for other users this.state.players\[client.sessionId].connected = false;

  try { if (consented) { throw new Error("consented leave"); }

    // get reconnection token
    const reconnection = this.allowReconnection(client);

    //
    // here is the custom logic for rejecting the reconnection.
    // for demonstration purposes of the API, an interval is created
    // rejecting the reconnection if the player has missed 2 rounds,
    // (assuming he's playing a turn-based game)
    //
    // in a real scenario, you would store the `reconnection` in
    // your Player instance, for example, and perform this check during your
    // game loop logic
    //
    const currentRound = this.state.currentRound;
    const interval = setInterval(() => {
      if ((this.state.currentRound - currentRound) > 2) {
        // manually reject the client reconnection
        reconnection.reject();
        clearInterval(interval);
      }
    }, 1000);

    // allow disconnected client to reconnect
    await reconnection;

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  } } \`\`\`

---

### {1>disconnect ()<1}

断开所有客户断，然后销毁房间。

---

### {1>broadcastPatch ()<1}

!!!警告：“您可能不需要这样做！” 框架会自动调用此方法。

此方法会检查是否已经在 {1>state<1} 中发生变化(mutation)，并将变化广播给所有已连接的客户端。

如果想要控制何时广播补丁，可以禁用默认的补丁间隔时间来实现：

\`\`\`typescript onCreate() { // disable automatic patches this.setPatchRate(null);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // only broadcast patches if your custom conditions are met.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
} \`\`\`

---

## 公用属性

### {1>roomId: string<1}

一个唯一、自动生成的 8 字符长度的房间 id。

在 {2>onCreate()<2} 期间，可以更换 {1>this.roomId<1}。 

!!!提示 "使用自定义 {1>roomId<1}"。查阅指南 Check out the guide {2>How-to » Customize room id<2}

---

### {1>roomName: string<1}

房间名称作为 {1>{2>gameServer.define()<2}<1} 的第一个参数。

---

### 状态T{2}

提供给 {1>{2>setState()<2}<1} 的状态实例。

---

### {1}clients:客户端

已连接的客户端数组。参见 {1>Web-Socket Client<1}。

---

### {1>maxClients: number<1}

允许连接进入房间的最大客户端数量。当房间数量达到此限值时，将自动锁定。除非通过 {1>lock()<1} 方法显式锁定，否则，将在客户端自动断开房间时立即解锁房间。

---

### {1>patchRate: number<1}

将房间状态发送至客户端的频率，单位为毫秒。默认值为 {1>50<1}ms (20fps)

---

### {1>autoDispose: boolean<1}

最近一次客户断开连接后，自动销毁房间。默认值是 {1>true<1}

---

### {1>locked: boolean<1}（只读）

对于以下情况，此属性将发生改变：

- 允许的客户端数量已经达到 ({1>maxClients<1})
- 可以使用 {1>{2>lock()<2}<1} 或 {3>{4>unlock()<4}<3} 手动锁定或解锁房间。

---

### 时钟ClockTimer{2}

一个 {1>{2>ClockTimer<2}<1} 实例，用于 {3>timing events<3}。

---

### Presence{2}Presence{2}

{1>presence<1} 实例。查阅 {2>Presence API<2} 了解更多详细信息。

---

## 客户端 

服务器端的 {1>client<1} 实例负责服务器与客户端之间的 {2>transport<2} 层。不应该与 {3>{4>Client<4} from the client-side SDK<3} 混淆，因为它们具有完全不同的目的！

可以通过 {2>{3>this.clients<3}<2}, {4>{5>Room#onJoin()<5}<4}, {6>{7>Room#onLeave()<7}<6} 和 {8>{9>Room#onMessage()<9}<8} 操作 {1>client<1} 实例。

!!!注意：这是来自于 {1>{2>ws<2}<1} 包的原始 WebSocket 连接。还有更多的方法可用，但是不建议用于 Colyseus。

### 属性

#### {1>sessionId: string<1}

每个会话的唯一 id。

!!!注意，在客户端，可以在 {1> {3>room<3} 实例中找到 {2>sessionId<2}<1}

---

#### {1>userData: any<1}

可用于存储关于客户端连接的自定义数据。{1>userData<1} 并不同步于 {2>not<2} 客户端，仅用于保留与其连接相关的用户数据。

\`\`\`typescript onJoin(client, options) { client.userData = { playerNumber: this.clients.length }; }

onLeave(client) { console.log(client.userData.playerNumber); } \`\`\`

---

#### {1>auth: any<1}

{1>{2>onAuth()<2}<1} 期间返回的自定义数据。

---

### 方法。

#### {1>send(type, message)<1}

发送消息类型至客户端。消息使用 MsgPack 编码，仅含有可序列化 JSON 数据结构。

`type` 可以是 `string` 或 `number`。

{1>Sending a message:<1}

\`\`\`typescript // // sending message with a string type ("powerup") // client.send("powerup", { kind: "ammo" });

// // sending message with a number type (1) // client.send(1, { kind: "ammo"}); \`\`\`

<!-- 
**Sending a schema-encoded message:**

Sending schema-encoded messages is particularly useful for statically-typed languages such as C#.

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

const data = new MyMessage();
data.message = "Hello world!";

client.send(data);
```
 -->

!!!提示 {1>查看如何在客户端处理这些信息。<1}

---

#### {1>leave(code?: number)<1}

{1>客户端<1}与房间强制断开连接。您可以在关闭连接时发送一个数值介于 {3>4000<3} 和 {4>4999<4} 之间的自定义{2>代码<2}（见 {5>WebSocket 关闭代码表<5}）

!!!提示：这将在客户端触发 {1>{2>room.onLeave<2}<1} 事件。

##### WebSocket 关闭代码表 

| Close code (uint16) | Codename | Internal | Customizable | Description | |---------------------|------------------------|----------|--------------|-------------| | {1>0<1} - {2>999<2} | | Yes | No | Unused | | {3>1000<3} | {4>CLOSE\_NORMAL<4} | No | No | Successful operation / regular socket shutdown | | {5>1001<5} | {6>CLOSE\_GOING\_AWAY<6} | No | No | Client is leaving (browser tab closing) | | {7>1002<7} | {8>CLOSE\_PROTOCOL\_ERROR<8} | Yes | No | Endpoint received a malformed frame | | {9>1003<9} | {10>CLOSE\_UNSUPPORTED<10} | Yes | No | Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame) | | {11>1004<11} | | Yes | No | Reserved | | {12>1005<12} | {13>CLOSED\_NO\_STATUS<13} | Yes | No | Expected close status, received none | | {14>1006<14} | {15>CLOSE\_ABNORMAL<15} | Yes | No | No close code frame has been receieved | | {16>1007<16} | {17>Unsupported payload<17} | Yes | No | Endpoint received inconsistent message (e.g. malformed UTF-8) | | {18>1008<18} | {19>Policy violation<19} | No | No | Generic code used for situations other than 1003 and 1009 | | {20>1009<20} | {21>CLOSE\_TOO\_LARGE<21} | No | No | Endpoint won't process large frame | | {22>1010<22} | {23>Mandatory extension<23} | No | No | Client wanted an extension which server did not negotiate | | {24>1011<24} | {25>Server error<25} | No | No | Internal server error while operating | | {26>1012<26} | {27>Service restart<27} | No | No | Server/service is restarting | | {28>1013<28} | {29>Try again later<29} | No | No | Temporary server condition forced blocking client's request | | {30>1014<30} | {31>Bad gateway<31} | No | No | Server acting as gateway received an invalid response | | {32>1015<32} | {33>TLS handshake fail<33} | Yes | No | Transport Layer Security handshake failure | | {34>1016<34} - {35>1999<35} | | Yes | No | Reserved for future use by the WebSocket standard. | | {36>2000<36} - {37>2999<37} | | Yes | Yes | Reserved for use by WebSocket extensions | | {38>3000<38} - {39>3999<39} | | No | Yes | Available for use by libraries and frameworks.可能不会被应用程序使用。可通过先到先得的方式在 IANA 注册。| | {40>4000<40} - {41>4999<41} | | No | Yes | {42>可用于应用程序<42} |

---

#### {1>error(code, message)<1}

将错误及代码与消息一并发送给客户端。客户端可以在 {1>{2>onError<2}<1} 对其进行处理