# Construct 3 SDK

## 安装

- [下载 Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-client)

!!! Warning "注意！你需要一个服务器来使用 Colyseus！"
    众所周知 Construct 的现有功能可以从客户端"托管"一个多人进程. 这在使用 Colyseus 时是不可能的.Colyseus 是一个权威性 **服务器**,由 Node.js 编写. 你无法使你的客户端直接托管游戏进程.

!!! tip "Construct 3 SDK:Source code"
    你可以在此找到 Construct SDK 的源代码：[Construct 3](https://github.com/colyseus/colyseus-construct3) (与 Construct3 的 C3 和 C2 运行时间兼容 / [Construct 2](https://github.com/colyseus/colyseus-construct2) (非最新版 - 与 0.9.x 服务器兼容)

## 示例项目

示例项目与 [TypeScript (pixijs-boilerplate)](https://github.com/endel/colyseus-pixijs-boilerplate) 有相同的结果.

- [客户端(c3p 项目)](/_downloads/ColyAgarClient-0-14-0.c3p)
- [Glitch 上的服务器端(源代码)](https://glitch.com/~colyseus-construct3)


## 处理消息

从服务器向客户端发送消息时的一个重要注意事项：你需要提供一个拥有 `"type"` 字段的对象, 以便客户端能够进行解析.

**服务器端**

```
typescript this.broadcast("foo", "bar");
```

**客户端**

使用 `On Message` 条件,以 `"foo"` 作为自变数. 表达式 `CurrentValue` 将拥有一个数值 `"栏"`.


## 属性

### 默认端点
使用"Connect"行动的默认端点.

## 行动

### 设置端点为{0}
格式：wss://example.com

### 以{1}选项加入房间{0}.
以名称加入房间

### 以{1}选项加入房间{0}.
以名称加入房间

### 以{1}选项创建房间{0}.
以名称创建房间

### 以{1}选项加入房间{0}.
以 ID 加入现有房间

### 以 sessionId {1} 重新连接至房间{0}.
使用之前连接过的房间重新连接

### 以{1}发送{0}
向一个房间发送消息

### 从房间离开
从房间断开客户端连接.

### 获得可用的{0}房间.
以名称获得可用房间,当数据可用时 OnGetAvailableRooms 触发.数据以 JSON 字符串 CurrentValue 表达式返回

## 条件

### 加入时
成功加入房间时触发.

### 离开时
离开房间时触发.

### 错误时
服务器发生错误时触发.

### On Message ({0})
当房间广播一条消息,或直接向本客户端发送消息时触发.

### 状态改变时
当房间状态改变时触发.

### 获得可用房间时
当可用的房间数据在CurrentValue表达式中准备好时触发.

### 添加时{0}
当一个项添加至ArraySchema或MapSchema时触发.

### 字段改变时{0}
当Schema实例中字段改变时触发.需要使用

### 改变时{0}
当ArraySchema或MapSchema中的一个项发生改变时触发.

### 移除时{0}
当一个项从ArraySchema或MapSchema移除时触发.

### 作为索引{0}
仅对Arrays和Maps可用.检查当前项的索引是否与提供的值相等.

### 作为字段{0}
只有在直接对象"改变"时可用.检查一个字段名是否被更改.

## 表达式

### JSON
声明一个 JSON 值.

### CurrentValue
从当前项获取值

### PreviousValue
从当前项获取之前的值.只有在实例变量"改变"时可用.arrays和maps不可用.

### CurrentValueAt
从当前项获取嵌套值

### CurrentIndex
从当前项获取索引."添加", "改变"或"移除"时可用

### CurrentField
获取被更改的当前字段."字段更改"时可用

### 状态
获取房间状态的值

### SessionId
当前用户的独特 sessionId

### ErrorCode
获取上一个错误代码

### ErrorMessage
获取上一条错误消息
