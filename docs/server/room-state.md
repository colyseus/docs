The room handlers are **stateful** in Colyseus. Each room holds its own state. To allow [synchronization](/concept-state-synchronization), you **must** mutate the room's state. The server automatically broadcasts the changes to all connected clients at each patch interval.

!!! Tip
    - For synchronization with the client-side, see [client-side state synchronization](/client/state-synchronization).
    - See Colyseus' technical approach on [state synchronization](/concept-state-synchronization).

## Raw Object State

The simplest way to deal with the room state is using a raw JavaScript objects directly in the `Room` handler.

**On the following example, you'll see:**

- Creating player upon client connection.
- Handling client-side actions and updating the state to move `x` position.
- Removing player upon client disconnection.

```typescript
import { Room, Client } from "colyseus";

export class BattleRoom extends Room {

  onInit (options: any) {
    this.setState({
      players: {}
    });
  }

  onJoin (client) {
    this.state.players[ client.sessionId ] = {
      x: 0,
      y: 0
    };
  }

  onLeave (client) {
    delete this.state.players[ client.sessionId ];
  }

  onMessage (client, data) {
    if (data.action === "left") {
      this.state.players[ client.sessionId ].x -= 1;

    } else if (data.action === "right") {
      this.state.players[ client.sessionId ].x += 1;
    }
  }
}
```

## Your Own Data Structures

Whilst it's possible to use raw data directly on `this.state`. The recommended way to handle your state is through your own data structures. By creating your own structures, you can have a more decoupled structure to represent your state.

**On the following (rewritten) example, you'll see:**

- A clean `BattleRoom` implementation, directly coupled to the state structure.
- A large data structure holding the entire room state (`BattleState`)
    - Methods manipulating smaller data structures
- A small decoupled data structure representing a single entity (`Player`)

```typescript fct_label="BattleRoom.ts"
// BattleRoom.ts
import { Room, Client } from "colyseus";
import { BattleState } from "./BattleState";

export class BattleRoom extends Room<BattleState> {

  onInit (options: any) {
    this.setState(new BattleState());
  }

  onJoin (client) {
    this.state.addPlayer(client);
  }

  onLeave (client) {
    this.state.removePlayer(client);
  }

  onMessage (client, data) {
    if (data.action) {
      this.state.movePlayer(client, data.action);
    }
  }
}
```

```typescript fct_label="BattleState.ts"
// BattleState.ts
import { Player } from "./Player";

export class BattleState {
  players: {[id: string]: Player} = {};

  addPlayer (client) {
    this.players[ client.sesssionId ] = new Player(0, 0);
  }

  removePlayer (client) {
    delete this.players[ client.sessionId ];
  }

  movePlayer (client, action) {
    if (action === "left") {
      this.players[ client.sessionId ].x -= 1;

    } else if (action === "right") {
      this.players[ client.sessionId ].x += 1;
    }
  }
}
```

```typescript fct_label="Player.ts"
// Player.ts
export class Player {
  constructor (
    public x: number,
    public y: number
  ) {
    this.x = x;
    this.y = y;
  }
}
```

### Map of entities 

Since you cannot use `Map` to describe public synchronizeable properties (see [avoid using `Map` and `Set`](#avoid-using-map-set)), you can use a plain JavaScript object to assign keys of `string` to a custom type (`T`).

```ts
players: {[id: string]: Player} = {}
```

```typescript
type EntityMap<T> = {[ entityId:string ]: T};
```

Your state will usualy have at least one usage of `EntityMap` for the map of connected clients. As described on [previous example](#your-own-data-structures).

### Private variables (`@nosync`)

To prevent private properties from leaking into your clients' state, you need to set those properties as **non-enumerable**. The decorator `@nosync` is a syntax sugar for this purpose.

```typescript
export class Player {
  x: number;
  y: number;

  @nosync
  wontBeSynched: string = "This property won't be synched with clients";
}
```

### Avoid using `Map`, `Set`

Avoid using `Map` and `Set` for public, synchronizeable, properties.

Unfortunately, the JavaScript built-in types `Map` and `Set` aren't serializeable by default. This means MessagePack cannot encode them properly.

**See why:**

```typescript
var myMap = new Map([["k1", "v1"], ["k2", "v2"]]);
// => Map(2) {"key" => "value", "key2" => "value2"}
JSON.stringify(myMap);
// => "{}"
```

You're encouraged to use them for private variables, though. See [`@nosync`](#private-variables-nosync) for not synchronizeable properties.

### Avoid mutating arrays

- `push`ing new entries is OK - the clients will receive a single `"add"` operation.
- `pop`ing the last entry is OK - the clients will receive a single `"remove"` operation.

Removing or inserting entries in-between will generate one `"replace"` operation for each entry that had the index changed. Be careful to handle these changes in the client-side properly.
