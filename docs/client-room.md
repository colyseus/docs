# Client-side Room API

## Methods

### `listen (path: string, callback: Function)`

Listen to room state changes from the room handler.

Use this method to synchronize the room state from the server with the clients.

#### Examples

##### Listening to map data structures

```typescript fct_label="TypeScript"
import { DataChange } from "colyseus.js";
// ...

room.listen("players/:id", (change: DataChange) => {
  if (change.operation === "add") {
    console.log("new player added to the state");
    console.log("player id:", change.path.id);
    console.log("player data:", change.value);

  } else if (change.operation === "remove") {
    console.log("player has been removed from the state");
    console.log("player id:", change.path.id);
  }
});
```

```csharp fct_label="C#"
using Colyseus;
// ...

room.Listen("players/:id", OnPlayerChange);

void OnPlayerChange (DataChange change)
{
  if (change.operation == "add") {
    Debug.Log ("new player added to the state");
    Debug.Log (change.path["id"]);
    Debug.Log (change.value);

  } else if (change.operation == "remove") {
    console.log("player has been removed from the state");
    Debug.Log (change.path["id"]);
  }
});
```

##### Listening to attribute changes of deep data structures

```typescript fct_label="TypeScript"
import { DataChange } from "colyseus.js";
// ...

room.listen("players/:id/:attribute", (change: DataChange) => {
  console.log(change.operation); // => "add" | "remove" | "replace"
  console.log(change.path.attribute, "has been changed");
  console.log(change.path.id);
  console.log(change.value);
});
```

```csharp fct_label="C#"
using Colyseus;
// ...

room.Listen("players/:id/:attribute", OnPlayerAttributeChange);

void OnPlayerAttributeChange (DataChange change)
{
  Debug.Log (change.operation); // => "add" | "remove" | "replace"
  Debug.Log (change.path["attribute"] + "has been changed");
  Debug.Log (change.path["id"]);
  Debug.Log (change.value);
});
```

!!! Tip
    See [State synchronization](client-state-synchronization) for more examples on how to use the `listen` method.

### `send (data)`

Send message to the room handler.

```typescript fct_label="TypeScript"
room.send({ move: "left" });
```

```csharp fct_label="C#"
room.Send(new { move = "left" });
```

Use [Room#onMessage()](api-room/#onmessage-client-data) from the server-side to read the message.

### `leave ()`

Disconnect from the room.

```typescript fct_label="TypeScript"
room.leave();
```

```csharp fct_label="C#"
room.Leave();
```

!!! Tip
    Use [Room#onLeave()](api-room/#onleave-client) to handle the disconnection from the server-side.

### `removeAllListeners()`

Remove all event and data listeners.

## Properties

### `id: string`

The unique idenfitier of the room. You can share this id with other clients in
order to allow them to connect directly to this room.

```typescript fct_label="TypeScript"
// get `roomId` from the query string
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// connect the client directly into a specific room id
let room = client.join(roomId);
```

!!! Warning
    If you're looking for the unique identifier of the client, use [`client.id`](client-overview/#id-string) instead.

### `sessionId: string`

Unique session identifier.

This property matches the [`client.sessionId`](api-client/#sessionid-string) from the server-side.

### `name: string`

Name of the room handler. Ex: `"battle"`.

## Events

### onUpdate

This event is triggered when the server updates its state.

```typescript fct_label="TypeScript"
room.onUpdate.addOnce(function(state) {
  console.log("this is the first room state!", state);
});

room.onUpdate.add(function(state) {
  console.log("the room state has been updated:", state);
});
```

```csharp fct_label="C#"
room.OnUpdate += (object sender, RoomUpdateEventArgs e) => {
  if (e.isFirstState) {
    Debug.Log ("this is the first room state!");
  }

  Debug.Log ("the room state has been updated");
}
```

### onData

This event is triggered when the server sends data directly to the client.

```typescript fct_label="TypeScript"
room.onData.add(function(data) {
  console.log("server just sent this message:");
  console.log(data);
});
```

```csharp fct_label="C#"
room.OnData += (object sender, MessageEventArgs e) => {
  Debug.Log ("server just sent this message:");
  Debug.Log(e.data);
}
```

!!! Tip
    To send data from the server directly to the clients you'll need to use
    either [room.send()](api-room/#send-client-data) or
    [room.broadcast()](api-room/#broadcast-data)

### onJoin

This event is triggered when the client successfuly joins the room.

```typescript fct_label="TypeScript"
room.onJoin.add(function() {
  console.log("client joined successfully");
});
```

```csharp fct_label="C#"
room.OnJoin += (object sender, EventArgs e) => {
  Debug.Log ("client joined successfully");
}
```

### onLeave

This event is triggered when the client leave the room.

```typescript fct_label="TypeScript"
room.onLeave.add(function() {
  console.log("client left the room");
});
```

```csharp fct_label="C#"
room.OnLeave += (object sender, EventArgs e) => {
  Debug.Log ("client left the room");
}
```

### onError

This event is triggered when some error occurs in the room handler.

```typescript fct_label="TypeScript"
room.onError.add(function(err) {
  console.log("oops, error ocurred:");
  console.log(err);
});
```

```csharp fct_label="C#"
room.OnError += (object sender, EventArgs e) => {
  Debug.Log ("oops, error ocurred:");
  Debug.Log(e);
}
```
