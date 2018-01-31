# Overview

Colyseus currently have clients for the platforms:

- [HTML5](https://github.com/gamestdio/colyseus.js/)
- [Unity3D](https://github.com/gamestdio/colyseus-unity3d)

Need a client for another platform? Share your interest on the [discussion board](https://discuss.colyseus.io/)!

## Connecting to the Server

```typescript fct_label="TypeScript"
import * as Colyseus from "colyseus.js";
// ...

let client = new Colyseus.Client("ws://localhost:2657");
```

```csharp fct_label="C#"
using Colyseus;
// ...

Client client = new Client("ws://localhost:2657");
```
## Methods

### `join (roomName: string, options: any)`

```typescript fct_label="TypeScript"
let room = client.join("battle");
```

```csharp fct_label="C#"
Room room = client.Join("battle");
```

## Events

### `onOpen`

This event is triggered when the connection is accepted by the server.

```typescript fct_label="TypeScript"
client.onOpen.add(function() {
  console.log("connection is now open");
});
```

```csharp fct_label="C#"
client.OnOpen += (object sender, EventArgs e) => {
  Debug.Log ("connection is now open");
}
```

### `onClose`

This event is triggered when the connection is closed.

```typescript fct_label="TypeScript"
client.onClose.add(function() {
  console.log("connection has been closed");
});
```

```csharp fct_label="C#"
client.OnClose += (object sender, EventArgs e) => {
  Debug.Log ("connection has been closed");
}
```

### `onError`

This event is triggered when some error occurs in the server.

```typescript fct_label="TypeScript"
client.onError.add(function(err) {
  console.log("something wrong happened", err);
});
```

```csharp fct_label="C#"
client.OnError += (object sender, EventArgs e) => {
  Debug.Log ("something wrong happened");
}
```

<!-- TODO: document raw `onMessage` -->
<!-- ### `onMessage` -->

## Properties

### `id: string`

Unique identifier for the client.

!!! Note
    The same client id can connect into the same room handler when joining from multiple browser tabs.
