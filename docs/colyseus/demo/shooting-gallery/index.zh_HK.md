# Shooting Gallery  技术演示

该技术演示的目的是展示如何制作房间、利用客制化游戏逻辑并处理完整的多人游戏周期。该演示旨在搭配  Colyseus 0.14 版本以及 {1>Unity version 2019.4.20f1<1} 使用。

{1>{2>下载演示<2}<1} ({3>查看源代码<3})

{1>屏幕截图<1}

## 开始

### 启用本地服务器

您需要从{1>提供的服务器目录<1}中选择安装并启用服务器，以正常操作本演示。按照{2>这些文档中 Unity3d 部分之“运行演示服务器”<2}中的说明操作即可。

### ColyseusSettings ScriptableObject

服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行更改：

{1>ScriptableObject<1}

如果您运行的是本地服务器，默认的设置就能够满足需求；但若您希望托管服务器，则需要按需更改{1>Colyseus 服务器地址<1}和{2>Colyseus 服务器端口<2}。

### 播放演示

让玩家出生在“大厅”场景，位置是 {1>Assets\\GalleryShooter\\Scenes\\Lobby<1}。输入你的用户名并创建房间以开始。{2>如果你无法进入房间制作界面，请确认你的本地服务器工作正常，并检查 Unity 编辑器的错误日志。<2}如果你成功了，客户端将加载 “GalleryShooter” 场景。如果你按下 Enter 键，你将“准备就绪”，同时游戏将会开始。如果你在你的本地服务器上等待更多玩家加入，必须在所有玩家都“准备就绪”后游戏才会开始。


## 调整演示

当你播放此演示的时候，你可能希望进行一些调整，帮你更好地了解当前发生的情况。下面你将学习如何进行微调整。

### 目标

游戏内目标的值可以在服务器代码 {1>Server\\src\\rooms\\customLogic\\targets.ts<1} 中找到。在此处，你可以调整分值，重命名目标并添加/移除目标选项。如果你添加了一个新目标，请务必给它一个新的 “id” 值，否则 Unity 客户端将不知道该展示何种目标模型。

客户端上的这些目标选项可以在 “TargetController” 预设中调整，位置是 {1>Assets\\GalleryShooter\\Prefabs\\Targets\\Controls\\TargetController.prefab<1}。如果你希望调整模型或添加新目标，你可以在这里为客户端做准备

### 目标移动

服务器提供的目标将根据其所在行的位置移交给相应的 TargetTreadmill。“行”会在服务器 52 列 {1>target.ts<1} 随机设置。如果你在 GalleryShooter 场景中添加或移除行，服务器必须通过此处对其进行了解：{2>LobbyController.numberOfTargetRows<2}:

{2>LobbyController.numberOfTargetRows<2}:

这个数字将在房间初始化时提供给服务器，并在随机选择目标所在的行时使用该值。

treadmills 单独控制发送目标的频率：

{1>Time between targets<1}

TargetBase 对象在这里控制其自身速度：

{1>Move speed<1}

### 调整枪支

枪支的重要值可以在枪预设这里进行更改：

{1>Guns<1}

### 最大玩家数

默认最大玩家数设置为 {1>25<1}。你可以在 {2>Server\\src\\rooms\\ShootingGalleryRoom.ts<2} 的 {3>94<3} 列更改。或者，如果你不希望设置限制，移除此列即可。

### 调整玩家移动

你可以在位于  {1>Assets\\GalleryShooter\\Prefabs\\GalleryShootPlayer.prefab<1} 的预设中调整玩家的移动值。在这里，你也可以调整远程玩家的插值率以及其他限制。
