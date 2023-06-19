# Construct 3 SDK

## Installation

- [Download Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk) ([Addon source-code](https://github.com/colyseus/colyseus-construct3))

!!! Warning "Attention! You need a server to use Colyseus!"
    Construct has well-known existing features to "host" a multiplayer session from the client-side. This is not possible when using Colyseus. Colyseus is an authoritative **server**, written in Node.js. You can't let your client-side host the game sessions directly.

## Example project

Please explore this demonstration project to understand how to use Colyseus with Construct3.

- [Download `.c3p` and server files](https://github.com/colyseus/construct3-demo/archive/refs/heads/master.zip) ([View source](https://github.com/colyseus/construct3-demo))
- Open the `RawUsage.c3p` file on Construct editor.
- Start the local server by running `npm install` and then `npm start` on the `server` folder.

Some of the concepts covered in this project:

### Joining a room

Joining a room, handling incoming messages from the server, and handling a connection close.

![](./construct3/join-room-handle-messages.png)

### Listing available rooms in the server

![](./construct3/matchmaking-rooms-available.png)

### Listening for changes in the state

![](./construct3/state-change.png)

### Listening for add/remove events on Maps and Arrays within the state

![](./construct3/state-items-add-or-remove.png)