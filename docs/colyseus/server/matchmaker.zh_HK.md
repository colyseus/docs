# Server API &raquo; Match-maker API

!!! Warning "您可能不需要這樣做!"
    本部分介紹高級用法. 您通常可以使用 [客戶端方法](/client/#methods). 如果不能使用客戶端方法來實現目上標, 可以考慮使用本頁介紹的方法.

下面介紹的方法由 `matchMaker` 單一實例提供,可以從 `"colyseus"` 包匯入:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.createRoom(roomName, options)`
創建新房間

**Parameters:**

- **`roomName`**: 您在 `gameServer.define()` 上定義的標識符.
- **`options`**: `onCreate` 的選項

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.joinOrCreate(roomName, options)`

加入或創建房間, 並返回客戶端座位保留量.

**Parameters:**

- **`roomName`**: 您在 `gameServer.define()` 上定義的標識符.
- **`options`**: 客戶端的座位保留選項(用於 `onJoin` / `onAuth`)

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
    您可以使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通過預留座位加入房間.

## `.reserveSeatFor(room, options)`
為客戶端保留房間座位.

!!! Tip "耗用座位保留量"
    您可以使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通過預留座位加入房間.

**Parameters:**

- **`room`**: 房間數據(`createRoom()` 等函數的結果)
- **`options`**: `onCreate` 的選項

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
加入房間, 並返回座位保留量. 如果 `roomName` 沒有房間, 則拋出異常.

**參數:**

- **`roomName`**: 您在 `gameServer.define()` 上定義的標識符.
- **`options`**: 客戶端的座位保留選項(用於 `onJoin`/`onAuth`)

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
    您可以使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通過預留座位加入房間.

## `.joinById(roomId, options)`
按  id 加入房間, 並返回座位保留量. 如果 `roomName` 沒有房間, 則拋出異常.

**參數:**

- **`roomId`**: 一個特定房間實例的 ID.
- **`options`**: 客戶端的座位保留選項(用於 `onJoin`/`onAuth`)

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
    您可以使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通過預留座位加入房間.

## `.create(roomName, options)`
創建房間, 並返回客戶座位保留量.

**參數:**

- **`roomName`**: 您在 `gameServer.define()` 上定義的標識符.
- **`options`**: 客戶端的座位保留選項(用於 `onJoin`/`onAuth`)

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
    您可以使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation), 通過預留座位加入房間.

## `.query(conditions)`
執行預存房間查詢.

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
查找公用和已解鎖的

**參數:**

- **`roomName`**: 一個特定房間實例的 ID.
- **`options`**: 客戶端的座位保留選項(用於 `onJoin`/`onAuth`)

```typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
調用一個方法或返回一個遠端房間的屬性.

**參數:**

- **`roomId`**: 一個特定房間實例的 ID.
- **`method`**: 方法或屬性, 用於調用或檢索
- **`args`**: 參數數組

```typescript
// call lock() on a remote room by id
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

