# Unity 軟體開發套件

!!! 提示「自 2021 年 5 月 10 日以來的新變化」{1>點擊此處，了解更多資訊<1}。

# 安裝

## 使用 Unity 套件管理員

- 前往視窗 >套件管理員。點擊「+」按鈕，然後選擇「從 git URL 新增套件...」
- 輸入 Git URL：{1>https://github.com/colyseus/colyseus-unity3d.git#upm<1}
- 點擊「新增」

點擊以匯入示例專案，以測試內建演示。

## 使用舊版 {1>.unitypackage<1}：

- 下載最新的 {1>Colyseus Unity SDK<1}
- 將 {1>Colyseus\_Plugin.unitypackage<1} 內容匯入到您的專案之中。

{1>Colyseus\_Plugin.unitypackage<1} 在 {2>Assets/Colyseus/Example<2} 下包含一個示例專案，您可以將其用作參考。

# 設定

在這裡，我們將介紹使您的 Unity 用戶端啟動並執行並連接到 Colyseus 伺服器的步驟。 

涵蓋的主題包括：

- 在本機執行伺服器
- 伺服器設定
- 連結到伺服器
- 連結到房間
- 與房間通信，以及房間的狀態。 

這些主題應該足以讓您自己設定基本用戶端，但是，歡迎您使用和修改包含的示例代碼以滿足您的需求。

## 在本機執行伺服器

若要在本機執行演示伺服器，請在終端中執行以下命令：

{1> cd Server npm install npm start <1}

內建演示帶有單個 1>房間處理器<1}，其中包含處理實體和玩家的建議方法。隨意更改所有內容以滿足您的需求！

## 建立 Colyseus 設定物件：

- 右鍵點擊專案資料夾中的任意位置，選擇「建立」，選擇「Colyseus」，然後點擊「生成 ColyseusSettings Scriptable Object」
- 根據需要填寫欄位。
  - {1>伺服器位址<1}
    - 您的 Colyseus 伺服器位址。
  - {1>伺服器埠口<1}
    - Colyseus 伺服器的埠口。
  - {1>使用安全協議<1}
    - 如果到您伺服器的請求和訊息應使用「https」和「wss」協議，請檢查此項。
  - {1>預設標頭<1}
    - 您可以為伺服器的非網路接口請求新增無限數量的預設標頭。
    - {1>ColyseusRequest<1} 類別使用預設標頭。
    - 示例標頭可以具有 {2>"Content-Type"<2} 的 {1>"Name"<1} 和 {4>"application/json"<4} 的 {3>"Value"<3}

## Colyseus 管理員：

- 您需要建立自己的管理員腳本，該腳本繼承自 {1>ColyseusManager<1}，或者使用和修改提供的 {2>ExampleManager<2}。 {3}csharp public class ExampleManager :ColyseusManager<ExampleManager> {4}
- 製作一個場景管理員物件來託管您的自訂管理員腳本。
- 在場景偵測器中為您的管理員提供對 Colyseus Settings 物件的引用。

## 用戶端：

- 調用您的管理員的 {1>InitializeClient()<1} 方法以建立一個 {2>ColyseusClient<2} 物件，該物件儲存在 {4>ColyseusManager<4} 的 {3>client<3} 變數中。這將用於建立/加入房間並與伺服器建立連接。 {5>csharp ExampleManager.Instance.InitializeClient(); <5}
- 如果您的管理員有需要引用您的 {1>ColyseusClient<1} 的其他類別，您可以覆蓋 {2>InitializeClient<2} 並在其中建立這些連接。{3>csharp //在 ExampleManager.cs public override void InitializeClient() { base.InitializeClient(); //將新建立的用戶端引用傳遞給我們的 RoomController \_roomController.SetClient(client); } <3}
- 如果您希望在您的管理員中有多個 {1>ColyseusClient<1} 引用，或者您希望為您的 {4>ColyseusClient<4 提供一個備用的 {2>endpoint<2}/{3>ColyseusSettings<3} 物件，您可以跳過對 {5>base.InitializeClient()<5} 的調用。
    - 在您覆蓋的 {1>InitializeClient()<1} 函數中，您現在可以將端點傳遞給您建立的任何其他新 {2>ColyseusClient<2}，或者您可以建立一個新的 {3>ColyseusClient<3} ，包含一個 {4>ColyseusSettings<4} 物件和一個 {5>bool<5} 來指示在建立連接時是否應該使用 websocket 協議而不是 http。如果您使用 {7>string<7} 端點建立新的 {6>Client<6}，它將在其建構函式中建立一個 {8>ColyseusSettings<8} 物件並從端點推斷協議。 {9>csharp public override void InitializeClient() { chatClient = new ColyseusClient(chatSettings, true); //端點將是 chatClient.WebSocketEndpoint deathmatchClient = new ColyseusClient(deathmatchSettings, false); //端點將是 deathmatchSettings.WebRequestEndpoint guildClient = new ColyseusClient(guildHostURLEndpoint); //建立只有一個字串端點的 guildClient } <9}
- 您可以透過調用 {2>ColyseusClient<2} 的 {1>GetAvailableRooms<1} 來獲取伺服器上的可用房間：{3>csharp return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers); <3}
## 連結到房間：

- 有多種方法可以建立和/或加入房間。
- 您可以透過調用 {2>ColyseusClient<2} 的 {1>Create<1} 方法建立房間，該方法將自動在伺服器上建立房間的執行個體並加入其中：3>csharp ExampleRoomState room = await client.Create<ExampleRoomState>(roomName); <3}

- 您可以透過調用 {1>JoinById<1} 加入特定房間：{2>csharp ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId); <2}

- 您可以調用 {2>ColyseusClient<2} 的 {1>JoinOrCreate<1} 方法，該方法將匹配到可用房間（如果可以），或者將建立房間的新執行個體，然後將其加入伺服器：{ 3>csharp ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName); <3}

## 房間選項：

- 建立新房間時，您可以傳入房間選項字典，例如開始遊戲所需的最少玩家人數或要在伺服器上執行的自訂邏輯檔案名稱。
- 選項的類型為 {1>object<1} 並由類型 {2>string<2} 鍵控：\`\`\`csharp Dictionary<string, object> roomOptions = new Dictionary<string, object> { \["YOUR\_ROOM\_OPTION\_1"] = "option 1", \["YOUR\_ROOM\_OPTION\_2"] = "option 2" };

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate{1}(roomName, roomOptions); \`\`\`

## 房間事件：

{1>ColyseusRoom<1} 有各種您想要訂閱的事件：

### OnJoin
- 在用戶端成功連接到房間後調用。

### onLeave
!!! 提示「自 0.14.7 起更新」為了處理自訂 websocket 閉包代碼，委託函數現在傳遞 {1>int<1} 閉包代碼而不是 {2>WebSocketCloseCode<2} 值。

- 在用戶端與房間斷開連接後調用。
- 有一個帶有斷開連接原因的 {1>int<1} 參數。{2>csharp room.OnLeave += OnLeaveRoom; <2} 其中 {3>OnLeaveRoom<3} 函數如下：{4}csharp private void OnLeaveRoom(int code) { WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code); LSLog.Log(string.Format("ROOM:ON LEAVE =- Reason: {0} (\\{1\\})", closeCode, code)); } {5}

### onStateChange
- 任何時候房間的狀態發生變化，包括初始狀態，此事件都會被觸發。

{1>csharp room.OnStateChange += OnStateChangeHandler; private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState) { // 對狀態做一些事情 } <1}

### onError
- 當伺服器上發生與房間相關的錯誤時，將與此事件一起報告。
- 具有錯誤代碼和錯誤訊息的參數。

## 房間訊息：
您可以從/向伺服器上的房間執行個體接聽或發送自訂訊息。

### onMessage
- 若要新增接聽程式，您可以調用 {1>OnMessage<1} 傳入類型和用戶端接收到該訊息時要採取的操作。
- 訊息對於伺服器房間中發生的事件很有用。（查看我們的{1>技術演示<1}，了解使用 {2>OnMessage<2} 的用例示例）

{1>csharp room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser => { \_currentNetworkedUser = currentNetworkedUser; }); <1}

### 發送
- 若要向伺服器上的房間發送自訂訊息，請使用 {2>ColyseusRoom<2} 的{1>發送<1}方法
- 指定要發送到您房間的{1>類型<1}和可選的{2>訊息<2}參數。

{1>csharp room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes }); <1}

### 房間狀態：
> 了解如何從 {2>State Handling<2} 生成您的 {1>RoomState<1}

- 各個房間都有自己的狀態。狀態的變化會自動同步到所有連接的用戶端。
- 關於房間狀態同步：
  - 當使用者成功加入房間時，其會自伺服器接收到完整的狀態。
  - 每 {1>patchRate<1}，狀態的二進制修補程式被發送到各個用戶端（預設為 50 毫秒）
  - {1>onStateChange<1} 在每次從伺服器收到修補程式後在用戶端調用。
  - 各個序列化方法都有自己的特殊方式來處理傳入的狀態修補程式。
- {1>ColyseusRoomState<1} 是您希望房間狀態繼承的基本房間狀態。
- 查看我們的技術演示，了解房間狀態下可同步資料的實現示例，例如聯網實體、聯網使用者或房間屬性。射擊場技術演示

\`\`\`csharp public class ExampleRoomState :Schema { \[Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))] public MapSchema{1} networkedEntities = new MapSchema{2}();
    
    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();
    
    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
} \`\`\`

## 偵錯

如果在 WebSocket 連接開啟時在應用程式中設定斷點，則連接將在 3 秒後由於無動作而自動關閉。若要防止 WebSocket 連接斷開，請於開發期間使用 {1}pingInterval：0{2} ：

\`\`\`typescript import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({ // ... pingInterval:0 // HERE }); \`\`\`

確保 {1>pingInterval<1} 在生產中高於 {2>0<2}。預設的 {3>pingInterval<3} 值為 {4>3000<4}。
