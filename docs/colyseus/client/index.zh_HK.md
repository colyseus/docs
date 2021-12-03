# Colyseus SDK &raquo; 用法

目前 Colyseus 有以下平臺的客戶端 SDK:

- [Unity](/getting-started/unity3d-client) ([查看源代碼](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([查看源代碼](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([查看源代碼](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([查看源代碼](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([查看源代碼](https://github.com/colyseus/colyseus-construct3))

## 客戶端實例:

`客戶端` 實例用於執行匹配調用, 而後連線到一個或多個房間.

```typescript fct_label="JavaScript"
import Colyseus from "colyseus.js";
// ...

let client = new Colyseus.Client("ws://localhost:2567");
```

```csharp fct_label="C#"
using Colyseus;
// ...

ColyseusClient client = new ColyseusClient("ws://localhost:2567");
```

```lua fct_label="lua"
local ColyseusClient = require("colyseus.client")
// ...

local client = ColyseusClient.new("ws://localhost:2567");
```

```haxe fct_label="Haxe"
import io.colyseus.Client;
// ...

var client = new Client("ws://localhost:2567");
```

尚未通過創建 `客戶端` 實例建立起與伺服器的連線.

### 方法

#### `joinOrCreate (roomName: string, options: any)`

通過提供的 `roomName` 和 `options` 加入現有房間或創建新房間.

該方法不包括已鎖定房間或私人房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinOrCreate("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinOrCreate("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle"/* , Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_or_create("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinOrCreate<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `create (roomName: string, options: any)`

通過提供的 `roomName` 和 `options` 創建新房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.create("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.create("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Create<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:create("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.create("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->create<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `join (roomName: string, options: any)`

通過提供的 `roomName` 和 `options` 加入現有房間.

該方法不包括已鎖定房間或私人房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.join("battle", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.join("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Join<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.join("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->join<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `joinById (roomId: string, options: any)`

通過 `roomId` 加入現有房間. 私人房間可憑 id 進入私人房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinById("KRYAKzRo2", {/* options */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinById("KRYAKzRo2", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinById<YourStateClass>("battle", /* Dictionary of options */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_by_id("battle", {--[[options]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinById("battle", [/* options */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinById<YourStateClass>("battle", {/* options */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "獲取您可加入的房間的 `roomId`"
    參見 [`getAvailableRooms()`](#getavailablerooms-roomname-string) 來檢索可加入房間的列表和各房間的 `roomId`, 以及其元數據.

---

#### `reconnect (roomId: string, sessionId: string)`

將客戶端重新接入原先接入過的房間.

必須與伺服器端中的 [`allowReconnection()`](/server/room#allowreconnection-client-seconds) 一起使用.

```typescript fct_label="TypeScript"
try {
  const room = await client.reconnect("wNHTX5qik", "SkNaHTazQ");
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.reconnect("wNHTX5qik", "SkNaHTazQ").then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ");
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:reconnect("wNHTX5qik", "SkNaHTazQ", function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.reconnect("wNHTX5qik", "SkNaHTazQ", YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```haxe fct_label="C++"
client->reconnect<YourStateClass>("wNHTX5qik", "SkNaHTazQ", [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `getAvailableRooms (roomName?: string)`

查詢所有可接入的房間.

- 已鎖定及私人房間不包含在列表中.
- 若 `roomName` 參數被省略, 則對所有房間進行查詢.

```typescript fct_label="JavaScript"
client.getAvailableRooms("battle").then(rooms => {
  rooms.forEach((room) => {
    console.log(room.roomId);
    console.log(room.clients);
    console.log(room.maxClients);
    console.log(room.metadata);
  });
}).catch(e => {
  console.error(e);
});
```

```csharp fct_label="C#"
try {
  var rooms = await client.GetAvailableRooms("battle");
  for (int i = 0; i < rooms.Length; i++) {
    Debug.Log(rooms[i].roomId);
    Debug.Log(rooms[i].clients);
    Debug.Log(rooms[i].maxClients);
    Debug.Log(rooms[i].metadata);
  }
} catch (ex) {
  Debug.Log(ex.Message)
}

/**
 * Retrieving custom metadata
 */
[Serializable]
class Metadata
{
	public string mode;
	public string name;
}

[Serializable]
class CustomRoomAvailable : RoomAvailable
{
	public Metadata metadata;
}

var rooms = await client.GetAvailableRooms<CustomRoomAvailable>("battle");
Debug.Log(rooms[0].metadata.mode);
```

```lua fct_label="lua"
client:get_available_rooms("battle", function(err, rooms)
  if (err) then
    console.error(err);
    return
  end

  for i, room in pairs(rooms) do
    print(room.roomId)
    print(room.clients)
    print(room.maxClients)
    print(room.metadata)
  end
end);
```

```haxe fct_label="Haxe"
client.getAvailableRooms("battle", function(err, rooms) {
  if (err != null) {
    trace(err);
    return;
  }

  for (room in rooms) {
    trace(room.roomId);
    trace(room.clients);
    trace(room.maxClients);
    trace(room.metadata);
  }
});
```

```cpp fct_label="C++"
client.getAvailableRooms("battle", [=](std::string err, nlohmann::json rooms) {
  if (err != "") {
    std::cout << "error: " << err << std::endl;
    return;
  }

  // rooms
});
```

---

#### `consumeSeatReservation (reservation)`

通過手動使用 "席位預定" 功能加入房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.consumeSeatReservation(reservation);
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.consumeSeatReservation(reservation).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.ConsumeSeatReservation<YourStateClass>(reservation);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:consume_seat_reservation(reservation, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.consumeSeatReservation(reservation, YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->consumeSeatReservation<YourStateClass>(reservation, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "高級用法"
    參見 [Match-maker API](/server/matchmaker/#reserveseatforroom-options) 了解如何在房間內為某個客戶端預留席位.

## 房間實例:

### 屬性

#### `state: any`

當前房間狀態.該變數始終與伺服器端的最新 `狀態` 同步. 要想偵聽整體狀態的更新情況, 參見 [`onStateChange`](#onstatechange) 事件.

您可將回呼附加到您狀態內的特定架構上. [參見架構回呼](/state/schema/#client-side).

---

#### `sessionId: string`

當前已接入客戶端的唯一標識.該屬性與伺服器端中的 [`client.sessionId`](/server/client/#sessionid-string) 互相匹配.

---

#### `id: string`

房間的唯一標識將本 id 分享給其他客戶端, 則其他客戶端可直接接入本房間.

```typescript fct_label="JavaScript"
// get `roomId` from the query string
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// joining a room by its id
client.joinById(roomId).then(room => {
  // ...
});
```

---

#### `name: string`

房間處理程序的名稱. 示例: `"battle"`.

---

### 方法

#### `send (type, message)`

向房間處理程序發送一種類型的消息. 消息使用 MsgPack 編碼, 僅含有可序列化 JSON 數據結構.

```typescript fct_label="JavaScript"
//
// sending message with string type
//
room.send("move", { direction: "left"});

//
// sending message with number type
//
room.send(0, { direction: "left"});
```

```csharp fct_label="C#"
//
// sending message with string type
//
await room.Send("move", new { direction = "left" });

//
// sending message with number type
//
await room.Send(0, new { direction = "left" });
```

```lua fct_label="lua"
--
-- sending message with string type
--
room:send("move", { direction = "left" })

--
-- sending message with number type
--
room:send(0, { direction = "left" })
```

```haxe fct_label="Haxe"
//
// sending message with string type
//
room.send("move", { direction: "left" });

//
// sending message with number type
//
room.send(0, { direction: "left" });
```

!!! tip "使用伺服器端的 `Room#onMessage()` 進行資訊檢索"
    查看 [Server-side API » Room - onMessage()](/server/room/#onmessage-type-callback) 章節

---

#### `leave ()`

斷開與房間的連線.

**Parameters**

- `consented`: Whether the act of leaving has been "consented" or not (Default is `true`)

```typescript fct_label="JavaScript"
// consented leave
room.leave();

// unconsented leave
room.leave(false);
```

```csharp fct_label="C#"
// consented leave
room.Leave();

// unconsented leave
room.Leave(false);
```

```lua fct_label="lua"
-- consented leave
room:leave()

-- unconsented leave
room:leave(false)
```

```haxe fct_label="Haxe"
// consented leave
room.leave();

// unconsented leave
room.leave(false);
```

!!! Tip
    使用 [Room#onLeave()](/server/room/#onleave-client-consented) 來處理與伺服器端的斷連.

---

#### `removeAllListeners()`

移除 `onMessage`, `onStateChange`, `onLeave` 和 `onError` 偵聽程序.

---

### 事件

#### onStateChange

!!! Tip "您可為特定的 Schema 架構設置觸發回呼"
    更多詳情可查看 [狀態處理» Schema »客戶端](/state/schema/#client-side) 章節.

伺服器狀態更新時觸發該事件.

```typescript fct_label="JavaScript"
room.onStateChange.once((state) => {
  console.log("this is the first room state!", state);
});

room.onStateChange((state) => {
  console.log("the room state has been updated:", state);
});
```

```csharp fct_label="C#"
room.OnStateChange += (state, isFirstState) => {
  if (isFirstState) {
    Debug.Log ("this is the first room state!");
  }

  Debug.Log ("the room state has been updated");
}
```

```lua fct_label="lua"
room:on("statechange", function(state)
  print("new state:", state)
end)
```

```haxe fct_label="Haxe"
room.onStateChange += function(state) {
  trace("new state:" + Std.string(state));
};
```

```cpp fct_label="C++"
room.onStateChange = [=](State>* state) {
  std::cout << "new state" << std::endl;
  // ...
};
```

---

#### onMessage

伺服器直接或通過廣播向客戶端發送消息時觸發該事件.

```typescript fct_label="JavaScript"
room.onMessage("powerup", (message) => {
  console.log("message received from server");
  console.log(message);
});
```

```csharp fct_label="C#"
class PowerUpMessage {
  string kind;
}

room.OnMessage<PowerUpMessage>("powerup", (message) => {
  Debug.Log ("message received from server");
  Debug.Log(message);
});
```

```lua fct_label="lua"
room:on_message("powerup", function(message)
  print("message received from server")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onMessage("powerup", function(message) {
  trace("message received from server");
  trace(Std.string(message));
});
```

```cpp fct_label="C++"
room.onMessage("powerup", [=](msgpack::object message) -> void {
    std::cout << "message received from server" << std::endl;
    std::cout << message << std::endl;
});
```

!!! Tip
    若要從伺服器直接發送消息至客戶端,您需要使用 [client.send()](/server/client/#sendtype-message) 或 [room.broadcast()](/server/room/#broadcast-type-message-options) 進行操作.

---

#### onLeave

客戶端離開房間時觸發該事件.

```typescript fct_label="JavaScript"
room.onLeave((code) => {
  console.log("client left the room");
});
```

```csharp fct_label="C#"
room.OnLeave += (code) => {
  Debug.Log ("client left the room");
}
```

```lua fct_label="lua"
room:on("leave", function()
  print("client left the room")
end)
```

```haxe fct_label="Haxe"
room.onLeave += function () {
  trace("client left the room");
};
```

```haxe fct_label="Haxe"
room.onLeave = [=]() -> void {
  std::cout << "client left the room" << std::endl;
};
```

**可能出現的關閉 `代碼` 及其含義:**

- `1000` - 定期關閉套接字
- `1001` 到 `1015` 之間 - 套接字異常關閉
- `4000` 到 `4999` 之間 - 自定義套接字關閉代碼(查看 [更多詳細資訊](/server/room/#table-of-websocket-close-codes))


---

#### onError

房間處理程序發生錯誤時觸發該事件.

```typescript fct_label="JavaScript"
room.onError((code, message) => {
  console.log("oops, error ocurred:");
  console.log(message);
});
```

```csharp fct_label="C#"
room.OnError += (code, message) => {
  Debug.Log ("oops, error ocurred:");
  Debug.Log(message);
}
```

```lua fct_label="lua"
room:on("error", function(code, message)
  print("oops, error ocurred:")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onError += function(code, message) {
  trace("oops, error ocurred:");
  trace(message);
};
```

```cpp fct_label="C++"
room.onError = [=] (int code, std::string message) => void {
  std::cout << "oops, error ocurred: " << message << std::endl;
};
```
