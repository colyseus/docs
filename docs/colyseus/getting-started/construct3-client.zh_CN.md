# Construct 3 SDK

## 安装

- [下载 Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk)

!!! Warning "注意!您需要一个服务器来使用 Colyseus!"
    众所周知 Construct 具有一个功能可以从客户端 "托管" 多人进程. 这在使用 Colyseus 时并不适用. Colyseus 是一个权威性 **服务器**, 由 Node.js 编写. 不能让客户端直接托管游戏进程.

!!! tip "Construct 3 SDK: 源码"
    您可以在此找到 Construct SDK 的源代码: [Construct 3](https://github.com/colyseus/colyseus-construct3) (与 Construct3 的 C3 和 C2 运行环境兼容) / [Construct 2](https://github.com/colyseus/colyseus-construct2) (非最新版 - 与 0.9.x 服务器兼容)

## 示例项目

请参考如下示例项目来了解如何在 Construct3 上使用 Colyseus.

- [下载 `.c3p` 和服务端文件](https://github.com/colyseus/construct3-demo/archive/refs/heads/master.zip)
- 从 Construct 编辑器中打开 `ConstructProject.c3p` 文件.
- (可选步骤) 运行 `npm install` 和 `npm start` 命令启动本地服务器

要使用本地服务器, 确保已经把 Construct 的 Event Sheet 中全局变量 `serverURI` 的值替换为 `ws://localhost:8080`.

> 项目文件 `.c3p` 和服务端文件已公开于 [colyseus/construct3-demo](https://github.com/colyseus/construct3-demo/) 上.

## 处理消息

从服务器向客户端发送消息时的一个重要注意事项:
您需要提供一个含有 `"type"` 字段的对象,
以便客户端能够进行识别.

**服务器端**

```typescript
this.broadcast("foo", "bar");
```

**客户端**

使用 `On Message` 条件, 以 `"foo"` 作为参数. 表达式 `CurrentValue` 将被赋值为 `"bar"`.


## 属性

### Default Endpoint
使用 "Connect" 行为的默认地址.

## 行为

### Set endpoint to {0}.
格式: wss://example.com

### Join room {0} with options {1}.
以名称为参数加入房间

### Create room {0} with options {1}.
以名称为参数创建房间

### Join room {0} with ID {1}.
以 ID 为参数加入现有房间

### Reconnect into room {0} with sessionId {1}.
重新连接到之前连接过的房间

### Send {0} with {1}.
向房间发送消息

### Leave from the room.
断开客户端与房间的连接

### Get available {0} rooms.
以名称为参数获取房间, 当数据取得时触发 OnGetAvailableRooms. 数据作为 CurrentValue 表达式返回, 内容为 JSON 字符串

## 条件

### On Join
成功加入房间时触发.

### On Leave
离开房间时触发.

### On Error
服务器发生错误时触发.

### On Message ({0})
当房间广播一条消息, 或直接向该客户端发送消息时触发.

### On State Change
当房间 state 改变时触发.

### On Get Available Rooms
当可用的房间数据在 CurrentValue 表达式中被赋值时触发.

### On add at {0}
当 ArraySchema 或 MapSchema 中添加新条目时触发.

### On field change at {0}
当 Schema 实例中某个条目改变时触发.

### On change at {0}
当 ArraySchema 或 MapSchema 中某个条目改变时触发.

### On remove at {0}
当 ArraySchema 或 MapSchema 中某个条目被删除时触发.

### Is index {0}
用于 Array 和 Map. 检查当前条目索引是否与所提供的值相等.

### Is field {0}
用于 direct 对象的 "On change" 条件中. 检查某条目名称是否被改变.

## 表达式

### JSON
声明一个 JSON 值.

### CurrentValue
从当前条目获取值.

### PreviousValue
从当前条目获取上一个值. 用于实例变量的 "On change" 条件中. 不支持 array 和 map.

### CurrentValueAt
从当前条目获取嵌套值.

### CurrentIndex
从当前条目获取索引. 用于 "On Add", "On Change" 或 "On Remove" 条件中.

### CurrentField
获取正在被改变的条目. 用于 "On field change" 条件中.

### State
从房间 State 中获取一个值.

### SessionId
当前用户的唯一 sessionId.

### ErrorCode
获取最新错误代码.

### ErrorMessage
获取最新错误消息.
