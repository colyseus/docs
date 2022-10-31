# 服務器 API &raquo; 房間

Room 類的作用是實現遊戲會話, 也可作爲壹組客戶端之間的交流通道.

- 默認情況下系統在做房間匹配時, 房間根據客戶端請求 **隨求隨建**.
- Room 類必須使用 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 公開定義.

```typescript fct_label="TypeScript"
import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // 房間初始化時
    onCreate (options: any) { }

    // 在 WebSocket 握手完成前, 客戶端基于其提供的 options 進行驗證
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // 當客戶端成功加入房間時
    onJoin (client: Client, options: any, auth: any) { }

    // 當客戶端離開房間時
    onLeave (client: Client, consented: boolean) { }

    // 析構函數, 當房間裏沒有客戶端時被調用. (參考 `autoDispose`)
    onDispose () { }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // 房間初始化時
    onCreate (options) { }

    // 在 WebSocket 握手完成前, 客戶端基于其提供的 options 進行驗證
    onAuth (client, options, request) { }

    // 當客戶端成功加入房間時
    onJoin (client, options, auth) { }

    // 當客戶端離開房間時
    onLeave (client, consented) { }

    // 析構函數, 當房間裏沒有客戶端時被調用. (參考 `autoDispose`)
    onDispose () { }
}
```

## 房間生命周期事件

- 房間生命周期函數會自動被調用.
- 生命周期事件都可支持 [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

### `onCreate (options)`

房間由 matchmaker 創建後, 調用壹次.

**`options` 參數在房間創建時由客戶端提供:**

```typescript
// 客戶端 - JavaScript SDK
client.joinOrCreate("my_room", {
  name: "Jake",
  map: "de_dust2"
})

// onCreate() - options 爲:
// {
//   name: "Jake",
//   map: "de_dust2"
// }
```

**服務器的 [`.define()`](/server/api/#define-roomname-string-room-room-options-any) 時設置的 options 可以被覆蓋以便進行用戶認證等操作:**

```typescript fct_label="Definition"
// 服務器端
gameServer.define("my_room", MyRoom, {
  map: "cs_assault"
})

// onCreate() - options are:
// {
//   name: "Jake",
//   map: "cs_assault"
// }
```

上例中, 在 `onCreate()` 時, options 的 `map` 爲 `"cs_assault"`, 但是在 `onJoin()` 時變成了 `"de_dust2"`.

---

### `onAuth (client, options, request)`

在 `onJoin()` 之前, 將執行 `onAuth()` 方法. 在客戶進入房間時, 可以使用此方法驗證身份.

- 如果 `onAuth()` 返回壹個 [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) 值, 將調用 `onJoin()`, 並將返回值作爲第三個參數.
- 如果 `onAuth()` 返回 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值, 將立即拒絕客戶端登入, 並客戶端報告匹配失敗.
- 也可以抛出壹個 `ServerError`, 以便在客戶端進行處理.

如果沒有實現 onAuth 方法, 則默認返回 `true`, 從而允許任何客戶連接.

!!! Tip "獲取玩家的 IP 地址"
    可以利用 `request` 變量取得用戶的 IP 地址, http 標頭和更多信息. 例如:  `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

**舉例**

```typescript fct_label="async / await"
import { Room, ServerError } from "colyseus";

class MyRoom extends Room {
  async onAuth (client, options, request) {
    /**
     * 可以使用 `async` / `await`,
     * 異步底層基于 `Promise`.
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
     * 還可以返回壹個 `Promise`, 然後利用它來異步地驗證用戶合法性.
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

**客戶端舉例**

在客戶端, 可以在 matchmaking 函數 (`join`, `joinOrCreate` 等函數) 中使用自定義的身份驗證服務 (例如 Facebook):

```javascript fct_label="JavaScript"
client.joinOrCreate("world", {
  accessToken: yourFacebookAccessToken

}).then((room) => {
  // 成功

}).catch((err) => {
  // 處理報錯...
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
  // 處理報錯...
  err.code // 400
  err.message // "bad access token"
}
```

```lua fct_label="Lua"
client:join_or_create("world", {
  accessToken = yourFacebookAccessToken

}, function(err, room)
  if err then
    -- 處理報錯...
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
    // 處理報錯...
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
    // 處理報錯...
    err.code // 400
    err.message // "bad access token"
    return;
  }

  // 成功
});
```

---

### `onJoin (client, options, auth?)`

**參數:**

- `client`: [`client`](/server/client) 實例.
- `options`:  把 [Server#define()](/server/api/#define-roomname-string-room-room-options-any) 中指定的值, 與客戶端 [`client.join()`](/client/client/#join-roomname-string-options-any) 時提供的選項值進行合並.
- `auth`: (可選) 由 [`onAuth`](#onauth-client-options-request) 返回的身份驗證數據

在 `requestJoin` 和 `onAuth` 完成後, 客戶端成功進入房間時調用.

---

### `onLeave (client, consented)`

當客戶端離開房間時會調用此函數. 如果是由 [客戶端主動離開](/client/client/#leave-consented-boolean), 則 `consented` 參數是 `true`, 否則是 `false`.

可以將此函數定義爲 `async`. 參見 [優雅關閉](/server/graceful-shutdown).

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

在銷毀房間之前會調用 `onDispose()` 方法, 條件可以是:

- 房間裏沒有客戶端, 而且 `autoDispose` 被設置爲 `true`(默認值)
- 手動調用了 [`.disconnect()`](#disconnect).

可以寫成 `async onDispose()` 將它定義爲異步方法, 以便在數據庫中保留壹些數據. 事實上此方法很適合在遊戲結束時把玩家數據存進數據庫裏.

參見 [優雅關閉](/server/graceful-shutdown).

---

### 房間示例
此示例演示了房間 `onCreate`, `onJoin` 和 `onMessage` 的用法.

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";

// 壹個抽象玩家對象, 表達其在2D世界的位置
export class Player extends Schema {
  @type("number")
  x: number = 0.11;

  @type("number")
  y: number = 2.22;
}

// 自定義遊戲狀態, 當前只有以 Player 爲元素的壹個 ArraySchema
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  // 在 room 實例化時 Colyseus 會自動調用此函數
  onCreate(options: any) {
    // 初始化房間狀態
    this.setState(new State());

    // 房間接到 "move" 消息時調用
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // 客戶端進入房間時自動調用此函數
  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

// 壹個抽象玩家對象, 表達其在2D世界的位置
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

// 自定義遊戲狀態, 當前只有以 Player 爲元素的壹個 ArraySchema
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
  // 在 room 實例化時 Colyseus 會自動調用此函數
  onCreate(options) {
    // 初始化房間狀態
    this.setState(new State());

    // 房間接到 "move" 消息時調用
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.x += data.x;
      player.y += data.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }

  // 客戶端進入房間時自動調用此函數
  onJoin(client, options) {
    this.state.players.set(client.sessionId, new Player());
  }
}
```

---

### `onBeforePatch ()`

按照補丁頻率, 每次在 state 同步之前都會觸發 `onBeforePatch` 生命周期函數. (參見 [setPatchRate()](#setpatchrate-milliseconds))

```typescript
onBeforePatch() {
    //
    // 這裏可以對 state 做出某些處理,
    // 然後 state 就會被序列化並傳送給所有客戶端
    //
}
```

---

### `onCacheRoom (): any`

當 [`devMode`](/colyseus/devmode) 開啓時, 作爲外部數據緩存的可選回調函數.
(詳見 [恢複房間 state 之外的數據](/colyseus/devmode/#restoring-data-outside-the-rooms-state))

```typescript fct_label="JavaScript"
export class MyRoom extends Room<MyRoomState> {
  ...

  onCacheRoom() {
    return { foo: "bar" };
  }
}
```

---

### `onRestoreData (cachedData: any): void`

當 [`devMode`](/colyseus/devmode) 開啓時, 用來恢複/重建從上壹個回調 [`onCacheRoom`](/colyseus/server/room/#oncacheroom-any) 返回並保存的數據的可選回調函數.
(詳見 [恢複房間 state 之外的數據](/colyseus/devmode/#restoring-data-outside-the-rooms-state))

```typescript fct_label="JavaScript"
export class MyRoom extends Room<MyRoomState> {
  ...

  onRestoreRoom(cachedData: any): void {
    console.log("ROOM HAS BEEN RESTORED!", cachedData);

    this.state.players.forEach(player => {
      player.method(cachedData["foo"]);
    });
  }
}
```

---

## 公開方法

房間公開了以下方法.

### `onMessage (type, callback)`

注冊壹個回調, 以處理客戶端發送的各類型的消息.

`type` 參數可以是 `string` 或 `number` 類型

**某壹類型消息回調**

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        console.log(client.sessionId, "sent 'action' message: ", message);
    });
}
```

**通用類型消息回調**

可以注冊壹個通用回調以處理所有類型的消息.

```typescript
onCreate () {
    this.onMessage("action", (client, message) => {
        //
        // 當收到 'action' 消息時觸發回調.
        //
    });

    this.onMessage("*", (client, type, message) => {
        //
        // 當收到其他各種消息時觸發回調,
        // 不包括 "action", 因爲已經提前對該類型消息進行了注冊.
        //
        console.log(client.sessionId, "sent", type, message);
    });
}
```

!!! tip "客戶端通過使用 `room.send()` 來發送消息"
    詳見 [`room.send()`](/client/client/#send-type-message)} 章節.

---

### `setState (object)`

設置房間同步狀態. 參見 [State Synchronization](/state/overview/) 和 [Schema](/state/schema/) 以了解更多信息.

!!! Tip
    設置同步狀態通常只需在 [`onCreate()`](#onCreate-options) 時調用壹次即可

!!! Warning
    房間狀態更新時不需要調用 `.setState()`. 因爲每次調用都會重置二叉樹路徑算法.

---

### `setSimulationInterval (callback[, milliseconds=16.6])`

(可選) 設置壹個可以更改遊戲狀態的模擬時間間隔. 代表遊戲更新循環. 默認模擬間隔: 16.6ms (60fps)

```typescript
onCreate () {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
}

update (deltaTime) {
    // 此處實現遊戲物理或者視覺更新!
    // 同時也是房間狀態更新的地方
}
```

---

### `setPatchRate (milliseconds)`

設置 state 補丁發送給所有客戶端的頻率. 默認值爲 `50`ms (20fps)

---


### `setPrivate (bool)`

將該房間設置爲私人房間(參數傳入 `false` 則表示設置爲公共房間).

私人房間不會出現在 [`>getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) 方法返回的房間列表中.

---

### `setMetadata (metadata)`

設置該房間的元數據. 每個房間實例都可附加元數據 - 附加元數據的唯壹目的在于客戶端使用 [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname) 獲取房間和通過 `roomId` 連接房間時能區分同名但不同屬性的房間.

```typescript
// 服務端
this.setMetadata({ friendlyFire: true });
```

此時房間已經附加了元數據, 舉例來說, 客戶端可以檢查哪個房間有 `friendlyFire`, 然後通過其 `roomId` 連接到想要進入的房間:

```javascript
// 客戶端
client.getAvailableRooms("battle").then(rooms => {
  for (var i=0; i<rooms.length; i++) {
    if (room.metadata?.friendlyFire) {
      //
      // 查找具有 `friendlyFire` 元數據的房間 id:
      //
      var room = client.join(room.roomId);
      return;
    }
  }
});
```

!!! Tip
    [其他語言客戶端的 `getAvailableRooms()` 參見這裏.](/client/client/#getavailablerooms-roomname)

---

### `setSeatReservationTime (seconds)`

設置該房間等待客戶端加入的秒數. 應該考慮 [`onAuth()`](#onauth-client-options-request) 需要等待多長時間, 以設置不同的座位預訂時間. 默認值爲 15 秒.

如果想要全局設置房間等待時間, 可以設置 `COLYSEUS_SEAT_RESERVATION_TIME` 環境變量.

---


### `send (client, message)`

!!! Warning "已棄用"
    `this.send()` 已被棄用. 請使用 [`client.send()`](/server/client/#sendtype-message) 代替.

---


### `broadcast (type, message, options?)`

向已連接的所有客戶端發送壹條消息廣播.

options 參數可以包含:

- **`except`**: 排除發送消息至這些 [`Client`](/server/client/)
- **`afterNextPatch`**: 等到下壹個狀態補丁再發送廣播消息

#### 廣播示例

向所有客戶端廣播壹條消息:

```typescript
onCreate() {
    this.onMessage("action", (client, message) => {
        // 廣播至所有客戶端
        this.broadcast("action-taken", "an action has been taken!");
    });
}
```

向所有客戶端廣播壹條消息, 發送者除外:

```typescript
onCreate() {
    this.onMessage("fire", (client, message) => {
        // 發送 "fire" 事件到所有客戶端, 除了發送者自己.
        this.broadcast("fire", message, { except: client });
    });
}
```

在應用狀態變更之後, 向所有客戶端廣播壹條消息:

```typescript
onCreate() {
    this.onMessage("destroy", (client, message) => {
        // 改變 state
        this.state.destroySomething();

        // 此消息會在 state 改變應用之後再到達客戶端
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });
}
```

廣播壹條 schema 消息:

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
    [關于客戶端如何使用 onMessage() 處理消息, 請參考這裏.](/colyseus/client/client/#onmessage)

---

### `lock ()`

鎖定房間會從供新客戶端連接的房間池中移除該房間.

---

### `unlock ()`

解鎖房會將房間重新添加至供新客戶連接的房間池中.

---

### `allowReconnection (client, seconds)`

允許指定的客戶 [`reconnect`](/client/#reconnect-reconnectiontoken) 房間. 必須在 [`onLeave()`](#onleave-client) 方法中使用.

- **`client`**: 掉線的 [`Client`](/server/client/) 實例
- **`seconds`**: 等待客戶端實施 [`.reconnect()`](/client/#reconnect-roomid-string-sessionid-string) 的秒數, 或者傳入參數值 `"manual"`, 來實現手動拒絕重連 (見下面第二個示例)

**返回類型:**

- `allowReconnection()` 返回壹個 `Deferred<Client>` 實例.
- `Deferred` 是壹個類似于 pormise 的類型
- `Deferred` 類型可以通過調用 `.reject()` 強制拒絕 promise (參見第二個示例)

**示例** 在 20 秒超時後拒絕重新連接.

```typescript
async onLeave (client: Client, consented: boolean) {
  // 標注客戶端離線
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // 允許離線客戶端在 20 秒內重新連接
    await this.allowReconnection(client, 20);

    // 客戶端回連, 標注其已連接.
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 秒超時. 移除離線客戶端.
    this.state.players.delete(client.sessionId);
  }
}
```


**示例** 使用自定義邏輯手動拒絕重連.

```typescript
async onLeave (client: Client, consented: boolean) {
  // 標注客戶端離線
  this.state.players.get(client.sessionId).connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    //
    // 獲取重連令牌
    // 注意: 這裏不要使用 `await`
    //
    const reconnection = this.allowReconnection(client, "manual");

    //
    // 這裏展示了自定義邏輯拒絕重連
    // 的 API 用法, 如果用戶 2 輪失敗
    // 則設置超時禁止重連,
    // (假設遊戲是回合制的)
    //
    // 實際操作中, 應該把 `reconnection` 保存在
    // 妳的 Player 實例中, 然後在自定義邏輯中
    // 進行檢測
    //
    const currentRound = this.state.currentRound;
    const interval = setInterval(() => {
      if ((this.state.currentRound - currentRound) > 2) {
        // 手動禁止客戶端重連
        reconnection.reject();
        clearInterval(interval);
      }
    }, 1000);

    // 允許離線重連
    await reconnection;

    // 客戶端回連, 標注其已連接.
    this.state.players.get(client.sessionId).connected = true;

  } catch (e) {

    // 20 秒超時. 移除離線客戶端.
    this.state.players.delete(client.sessionId);
  }
}
```

---

### `disconnect ()`

斷開所有客戶斷, 然後銷毀房間.

---

### `broadcastPatch ()`

!!! Warning "壹般不需要這樣做!"
    框架系統會自動調用此方法.

此方法會檢查 `state` 是否發生變化, 並將變化廣播給所有已連接的客戶端.

如果想要控制何時廣播補丁, 可以禁用默認補丁間隔時間來實現:

```typescript
onCreate() {
    // 關閉自動補丁廣播
    this.setPatchRate(null);

    // 確保計時有效
    this.setSimulationInterval(() => {/* */});

    this.clock.setInterval(() => {
        // 達到自定義條件, 廣播補丁.
        if (yourCondition) {
            this.broadcastPatch();
        }
    }, 2000);
}
```

---

## 公開屬性

### `roomId: string`

自動生成的 9 字符長的唯壹房間 id.

在 `onCreate()` 期間, 可以修改 `this.roomId`.

!!! Tip "使用自定義 `roomId` "
    請參考 [How-to &raquo; Customize room id](/how-to/custom-room-id/)

---

### `roomName: string`

房間名稱會作爲 [`gameServer.define()`](/server/api/#define-roomname-string-room-room-options-any) 的第壹個參數.

---

### `state: T`

提供給 [`setState()`](#setstate-object) 的狀態實例.

---

### `clients: Client[]`

已連接客戶端的數組. 參見 [Client instance](#client).

---

### `maxClients: number`

允許連接進入房間的最大客戶端數量.
當數量達到此限制時, 房間將自動鎖定.
房間除非通過 [lock()](#lock) 方法手動鎖定,
否則都會在客戶端斷開房間時立即解鎖.

---

### `patchRate: number`

將房間狀態發送至客戶端的頻率, 單位爲毫秒. 默認值爲 `50` ms (20fps)

---

### `autoDispose: boolean`

最後壹個客戶端斷開連接後, 自動銷毀房間. 默認值是 `true`

---

### `locked: boolean` (只讀)

以下情況會影響此屬性:

- 允許的客戶端數量已經達到 (`maxClients`)
- 用 [`lock()`](#lock) 或 [`unlock()`](#unlock) 手動鎖定或解鎖房間.

---

### `clock: ClockTimer`

壹個 [`ClockTimer`](https://github.com/gamestdio/timer#api) 實例,
用于 [timing events](/server/timing-events).

---

### Presence `Presence`

`presence` 實例. 查閱 [Presence API](/server/presence) 了解更多詳細信息.

---

## 客戶端

服務器端的 `client` 實例負責服務器與客戶端之間的 **transport** 層. 不應該與 [客戶端 SDK 裏的 `Client`](/client/client/) 相混淆, 因爲它們的意義完全不同!

可以通過 [`this.clients`](#clients-client), 在 [`Room#onJoin()`](#onjoin-client-options-auth), [`Room#onLeave()`](#onleave-client-consented) 和 [`Room#onMessage()`](#onmessage-type-callback) 中操作 `client` 實例.

!!! Note
    這是來自 [`ws`](https://www.npmjs.com/package/ws) 包的原始 WebSocket 連接. 還有更多的方法可用, 但是不建議用于 Colyseus.

### 屬性

#### `sessionId: string`

每個會話的唯壹 id.

!!! Note
    在客戶端, 可以在 [`room` 實例中找到 `sessionId`](/client/room/#sessionid-string).

---

#### `userData: any`

可用于存儲關于客戶端連接的自定義數據. `userData` **不會** 與客戶端同步, 僅用于保存指定用戶的連接.

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

### 方法

#### `send(type, message)`

發送某類型消息至客戶端. 消息使用 MsgPack 編碼, 可用于任何可序列化的 JSON 數據結構.

`type` 可以是 `string` 或 `number`.

**發送消息:**

```typescript
//
// 發送字符串類型消息 ("powerup")
//
client.send("powerup", { kind: "ammo" });

//
// 發送數字類型消息 (1)
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
    [查看如何在客戶端處理這些信息.](/colyseus/client/#onmessage)

---

#### `sendBytes(type, bytes)`

向客戶端發送字節數組.

參數 `type` 可以是壹個 `string` 或者是壹個 `number`.

當需要使用自定義編碼, 而不使用默認編碼器 (MsgPack) 時會很有用.

**發送消息:**

```typescript
//
// 發送字符串類型 ("powerup") 消息
//
client.sendBytes("powerup", [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);

//
// 發送數字類型 (1) 消息
//
client.sendBytes(1, [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);
```

---

#### `leave(code?: number)`

把 `client` 與房間強行斷開. 您可以在關閉連接時發送壹個介于 `4000` 和 `4999` 之間的自定義 `code` (參見 [WebSocket 斷線狀態代碼表](#websocket-close-codes-table))

!!! Tip
    這將在客戶端觸發 [`room.onLeave`](/client/room/#onleave) 事件.

##### WebSocket 斷線狀態代碼表

| 斷線代碼 (uint16) | 代碼名稱               | 內部使用 | 可自定義 | 說明 |
|---------------------|------------------------|----------|--------------|-------------|
| `0` - `999`             |                        | Yes      | No           | 未使用 |
| `1000`                | `CLOSE_NORMAL`         | No       | No           | 成功斷開 / 套接字斷開 |
| `1001`                | `CLOSE_GOING_AWAY`     | No       | No           | 客戶端離開 (浏覽器頁面關閉) |
| `1002`                | `CLOSE_PROTOCOL_ERROR` | Yes      | No           | 入口接到錯誤幀 |
| `1003`                | `CLOSE_UNSUPPORTED`    | Yes      | No           | 入口接到不支持幀 (例如二進制入口接到文本幀) |
| `1004`                |                        | Yes      | No           | 保留 |
| `1005`                | `CLOSED_NO_STATUS`     | Yes      | No           | 未收到狀態代碼的斷開 |
| `1006`                | `CLOSE_ABNORMAL`       | Yes      | No           | 收到無斷開代碼的幀 |
| `1007`                | *Unsupported payload*  | Yes      | No           | 入口接到錯誤消息 (例如非法 UTF-8) |
| `1008`                | *Policy violation*     | No       | No           | 1003 與 1009 之外的壹般狀態代碼|
| `1009`                | `CLOSE_TOO_LARGE`      | No       | No           | 入口接到無法處理的大數據幀 |
| `1010`                | *Mandatory extension*  | No       | No           | 客戶端發送了未協商的擴展數據 |
| `1011`                | *Server error*         | No       | No           | 運行中的服務器內部錯誤 |
| `1012`                | *Service restart*      | No       | No           | 服務器/服務正在重啓 |
| `1013`                | *Try again later*      | No       | No           | 服務器臨時狀況導致客戶端請求受阻 |
| `1014`                | *Bad gateway*          | No       | No           | 用于網關的服務器收到非法響應 |
| `1015`                | *TLS handshake fail*   | Yes      | No           | 傳輸層安全相關錯誤 |
| `1016` - `1999`         |                        | Yes      | No           | 爲未來的 WebSocket 標准保留. |
| `2000` - `2999`         |                        | Yes      | Yes          | 爲 WebSocket 擴展數據保留 |
| `3000` - `3999`         |                        | No       | Yes          | 用于支持其他庫或框架使用. 服務器可能不會用到. 可以通過 IANA 先到先得途徑注冊. |
| `4000` - `4999`         |                        | No       | Yes          | **用于應用服務器** |

---

#### `error(code, message)`

將錯誤代碼與消息壹並發送給客戶端. 客戶端可以在 [`onError`](/client/room/#onerror) 中對其進行處理.
