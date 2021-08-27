# 伺服器 API » 配對器 API

!!!警告「您可能會需要這個項目！」 本章節用於進階使用。您通常可以使用 [client-side methods](/client/client/#methods) 應對大部分情況。如果您認為您無法透過用戶端方法達到目標，您應考慮使用本頁中說明的方法。

以下說明的方法由 `matchMaker` singleton 提供，可以從`「colyseus」` 包中匯入：

```typescript fct_label="TypeScript" import { matchMaker } from "colyseus"; ```

```javascript fct_label="JavaScript" const matchMaker = require("colyseus").matchMaker; ```

## `.createRoom(roomName, options)`
建立新房間

**參數：**

- **`roomName`**：您在 `gameServer.define()` 中定義的識別項。
- **`選項`**：`onCreate` 的選項

```typescript const room = await matchMaker.createRoom("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } */ ```

## `.joinOrCreate(roomName, options)`

加入或建立房間，並傳回用戶端座位保留。

**參數：**

- **`roomName`**：您在 `gameServer.define()` 中定義的識別項。
- **`選項`**：用戶端座位保留的選項（用於 `onJoin`/`onAuth`）

```typescript const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } */ ```

!!!提示「取用座位保留」您可以使用[用戶端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation) 以依其保留的座位加入房間。

## `.reserveSeatFor(room, options)`
為房間內的用戶端保留座位。

!!!提示「取用座位保留」您可以使用[用戶端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation) 以依其保留的座位加入房間。

**參數：**

- **`房間`**：房間資料（來自 `createRoom()` 之類的結果）
- **`選項`**：`onCreate` 的選項

```typescript const reservation = await matchMaker.reserveSeatFor("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } */ ```

## `.join(roomName, options)`
加入房間並傳回座位保留。如果沒有 `roomName` 可用的房間，則會擲回例外。

**參數：**

- **`roomName`**：您在 `gameServer.define()` 中定義的識別項。
- **`選項`**：用戶端座位保留的選項（用於 `onJoin`/`onAuth`）

```typescript const reservation = await matchMaker.join("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } */ ```

!!!提示「取用座位保留」您可以使用[用戶端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation) 以依其保留的座位加入房間。

## `.joinById(roomId, options)`
依 ID 加入房間，並傳回用戶端座位保留。如果找不到 `roomId`，則擲回例外。

**參數：**

- **`roomId`**：特定房間執行個體的 ID。
- **`選項`**：用戶端座位保留的選項（用於 `onJoin`/`onAuth`）

```typescript const reservation = await matchMaker.joinById("xxxxxxxxx", {}); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } */ ```

!!!提示「取用座位保留」您可以使用[用戶端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation) 以依其保留的座位加入房間。

## `.create(roomName, options)`
建立新房間，並傳回用戶端座位保留。

**參數：**

- **`roomName`**：您在 `gameServer.define()` 中定義的識別項。
- **`選項`**：用戶端座位保留的選項（用於 `onJoin`/`onAuth`）

```typescript const reservation = await matchMaker.create("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } */ ```

!!!提示「取用座位保留」您可以使用[用戶端的 `consumeSeatReservation()`](/client/client/#consumeseatreservation-reservation) 以依其保留的座位加入房間。

## `.query(conditions)`
對快取的房間執行查詢。

```typescript const rooms = await matchMaker.query({ name: "battle", mode: "duo" }); console.log(rooms); /* [ { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } ] */ ```

## `.findOneRoomAvailable(roomName, options)`
尋找可用的公開且已解除鎖定的房間

**參數：**

- **`roomId`**：特定房間執行個體的 ID。
- **`選項`**：用戶端座位保留的選項（用於 `onJoin`/`onAuth`）

```typescript const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } */ ```

## `.remoteRoomCall(roomId, method, args)`
在遠端房間呼叫方法或傳回屬性。

**參數：**

- **`roomId`**：特定房間執行個體的 ID。
- **`方法`**：要呼叫或擷取的方法或屬性
- **`args`**：引數的陣列

```typescript // call lock() on a remote room by id await matchMaker.remoteRoomCall("xxxxxxxxx", "lock"); ```

