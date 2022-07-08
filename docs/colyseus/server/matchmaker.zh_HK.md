# Server API &raquo; Match-maker API

!!! Warning "一般不需要用到本章內容!"
    本章介紹的是高級用法. 一般情況下只要使用 [客戶端方法](/client/#methods) 就夠了. 如果客戶端方法不能滿足需求, 再考慮使用本章介紹的方法.

下面介紹的方法由 `matchMaker` 單例提供, 可以由 `"colyseus"` 包導入:

```typescript fct_label="TypeScript"
import { matchMaker } from "colyseus";
```

```javascript fct_label="JavaScript"
const matchMaker = require("colyseus").matchMaker;
```

## `.createRoom(roomName, options)`
創建新房間

**參數:**

- **`roomName`**: 在 `gameServer.define()` 上定義的房間類型名.
- **`options`**: `onCreate` 的房間參數.

```typescript
const room = await matchMaker.createRoom("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.joinOrCreate(roomName, options)`

加入或創建房間, 並返回客戶端 seat reservation.

**參數:**

- **`roomName`**: 在 `gameServer.define()` 上定義的房間類型名.
- **`options`**: 客戶端 seat reservation (調用 `onJoin`/`onAuth` 時使用) 的房間參數.

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
    使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 來加入房間.

## `.reserveSeatFor(room, options)`
房間為客戶端保留席位.

**Parameters:**

- **`room`**: 房間數據 (`createRoom()` 等函數的返回值).
- **`options`**: `onCreate` 使用的房間參數.

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
    使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 來加入房間.

## `.join(roomName, options)`
加入房間, 並返回 seat reservation. 如果 `roomName` 沒有匹配到房間, 則拋出異常.

**參數:**

- **`roomName`**: 在 `gameServer.define()` 上定義的房間類型名.
- **`options`**: 客戶端 seat reservation (調用 `onJoin`/`onAuth` 時使用) 的房間參數.

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
    使用 [客戶端的 `consumeSeatReservation()`](/client/#consumeseatreservation-reservation) 耗用掉 seat reservation 來加入房間.

## `.joinById(roomId, options)`
基於房間 id 加入房間, 並返回 seat reservation. 如果 `roomId` 沒有匹配到房間, 則拋出異常.

**參數:**

- **`roomId`**: 指定房間的 ID.
- **`options`**: 客戶端 seat reservation (調用 `onJoin`/`onAuth` 時使用) 的房間參數.

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
創建新房間, 並返回 seat reservation.

**參數:**

- **`roomName`**: 在 `gameServer.define()` 上定義的房間類型名.
- **`options`**: 客戶端 seat reservation (調用 `onJoin`/`onAuth` 時使用) 的房間參數.

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
執行緩存房間的查詢操作.

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
找到一個公開的, 未鎖定的, 可用的房間.

**參數:**

- **`roomName`**: 指定房間的類型名.
- **`options`**: 客戶端 seat reservation (調用 `onJoin`/`onAuth` 時使用) 的房間參數.

```typescript
const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" });
console.log(room);
/*
  { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }
*/
```

## `.remoteRoomCall(roomId, method, args)`
從遠程房間中調用一個方法或返回一個屬性.

**參數:**

- **`roomId`**: 指定房間的 ID.
- **`method`**: 需要調用或檢索的方法或屬性.
- **`args`**: 參數數組.

```typescript
// 基於 id 調用遠程房間的 lock 方法
await matchMaker.remoteRoomCall("xxxxxxxxx", "lock");
```

