# 服务器 API &raquo; 房间

Room 类的作用是实现游戏会话, 也可作为一组客户端之间的交流通道.

- 默认情况下系统在做房间匹配时, 房间根据客户端请求 **随求随建**.
- Room 类必须使用 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 公开定义.

```typescript fct_label="TypeScript"
import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // 房间初始化时
    onCreate (options: any) { }

    // 在 WebSocket 握手完成前, 客户端基于其提供的 options 进行验证
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // 当客户端成功加入房间时
    onJoin (client: Client, options: any, auth: any) { }

    // 当客户端离开房间时
    onLeave (client: Client, consented: boolean) { }

    // 析构函数, 当房间里没有客户端时被调用. (参考 `autoDispose`)
    onDispose () { }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // 房间初始化时
    onCreate (options) { }

    // 在 WebSocket 握手完成前, 客户端基于其提供的 options 进行验证
    onAuth (client, options, request) { }

    // 当客户端成功加入房间时
    onJoin (client, options, auth) { }

    // 当客户端离开房间时
    onLeave (client, consented) { }

    // 析构函数, 当房间里没有客户端时被调用. (参考 `autoDispose`)
    onDispose () { }
}
```

## 房间生命周期事件

- 房间生命周期函数会自动被调用.
- 生命周期事件都可支持 [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

### `onCreate (options)`

房间由 matchmaker 创建后, 调用一次.

**`options` 参数在房间创建时由客户端提供:**

```typescript
// 客户端 - JavaScript SDK
client.joinOrCreate("my_room", {
  name: "Jake",
  map: "de_dust2"
})

// onCreate() - options 为:
// {
//   name: "Jake",
//   map: "de_dust2"
// }
```

**服务器的 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 时设置的 options 可以被覆盖以便进行用户认证等操作:**

```typescript fct_label="Definition"
// 服务器端
gameServer.define("my_room", MyRoom, {
  map: "cs_assault"
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "cs_assault"
// }
```

上例中, 在 `onCreate()` 时, options 的 `map` 为 `"cs_assault"`, 但是在 `onJoin()` 时变成了 `"de_dust2"`.

---

### `onAuth (client, options, request)`

在 `onJoin()` 之前, 将执行 `onAuth()` 方法. 在客户进入房间时, 可以使用此方法验证身份.

- 如果 `onAuth()` 返回一个 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值, 将调用 `onJoin()`, 并将返回值作为第三个参数.
- 如果 `onAuth()` 返回 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值, 将立即拒绝客户端登入, 并客户端报告匹配失败.
- 也可以抛出一个 `ServerError`, 以便在客户端进行处理.

如果没有实现 onAuth 方法, 则默认返回 `true`, 从而允许任何客户连接.

!!! Tip "获取玩家的 IP 地址"
    可以利用 `request` 变量取得用户的 IP 地址, http 标头和更多信息. 例如:  `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

**举例**

```typescript fct_label="async / await"
import { Room, ServerError } from "colyseus";

class MyRoom extends Room {
  async onAuth (client, options, request) {
    /**
     * 可以使用 `async` / `await`,
     * 异步底层基于 `Promise`.
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
     * 也可以立即返回 `boolean` 值.
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
     * 还可以返回一个 `Promise`, 然后利用它来异步地验证用户合法性.
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

**客户端举例**

在客户端, 可以在 matchmaking 函数 (`join`, `joinOrCreate` 等函数) 中使用自定义的身份验证服务 (例如 Facebook):

```javascript fct_label="JavaScript"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}).then((room) => {
  // 成功

}).catch((err) => {
  // 处理报错...
  err.code // 400
  err.message // "bad access token"
});
```

```csharp fct_label="C#"
try {
  var room = await client.JoinOrCreate<YourStateClass>("world", new {
    accessToken = yourFacebookAccessToken
  });
  // 成功

} catch (err) {
  // 处理报错...
  err.code // 400
  err.message // "bad access token"
}
```

```lua fct_label="Lua"
client:join_or_create("world", {
  accessToken = yourFacebookAccessToken

}, function(err, room)
  if err then
    -- 处理报错...
    err.code -- 400
    err.message -- "bad access token"
    return
  end

  -- 成功
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}, YourStateClass, function (err, room) {
  if (err != null) {
    // 处理报错...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // 成功
})
```

```cpp fct_label="C++"
client.joinOrCreate("world", {
  { "accessToken", yourFacebookAccessToken }

}, [=](MatchMakeError *err, Room<YourStateClass>* room) {
  if (err != "") {
    // 处理报错...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // 成功
});
```

---

### `onJoin (client, options, auth?)`

**参数:**

- `client`: [`client`](/server/client) 实例.
- `options`:  把 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 中指定的值, 与客户端 [`client.join()`](/client/client/#join-roomname-string-options-any) 时提供的选项值进行合并.
- `auth`: (可选) 由 [`onAuth`](#onauth-client-options-request) 返回的身份验证数据

在 `requestJoin` 和 `onAuth` 完成后, 客户端成功进入房间时调用.

---

### `onLeave (client, consented)`

当客户端离开房间时会调用此函数. 如果是由 [客户端主动离开](/client/client/#leave-consented-boolean), 则 `consented` 参数是 `true`, 否则是 `false`.

可以将此函数定义为 `async`. 参见 [优雅关闭](/server/graceful-shutdown).

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

在销毁房间之前会调用 `onDispose()` 方法, 条件可以是:

- 房间里没有客户端, 而且 `autoDispose` 被设置为 `true`(默认值)
- 手动调用了 [`.disconnect()`](#disconnect).

可以写成 `async onDispose()` 将它定义为异步方法, 以便在数据库中保留一些数据. 事实上此方法很适合在游戏结束时把玩家数据存进数据库里.

参见 [优雅关闭](/server/graceful-shutdown).

---

### 房间示例
此示例演示了房间 `onCreate`, `onJoin` 和 `onMessage` 的用法.

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

// 一个抽象玩家对象, 表达其在2D世界的位置
export class Player extends Schema {
  @type("number")
  x: number = 0.11;

  @type("number")
  y: number = 2.22;
}

// 自定义游戏状态, 当前只有以 Player 为元素的一个 ArraySchema
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  // 在 room 实例化时 Colyseus 会自动调用此函数
  onCreate(options: any) {
    // 初始化房间状态
    this.setState(new State());

    // 房间接到 "move" 消息时调用
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // 客户端进入房间时自动调用此函数
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

// 一个抽象玩家对象, 表达其在2D世界的位置
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

// 自定义游戏状态, 当前只有以 Player 为元素的一个 ArraySchema
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
  // 在 room 实例化时 Colyseus 会自动调用此函数
  onCreate(options) {
    // 初始化房间状态
    this.setState(new State());

    // 房间接到 "move" 消息时调用
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // 客户端进入房间时自动调用此函数
  onJoin(client, options) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

---

### `onBeforePatch ()`

按照补丁频率, 每次在 state 同步之前都会触发 `onBeforePatch` 生命周期函数. (参见 [setPatchRate()](#setpatchrate-milliseconds))

```typescript
onBeforePatch() {
    //
    // 这里可以对 state 做出某些处理,
    // 然后 state 就会被序列化并传送给所有客户端
    //
}
```

---

## 公开方法

房间公开了以下方法.

### `onMessage (type, callback)`

注册一个回调, 以处理客户端发送的各类型的消息.

`type` 参数可以是 `string` 或 `number` 类型

**某一类型消息回调**

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        console.log(client.sessionId, "sent 'action' message: ", message);
    });
}
```

**通用类型消息回调**

可以注册一个通用回调以处理所有类型的消息.

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        //
        // 当收到 'action' 消息时触发回调.
        //
    });

    this.onMessage("*", (client, type, message) => {
        //
        // 当收到其他各种消息时触发回调,
        // 不包括 "action", 因为已经提前对该类型消息进行了注册.
        //
        console.log(client.sessionId, "sent", type, message);
    });
}
```

!!! tip "客户端通过使用 `room.send()` 来发送消息"
    详见 [`room.send()`](/client/client/#send-type-message)} 章节.

---

### `setState (object)`

设置房间同步状态. 参见 [State Synchronization](/state/overview/) 和 [Schema](/state/schema/) 以了解更多信息.

!!! Tip
    设置同步状态通常只需在 [`onCreate()`](#onCreate-options) 时调用一次即可

!!! Warning
    房间状态更新时不需要调用 `.setState()`. 因为每次调用都会重置二叉树路径算法.

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

(可选) 设置一个可以更改游戏状态的模拟时间间隔. 代表游戏更新循环. 默认模拟间隔: 16.6ms (60fps)

```typescript
onCreate () {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
}

update (deltaTime) {
    // 此处实现游戏物理或者视觉更新!
    // 同时也是房间状态更新的地方
}
```

---

### `setPatchRate (milliseconds)`

设置 state 补丁发送给所有客户端的频率. 默认值为 `50`ms (20fps)

---


### `setPrivate (bool)`

将该房间设置为私人房间(参数传入 `false` 则表示设置为公共房间).

私人房间不会出现在 [`>getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) 方法返回的房间列表中.

---

### `setMetadata (metadata)`

设置该房间的元数据. 每个房间实例都可附加元数据 - 附加元数据的唯一目的在于客户端使用 [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname) 获取房间和通过 `roomId` 连接房间时能区分同名但不同属性的房间.

```typescript
// 服务端
this.setMetadata({ friendlyFire: true });
```

此时房间已经附加了元数据, 举例来说, 客户端可以检查哪个房间有 `friendlyFire`, 然后通过其 `roomId` 连接到想要进入的房间:

```javascript
// 客户端
client.getAvailableRooms("battle").then(rooms => {
  for (var i=0; i<rooms.length; i++) {
    if (room.metadata?.friendlyFire) {
      //
      // 查找具有 `friendlyFire` 元数据的房间 id:
      //
      var room = client.join(room.roomId);
      return;
    }
  }
});
```

!!! Tip
    [其他语言客户端的 `getAvailableRooms()` 参见这里.](/client/client/#getavailablerooms-roomname)

---

### `setSeatReservationTime (seconds)`

设置该房间等待客户端加入的秒数. 应该考虑 [`onAuth()`](#onauth-client-options-request) 需要等待多长时间, 以设置不同的座位预订时间. 默认值为 15 秒.

如果想要全局设置房间等待时间, 可以设置 `COLYSEUS_SEAT_RESERVATION_TIME` 环境变量.

---


### `send (client, message)`

!!! Warning "已弃用"
    `this.send()` 已被弃用. 请使用 [`client.send()`](/server/client/#sendtype-message) 代替.

---


### `broadcast (type, message, options?)`

向已连接的所有客户端发送一条消息广播.

options 参数可以包含:

- **`except`**: 排除发送消息至这些 [`Client`](/server/client/)
- **`afterNextPatch`**: 等到下一个状态补丁再发送广播消息

#### 广播示例

向所有客户端广播一条消息:

```typescript
onCreate() {
    this.onMessage("action", (client, message) => {
        // 广播至所有客户端
        this.broadcast("action-taken", "an action has been taken!");
    });
}
```

向所有客户端广播一条消息, 发送者除外:

```typescript
onCreate() {
    this.onMessage("fire", (client, message) => {
        // 发送 "fire" 事件到所有客户端, 除了发送者自己.
        this.broadcast("fire", message, { except: client });
    });
}
```

在应用状态变更之后, 向所有客户端广播一条消息:

```typescript
onCreate() {
    this.onMessage("destroy", (client, message) => {
        // 改变 state
        this.state.destroySomething();

        // 此消息会在 state 改变应用之后再到达客户端
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
}
```

广播一条 schema 消息:

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
    [关于客户端如何使用 onMessage() 处理消息, 请参考这里.](/client/client/#onmessage)

---

### `lock ()`

锁定房间会从供新客户端连接的房间池中移除该房间.

---

### `unlock ()`

解锁房会将房间重新添加至供新客户连接的房间池中.

---

### `allowReconnection (client, seconds)`

允许指定的客户 [`reconnect`](/client/#reconnect-reconnectiontoken) 房间. 必须在 [`onLeave()`](#onleave-client) 方法中使用.

- **`client`**: 掉线的 [`Client`](/server/client/) 实例
- **`seconds`**: 等待客户端实施 [`.reconnect()`](/client/#reconnect-roomid-string-sessionid-string) 的秒数, 或者传入参数值 `"manual"`, 来实现手动拒绝重连 (见下面第二个示例)

**返回类型:**

- `allowReconnection()` 返回一个 `Deferred<Client>` 实例.
- `Deferred` 是一个类似于 pormise 的类型
- `Deferred` 类型可以通过调用 `.reject()` 强制拒绝 promise (参见第二个示例)

**示例** 在 20 秒超时后拒绝重新连接.

```typescript
async onLeave (client: Client, consented: boolean) {
  // 标注客户端离线
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // 允许离线客户端在 20 秒内重新连接
    await this.allowReconnection(client, 20);

    // 客户端回连, 标注其已连接.
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 秒超时. 移除离线客户端.
    this.state.players.delete(client.sessionId);
  }
}
```


**示例** 使用自定义逻辑手动拒绝重连.

```typescript
async onLeave (client: Client, consented: boolean) {
  // 标注客户端离线
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    //
    // 获取重连令牌
    // 注意: 这里不要使用 `await`
    //
    const reconnection = this.allowReconnection(client, "manual");

    //
    // 这里展示了自定义逻辑拒绝重连
    // 的 API 用法, 如果用户 2 轮失败
    // 则设置超时禁止重连,
    // (假设游戏是回合制的)
    //
    // 实际操作中, 应该把 `reconnection` 保存在
    // 你的 Player 实例中, 然后在自定义逻辑中
    // 进行检测
    //
    const currentRound = this.state.currentRound;
    const interval = setInterval(() => {
      if ((this.state.currentRound - currentRound) > 2) {
        // 手动禁止客户端重连
        reconnection.reject();
        clearInterval(interval);
      }
    }, 1000);

    // 允许离线重连
    await reconnection;

    // 客户端回连, 标注其已连接.
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 秒超时. 移除离线客户端.
    this.state.players.delete(client.sessionId);
  }
}
```

---

### `disconnect ()`

断开所有客户断, 然后销毁房间.

---

### `broadcastPatch ()`

!!! Warning "一般不需要这样做!"
    框架系统会自动调用此方法.

此方法会检查 `state` 是否发生变化, 并将变化广播给所有已连接的客户端.

如果想要控制何时广播补丁, 可以禁用默认补丁间隔时间来实现:

```typescript
onCreate() {
    // 关闭自动补丁广播
    this.setPatchRate(null);

    // 确保计时有效
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // 达到自定义条件, 广播补丁.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
}
```

---

## 公开属性

### `roomId: string`

自动生成的 9 字符长的唯一房间 id.

在 `onCreate()` 期间, 可以修改 `this.roomId`.

!!! Tip "使用自定义 `roomId` "
    请参考 [How-to &raquo; Customize room id](/community/custom-room-id/)

---

### `roomName: string`

房间名称会作为 [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any) 的第一个参数.

---

### `state: T`

提供给 [`setState()`](#setstate-object) 的状态实例.

---

### `clients: Client[]`

已连接客户端的数组. 参见 [Client instance](#client).

---

### `maxClients: number`

允许连接进入房间的最大客户端数量.
当数量达到此限制时, 房间将自动锁定.
房间除非通过 [lock()](#lock) 方法手动锁定,
否则都会在客户端断开房间时立即解锁.

---

### `patchRate: number`

将房间状态发送至客户端的频率, 单位为毫秒. 默认值为 `50` ms (20fps)

---

### `autoDispose: boolean`

最后一个客户端断开连接后, 自动销毁房间. 默认值是 `true`

---

### `locked: boolean` (只读)

以下情况会影响此属性:

- 允许的客户端数量已经达到 (`maxClients`)
- 用 [`lock()`](#lock) 或 [`unlock()`](#unlock) 手动锁定或解锁房间.

---

### `clock: ClockTimer`

一个 [`ClockTimer`](https://github.com/gamestdio/timer#api) 实例,
用于 [timing events](/server/timing-events).

---

### Presence `Presence`

`presence` 实例. 查阅 [Presence API](/server/presence) 了解更多详细信息.

---

## 客户端

服务器端的 `client` 实例负责服务器与客户端之间的 **transport** 层. 不应该与 [客户端 SDK 里的 `Client`](/client/client/) 相混淆, 因为它们的意义完全不同!

可以通过 [`this.clients`](#clients-client), 在 [`Room#onJoin()`](#onjoin-client-options-auth), [`Room#onLeave()`](#onleave-client-consented) 和 [`Room#onMessage()`](#onmessage-type-callback) 中操作 `client` 实例.

!!! Note
    这是来自 [`ws`](https://www.npmjs.com/package/ws) 包的原始 WebSocket 连接. 还有更多的方法可用, 但是不建议用于 Colyseus.

### 属性

#### `sessionId: string`

每个会话的唯一 id.

!!! Note
    在客户端, 可以在 [`room` 实例中找到 `sessionId`](/client/room/#sessionid-string).

---

#### `userData: any`

可用于存储关于客户端连接的自定义数据. `userData` **不会** 与客户端同步, 仅用于保存指定用户的连接.

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

### 方法

#### `send(type, message)`

发送某类型消息至客户端. 消息使用 MsgPack 编码, 可用于任何可序列化的 JSON 数据结构.

`type` 可以是 `string` 或 `number`.

**发送消息:**

```typescript
//
// 发送字符串类型消息 ("powerup")
//
client.send("powerup", { kind: "ammo" });

//
// 发送数字类型消息 (1)
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
    [查看如何在客户端处理这些信息.](/client/#onmessage)

---

#### `sendBytes(type, bytes)`

向客户端发送字节数组.

参数 `type` 可以是一个 `string` 或者是一个 `number`.

当需要使用自定义编码, 而不使用默认编码器 (MsgPack) 时会很有用.

**发送消息:**

```typescript
//
// 发送字符串类型 ("powerup") 消息
//
client.sendBytes("powerup", [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);

//
// 发送数字类型 (1) 消息
//
client.sendBytes(1, [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);
```

---

#### `leave(code?: number)`

把 `client` 与房间强行断开. 您可以在关闭连接时发送一个介于 `4000` 和 `4999` 之间的自定义 `code` (参见 [WebSocket 断线状态代码表](#websocket-close-codes-table))

!!! Tip
    这将在客户端触发 [`room.onLeave`](/client/room/#onleave) 事件.

##### WebSocket 断线状态代码表

| 断线代码 (uint16) | 代码名称               | 内部使用 | 可自定义 | 说明 |
|---------------------|------------------------|----------|--------------|-------------|
| `0` - `999`             |                        | Yes      | No           | 未使用 |
| `1000`                | `CLOSE_NORMAL`         | No       | No           | 成功断开 / 套接字断开 |
| `1001`                | `CLOSE_GOING_AWAY`     | No       | No           | 客户端离开 (浏览器页面关闭) |
| `1002`                | `CLOSE_PROTOCOL_ERROR` | Yes      | No           | 入口接到错误帧 |
| `1003`                | `CLOSE_UNSUPPORTED`    | Yes      | No           | 入口接到不支持帧 (例如二进制入口接到文本帧) |
| `1004`                |                        | Yes      | No           | 保留 |
| `1005`                | `CLOSED_NO_STATUS`     | Yes      | No           | 未收到状态代码的断开 |
| `1006`                | `CLOSE_ABNORMAL`       | Yes      | No           | 收到无断开代码的帧 |
| `1007`                | *Unsupported payload*  | Yes      | No           | 入口接到错误消息 (例如非法 UTF-8) |
| `1008`                | *Policy violation*     | No       | No           | 1003 与 1009 之外的一般状态代码|
| `1009`                | `CLOSE_TOO_LARGE`      | No       | No           | 入口接到无法处理的大数据帧 |
| `1010`                | *Mandatory extension*  | No       | No           | 客户端发送了未协商的扩展数据 |
| `1011`                | *Server error*         | No       | No           | 运行中的服务器内部错误 |
| `1012`                | *Service restart*      | No       | No           | 服务器/服务正在重启 |
| `1013`                | *Try again later*      | No       | No           | 服务器临时状况导致客户端请求受阻 |
| `1014`                | *Bad gateway*          | No       | No           | 用于网关的服务器收到非法响应 |
| `1015`                | *TLS handshake fail*   | Yes      | No           | 传输层安全相关错误 |
| `1016` - `1999`         |                        | Yes      | No           | 为未来的 WebSocket 标准保留. |
| `2000` - `2999`         |                        | Yes      | Yes          | 为 WebSocket 扩展数据保留 |
| `3000` - `3999`         |                        | No       | Yes          | 用于支持其他库或框架使用. 服务器可能不会用到. 可以通过 IANA 先到先得途径注册. |
| `4000` - `4999`         |                        | No       | Yes          | **用于应用服务器** |

---

#### `error(code, message)`

将错误代码与消息一并发送给客户端. 客户端可以在 [`onError`](/client/room/#onerror) 中对其进行处理.
