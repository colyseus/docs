> THIS CLIENT CURRENTLY ONLY WORKS WITH VERSION `0.10` OF THE SERVER

The [colyseus-construct3](https://github.com/colyseus/colyseus-construct3) client is compatible with C2 and C3 runtime from Construct3.

See [Multiplayer Drawing Prototype](https://github.com/endel/multiplayer-drawing-prototype) made with this plugin. ([live demo](https://drawing-prototype.herokuapp.com/))

## Properties

### Endpoint
Endpoint of the Colyseus server

## Actions

### Connect
Open connection with server

### Disconnect
Close connection with server

### Join room "{0}" with options {1}, {...}.
Join a room by name

### Send message {0} to room.
Send message to a room

### Leave from the room
Disconnect client from the room.

## Conditions

### On open
Triggered when connection with server is opened.

### On error
Triggered when an error happened on the server.

### On close
Triggered when connection with server is closed.

### On join
Triggered when joined successfully into a room.

### On leave
Triggered when left from a room.

### On error
Triggered when an error happened on the server.

### On message ({0})
Triggered when the room broadcasts a message, or sends a message directly to this client.

### On state change
Triggered when the state of the room changes.

### Listen for {0} ({1} operations)
Triggered when a variable at the selected path changes.

## Expressions

### Value
The value you're listening to. (Only avaliable during Listen)

### ValueAt
The nested value you're listening to. (Only avaliable during Listen)

### Path
A variable present in the path you're listening to.

### State
Returns a value from room's state

### SessionId
Unique sessionId of the current user
