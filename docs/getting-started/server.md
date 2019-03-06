# Getting started

## Environment

Colyseus requires [Node.js](https://nodejs.org/) v8.0.0 or higher.

See some examples in action by cloning the [examples](https://github.com/colyseus/colyseus-examples) project and running it locally.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm run bundle-colyseus-client
npm install
```

To run the http + websocket server, run `npm start`.

## The Mindset

The authoritative game server mindset is quite simple. The Server validates the user actions, and clients are dumb visual representations of the current game state.

The server should take care of all data involved in your game, such as positioning, speeds, collisions, etc.

Making multiplayer games is usually tricky because your gameplay must take the multiple delays into account - the other clients sending data to the server, and the server sending data back to all clients. It's the art of faking something that has already happened is actually happening as the current player sees and plays the game.

Here's how the "multiplayer game loop" looks like on Colyseus:

- Client sends a message to the server, requesting to change its state.
- The input must be validated by your room handler.
- The game state is updated.
- All clients receive the latest version of the game state.
- The visual representation of the game state is updated.

### Diagram

```
              room.send({ action: "left" })

                           |
      +------------+       |       +-----------------------------------+
+-----+ Client #1  +-------|       |  Room handler #1                  |
|     +------------+       |       |                                   |
|     +------------+       |       |  onMessage (client, data) {       |
|-----+ Client #2  |       --------+    if (data.action === "left") {  |
|     +------------+               |      // update the room state     |
|     +------------+               |    }                              |
|-----+ Client #3  |               |  }                                |
|     +------------+               +-----------------------------------+
|                                                    |
|        patch state broadcast (binary diff)         |
|----------------------------------------------------+
```

## Recommended NodeJS packages for games

These modules can be useful while developing games on both NodeJS and the Browser.

- [@gamestdio/mathf](https://github.com/gamestdio/mathf) - Mathematical functions, borrowed from Unity3D's API
- [@gamestdio/timer](https://github.com/gamestdio/timer) - Reliable timing events
- [@gamestdio/keycode](https://github.com/gamestdio/keycode) - Constants for keyboard key codes (`event.which`)

These modules can be used only in the browser:

- [@gamestdio/pixi-engine](https://github.com/gamestdio/pixi-engine)
