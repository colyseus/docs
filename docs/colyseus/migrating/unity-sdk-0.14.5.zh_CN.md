# 升級到新的 Unity Colyseus SDK 0.14.5（2021 年 5 月 10 日）

## 簡介

為了更好地支持未來的版本和更新，現有的 Colyseus Unity 插件需要進行一些相當大的更改。代碼已以更 “Unity 友好” 的方式組織和整合，並且某些類別已重新命名以防止命名重疊。

{1>GitHub 上的 Unity SDK 0.14.5<1}

## 代碼重構

### 外掛程式資料夾

代碼不再位於外掛程式資料夾中。如果您正在更新您的專案，您可以簡單地從外掛程式資料夾中刪除所有 colyseus 代碼（在匯入套件之前或之後）。

### 伺服器設定

伺服器設定已移至更通用的 ScriptableObject。使用者可以擁有不同的開發和生產設定物件，並根據需要將其分配給其經理類別。

### ColyseusManager

這次升級的一個較大變化是 ColyseusManager 現在是一個泛型類型的類別，因此您的專案將需要一個繼承自 ColyseusManager 的類別。

{1}csharp public class YOUR\_MANAGER\_CLASS :ColyseusManager<YOUR\_MANAGER\_CLASS> { //您需要的任何覆蓋或附加功能} {2} 這將允許您根據需要繼承和覆蓋管理器功能，但如果不需要，上面的示例就足夠了（或隨意使用我們的 ExampleManager ，隨套件提供）。所有 ColyseusClient 處理（以前稱為“Client”）都應該在這個類別中發生，但是如果這對您的代碼庫來說是一個太大的重構，歡迎您根據需要公開 ColyseusClient。此外，之前調用 ColyseusManager.Instance 會實例化 ColyseusManager 物件（如果它目前為 null）。由於這些更改，您現在必須在場景中建立一個遊戲物件並將{3>您的<3}管理員腳本附加到它。

### 身分驗證和 {1>@colyseus/social<1}

{1>client.Auth<1} 已棄用。如果您的專案依賴於該功能，請隨時{2>將 Auth.cs 文件複製到您的專案之中<2}。

### FossilDeltaSerializer

FossilDeltaSerializer 已從外掛程式中完全刪除。

### 重命名的類別

| {1>舊名稱<1} | {2>新名稱<2} | {3>備註<3} | | --- | --- | --- | | MessageHandler | ColyseusMessageHandler | | MatchMakeResponse | ColyseusMatchMakeResponse | Broken out of Client.cs | | Room | ColyseusRoom | | Room Available | ColyseusRoomAvailable | Broken out of Client.cs | | RoomAvailableCollection | CSARoomAvailableCollection | Broken out of Client.cs | | NoneSerializer | ColyseusNoneSerializer | | SchemaSerializer | ColyseusSchemaSerializer | | Serializer | ColyseusSerializer | | Context | ColyseusContext | | Decoder | ColyseusDecoder | | Encoder | ColyseusEncoder | | ReferenceTracker | ColyseusReferenceTracker | | ArraySchema | ColyseusArraySchema | | CustomType | ColyseusCustomType | | Reflection | ColyseusReflection | | ArrayUtils | ColyseusArrayUtils | | Exceptions | ColyseusExceptions | | ExtensionMethods | ColyseusExtensionMethods | | HttpQSCollection | ColyseusHttpQSCollection | Broken out of HttpUtility.cs | | HttpUtility | ColyseusHttpUtility | | ObjectExtensions | ColyseusObjectExtensions | | UnityWebRequestAwaiter | ColyseusUnityWebRequestAwaiter | Broken out of ExtensionMethods.cs | | Client | ColyseusClient | | Connection | ColyseusConnection | | Protocol | ColyseusProtocol |

## 示例整合

- 匯入新的 Colyseus Unity 套件
- 從外掛程式資料夾中刪除所有 Colyseus 代碼
  - 目錄包括：
    - Colyseus
    - FossilDelta
    - 序列化
    - Websocket
- 建立一個繼承自 {1>ColyseusManager<1} 的管理員類別
  - 在場景中放置一個空的遊戲物件並附加此腳本（或將其附加到現有的管理員類別）
  - 如果您已經有一個管理員類別來處理大多數 Colyseus 功能，請考慮讓 {1>that<1} 類別繼承自 {2>ColyseusManager<2}
- 建立伺服器設定物件
  - 右鍵點擊 > 建立 > Colyseus > 生成 ColyseusSettings ScriptableObject
  - 在您的管理員的 “ColyseusSettings” 欄位中分配該物件

很難想像現有外掛程式的所有潛在用例並在進行這些更改時將其考慮在內。但是，我們認為所做的更改將有利於該專案的未來，可提高壽命和穩定性。如果您在嘗試升級專案時遇到任何問題，請聯絡並告訴我們，以便我們可以提供幫助，從而可以更新此文件以在將來幫助其他開發人員！
