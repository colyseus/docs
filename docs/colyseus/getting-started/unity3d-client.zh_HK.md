# Unity SDK

！！！提示 “自 2021 年 5 月 10 日起的变更记录” [点击这里查阅更多信息](/migrating/unity-sdk-0.14.5)。

# 安装

## 使用 Unity Package Manager

- 前往 Window > Package Manager点击按钮“+”，选择“Add package from git URL...”
- 进入Git URL：`https://github.com/colyseus/colyseus-unity3d.git#upm`
- 点击“ADD”

点击导入示例项目以测试内置的演示文件。

## 使用旧版 `.unitypackage`：

- 下载最新的 [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- 将 `Colyseus_Plugin.unitypackage` 内容导入到您的项目中。

`Colyseus_Plugin.unitypackage` 内含一个示例项目，位于 `Assets/Colyseus/Example`，您可以用作参考。

# 安装

下面我们将向您介绍 Unity 客户端的安装、运行以及连接到 Colyseus 服务器的具体步骤。 

涵盖的主题如下：

- 在本地运行服务器
- 服务器设置
- 连接到服务器
- 连接到房间
- 与房间之间的通信以及房间的状态。 

这些主题内容应足以满足您自行安装客户端的需要了，当然，您也可以使用和修改所提供的示例代码来满足自身需求。

## 在本地运行服务器

要想在本地运行演示服务器，请在您的终端设备上运行以下命令：

``` cd Server npm install npm start ```

内置的演示文件带有一个[房间处理程序](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts)，内含处理游戏实体和玩家的建议。您可随意修改所有内容来满足自身需求！

## 创建 Colyseus 设置对象：

- 在项目文件夹中任意位置点击鼠标右键，选择“Create”，选择“Colyseus”，然后点击“Generate ColyseusSettings Scriptable Object”
- 根据需要填写字段。
  - **服务器地址**
    - 您的 Colyseus 服务器地址
  - **服务器端口**
    - 您的 Colyseus 服务器端口
  - **使用安全协议**
    - 若向您的服务器发送请求和信息时需使用“https”和“wss”协议，请勾选此项。
  - **默认标头**
    - 您可以为您的服务器的非 web 套接字请求添加默认标头，数量不受限制。
    - `ColyseusRequest` 类使用默认标头。
    - 示例标头可包含`"Content-Type"``"名称"`以及`"application/json"``"值"`。

## Colyseus 管理器：

- 您需要创建自己的管理器脚本，可以从  `ColyseusManager` 中获取，也可以使用并修改所提供的 `ExampleManager`. ```csharp public class ExampleManager :ColyseusManager<ExampleManager> ```
- 创建场景内管理器对象来托管您的自定义管理器脚本。
- 在场景检查器中为您的管理器提供 Colyseus 设置对象参考。

## 客户端：

- 调用您管理器中的 `InitializeClient()` 来创建一个 `ColyseusClient` 对象，该对象将储存在 `ColyseusManager` 的变量 `client` 中。它将被用来创建/加入房间以及建立与服务器的连接。```csharp ExampleManager.Instance.InitializeClient(); ```
- 若您的管理器有其他类需要参照您的 `ColyseusClient`， 您可以重写 `InitializeClient` 并在其中建立这些连接。```csharp //In ExampleManager.cs public override void InitializeClient() { base.InitializeClient(); //Pass the newly created Client reference to our RoomController _roomController.SetClient(client); } ```
- 如果您希望管理器中有多个参考 `ColyseusClient`，或者如果您想为您的 `ColyseusClient` 提供一个备用 `endpoint`/`ColyseusSettings` 对象，那么您可以直接调用 `base.InitializeClient()`。
    - 在重写的 `InitializeClient()` 函数中，您可以将一个终结点传递给任何您创建的其他新的 `ColyseusClient`，或者您也可以用 `ColyseusSettings` 对象和`布尔值`来创建一个新的 `ColyseusClient`， 以表明在建立连接时应使用 websocket 协议而不是 http 协议。如果您用`字符串`终结点创建一个新的 `客户端`，那么它将在其构造函数中创建一个 `ColyseusSettings` 对象并从终结点推断协议。```csharp public override void InitializeClient() { chatClient = new ColyseusClient(chatSettings, true); //Endpoint will be chatClient.WebSocketEndpoint deathmatchClient = new ColyseusClient(deathmatchSettings, false); //Endpoint will be deathmatchSettings.WebRequestEndpoint guildClient = new ColyseusClient(guildHostURLEndpoint); //Create the guildClient with only a string endpoint } ```
- 您可以通过调用 `ColyseusClient` 的 `GetAvailableRooms` 来获取服务端上的空闲房间信息：```csharp return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers); ```
## 接入房间

- 有多种创建或加入房间的方式。
- 您可以调用 `ColyseusClient` 的 `创建`方法来创建房间，{2>ColyseusClient<2}将自动在服务端上创建房间实例并加入其中：```csharp ExampleRoomState room = await client.Create<ExampleRoomState>(roomName); ```

- 你可以调用 `JoinById` 来加入特定房间：```csharp ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId); ```

- 您可以调用 `ColyseusClient` 的 `JoinOrCreate`，它会为您匹配并接入空闲房间；在可行的情况下，也会在服务端上创建一个新房间并加入其中：```csharp ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName); ```

## 房间选项：

- 创建新房间时您可以传入一个房间选项字典，比如开始游戏的最少人数要求，或者要在您服务器上运行的自定义逻辑文件的名称。
- 选项所属类型为`对象`，并由`字符串`类型进行键控：``csharp Dictionary<string, object> roomOptions = new Dictionary<string, object> { \["YOUR\_ROOM\_OPTION\_1"] = "option 1", \["YOUR\_ROOM\_OPTION\_2"] = "option 2" };

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate<ExampleRoomState>(roomName, roomOptions); ```

## 房间事件：

`ColyseusRoom` 有您想订阅的各种事件：

### OnJoin
- 客户端成功接入房间后调用。

### onLeave
！！！提示 “更新至 0.14.7 版本” 为处理 websocket 自定义闭包代码，委托函数现在从传递 `WebSocketCloseCode` 值改为传递 `int` 闭包代码。

- 客户端与房间断连后调用。
- 有解释断连原因的 `int` 参数。```csharp room.OnLeave += OnLeaveRoom; ``` 其中 `OnLeaveRoom` 函数为： ```csharp private void OnLeaveRoom(int code) { WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code); LSLog.Log(string.Format("ROOM:ON LEAVE =- Reason: {0} (\\{1\\})", closeCode, code)); } ```

### onStateChange
- 无论何时房间状态发生改变（包括初始状态）都会触发该事件。

```csharp room.OnStateChange += OnStateChangeHandler; private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState) { // Do something with the state } ```

### onError
- 服务器上发生与房间相关的错误时，该事件会一并上报。
- 有错误代码和错误信息的参数

## 房间信息：
您可以监听来自服务器上房间实例的自定义信息，或发送自定义信息至服务器上的房间实例。

### onMessage
- 您可以调用 `OnMessage` 传入类型函数来添加监听器，客户端收到该信息后执行该动作。
- 这些信息有助于了解服务器上房间中发生的事件。（查看我们的[技术演示](https://docs.colyseus.io/demo/shooting-gallery/)，了解关于`OnMessage`的使用案例。）

```csharp room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser => { _currentNetworkedUser = currentNetworkedUser; }); ```

### 发送
- 使用`ColyseusRoom`的`Send`向服务器上的房间发送自定义信息。
- 指定发送到您房间的`type`和可选参数`message`。

```csharp room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes }); ```

### 房间状态：
> 看看如何从 [State Handling](https://docs.colyseus.io/state/schema/#client-side-schema-generation) 生成你的`RoomState`

- 每个房间都有自己的状态。房间的状态变化会自动同步给所有连接的客户端。
- 房间状态同步相关信息：
  - 当用户成功加入房间时，将从服务器接收到全部状态。
  - 每个`patchRate`中，状态的二进制补丁都会被发送给各个客户端（默认50ms）
  - 客户端接收到服务器发来的补丁后即调用	
`onStateChange`。
  - 每个序列化方法都会以其特殊的方式来处理接收到的补丁状态。
- `ColyseusRoomState`是基本的房间状态，您的房间状态将在该状态的基础上变化。
- 查看我们的技术示例，了解房间状态数据同步的实现案例，如联网游戏人物，联网用户或房间属性等。[Shooting Gallery  技术演示](https://docs.colyseus.io/demo/shooting-gallery/)

```csharp public class ExampleRoomState :Schema { \[Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))] public MapSchema<ExampleNetworkedEntity> networkedEntities = new MapSchema<ExampleNetworkedEntity>();
    
    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();
    
    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
} ```

## 调试

若您在 WebSocket 连接打开时在您的应用程序中设置了断点，则连接将在客户端失活3秒后自动断开。为防止 Websocket 断连，您可使用在开发过程中使用`pingInterval:0` during development:

```typescript import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... pingInterval:0 // HERE }); ```

请确保生产环境中 `pingInterval` 值高于 `0`。默认的 `pingInterval` 值为 `3000`。
