# Starboss 技术演示
该示例以 [Unity Procedural Boss Demo](https://www.youtube.com/watch?v=LVSmp0zW8pY) [(Source available here)](https://on.unity.com/37K5j1b) 开始,我们的团队将其转化为带有两种不同游戏模式的多人游戏体验.

本技术演示的目的在于展示如何将一个现有的单人游戏项目转化为一个完整的多人游戏循环.该演示旨在搭配 Colyseus 0.14.7 版本以及 [Unity version 2020.1.5f1](https://unity3d.com/unity/qa/lts-releases) 使用.

**[下载演示](https://github.com/colyseus/unity-demo-starboss/archive/main.zip)** ([查看源代码](https://github.com/colyseus/unity-demo-starboss/))

[玩玩看！](https://sac-dt.colyseus.dev/)

![屏幕截图](screenshot.PNG)

## 开始

### 启用本地服务器

您需要从 **提供的服务器目录** 中选择安装并启用服务器, 以正常操作本演示. 按照 [这些文档中 Unity3d 部分之"运行演示服务器"](/getting-started/unity3d-client/#running-the-demo-server) 中的说明操作即可.

### ColyseusSettings ScriptableObject

服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行更改：

![ScriptableObject](../common-images/scriptable-object.png)

如果您运行的是本地服务器,默认的设置就能够满足需求；但若您希望托管服务器,则需要按需更改 **Colyseus 服务器地址** 和 **Colyseus 服务器端口**.

### 播放演示

让玩家出生在"StarBossLobby"场景, 位置是 `Assets\StarBoss\Scenes\StarBossLobby`. 输入您的用户名并创建房间以开始. **如果您无法进入房间制作界面,请确认您的本地服务器工作正常,并检查 Unity 编辑器的错误日志.** 如果您成功了,客户端将会加载 "Scene\_Dev\_Environment" 场景.创建房间时,您将拥有创建合作模式或团队死斗模式的选项.如果您在合作模式房间中按下 Enter 键或单击"开始"按键,您将"准备就绪"并且游戏将会开始.如果您在您的本地服务器上等待更多玩家加入,必须在所有玩家都"准备就绪"后游戏才会开始.如果您创建了团队死斗房间,您将需要至少 1 名其他玩家加入另一队伍,之后才能开始

## 演示概览

### 创建并列出不同游戏模式的房间
在客户端 `StarBossLobbyController.cs` 中的被重写 `CreateRoom` 函数中, 您会看到我们是在哪里决定发布团队死斗模式或合作模式房间的：
```csharp
string gameModeLogic = coopToggle.isOn ? "starBossCoop" : "starBossTDM";
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```
在服务器端的 `StarBossRoom.ts` 我们收到这些 `roomOptions` 并使用  `logic` 成员来决定创建的房间类型：
```javascript
// Retrieve the custom logic for the room
const  customLogic = await  this.getCustomLogic(options["logic"]);
if(customLogic == null) logger.debug("NO Custom Logic Set");
try{
	if(customLogic != null) {
		this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
		customLogic.InitializeLogic(this, options);
	}
}
catch(error){
	logger.error("Error with custom room logic: " + error);
}
```
这一行：
```javascript
this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
```
我们在房间元数据中设置该值为 `isCoop`, 这样我们就可以用于客户端并展示房间类型.

为做到这一点,我们在客户端创建了一个包含 `isCoop` 值的建立序列类 `StarBossRoomMetaData.cs`. 之后我们在我们的自定义 `StarBossRoomAvailable` 中使用此类,它继承自 `ColyseusRoomAvailable`:
```csharp
[System.Serializable]
public class StarBossRoomAvailable : ColyseusRoomAvailable {
    public StarBossRoomMetaData metadata;
}
```
之后通过 `ExampleManager.cs`  我们已经更新了 `GetAvailableRooms` 函数来接收数据类型`StarBossRoomAvailable`:
```csharp
public async void GetAvailableRooms() {
    StarBossRoomAvailable[] rooms = await client.GetAvailableRooms<StarBossRoomAvailable>(_roomController.roomName);
    onRoomsReceived?.Invoke(rooms);
}
```
我们还更新了 `OnRoomsReceived` 委托调用来使用 `StarBossRoomAvailable`.最后,对于收到的每个条目,我们实例化一个附加有 `RoomListItem` 组件的对象,然后将可用房间的引用传给它.在 `DetermineMode` 函数的 `RoomListItem.cs`:
```csharp
bool isCoop = roomRef.metadata.isCoop;

if (isCoop) {
    roomName.text = roomRef.roomId;
    gameMode.text = "Co-op";
    gameMode.color = coopColor;
    backgroundImage.color = coopColor;
}
else {
    roomName.text = roomRef.roomId;
    gameMode.text = "Team Deathmatch";
    gameMode.color = deathmatchColor;
    backgroundImage.color = deathmatchColor;
}
```
最终结果显示为：
![RoomList](room-list.PNG)

## 调整演示

当您播放此演示的时候,您可能希望进行一些调整,帮您更好地了解当前发生的情况.下面您将学习如何进行微调整.

### 团队死斗胜利得分

在客户端,团队死斗胜利得分最大值目前在被重写的 `CreateRoom` 函数中设为 3,位置是 `StarBossLobbyController.cs`:
```csharp
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```

在服务器端,我们收到这些 `roomOptions` 并用其初始化游戏逻辑.仅在初始化团队死斗房间时,我们才使用 `scoreToWin` 选项,正如以下函数 `starBossTDM.js`:
```javascript
roomRef.tdmScoreToWin = options["scoreToWin"] ? Number(options["scoreToWin"]) : 10;
```
