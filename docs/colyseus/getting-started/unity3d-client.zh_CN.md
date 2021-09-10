# Unity 軟體開發套件

!!! 提示(自 2021 年 5 月 10 日以來的新變化)[點擊此處,了解更多資訊](/migrating/unity-sdk-0.14.5).

# 安裝

## 使用 Unity 套件管理員

- 前往視窗 >套件管理員.點擊(+)按鈕,然後選擇(從 git URL 新增套件...)
- 輸入 Git URL：`https://github.com/colyseus/colyseus-unity3d.git#upm`
- 點擊(新增)

點擊以匯入示例專案,以測試內建演示.

## 使用舊版 `.unitypackage`：

- 下載最新的 [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- 將 `Colyseus_Plugin.unitypackage` 內容匯入到您的專案之中.

`Colyseus_Plugin.unitypackage` 在 `Assets/Colyseus/Example` 下包含一個示例專案,您可以將其用作參考.

# 設定

在這裡,我們將介紹使您的 Unity 用戶端啟動並執行並連接到 Colyseus 伺服器的步驟.

涵蓋的主題包括：

- 在本機執行伺服器
- 伺服器設定
- 連結到伺服器
- 連結到房間
- 與房間通信,以及房間的狀態.

這些主題應該足以讓您自己設定基本用戶端,但是,歡迎您使用和修改包含的示例代碼以滿足您的需求.

## 在本機執行伺服器

若要在本機執行演示伺服器,請在終端中執行以下命令：

``` cd Server npm install npm start ```

內建演示帶有單個 [房間處理器](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts),其中包含處理實體和玩家的建議方法.隨意更改所有內容以滿足您的需求！

## 建立 Colyseus 設定物件：

- 右鍵點擊專案資料夾中的任意位置,選擇(建立),選擇(Colyseus),然後點擊(生成 ColyseusSettings Scriptable Object)
- 根據需要填寫欄位.
  - **伺服器位址**
    - 您的 Colyseus 伺服器位址.
  - **伺服器埠口**
    - Colyseus 伺服器的埠口.
  - **使用安全協議**
    - 如果到您伺服器的請求和訊息應使用(https)和(wss)協議,請檢查此項.
  - **預設標頭**
    - 您可以為伺服器的非網路接口請求新增無限數量的預設標頭.
    - `ColyseusRequest` 類別使用預設標頭.
    - 示例標頭可以具有 `"Content-Type"` 的 `"Name"` 和 `"application/json"` 的 `"Value"`

## Colyseus 管理員：

- 您需要建立自己的管理員腳本,該腳本繼承自 `ColyseusManager`,或者使用和修改提供的 `ExampleManager`. ```csharp public class ExampleManager :ColyseusManager<ExampleManager> ```
- 製作一個場景管理員物件來託管您的自訂管理員腳本.
- 在場景偵測器中為您的管理員提供對 Colyseus Settings 物件的引用.

## 用戶端：

- 調用您的管理員的 `InitializeClient()` 方法以建立一個 `ColyseusClient` 物件,該物件儲存在 `ColyseusManager` 的 `client` 變數中.這將用於建立/加入房間並與伺服器建立連接. ```csharp ExampleManager.Instance.InitializeClient(); ```
- 如果您的管理員有需要引用您的 `ColyseusClient` 的其他類別,您可以覆蓋 `InitializeClient` 並在其中建立這些連接.```csharp //在 ExampleManager.cs public override void InitializeClient() { base.InitializeClient(); //將新建立的用戶端引用傳遞給我們的 RoomController _roomController.SetClient(client); } ```
- 如果您希望在您的管理員中有多個 `ColyseusClient` 引用,或者您希望為您的 `ColyseusClient` 提供一個備用的 `endpoint`/`ColyseusSettings` 物件,您可以跳過對 `base.InitializeClient()` 的調用.
    - 在您覆蓋的 `InitializeClient()` 函數中,您現在可以將端點傳遞給您建立的任何其他新 `ColyseusClient`,或者您可以建立一個新的 `ColyseusClient` ,包含一個 `ColyseusSettings` 物件和一個 `bool` 來指示在建立連接時是否應該使用 websocket 協議而不是 http.如果您使用 `string` 端點建立新的 `Client`,它將在其建構函式中建立一個 `ColyseusSettings` 物件並從端點推斷協議. ```csharp public override void InitializeClient() { chatClient = new ColyseusClient(chatSettings, true); //端點將是 chatClient.WebSocketEndpoint deathmatchClient = new ColyseusClient(deathmatchSettings, false); //端點將是 deathmatchSettings.WebRequestEndpoint guildClient = new ColyseusClient(guildHostURLEndpoint); //建立只有一個字串端點的 guildClient } ```
- 您可以透過調用 `ColyseusClient` 的 `GetAvailableRooms` 來獲取伺服器上的可用房間：```csharp return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers); ```
## 連結到房間：

- 有多種方法可以建立和/或加入房間.
- 您可以透過調用 `ColyseusClient` 的 `Create` 方法建立房間,該方法將自動在伺服器上建立房間的執行個體並加入其中：```csharp ExampleRoomState room = await client.Create<ExampleRoomState>(roomName); ```

- 您可以透過調用 `JoinById` 加入特定房間：```csharp ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId); ```

- 您可以調用 `ColyseusClient` 的 `JoinOrCreate` 方法,該方法將匹配到可用房間(如果可以),或者將建立房間的新執行個體,然後將其加入伺服器：```csharp ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName); ```

## 房間選項：

- 建立新房間時,您可以傳入房間選項字典,例如開始遊戲所需的最少玩家人數或要在伺服器上執行的自訂邏輯檔案名稱.
- 選項的類型為 `object` 並由類型 `string` 鍵控：```csharp Dictionary<string, object> roomOptions = new Dictionary<string, object> { \["YOUR\_ROOM\_OPTION\_1"] = "option 1", \["YOUR\_ROOM\_OPTION\_2"] = "option 2" };

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate<ExampleRoomState>(roomName, roomOptions); ```

## 房間事件：

`ColyseusRoom` 有各種您想要訂閱的事件：

### OnJoin
- 在用戶端成功連接到房間後調用.

### OnLeave
!!! 提示(自 0.14.7 起更新)為了處理自訂 websocket 閉包代碼,委託函數現在傳遞 `int` 閉包代碼而不是 `WebSocketCloseCode` 值.

- 在用戶端與房間斷開連接後調用.
- 有一個帶有斷開連接原因的 `int` 參數.```csharp room.OnLeave += OnLeaveRoom; ``` 其中 `OnLeaveRoom` 函數如下：```csharp private void OnLeaveRoom(int code) { WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code); LSLog.Log(string.Format("ROOM:ON LEAVE =- Reason: {0} ({1})", closeCode, code)); } ```

### OnStateChange
- 任何時候房間的狀態發生變化,包括初始狀態,此事件都會被觸發.

```csharp room.OnStateChange += OnStateChangeHandler; private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState) { // 對狀態做一些事情 } ```

### OnError
- 當伺服器上發生與房間相關的錯誤時,將與此事件一起報告.
- 具有錯誤代碼和錯誤訊息的參數.

## 房間訊息：
您可以從/向伺服器上的房間執行個體接聽或發送自訂訊息.

### OnMessage
- 若要新增接聽程式,您可以調用 `OnMessage` 傳入類型和用戶端接收到該訊息時要採取的操作.
- 訊息對於伺服器房間中發生的事件很有用.(查看我們的[技術演示](https://docs.colyseus.io/demo/shooting-gallery/),了解使用 `OnMessage` 的用例示例)

```csharp room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser => { _currentNetworkedUser = currentNetworkedUser; }); ```

### 發送
- 若要向伺服器上的房間發送自訂訊息,請使用 `ColyseusRoom` 的`發送`方法
- 指定要發送到您房間的`類型`和可選的`訊息`參數.

```csharp room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes }); ```

### 房間狀態：
> 了解如何從 [State Handling](https://docs.colyseus.io/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

- 各個房間都有自己的狀態.狀態的變化會自動同步到所有連接的用戶端.
- 關於房間狀態同步：
  - 當使用者成功加入房間時,其會自伺服器接收到完整的狀態.
  - 每 `patchRate`,狀態的二進制修補程式被發送到各個用戶端(預設為 50 毫秒)
  - `onStateChange` 在每次從伺服器收到修補程式後在用戶端調用.
  - 各個序列化方法都有自己的特殊方式來處理傳入的狀態修補程式.
- `ColyseusRoomState` 是您希望房間狀態繼承的基本房間狀態.
- 查看我們的技術演示,了解房間狀態下可同步資料的實現示例,例如聯網實體, 聯網使用者或房間屬性.([射擊場技術演示](https://docs.colyseus.io/demo/shooting-gallery/))

```csharp public class ExampleRoomState :Schema { \[Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))] public MapSchema<ExampleNetworkedEntity> networkedEntities = new MapSchema<ExampleNetworkedEntity>();

    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();

    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
} ```

## 偵錯

如果在 WebSocket 連接開啟時在應用程式中設定斷點,則連接將在 3 秒後由於無動作而自動關閉.若要防止 WebSocket 連接斷開,請於開發期間使用 `pingInterval：0` during development:

```typescript import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... pingInterval:0 // HERE }); ```

確保 `pingInterval` 在生產中高於 `0`.預設的 `pingInterval` 值為 `3000`.
