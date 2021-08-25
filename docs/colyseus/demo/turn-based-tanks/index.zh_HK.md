# 回合制坦克演示

本演示的目的是作为使用 Colyseus 的异步、基于回合的游戏的示例。本演示旨在搭配 Colyseus 0.14.7 版本以及 {1>Unity version 2019.4.20f1<1} 使用。

{1>{2>下载演示<2}<1} ({3>查看源代码<3})

{1>播放演示！<1}

{1>大厅<1}

## 开始

### 启用本地服务器

您需要从{1>提供的服务器目录<1}中选择安装并启用服务器，以正常操作本演示。按照{2>这些文档中 Unity3d 部分之“运行演示服务器”<2}中的说明操作即可。

### ColyseusSettings ScriptableObject

服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行更改：

{1>ScriptableObject<1}

如果您运行的是本地服务器，默认的设置就能够满足需求；但若您希望托管服务器，则需要相应地更改 {1>Colyseus 服务器地址<1}和 {2>Colyseus 服务器端口<2}。

## 演示概览

### 房间元数据

本演示使用房间的元数据，通过用户名来追踪游戏内的玩家。当一名玩家加入或创建一个房间时，其用户名将被存储在一个名为 {1>team0<1} 或 {2>team1<2} 的属性中，{3>team0<3} 代表这名玩家创建了房间，{4>team1<4} 代表这名玩家加入了可用房间来挑战其创建者。\`\`\` javascript this.metadata.team0 this.metadata.team1

this.setMetadata({"team0": options\["creatorId"]});

\`\`\`

之后，元数据中设置的用户名将用于筛选大厅中显示的可用房间。在大厅里，用户能够看到他们所创建的任何房间，或者根据房间是否在等待挑战者加入游戏，可以看到可用的房间。非由你创建的房间以及已有两名玩家的房间不会显示在大厅内。

\`\`\` csharp private TanksRoomsAvailable\[] TrimRooms(TanksRoomsAvailable\[] originalRooms) { List{1} trimmedRooms = new List{2}(); for (int i = 0; i < originalRooms.Length; ++i) { //Check a rooms metadata.如果是我们自己创建的房间，或者该房间正在等待一名玩家加入，则显示为 TanksRoomMetadata metadata = originalRooms\[i].metadata; if (metadata.team1 == null || (metadata.team1.Equals(ExampleManager.Instance.UserName) || metadata.team0.Equals(ExampleManager.Instance.UserName))) { trimmedRooms.Add(originalRooms\[i]); } }

    return trimmedRooms.ToArray();
} \`\`\`

{1>大厅<1}

### 保持房间的存在状态

为了使这个演示成为一个异步的回合制游戏，我们需要保持房间的存在状态，即使是在双方玩家都离开房间之后。通过将 {1>autoDispose<1} 标志设为 false，该房间将继续保持存在状态。（你可以在 onCreate 处理程序的 TanksRoom 服务器代码中看到此项）。

{1> javascript this.autoDispose = false; <1}

我们知道，在执行检查确定房间是否应该关闭后，在布尔标志 {1>inProcessOfQuitingGame<1} 被设置为 true 后断开房间。这些检查会在一名用户离开游戏时执行。\`\`\` javascript

// 检查创作者是否在其他人加入之前就已经退出了 if(this.metadata.team0 && this.metadata.team1 == null) { disconnectRoom = true; }

// 房间里没有其他用户，所以断开连接 if(this.inProcessOfQuitingGame && this.state.networkedUsers.size <= 1 && this.connectedUsers <= 1) { disconnectRoom = true; }
	
// 房间是否应该断开连接？ if(disconnectRoom) { this.disconnect(); } \`\`\`

### 暂停房间

由于这是一个异步游戏的示例，我们的房间可能在任何时间都没有用户连接进来。当没有用户连接至房间时，服务器不需要更新模拟循环。当用户断开与房间的连接时，将执行检查以查看是否不再有用户连接到房间。当没有更多用户连接到房间时，通过将延迟设置为高值，可以有效地暂停模拟间隔。在本示例中，该值略大于 24 天。 \`\`\` javascript

// 在房间的 {1>onLeave<1} 处理程序中// 检查服务器是否应该暂停模拟循环，因为//没有用户连接到房间 let anyConnected: boolean = false; this.state.players.forEach((player, index) => { if(player.connected) { anyConnected = true; } });

if(anyConnected == false) { // 没有用户连接，所以暂停服务器更新 this.setServerPause(true); }


private setServerPause(pause: boolean) {

    if(pause) {
        this.setSimulationInterval(dt => this.gameLoop(dt), this.pauseDelay);
    }
    else {
        // Set the Simulation Interval callback
        this.setSimulationInterval(dt => this.gameLoop(dt));
    }

    this.serverPaused = pause;
} \`\`\`

当用户重新加入被暂停的房间时，模拟间隔恢复。\`\`\` javascript

// 在房间的 {1>onJoin<1} 处理程序中// 检查服务器是否需要解除暂停状态 if(this.serverPaused) { // 服务器目前处于暂停状态，由于有玩家加入连接，因此取消暂停状态 this.setServerPause(false); } \`\`\`

### 播放演示

让玩家出生在"TanksLobby"场景，位置是 {1>Assets\\TurnBasedTanks\\Scenes\\TanksLobby<1}。输入你的用户名并创建房间以开始。{2>如果你无法进入房间制作界面，请确认你的本地服务器工作正常，并检查 Unity 编辑器的错误日志。<2}如果你成功了，客户端将加载 "TankArena" 场景。

- 本演示为异步回合制游戏。

- 你可以随时离开房间，之后返回进行中的游戏时，将从最后离开的地方继续。

- 一局游戏中只能有两名玩家。

- 游戏目标是摧毁对手的坦克。

- 每名玩家有 3 点生命值，显示在屏幕上方角落。

- 当你创建一个房间时，你可以立即开始你的回合，无论是否已经有另一名玩家加入。

- 所有控制选项都显示在 {1>ESC<1} 菜单中。

- 你可以使用 ESC 菜单中的退出选项随时离开房间，也可以向你的对手投降。

- 你的回合开始时有 3 个行动点数。向左/右移动消耗{1>一<1}个行动点数，开火消耗{2>两<2}个行动点数。

- 移动可以被过高的地形所阻挡。

- 想要发射坦克的武器时，单击鼠标左键并长按来为射击充能。松开左键进行开火。

- 你有 3 种射程不同的武器可供选择。使用数字键 1-3 来选择武器。

- 在每次移动或开火行动后有 2 秒延迟，之后才能进行下一次行动。

- 在一名玩家的坦克损毁或有人投降时游戏结束，游戏结束菜单显示胜/负消息，并展示两个选项：再来一局或退出游戏。如果另一名玩家在你离开前要求再来一局，你的游戏结束菜单上将显示一条消息。

- 你的对手名称旁边会有一个"在线标志"，来显示其是否与你同时处于房间内。 
	- {1>红色<1} = 离线 
	- {1>绿色<1} = 在线。

- 你可以通过按下空格键来选择跳过你的剩余回合。

{1>大厅<1} {2>大厅<2}

## 调整演示

当你播放此演示的时候，你可能希望进行一些调整，帮你更好地了解当前发生的情况。下面你将学习如何进行微调整。

### 游戏规则和武器数据

{1>Game Rules<1} 和 {2>Weapon Data<2} 的值都可以在游戏代码的{3>ArenaServer\\src\\rooms\\tanks\\rules.ts<3}中找到。{4>Game Rules<4} 控制移动、开火消耗以及玩家拥有多少行动点数。{5>weaponList<5} 的数据详细规定了每种武器的最大充能、充能时间、冲击范围以及冲击伤害。

\`\`\`javascript const GameRules = { MaxActionPoints:3, MovementActionPointCost:1, FiringActionPointCost:2, ProjectileSpeed:30, MaxMovement:3, MaxHitPoints:3, MovementTime:2, }

const weaponList = \[ { name:"Short Range", maxCharge:5, chargeTime:1, radius:1, impactDamage:1, index:0 }, { name:"Mid Range", maxCharge:8, chargeTime:2, radius:1, impactDamage:1, index:1 }, { name:"Long Range", maxCharge:10, chargeTime:5, radius:1, impactDamage:1, index:2 } ]

\`\`\`
