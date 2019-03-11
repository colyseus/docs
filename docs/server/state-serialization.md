Colyseus currently provides two methods of serialization out of the box:

- [Schema](/state/schema/) (default)
- [Fossil Delta](/state/fossil-delta/)

To customize which serialization method to use, you should call 

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

!!! Warning "This feature is experimental"
    You are likely to need to fork the [client library](/client/client/) you're working with to integrate the de-serializer in the client. In the future, all clients should support an API to set a custom de-serializer.

    At the time of this writing, only the JavaScript and Defold clients are able to register custom de-serializers.


### `id: string`

Id of the serializer. The client-side can instantiate a custom serializer based on this id.

### `reset(data): void`

Reset the state.

### `getFullState(client): number[]`

The first state sent to the client upon joining the room. Must return a byte array.

### `applyPatches(clients): number[]`

A subsequent patch to be sent for all clients, or particular client. Must return a byte array.

### `handshake(clients): number[]`

Custom handshake data to be sent to the client upon joining the room. Must return a byte array.

## Implementing a custom de-serializer (client-side)

Undocumented. This depends on the client library you're using. Feel free to ask in the [forums](https://discuss.colyseus.io/) or [Discord](https://discord.gg/RY8rRS7).