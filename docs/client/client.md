# Overview

Colyseus currently have clients for the platforms:

- [HTML5](/getting-started/javascript-client) ([colyseus/colyseus.js](https://github.com/colyseus/colyseus.js))
- [Unity3D](/getting-started/unity3d-client) ([colyseus/colyseus-unity3d](https://github.com/colyseus/colyseus-unity3d))
- [Defold](/getting-started/defold-client) ([colyseus/colyseus-defold](https://github.com/colyseus/colyseus-defold))
- [Haxe](/getting-started/haxe-client) ([colyseus/colyseus-hx](https://github.com/colyseus/colyseus-hx))
- [Cocos2d-X](/getting-started/cocos2dx-client) ([colyseus/colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x))
- [Construct3](/getting-started/construct3-client) ([colyseus/colyseus-construct3](https://github.com/colyseus/colyseus-construct3))

Need a client for another platform? Share your interest on the [discussion board](https://discuss.colyseus.io/)!

## Connecting to the Server

```typescript fct_label="JavaScript"
import Colyseus from "colyseus.js";
// ...

let client = new Colyseus.Client("ws://localhost:2567");
```

```csharp fct_label="C#"
using Colyseus;
// ...

Client client = new Client("ws://localhost:2567");
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

## Methods

### `joinOrCreate (roomName: string, options: any)`

Join an existing room or create a new one, by provided `roomName` and `options`.

Locked or private rooms are ignored by this method.

```typescript fct_label="JavaScript"
client.joinOrCreate("battle", {/* options */}).then(room => {
  console.log("joined successfully", room);
}).catch(e => {
  console.error("join error", e);
});
```

```csharp fct_label="C#"
try {
  Room<YourStateClass> room = await client.JoinOrCreate<YourStateClass>("battle", /* Dictionary of options */);
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

### `create (roomName: string, options: any)`

Creates a new room by provided `roomName` and `options`.

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

### `join (roomName: string, options: any)`

Joins an existing room by provided `roomName` and `options`.

Locked or private rooms are ignored by this method.

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

### `joinById (roomId: string, options: any)`

Joins an existing room by its `roomId`. Private rooms can be joined by id.

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


!!! Tip
    Use [`getAvailableRooms()`](#getavailablerooms-roomname-string) to retrieve a list of `roomId`'s available for joining.

### `reconnect (roomId: string, sessionId: string)`

Reconnects the client into a room he was previously connected with.

Must be used along with [`allowReconnection()`](/server/room#allowreconnection-client-seconds) in the server-side.

```typescript fct_label="JavaScript"
let room = client.reconnect("wNHTX5qik", "SkNaHTazQ").then(room => {
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

### `getAvailableRooms (roomName?: string)`

List all available rooms to connect. Locked and private rooms won't be listed. `roomName` is optional.

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
```

```lua fct_label="lua"
client:get_available_rooms("battle", function(err, rooms)
  if (err) then
    console.error(err);
    return
  end

  for i, rooms in pairs(rooms) do
    print(rooms[i].roomId)
    print(rooms[i].clients)
    print(rooms[i].maxClients)
    print(rooms[i].metadata)
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

### `consumeSeatReservation (reservation)`

Join a room by consuming a seat reservation.

!!! Tip "Advanced usage"
    See [Match-maker API](/server/matchmaker/#reserveseatforroom-options) to see how to retrieve the seat reservation data.

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
