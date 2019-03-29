# Getting started

Colyseus requires [Node.js](https://nodejs.org/) v8.0 or higher.

## From examples project

See some examples in action by cloning the [examples project](https://github.com/colyseus/colyseus-examples) and running it locally.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm install
npm run bundle-colyseus-client
```

To run the http + websocket server, run `npm start`.


## Creating a barebones Colyseus server

#### Create a directory for your server. 

```
mkdir server
cd server
```

#### 1. Create a `package.json` file:

```
npm init
```

#### 2. Install the `colyseus` module:

```
npm install colyseus --save
```

### Using TypeScript (recommended)

#### 3. Install the `typescript`, and `ts-node` modules as development dependencies.

```
npm install typescript ts-node --save-dev
```

#### 4. Create a `index.ts` file for the server:

```typescript
// index.ts
import http from "http";
import { Server } from "colyseus";

const port = Number(process.env.PORT || 2657);

const server = http.createServer();
const gameServer = new Server({ server });

gameServer.listen(port);
console.log(`Listening on ws://${ endpoint }:${ port }`)
```

#### 5. Create your room handler (e.g. `MyRoom.ts`)

```typescript
// MyRoom.ts
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
      onInit (options: any) {}
      onJoin (client: Client, options: any) {}
      onMessage (client: Client, message: any) {}
      onLeave (client: Client, consented: boolean) {}
      onDispose() {}
}
```

!!! tip "More on room handlers"
    See the [Room API](/server/room/) for more details about room handlers.

#### 6. Import and register your room handler in the `index.ts` file:

```typescript
// index.ts
// ... 
import { MyRoom } from "./MyRoom";
// ...
gameServer.register('my_room', MyRoom);
// ...
```

#### 7. Start the server!

```
npx ts-node index.ts
```

### Using JavaScript

#### 3. Create a `index.js` file for the server:

```javascript
// index.js
const http = require("http");
const colyseus = require("colyseus");

const port = process.env.PORT || 2657;

const server = http.createServer();
const gameServer = new Server({
      server: server 
});

gameServer.listen(port);
console.log(`Listening on ws://${ endpoint }:${ port }`)
```

#### 4. Create your room handler (e.g. `MyRoom.js`)

```javascript
// MyRoom.ts
const colyseus = require("colyseus")

export class MyRoom extends Room {
      onInit (options) {}
      onJoin (client, options) {}
      onMessage (client, message) {}
      onLeave (client, consented) {}
      onDispose() {}
}
```

!!! tip "More on room handlers"
    See the [Room API](/server/room/) for more details about room handlers.

#### 5. Import and register your room handler in the `index.js` file:

```typescript
// index.js
// ... 
const MyRoom = require("./MyRoom")
// ...
gameServer.register('my_room', MyRoom);
// ...
```

#### 6. Start the server!

```
node index.js
```

## Recommended NodeJS packages for games

These modules can be useful while developing games on both NodeJS and the Browser.

- [@gamestdio/mathf](https://github.com/gamestdio/mathf) - Mathematical functions, borrowed from Unity3D's API
- [@gamestdio/timer](https://github.com/gamestdio/timer) - Reliable timing events
- [@gamestdio/keycode](https://github.com/gamestdio/keycode) - Constants for keyboard key codes (`event.which`)

These modules can be used only in the browser:

- [@gamestdio/pixi-engine](https://github.com/gamestdio/pixi-engine)
