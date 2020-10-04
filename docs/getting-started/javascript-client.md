# JavaScript Client

## Platforms

The JavaScript client is compatible with:

- Major browsers environments ([Electron](https://github.com/electron/electron), Chrome, Firefox, Safari, Opera, etc)
- [React Native](https://github.com/facebook/react-native) ([with some caveats](#react-native-compatibility))
- [Cocos Creator](http://www.cocos2d-x.org/creator) ([instructions](#cocos-creator-instructions))
- [NodeJS](https://nodejs.org/)

Don't know NodeJS build-systems like `webpack`? Just save and drop the [JavaScript distribution file](https://github.com/colyseus/colyseus.js/raw/master/dist/colyseus.js) into your project and ignore the `import` statements presented here in the documentation.

## Usage

### Installing the module

Use this method if you're using a build tool (`webpack`, `rollup`, or similar)

```
npm install --save colyseus.js
```

If you're not using a build tool, it is recommended to download the release binaries from [GitHub Releases](https://github.com/colyseus/colyseus.js/releases)

```html
<script src="colyseus.js"></script>
```

Alternatively, you may include the distribution file directly by using unpkg. Make sure to replace the `@x.x.x` portion of it with a version compatible with your server.

```html
<script src="https://unpkg.com/colyseus.js@0.14.0/dist/colyseus.js"></script>
```

### Connecting to server:

```ts
import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

var client = new Colyseus.Client('ws://localhost:2567');
```

### Joining to a room:

```ts
client.join("room_name").then(room => {
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
  console.log(client.id, "received on", room.name, message);
});
```

Server error occurred:

```ts
room.onError((code, message) => {
  console.log(client.id, "couldn't join", room.name);
});
```

The client left the room:

```ts
room.onLeave((code) => {
  console.log(client.id, "left", room.name);
});
```

## React Native compatibility

This client works with React Native. You need to install some aditional
dependencies for compatibility and assign `window.localStorage` to
`AsyncStorage`.

- `npm install buffer`

```js
// App.js
import { AsyncStorage } from 'react-native';
import { Buffer } from "buffer";
window.localStorage = AsyncStorage;
global.Buffer = Buffer;
```

## Cocos Creator Instructions

- [Download the latest colyseus.js](https://raw.githubusercontent.com/colyseus/colyseus.js/master/dist/colyseus.js) distribution file from GitHub.
- Save it into your project's `scripts` folder.
- Require it using `const Colyseus = require('colyseus.js')`
