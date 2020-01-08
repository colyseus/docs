Colyseus is a Authoritative Multiplayer Game Server for Node.js. It allows you to focus on your gameplay instead of bothering about networking.

The mission of this framework is to be the easiest solution for creating your own multiplayer games in JavaScript.

## What Colyseus provides to you:

- WebSocket-based communication
- Simple API in the server-side and client-side.
- Automatic state synchronization between server and client.
- Matchmaking clients into game sessions
- Scale vertically or horizontally

## What Colyseus won't provide:

- Game Engine: Colyseus is agnostic of the engine you're using. Need Physics? Add your own logic / package.
- Database: It's up to you to configure and select which database you'd like to use.

## The Mindset

The authoritative game server mindset is quite simple. The Server validates the user actions, and clients are dumb visual representations of the current game state.

The server should take care of all data involved in your game, such as positioning, speeds, collisions, etc.

Making multiplayer games is usually tricky because your gameplay must take the multiple delays into account - the other clients sending data to the server, and the server sending data back to all clients. It's the art of faking something that has already happened is actually happening as the current player sees and plays the game.

Here's how the "multiplayer game loop" looks like on Colyseus:

- Client sends a message to the server, requesting to change its state.
- The input must be validated by your room handler.
- The room state is updated.
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

## What people are saying about Colyseus?

!!! Quote "[@bmovement](https://twitter.com/bmovement)"
    "Thanks again for this framework... it allowed someone like me who just wants the server to be a black box to focus on my game instead of getting bogged down learning a whole new skill set!"

!!! Quote "[@sagestudios](https://github.com/sagestudios)"
    Loved the framework. Exactly what we are looking for in terms of features.

## External links

- [💬 &nbsp; Chat / Discord](https://discord.gg/RY8rRS7)
- [💬 &nbsp; Forum](http://discuss.colyseus.io/)
- [💰 &nbsp; Support the project](https://www.patreon.com/endel)
- [🌐 &nbsp; Website](https://colyseus.io)
