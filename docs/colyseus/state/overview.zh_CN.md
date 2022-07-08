# 状态数据同步

Colyseus 通过其强类型的 [`Schema` 结构](/state/schema/) 自动进行状态同步.

### 它是如何运作的?

- 当用户成功加入房间时, 将从服务器接收取完整 state.
- 每个 [补丁帧](/server/room/#patchrate-number), 都会把 state 的二进制差别补丁发送给每个客户端 (默认频率为 `50ms`).
- 客户端收到补丁时, 会触发 [schema 回调函数](/state/schema/#callbacks).
- 客户端收到并同步全部最新补丁后, 触发 [`onStateChange` 函数](/client/room/#onstatechange).
- 服务端逻辑可以随时任意更改 state, 已连接的客户端总是会与服务器保持同步.

![state 同步](state-sync.png)