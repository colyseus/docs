# JavaScript Client 

## Platforms

The JavaScript client is compatible with:

- Major browsers environments ([Electron](https://github.com/electron/electron), Chrome, Firefox, Safari, Opera, etc)
- [React Native](https://github.com/facebook/react-native) ([with some caveats](#react-native-compatibility))
- [Cocos Creator](http://www.cocos2d-x.org/creator)
- [NodeJS](https://nodejs.org/)

Don't know NodeJS build-systems like `webpack`? Just save and drop the [JavaScript distribution file](https://github.com/colyseus/colyseus.js/raw/master/dist/colyseus.js) into your project and ignore the `import` statements presented here in the documentation.

## Usage

### Installing the module

```
npm install --save colyseus.js
```

### Connecting to server:

```ts
import * as Colyseus from "colyseus.js";

var client = new Colyseus.Client('ws://localhost:2567');
```

### Joining to a room:

```ts
var room = client.join("room_name");
room.onJoin.add(function() {
    console.log(client.id, "joined", room.name);
});
```

### Listening to room state change:

Here comes the most powerful feature of the client. You can listen to every
state update in the server-side, and bind them into client-side functions.

The first parameter is the path of the variable you want to listen to. When you
provide placeholders (such as `:number`, `:id`, `:string`) to the path, they
will populate the function with the value found on it. See examples below.

Listening to entities being added/removed from the room:

```ts
room.listen("entities/:id", (change) => {
    console.log(`new entity ${change.path.id}`, change.value);
});
```

Listening to entity attributes being added/replaced/removed:

```ts
room.listen("entities/:id/:attribute", (change) => {
    console.log(`entity ${change.path.id} changed attribute ${change.path.attribute} to ${change.value}`);
});
```

### Other room events

Room state has been updated:

```ts
room.onStateChange.add(function(state) {
  console.log(room.name, "has new state:", state);
});
```

Message broadcasted from server or directly to this client:

```ts
room.onMessage.add(function(message) {
  console.log(client.id, "received on", room.name, message);
});
```

Server error occurred:

```ts
room.onError.add(function() {
  console.log(client.id, "couldn't join", room.name);
});
```

The client left the room:

```ts
room.onLeave.add(function() {
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

Another caveat is that you can only join rooms after the first connection open.

```js
var client = new Colyseus.Client('ws://localhost:2567');

client.onOpen.add(() => {
    let room = client.join("your_room");
});
```