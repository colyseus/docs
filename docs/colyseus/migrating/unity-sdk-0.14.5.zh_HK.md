# 升级至全新 Unity Colyseus SDK 0.14.5（2021 年 5 月 10 日）

## 简介

为了更好地支持后续的版本发布和更新，现有 Colyseus Unity 插件需要进行一些重大变更。我们以一种更加“整体友好”的方式进行了组织和集成，一些类别进行了重命名以避免命名重叠。

[Unity SDK 0.14.5 on GitHub](https://github.com/colyseus/colyseus-unity3d/releases/tag/0.14.5)

## 代码重构

### Plugins 文件夹

代码不再存放在 Plugins 文件夹中。如果您想更新您的项目，可以从 Plugins 文件夹移除所有 colyseus 代码（在导入包之前或之后）。

### 服务器设置

服务器设置被移入了一个更加广义的 ScriptableObject。用户可以拥有不同的开发或生产设置对象，并根据需要将其分配到各自管理器类。

### ColyseusManager

本次重大变更之一在于 ColyseusManager 现在是一个类属型分类，所以您的项目需要一个从 ColyseusManager 继承的类别。

```csharp public class YOUR_MANAGER_CLASS :ColyseusManager<YOUR\_MANAGER\_CLASS> { //您所需要的任何重写或额外功能} ``` 这将允许您根据需要继承和重写管理器的功能，不过如果不需要的话，上面的示例就足够了（或者您也可以使用我们的 ExampleManager，随包提供）。所有 ColyseusClient 处理（之前的“Client”）都应在该类别内进行，不过如果这样的重构对您的代码库来说过于巨大，您可以根据需要公开 ColyseusClient。此外，事先调用 ColyseusManager.Instance 会将 ColyseusManager 对象实例化（如果其当前是空的）。由于这些变更，您现在必须在界面中制作一个 GameObject 并为其附加**您的**管理器脚本。

### 认证以及 `@colyseus/social`

`client.Auth` 已被弃用。如果您的项目依赖该功能，请[将 Auth.cs 文件复制到您的项目中。](https://github.com/colyseus/colyseus-unity3d/blob/2d54b25c1b8118191a627556d06aa14313f269f8/Assets/Plugins/Colyseus/Auth.cs)。

### FossilDeltaSerializer

FossilDeltaSerializer 已经从插件中完全移除。

### 重命名的分类

| **Old Name** | **New Name** | **Notes** | | --- | --- | --- | | MessageHandler | ColyseusMessageHandler | | MatchMakeResponse | ColyseusMatchMakeResponse | Broken out of Client.cs | | Room | ColyseusRoom | | Room Available | ColyseusRoomAvailable | Broken out of Client.cs | | RoomAvailableCollection | CSARoomAvailableCollection | Broken out of Client.cs | | NoneSerializer | ColyseusNoneSerializer | | SchemaSerializer | ColyseusSchemaSerializer | | Serializer | ColyseusSerializer | | Context | ColyseusContext | | Decoder | ColyseusDecoder | | Encoder | ColyseusEncoder | | ReferenceTracker | ColyseusReferenceTracker | | ArraySchema | ColyseusArraySchema | | CustomType | ColyseusCustomType | | Reflection | ColyseusReflection | | ArrayUtils | ColyseusArrayUtils | | Exceptions | ColyseusExceptions | | ExtensionMethods | ColyseusExtensionMethods | | HttpQSCollection | ColyseusHttpQSCollection | Broken out of HttpUtility.cs | | HttpUtility | ColyseusHttpUtility | | ObjectExtensions | ColyseusObjectExtensions | | UnityWebRequestAwaiter | ColyseusUnityWebRequestAwaiter | Broken out of ExtensionMethods.cs | | Client | ColyseusClient | | Connection | ColyseusConnection | | Protocol | ColyseusProtocol |

## 示例集合

- 导入全新 Colyseus Unity 包
- 从 Plugins 文件夹删除所有 Colyseus 代码
  - 目录包含：
    - Colyseus
    - FossilDelta
    - Serialization
    - Websocket
- 创建一个从 `ColyseusManager` 继承的管理器类别。
  - 在界面中放置一个空的游戏对象并附加此脚本（或将其附加至一个现有的管理器类别）
  - 如果您已有一个处理多数 Colyseus 功能的管理器类，可以考虑从 `ColyseusManager` 继承**该**类
- 创建一个服务器设置对象
  - 单击右键 > Create > Colyseus > Generate ColyseusSettings ScriptableObject
  - 在您的管理器的 "ColyseusSettings"字段中分配该对象

预估现有插件的全部潜在用例并在制定这些变更时将其纳入考量，是极其困难的。不过，我们认为所做的变更对于项目的未来有利，能够提高长久性和稳定性。如果您在尝试更新您的项目时遇到任何问题，请联系我们并让我们知悉，这样我们才能提供帮助，并升级该文件以在之后帮助其他开发者！
