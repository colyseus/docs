Colyseus currently provides two serialization methods out of the box:

- [Schema](/state/schema/) (default)
- [Fossil Delta](/state/fossil-delta/)

See below how to specify which serialization method to use.

```typescript fct_label="TypeScript"
import { serialize, FossilDeltaSerializer, Room } from "colyseus";

@serialize(FossilDeltaSerializer)
class MyRoom extends Room {
    // your room definition
}
```

```javascript fct_label="JavaScript"
const colyseus = require('colyseus');

class MyRoom extends colyseus.Room {
    // your room definition
}
colyseus.serialize(colyseus.FossilDeltaSerializer)(MyRoom);
```

## Implementing a custom serializer (server-side)

If you feel the need to implement a custom state serializer, you should be able to.

!!! Warning "👻 You probably don't need this! 👻"
    If you're just starting out with the framework, read the ["State Handling"](/state/) pages instead.

!!! Warning "This feature is experimental"
    You are likely to need to fork the [client library](/client/) you're working with to integrate the de-serializer in the client. In the future, all clients should support an API to set a custom de-serializer.

    At the time of this writing, only the JavaScript and Defold clients are able to register custom de-serializers.

#### `id: string`

Id of the serializer. The client-side can instantiate a custom serializer based on this id.

#### `reset(data): void`

Reset the state.

#### `getFullState(client): number[]`

The first state sent to the client upon joining the room. Must return a byte array.

#### `applyPatches(clients): number[]`

A subsequent patch to be sent for all clients, or particular client. Must return a byte array.

#### `handshake(clients): number[]`

Custom handshake data to be sent to the client upon joining the room. Must return a byte array.

## Implementing a custom de-serializer (client-side)

!!! tip
    The de-serializer implementation varies accourding to the client library you're using.

    Feel free to ask for help in the [forums](https://discuss.colyseus.io/) or [Discord](https://discord.gg/RY8rRS7).

You're encouraged to take a look at the existing serializer's implementation to guide you write your own:

- [JavaScript's FossilDeltaSerializer](https://github.com/colyseus/colyseus.js/blob/0.10.x/src/serializer/FossilDeltaSerializer.ts)
- [Defold Engine's FossilDeltaSerializer](https://github.com/colyseus/colyseus-defold/blob/0.10.x/colyseus/serialization/fossil_delta.lua)

#### `setState(data): void`

Set the state instance.

#### `getState(): any`

The the state instance.

#### `patch(bytes: number[]): void`

Receive the patches coming from the server.

#### `teardown(): void`

Clean-up what needs to be cleared when leaving the room.

#### `handshake(bytes: number): void`

Receive the handshake sent by the server upon joining the room.

### Registering the de-serializer in the client-side

```typescript fct_label="TypeScript"
import { registerSerializer, Serializer } from "colyseus.js";

class MyOwnSerializer extends Serializer {
    // ...
    // your de-serializer implementation
    // ...
}

registerSerializer('my-own-serializer', MyOwnSerializer);
```

```lua fct_label="Defold / LUA"
local ColyseusSerializer = require('colyseus.serialization')

local my_own_serializer = {}
my_own_serializer.__index = my_own_serializer

function my_own_serializer.new ()
  local instance = {}
  setmetatable(instance, my_own_serializer)
  return instance
end

-- ...
-- your de-serializer implementation
-- ...

ColyseusSerializer.register_serializer('my-own-serializer', my_own_serializer)
```