# 伺服器 API » 房間

房間類別代表建置遊戲工作階段，和/或作為用戶端群組間的通訊通道。

- 預設會在配對時**視需要**建立房間
- 房間類別必須使用 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 來公開

```typescript fct\_label="TypeScript" import http from "http"; import { Room, Client } from "colyseus";

export class MyRoom extends Room { // When room is initialized onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) { }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
} ```

```typescript fct\_label="JavaScript" const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room { // When room is initialized onCreate (options) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) { }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
} ```

## 房間生命週期事件

- 房間生命週期事件會自動呼叫。 
- 選擇性[`非同步`/`等候`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)在每個生命周期事件中皆受支援。

### `onCreate（選項）`

當房間由配對器建立時，會呼叫一次。 

**`選項`引數會在建立時由用戶端提供：**

```typescript // Client-side - JavaScript SDK client.joinOrCreate("my\_room", { name:"Jake", map: "de\_dust2" })

// onCreate() - options are: // { // name:"Jake", // map: "de\_dust2" // } ```

**伺服器可能會在 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 時覆寫選項以用於授權：**

```typescript fct\_label="Definition" // Server-side gameServer.define("my\_room", MyRoom, { map: "cs\_assault" })

// onCreate() - options are: // { // name:"Jake", // map: "cs\_assault" // } ```

在此範例中，`地圖` 選項在 `onCreate()` 時是 `"cs_assault"`，而在 `onJoin()` 時是 `"de_dust2"`。

---

### `onAuth (client, options, request)`

`onAuth()` 方法會在 `onJoin()` 之前執行。其可用於驗證加入房間之用戶端的真確性。

- 如果 `onAuth()` 傳回 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值，則會使用傳回的值作為第三個引數來呼叫 \`onJoin()`。
- 如果 `onAuth()` 傳回 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值，則用戶端會被立即拒絕，造成用戶端的配對函式呼叫失敗。
- 你也可以擲出 `ServerError` 來公開要在用戶端進行處理的自訂錯誤。

如果不進行任何實作，則一律會傳回 `true`－允許任何用戶端進行連接。

!!!提示「取得玩家的 IP 位址」你可以使用`查詢`變數以擷取使用者的 IP 位址、HTTP 標頭以及更多項目。例如：`request.headers['x-forwarded-for'] || request.connection.remoteAddress`

**實作範例**

```typescript fct\_label="async / await" import { Room, ServerError } from "colyseus";

class MyRoom extends Room { async onAuth (client, options, request) { /\** * 或是你可以使用`非同步`/ `等候`，* 這會傳回基礎`承諾`。 \*/ const userData = await validateToken(options.accessToken); if (userData) { return userData;

    } else {
        throw new ServerError(400, "bad access token");
    }
  } } ```

```typescript fct\_label="Synchronous" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request): boolean { /\** * 你可以立即傳回`布林`值。\*/ if (options.password === "secret") { return true;

     } else {
       throw new ServerError(400, "bad access token");
     }
  } } ```

```typescript fct\_label="Promises" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request):Promise<any> { /\** * 你可以傳回`承諾`，並執行部分非同步工作以驗證用戶端。\*/ return new Promise((resolve, reject) => { validateToken(options.accessToken, (err, userData) => { if (!err) { resolve(userData); } else { reject(new ServerError(400, "bad access token")); } }); }); } } ```

**用戶端範例**

在用戶端，你可以使用選擇的某個驗證服務（即 Facebook）的權杖，來呼叫配對方法`加入`、`joinOrCreate` 等等）：

```javascript fct\_label="JavaScript" client.joinOrCreate("world", { accessToken: yourFacebookAccessToken

}).then((room) => { // success

}).catch((err) => { // handle error... err.code // 400 err.message // "bad access token" }); ```

```csharp fct\_label="C#" try { var room = await client.JoinOrCreate<YourStateClass>"world", new { accessToken = yourFacebookAccessToken }); // success

} catch (err) { // handle error... err.code // 400 err.message // "bad access token" } ```

```lua fct\_label="Lua" client:join\_or\_create("world", { accessToken = yourFacebookAccessToken

}, function(err, room) if err then -- handle error... err.code -- 400 err.message -- "bad access token" return end

  -- success end) ```

```haxe fct\_label="Haxe" client.joinOrCreate("world", { accessToken: yourFacebookAccessToken

}, YourStateClass, function (err, room) { if (err != null) { // handle error... err.code // 400 err.message // "bad access token" return; }

  // success }) ```

```cpp fct\_label="C++" client.joinOrCreate("world", { { "accessToken", yourFacebookAccessToken }

}, \[=\](MatchMakeError *err, Room<YourStateClass>* room) { if (err != "") { // handle error... err.code // 400 err.message // "bad access token" return; }

  // success }); ```

---

### `onJoin (client, options, auth?)`

**參數：**

- `用戶端`[`用戶端執行個體`](/server/client).
- `選項`：將 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 上指定的值與[`client.join()`](/client/client/#join-roomname-string-options-any) 上提供給用戶端的選項進行合併。
- `auth`：（選擇性）[`onAuth`](#onauth-client-options-request) 方法傳回的驗證資料。

會在 `requestJoin` 和 `onAuth` 成功後，用戶端成功加入房間時進行呼叫。

---

### `onLeave (client, consented)`

會在用戶端離開房間時進行呼叫。如果中斷連接是[由用戶端起始](/client/room/#leave)，則`同意`參數會是 `true`，反之則是 `false`。

你可以將此函式定義為`非同步`。查看[順利關機](/server/graceful-shutdown)。

```typescript fct_label="Synchronous" onLeave(client, consented) { if (this.state.players.has(client.sessionId)) { this.state.players.delete(client.sessionId); } } ```

```typescript fct_label="Asynchronous" async onLeave(client, consented) { const player = this.state.players.get(client.sessionId); await persistUserOnDatabase(player); } ```

---

### `onDispose ()`

`onDispose()` 方法會在房間終結前進行呼叫，這會發生在：

- 沒有任何用戶端還留在房間內，且 `autoDispose` 設為 `true`（預設）
- 你手動呼叫 [`.disconnect()`](#disconnect)。

你可以將`非同步 onDispose()` 定義為非同步方法以保存資料庫中的部分資料。事實上，在遊戲配對結束後，將玩家的資料保存在資料庫會是個好做法。

查看[順利關機](/server/graceful-shutdown)。

---

### 範例房間
此範例示範了實作 `onCreate`、`onJoin` 和 `onMessage` 方法的整個房間。

```typescript fct\_label="TypeScript" import { Room, Client } from "colyseus"; import { Schema, MapSchema, type } from "@colyseus/schema";

// An abstract player object, demonstrating a potential 2D world position export class Player extends Schema { @type("number") x: number = 0.11;

  @type("number") y: number = 2.22; }

// Our custom game state, an ArraySchema of type Player only at the moment export class State extends Schema { @type({ map:Player }) players = new MapSchema<Player>(); } ```

export class GameRoom extends Room<State> { // Colyseus will invoke when creating the room instance onCreate(options: any) { // initialize empty room state this.setState(new State());

    // Called every time this room receives a "move" message
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // Called every time a client joins onJoin(client:Client, options: any) { this.state.players.set(client.sessionId, new Player()); } } ```

```typescript fct\_label="JavaScript" const colyseus = require('colyseus'); const schema = require('@colyseus/schema');

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

  // Called every time a client joins onJoin(client, options) { this.state.players.set(client.sessionId, new Player()); } } ```

---

## 公開方法

房間處理常式具有這些可用的方法。

### `onMessage (type, callback)`

登錄回調以處理用戶端傳送的訊息類型。

`類型`引數可以是`字串`或`數字`。

**訊息特定類型的回調**

```typescript onCreate () { this.onMessage("action", (client, message) => { console.log(client.sessionId, "sent 'action' message: ", message); }); } ```

**為所有訊息進行回調**

你可以登錄單一回調以處理其他所有類型的訊息。

```typescript onCreate () { this.onMessage("action", (client, message) => { // // Triggers when 'action' message is sent. // });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
} ```

!!! 提示「使用用戶端 SDK 的 `room.send()` 以傳送訊息」查看 [`room.send()`](/client/client/#send-type-message) 章節。

---

### `setState（物件）`

設定可同步的房間狀態。查看[狀態同步](/state/overview/)和[結構描述](/state/schema/)以瞭解更多資訊。

!!!提示你在 [`onCreate()`](#onCreate-options) 時通常只能呼叫一次此方法

!!!警告不要在房間狀態中為每個更新呼叫 `.setState()`。二進位修補程式演算法會在每個呼叫進行重設。

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

（選擇性）設定能變更遊戲狀態的模擬間隔。該模擬間隔是你的遊戲迴圈。預設模擬間隔：16.6ms (60fps)

```typescript onCreate () { this.setSimulationInterval((deltaTime) => this.update(deltaTime)); }

update (deltaTime) { // 在這裡實作你的物理或世界更新！ // 這是個更新房間狀態 } ```

---

### `setPatchRate（毫秒）`

設定修補狀態應傳送給所有用戶端的頻率。預設為 `50`ms (20fps)

---


### `setPrivate (bool)`

將房間清單設為私人（如果提供了 `false`，則還原為公開）。

私人房間並未列在 [getAvailableRooms()` 方法。

---

### `setMetadata（中繼資料）`

將中繼資料設定至此房間。每個房間執行個體都可能具有附加的中繼資料－附加中繼資料的唯一目的，是使用 [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname) 從用戶端取得可用房間清單時，來區別房間並依其 `roomId` 來進行連接。

```typescript // server-side this.setMetadata({ friendlyFire: true }); ```

現在房間附加上中繼資料了，這樣用戶端就可以檢查哪個房間具有 `friendlyFire`，並透過其 `roomId` 直接進行連接：

```javascript // client-side client.getAvailableRooms("battle").then(rooms => { for (var i=0; i<rooms.length; i++) { if (room.metadata && room.metadata.friendlyFire) { // // 使用 `friendlyFire` 依 ID 加入房間： // var room = client.join(room.roomId); return; } } });```

!!!提示[查看如何以其他語言呼叫 `getAvailableRooms()`。](/client/client/#getavailablerooms-roomname)

---

### `setSeatReservationTime（秒）`

設定房間能等候用戶端有效加入房間的秒數。您應考慮 [`onAuth()`](#onauth-client-options-request) 在設定不同座位保留時間時要等候多久。預設值為 15 秒。

如果您想全域變更座位保留，你可以設定 `COLYSEUS_SEAT_RESERVATION_TIME` 環境變數。

---


### `send (client, message)`

!!!警告「已取代」`this.send()` 已被取代。請改用 [`client.send()`](/server/client/#sendtype-message)。

---


### `broadcast (type, message, options?)`

傳送訊息至所有連接的用戶端。

可用的選項為：

- **`例外`**：訊息無法送達的[`用戶端`](/server/client/)執行個體
- **`afterNextPatch`**：等到下次更新才會廣播訊息

#### 廣播範例

對所有用戶端廣播訊息：

```typescript onCreate() { this.onMessage("action", (client, message) => { // 對所有用戶端廣播訊息 this.broadcast("action-taken", "an action has been taken!"); }); } ```

對所有用戶端廣播訊息，除了傳送者。

```typescript onCreate() { this.onMessage("fire", (client, message) => { // 傳送「引發」事件至所有用戶端，除了觸發者以外。 this.broadcast("fire", message, { except: client }); }); } ```

只在變更套用至狀態後，才會向所有用戶端廣播訊息：

```typescript onCreate() { this.onMessage("destroy", (client, message) => { // perform changes in your state! this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
} ```

廣播結構描述編碼訊息：

```typescript class MyMessage extends Schema { @type("string") message: string; }

// ... onCreate() { this.onMessage("action", (client, message) => { const data = new MyMessage(); data.message = "an action has been taken!"; this.broadcast(data); }); } ```

!!!提示[查看如何處理這些用戶端內的 onMessage()。](/client/room/#onmessage)

---

### `lock ()`

鎖定房間會將其從新用戶端可連接的房間集區中移除。

---

### `unlock ()`

解除鎖定房間會將其傳回新用戶端可連接的房間集區。

---

### `allowReconnection (client, seconds?)`

允許指定的用戶端[`重新連接至`](/client/client/#reconnect-roomid-string-sessionid-string)房間。必須在 [`onLeave()`](#onleave-client) 方法內使用。

如果已提供**`秒數`**，則會在提供的秒數過後中斷重新連接。

**Return type:**

- `allowReconnection()` 傳回 `Deferred<Client>` 執行個體。
- `順延`是類似承諾的類型 
- `順延`類型可以透過呼叫 `.reject()` 強制拒絕承諾（請查看第二個範例）

**範例：**在 20 秒逾時後拒絕重新連接。

```typescript async onLeave (client:Client, consented: boolean) { // flag client as inactive for other users this.state.players\[client.sessionId].connected = false;

  try { if (consented) { throw new Error("consented leave"); }

    // allow disconnected client to reconnect into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  } } ```


**範例：**使用自訂邏輯手動拒絕重新連接。

```typescript async onLeave (client:Client, consented: boolean) { // flag client as inactive for other users this.state.players\[client.sessionId].connected = false;

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
  } } ```

---

### `disconnect ()`

中斷連接所有用戶端，然後進行處置。

---

### `broadcastPatch ()`

!!!警告「您可能會需要這個項目！」 此方法會透過架構自動呼叫。

此方法會檢查`狀態`是否發生變動，並將其對所有連接的用戶端廣播。

如果您想控制廣播修補程式的時間，您可以透過停用預設修補程式間隔來進行：

```typescript onCreate() { // disable automatic patches this.setPatchRate(null);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // only broadcast patches if your custom conditions are met.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
} ```

---

## 公開屬性

### `roomId: string`

房間的唯一、自動產生、9 個字元的 ID。

您可以在 `onCreate()`時替換 `this.roomId`。 

!!!提示「使用自訂 `roomId`」查看指南[操作說明 » 自訂房間 ID](/how-to/custom-room-id/)

---

### `roomName: string`

您提供作為 [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any) 第一個引數之房間的名稱。

---

### `StateT`

您向 [`setState()`](#setstate-object) 提供的狀態執行個體。

---

### `clients:用戶端`

連接的用戶端陣列。查看 [Web 通訊端用戶端](/server/client)。

---

### `maxClients: number`

允許連接至房間的最大用戶端數量。當房間達到數量上限時，會自動鎖定。除非房間是您透過 [lock()](#lock) 方法明確鎖定，否則房間會在用戶端從中中斷連接時解除鎖定。

---

### `patchRate: number`

將房間狀態傳送至連接的用戶端的頻率，以毫秒計。預設為 `50`ms (20fps)

---

### `autoDispose: boolean`

在最後一個用戶端中斷連接時，自動處置房間。預設為 `true`

---

### `locked: boolean`（唯獨）

此屬性會在這些情況下變更：

- 以達到允許的用戶端數量上限 (`maxClients`)
- 您使用 [`lock()`](#lock) 或 [`unlock()`](#unlock) 手動鎖定或解除鎖定房間。

---

### `時鐘ClockTimer`

[`ClockTimer`](https://github.com/gamestdio/timer#api) 執行個體，用於[計時事件](/server/timing-events)。

---

### Presence`Presence`

`目前狀態`執行個體。請查看[目前狀態 API](/server/presence) 以瞭解更多資訊。

---

## 用戶端 

伺服器端的`用戶端`執行個體負責伺服器和用戶端之間的**傳輸**層。其不應與[用戶端 SDK 的 `用戶端`](/client/client/)混淆，因為它們具有完全不同的目的！

您會在 [`this.clients`](#clients-client)、[`Room#onJoin()`](#onjoin-client-options-auth)、[`Room#onLeave()`](#onleave-client-consented) 和 [`Room#onMessage()`](#onmessage-type-callback) 操作`用戶端`執行個體。

!!!注意這是來自 [`ws`](https://www.npmjs.com/package/ws) 套件的原始 WebSocket 連接。還有更多不建議與 Colyseus 搭配使用的可用方法。

### 屬性

#### `sessionId: string`

每個工作階段的唯一 ID。

!!!請注意，在用戶端中，您可以\\[在\`房間`執行個體中找到 `sessionId`](/client/room/#sessionid-string)。

---

#### `userData: any`

可以用於儲存關於用戶端連接的自訂資料。`userData` **不**與用戶端同步，且應只用於保持特定玩家與其的連接。

```typescript onJoin(client, options) { client.userData = { playerNumber: this.clients.length }; }

onLeave(client) { console.log(client.userData.playerNumber); } ```

---

#### `auth: any`

在 [`onAuth()`](/server/room/#onauth-client-options-request) 時自訂你傳回的資料。

---

### 方法

#### `send(type, message)`

向用戶端傳送訊息類型。訊息以 MsgPack 進行編碼，並可以保留任何 JSON 可序列化的資料結構。

`類型`可以是`字串`或`數字`。

**傳送訊息：**

```typescript // // 正在傳送字串類型為「powerup」的訊息 // client.send("powerup", { kind: "ammo" });

// // 正在傳送數字類型為 1 的訊息 // client.send(1, { kind: "ammo"}); ```

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

!!!提示 [查看如何在用戶端處理這些訊息。](/client/room/#onmessage)

---

#### `leave(code?: number)`

強制用戶端與房間中斷連接。您可以在關閉連接時傳送自訂`代碼`，其值在 `4000` 和 `4999` 之間（查看[ WebSocket 關閉代碼的表格](#websocket-close-codes-table)）

!!!提示 這會在用戶端觸發 [`room.onLeave`](/client/room/#onleave) 事件。

##### WebSocket 關閉代碼的表格 

| 關閉代碼 (uint16) | Codename | 內部 | 可自訂 | 說明 | |---------------------|------------------------|----------|--------------|-------------| | `0` - `999` | | 是 | 否 | 未使用 | | `1000` | `CLOSE_NORMAL` | 否 | 否 | 成功作業 / 正常通訊端關機 | | `1001`} | `CLOSE_GOING_AWAY` | 否 | 否 | 用戶端正在離開（瀏覽器索引標籤正在關閉） | | `1002` | `CLOSE_PROTOCOL_ERROR` | 是 | 否 | 端點接收到格式錯誤的格式 | | `1003` | `CLOSE_UNSUPPORTED` | 是 | 否 | 端點接收到不支援的格式（例如：僅限二進位的端點接收到文字格式） | | `1004` | | 是 | 否 | 已保留 | | `1005` | `CLOSED_NO_STATUS` | 是 | 否 | 預期的關閉狀態，未收到任何項目 | | `1006` | `CLOSE_ABNORMAL` | 是 | 否 | 未收到任何關閉代碼格式 | | `1007` | *不支援的承載* | 是 | 否 | 端點接收到不一致的訊息（例如：格式錯誤的 UTF-8） | | `1008` | *原則違規* | 否 | 否 |  用於 1003 和 1009 以外情況的泛型程式碼 | | `1009` | `CLOSE_TOO_LARGE` | 否 | 否 | 端點不會處理大型格式 | | `1010` | *必要擴充功能* | 否 | 否 | 用戶端需要伺服器未交涉的擴充功能 | | `1011` | *伺服器錯誤* | 否 | 否 | 作業時發生內部伺服器錯誤 | | `1012` | *伺服器重新啟動* | 否 | 否 | 伺服器/服務正在重新啟動 | | `1013` | *請稍後再試* | 否 | 否 | 暫時性伺服器狀況強制封鎖了用戶端的請求 | | `1014` | *錯誤的閘道* | 否 | 否 | 作為閘道的伺服器接收到無效的回應 | | `1015` | *TLS 信號交換失敗* | 是 | 否 | 傳輸層 安全性信號交換失敗 | | `1016` - `1999` | | 是 | 否 | 已保留給 WebSocket 標準未來使用。 | | `2000` - `2999` | | 是 | 是 | 已保留給 WebSocket 擴充功能使用 | | `3000` - `3999` | | 否 | 是 | 可供程式庫和架構使用。可能不會被應用程式使用。可透過先到先處理的方式在 IANA 進行註冊。 | | `4000`- `4999`| | 否 | 是 | **應用程式可使用** |

---

#### `error(code, message)`

使用代碼和訊息向用戶端傳送錯誤。用戶端能在 [`onError`](/client/room/#onerror) 上對其進行處理