# 伺服器 API &raquo; 房間

Room 類的作用是實現遊戲會話, 並且/或作為一組客戶端之間的通信通道.

- 預設情況下,在匹配期間 **on demand** 創建房間
- 必須使用 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 發布 Room 類

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

## 房間生命周期事件

- 自動調用房間生命周期事件.
- 每個生命周期事件都支持 [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 選項.

### `onCreate (options)`

在匹配器創建房間之後, 進行一次調用.

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

在本例中, 在 `onCreate()` 期間, `map` 選項是 `"cs_assault"` ,在 `onJoin()` 期間的選項是 `"de_dust2"`.

---

### `onAuth (client, options, request)`

在 `onJoin()` 之前, 將執行 `onAuth()` 方法. 在客戶進入房間時, 可以使用此方法驗證身份.

- 如果 `onAuth()` 返回一個 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值, 將調用 `onJoin()`, 並將返回值作為第三個參數.
- 如果 `onAuth()` 返回 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值, 將立即拒絕客戶, 導致在客戶端調用匹配函數失敗.
- 也可以拋出一個 `ServerError`, 以便在客戶端處理自定義錯誤.

如果此方法未被實現, 將始終返回 `true`, 從而允許任何客戶連線.

!!! Tip "正在獲取玩家的 IP 地址"
    可以使用 `request` 變數檢索用戶的 IP 地址, http 標頭和更多資訊. 例如: `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

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

在客戶端, 可以使用來自於您選擇的身份驗證服務(例如Facebook)的令牌調用匹配方法(`join`, `joinOrCreate` 等):

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

- `客戶端` [`客戶端實例`](/server/client).
- `options`:  在 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 中指定的合並值, 帶有客戶 [`client.join()`](/client/client/#join-roomname-string-options-any) 時提供的選項
- `auth`: (可選) 返回的身份驗證方法數據 [`onAuth`](#onauth-client-options-request)

在 `requestJoin` 和 `onAuth` 完成後, 客戶成功進入房間時調用.

---

### `onLeave (client, consented)`

當客戶離開房間時調用. 如果由 [initiated by the client](/client/room/#leave) 發起斷開, `consented` 參數將是 `true`, 否則將是 `false`.

可以將此函數定義為 `async`. 參見 [graceful shutdown](/server/graceful-shutdown).

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

在銷毀房間之前調用 `onDispose()` 方法, 在發生以下情況時調用:

- 房間裏沒有客戶, 而且 `autoDispose` 被設置為 `true`(預設值)
- 可以手動調用 [`.disconnect()`](#disconnect).

可以將 `async onDispose()` 定義為異步方法, 以便在數據庫中保留一些數據. 事實上, 在遊戲結束後, 很適合使用此方法在數據庫中保留玩家的數據.

參見 [graceful shutdown](/server/graceful-shutdown).

---

### 示例房間
此示例演示實現 `onCreate`, `onJoin` 和 `onMessage` 方法的完整房間.

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

房間句柄提供這些方法.

### `onMessage (type, callback)`

註冊一個回呼, 以處理客戶端發送的某種類型的資訊.

`type` 參數可以是 `string` 或 `number`

**Callback for specific type of message**

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        console.log(client.sessionId, "sent 'action' message: ", message);
    });
}
```

**Callback for ALL messages**

可以註冊單個回呼, 以處理所有其它類型的消息.

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

設置同步房間狀態. 參見 [State Synchronization](/state/overview/) 和 [Schema](/state/schema/) 了解更多資訊.

!!! Tip
    通常,可以在 [`onCreate()`](#onCreate-options) 期間調用此方法一次

!!! Warning
    不要調用 `.setState()` 來進行每次房間更新. 每次調用時, 將會重置二叉樹路徑算法.

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

(可選)設置一個可以更改遊戲狀態的模擬間隔期. 此模擬間隔期間是您的遊戲循環周期. 預設模擬間隔期: 16.6ms (60fps)

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

設置將補丁狀態發送至所有客戶端的頻率. 預設值為 `50`ms (20fps)

---


### `setPrivate (bool)`

將房間列表設置為私有(或轉換為公有, 如果提供 `false`).

在 [`>getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) 方法中未列出私有房間.

---

### `setMetadata (metadata)`

為此房間設置元數據. 每個房間實例都可能附加了元數據 - 附加元數據的唯一目的是在從客戶端獲取可用房間列表時, 將一個房間與另一個房間區分開來, 通過 `roomId` 連線到房間, 並使用 [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname).

```typescript
// server-side
this.setMetadata({ friendlyFire: true });
```

現在, 房間已經有附加的元數據, 舉例來說, 客戶端可以檢查哪個房間有 `friendlyFire`, 並且可以通過其 `roomId` 直接連線到房間:

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

設置房間可以等待客戶端有效加入的秒數 .應該考慮 [`onAuth()`](#onauth-client-options-request) 需要等待多長時間, 以設置不同的座位預訂時間. 預設值為 15 秒.

如果想要全局更改座位預訂時間, 可以設置 `COLYSEUS_SEAT_RESERVATION_TIME` 環境變數.

---


### `send (client, message)`

!!! Warning "已棄用"
    `this.send()` 已被棄用. 請使用 [`client.send()` instead](/server/client/#sendtype-message).

---


### `broadcast (type, message, options?)`

向所有連線的客戶端發送一條消息.

可用的選項為:

- **`except`**: a [`Client`](/server/client/) 不會發送消息至
- **`afterNextPatch`**: 等待, 直到下一補丁廣播消息

#### 廣播示例

向所有客戶端廣播一條消息:

```typescript
onCreate() {
    this.onMessage("action", (client, message) => {
        // broadcast a message to all clients
        this.broadcast("action-taken", "an action has been taken!");
    });
}
```

向所有客戶端廣播一條消息, 發送者除外:

```typescript
onCreate() {
    this.onMessage("fire", (client, message) => {
        // sends "fire" event to every client, except the one who triggered it.
        this.broadcast("fire", message, { except: client });
    });
}
```

僅在應用狀態變更之後, 向所有客戶端廣播一條消息:

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

廣播一條架構編碼消息:

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
    [參見如何在客戶端處理這些 onMessage().](/colyseus/client/client/#onmessage)

---

### `lock ()`

鎖定房間將會從供新客戶連線的房間池中刪除房間.

---

### `unlock ()`

解鎖房間會將房間返回至可供新客戶連線的房間池.

---

### `allowReconnection (client, seconds?)`

允許指定的客戶 [`reconnect`](/client/client/#reconnect-reconnectiontoken) 房間. 必須在 [`onLeave()`](#onleave-client) 方法中使用.

如果提供 **`seconds`**, 將在提供的秒數之後取消重新連線.

**Return type:**

- `allowReconnection()` 返回一個 `Deferred<Client>` 實例.
- `Deferred` 是一個類似於 pormise 的類型
- `Deferred` 類型可以通過調用 `.reject()` 強製拒絕 promise (參見第二個示例)

**示例** 在 20 秒超時後拒絕重新連線.

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


**示例** 使用自定義邏輯拒絕重新連線.

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

斷開所有客戶斷, 然後銷毀房間.

---

### `broadcastPatch ()`

!!! Warning "您可能不需要這樣做!"
    框架會自動調用此方法.

此方法會檢查是否已經在 `state` 中發生變化(mutation), 並將變化廣播給所有已連線的客戶端.

如果想要控製何時廣播補丁, 可以禁用預設的補丁間隔時間來實現:

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

## 公用屬性

### `roomId: string`

一個唯一, 自動生成的 8 字符長度的房間 id.

在 `onCreate()` 期間, 可以更換 `this.roomId`.

!!!提示 "使用自定義 `roomId`"
    查閱指南 Check out the guide [How-to » Customize room id](/how-to/custom-room-id/)

---

### `roomName: string`

房間名稱作為 [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any) 的第一個參數.

---

### `狀態T`

提供給 [`setState()`](#setstate-object) 的狀態實例.

---

### `clients:客戶端`

已連線的客戶端數組. 參見 [Web-Socket Client](/server/client).

---

### `maxClients: number`

允許連線進入房間的最大客戶端數量. 當房間數量達到此限值時, 將自動鎖定. 除非通過 [lock()](#lock) 方法顯式鎖定, 否則, 將在客戶端自動斷開房間時立即解鎖房間.

---

### `patchRate: number`

將房間狀態發送至客戶端的頻率, 單位為毫秒. 預設值為 `50`ms (20fps)

---

### `autoDispose: boolean`

最近一次客戶斷開連線後, 自動銷毀房間. 預設值是 `true`

---

### `locked: boolean`(只讀)

對於以下情況, 此屬性將發生改變:

- 允許的客戶端數量已經達到 (`maxClients`)
- 可以使用 [`lock()`](#lock) 或 [`unlock()`](#unlock) 手動鎖定或解鎖房間.

---

### `時鐘ClockTimer`

一個 [`ClockTimer`](https://github.com/gamestdio/timer#api) 實例, 用於 [timing events](/server/timing-events).

---

### Presence`Presence`

`presence` 實例. 查閱 [Presence API](/server/presence) 了解更多詳細資訊.

---

## 客戶端

伺服器端的 `client` 實例負責伺服器與客戶端之間的 **transport** 層. 不應該與 [`Client` from the client-side SDK](/client/client/) 混淆, 因為它們具有完全不同的目的!

可以通過 [`this.clients`](#clients-client), [`Room#onJoin()`](#onjoin-client-options-auth), [`Room#onLeave()`](#onleave-client-consented) 和 [`Room#onMessage()`](#onmessage-type-callback) 操作 `client` 實例.

!!! Note
    這是來自於 [`ws`](https://www.npmjs.com/package/ws) 包的原始 WebSocket 連線. 還有更多的方法可用, 但是不建議用於 Colyseus.

### 屬性

#### `sessionId: string`

每個會話的唯一 id.

!!! Note
    在客戶端, 可以在 [`room` 實例中找到 `sessionId`](/client/room/#sessionid-string).

---

#### `userData: any`

可用於存儲關於客戶端連線的自定義數據. `userData` 並不同步於 **not** 客戶端, 僅用於保留與其連線相關的用戶數據.

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

[`onAuth()`](/server/room/#onauth-client-options-request) 期間返回的自定義數據.

---

### 方法.

#### `send(type, message)`

發送消息類型至客戶端. 消息使用 MsgPack 編碼, 僅含有可序列化 JSON 數據結構.

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
    [查看如何在客戶端處理這些資訊.](/colyseus/client/client/#onmessage)

---

#### `leave(code?: number)`

`客戶端` 與房間強製斷開連線. 您可以在關閉連線時發送一個數值介於 `4000` 和 `4999` 之間的自定義 `code` (見 [WebSocket 關閉代碼表](#websocket-close-codes-table))

!!! Tip
    這將在客戶端觸發 [`room.onLeave`](/client/room/#onleave) 事件.

##### WebSocket 關閉代碼表

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

將錯誤及代碼與消息一並發送給客戶端. 客戶端可以在 [`onError`](/client/room/#onerror) 對其進行處理
