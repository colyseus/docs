# 服务器 API &raquo; 房间

Room 类的作用是实现游戏会话, 并且/或作为一组客户端之间的通信通道.

- 默认情况下, 在匹配期间 **on demand** 创建房间
- 必须使用 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 发布 Room 类

```typescript fct_label="TypeScript"
import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // When room is initialized
    onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) { }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) { }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

## 房间生命周期事件

- 自动调用房间生命周期事件.
- 每个生命周期事件都支持 [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 选项.

### `onCreate (options)`

在匹配器创建房间之后, 进行一次调用.

**The `options` argument is provided by the client upon room creation:**

```typescript
// Client-side - JavaScript SDK
client.joinOrCreate("my_room", {
  name: "Jake",
  map: "de_dust2"
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "de_dust2"
// }
```

**The server may overwrite options during [`.define()`](/server/api/#define-roomname-string-room-room-options-any) for authortity:**

```typescript fct_label="Definition"
// Server-side
gameServer.define("my_room", MyRoom, {
  map: "cs_assault"
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "cs_assault"
// }
```

在本例中, 在 `onCreate()` 期间, `map` 选项是 `"cs_assault"`, 在 `onJoin()` 期间的选项是 `"de_dust2"`.

---

### `onAuth (client, options, request)`

在 `onJoin()` 之前, 将执行 `onAuth()` 方法. 在客户进入房间时, 可以使用此方法验证身份.

- 如果 `onAuth()` 返回一个 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值, 将调用 `onJoin()`, 并将返回值作为第三个参数.
- 如果 `onAuth()` 返回 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值, 将立即拒绝客户, 导致在客户端调用匹配函数失败.
- 也可以抛出一个 `ServerError`, 以便在客户端处理自定义错误.

如果此方法未被实现,将始终返回  `true`, 从而允许任何客户连接.

!!! Tip "正在获取玩家的 IP 地址"
    可以使用 `request` 变量检索用户的 IP 地址, http 标头和更多信息. 例如:  `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

**Implementations examples**

```typescript fct_label="async / await"
import { Room, ServerError } from "colyseus";

class MyRoom extends Room {
  async onAuth (client, options, request) {
    /**
     * Alternatively, you can use `async` / `await`,
     * which will return a `Promise` under the hood.
     */
    const userData = await validateToken(options.accessToken);
    if (userData) {
        return userData;

    } else {
        throw new ServerError(400, "bad access token");
    }
  }
}
```

```typescript fct_label="Synchronous"
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (client, options, request): boolean {
    /**
     * You can immediatelly return a `boolean` value.
     */
     if (options.password === "secret") {
       return true;

     } else {
       throw new ServerError(400, "bad access token");
     }
  }
}
```

```typescript fct_label="Promises"
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (client, options, request): Promise<any> {
    /**
     * You can return a `Promise`, and perform some asynchronous task to validate the client.
     */
    return new Promise((resolve, reject) => {
      validateToken(options.accessToken, (err, userData) => {
        if (!err) {
          resolve(userData);
        } else {
          reject(new ServerError(400, "bad access token"));
        }
      });
    });
  }
}
```

**Client-side examples**

在客户端, 可以使用来自于您选择的身份验证服务(例如Facebook)的令牌调用匹配方法(`join`, `joinOrCreate` 等):

```javascript fct_label="JavaScript"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}).then((room) => {
  // success

}).catch((err) => {
  // handle error...
  err.code // 400
  err.message // "bad access token"
});
```

```csharp fct_label="C#"
try {
  var room = await client.JoinOrCreate<YourStateClass>("world", new {
    accessToken = yourFacebookAccessToken
  });
  // success

} catch (err) {
  // handle error...
  err.code // 400
  err.message // "bad access token"
}
```

```lua fct_label="Lua"
client:join_or_create("world", {
  accessToken = yourFacebookAccessToken

}, function(err, room)
  if err then
    -- handle error...
    err.code -- 400
    err.message -- "bad access token"
    return
  end

  -- success
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}, YourStateClass, function (err, room) {
  if (err != null) {
    // handle error...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // success
})
```

```cpp fct_label="C++"
client.joinOrCreate("world", {
  { "accessToken", yourFacebookAccessToken }

}, [=](MatchMakeError *err, Room<YourStateClass>* room) {
  if (err != "") {
    // handle error...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // success
});
```

---

### `onJoin (client, options, auth?)`

**Parameters:**

- `客户端` [`客户端实例`](/server/client).
- `options`:  在 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 中指定的合并值, 带有客户 [`client.join()`](/client/client/#join-roomname-string-options-any) 时提供的选项
- `auth`: (可选) 返回的身份验证方法数据 [`onAuth`](#onauth-client-options-request)

在 `requestJoin` 和 `onAuth` 完成后, 客户成功进入房间时调用.

---

### `onLeave (client, consented)`

当客户离开房间时调用. 如果由 [initiated by the client](/client/room/#leave) 发起断开, `consented` 参数将是 `true`, 否则将是 `false`.

可以将此函数定义为 `async`. 参见 [graceful shutdown](/server/graceful-shutdown).

```typescript fct_label="Synchronous"
onLeave(client, consented) {
    if (this.state.players.has(client.sessionId)) {
        this.state.players.delete(client.sessionId);
    }
}
```

```typescript fct_label="Asynchronous"
async onLeave(client, consented) {
    const player = this.state.players.get(client.sessionId);
    await persistUserOnDatabase(player);
}
```

---

### `onDispose ()`

在销毁房间之前调用 `onDispose()` 方法,在发生以下情况时调用:

- 房间里没有客户,而且 `autoDispose` 被设置为 `true`(默认值)
- 可以手动调用 [`.disconnect()`](#disconnect).

可以将 `async onDispose()` 定义为异步方法, 以便在数据库中保留一些数据. 事实上, 在游戏结束后, 很适合使用此方法在数据库中保留玩家的数据.

参见 [graceful shutdown](/server/graceful-shutdown).

---

### 示例房间
此示例演示实现 `onCreate`, `onJoin` 和 `onMessage` 方法的完整房间.

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number")
  x: number = 0.11;

  @type("number")
  y: number = 2.22;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  // Colyseus will invoke when creating the room instance
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

// An abstract player object, demonstrating a potential 2D world position
exports.Player = class Player extends schema.Schema {
    constructor() {
        super();
        this.x = 0.11;
        this.y = 2.22;
    }
}
schema.defineTypes(Player, {
    x: "number",
    y: "number",
});

// Our custom game state, an ArraySchema of type Player only at the moment
exports.State = class State extends schema.Schema {
    constructor() {
        super();
        this.players = new schema.MapSchema();
    }
}
defineTypes(State, {
    players: { map: Player }
});

exports.GameRoom = class GameRoom extends colyseus.Room {
  // Colyseus will invoke when creating the room instance
  onCreate(options) {
    // initialize empty room state
    this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins
  onJoin(client, options) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

---

## 公用方法

房间句柄提供这些方法.

### `onMessage (type, callback)`

注册一个回调, 以处理客户端发送的某种类型的信息.

`type` 参数可以是 `string` 或 `number`

**Callback for specific type of message**

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        console.log(client.sessionId, "sent 'action' message: ", message);
    });
}
```

**Callback for ALL messages**

可以注册单个回调, 以处理所有其它类型的消息.

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        //
        // Triggers when 'action' message is sent.
        //
    });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
}
```

!!! tip "Use `room.send()` from the client-side SDK to send messages"
    Check out [`room.send()`](/client/client/#send-type-message)} section.

---

### `setState (object)`

设置同步房间状态. 参见 [State Synchronization](/state/overview/) 和 [Schema](/state/schema/) 了解更多信息.

!!! Tip
    通常, 可以在 [`onCreate()`](#onCreate-options) 期间调用此方法一次

!!! Warning
    不要调用 `.setState()` 来进行每次房间更新. 每次调用时, 将会重置二叉树路径算法.

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

(可选)设置一个可以更改游戏状态的模拟间隔期. 此模拟间隔期间是您的游戏循环周期. 默认模拟间隔期: 16.6ms (60fps)

```typescript
onCreate () {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
}

update (deltaTime) {
    // implement your physics or world updates here!
    // this is a good place to update the room state
}
```

---

### `setPatchRate (milliseconds)`

设置将补丁状态发送至所有客户端的频率. 默认值为 `50`ms (20fps)

---


### `setPrivate (bool)`

将房间列表设置为私有(或转换为公有, 如果提供 `false`).

在 [`>getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) 方法中未列出私有房间.

---

### `setMetadata (metadata)`

为此房间设置元数据. 每个房间实例都可能附加了元数据 - 附加元数据的唯一目的是在从客户端获取可用房间列表时, 将一个房间与另一个房间区分开来, 通过 `roomId` 连接到房间, 并使用 [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname).

```typescript
// server-side
this.setMetadata({ friendlyFire: true });
```

现在,房间已经有附加的元数据, 举例来说, 客户端可以检查哪个房间有 `friendlyFire`, 并且可以通过其 `roomId` 直接连接到房间:

```javascript
// client-side
client.getAvailableRooms("battle").then(rooms => {
  for (var i=0; i<rooms.length; i++) {
    if (room.metadata && room.metadata.friendlyFire) {
      //
      // join the room with `friendlyFire` by id:
      //
      var room = client.join(room.roomId);
      return;
    }
  }
});
```

!!! Tip
    [See how to call `getAvailableRooms()` in other languages.](/client/client/#getavailablerooms-roomname)

---

### `setSeatReservationTime (seconds)`

设置房间可以等待客户端有效加入的秒数. 应该考虑 [`onAuth()`](#onauth-client-options-request) 需要等待多长时间, 以设置不同的座位预订时间. 默认值为 15 秒.

如果想要全局更改座位预订时间, 可以设置 `COLYSEUS_SEAT_RESERVATION_TIME` 环境变量.

---


### `send (client, message)`

!!! Warning "已弃用"
    `this.send()` 已被弃用. 请使用 [`client.send()` instead](/server/client/#sendtype-message).

---


### `broadcast (type, message, options?)`

向所有连接的客户端发送一条消息.

可用的选项为:

- **`except`**: a [`Client`](/server/client/) 不会发送消息至
- **`afterNextPatch`**: 等待, 直到下一补丁广播消息

#### 广播示例

向所有客户端广播一条消息:

```typescript
onCreate() {
    this.onMessage("action", (client, message) => {
        // broadcast a message to all clients
        this.broadcast("action-taken", "an action has been taken!");
    });
}
```

向所有客户端广播一条消息, 发送者除外:

```typescript
onCreate() {
    this.onMessage("fire", (client, message) => {
        // sends "fire" event to every client, except the one who triggered it.
        this.broadcast("fire", message, { except: client });
    });
}
```

仅在应用状态变更之后, 向所有客户端广播一条消息:

```typescript
onCreate() {
    this.onMessage("destroy", (client, message) => {
        // perform changes in your state!
        this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
}
```

广播一条架构编码消息:

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

// ...
onCreate() {
    this.onMessage("action", (client, message) => {
        const data = new MyMessage();
        data.message = "an action has been taken!";
        this.broadcast(data);
    });
}
```

!!! Tip
    [参见如何在客户端处理这些 onMessage().](/colyseus/client/client/#onmessage)

---

### `lock ()`

锁定房间将会从供新客户连接的房间池中删除房间.

---

### `unlock ()`

解锁房间会将房间返回至可供新客户连接的房间池.

---

### `allowReconnection (client, seconds?)`

允许指定的客户 [`reconnect`](/client/client/#reconnect-roomid-string-sessionid-string) 房间. 必须在 [`onLeave()`](#onleave-client) 方法中使用.

如果提供 **`seconds`**, 将在提供的秒数之后取消重新连接.

**Return type:**

- `allowReconnection()` 返回一个 `Deferred<Client>` 实例.
- `Deferred` 是一个类似于 pormise 的类型
- `Deferred` 类型可以通过调用 `.reject()` 强制拒绝 promise (参见第二个示例)

**示例** 在 20 秒超时后拒绝重新连接.

```typescript
async onLeave (client: Client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // allow disconnected client to reconnect into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    this.state.players.delete(client.sessionId);
  }
}
```


**示例** 使用自定义逻辑拒绝重新连接.

```typescript
async onLeave (client: Client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

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
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    this.state.players.delete(client.sessionId);
  }
}
```

---

### `disconnect ()`

断开所有客户断, 然后销毁房间.

---

### `broadcastPatch ()`

!!! Warning "您可能不需要这样做!"
    框架会自动调用此方法.

此方法会检查是否已经在 `state` 中发生变化(mutation), 并将变化广播给所有已连接的客户端.

如果想要控制何时广播补丁, 可以禁用默认的补丁间隔时间来实现:

```typescript
onCreate() {
    // disable automatic patches
    this.setPatchRate(null);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // only broadcast patches if your custom conditions are met.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
}
```

---

## 公用属性

### `roomId: string`

一个唯一, 自动生成的 8 字符长度的房间 id.

在 `onCreate()` 期间, 可以更换 `this.roomId`.

!!!提示 "使用自定义 `roomId`".
    查阅指南 Check out the guide [How-to » Customize room id](/how-to/custom-room-id/)

---

### `roomName: string`

房间名称作为 [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any) 的第一个参数.

---

### `状态T`

提供给 [`setState()`](#setstate-object) 的状态实例.

---

### `clients:客户端`

已连接的客户端数组.参见 [Web-Socket Client](/server/client).

---

### `maxClients: number`

允许连接进入房间的最大客户端数量. 当房间数量达到此限值时, 将自动锁定. 除非通过 [lock()](#lock) 方法显式锁定, 否则, 将在客户端自动断开房间时立即解锁房间.

---

### `patchRate: number`

将房间状态发送至客户端的频率, 单位为毫秒. 默认值为 `50`ms (20fps)

---

### `autoDispose: boolean`

最近一次客户断开连接后, 自动销毁房间. 默认值是 `true`

---

### `locked: boolean`(只读)

对于以下情况, 此属性将发生改变:

- 允许的客户端数量已经达到 (`maxClients`)
- 可以使用 [`lock()`](#lock) 或 [`unlock()`](#unlock) 手动锁定或解锁房间.

---

### `时钟 ClockTimer`

一个 [`ClockTimer`](https://github.com/gamestdio/timer#api) 实例, 用于 [timing events](/server/timing-events).

---

### Presence `Presence`

`presence` 实例. 查阅 [Presence API](/server/presence) 了解更多详细信息.

---

## 客户端

服务器端的 `client` 实例负责服务器与客户端之间的 **transport** 层. 不应该与 [`Client` from the client-side SDK](/client/client/) 混淆, 因为它们具有完全不同的目的!

可以通过 [`this.clients`](#clients-client), [`Room#onJoin()`](#onjoin-client-options-auth), [`Room#onLeave()`](#onleave-client-consented) 和 [`Room#onMessage()`](#onmessage-type-callback) 操作 `client` 实例.

!!! Note
    这是来自于 [`ws`](https://www.npmjs.com/package/ws) 包的原始 WebSocket 连接. 还有更多的方法可用, 但是不建议用于 Colyseus.

### 属性

#### `sessionId: string`

每个会话的唯一 id.

!!! Note
    在客户端, 可以在 [`room` 实例中找到 `sessionId`](/client/room/#sessionid-string).

---

#### `userData: any`

可用于存储关于客户端连接的自定义数据. `userData` 并不同步于 **not** 客户端, 仅用于保留与其连接相关的用户数据.

```typescript
onJoin(client, options) {
  client.userData = { playerNumber: this.clients.length };
}

onLeave(client)  {
  console.log(client.userData.playerNumber);
}
```

---

#### `auth: any`

[`onAuth()`](/server/room/#onauth-client-options-request) 期间返回的自定义数据.

---

### 方法.

#### `send(type, message)`

发送消息类型至客户端. 消息使用 MsgPack 编码, 仅含有可序列化 JSON 数据结构.

`type` 可以是 `string` 或 `number`.

**Sending a message:**

```typescript
//
// sending message with a string type ("powerup")
//
client.send("powerup", { kind: "ammo" });

//
// sending message with a number type (1)
//
client.send(1, { kind: "ammo"});
```

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

!!! Tip
    [查看如何在客户端处理这些信息.](/colyseus/client/client/#onmessage)

---

#### `leave(code?: number)`

`客户端` 与房间强制断开连接. 您可以在关闭连接时发送一个数值介于 `4000` 和 `4999` 之间的自定义 `code` (见 [WebSocket 关闭代码表](#websocket-close-codes-table))

!!! Tip
    这将在客户端触发 [`room.onLeave`](/client/room/#onleave) 事件.

##### WebSocket 关闭代码表

| Close code (uint16) | Codename               | Internal | Customizable | Description |
|---------------------|------------------------|----------|--------------|-------------|
| `0` - `999`             |                        | Yes      | No           | Unused |
| `1000`                | `CLOSE_NORMAL`         | No       | No           | Successful operation / regular socket shutdown |
| `1001`                | `CLOSE_GOING_AWAY`     | No       | No           | Client is leaving (browser tab closing) |
| `1002`                | `CLOSE_PROTOCOL_ERROR` | Yes      | No           | Endpoint received a malformed frame |
| `1003`                | `CLOSE_UNSUPPORTED`    | Yes      | No           | Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame) |
| `1004`                |                        | Yes      | No           | Reserved |
| `1005`                | `CLOSED_NO_STATUS`     | Yes      | No           | Expected close status, received none |
| `1006`                | `CLOSE_ABNORMAL`       | Yes      | No           | No close code frame has been receieved |
| `1007`                | *Unsupported payload*  | Yes      | No           | Endpoint received inconsistent message (e.g. malformed UTF-8) |
| `1008`                | *Policy violation*     | No       | No           | Generic code used for situations other than 1003 and 1009 |
| `1009`                | `CLOSE_TOO_LARGE`      | No       | No           | Endpoint won't process large frame |
| `1010`                | *Mandatory extension*  | No       | No           | Client wanted an extension which server did not negotiate |
| `1011`                | *Server error*         | No       | No           | Internal server error while operating |
| `1012`                | *Service restart*      | No       | No           | Server/service is restarting |
| `1013`                | *Try again later*      | No       | No           | Temporary server condition forced blocking client's request |
| `1014`                | *Bad gateway*          | No       | No           | Server acting as gateway received an invalid response |
| `1015`                | *TLS handshake fail*   | Yes      | No           | Transport Layer Security handshake failure |
| `1016` - `1999`         |                        | Yes      | No           | Reserved for future use by the WebSocket standard. |
| `2000` - `2999`         |                        | Yes      | Yes          | Reserved for use by WebSocket extensions |
| `3000` - `3999`         |                        | No       | Yes          | 	Available for use by libraries and frameworks. May not be used by applications. Available for registration at the IANA via first-come, first-serve. |
| `4000` - `4999`         |                        | No       | Yes          | **Available for applications** |

---

#### `error(code, message)`

将错误及代码与消息一并发送给客户端. 客户端可以在 [`onError`](/client/room/#onerror) 对其进行处理
