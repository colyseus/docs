!!! Warning "You may not need this!"
    The methods described below are for advanced usage. You're usually good to go by using the [client-side methods](/client/client/#methods). If you think you can't achieve your goal with the built-in methods, you should consider using the methods directly from the `matchMaker` methods documented here.

The methods described below are provided by the `matchMaker` singleton, which can be imported from the `"colyseus"` package:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.joinOrCreate(roomName, options)`

Join or create a room and return a client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = matchMaker.joinOrCreate("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.create(roomName, options)`
Create a new room and return client seat reservation.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = matchMaker.create("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.join(roomName, options)`
Join a room and return seat reservation. An exception is thrown if there are no rooms available for `roomName`.

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = matchMaker.join("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.joinById(roomId, options)`
Join a room by id and return client seat reservation. An exception is thrown if room is not found for `roomId`.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const reservation = matchMaker.join("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.query(conditions)`
Perform a query against cached rooms.

```typescript
const rooms = matchMaker.query({ name: "battle", mode: "duo" });
console.log(rooms);
/*
  [
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false },
    { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  ]
*/
```

## `.findOneRoomAvailable(roomName, options)`
Find for a public and unlocked room available

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`options`**: options for the client seat reservation (for `onJoin`/`onAuth`)

```typescript
const room = matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
Call a method or return a property on a remote room.

**Parameters:**

- **`roomId`**: the id of a specific room instance.
- **`method`**: method or attribute to call or retrieve
- **`args`**: array of arguments

## `.createRoom(roomName, options)`
Create a new room

**Parameters:**

- **`roomName`**: the identifier you defined on `gameServer.define()`.
- **`options`**: options for `onCreate`

```typescript
const room = matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.reserveSeatFor(room, options)`
Reserve a seat for a client in a room.

!!! Tip "Consuming the seat reservation"
    You can use [`consumeSeatReservation()` from the client-side](/client/client/#consumeseatreservation-reservation) to join the room by its reserved seat.

**Parameters:**

- **`room`**: room data (result from `createRoom()`, etc)
- **`options`**: options for `onCreate`

```typescript
const reservation = matchMaker.reserveSeatFor("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

