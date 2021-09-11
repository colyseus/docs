# 升级至全新 Unity Colyseus SDK 0.14.5 (2021 年 5 月 10 日)

## 简介

为了更好地支持后续的版本发布和更新,现有 Colyseus Unity 插件需要进行一些重大变更. 我们以一种更加 "Unity友好" 的方式进行了组织和集成,一些类别进行了重命名以避免命名重叠.

[Unity SDK 0.14.5 on GitHub](https://github.com/colyseus/colyseus-unity3d/releases/tag/0.14.5)

## 代码重构

### Plugins 文件夹

代码不再存放在 Plugins 文件夹中.如果您想更新您的项目,可以从 Plugins 文件夹移除所有 colyseus 代码(在导入包之前或之后).

### 服务器设置

服务器设置被移入了一个更加广义的 ScriptableObject.用户可以拥有不同的开发或生产设置对象,并根据需要将其分配到各自管理器类.

### ColyseusManager

本次重大变更之一在于 ColyseusManager 现在是一个类属型分类,所以您的项目需要一个从 ColyseusManager 继承的类别.

```csharp
public class YOUR_MANAGER_CLASS : ColyseusManager<YOUR_MANAGER_CLASS>
{
    //Any override or additional functionality you need
}
```
### 认证以及 `@colyseus/social`

`client.Auth` 已被弃用. 如果您的项目依赖该功能,请 [将 Auth.cs 文件复制到您的项目中.](https://github.com/colyseus/colyseus-unity3d/blob/2d54b25c1b8118191a627556d06aa14313f269f8/Assets/Plugins/Colyseus/Auth.cs).

### FossilDeltaSerializer

FossilDeltaSerializer 已经从插件中完全移除.

### 重命名的分类

| **Old Name** | **New Name** | **Notes** |
| --- | --- | --- |
| MessageHandler | ColyseusMessageHandler |
| MatchMakeResponse | ColyseusMatchMakeResponse | Broken out of Client.cs |
| Room | ColyseusRoom |
| Room Available | ColyseusRoomAvailable | Broken out of Client.cs |
| RoomAvailableCollection | CSARoomAvailableCollection | Broken out of Client.cs |
| NoneSerializer | ColyseusNoneSerializer |
| SchemaSerializer | ColyseusSchemaSerializer |
| Serializer | ColyseusSerializer |
| Context | ColyseusContext |
| Decoder | ColyseusDecoder |
| Encoder | ColyseusEncoder |
| ReferenceTracker | ColyseusReferenceTracker |
| ArraySchema | ColyseusArraySchema |
| CustomType | ColyseusCustomType |
| Reflection | ColyseusReflection |
| ArrayUtils | ColyseusArrayUtils |
| Exceptions | ColyseusExceptions |
| ExtensionMethods | ColyseusExtensionMethods |
| HttpQSCollection | ColyseusHttpQSCollection | Broken out of HttpUtility.cs |
| HttpUtility | ColyseusHttpUtility |
| ObjectExtensions | ColyseusObjectExtensions |
| UnityWebRequestAwaiter | ColyseusUnityWebRequestAwaiter | Broken out of ExtensionMethods.cs |
| Client | ColyseusClient |
| Connection | ColyseusConnection |
| Protocol | ColyseusProtocol |

## 示例集合

- 导入全新 Colyseus Unity 包
- 从 Plugins 文件夹删除所有 Colyseus 代码
    - 目录包含：
        - Colyseus
        - FossilDelta
        - Serialization
        - Websocket
- 创建一个从 `ColyseusManager` 继承的管理器类别.
    - 在界面中放置一个空的游戏对象并附加此脚本(或将其附加至一个现有的管理器类别)
    - 如果您已有一个处理多数 Colyseus 功能的管理器类, 可以考虑从 `ColyseusManager` 继承**那个**类
- 创建一个服务器设置对象
    - 单击右键 > Create > Colyseus > Generate ColyseusSettings ScriptableObject
    - 在您的管理器的 "ColyseusSettings" 字段中分配该对象

预估现有插件的全部潜在用例并在制定这些变更时将其纳入考量, 是极其困难的. 不过, 我们认为所做的变更对于项目的未来有利, 能够提高长久性和稳定性. 如果您在尝试更新您的项目时遇到任何问题, 请联系我们并让我们知悉, 这样我们才能提供帮助, 并升级该文件以在之后帮助其他开发者！
