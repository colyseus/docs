# Colyseus 客戶端 SDK

目前 Colyseus 有以下平臺的客戶端 SDK:

- [Unity](/getting-started/unity3d-client) ([查看源代碼](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([查看源代碼](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([查看源代碼](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([查看源代碼](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([查看源代碼](https://github.com/colyseus/colyseus-construct3))
- [Cocos Creator](/getting-started/cocos-creator)

## 客戶端實例:

`客戶端` 實例用於執行匹配調用, 而後連接到一個或多個房間.

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

創建好 `Client` 實例不代表已經建立起與服務器的連接.

### 方法

#### `joinOrCreate (roomName: string, options: any)`

通過提供 `roomName` 和 `options` 參數加入現有房間或創建新房間.

該函數忽略已鎖定房間和私人房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinOrCreate("battle", {/* 參數 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinOrCreate("battle", {/* 參數 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle", /* 參數字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_or_create("battle", {--[[參數]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("battle", [/* 參數 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinOrCreate<YourStateClass>("battle", {/* 參數 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `create (roomName: string, options: any)`

通過提供 `roomName` 和 `options` 參數創建新房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.create("battle", {/* 參數 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.create("battle", {/* 參數 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Create<YourStateClass>("battle", /* 參數字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:create("battle", {--[[參數]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.create("battle", [/* 參數 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->create<YourStateClass>("battle", {/* 參數 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `join (roomName: string, options: any)`

通過提供 `roomName` 和 `options` 加入現有房間.

該方法忽略已鎖定房間和私人房間.

```typescript fct_label="TypeScript"
try {
  const room = await client.join("battle", {/* 參數 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.join("battle", {/* 參數 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Join<YourStateClass>("battle", /* 參數字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join("battle", {--[[參數]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.join("battle", [/* 參數 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->join<YourStateClass>("battle", {/* 參數 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `joinById (roomId: string, options: any)`

通過提供 `roomId` 參數加入該房間. 私人房間也可憑房間 id 加入.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinById("KRYAKzRo2", {/* 參數 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinById("KRYAKzRo2", {/* 參數 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinById<YourStateClass>("battle", /* 參數字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_by_id("battle", {--[[參數]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinById("battle", [/* 參數 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinById<YourStateClass>("battle", {/* 參數 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "獲取可加入房間的 `roomId`"
    使用 [`getAvailableRooms()`](#getavailablerooms-roomname-string) 來查找可加入房間的列表和各房間的 `roomId`, 及其 metadata.

---

#### `reconnect (reconnectionToken)`

將斷線客戶端重新接入原來的房間.

- 必須在連接有效時提前保存 / 緩存好 `room.reconnectionToken` 以便以後斷線重連.
- 為了讓指定客戶端斷線重連, 服務器端需調用該 client 實例上的 [.`allowReconnection()`](/server/room#allowreconnection-client-seconds) 方法.

```typescript fct_label="TypeScript"
try {
  const room = await client.reconnect(cachedReconnectionToken);
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.reconnect(cachedReconnectionToken).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Reconnect<YourStateClass>(cachedReconnectionToken);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:reconnect(cached_reconnection_token, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.reconnect(cachedReconnectionToken, YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

<!-- ```haxe fct_label="C++"
client->reconnect<YourStateClass>(cachedReconnectionToken, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
``` -->

---

#### `getAvailableRooms (roomName?: string)`

查詢所有可接入的房間.

- 已鎖定及私人房間不包含在返回列表中.
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

手動調用 "席位預定" 功能加入房間.

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

## Room 實例:

### 屬性

#### `state: any`

當前房間狀態. 該變量始終與服務器端的最新 `state` 同步. 要想偵聽整體狀態的更新情況, 參見
[`onStateChange`](#onstatechange) 事件.

您還可將回調監聽於 state 內的某指定內容上. [參見 schema 回調](/state/schema/#client-side).

---

#### `sessionId: string`

當前已接入客戶端的唯一標識. 該屬性與服務器端的 [`client.sessionId`](/server/client/#sessionid-string) 一致.

---

#### `id: string`

房間的唯一標識. 您可將此 id 分享出去, 以便其他客戶端可直接連入該房間.

```typescript fct_label="JavaScript"
// 從搜索字符串中提取 `roomId`
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// 通過該 id 加入房間
client.joinById(roomId).then(room => {
  // ...
});
```

---

#### `name: string`

房間類別名稱. 比如: `"battle"`.

---

### 方法

#### `send (type, message)`

向房間程序發送某類型的消息. 消息使用 MsgPack 編碼並支持包含任何 JSON-serializable 的數據結構.

```typescript fct_label="JavaScript"
//
// 發送字符串類型的消息
//
room.send("move", { direction: "left"});

//
// 發送數字類型的消息
//
room.send(0, { direction: "left"});
```

```csharp fct_label="C#"
//
// 發送字符串類型的消息
//
await room.Send("move", new { direction = "left" });

//
// 發送數字類型的消息
//
await room.Send(0, new { direction = "left" });
```

```lua fct_label="lua"
--
-- 發送字符串類型的消息
--
room:send("move", { direction = "left" })

--
-- 發送數字類型的消息
--
room:send(0, { direction = "left" })
```

```haxe fct_label="Haxe"
//
// 發送字符串類型的消息
//
room.send("move", { direction: "left" });

//
// 發送數字類型的消息
//
room.send(0, { direction: "left" });
```

!!! tip "使用服務器端的 `Room#onMessage()` 來接收消息"
    參見 [Server-side API » Room - onMessage()](/server/room/#onmessage-type-callback) 章節.

---

#### `sendBytes (type, bytes)`

發送純字節數組數據消息到服務器. 字節數組就是元素為 `0` 到 `255` 數字的數組.

這在需要自定義編碼, 而不使用默認編碼 (MsgPack) 的需求下很有用.

```typescript fct_label="JavaScript"
//
// 發送數字類型的消息
//
room.send(0, [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);


//
// 發送字符串類型的消息
//
room.send("some-bytes", [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);
```

---

#### `leave (consented: boolean)`

斷開客戶端與房間的連接.

**參數**

- `consented`: 離開動作是否 "符合預期" (默認為 `true`)

```typescript fct_label="JavaScript"
// 正常離開
room.leave();

// 異常離開
room.leave(false);
```

```csharp fct_label="C#"
// 正常離開
room.Leave();

// 異常離開
room.Leave(false);
```

```lua fct_label="lua"
-- 正常離開
room:leave()

-- 異常離開
room:leave(false)
```

```haxe fct_label="Haxe"
// 正常離開
room.leave();

// 異常離開
room.leave(false);
```

!!! Tip
    服務端使用 [Room#onLeave()](/server/room/#onleave-client-consented) 來處理客戶端離開事件.

---

#### `removeAllListeners()`

移除 `onMessage`, `onStateChange`, `onLeave` 和 `onError` 偵聽器.

### 事件

#### onStateChange

!!! Tip "您可為 Schema 結構指定內容設置回調"
    更多詳情請見 [狀態處理 » Schema » 客戶端](/state/schema/#client-side) 章節.

服務器狀態更新時觸發該事件.

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

服務器直接或廣播向客戶端發送消息時觸發該事件.

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
    若要從服務器向客戶端發送消息, 您需要調用
    [client.send()](/server/client/#sendtype-message) 或
    [room.broadcast()](/server/room/#broadcast-type-message-options) 方法.

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

**可能出現的套接字斷開 `代碼` 及其含義:**

- `1000` - 正常關閉套接字
- `1001` 到 `1015` - 異常關閉套接字
- `4000` 到 `4999` - 自定義關閉套接字代碼 (參考 [更多詳細信息](/server/room/#table-of-websocket-close-codes))


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