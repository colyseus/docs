# Colyseus SDK  »  用法

目前 Colyseus 有以下平台的客户端 SDK：

- {1>Unity<1} ({2>查看源代码<2})
- {1>JavaScript/TypeScript<1} ({2>查看源代码<2})
- {1>Defold Engine<1} ({2>查看源代码<2})
- {1>Haxe<1} ({2>查看源代码<2})
- {1>Construct3<1} ({2>查看源代码<2})

## 客户端实例：

{1>客户端<1}实例用于执行匹配调用，而后连接到一个或多个房间。 

\`\`\`typescript fct\_label="JavaScript" import Colyseus from "colyseus.js"; // ...

let client = new Colyseus.Client("ws://localhost:2567"); \`\`\`

\`\`\`csharp fct\_label="C#" using Colyseus; // ...

ColyseusClient client = new ColyseusClient("ws://localhost:2567"); \`\`\`

\`\`\`lua fct\_label="lua" local ColyseusClient = require("colyseus.client") // ...

local client = ColyseusClient.new("ws://localhost:2567"); \`\`\`

\`\`\`haxe fct\_label="Haxe" import io.colyseus.Client; // ...

var client = new Client("ws://localhost:2567"); \`\`\`

尚未通过创建{1>客户端<1}实例建立起与服务器的连接。

### 方法。

#### {1>joinOrCreate (roomName: string, options: any)<1}

通过提供的 {1>roomName<1} 和 {2>options<2} 加入现有房间或创建新房间。

该方法不包括已锁定房间或私人房间。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.joinOrCreate("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

{1>typescript fct\_label="JavaScript" client.joinOrCreate("battle", {/* options \*/}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); <1}

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.JoinOrCreate{2}("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join\_or\_create("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.joinOrCreate("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->joinOrCreate{1}("battle", {/* options {2>/}, \[=\](std::string err, Room{3}<2} room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### {1>create (roomName: string, options: any)<1}

通过提供的 {1>roomName<1} 和 {2>options<2} 创建新房间。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.create("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

{1>typescript fct\_label="JavaScript" client.create("battle", {/* options \*/}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); <1}

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.Create{2}("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:create("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.create("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->create{1}("battle", {/* options {2>/}, \[=\](std::string err, Room{3}<2} room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### {1>join (roomName: string, options: any)<1}

通过提供的 {1>roomName<1} 和 {2>options<2} 加入现有房间。

该方法不包括已锁定房间或私人房间。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.join("battle", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

{1>typescript fct\_label="JavaScript" client.join("battle", {/* options \*/}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); <1}

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.Join{2}("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.join("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->join{1}("battle", {/* options {2>/}, \[=\](std::string err, Room{3}<2} room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### {1>joinById (roomId: string, options: any)<1}

通过 {1>roomId<1} 加入现有房间。私人房间可凭 id 进入私人房间。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.joinById("KRYAKzRo2", {/* options \*/}); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

{1>typescript fct\_label="JavaScript" client.joinById("KRYAKzRo2", {/* options \*/}).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); <1}

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.JoinById{2}("battle", /* Dictionary of options \*/); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:join\_by\_id("battle", {--\[\[options]]}, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.joinById("battle", \[/* options \*/], YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->joinById{1}("battle", {/* options {2>/}, \[=\](std::string err, Room{3}<2} room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

!!!提示 “获取您可加入的房间的 {1>roomId<1}”。参见{2>{3>getAvailableRooms()<3}<2}来检索可加入房间的列表和各房间的 {4>roomId<4}，以及其元数据。
    
---

#### {1>reconnect (roomId: string, sessionId: string)<1}

将客户端重新接入原先接入过的房间。

必须与服务器端中的 {1>{2>allowReconnection()<2}<1} 一起使用。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.reconnect("wNHTX5qik", "SkNaHTazQ"); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.reconnect("wNHTX5qik", "SkNaHTazQ"); console.log("joined successfully", room);

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.Reconnect{2}("wNHTX5qik", "SkNaHTazQ"); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:reconnect("wNHTX5qik", "SkNaHTazQ", function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.reconnect("wNHTX5qik", "SkNaHTazQ", YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`haxe fct\_label="C++" client->reconnect{1}("wNHTX5qik", "SkNaHTazQ", \[=\](std::string err, Room{2}* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

---

#### {1>getAvailableRooms (roomName?: string)<1}

查询所有可接入的房间。

- 已锁定及私人房间不包含在列表中。 
- 若 {1>roomName<1} 参数被省略，则对所有房间进行查询。

{1>typescript fct\_label="JavaScript" client.getAvailableRooms("battle").then(rooms => { rooms.forEach((room) => { console.log(room.roomId); console.log(room.clients); console.log(room.maxClients); console.log(room.metadata); }); }).catch(e => { console.error(e); }); <1}

\`\`\`csharp fct\_label="C#" try { var rooms = await client.GetAvailableRooms("battle"); for (int i = 0; i < rooms.Length; i++) { Debug.Log(rooms\[i].roomId); Debug.Log(rooms\[i].clients); Debug.Log(rooms\[i].maxClients); Debug.Log(rooms\[i].metadata); } } catch (ex) { Debug.Log(ex.Message) }

/\** * Retrieving custom metadata \*/ \[Serializable] class Metadata { public string mode; public string name;

\[Serializable] class CustomRoomAvailable :RoomAvailable { public Metadata metadata; }

var rooms = await client.GetAvailableRooms{1}("battle"); Debug.Log(rooms\[0].metadata.mode); \`\`\`

var rooms = await client.GetAvailableRooms{1}("battle"); Debug.Log(rooms\[0].metadata.mode); \`\`\`

  for i, room in pairs(rooms) do print(room.roomId) print(room.clients) print(room.maxClients) print(room.metadata) end end); \`\`\`

\`\`\`haxe fct\_label="Haxe" client.getAvailableRooms("battle", function(err, rooms) { if (err != null) { trace(err); return; }

  for (room in rooms) { trace(room.roomId); trace(room.clients); trace(room.maxClients); trace(room.metadata); } }); \`\`\`

\`\`\`haxe fct\_label="Haxe" client.getAvailableRooms("battle", function(err, rooms) { if (err != null) { trace(err); return; }

  // rooms }); \`\`\`

---

#### {1>consumeSeatReservation (reservation)<1}

通过手动使用“席位预定”功能加入房间。

\`\`\`typescript fct\_label="TypeScript" try { const room = await client.consumeSeatReservation(reservation); console.log("joined successfully", room);

} catch (e) { console.error("join error", e); } \`\`\`

{1>typescript fct\_label="JavaScript" client.consumeSeatReservation(reservation).then(room => { console.log("joined successfully", room); }).catch(e => { console.error("join error", e); }); <1}

\`\`\`csharp fct\_label="C#" try { Room{1} room = await client.ConsumeSeatReservation{2}(reservation); Debug.Log("joined successfully");

} catch (ex) { Debug.Log("join error"); Debug.Log(ex.Message); } \`\`\`

\`\`\`lua fct\_label="lua" client:consume\_seat\_reservation(reservation, function(err, room) if (err ~= nil) then print("join error: " .. err) return end

  print("joined successfully") end) \`\`\`

\`\`\`haxe fct\_label="Haxe" client.consumeSeatReservation(reservation, YourStateClass, function(err, room) { if (err != null) { trace("join error: " + err); return; }

  trace("joined successfully"); }); \`\`\`

\`\`\`cpp fct\_label="C++" client->consumeSeatReservation{1}(reservation, \[=\](std::string err, Room{2}* room) { if (err != "") { std::cout << "join error: " << err << std::endl; return; }

  std::cout << "joined successfully" << std::endl; }); \`\`\`

!!!提示 “高级用法”参见 {1>Match-maker API<1} 了解如何在房间内为某个客户端预留席位。

## 房间实例：

### 属性

#### {1>state: any<1}

当前房间状态。该变量始终与服务器端的最新{1>状态<1}同步。要想侦听整体状态的更新情况，参见 {2>{3>onStateChange<3}<2} 事件。

您可将回调附加到您状态内的特定架构上。{1>参见架构回调<1}。

---

#### {1>sessionId: string<1}

当前已接入客户端的唯一标识。该属性与服务器端中的{1>{2>client.sessionId<2}<1} 互相匹配。

---

#### {1>id: string<1}

房间的唯一标识将本 id 分享给其他客户端，则其他客户端可直接接入本房间。

\`\`\`typescript fct\_label="JavaScript" // get {1>roomId<1} from the query string let roomId = location.href.match(/roomId=(\[a-zA-Z0-9-\_]+)/)\[1];

// joining a room by its id client.joinById(roomId).then(room => { // ... }); \`\`\`

---

#### {1>name: string<1}

房间处理程序的名称。示例：{1>"battle"<1}。

---

### 方法。

#### {1>send(type, message)<1}

向房间处理程序发送一种类型的消息。消息使用 MsgPack 编码，仅含有可序列化 JSON 数据结构。

\`\`\`typescript fct\_label="JavaScript" // // 发送字符串类型消息 // room.send("move", { direction: "left"});

// // 发送数字类型信消息// room.send(0, { direction: "left"}); \`\`\`

\`\`\`csharp fct\_label="C#" // // 发送字符串类型消息 // await room.Send("move", new { direction = "left" });

// // 发送数字类型消息 // await room.Send(0, new { direction = "left" }); \`\`\`

\`\`\`lua fct\_label="lua"
--
-- 发送字符串类型消息
--
room:send("move", { direction = "left" })

-- -- 发送数字类型消息
--
room:send(0, { direction = "left" }) \`\`\`

\`\`\`haxe fct\_label="Haxe" // // 发送字符串类型消息 // room.send("move", { direction: "left" });

// // 发送数字类型消息 // room.send(0, { direction: "left" }); \`\`\`

！！！提示 “使用服务器端的 {1>Room#onMessage()<1}进行信息检索” 查看{2>Server-side API » Room - onMessage()<2}章节

---

#### {1>leave ()<1}

断开与房间的连接。

{1>typescript fct\_label="JavaScript" room.leave(); <1}

{1>csharp fct\_label="C#" room.Leave(); <1}

{1>lua fct\_label="lua" room:leave() <1}

{1>haxe fct\_label="Haxe" room.leave(); <1}

!!!提示 使用 {1>Room#onLeave()<1} 来处理与服务器端的断连。

---

#### {1>removeAllListeners()<1}

移除 `onMessage`、`onStateChange`、`onLeave` 和 `onError` 侦听程序。

### 事件

#### onStateChange

!!!提示 “您可为特定的 Schema 架构设置触发回调” 更多详情可查看 {1>状态处理» Schema »客户端<1} 章节。

服务器状态更新时触发该事件。

\`\`\`typescript fct\_label="JavaScript" room.onStateChange.once((state) => { console.log("this is the first room state!", state); });

room.onStateChange((state) => { console.log("the room state has been updated:", state); }); \`\`\`

\`\`\`csharp fct\_label="C#" room.OnStateChange += (state, isFirstState) => { if (isFirstState) { Debug.Log ("this is the first room state!"); }

  Debug.Log ("the room state has been updated"); } \`\`\`

{1>lua fct\_label="lua" room:on("statechange", function(state) print("new state:", state) end) <1}

{1>haxe fct\_label="Haxe" room.onStateChange += function(state) { trace("new state:" + Std.string(state)); }; <1}

{1>cpp fct\_label="C++" room.onStateChange = \[=\](State>* state) { std::cout << "new state" << std::endl; // ... }; <1}

---

#### onMessage

服务器直接或通过广播向客户端发送消息时触发该事件。

{1>typescript fct\_label="JavaScript" room.onMessage("powerup", (message) => { console.log("message received from server"); console.log(message); }); <1}

\`\`\`csharp fct\_label="C#" class PowerUpMessage { string kind; }

room.OnMessage{1}("powerup", (message) => { Debug.Log ("message received from server"); Debug.Log(message); }); \`\`\`

{1>lua fct\_label="lua" room:on\_message("powerup", function(message) print("message received from server") print(message) end) <1}

{1>haxe fct\_label="Haxe" room.onMessage("powerup", function(message) { trace("message received from server"); trace(Std.string(message)); }); <1}

{1>cpp fct\_label="C++" room.onMessage("powerup", \[=\](msgpack::object message) -> void { std::cout << "message received from server" << std::endl; std::cout << message << std::endl; }); <1}

!!!提示 若要从服务器直接发送消息至客户端，您需要使用 {1>client.send()<1} 或 {2>room.broadcast()<2} 进行操作。

---

#### onLeave

客户端离开房间时触发该事件。

{1>typescript fct\_label="JavaScript" room.onLeave((code) => { console.log("client left the room"); }); <1}

{1>csharp fct\_label="C#" room.OnLeave += (code) => { Debug.Log ("client left the room"); } <1}

{1>lua fct\_label="lua" room:on("leave", function() print("client left the room") end) <1}

{1>haxe fct\_label="Haxe" room.onLeave += function () { trace("client left the room"); }; <1}

{1>haxe fct\_label="Haxe" room.onLeave = \[=\]() -> void { std::cout << "client left the room" << std::endl; }; <1}

{1>可能出现的关闭{2>代码<2}及其含义：<1}

- {1>1000<1} - 定期关闭套接字
- {1>1001<1} 到 {2>1015<2} 之间 - 套接字异常关闭 
- {1>4000<1} 到 {2>4999<2} 之间 - 自定义套接字关闭代码（查看{3>更多详细信息<3}）


---

#### onError

房间处理程序发生错误时触发该事件。

{1>typescript fct\_label="JavaScript" room.onError((code, message) => { console.log("oops, error ocurred:"); console.log(message); }); <1}

{1>csharp fct\_label="C#" room.OnError += (code, message) => { Debug.Log ("oops, error ocurred:"); Debug.Log(message); } <1}

{1>lua fct\_label="lua" room:on("error", function(code, message) print("oops, error ocurred:") print(message) end) <1}

{1>haxe fct\_label="Haxe" room.onError += function(code, message) { trace("oops, error ocurred:"); trace(message); }; <1}

{1>cpp fct\_label="C++" room.onError = \[=] (int code, std::string message) => void { std::cout << "oops, error ocurred: " << message << std::endl; }; <1}
