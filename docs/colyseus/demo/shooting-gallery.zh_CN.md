# Shooting Gallery 技术演示

该技术演示的目的是展示如何创建房间, 利用自定义游戏逻辑来处理完整的, 多人的游戏循环周期. 该演示设计时使用了 Colyseus 0.14 版本以及 [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases).

**[下载演示源码](https://github.com/colyseus/unity-demo-shooting-gallery/archive/master.zip)** ([在线查看源代码](https://github.com/colyseus/unity-demo-shooting-gallery/))

![屏幕截图](shooting-gallery/screenshot.png)

## 开始

### 启动本地服务器

您需要以 **提供的 Server 目录** 安装并启用服务器来打开本演示. 按照 [这些文档中 Unity3d 部分的 "运行演示服务器"](/getting-started/unity3d-client/#running-the-demo-server) 中的说明操作即可.

### ColyseusSettings ScriptableObject

服务器的所有设置都可通过此处的 ColyseusSetting ScriptableObject 进行修改:

![ScriptableObject](common-images/scriptable-object.png)

如果您运行的是本地服务器, 默认的设置就能够满足需求; 但若您希望托管服务器, 则需要按需更改 **Colyseus 服务器地址** 和 **Colyseus 服务器端口**.

### 进入游戏

打开位于 `Assets\GalleryShooter\Scenes\Lobby` 的场景 "Lobby" 进入游戏. 输入您的用户名然后创建房间开始游戏. **如果您无法进入创建房间界面, 请确认本地服务器运行正常, 并核查 Unity 编辑器的错误日志.** 如果一切顺利, 客户端将加载 "GalleryShooter" 场景. 如果您按下 Enter 键或者点击 “Start” 按钮, 您将进入 "准备就绪" 状态, 然后游戏将会开始. 如果您想等待更多玩家加入, 必须等所有玩家都 "准备就绪" 后游戏才会开始.


## 调整演示

当您把玩该演示的时候, 您可能希望进行一些调整, 帮您更好地了解各种机制. 下面您会学习到微调带来的效果.

### 标靶

游戏内标靶的值可以在服务端代码 `Server\src\rooms\customLogic\targets.ts` 中找到. 在这里, 您可以调整分值, 重命名标靶以及添加/删除标靶配置项. 如果新增一个标靶, 请务必给它一个新的 "id" 值, 否则 Unity 客户端不知道该显示哪种标靶模型.

客户端上的这些标靶配置项可以在 "TargetController"  prefab 中调整, 位置是 `Assets\GalleryShooter\Prefabs\Targets\Controls\TargetController.prefab`. 如果您希望修改模型或添加新标靶, 可以在这里做功课.

### 标靶移动

服务器提供的标靶将根据其所在的行, 交给相应的 TargetTreadmill. "Row" 会在服务端 `target.ts` 的第 52 行随机进行设置. 如果您在 GalleryShooter 场景中添加或删除行, 则必须在服务修正 `LobbyController.numberOfTargetRows` 值:

![LobbyController.numberOfTargetRows](/colyseus/demo/shooting-gallery/number-of-target-rows.png):

这个数字将在房间初始化时提供给服务器, 在选择随机标靶行时使用.

treadmill 将独立控制发送标靶的频率:

![Time between targets](/colyseus/demo/shooting-gallery/time-between-targets.png)

TargetBase 对象在这里控制其自身速度:

![Move speed](/colyseus/demo/shooting-gallery/move-speed.png)

### 调整枪支

枪支的各种参数可以在 Gun prefab 里进行修改:

![Guns](/colyseus/demo/shooting-gallery/guns.png)

### 最大玩家数

默认最大玩家数设为 `25`. 您可以在 `Server\src\rooms\ShootingGalleryRoom.ts` 代码的第 `94` 行更改. 或者, 如果您不希望有人数限制, 移除此行即可.

### 调整玩家移动

您可以在位于 `Assets\GalleryShooter\Prefabs\GalleryShootPlayer.prefab` 的这个 prefab 中调整玩家的移动数值. 在这里您还可以调整远程玩家的移动插值率以及其他限制.
