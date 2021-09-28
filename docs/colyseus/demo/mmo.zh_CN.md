﻿
# MMO 技术演示

本技术演示旨在展示一种制作 **基础的** 大型多人游戏(MMO)的方法. 包括聊天系统, 玩家持久性, 多个流动 ColyseusRooms 以及联网的可交互对象. 需注意的是, 本演示包含生产大规模 MMO 所需的数据分区或其他任何负载平衡方式. 本演示使用 Colyseus 0.14.7 版本以及 [Unity version 2020.3.1f1](https://unity3d.com/unity/qa/lts-releases).



**[下载演示](https://github.com/colyseus/unity-demo-mmo/archive/master.zip)** ([查看源代码](https://github.com/colyseus/unity-demo-mmo/))



[玩下看看!](https://xey3jn.us-west-1.colyseus.dev/)

![屏幕截图](mmo/screenshot.PNG)

## 开始



### 启用本地服务器

您需要从 **提供的服务器目录** 中选择安装并启用服务器,以正常操作本演示. 按照 [这些文档中 Unity3d 部分之"运行演示服务器"](/getting-started/unity3d-client/#running-the-demo-server) 中的说明操作即可.

此外, 本演示使用 MongoDB 来实现玩家信息持久性. 若您希望在本地运行此示例, 则需要安装自己的本地数据库或提供自己的(参见 "演示调整" 章节)

[关于如何设置本地示例的详情,可前往 MongoDB 网站查看](https://docs.mongodb.com/guides/server/install/)

### ColyseusSettings ScriptableObject



服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行更改:



![ScriptableObject](common-images/scriptable-object.png)



如果您运行的是本地服务器, 默认的设置就能够满足需求; 但若您希望托管服务器, 则需要按需更改 **Colyseus 服务器地址** 和 **Colyseus 服务器端口**.

## 播放演示

在位于 `ColyseusTechDemo-MMO\Assets\Scenes\MMOLoginScene` 的场景"MMOLoginScene"中登录玩家账号. 若您是初次操作,则需要创建一个账号. 输入您的邮箱地址和密码,登录后即可开始操作. 登录成功后,客户端会加载 "TowerScene" 场景并将 NetworkedEntity 放入其中. 您可以随时按下空格键查看控件, 自定义游戏人物或退出主菜单. 走进位于房间两侧的灰色方块时, 您就会被传送至另一间房.

### 控件
本演示的控件可随时在 Escape 菜单查看, 内容如下:

| Input                            | Description        |
|----------------------------------|--------------------|
| W,A,S,M                          | 移动                |
| 按住Shift键                       | 冲刺                |
| Q,E                              | 旋转人物            |
| 上滑/下滑                         | 放大/缩小           |
| 按住并拖动鼠标右键                 | 摄像头轴转           |
| `                                | 切换聊天窗口         |

## 演示概览
本演示旨在向用户展示如何使用 Colyseus 来设计并实现一款 MMO 游戏. 它强调了以下特性:
### 动态房间
可按需创建并配置 MMORooms. 当玩家进入一个网格空间时, 我们就加入一个房间, 并将其`progress`值设为网格值, 如 `arena.config.ts`:
```
javascript gameServer.define('lobby_room', MMORoom).filterBy(["progress"]); // Filter room by "progress" (which grid we're wanting to join EX: -1x2)
```
当玩家在地图中移动时,可以基于他们所在的网格位置加入/离开房间. 玩家尝试更新游戏进度时, 客户端会向服务器端发送一条消息, 然后服务器端会在 MMORoom.ts 中捕捉这条信息: `MMORoom.ts`:
```javascript
this.onMessage("transitionArea", (client: Client, transitionData: Vector[]) => {
    if (transitionData == null || transitionData.length < 2) {
        logger.error(`*** Grid Change Error! Missing data for grid change! ***`);
        return;
    }
    this.onGridUpdate(client, transitionData[0] as  Vector2, transitionData[1] as  Vector3);
});
```

在确定了新的网格位置之后，客户机将获得一个新的SeatServation来消费，从而加入正确的ColyseusRoom以获得新的网格位置。登录/注册时也会出现类似的流（请参阅玩家持久性部分）。

![MapScreenshop](mmo/map.PNG)

这是本演示中使用的网格地图. 除绿色网格之外, 其他网格都带有互通出口, 您可以在这些网格之间进出.比如在 `-3x3` 网格空间中, 您可以通过西北方向的出口进入到 `3x-3` 网格空间. 所有其他相连的网格之间都有互通出口. 仅与角落有接触的网格空间, 其出口在角落上, 玩家可以在对角线上穿梭.

### 聊天系统
![ChatScreenshot](mmo/chatScreenshot.PNG) 我们有另一个 ColyseusRoom 来处理聊天系统: `ChatRoom.ts`. 不论是从哪里(服务器端或客户端)进入或离开 MMORoom, 我们都会同时进入或离开 ChatRoom. 这些聊天室均经过 `roomId` 筛选, 后者与接入 MMORoom 的 ID 是一致的. 客户端发送的消息会被添加到 ChatRoomState's ChatQueue, 触发所有已连接的客户端状态变更. 每一条新进消息都会收到一个 `timeStamp` 值, 接收到后该信息就会被移出队列.
### 玩家持久性
!!! tip "用户身份认证说明"
    本演示使用的是很基础的用户认证体系, 目的是为了让玩家能够持续使用唯一的用户账号, 该方式不可用于真实场景去实现整体用户身份认证.
    请勿使用任何您在其他地方真实使用的邮箱和密码组合.

在本演示中, 为记录玩家的游戏进度(玩家目前所在的房间以及离开游戏前所在的房间), 所在位置, 游戏币余额等信息, 玩家的唯一账号会保留在数据库中.
需要注册玩家账号才能播放本演示. 成功认证用户身份后, 房间席位预定将回传至客户端. 席位预定的会话 id 会作为 "pendingSessionId" 被保存至数据库中玩家账号条目中. 客户端尝试使用席位预定时, 房间的 "onAuth" 处理程序会执行玩家账号查找操作, 来让玩家顺利进入房间. 若查找不到与 "pendingSessionId" 匹配的玩家账号, 客户端则无法加入房间. 但是在成功查找到玩家账号后, "pendingSessionId" 变为 "activeSessionId", 则玩家可加入房间.
匹配过程中玩家的游戏进度将被用来过滤房间. 比如, 游戏进度值为"1,1"(代表其在网格区域中坐标为 1x1)的玩家将被匹配进具有相同进度值的房间(若房间已存在). 若不存在具有相同进度值的房间, 则系统会自动创建一个. 因此, 只有当玩家在时才存在与其网格坐标匹配的房间. 玩家通过任一网格出口离开网格区域, 进入另一个网格时, 其游戏进度将会更新.
### 可交互元素
![Interactables](mmo/coinOp.PNG)网格周围可能会散落`Interactables`. 这些是 `InteractableState` 架构对象在客户端的展示. 我们制作新网格空间预制件时会将它们放入编辑器中. 玩家与其中一个对象互动时, 客户端会向服务器端发送一条 `objectInteracted` 消息. 若服务器端还未获取到已提供的对象交互 ID, 则会创建一个新的架构引用, 将其添加至房间的架构映射中, 并回传给客户端. 然后服务器会客户端是否具备执行互动的条件. 若成功, 所有客户端将会收到一条 `objectUsed`广播消息, 包含交互对象的 ID 以及与之互动的用户. 客户端上, 适当的 `NetworkedEntity` 和 `Interactable` 对象则会被告知一起执行. 本演示中有 4 种不同类型的交互元素, 您可在不同的网格空间中找到:
-按键台
    - 用户每按一次可获得一枚硬币
-投币骑乘机
    - 一个小骑乘机, 可暂时禁用您的控件并来回弹跳晃动您的 NetworkedEntity. 每次使用消耗 1 枚金币
- 传送器
    - 一个能够将使用者传送至其 "退出平台" 的小平台. 使用时消耗 2 枚金币
- 特效旋涡
    - 按钮台的替代品, 没有消耗也没有作用, 只在按下时显示一个酷炫的特效(使用默认服务器类型)

## 调整演示

当您播放此演示的时候, 您可能希望进行一些调整, 帮您更好地了解当前发生的情况. 下面您将学习如何进行微调整.

## 调整演示

“当您玩这个演示时，您可能需要进行一些调整，以便更好地熟悉正在发生的事情。下面，您将学习如何进行这些小调整。

### 使用您自己的数据库

如果您希望将此演示指向您自己的数据库, 您需要在 `Server` 目录下的 `arena.env` 中提供一个不同的 Mongo 连接字符串, 它当前期望您托管一个本地的 Mongo 数据库:
``` javascript
DEMO_DATABASE=mongodb://localhost:27017/demo?retryWrites=true&w=majority
```

### 聊天消息显示时间
在客户端, 您可以通过更改 `ChatManager.cs` 上的公共 `messageShowTime` 变量来更改消息显示的时长, 然后在 `MMOManager.cs`:
```csharp
private async void JoinChatRoom()
{
    ColyseusRoom<ChatRoomState> chatRoom = await client.JoinOrCreate<ChatRoomState>("chat_room", new Dictionary<string, object>() { { "roomID", Room.Id }, {"messageLifetime", ChatManager.Instance.messageShowTime} });
    ChatManager.Instance.SetRoom(chatRoom);
}
```

### 添加您自己的交互对象
如果您想向客户端添加一个新的交互对象, 其必须继承自 `Interactable.cs`. 查看其他交互对象, 想想您可以做什么. 如果您想重写您的交互对象的 `serverType` 值, 您也应当为您在服务器上的新 `serverType` 添加一个案例: `interactableObjectFactory.ts`:
```javascript
export  function  getStateForType(type: string) : InteractableState {
	let  state : InteractableState = new  InteractableState();
	//Any new types need an appropriate constructor in here or they will return empty
	switch(type){
		case("DEFAULT"):
		{
			state.assign({
				coinChange :  0,
				interactableType :  type,
				useDuration :  5100.0
			});
			break;
		}

		case("BUTTON_PODIUM"):
		{
			state.assign({
				coinChange :  1,
				interactableType :  type,
				useDuration :  10000.0
			});
			break;
		}
		case("COIN_OP"):
		{
			state.assign({
				coinChange : -1,
				interactableType :  type,
				useDuration :  5100.0
			});
			break;
		}
		case("TELEPORTER"):
		{
			state.assign({
				coinChange : -2,
				interactableType :  type,
				useDuration :  5100.0
			});
			break;
		}
	}
	return  state;
}
```
变量 `coinChange` 是在使用金币时用户的金币数量应该改变的数值. 如果该值为负(金币使用的交互成本)服务器将在成功响应之前确认用户拥有足够金币, 如函数中所示 `handleObjectCost` in `MMORoom.ts`:
``` javascript
handleObjectCost(object: InteractableState, user: NetworkedEntityState): boolean {
    let cost: number = object.coinChange;
    let worked: boolean = false;

    //Its a gain, no need to check
    if (cost >= 0) {
      user.coins += cost;
      worked = true;
    }
    //Check if user can afford this
    if (cost < 0) {
      if (Math.abs(cost) <= user.coins) {
        user.coins += cost;
        worked = true;
      }
      else {
        worked = false;
      }
    }

    return worked;
  }
```
如果该检查成功, 目标交互将正常继续进行.
变量 `useDuration` 是用来考虑交互对象在于用户交互后能够保持 `inUse` 多久的因素. 当一个交互对象被使用后, 其 `availableTimestamp` 将被设定为:
``` javascript
interactableObject.inUse = true;
interactableObject.availableTimestamp = this.state.serverTime + interactableObject.useDuration;
```
服务器之后将检查每个 `simulationInterval`:
``` javascript
checkObjectReset() {
    this.state.interactableItems.forEach((state: InteractableState) => {
      if (state.inUse && state.availableTimestamp <= this.state.serverTime) {
        state.inUse = false;
        state.availableTimestamp = 0.0;
      }
    });
  }
```
如果 `serverTime` 显示时机已到, 这将重置  MMORoom 中任何交互对象的 `inUse` 值.
