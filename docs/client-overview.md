# Overview

Connecting to the Colyseus server:

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