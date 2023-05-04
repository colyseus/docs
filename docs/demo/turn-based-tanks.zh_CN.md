# 回合制坦克演示

本演示的目的是提供一个方法将 Colyseus 作为异步, 回合制游戏的引擎.
该演示设计时使用了 Colyseus 0.14.7 版本以及 [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases).

**[下载演示源码](https://github.com/colyseus/unity-demo-tanks/archive/main.zip)** ([在线查看源代码](https://github.com/colyseus/unity-demo-tanks/))

[玩玩看!](https://xcdazr.colyseus.dev/)

![屏幕截图](turn-based-tanks/WeaponFired.PNG)

## 开始

### 启动本地服务器

您需要以 **提供的 Server 目录** 安装并启用服务器来打开本演示. 按照 [这些文档中 Unity3d 部分的 "运行演示服务器"](/getting-started/unity3d-client/#running-the-demo-server) 中的说明操作即可.

### ColyseusSettings ScriptableObject

服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行修改:

![ScriptableObject](common-images/scriptable-object.png)

如果您运行的是本地服务器, 默认的设置就能够满足需求; 但若您希望托管服务器, 则需要按需更改 **Colyseus 服务器地址** 和 **Colyseus 服务器端口**.

## 演示概览

### 房间元数据

本演示使用了房间的元数据, 连同玩家用户名一起跟踪游戏内的玩家. 当一名玩家进入或创建一个房间时, 其用户名将被存储在一个名为 `team0` 或 `team1` 的属性中, `team0` 代表了是这名玩家创建的房间, `team1` 代表这名玩家加入了已创建的房间作为挑战者.
``` javascript
this.metadata.team0
this.metadata.team1

this.setMetadata({"team0": options["creatorId"]});

```

元数据里设置的用户名将用于过滤要在大厅中显示的可用房间. 在大厅里的用户能够看到他们创建的所有房间, 或者看到那些房主在等待挑战者加入的房间. 非由您创建的房间和已有两名玩家的漫客房间则不会被显示在大厅之中.

``` csharp
private TanksRoomsAvailable[] TrimRooms(TanksRoomsAvailable[] originalRooms)
{
    List<TanksRoomsAvailable> trimmedRooms = new List<TanksRoomsAvailable>();
    for (int i = 0; i < originalRooms.Length; ++i)
    {
        //Check a rooms metadata. If its one of our rooms OR waiting for a player, we show it
        TanksRoomMetadata metadata = originalRooms[i].metadata;
        if (metadata.team1 == null || (metadata.team1.Equals(ExampleManager.Instance.UserName) ||
                                       metadata.team0.Equals(ExampleManager.Instance.UserName)))
        {
            trimmedRooms.Add(originalRooms[i]);
        }
    }

    return trimmedRooms.ToArray();
}
```

![大厅](turn-based-tanks/Rooms.PNG)

### 保持房间存在

为了使这个演示成为一个异步的回合制游戏, 我们需要保持房间的存在状态, 即使是在双方玩家都离开房间之后. 通过将 `autoDispose` 标志设为 false, 该房间将继续保持存在状态. (您可以在服务端代码 TanksRoom 中的 onCreate 处理程序中看到这个设定).

``` javascript
this.autoDispose = false;
```

我们知道, 断开房间要在检查确定房间是否应该被关闭后, 再检查在布尔标志 `inProcessOfQuitingGame` 是否为 true 之后才能断开房间. 当一名用户离开游戏时会执行这些检查.
``` javascript

// 检查创作者是否在其他人加入之前就已经退出了
if(this.metadata.team0 && this.metadata.team1 == null) {
    disconnectRoom = true;
}

// 房间里没有其他用户, 所以断开连接
if(this.inProcessOfQuitingGame && this.state.networkedUsers.size <= 1 && this.connectedUsers <= 1) {
    disconnectRoom = true;
}

// 房间是否应该断开连接?
if(disconnectRoom) {
    this.disconnect();
}
```

### 暂停房间

由于这是一个异步游戏的示例, 我们的房间可能呈现某段时间内没有连入用户的状态. 当没有用户连接至房间时, 服务器不需要更新模拟游戏循环.
当用户断开与房间的连接时, 将执行检查以确定房间是否没人了. 当房间里没人时, 将给模拟游戏循环时钟设置一个很大的延迟值以达到暂停模拟游戏循环的目的. 在本示例中, 该值略大于 24 天.
``` javascript

// 在房间的 `onLeave` 处理程序中
// 检查服务器是否应该暂停模拟循环,因为
// 没有用户连接到房间
let anyConnected: boolean = false;
this.state.players.forEach((player, index) => {
    if(player.connected) {
        anyConnected = true;
    }
});

if(anyConnected == false) {
    // 没有用户连接,所以暂停服务器更新
    this.setServerPause(true);
}


private setServerPause(pause: boolean) {

    if(pause) {
        this.setSimulationInterval(dt => this.gameLoop(dt), this.pauseDelay);
    }
    else {
        // 设置模拟间隔回调
        this.setSimulationInterval(dt => this.gameLoop(dt));
    }

    this.serverPaused = pause;
}
```

当用户重新加入被暂停的房间时, 模拟间隔会被恢复.
``` javascript

// 在房间的 `onJoin` 处理程序中
// 检查服务器是否需要解除暂停状态
if(this.serverPaused) {
    // 服务器目前处于暂停状态, 因为有玩家连入, 所以解除暂停状态
    this.setServerPause(false);
}
```

### 进入游戏

打开位于 `Assets\TurnBasedTanks\Scenes\TanksLobby` 的场景 "TanksLobby" 进入游戏. 输入您的用户名然后创建房间开始游戏. **如果您无法进入创建房间界面, 请确认本地服务器运行正常, 并核查 Unity 编辑器的错误日志.** 如果一切顺利, 客户端将加载 "TankArena" 场景. 

- 本演示为异步回合制游戏.

- 您可以随时离开房间, 之后返回进行中的游戏时, 将从最后离开的地方继续.

- 一局游戏中只能有两名玩家.

- 游戏目的是摧毁对手的坦克.

- 每名玩家有 3 点生命值, 显示在屏幕上方角落.

- 当您创建一个房间时, 您可以立即开始您的回合, 无论是否已经有另一名玩家加入.

- 所有控制选项都显示在了 **ESC** 菜单中.

- 您可以使用 ESC 菜单中的退出选项随时离开房间, 也可以向您的对手投降.

- 您的回合开始时有 3 个行动点数. 向左/右移动消耗 **一个** 行动点数, 开火消耗 **两个** 行动点数.

- 移动可以被过高的地形所阻挡.

- 想要发射坦克的武器时, 单击鼠标左键并长按来为射击充能. 松开左键进行开火.

- 您有 3 种射程不同的武器可供选择. 使用数字键 1-3 来选择武器.

- 在每次移动或开火行动后有 2 秒延迟, 之后才能进行下一次行动.

- 在一名玩家的坦克损毁或有人投降时游戏结束, 游戏结束菜单显示胜/负消息, 并展示两个选项: 再来一局或退出游戏. 如果另一名玩家在您离开前要求再来一局, 您的游戏结束菜单上将显示这个消息.

- 您的对手名称旁边会有一个 "在线标志", 来显示其是否与您同时处于房间内.
    - **红色** = 离线
    - **绿色** = 在线

- 可以通过按下空格键来跳过您剩余的回合.

![大厅](turn-based-tanks/GameplayWithLabels.png)
![大厅](turn-based-tanks/GameOver.PNG)

## 调整演示

当您把玩该演示的时候, 您可能希望进行一些调整, 帮您更好地了解各种机制. 下面您会学习到微调带来的效果.

### 游戏规则和武器数据

**Game Rules** 和 **Weapon Data** 的值都可以在服务端代码的 `ArenaServer\src\rooms\tanks\rules.ts` 中找到. **Game Rules** 控制移动和开火的行动点数消耗以及玩家拥有多少行动点数. `weaponList` 里的数据详细规定了每种武器的最大充能, 充能时间, 影响半径和武器威力.

```javascript
const GameRules = {
    MaxActionPoints: 3,
    MovementActionPointCost: 1,
    FiringActionPointCost: 2,
    ProjectileSpeed: 30,
    MaxMovement: 3,
    MaxHitPoints: 3,
    MovementTime: 2,
}

const weaponList = [
    {
        name: "Short Range",
        maxCharge: 5,
        chargeTime: 1,
        radius: 1,
        impactDamage: 1,
        index: 0
    },
    {
        name: "Mid Range",
        maxCharge: 8,
        chargeTime: 2,
        radius: 1,
        impactDamage: 1,
        index: 1
    },
    {
        name: "Long Range",
        maxCharge: 10,
        chargeTime: 5,
        radius: 1,
        impactDamage: 1,
        index: 2
    }
]

```
