# 状态同步

Colyseus 通过其强类型的 [`Schema` 结构](/state/schema/) 自动处理状态同步.

### 它是如何运作的？

- 当用户成功加入房间时，将从服务器接收取全部状态.
- 每个 [补丁帧](/server/room/#patchrate-number)，都会把状态的二进制补丁会发送给每个客户端（默认为 `50ms`）.
- 客户端收到补丁进行同步时，会触发 [回调函数](/state/schema/#callbacks).
- 客户端收到补丁同步完成时，触发 [`onStateChange`](/client/room/#onstatechange).
- 无论服务器端状态如何改变, 已连接的客户端会总会确保与服务器保持同步.

![状态同步图](state-sync.png)
