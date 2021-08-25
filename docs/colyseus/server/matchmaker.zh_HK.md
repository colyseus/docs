# Server API » Match-maker API

!!!警告：“您可能不需要这样做！” 本部分介绍高级用法。您通常可以使用 {1>客户端方法<1}。如果不能使用客户端方法来实现目上标，可以考虑使用本页介绍的方法。

下面介绍的方法由 {1>matchMaker<1} 单一实例提供，可以从 {2>"colyseus"<2} 包导入:

{1>typescript fct\_label="TypeScript" import { matchMaker } from "colyseus"; <1}

{1>javascript fct\_label="JavaScript" const matchMaker = require("colyseus").matchMaker; <1}

## {1>.createRoom(roomName, options)<1}
创建新房间

{1>Parameters:<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 上定义的标识符。
- {1>{2>options<2}<1}：{3>onCreate<3} 的选项

{1>typescript const room = await matchMaker.createRoom("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } \*/ <1}

## {1>.joinOrCreate(roomName, options)<1}

加入或创建房间，并返回客户端座位保留量。

{1>Parameters:<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 上定义的标识符。
- {1>{2>options<2}<1}：客户端的座位保留选项（用于 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.joinOrCreate("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示 "耗用座位保留量“ 您可以使用{1>客户端的 {2>consumeSeatReservation()<2}<1}，通过预留座位加入房间。

## {1>.reserveSeatFor(room, options)<1}
为客户端保留房间座位。

!!!提示 "耗用座位保留量“ 您可以使用{1>客户端的 {2>consumeSeatReservation()<2}<1}，通过预留座位加入房间。

{1>Parameters:<1}

- {1>{2>room<2}<1}：房间数据（{3>createRoom()<3} 等函数的结果）
- {1>{2>options<2}<1}：{3>onCreate<3} 的选项

{1>typescript const reservation = await matchMaker.reserveSeatFor("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

## {1>.join(roomName, options)<1}
加入房间，并返回座位保留量。如果 {1>roomName<1} 没有房间，则抛出异常。

{1>Parameters:<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 上定义的标识符。
- {1>{2>options<2}<1}：客户端的座位保留选项（用于 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.join("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示 "耗用座位保留量“ 您可以使用{1>客户端的 {2>consumeSeatReservation()<2}<1}，通过预留座位加入房间。

## {1>.joinById(roomId, options)<1}
按  id 加入房间，并返回座位保留量。如果 {1>roomName<1} 没有房间，则抛出异常。

{1>Parameters:<1}

- {1>{2>roomId<2}<1}：一个特定房间实例的 ID。
- {1>{2>options<2}<1}：客户端的座位保留选项（用于 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.joinById("xxxxxxxxx", {}); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示 "耗用座位保留量“ 您可以使用{1>客户端的 {2>consumeSeatReservation()<2}<1}，通过预留座位加入房间。

## {1>.create(roomName, options)<1}
创建房间，并返回客户座位保留量。

{1>Parameters:<1}

- {1>{2>roomName<2}<1}：您在 {3>gameServer.define()<3} 上定义的标识符。
- {1>{2>options<2}<1}：客户端的座位保留选项（用于 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const reservation = await matchMaker.create("battle", { mode: "duo" }); console.log(reservation); /* { "sessionId": "zzzzzzzzz", "room": { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } } \*/ <1}

!!!提示 "耗用座位保留量“ 您可以使用{1>客户端的 {2>consumeSeatReservation()<2}<1}，通过预留座位加入房间。

## {1>.query(conditions)<1}
执行预存房间查询。

{1>typescript const rooms = await matchMaker.query({ name: "battle", mode: "duo" }); console.log(rooms); /* \[ { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false }, { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } ] \*/ <1}

## {1>.findOneRoomAvailable(roomName, options)<1}
查找公用和已解锁的

{1>Parameters:<1}

- {1>{2>roomId<2}<1}：一个特定房间实例的 ID。
- {1>{2>options<2}<1}：客户端的座位保留选项（用于 {3>onJoin<3}/{4>onAuth<4}）

{1>typescript const room = await atchMaker.findOneRoomAvailable("battle", { mode: "duo" }); console.log(room); /* { "roomId": "xxxxxxxxx", "processId": "yyyyyyyyy", "name": "battle", "locked": false } \*/ <1}

## {1>.remoteRoomCall(roomId, method, args)<1}
调用一个方法或返回一个远程房间的属性。

{1>Parameters:<1}

- {1>{2>roomId<2}<1}：一个特定房间实例的 ID。
- {1>{2>method<2}<1}: 方法或属性，用于调用或检索
- {1>{2>args<2}<1}: 参数数组

{1>typescript // call lock() on a remote room by id await matchMaker.remoteRoomCall("xxxxxxxxx", "lock"); <1}

