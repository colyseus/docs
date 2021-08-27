# Colyseus SDK » 使用

Colyseus 用戶端 SDK 目前可用於下列平台：

- [Unity](/getting-started/unity3d-client) ([view source-code](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([view source-code](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([view source-code](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([view source-code](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([view source-code](https://github.com/colyseus/colyseus-construct3))

## 用戶端執行個體：

`用戶端`執行個體用於平台配對呼叫。然後會連接至一或多個房間。 

\`\`\`typescript fct\_label="JavaScript" import Colyseus from "colyseus.js"; // ...

let client = new Colyseus.Client("ws://localhost:2567"); \`\`\`

\`\`\`csharp fct\_label="C#" using Colyseus; // ...

ColyseusClient client = new ColyseusClient("ws://localhost:2567"); \`\`\`

\`\`\`lua fct\_label="lua" local ColyseusClient = require("colyseus.client") // ...

local client = ColyseusClient.new("ws://localhost:2567"); \`\`\`

\`\`\`haxe fct\_label="Haxe" import io.colyseus.Client; // ...

var client = new Client("ws://localhost:2567"); \`\`\`

建立 `Client` 執行個體時，不會建立任何伺服器的連線。

### 方法

#### `joinOrCreate (roomName: string, options: any)`

透過提供的 `roomName` 和 `選項`，加入現有的房間或建立新的房間。

此方法會忽略鎖定或私人的房間。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.joinOrCreate("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.joinOrCreate("battle", {/* options */}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle"/* , Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join\_or\_create("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.joinOrCreate("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->joinOrCreate<YourStateClass>("battle", {/* options */}, \[=\](std::string err, Room<State>* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### `create (roomName: string, options: any)`

透過提供的 `roomName` 和`選項`，建立新的房間。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.create("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.create("battle", {/* options */}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.Create<YourStateClass>("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:create("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.create("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->create<YourStateClass>("battle", {/* options */}, \[=\](std::string err, Room<State>* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### `join (roomName: string, options: any)`

透過提供的 `roomName` 和 `options`，加入現有房間。

此方法會忽略鎖定或私人的房間。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.join("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.join("battle", {/* options */}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.Join<YourStateClass>("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.join("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->join<YourStateClass>("battle", {/* options */}, \[=\](std::string err, Room<State>* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### `joinById (roomId: string, options: any)`

透過其 `roomId`，加入現有的房間。可以透過 ID 加入私人房間。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.joinById("KRYAKzRo2", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.joinById("KRYAKzRo2", {/* options */}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.JoinById<YourStateClass>("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join\_by\_id("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.joinById("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->joinById<YourStateClass>("battle", {/* options */}, \[=\](std::string err, Room<State>* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

!!!提示「取得你可以加入的可用 `roomId`」查看 [`getAvailableRooms()`](#getavailablerooms-roomname-string) 以擷取房間清單，附帶其個別可用於加入的 `roomId` 以及其中繼資料。
    
---

#### `reconnect (roomId: string, sessionId: string)`

重新將用戶端連接至其先前已連接的房間。

必須在伺服器端與 [`allowReconnection()`](/server/room#allowreconnection-client-seconds) 一起使用。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.reconnect("wNHTX5qik", "SkNaHTazQ"); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.reconnect("wNHTX5qik", "SkNaHTazQ").then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.Reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ"); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:reconnect("wNHTX5qik", "SkNaHTazQ", function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.reconnect("wNHTX5qik", "SkNaHTazQ", YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`haxe fct\_label="C++" client->reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ", \[=\](std::string err, Room<State>\* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### `getAvailableRooms (roomName?: string)`

查詢所有可用房間以進行連接。

- 鎖定和私人的房間不會列出。 
- 如果省略 `roomName` 參數，則會查詢所有房間。

```typescript fct_label="JavaScript" client.getAvailableRooms("battle").then(rooms => { rooms.forEach((room) => { console.log(room.roomId); console.log(room.clients); console.log(room.maxClients); console.log(room.metadata); }); }).catch(e => { console.error(e); }); ```

\`\`\`csharp fct\_label="C#" try { var rooms = await client.GetAvailableRooms("battle"); for (int i = 0; i < rooms.Length; i++) { Debug.Log(rooms\[i].roomId); Debug.Log(rooms\[i].clients); Debug.Log(rooms\[i].maxClients); Debug.Log(rooms\[i].metadata); } } catch (ex) { Debug.Log(ex.Message) }

/\** * Retrieving custom metadata \*/ \[Serializable] class Metadata { public string mode; public string name; }

\[Serializable] class CustomRoomAvailable :RoomAvailable { public Metadata metadata; }

var rooms = await client.GetAvailableRooms<CustomRoomAvailable>("battle"); Debug.Log(rooms\[0].metadata.mode); \`\`\`

\`\`\`lua fct\_label="lua" client:get\_available\_rooms("battle", function(err, rooms) if (err) then console.error(err); return end

  for i, room in pairs(rooms) do print(room.roomId) print(room.clients) print(room.maxClients) print(room.metadata) end end); \`\`\`

\`\`\`haxe fct\_label="Haxe" client.getAvailableRooms("battle", function(err, rooms) { if (err != null) { trace(err); return; }

  for (room in rooms) { trace(room.roomId); trace(room.clients); trace(room.maxClients); trace(room.metadata); } }); \`\`\`

\`\`\`cpp fct\_label="C++" client.getAvailableRooms("battle", \[=\](std::string err, nlohmann::json rooms) { if (err != "") { std::cout << "error: " << err << std::endl; return; }

  // rooms }); \`\`\`

---

#### `consumeSeatReservation (reservation)`

透過手動取用「座位保留」加入房間。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.consumeSeatReservation(reservation); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

```typescript fct_label="JavaScript" client.consumeSeatReservation(reservation).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); ```

\`\`\`csharp fct\_label="C#" try { Room<YourStateClass> room = await client.ConsumeSeatReservation<YourStateClass>(reservation); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:consume\_seat\_reservation(reservation, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.consumeSeatReservation(reservation, YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->consumeSeatReservation<YourStateClass>(reservation, \[=\](std::string err, Room<State>\* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

!!!提示「進階使用」查看 [Match-maker API](/server/matchmaker/#reserveseatforroom-options) 以瞭解為用戶端在房間內手動保留座位的方式。

## 房間執行個體：

### 屬性

#### `state: any`

目前房間的狀態。變數一律與伺服器端的最新 `狀態` 同步。如需聽取整體狀態的更新，請查看 [`onStateChange`](#onstatechange) 事件。

你可以將回呼附加至狀態內的特定結構。[查看結構描述回呼](/state/schema/#client-side)。

---

#### `sessionId: string`

目前連接的用戶端的唯一識別碼。此屬性符合伺服器端的 [`client.sessionId`](/server/client/#sessionid-string)。

---

#### `ID：字串`

房間的唯一識別碼。你可以與其他用戶端分享此 ID 以允許其直接連接至此房間。

\`\`\`typescript fct\_label="JavaScript" // get `roomId` from the query string let roomId = location.href.match(/roomId=(\[a-zA-Z0-9-\_]+)/)\[1];

// 正在加入房間，依據為房間 id client.joinById(roomId).then(room => { // ... }); \`

---

#### `名稱：字串`

房間處理常式的名稱。例如： `「戰鬥」`。

---

### 方法

#### `send (type, message)`

將訊息的類型傳送至房間處理常式。訊息以 MsgPack 進行編碼，並可以保留任何 JSON 可序列化的資料結構。

\`\`\`typescript fct\_label="JavaScript" // // \`\`\`haxe fct\_label="Haxe" // // 正在傳送具有字串類型的訊息 // room.send("move", { direction: "left" }); // room.send("move", { direction: "left"});

// // // // 正在傳送具有數字類型的訊息 // room.send(0, { direction: "left" }); \`\`\` // room.send(0, { direction: "left"}); \`\`\`

\`\`\`csharp fct\_label="C#" // // 正在傳送具有字串類型的訊息 // await room.Send("move", new { direction = "left" });

// // 正在傳送具有數字類型的訊息 // await room.Send(0, new { direction = "left" }); \`\`\`

\`\`\`lua fct\_label="lua"
--
-- 正在傳送具有字串類型的訊息
--
room:send("move", { direction = "left" })

-- -- 正在傳送具有數字類型的訊息
--
room:send(0, { direction = "left" }) \`\`\`

\`\`\`haxe fct\_label="Haxe" // // 正在傳送具有字串類型的訊息 // room.send("move", { direction: "left" });

// // 正在傳送具有數字類型的訊息 // room.send(0, { direction: "left" }); \`\`\`

!!! 提示「使用伺服器端的 `Room#onMessage()` 來接收訊息」請查看 [Server-side API » Room - onMessage()](/server/room/#onmessage-type-callback) 區段。

---

#### `leave ()`

自房間中斷連接。

```typescript fct_label="JavaScript" room.leave(); ```

```csharp fct_label="C#" room.Leave(); ```

```lua fct_label="lua" room:leave() ```

```haxe fct_label="Haxe" room.leave(); ```

!!!提示使用 [Room#onLeave()](/server/room/#onleave-client-consented) 來處理自伺服器端中斷連接的問題。

---

#### `removeAllListeners()`

移除 `onMessage`、`onStateChange`、`onLeave` 和 `onError` 接聽程式。

### 事件

#### onStateChange

!!!提示「你可能會觸發特定結構描述結構的回呼」請查看 [狀態處理 » 結構描述 » 用戶端](/state/schema/#client-side) 區段以瞭解更多資訊。

此事件會在伺服器更新其狀態時觸發。

\`\`\`typescript fct\_label="JavaScript" room.onStateChange.once((state) => { console.log("this is the first room state!", state); });

room.onStateChange((state) => { console.log("the room state has been updated:", state); }); \`\`\`

\`\`\`csharp fct\_label="C#" room.OnStateChange += (state, isFirstState) => { if (isFirstState) { Debug.Log ("this is the first room state!"); }

  Debug.Log ("the room state has been updated"); } \`\`\`

```lua fct_label="lua" room:on("statechange", function(state) print("new state:", state) end) ```

```haxe fct_label="Haxe" room.onStateChange += function(state) { trace("new state:" + Std.string(state)); }; ```

```cpp fct_label="C++" room.onStateChange = [=](State>* state) { std::cout << "new state" << std::endl; // ... }; ```

---

#### onMessage

此事件會在伺服器直接或透過廣播傳送訊息至用戶端時觸發。

```typescript fct_label="JavaScript" room.onMessage("powerup", (message) => { console.log("message received from server"); console.log(message); }); ```

\`\`\`csharp fct\_label="C#" class PowerUpMessage { string kind; }

room.OnMessage<PowerUpMessage>("powerup", (message) => { Debug.Log ("message received from server"); Debug.Log(message); }); \`\`\`

```lua fct_label="lua" room:on_message("powerup", function(message) print("message received from server") print(message) end) ```

```haxe fct_label="Haxe" room.onMessage("powerup", function(message) { trace("message received from server"); trace(Std.string(message)); }); ```

```cpp fct_label="C++" room.onMessage("powerup", [=](msgpack::object message) -> void { std::cout << "message received from server" << std::endl; std::cout << message << std::endl; }); ```

!!!提示如需自伺服器直接傳送訊息至用戶端，你會需要使用 [client.send()](/server/client/#sendtype-message) 或 [room.broadcast()](/server/room/#broadcast-type-message-options)

---

#### onLeave

此事件會在用戶端離開房間時觸發。

```typescript fct_label="JavaScript" room.onLeave((code) => { console.log("client left the room"); }); ```

```csharp fct_label="C#" room.OnLeave += (code) => { Debug.Log ("client left the room"); } ```

```lua fct_label="lua" room:on("leave", function() print("client left the room") end) ```

```haxe fct_label="Haxe" room.onLeave += function () { trace("client left the room"); }; ```

```haxe fct_label="Haxe" room.onLeave = [=]() -> void { std::cout << "client left the room" << std::endl; }; ```

**可能的關閉`代碼`以及其意涵：**

- `1000` \- 一般通訊端關閉
- 在 `1001` 和 `1015` 之間 - 異常通訊端關閉 
- 在 `4000` 和 `4999` 之間 - 自訂通訊端關閉代碼（查看[更多詳細資料](/server/room/#table-of-websocket-close-codes)）


---

#### onError

此事件會在部分錯誤發生在房間處理常式時觸發。

```typescript fct_label="JavaScript" room.onError((code, message) => { console.log("oops, error ocurred:"); console.log(message); }); ```

```csharp fct_label="C#" room.OnError += (code, message) => { Debug.Log ("oops, error ocurred:"); Debug.Log(message); } ```

```lua fct_label="lua" room:on("error", function(code, message) print("oops, error ocurred:") print(message) end) ```

```haxe fct_label="Haxe" room.onError += function(code, message) { trace("oops, error ocurred:"); trace(message); }; ```

```cpp fct_label="C++" room.onError = [=] (int code, std::string message) => void { std::cout << "oops, error ocurred: " << message << std::endl; }; ```
