# 升級至全新 Unity Colyseus SDK 0.14.5 (2021 年 5 月 10 日)

## 簡介

為了更好地支持後續的版本發布和更新,現有 Colyseus Unity 插件需要進行一些重大變更. 我們以一種更加 "Unity友好" 的方式進行了組織和集成,一些類別進行了重命名以避免命名重疊.

[Unity SDK 0.14.5 on GitHub](https://github.com/colyseus/colyseus-unity3d/releases/tag/0.14.5)

## 代碼重構

### Plugins 文件夾

代碼不再存放在 Plugins 文件夾中.如果您想更新您的項目,可以從 Plugins 文件夾移除所有 colyseus 代碼(在導入包之前或之後).

### 服務器設置

服務器設置被移入了一個更加廣義的 ScriptableObject.用戶可以擁有不同的開發或生產設置對象,並根據需要將其分配到各自管理器類.

### ColyseusManager

本次重大變更之一在於 ColyseusManager 現在是一個類屬型分類,所以您的項目需要一個從 ColyseusManager 繼承的類別.

```csharp
public class YOUR_MANAGER_CLASS : ColyseusManager<YOUR_MANAGER_CLASS>
{
    //Any override or additional functionality you need
}
```
### 認證以及 `@colyseus/social`

`client.Auth` 已被棄用. 如果您的項目依賴該功能,請 [將 Auth.cs 文件復製到您的項目中.](https://github.com/colyseus/colyseus-unity3d/blob/2d54b25c1b8118191a627556d06aa14313f269f8/Assets/Plugins/Colyseus/Auth.cs).

### FossilDeltaSerializer

FossilDeltaSerializer 已經從插件中完全移除.

### 重命名的分類

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

- 導入全新 Colyseus Unity 包
- 從 Plugins 文件夾刪除所有 Colyseus 代碼
    - 目錄包含：
        - Colyseus
        - FossilDelta
        - Serialization
        - Websocket
- 創建一個從 `ColyseusManager` 繼承的管理器類別.
    - 在界面中放置一個空的遊戲對象並附加此腳本(或將其附加至一個現有的管理器類別)
    - 如果您已有一個處理多數 Colyseus 功能的管理器類, 可以考慮從 `ColyseusManager` 繼承**那個**類
- 創建一個服務器設置對象
    - 單擊右鍵 > Create > Colyseus > Generate ColyseusSettings ScriptableObject
    - 在您的管理器的 "ColyseusSettings" 字段中分配該對象

預估現有插件的全部潛在用例並在製定這些變更時將其納入考量, 是極其困難的. 不過, 我們認為所做的變更對於項目的未來有利, 能夠提高長久性和穩定性. 如果您在嘗試更新您的項目時遇到任何問題, 請聯系我們並讓我們知悉, 這樣我們才能提供幫助, 並升級該文件以在之後幫助其他開發者！
