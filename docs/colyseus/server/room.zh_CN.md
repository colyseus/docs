# 伺服器 API » 房間

房間類別代表建置遊戲工作階段，和/或作為用戶端群組間的通訊通道。

- 預設會在配對時{1>視需要<1}建立房間
- 房間類別必須使用 {1>{2>.define()<2}<1} 來公開

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

## 房間生命週期事件

- 房間生命週期事件會自動呼叫。 
- 選擇性{1>{2>非同步<2}/{3>等候<3}<1}在每個生命周期事件中皆受支援。

### {1>onCreate（選項）<1}

當房間由配對器建立時，會呼叫一次。 

{1>{2>選項<2}引數會在建立時由用戶端提供：<1}

\`\`\`typescript // Client-side - JavaScript SDK client.joinOrCreate("my\_room", { name:"Jake", map: "de\_dust2" })

// onCreate() - options are: // { // name:"Jake", // map: "de\_dust2" // } \`\`\`

{1>伺服器可能會在 {2>{3>.define()<3}<2} 時覆寫選項以用於授權：<1}

\`\`\`typescript fct\_label="Definition" // Server-side gameServer.define("my\_room", MyRoom, { map: "cs\_assault" })

// onCreate() - options are: // { // name:"Jake", // map: "cs\_assault" // } \`\`\`

在此範例中，`地圖` 選項在 `onCreate()` 時是 `"cs_assault"`，而在 `onJoin()` 時是 `"de_dust2"`。

---

### {1>onAuth (client, options, request)<1}

{1>onAuth()<1} 方法會在 {2>onJoin()<2} 之前執行。其可用於驗證加入房間之用戶端的真確性。

- 如果 {1>onAuth()<1} 傳回 {2>truthy<2} 值，則會使用傳回的值作為第三個引數來呼叫 {3>onJoin()<3}。
- 如果 {1>onAuth()<1} 傳回 {2>falsy<2} 值，則用戶端會被立即拒絕，造成用戶端的配對函式呼叫失敗。
- 你也可以擲出 {1>ServerError<1} 來公開要在用戶端進行處理的自訂錯誤。

如果不進行任何實作，則一律會傳回 {1>true<1}－允許任何用戶端進行連接。

!!!提示「取得玩家的 IP 位址」你可以使用{1>查詢<1}變數以擷取使用者的 IP 位址、HTTP 標頭以及更多項目。例如：{2>request.headers\['x-forwarded-for'] || request.connection.remoteAddress<2}

{1>實作範例<1}

\`\`\`typescript fct\_label="async / await" import { Room, ServerError } from "colyseus";

class MyRoom extends Room { async onAuth (client, options, request) { /\** * 或是你可以使用{1>非同步<1} / {2>等候<2}，* 這會傳回基礎{3>承諾<3}。 \*/ const userData = await validateToken(options.accessToken); if (userData) { return userData;

    } else {
        throw new ServerError(400, "bad access token");
    }
  } } \`\`\`

\`\`\`typescript fct\_label="Synchronous" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request): boolean { /\** * 你可以立即傳回{1>布林<1}值。\*/ if (options.password === "secret") { return true;

     } else {
       throw new ServerError(400, "bad access token");
     }
  } } \`\`\`

\`\`\`typescript fct\_label="Promises" import { Room } from "colyseus";

class MyRoom extends Room { onAuth (client, options, request):Promise{1} { /\** * 你可以傳回{2>承諾<2}，並執行部分非同步工作以驗證用戶端。\*/ return new Promise((resolve, reject) => { validateToken(options.accessToken, (err, userData) => { if (!err) { resolve(userData); } else { reject(new ServerError(400, "bad access token")); } }); }); } } \`\`\`

{1>用戶端範例<1}

在用戶端，你可以使用選擇的某個驗證服務（即 Facebook）的權杖，來呼叫配對方法（{1>加入<1}、{2>joinOrCreate<2} 等等）：

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

{1>參數：<1}

- 用戶端用戶端執行個體：
- {1>選項<1}：將 {2>Server#define()<2} 上指定的值與 {3>{4>client.join()<4}<3} 上提供給用戶端的選項進行合併。
- {1>auth<1}：（選擇性）{2>{3>onAuth<3}<2} 方法傳回的驗證資料。

會在 {1>requestJoin<1} 和 {2>onAuth<2} 成功後，用戶端成功加入房間時進行呼叫。

---

### {1>onLeave (client, consented)<1}

會在用戶端離開房間時進行呼叫。如果中斷連接是{1>由用戶端起始<1}，則{2>同意<2}參數會是 {3>true<3}，反之則是 {4>false<4}。

你可以將此函式定義為{1>非同步<1}。查看{2>順利關機<2}。

{1>typescript fct\_label="Synchronous" onLeave(client, consented) { if (this.state.players.has(client.sessionId)) { this.state.players.delete(client.sessionId); } } <1}

{1>typescript fct\_label="Asynchronous" async onLeave(client, consented) { const player = this.state.players.get(client.sessionId); await persistUserOnDatabase(player); } <1}

---

### {1>onDispose ()<1}

{1>onDispose()<1} 方法會在房間終結前進行呼叫，這會發生在：

- 沒有任何用戶端還留在房間內，且 {1>autoDispose<1} 設為 {2>true<2}（預設）
- 你手動呼叫 {1>{2>.disconnect()<2}<1}。

你可以將{1>非同步 onDispose()<1} 定義為非同步方法以保存資料庫中的部分資料。事實上，在遊戲配對結束後，將玩家的資料保存在資料庫會是個好做法。

查看{2>順利關機<2}。

---

### 範例房間
此範例示範了實作 {1>onCreate<1}、{2>onJoin<2} 和 {3>onMessage<3} 方法的整個房間。

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

## 公開方法

房間處理常式具有這些可用的方法。

### {1>onMessage (type, callback)<1}

登錄回調以處理用戶端傳送的訊息類型。

{1>類型<1}引數可以是{2>字串<2}或{3>數字<3}。

{1>訊息特定類型的回調<1}

{1>typescript onCreate () { this.onMessage("action", (client, message) => { console.log(client.sessionId, "sent 'action' message: ", message); }); } <1}

{1>為所有訊息進行回調<1}

你可以登錄單一回調以處理其他所有類型的訊息。

\`\`\`typescript onCreate () { this.onMessage("action", (client, message) => { // // Triggers when 'action' message is sent. // });

    this.onMessage("*", (client, type, message) => {
        //
        // Triggers when any other type of message is sent,
        // excluding "action", which has its own specific handler defined above.
        //
        console.log(client.sessionId, "sent", type, message);
    });
} \`\`\`

!!! 提示「使用用戶端 SDK 的 {1>room.send()<1} 以傳送訊息」查看 {2>{3>room.send()<3}<2} 章節。

---

### {1>setState（物件）<1}

設定可同步的房間狀態。查看{1>狀態同步<1}和{2>結構描述<2}以瞭解更多資訊。

!!!提示你在 {1>{2>onCreate()<2}<1} 時通常只能呼叫一次此方法

!!!警告不要在房間狀態中為每個更新呼叫 {1>.setState()<1}。二進位修補程式演算法會在每個呼叫進行重設。

---

### {1>setSimulationInterval (callback\[, milliseconds=16.6])<1}

（選擇性）設定能變更遊戲狀態的模擬間隔。該模擬間隔是你的遊戲迴圈。預設模擬間隔：16.6ms (60fps)

\`\`\`typescript onCreate () { this.setSimulationInterval((deltaTime) => this.update(deltaTime)); }

update (deltaTime) { // 在這裡實作你的物理或世界更新！ // 這是個更新房間狀態 } \`\`\`

---

### {1>setPatchRate（毫秒）<1}

設定修補狀態應傳送給所有用戶端的頻率。預設為 {1>50<1}ms (20fps)

---


### {1>setPrivate (bool)<1}

將房間清單設為私人（如果提供了 {1>false<1}，則還原為公開）。

私人房間並未列在 {1>{2>getAvailableRooms()<2}<1} 方法。

---

### {1>setMetadata（中繼資料）<1}

將中繼資料設定至此房間。每個房間執行個體都可能具有附加的中繼資料－附加中繼資料的唯一目的，是使用 {2>{3>client.getAvailableRooms()<3}<2} 從用戶端取得可用房間清單時，來區別房間並依其 {1>roomId<1} 來進行連接。

{1>typescript // server-side this.setMetadata({ friendlyFire: true }); <1}

現在房間附加上中繼資料了，這樣用戶端就可以檢查哪個房間具有 {1>friendlyFire<1}，並透過其 {2>roomId<2} 直接進行連接：

{1>javascript // client-side client.getAvailableRooms("battle").then(rooms => { for (var i=0; i<rooms.length; i++) { if (room.metadata && room.metadata.friendlyFire) { // // 使用 \`friendlyFire\` 依 ID 加入房間： // var room = client.join(room.roomId); return; } } }); <1}

!!!提示{1>查看如何以其他語言呼叫 {2>getAvailableRooms()<2}。<1}

---

### {1>setSeatReservationTime（秒）<1}

設定房間能等候用戶端有效加入房間的秒數。您應考慮 {1>{2>onAuth()<2}<1} 在設定不同座位保留時間時要等候多久。預設值為 15 秒。

如果您想全域變更座位保留，你可以設定 {1>COLYSEUS\_SEAT\_RESERVATION\_TIME<1} 環境變數。

---


### {1>send (client, message)<1}

!!!警告「已取代」{1>this.send()<1} 已被取代。請改用 {2>{3>client.send()<3}<2}。

---


### {1>broadcast (type, message, options?)<1}

傳送訊息至所有連接的用戶端。

可用的選項為：

- {1>{2>例外<2}<1}：訊息無法送達的{3>{4>用戶端<4}<3}執行個體
- {1>{2>afterNextPatch<2}<1}：等到下次更新才會廣播訊息

#### 廣播範例

對所有用戶端廣播訊息：

{1>typescript onCreate() { this.onMessage("action", (client, message) => { // 對所有用戶端廣播訊息 this.broadcast("action-taken", "an action has been taken!"); }); } <1}

對所有用戶端廣播訊息，除了傳送者。

{1>typescript onCreate() { this.onMessage("fire", (client, message) => { // 傳送「引發」事件至所有用戶端，除了觸發者以外。 this.broadcast("fire", message, { except: client }); }); } <1}

只在變更套用至狀態後，才會向所有用戶端廣播訊息：

\`\`\`typescript onCreate() { this.onMessage("destroy", (client, message) => { // perform changes in your state! this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
} \`\`\`

廣播結構描述編碼訊息：

\`\`\`typescript class MyMessage extends Schema { @type("string") message: string; }

// ... onCreate() { this.onMessage("action", (client, message) => { const data = new MyMessage(); data.message = "an action has been taken!"; this.broadcast(data); }); } \`\`\`

!!!提示{1>查看如何處理這些用戶端內的 onMessage()。<1}

---

### {1>lock ()<1}

鎖定房間會將其從新用戶端可連接的房間集區中移除。

---

### {1>unlock ()<1}

解除鎖定房間會將其傳回新用戶端可連接的房間集區。

---

### {1>allowReconnection (client, seconds?)<1}

允許指定的用戶端{1>{2>重新連接至<2}<1}房間。必須在 {3>{4>onLeave()<4}<3} 方法內使用。

如果已提供{1>{2>秒數<2}<1}，則會在提供的秒數過後中斷重新連接。

{1>Return type:<1}

- {1>allowReconnection()<1} 傳回 {2>Deferred<Client><2} 執行個體。
- {1>順延<1}是類似承諾的類型 
- {1>順延<1}類型可以透過呼叫 {2>.reject()<2} 強制拒絕承諾（請查看第二個範例）

**範例：**在 20 秒逾時後拒絕重新連接。

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


**範例：**使用自訂邏輯手動拒絕重新連接。

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

中斷連接所有用戶端，然後進行處置。

---

### {1>broadcastPatch ()<1}

!!!警告「您可能會需要這個項目！」 此方法會透過架構自動呼叫。

此方法會檢查{1>狀態<1}是否發生變動，並將其對所有連接的用戶端廣播。

如果您想控制廣播修補程式的時間，您可以透過停用預設修補程式間隔來進行：

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

## 公開屬性

### {1>roomId: string<1}

房間的唯一、自動產生、9 個字元的 ID。

您可以在 {2>onCreate()<2} 時替換 {1>this.roomId<1}。 

!!!提示「使用自訂 {1>roomId<1}」查看指南{2>操作說明 » 自訂房間 ID<2}

---

### {1>roomName: string<1}

您提供作為 {1>{2>gameServer.define()<2}<1} 第一個引數之房間的名稱。

---

### StateT{2}

您向 {1>{2>setState()<2}<1} 提供的狀態執行個體。

---

### {1}clients:用戶端

連接的用戶端陣列。查看 {1>Web 通訊端用戶端<1}。

---

### {1>maxClients: number<1}

允許連接至房間的最大用戶端數量。當房間達到數量上限時，會自動鎖定。除非房間是您透過 {1>lock()<1} 方法明確鎖定，否則房間會在用戶端從中中斷連接時解除鎖定。

---

### {1>patchRate: number<1}

將房間狀態傳送至連接的用戶端的頻率，以毫秒計。預設為 {1>50<1}ms (20fps)

---

### {1>autoDispose: boolean<1}

在最後一個用戶端中斷連接時，自動處置房間。預設為 {1>true<1}

---

### {1>locked: boolean<1}（唯獨）

此屬性會在這些情況下變更：

- 以達到允許的用戶端數量上限 ({1>maxClients<1})
- 您使用 {1>{2>lock()<2}<1} 或 {3>{4>unlock()<4}<3} 手動鎖定或解除鎖定房間。

---

### 時鐘ClockTimer{2}

{1>{2>ClockTimer<2}<1} 執行個體，用於{3>計時事件<3}。

---

### Presence{2}Presence{2}

{1>目前狀態<1}執行個體。請查看{2>目前狀態 API<2} 以瞭解更多資訊。

---

## 用戶端 

伺服器端的{1>用戶端<1}執行個體負責伺服器和用戶端之間的{2>傳輸<2}層。其不應與{3>用戶端 SDK 的 {4>用戶端<4}<3}混淆，因為它們具有完全不同的目的！

您會在 {2>{3>this.clients<3}<2}、{4>{5>Room#onJoin()<5}<4}、{6>{7>Room#onLeave()<7}<6} 和 {8>{9>Room#onMessage()<9}<8} 操作{1>用戶端<1}執行個體。

!!!注意這是來自 {1>{2>ws<2}<1} 套件的原始 WebSocket 連接。還有更多不建議與 Colyseus 搭配使用的可用方法。

### 屬性

#### {1>sessionId: string<1}

每個工作階段的唯一 ID。

!!!請注意，在用戶端中，您可以{1>在{3>房間<3}執行個體中找到 {2>sessionId<2}<1}。

---

#### {1>userData: any<1}

可以用於儲存關於用戶端連接的自訂資料。{1>userData<1} {2>不<2}與用戶端同步，且應只用於保持特定玩家與其的連接。

\`\`\`typescript onJoin(client, options) { client.userData = { playerNumber: this.clients.length }; }

onLeave(client) { console.log(client.userData.playerNumber); } \`\`\`

---

#### {1>auth: any<1}

在 {1>{2>onAuth()<2}<1} 時自訂你傳回的資料。

---

### 方法

#### {1>send(type, message)<1}

向用戶端傳送訊息類型。訊息以 MsgPack 進行編碼，並可以保留任何 JSON 可序列化的資料結構。

`類型`可以是`字串`或`數字`。

{1>傳送訊息：<1}

\`\`\`typescript // // 正在傳送字串類型為「powerup」的訊息 // client.send("powerup", { kind: "ammo" });

// // 正在傳送數字類型為 1 的訊息 // client.send(1, { kind: "ammo"}); \`\`\`

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

!!!提示 {1>查看如何在用戶端處理這些訊息。<1}

---

#### {1>leave(code?: number)<1}

強制用戶端與房間中斷連接。您可以在關閉連接時傳送自訂{2>代碼<2}，其值在 {3>4000<3} 和 {4>4999<4} 之間（查看{5 WebSocket 關閉代碼的表格<5}）

!!!提示 這會在用戶端觸發 {1>{2>room.onLeave<2}<1} 事件。

##### WebSocket 關閉代碼的表格 

| 關閉代碼 (uint16) | Codename | 內部 | 可自訂 | 說明 | |---------------------|------------------------|----------|--------------|-------------| | {1>0<1} - {2>999<2} | | 是 | 否 | 未使用 | | {3>1000<3} | {4>CLOSE\_NORMAL<4} | 否 | 否 | 成功作業 / 正常通訊端關機 | | {5>1001<5} | {6>CLOSE\_GOING\_AWAY<6} | 否 | 否 | 用戶端正在離開（瀏覽器索引標籤正在關閉） | | {7>1002<7} | {8>CLOSE\_PROTOCOL\_ERROR<8} | 是 | 否 | 端點接收到格式錯誤的格式 | | {9>1003<9} | {10>CLOSE\_UNSUPPORTED<10} | 是 | 否 | 端點接收到不支援的格式（例如：僅限二進位的端點接收到文字格式） | | {11>1004<11} | | 是 | 否 | 已保留 | | {12>1005<12} | {13>CLOSED\_NO\_STATUS<13} | 是 | 否 | 預期的關閉狀態，未收到任何項目 | | {14>1006<14} | {15>CLOSE\_ABNORMAL<15} | 是 | 否 | 未收到任何關閉代碼格式 | | {16>1007<16} | {17>不支援的承載<17} | 是 | 否 | 端點接收到不一致的訊息（例如：格式錯誤的 UTF-8） | | {18>1008<18} | {19>原則違規<19} | 否 | 否 |  用於 1003 和 1009 以外情況的泛型程式碼 | | {20>1009<20} | {21>CLOSE\_TOO\_LARGE<21} | 否 | 否 | 端點不會處理大型格式 | | {22>1010<22} | {23>必要擴充功能<23} | 否 | 否 | 用戶端需要伺服器未交涉的擴充功能 | | {24>1011<24} | {25>伺服器錯誤<25} | 否 | 否 | 作業時發生內部伺服器錯誤 | | {26>1012<26} | {27>伺服器重新啟動<27} | 否 | 否 | 伺服器/服務正在重新啟動 | | {28>1013<28} | {29>請稍後再試<29} | 否 | 否 | 暫時性伺服器狀況強制封鎖了用戶端的請求 | | {30>1014<30} | {31>錯誤的閘道<31} | 否 | 否 | 作為閘道的伺服器接收到無效的回應 | | {32>1015<32} | {33>TLS 信號交換失敗<33} | 是 | 否 | 傳輸層 安全性信號交換失敗 | | {34>1016<34} - {35>1999<35} | | 是 | 否 | 已保留給 WebSocket 標準未來使用。 | | {36>2000<36} - {37>2999<37} | | 是 | 是 | 已保留給 WebSocket 擴充功能使用 | | {38>3000<38} - {39>3999<39} | | 否 | 是 | 可供程式庫和架構使用。可能不會被應用程式使用。可透過先到先處理的方式在 IANA 進行註冊。 | | {40>4000<40} - {41>4999<41} | | 否 | 是 | {42>應用程式可使用<42} |

---

#### {1>error(code, message)<1}

使用代碼和訊息向用戶端傳送錯誤。用戶端能在 {1>{2>onError<2}<1} 上對其進行處理