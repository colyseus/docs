- [Construct 3](https://github.com/colyseus/colyseus-construct3) (compatible with C3 and C2 runtime from Construct3)
- [Construct 2](https://github.com/colyseus/colyseus-construct2)

See [Multiplayer Drawing Prototype](https://github.com/endel/multiplayer-drawing-prototype) made with this plugin. ([live demo](https://drawing-prototype.herokuapp.com/))

## Important

Construct has well-known existing features to "host" a multiplayer from the client. This is not possible via Colyseus. Colyseus is an authoritative SERVER, written in Node.js. You can't make your client be the host of the game sessions.

## Handling messages

An important note when sending messages from the server to the clients: you need
to provide an object with a `"type"` field, in order for the client to be able
to parse it.

**Server-side**

```typescript
this.broadcast({ type: "foo", data: "bar" });
```

**Client-side**

Use the `On Message` condition, with `"foo"` as argument.


## Properties

### Default Endpoint
Default Endpoint to use on "Connect" action.

## Actions

### Set endpoint to {0}
Format: wss://example.com

### Join room {0} with options {1}.
Join a room by name

### Join room {0} with options {1}.
Join a room by name

### Create room {0} with options {1}.
Create a room by name

### Join room {0} with options {1}.
Join an existing room by its ID

### Reconnect into room {0} with sessionId {1}.
Reconnect using a previously connected room

### Send {0} with {1}
Send message to a room

### Leave from the room
Disconnect client from the room.

## Conditions

### On Join
Triggered when joined successfully into a room.

### On Leave
Triggered when left from a room.

### On Error
Triggered when an error happened on the server.

### On Message ({0})
Triggered when the room broadcasts a message, or sends a message directly to this client.

### On State Change
Triggered when the state of the room changes.

### On add at {0}
Triggers when an item is added to ArraySchema or MapSchema.

### On field change at {0}
Triggers when a field is changed inside a Schema instance. Need to use

### On change at {0}
Triggers when an item is changed inside ArraySchema or MapSchema.

### On remove at {0}
Triggers when an item is removed from ArraySchema or MapSchema.

### Is index {0}
Only available for Arrays and Maps. Check if index of current item is equals to provided value.

### Is field {0}
Only available during "On change" of a direct object. Checks if a field name has changed.

## Expressions

### JSON
Declare a JSON value.

### CurrentValue
Get value from current item

### PreviousValue
Get previous value from current field. Only available during "On change" on an instance variable. Not avaialble for arrays and maps.

### CurrentValueAt
Get nested value from current item

### CurrentIndex
Get index of current item. Available during "On Add", "On Change" or "On Remove"

### CurrentField
Get current field being changed. Available during "On field change"

### State
Get a value from room's state

### SessionId
Unique sessionId of the current user

