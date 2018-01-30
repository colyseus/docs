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

## Joining a Room

```typescript fct_label="TypeScript"
let room = client.join("battle");
```

```csharp fct_label="C#"
Room room = client.Join("battle");
```