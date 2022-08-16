# Unity SDK

!!! tip "自 2021 年 5 月 10 日起的变更记录"
    [详情请参考这里](/migrating/unity-sdk-0.14.5).

# 安装

## 使用 Unity Package Manager

- 打开 Window > Package Manager. 点击按钮 "+", 选择 "Add package from git URL..."
- 输入 Git URL: `https://github.com/colyseus/colyseus-unity3d.git#upm`
- 点击 "ADD"

点击导入示例项目以测试内置的演示文件.

## 使用旧版 `.unitypackage`:

- 下载最新的 [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- 将 `Colyseus_Plugin.unitypackage` 内容导入到您的项目中.

`Colyseus_Plugin.unitypackage` 内含一个示例项目, 位于 `Assets/Colyseus/Example`, 以供您用作参考.

# 安装

下面我们将向您介绍在 Unity 客户端安装, 运行以及连接到 Colyseus 服务器的具体步骤.

主要内容包括:

- 在本地运行服务器
- 服务器配置
- 连接到服务器
- 连接到房间
- 与房间以及房间 state 的交互.

这些内容涵盖了客户端连接服务器的基本需求, 当然, 您也可以使用和修改示例代码来满足自定义需求.

## 在本地运行服务器

要想在本地运行演示服务器, 请在设备终端上运行以下命令:

```
cd Server
npm install
npm start
```

内置的演示文件带有一个 [房间处理程序](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts), 内含处理游戏实体和玩家的标准方法. 您可随意修改任何内容来满足自定义需求!

## 创建 Colyseus 配置对象:

- 在项目目录任意位置点击鼠标右键, 选择 "Create", 选择 "Colyseus", 然后点击 "Generate ColyseusSettings Scriptable Object"
- 根据需要填写字段.
    - **Server Address**
        - 您的 Colyseus 服务器地址
    - **Server Port**
        - 您的 Colyseus 服务器端口
    - **Use secure protocol**
        - 如果需要服务器发送请求和信息时使用 "https" 和 "wss" 协议, 请勾选此项.
    - **Default headers**
        - 您可以为服务器的非 web socket 请求添加无限个默认 header.
        - 默认 header 由 `ColyseusRequest` 类使用.
        - 比如一个 header 可以包含一个 `"Content-Type"` 的 `"Name"` 和一个 `"application/json"` 的 `"Value"`.

## Colyseus Manager:

- 您可以创建自己的管理器脚本, 记得继承 `ColyseusManager` 类; 也可以修改并使用自带的 `ExampleManager`.
```csharp
public class ExampleManager : ColyseusManager<ExampleManager>
```
- 创建放置于场景内的管理器对象以执行自定义管理器脚本.
- 在场景检查器中为 Colyseus Settings 对象提供一个管理器引用.

## 客户端:

- 调用管理器中的 `InitializeClient()` 方法来创建一个 `ColyseusClient` 对象, 该对象将储存在 `ColyseusManager` 的变量 `client` 中. 它将被用来创建/加入房间以及建立与服务器的连接.
```csharp
ExampleManager.Instance.InitializeClient();
```
- 如果您有其他类需要引用这个 `ColyseusClient`, 您可以覆盖 `InitializeClient` 方法, 并在其中提交客户端引用.
```csharp
//文件 ExampleManager.cs
public override void InitializeClient()
{
    base.InitializeClient();
    //向 RoomController 提交新建立的客户端引用
    _roomController.SetClient(client);
}
```
- 如果需要多个 `ColyseusClient`, 或者想为 `ColyseusClient` 提供另一个 `endpoint` / `ColyseusSettings` 对象, 那么您可以不调用 `base.InitializeClient()`.
    - 在重写的 `InitializeClient()` 函数中, 您可以把地址手动提交给新创建的 `ColyseusClient`, 或者使用 `ColyseusSettings` 对象和一个 `bool` 值来构造新的 `ColyseusClient`, 其中那个布尔值表示是否使用 websocket 协议代替不是 http 协议. 如果您用 `字符串` 地址创建了一个新的 `Client`, 那么其构造函数中会创建一个 `ColyseusSettings` 对象并从地址字符串里推断该使用的传输协议.
```csharp
public override void InitializeClient()
{
    chatClient = new ColyseusClient(chatSettings, true);                //地址为 chatClient.WebSocketEndpoint
    deathmatchClient = new ColyseusClient(deathmatchSettings, false);   //地址为 deathmatchSettings.WebRequestEndpoint
    guildClient = new ColyseusClient(guildHostURLEndpoint);             //手动传入字符串地址以创建 guildClient 对象
}
```
- 可以通过调用 `ColyseusClient` 的 `GetAvailableRooms` 函数以获取服务器上可用的房间:
```csharp
return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers);
```
## 连入房间

- 有多种创建/加入房间的方法.
- 调用 `ColyseusClient` 的 `Create` 方法将在服务器上创建房间并自动进入该房间:
```csharp
ExampleRoomState room = await client.Create<ExampleRoomState>(roomName);
```

- 调用 `JoinById` 以加入指定房间:
```csharp
ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId);
```

- 调用 `ColyseusClient` 的 `JoinOrCreate`, 会自动匹配并接入可用房间. 必要情况下也会在服务端上创建一个新房间并加入其中:
```csharp
ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName);
```

## 房间参数:

- 创建新房间时可以传入一个房间参数字典, 比如开始游戏的最少人数要求, 或是要在服务器上运行的自定义脚本文件名.
- 这些参数都是 `object` 类型的, 并由 `string` 类型的键作为索引:
```csharp
Dictionary<string, object> roomOptions = new Dictionary<string, object>
{
    ["YOUR_ROOM_OPTION_1"] = "option 1",
    ["YOUR_ROOM_OPTION_2"] = "option 2"
};

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate<ExampleRoomState>(roomName, roomOptions);
```

## 房间事件:

`ColyseusRoom` 里有各种各样的事件可供监听:

### OnJoin
- 客户端成功接入房间后触发.

### onLeave
!!! tip "于 0.14.7 版本更新"
    为处理自定义 websocket 关闭代码, 代理函数现在从传递 `WebSocketCloseCode` 值改为传递 `int` 关闭代码.

- 客户端与房间断连后触发.
- 包括解释断连原因的 `int` 参数.
```csharp
room.OnLeave += OnLeaveRoom;
```
- 其中 `OnLeaveRoom` 函数如下所示:
```csharp
private void OnLeaveRoom(int code)
  {
      WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code);
      LSLog.Log(string.Format("ROOM: ON LEAVE =- Reason: {0} ({1})", closeCode, code));
  }
```

### onStateChange
- 无论何时房间 state 发生改变, 包括最开始的初始化, 都会触发该事件.

```csharp
room.OnStateChange += OnStateChangeHandler;
private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState)
{
    // 使用 state 编写逻辑代码
}
```

### onError
- 服务器上发生与房间相关的错误时, 会触发该事件提交到客户端.
- 包括错误代码和错误信息的参数.

## 房间信息:
可以监听来自服务器房间的自定义消息, 或发送自定义消息到服务器房间.

### onMessage
- 可以调用 `OnMessage` 并传入消息类型和回调函数来添加监听器, 客户端收到该信息后会触发该监听器.
- 消息很有助于了解服务器房间中发生了什么事. (参考 [技术演示](https://docs.colyseus.io/demo/shooting-gallery/), 了解 `OnMessage` 的使用案例)

```csharp
room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser =>
{
    _currentNetworkedUser = currentNetworkedUser;
});
```

### Send
- 使用 `ColyseusRoom` 的 `Send` 方法向服务器上的房间发送自定义消息.
- 指定发送到房间的消息 `type` 和可选参数 `message`.

```csharp
room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes });
```

### Room State:
> 了解如何使用 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

- 每个房间都有自己的 state. 房间 state 的变化会自动同步给所有已连接的客户端.
- 关于房间状态同步:
    - 当用户成功加入房间时, 将从服务器接收到全部 state.
    - 每隔一个 `patchRate` 的时间, 状态的二进制补丁都会被发送给各个客户端 (默认 50ms)
    - 客户端每次收到服务器发来的补丁都触发 `onStateChange`.
    - 每个序列化方法都分别以自己的逻辑来处理收到的 state 补丁.
- `ColyseusRoomState` 是基类, 自定义房间 state 要继承它.
- 查看我们的技术示例, 了解房间状态数据同步的实现方法, 包括网游实体, 联网用户或房间属性等. [Shooting Gallery 技术演示](https://docs.colyseus.io/demo/shooting-gallery/)

```csharp
public class ExampleRoomState : Schema
{
    [Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))]
    public MapSchema<ExampleNetworkedEntity> networkedEntities = new MapSchema<ExampleNetworkedEntity>();

    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();

    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
}
```

## 调试

若您在 WebSocket 连接状态下对应用设置了断点, 则连接将在客户端失活 3 秒后自动断开. 为防止 Websocket 断连, 请在开发过程中使用 `pingInterval:0`:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // 写在这里
});
```

请确保在生产环境中使用大于 `0` 的 `pingInterval`. 默认的 `pingInterval` 值为 `3000`.
