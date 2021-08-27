# 状态同步

Colyseus 通过其强类型的 [`Schema` 结构](/state/schema/) 自动处理状态同步。

### 它是如何运作的？

- 当用户成功加入房间时，将从服务器接收到全部状态。
- 每 [patchRate](/server/room/#patchrate-number)，状态的二进制补丁会发送给每个客户端（默认为 `50ms`）
- 应用来自服务器的补丁时，客户端会触发 [schema callbacks](/state/schema/#callbacks)。
- 客户端中应用了全部最新补丁时，触发 [`onStateChange`](/client/room/#onstatechange)。
- 您的客户端逻辑可以随时变异房间状态。已连接客户端会永远确保与服务器保持同步。

![状态同步图表](state-sync.png)