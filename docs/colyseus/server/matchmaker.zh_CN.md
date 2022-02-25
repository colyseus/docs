# Server API &raquo; Match-maker API

!!! Warning "您可能不需要这样做!"
    本部分介绍高级用法. 您通常可以使用 [客户端方法](/client/client/#methods). 如果不能使用客户端方法来实现目上标, 可以考虑使用本页介绍的方法.

下面介绍的方法由 `matchMaker` 单一实例提供, 可以从 `"colyseus"` 包导入:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.createRoom(roomName, options)`
创建新房间

**Parameters:**

- **`roomName`**: 您在 `gameServer.define()` 上定义的标识符.
- **`options`**: `onCreate` 的选项

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.joinOrCreate(roomName, options)`

加入或创建房间, 并返回客户端座位保留量.

**Parameters:**

- **`roomName`**: 您在 `gameServer.define()` 上定义的标识符.
- **`options`**: 客户端的座位保留选项(用于 `onJoin` / `onAuth`)

```typescript
const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "耗用座位保留量"
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.reserveSeatFor(room, options)`
为客户端保留房间座位.

!!! Tip "耗用座位保留量"
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

**Parameters:**

- **`room`**: 房间数据(`createRoom()` 等函数的结果)
- **`options`**: `onCreate` 的选项

```typescript
const reservation = await matchMaker.reserveSeatFor("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

## `.join(roomName, options)`
加入房间, 并返回座位保留量. 如果 `roomName` 没有房间, 则抛出异常.

**参数:**

- **`roomName`**: 您在 `gameServer.define()` 上定义的标识符.
- **`options`**: 客户端的座位保留选项(用于 `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.join("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "耗用座位保留量"
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.joinById(roomId, options)`
按 id 加入房间, 并返回座位保留量. 如果 `roomName` 没有房间,则抛出异常.

**参数:**

- **`roomId`**: 一个特定房间实例的 ID.
- **`options`**: 客户端的座位保留选项(用于 `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.joinById("xxxxxxxxx", {});
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "耗用座位保留量"
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.create(roomName, options)`
创建房间, 并返回客户座位保留量.

**参数:**

- **`roomName`**: 您在 `gameServer.define()` 上定义的标识符.
- **`options`**: 客户端的座位保留选项(用于 `onJoin`/`onAuth`)

```typescript
const reservation = await matchMaker.create("battle", { mode: "duo" });
console.log(reservation);
/*
  {
    "sessionId": "zzzzzzzzz",
    "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
  }
*/
```

!!! Tip "耗用座位保留量"
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.query(conditions)`
执行预存房间查询.

```typescript
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

## `.findOneRoomAvailable(roomName, options)`
查找公用和已解锁的

**参数:**

- **`roomName`**: 指定房间实例的 ID.
- **`options`**: 客户端的座位保留选项(用于 `onJoin`/`onAuth`)

```typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
调用一个方法或返回一个远程房间的属性.

**参数:**

- **`roomId`**: 一个特定房间实例的 ID.
- **`method`**: 方法或属性, 用于调用或检索
- **`args`**: 参数数组

```typescript
// call lock() on a remote room by id
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

