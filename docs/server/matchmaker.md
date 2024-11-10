# Server API &raquo; Match-maker API

The methods described below are provided by the `matchMaker` singleton, which can be imported from the `"colyseus"` package:

=== "TypeScript"

    ``` typescript
    import { matchMaker } from "colyseus";
    ```

=== "JavaScript"

    ``` javascript
    const matchMaker = require("colyseus").matchMaker;
    ```

## Stats

Colyseus internally keeps track of statistics for the matchmaker.

### `.stats.fetchAll()`

Fetch all stats from all processes. Returns an array of objects with the following properties:

- **`processId`**: the id of the process.
- **`roomCount`**: the number of rooms on the process.
- **`ccu`**: the number of connected clients on the process.

```typescript
import { matchMaker } from "colyseus";
const stats = await matchMaker.stats.fetchAll();

console.log(stats);
// => [
//    { processId: "xxx", roomCount: 10, ccu: 100 },
//    { processId: "yyy", roomCount: 9, ccu: 90 },
// ]
```

### `.stats.getGlobalCCU()`

Get the total number of connected clients across all processes.

```typescript
import { matchMaker } from "colyseus";
const globalCCU = await matchMaker.stats.getGlobalCCU();

console.log(globalCCU);
// => 190
```

### `.stats.local.ccu`

Holds the number of connected clients on the current process.

### `.stats.local.roomCount`

Holds the number of rooms on the current process.

## Match-making

### `.createRoom(roomName, options)`
Create a new room

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for `onCreate`.

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

### `.joinOrCreate(roomName, options)`

Join or create a room and return a client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`).

``` typescript
const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

### `.reserveSeatFor(room, clientOptions, authData)`

Creates a seat reservation in a specific room.

**Parameters:**

- **`room`**: room data (result from `createRoom()`, etc).
- **`clientOptions`**: options for `onJoin`.
- **`authData`**: authentication data (available during `onJoin` as `client.auth`)

``` typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
const reservation = await matchMaker.reserveSeatFor(room);
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

### `.join(roomName, options)`
Join a room and return seat reservation. An exception is thrown if there are no rooms available for `roomName`.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`).

``` typescript
const reservation = await matchMaker.join("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

### `.joinById(roomId, options)`
Join a room by id and return client seat reservation. An exception is thrown if a room is not found for `roomId`.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`).

``` typescript
const reservation = await matchMaker.joinById("xxxxxxxxx", {});
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

### `.create(roomName, options)`
Create a new room and return client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`).

``` typescript
const reservation = await matchMaker.create("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

### `.query(conditions)`
Perform a query against cached rooms.

``` typescript
const rooms = await matchMaker.query({ name: "battle", mode: "duo" });
console.log(rooms);
/*
  [
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  ]
*/
```

### `.findOneRoomAvailable(roomName, options)`
Find for a public and unlocked room available.

**Parameters:**

- **`roomName`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`).

``` typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

### `.remoteRoomCall(roomId, method, args)`
Call a method or return a property on a remote room.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`method`**: method or attribute to call or retrieve.
- **`args`**: array of arguments.

``` typescript
// call lock() on a remote room by id
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

## Restricting the client-side from creating rooms

You can restrict the client-side to be allowed only to call specific matchmaking methods.

**Example:** by exposing only `join`, `joinById`, and `reconnect` methods, the client-side is
not going to be able to perform `create` or `joinOrCreate` calls.

``` typescript
import { matchmaker } from "colyseus";

matchMaker.controller.exposedMethods = ['join', 'joinById', 'reconnect'];
```

The available methods here are:

- `'create'`
- `'join'`
- `'joinById'`
- `'joinOrCreate'`
- `'reconnect'`

