# JavaScript/TypeScript SDK

The JavaScript/TypeScript SDK is compatible with mostly every platform:

- Browsers (Google Chrome, Firefox, Safari, Opera, Brave, etc.)
- [Node.js](https://nodejs.org/)
- [Electron](https://github.com/electron/electron)
- [React Native](https://github.com/facebook/react-native)
- [Cocos Creator 3.0](https://cocos.com/creator) ([See instructions](/getting-started/cocos-creator))

## Usage

### Including the JavaScript SDK in your project

This is the preffered method if you're using a build tool (`webpack`, `rollup`, or similar)

```
npm install --save colyseus.js
```

If you're not using a build tool, it is recommended to download the release binaries from [GitHub Releases](https://github.com/colyseus/colyseus.js/releases)

```html
<script src="colyseus.js"></script>
```

Alternatively, you may include the distribution file directly by using unpkg. Make sure to replace the `@x.x.x` portion of it with a version compatible with your server.

```html
<script src="https://unpkg.com/colyseus.js@^0.15.0/dist/colyseus.js"></script>
```

### Connecting to server

```ts
import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

var client = new Colyseus.Client('ws://localhost:2567');
```

### Joining to a room

```ts
client.joinOrCreate("room_name").then(room => {
    console.log(room.sessionId, "joined", room.name);
}).catch(e => {
    console.log("JOIN ERROR", e);
});
```

### Room events

Room state has been updated:

```ts
room.onStateChange((state) => {
  console.log(room.name, "has new state:", state);
});
```

Message broadcasted from server or directly to this client:

```ts
room.onMessage("message_type", (message) => {
  console.log(room.sessionId, "received on", room.name, message);
});
```

Server error occurred:

```ts
room.onError((code, message) => {
  console.log(room.sessionId, "couldn't join", room.name);
});
```

The client left the room:

```ts
room.onLeave((code) => {
  console.log(room.sessionId, "left", room.name);
});
```

---

### Strongly Typed State / Auto-completion

When using TypeScript, you can leverage strong types and editor auto-completion for the [state](/state/schema/).

You may include only the type of the state itself or the concrete implementation.

_(The following examples are applicable to `joinOrCreate`, `create`, `join`, `joinById`, `reconnect` and `consumeSeatReservation` methods.)_

#### Importing only the `type`:

You may use `import type` to import only the type of the state from your server code.

```ts
import type { MyState } from "../server/path/MyState";

client.joinOrCreate<MyState>(...)
```

#### Importing the concrete implementation:

In some cases, you may want to import the concrete implementation, to be able to re-use methods implemented in the server in the client.

```ts
import { MyState } from "../server/path/MyState"

client.joinOrCreate("my_room", {}, MyState);
```
