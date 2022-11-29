# 服务器 API &raquo; 房间匹配 API

!!! Warning "一般不需要用到本章内容!"
    本章介绍的是高级用法. 一般情况下只要使用 [客户端方法](/client/#methods) 就够了. 如果客户端方法不能满足需求, 再考虑使用本章介绍的方法.

下面介绍的方法由 `matchMaker` 单例提供, 可以由 `"colyseus"` 包导入:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.createRoom(roomName, options)`
创建新房间

**参数:**

- **`roomName`**: 在 `gameServer.define()` 上定义的房间类型名.
- **`options`**: `onCreate` 的房间参数.

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.joinOrCreate(roomName, options)`

加入或创建房间, 并返回客户端 seat reservation.

**参数:**

- **`roomName`**: 在 `gameServer.define()` 上定义的房间类型名.
- **`options`**: 客户端 seat reservation (调用 `onJoin`/`onAuth` 时使用) 的房间参数.

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

!!! Tip "耗用 seat reservation"
    使用 [客户端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 来加入房间.

## `.reserveSeatFor(room, options)`
房间为客户端保留席位.

**Parameters:**

- **`room`**: 房间数据 (`createRoom()` 等函数的返回值).
- **`options`**: `onCreate` 使用的房间参数.

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

!!! Tip "耗用 seat reservation"
    使用 [客户端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 来加入房间.

## `.join(roomName, options)`
加入房间, 并返回 seat reservation. 如果 `roomName` 没有匹配到房间, 则抛出异常.

**参数:**

- **`roomName`**: 在 `gameServer.define()` 上定义的房间类型名.
- **`options`**: 客户端 seat reservation (调用 `onJoin`/`onAuth` 时使用) 的房间参数.

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

!!! Tip "耗用 seat reservation"
    使用 [客户端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 来加入房间.

## `.joinById(roomId, options)`
基于房间 id 加入房间, 并返回 seat reservation. 如果 `roomId` 没有匹配到房间, 则抛出异常.

**参数:**

- **`roomId`**: 指定房间的 ID.
- **`options`**: 客户端 seat reservation (调用 `onJoin`/`onAuth` 时使用) 的房间参数.

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
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.create(roomName, options)`
创建新房间, 并返回 seat reservation.

**参数:**

- **`roomName`**: 在 `gameServer.define()` 上定义的房间类型名.
- **`options`**: 客户端 seat reservation (调用 `onJoin`/`onAuth` 时使用) 的房间参数.

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
    您可以使用 [客户端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通过预留座位加入房间.

## `.query(conditions)`
执行缓存房间的查询操作.

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
找到一个公开的, 未锁定的, 可用的房间.

**参数:**

- **`roomName`**: 指定房间的类型名.
- **`options`**: 客户端 seat reservation (调用 `onJoin`/`onAuth` 时使用) 的房间参数.

```typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
从远程房间中调用一个方法或返回一个属性.

**参数:**

- **`roomId`**: 指定房间的 ID.
- **`method`**: 需要调用或检索的方法或属性.
- **`args`**: 参数数组.

```typescript
// 基于 id 调用远程房间的 lock 方法
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

## 限制客户端创建房间

可以限制客户端只能调用指定的 matchmaking 方法.

**示例:**

只暴露 "join", "joinById", 和 "reconnect" 方法.

```typescript
import { matchmaker } from "colyseus;

matchMaker.controller.exposedMethods = ['join', 'joinById', 'reconnect'];
```

可供操作的方法有: `'create'`, `'join'`, `'joinById'`, `'joinOrCreate'`, `'reconnect'`,

