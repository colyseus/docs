# Unity SDK

！！！提示 “自 2021 年 5 月 10 日起的变更记录” {1>点击这里查阅更多信息<1}。

# 安装

## 使用 Unity Package Manager

- 前往 Window > Package Manager点击按钮“+”，选择“Add package from git URL...”
- 进入Git URL：{1>https://github.com/colyseus/colyseus-unity3d.git#upm<1}
- 点击“ADD”

点击导入示例项目以测试内置的演示文件。

## 使用旧版 {1>.unitypackage<1}：

- 下载最新的 {1>Colyseus Unity SDK<1}
- 将 {1>Colyseus\_Plugin.unitypackage<1} 内容导入到您的项目中。

{1>Colyseus\_Plugin.unitypackage<1} 内含一个示例项目，位于 {2>Assets/Colyseus/Example<2}，您可以用作参考。

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

{1> cd Server npm install npm start <1}

内置的演示文件带有一个{1>房间处理程序<1}，内含处理游戏实体和玩家的建议。您可随意修改所有内容来满足自身需求！

## 创建 Colyseus 设置对象：

- 在项目文件夹中任意位置点击鼠标右键，选择“Create”，选择“Colyseus”，然后点击“Generate ColyseusSettings Scriptable Object”
- 根据需要填写字段。
  - {1>服务器地址<1}
    - 您的 Colyseus 服务器地址
  - {1>服务器端口<1}
    - 您的 Colyseus 服务器端口
  - {1>使用安全协议<1}
    - 若向您的服务器发送请求和信息时需使用“https”和“wss”协议，请勾选此项。
  - {1>默认标头<1}
    - 您可以为您的服务器的非 web 套接字请求添加默认标头，数量不受限制。
    - {1>ColyseusRequest<1} 类使用默认标头。
    - 示例标头可包含{2>"Content-Type"<2}{1>"名称"<1}以及{4>"application/json"<4}{3>"值"<3}。

## Colyseus 管理器：

- 您需要创建自己的管理器脚本，可以从  {1>ColyseusManager<1} 中获取，也可以使用并修改所提供的 {2>ExampleManager<2}. {3}csharp public class ExampleManager :ColyseusManager<ExampleManager> {4}
- 创建场景内管理器对象来托管您的自定义管理器脚本。
- 在场景检查器中为您的管理器提供 Colyseus 设置对象参考。

## 客户端：

- 调用您管理器中的 {1>InitializeClient()<1} 来创建一个 {2>ColyseusClient<2} 对象，该对象将储存在 {4>ColyseusManager<4} 的变量 {3>client<3} 中。它将被用来创建/加入房间以及建立与服务器的连接。{5>csharp ExampleManager.Instance.InitializeClient(); <5}
- 若您的管理器有其他类需要参照您的 {1>ColyseusClient<1}， 您可以重写 {2>InitializeClient<2} 并在其中建立这些连接。{3>csharp //In ExampleManager.cs public override void InitializeClient() { base.InitializeClient(); //Pass the newly created Client reference to our RoomController \_roomController.SetClient(client); } <3}
- 如果您希望管理器中有多个参考 {1>ColyseusClient<1}，或者如果您想为您的 {4>ColyseusClient<4} 提供一个备用 {2>endpoint<2}/{3>ColyseusSettings<3} 对象，那么您可以直接调用 {5>base.InitializeClient()<5}。
    - 在重写的 {1>InitializeClient()<1} 函数中，您可以将一个终结点传递给任何您创建的其他新的 {2>ColyseusClient<2}，或者您也可以用 {4>ColyseusSettings<4} 对象和{5>布尔值<5}来创建一个新的 {3>ColyseusClient<3}， 以表明在建立连接时应使用 websocket 协议而不是 http 协议。如果您用{7>字符串<7}终结点创建一个新的 {6>客户端<6}，那么它将在其构造函数中创建一个 {8>ColyseusSettings<8} 对象并从终结点推断协议。{9>csharp public override void InitializeClient() { chatClient = new ColyseusClient(chatSettings, true); //Endpoint will be chatClient.WebSocketEndpoint deathmatchClient = new ColyseusClient(deathmatchSettings, false); //Endpoint will be deathmatchSettings.WebRequestEndpoint guildClient = new ColyseusClient(guildHostURLEndpoint); //Create the guildClient with only a string endpoint } <9}
- 您可以通过调用 {2>ColyseusClient<2} 的 {1>GetAvailableRooms<1} 来获取服务端上的空闲房间信息：{3>csharp return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers); <3}
## 接入房间

- 有多种创建或加入房间的方式。
- 您可以调用 {2>ColyseusClient<2} 的 {1>创建<1}方法来创建房间，{2>ColyseusClient<2}将自动在服务端上创建房间实例并加入其中：{3>csharp ExampleRoomState room = await client.Create<ExampleRoomState>(roomName); <3}

- 你可以调用 {1>JoinById<1} 来加入特定房间：{2>csharp ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId); <2}

- 您可以调用 {2>ColyseusClient<2} 的 {1>JoinOrCreate<1}，它会为您匹配并接入空闲房间；在可行的情况下，也会在服务端上创建一个新房间并加入其中：{3>csharp ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName); <3}

## 房间选项：

- 创建新房间时您可以传入一个房间选项字典，比如开始游戏的最少人数要求，或者要在您服务器上运行的自定义逻辑文件的名称。
- 选项所属类型为{1>对象<1}，并由{2>字符串<2}类型进行键控：\`\`csharp Dictionary<string, object> roomOptions = new Dictionary<string, object> { \["YOUR\_ROOM\_OPTION\_1"] = "option 1", \["YOUR\_ROOM\_OPTION\_2"] = "option 2" };

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate{1}(roomName, roomOptions); \`\`\`

## 房间事件：

{1>ColyseusRoom<1} 有您想订阅的各种事件：

### OnJoin
- 客户端成功接入房间后调用。

### onLeave
！！！提示 “更新至 0.14.7 版本” 为处理 websocket 自定义闭包代码，委托函数现在从传递 {2>WebSocketCloseCode<2} 值改为传递 {1>int<1} 闭包代码。

- 客户端与房间断连后调用。
- 有解释断连原因的 {1>int<1} 参数。{2>csharp room.OnLeave += OnLeaveRoom; <2} 其中 {3>OnLeaveRoom<3} 函数为： {4}csharp private void OnLeaveRoom(int code) { WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code); LSLog.Log(string.Format("ROOM:ON LEAVE =- Reason: {0} (\\{1\\})", closeCode, code)); } {5}

### onStateChange
- 无论何时房间状态发生改变（包括初始状态）都会触发该事件。

{1>csharp room.OnStateChange += OnStateChangeHandler; private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState) { // Do something with the state } <1}

### onError
- 服务器上发生与房间相关的错误时，该事件会一并上报。
- 有错误代码和错误信息的参数

## 房间信息：
您可以监听来自服务器上房间实例的自定义信息，或发送自定义信息至服务器上的房间实例。

### onMessage
- 您可以调用 {1>OnMessage<1} 传入类型函数来添加监听器，客户端收到该信息后执行该动作。
- 这些信息有助于了解服务器上房间中发生的事件。（查看我们的{1>技术演示<1}，了解关于{2>OnMessage<2}的使用案例。）

{1>csharp room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser => { \_currentNetworkedUser = currentNetworkedUser; }); <1}

### 发送
- 使用{2>ColyseusRoom<2}的{1>Send<1}向服务器上的房间发送自定义信息。
- 指定发送到您房间的{1>type<1}和可选参数{2>message<2}。

{1>csharp room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes }); <1}

### 房间状态：
> 看看如何从 {2>State Handling<2} 生成你的{1>RoomState<1}

- 每个房间都有自己的状态。房间的状态变化会自动同步给所有连接的客户端。
- 房间状态同步相关信息：
  - 当用户成功加入房间时，将从服务器接收到全部状态。
  - 每个{1>patchRate<1}中，状态的二进制补丁都会被发送给各个客户端（默认50ms）
  - 客户端接收到服务器发来的补丁后即调用	
{1>onStateChange<1}。
  - 每个序列化方法都会以其特殊的方式来处理接收到的补丁状态。
- {1>ColyseusRoomState<1}是基本的房间状态，您的房间状态将在该状态的基础上变化。
- 查看我们的技术示例，了解房间状态数据同步的实现案例，如联网游戏人物，联网用户或房间属性等。Shooting Gallery  技术演示

\`\`\`csharp public class ExampleRoomState :Schema { \[Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))] public MapSchema{1} networkedEntities = new MapSchema{2}();
    
    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();
    
    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
} \`\`\`

## 调试

若您在 WebSocket 连接打开时在您的应用程序中设置了断点，则连接将在客户端失活3秒后自动断开。为防止 Websocket 断连，您可使用在开发过程中使用{1}pingInterval: 0{2}:

\`\`\`typescript import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... pingInterval:0 // HERE }); \`\`\`

请确保生产环境中 {1>pingInterval<1} 值高于 {2>0<2}。默认的 {3>pingInterval<3} 值为 {4>3000<4}。
