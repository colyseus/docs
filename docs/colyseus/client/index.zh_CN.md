# Colyseus 客户端 SDK

目前 Colyseus 有以下平台的客户端 SDK:

- [Unity](/getting-started/unity3d-client) ([查看源代码](https://github.com/colyseus/colyseus-unity3d))
- [JavaScript/TypeScript](/getting-started/javascript-client) ([查看源代码](https://github.com/colyseus/colyseus.js))
- [Defold Engine](/getting-started/defold-client) ([查看源代码](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([查看源代码](https://github.com/colyseus/colyseus-hx))
- [Construct3](/getting-started/construct3-client) ([查看源代码](https://github.com/colyseus/colyseus-construct3))
- [Cocos Creator](/getting-started/cocos-creator)

## 客户端实例:

`客户端` 实例用于执行匹配调用, 而后连接到一个或多个房间.

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

创建好 `Client` 实例不代表已经建立起与服务器的连接.

### 方法

#### `joinOrCreate (roomName: string, options: any)`

通过提供 `roomName` 和 `options` 参数加入现有房间或创建新房间.

该函数忽略已锁定房间和私人房间.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinOrCreate("battle", {/* 参数 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinOrCreate("battle", {/* 参数 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle", /* 参数字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_or_create("battle", {--[[参数]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("battle", [/* 参数 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinOrCreate<YourStateClass>("battle", {/* 参数 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `create (roomName: string, options: any)`

通过提供 `roomName` 和 `options` 参数创建新房间.

```typescript fct_label="TypeScript"
try {
  const room = await client.create("battle", {/* 参数 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.create("battle", {/* 参数 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Create<YourStateClass>("battle", /* 参数字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:create("battle", {--[[参数]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.create("battle", [/* 参数 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->create<YourStateClass>("battle", {/* 参数 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `join (roomName: string, options: any)`

通过提供 `roomName` 和 `options` 加入现有房间.

该方法忽略已锁定房间和私人房间.

```typescript fct_label="TypeScript"
try {
  const room = await client.join("battle", {/* 参数 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.join("battle", {/* 参数 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.Join<YourStateClass>("battle", /* 参数字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join("battle", {--[[参数]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.join("battle", [/* 参数 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->join<YourStateClass>("battle", {/* 参数 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

---

#### `joinById (roomId: string, options: any)`

通过提供 `roomId` 参数加入该房间. 私人房间也可凭房间 id 加入.

```typescript fct_label="TypeScript"
try {
  const room = await client.joinById("KRYAKzRo2", {/* 参数 */});
  console.log("joined successfully", room);

} catch (e) {
  console.error("join error", e);
}
```

```typescript fct_label="JavaScript"
client.joinById("KRYAKzRo2", {/* 参数 */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinById<YourStateClass>("battle", /* 参数字典 */);
  Debug.Log("joined successfully");

} catch (ex) {
  Debug.Log("join error");
  Debug.Log(ex.Message);
}
```

```lua fct_label="lua"
client:join_by_id("battle", {--[[参数]]}, function(err, room)
  if (err ~= nil) then
    print("join error: " .. err)
    return
  end

  print("joined successfully")
end)
```

```haxe fct_label="Haxe"
client.joinById("battle", [/* 参数 */], YourStateClass, function(err, room) {
  if (err != null) {
    trace("join error: " + err);
    return;
  }

  trace("joined successfully");
});
```

```cpp fct_label="C++"
client->joinById<YourStateClass>("battle", {/* 参数 */}, [=](std::string err, Room<State>* room) {
  if (err != "") {
    std::cout << "join error: " << err << std::endl;
    return;
  }

  std::cout << "joined successfully" << std::endl;
});
```

!!! Tip "获取可加入房间的 `roomId`"
    使用 [`getAvailableRooms()`](#getavailablerooms-roomname-string) 来查找可加入房间的列表和各房间的 `roomId`, 及其 metadata.

---

#### `reconnect (reconnectionToken)`

将断线客户端重新接入原来的房间.

- 必须在连接有效时提前保存 / 缓存好 `room.reconnectionToken` 以便以后断线重连.
- 为了让指定客户端断线重连, 服务器端需调用该 client 实例上的 [.`allowReconnection()`](/server/room#allowreconnection-client-seconds) 方法.

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

查询所有可接入的房间.

- 已锁定及私人房间不包含在返回列表中.
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

手动调用 "席位预定" 功能加入房间.

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

## Room 实例:

### 属性

#### `state: any`

当前房间状态. 该变量始终与服务器端的最新 `state` 同步. 要想侦听整体状态的更新情况, 参见
[`onStateChange`](#onstatechange) 事件.

您还可将回调监听于 state 内的某指定内容上. [参见 schema 回调](/state/schema/#client-side).

---

#### `sessionId: string`

当前已接入客户端的唯一标识. 该属性与服务器端的 [`client.sessionId`](/server/client/#sessionid-string) 一致.

---

#### `id: string`

房间的唯一标识. 您可将此 id 分享出去, 以便其他客户端可直接连入该房间.

```typescript fct_label="JavaScript"
// 从搜索字符串中提取 `roomId`
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// 通过该 id 加入房间
client.joinById(roomId).then(room => {
  // ...
});
```

---

#### `name: string`

房间类别名称. 比如: `"battle"`.

---

### 方法

#### `send (type, message)`

向房间程序发送某类型的消息. 消息使用 MsgPack 编码并支持包含任何 JSON-serializable 的数据结构.

```typescript fct_label="JavaScript"
//
// 发送字符串类型的消息
//
room.send("move", { direction: "left"});

//
// 发送数字类型的消息
//
room.send(0, { direction: "left"});
```

```csharp fct_label="C#"
//
// 发送字符串类型的消息
//
await room.Send("move", new { direction = "left" });

//
// 发送数字类型的消息
//
await room.Send(0, new { direction = "left" });
```

```lua fct_label="lua"
--
-- 发送字符串类型的消息
--
room:send("move", { direction = "left" })

--
-- 发送数字类型的消息
--
room:send(0, { direction = "left" })
```

```haxe fct_label="Haxe"
//
// 发送字符串类型的消息
//
room.send("move", { direction: "left" });

//
// 发送数字类型的消息
//
room.send(0, { direction: "left" });
```

!!! tip "使用服务器端的 `Room#onMessage()` 来接收消息"
    参见 [Server-side API » Room - onMessage()](/server/room/#onmessage-type-callback) 章节.

---

#### `sendBytes (type, bytes)`

发送纯字节数组数据消息到服务器. 字节数组就是元素为 `0` 到 `255` 数字的数组.

这在需要自定义编码, 而不使用默认编码 (MsgPack) 的需求下很有用.

```typescript fct_label="JavaScript"
//
// 发送数字类型的消息
//
room.send(0, [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);


//
// 发送字符串类型的消息
//
room.send("some-bytes", [ 172, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33 ]);
```

---

#### `leave (consented: boolean)`

断开客户端与房间的连接.

**参数**

- `consented`: 离开动作是否 "符合预期" (默认为 `true`)

```typescript fct_label="JavaScript"
// 正常离开
room.leave();

// 异常离开
room.leave(false);
```

```csharp fct_label="C#"
// 正常离开
room.Leave();

// 异常离开
room.Leave(false);
```

```lua fct_label="lua"
-- 正常离开
room:leave()

-- 异常离开
room:leave(false)
```

```haxe fct_label="Haxe"
// 正常离开
room.leave();

// 异常离开
room.leave(false);
```

!!! Tip
    服务端使用 [Room#onLeave()](/server/room/#onleave-client-consented) 来处理客户端离开事件.

---

#### `removeAllListeners()`

移除 `onMessage`, `onStateChange`, `onLeave` 和 `onError` 侦听器.

### 事件

#### onStateChange

!!! Tip "您可为 Schema 结构指定内容设置回调"
    更多详情请见 [状态处理 » Schema » 客户端](/state/schema/#client-side) 章节.

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

服务器直接或广播向客户端发送消息时触发该事件.

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
    若要从服务器向客户端发送消息, 您需要调用
    [client.send()](/server/client/#sendtype-message) 或
    [room.broadcast()](/server/room/#broadcast-type-message-options) 方法.

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

**可能出现的套接字断开 `代码` 及其含义:**

- `1000` - 正常关闭套接字
- `1001` 到 `1015` - 异常关闭套接字
- `4000` 到 `4999` - 自定义关闭套接字代码 (参考 [更多详细信息](/server/room/#table-of-websocket-close-codes))


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