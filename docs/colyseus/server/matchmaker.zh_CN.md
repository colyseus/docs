# 伺服器 API » 配對器 API

!!!警告「您可能會需要這個項目！」 本章節用於進階使用。您通常可以使用 {1>client-side methods<1} 應對大部分情況。如果您認為您無法透過用戶端方法達到目標，您應考慮使用本頁中說明的方法。

以下說明的方法由 {1>matchMaker<1} singleton 提供，可以從{2>「colyseus」<2} 包中匯入：

{1>typescript fct\_label="TypeScript" import { matchMaker } from "colyseus"; <1}

{1>javascript fct\_label="JavaScript" const matchMaker = require("colyseus").matchMaker; <1}

## {1>.createRoom(roomName, options)<1}
建立新房間

{1>參數：<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 中定義的識別項。
- {1>{2>選項<2}<1}：{3>onCreate<3} 的選項

{1>typescript const room = await matchMaker.createRoom("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } \*/ <1}

## {1>.joinOrCreate(roomName, options)<1}

加入或建立房間，並傳回用戶端座位保留。

{1>參數：<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 中定義的識別項。
- {1>{2>選項<2}<1}：用戶端座位保留的選項（用於 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示「取用座位保留」您可以使用{1>用戶端的 {2>consumeSeatReservation()<2}<1} 以依其保留的座位加入房間。

## {1>.reserveSeatFor(room, options)<1}
為房間內的用戶端保留座位。

!!!提示「取用座位保留」您可以使用{1>用戶端的 {2>consumeSeatReservation()<2}<1} 以依其保留的座位加入房間。

{1>參數：<1}

- {1>{2>房間<2}<1}：房間資料（來自 {3>createRoom()<3} 之類的結果）
- {1>{2>選項<2}<1}：{3>onCreate<3} 的選項

{1>typescript const reservation = await matchMaker.reserveSeatFor("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

## {1>.join(roomName, options)<1}
加入房間並傳回座位保留。如果沒有 {1>roomName<1} 可用的房間，則會擲回例外。

{1>參數：<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 中定義的識別項。
- {1>{2>選項<2}<1}：用戶端座位保留的選項（用於 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.join("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示「取用座位保留」您可以使用{1>用戶端的 {2>consumeSeatReservation()<2}<1} 以依其保留的座位加入房間。

## {1>.joinById(roomId, options)<1}
依 ID 加入房間，並傳回用戶端座位保留。如果找不到 {1>roomId<1}，則擲回例外。

{1>參數：<1}

- {1>{2>roomId<2}<1}：特定房間執行個體的 ID。
- {1>{2>選項<2}<1}：用戶端座位保留的選項（用於 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.joinById("xxxxxxxxx", {}); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示「取用座位保留」您可以使用{1>用戶端的 {2>consumeSeatReservation()<2}<1} 以依其保留的座位加入房間。

## {1>.create(roomName, options)<1}
建立新房間，並傳回用戶端座位保留。

{1>參數：<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 中定義的識別項。
- {1>{2>選項<2}<1}：用戶端座位保留的選項（用於 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.create("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示「取用座位保留」您可以使用{1>用戶端的 {2>consumeSeatReservation()<2}<1} 以依其保留的座位加入房間。

## {1>.query(conditions)<1}
對快取的房間執行查詢。

{1>typescript const rooms = await matchMaker.query({ name: "battle", mode: "duo" }); console.log(rooms); /* \[ { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } ] \*/ <1}

## {1>.findOneRoomAvailable(roomName, options)<1}
尋找可用的公開且已解除鎖定的房間

{1>參數：<1}

- {1>{2>roomId<2}<1}：特定房間執行個體的 ID。
- {1>{2>選項<2}<1}：用戶端座位保留的選項（用於 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const room = await matchMaker.findOneRoomAvailable("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } \*/ <1}

## {1>.remoteRoomCall(roomId, method, args)<1}
在遠端房間呼叫方法或傳回屬性。

{1>參數：<1}

- {1>{2>roomId<2}<1}：特定房間執行個體的 ID。
- {1>{2>方法<2}<1}：要呼叫或擷取的方法或屬性
- {1>{2>args<2}<1}：引數的陣列

{1>typescript // call lock() on a remote room by id await matchMaker.remoteRoomCall("xxxxxxxxx", "lock"); <1}

