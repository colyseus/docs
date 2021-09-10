# Colyseus SDK &raquo; 用法

目前 Colyseus 有以下平台的客户端 SDK：

- [Unity](/getting-started/unity3d-client) ([查看源代码](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([查看源代码](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([查看源代码](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([查看源代码](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([查看源代码](https://github.com/colyseus/colyseus-construct3))

## 客户端实例：

`客户端` 实例用于执行匹配调用,而后连接到一个或多个房间.

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

尚未通过创建 `客户端` 实例建立起与服务器的连接.

### 方法

#### `joinOrCreate (roomName: string, options: any)`

通过提供的 `roomName` 和 `options` 加入现有房间或创建新房间.

该方法不包括已锁定房间或私人房间.

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

通过提供的 `roomName` 和 `options` 创建新房间.

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

通过提供的 `roomName` 和 `options` 加入现有房间.

该方法不包括已锁定房间或私人房间.

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

通过 `roomId` 加入现有房间. 私人房间可凭 id 进入私人房间.

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

!!! Tip "获取您可加入的房间的 `roomId`"
    参见 [`getAvailableRooms()`](#getavailablerooms-roomname-string) 来检索可加入房间的列表和各房间的 `roomId`,以及其元数据.

---

#### `reconnect (roomId: string, sessionId: string)`

将客户端重新接入原先接入过的房间.

必须与服务器端中的 [`allowReconnection()`](/server/room#allowreconnection-client-seconds) 一起使用.

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

查询所有可接入的房间.

- 已锁定及私人房间不包含在列表中.
- 若 `roomName` 参数被省略, 则对所有房间进行查询.

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

通过手动使用 "席位预定" 功能加入房间.

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

!!! Tip "高级用法"
    参见 [Match-maker API](/server/matchmaker/#reserveseatforroom-options) 了解如何在房间内为某个客户端预留席位.

## 房间实例：

### 属性

#### `state: any`

当前房间状态.该变量始终与服务器端的最新 `状态` 同步.要想侦听整体状态的更新情况,参见 [`onStateChange`](#onstatechange) 事件.

您可将回调附加到您状态内的特定架构上. [参见架构回调](/state/schema/#client-side).

---

#### `sessionId: string`

当前已接入客户端的唯一标识.该属性与服务器端中的 [`client.sessionId`](/server/client/#sessionid-string) 互相匹配.

---

#### `id: string`

房间的唯一标识将本 id 分享给其他客户端, 则其他客户端可直接接入本房间.

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

房间处理程序的名称.示例：`"battle"`.

---

### 方法

#### `send (type, message)`

向房间处理程序发送一种类型的消息. 消息使用 MsgPack 编码, 仅含有可序列化 JSON 数据结构.

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

!!! tip "使用服务器端的 `Room#onMessage()` 进行信息检索"
    查看[Server-side API » Room - onMessage()](/server/room/#onmessage-type-callback)章节

---

#### `leave ()`

断开与房间的连接.

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
    使用 [Room#onLeave()](/server/room/#onleave-client-consented) 来处理与服务器端的断连.

---

#### `removeAllListeners()`

移除 `onMessage`, `onStateChange`, `onLeave` 和 `onError` 侦听程序.

### 事件

#### onStateChange

!!! Tip "您可为特定的 Schema 架构设置触发回调"
    更多详情可查看 [状态处理» Schema »客户端](/state/schema/#client-side) 章节.

服务器状态更新时触发该事件.

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

服务器直接或通过广播向客户端发送消息时触发该事件.

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
    若要从服务器直接发送消息至客户端,您需要使用 [client.send()](/server/client/#sendtype-message) 或 [room.broadcast()](/server/room/#broadcast-type-message-options) 进行操作.

---

#### onLeave

客户端离开房间时触发该事件.

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

**可能出现的关闭 `代码` 及其含义：**

- `1000` - 定期关闭套接字
- `1001` 到 `1015` 之间 - 套接字异常关闭
- `4000` 到 `4999` 之间 - 自定义套接字关闭代码(查看 [更多详细信息](/server/room/#table-of-websocket-close-codes))


---

#### onError

房间处理程序发生错误时触发该事件.

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
