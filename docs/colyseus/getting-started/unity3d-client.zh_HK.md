# Unity SDK

!!! tip "自 2021 年 5 月 10 日起的變更記錄"
    [詳情請參考這裏](/migrating/unity-sdk-0.14.5).

# 安裝

## 使用 Unity Package Manager

- 打開 Window > Package Manager. 點擊按鈕 "+", 選擇 "Add package from git URL..."
- 輸入 Git URL: `https://github.com/colyseus/colyseus-unity3d.git#upm`
- 點擊 "ADD"

點擊導入示例項目以測試內置的演示文件.

## 使用舊版 `.unitypackage`:

- 下載最新的 [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- 將 `Colyseus_Plugin.unitypackage` 內容導入到您的項目中.

`Colyseus_Plugin.unitypackage` 內含一個示例項目, 位於 `Assets/Colyseus/Example`, 以供您用作參考.

# 安裝

下面我們將向您介紹在 Unity 客戶端安裝, 運行以及連接到 Colyseus 服務器的具體步驟.

主要內容包括:

- 在本地運行服務器
- 服務器配置
- 連接到服務器
- 連接到房間
- 與房間以及房間 state 的交互.

這些內容涵蓋了客戶端連接服務器的基本需求, 當然, 您也可以使用和修改示例代碼來滿足自定義需求.

## 在本地運行服務器

要想在本地運行演示服務器, 請在設備終端上運行以下命令:

```
cd Server
npm install
npm start
```

內置的演示文件帶有一個 [房間處理程序](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts), 內含處理遊戲實體和玩家的標準方法. 您可隨意修改任何內容來滿足自定義需求!

## 創建 Colyseus 配置對象:

- 在項目目錄任意位置點擊鼠標右鍵, 選擇 "Create", 選擇 "Colyseus", 然後點擊 "Generate ColyseusSettings Scriptable Object"
- 根據需要填寫字段.
    - **Server Address**
        - 您的 Colyseus 服務器地址
    - **Server Port**
        - 您的 Colyseus 服務器端口
    - **Use secure protocol**
        - 如果需要服務器發送請求和信息時使用 "https" 和 "wss" 協議, 請勾選此項.
    - **Default headers**
        - 您可以為服務器的非 web socket 請求添加無限個默認 header.
        - 默認 header 由 `ColyseusRequest` 類使用.
        - 比如一個 header 可以包含一個 `"Content-Type"` 的 `"Name"` 和一個 `"application/json"` 的 `"Value"`.

## Colyseus Manager:

- 您可以創建自己的管理器腳本, 記得繼承 `ColyseusManager` 類; 也可以修改並使用自帶的 `ExampleManager`.
```csharp
public class ExampleManager : ColyseusManager<ExampleManager>
```
- 創建放置於場景內的管理器對象以執行自定義管理器腳本.
- 在場景檢查器中為 Colyseus Settings 對象提供一個管理器引用.

## 客戶端:

- 調用管理器中的 `InitializeClient()` 方法來創建一個 `ColyseusClient` 對象, 該對象將儲存在 `ColyseusManager` 的變量 `client` 中. 它將被用來創建/加入房間以及建立與服務器的連接.
```csharp
ExampleManager.Instance.InitializeClient();
```
- 如果您有其他類需要引用這個 `ColyseusClient`, 您可以覆蓋 `InitializeClient` 方法, 並在其中提交客戶端引用.
```csharp
//文件 ExampleManager.cs
public override void InitializeClient()
{
    base.InitializeClient();
    //向 RoomController 提交新建立的客戶端引用
    _roomController.SetClient(client);
}
```
- 如果需要多個 `ColyseusClient`, 或者想為 `ColyseusClient` 提供另一個 `endpoint` / `ColyseusSettings` 對象, 那麽您可以不調用 `base.InitializeClient()`.
    - 在重寫的 `InitializeClient()` 函數中, 您可以把地址手動提交給新創建的 `ColyseusClient`, 或者使用 `ColyseusSettings` 對象和一個 `bool` 值來構造新的 `ColyseusClient`, 其中那個布爾值表示是否使用 websocket 協議代替不是 http 協議. 如果您用 `字符串` 地址創建了一個新的 `Client`, 那麽其構造函數中會創建一個 `ColyseusSettings` 對象並從地址字符串裏推斷該使用的傳輸協議.
```csharp
public override void InitializeClient()
{
    chatClient = new ColyseusClient(chatSettings, true);                //地址為 chatClient.WebSocketEndpoint
    deathmatchClient = new ColyseusClient(deathmatchSettings, false);   //地址為 deathmatchSettings.WebRequestEndpoint
    guildClient = new ColyseusClient(guildHostURLEndpoint);             //手動傳入字符串地址以創建 guildClient 對象
}
```
- 可以通過調用 `ColyseusClient` 的 `GetAvailableRooms` 函數以獲取服務器上可用的房間:
```csharp
return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers);
```
## 連入房間

- 有多種創建/加入房間的方法.
- 調用 `ColyseusClient` 的 `Create` 方法將在服務器上創建房間並自動進入該房間:
```csharp
ExampleRoomState room = await client.Create<ExampleRoomState>(roomName);
```

- 調用 `JoinById` 以加入指定房間:
```csharp
ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId);
```

- 調用 `ColyseusClient` 的 `JoinOrCreate`, 會自動匹配並接入可用房間. 必要情況下也會在服務端上創建一個新房間並加入其中:
```csharp
ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName);
```

## 房間參數:

- 創建新房間時可以傳入一個房間參數字典, 比如開始遊戲的最少人數要求, 或是要在服務器上運行的自定義腳本文件名.
- 這些參數都是 `object` 類型的, 並由 `string` 類型的鍵作為索引:
```csharp
Dictionary<string, object> roomOptions = new Dictionary<string, object>
{
    ["YOUR_ROOM_OPTION_1"] = "option 1",
    ["YOUR_ROOM_OPTION_2"] = "option 2"
};

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate<ExampleRoomState>(roomName, roomOptions);
```

## 房間事件:

`ColyseusRoom` 裏有各種各樣的事件可供監聽:

### OnJoin
- 客戶端成功接入房間後觸發.

### onLeave
!!! tip "於 0.14.7 版本更新"
    為處理自定義 websocket 關閉代碼, 代理函數現在從傳遞 `WebSocketCloseCode` 值改為傳遞 `int` 關閉代碼.

- 客戶端與房間斷連後觸發.
- 包括解釋斷連原因的 `int` 參數.
```csharp
room.OnLeave += OnLeaveRoom;
```
- 其中 `OnLeaveRoom` 函數如下所示:
```csharp
private void OnLeaveRoom(int code)
  {
      WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code);
      LSLog.Log(string.Format("ROOM: ON LEAVE =- Reason: {0} ({1})", closeCode, code));
  }
```

### onStateChange
- 無論何時房間 state 發生改變, 包括最開始的初始化, 都會觸發該事件.

```csharp
room.OnStateChange += OnStateChangeHandler;
private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState)
{
    // 使用 state 編寫邏輯代碼
}
```

### onError
- 服務器上發生與房間相關的錯誤時, 會觸發該事件提交到客戶端.
- 包括錯誤代碼和錯誤信息的參數.

## 房間信息:
可以監聽來自服務器房間的自定義消息, 或發送自定義消息到服務器房間.

### onMessage
- 可以調用 `OnMessage` 並傳入消息類型和回調函數來添加監聽器, 客戶端收到該信息後會觸發該監聽器.
- 消息很有助於了解服務器房間中發生了什麽事. (參考 [技術演示](https://docs.colyseus.io/demo/shooting-gallery/), 了解 `OnMessage` 的使用案例)

```csharp
room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser =>
{
    _currentNetworkedUser = currentNetworkedUser;
});
```

### Send
- 使用 `ColyseusRoom` 的 `Send` 方法向服務器上的房間發送自定義消息.
- 指定發送到房間的消息 `type` 和可選參數 `message`.

```csharp
room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes });
```

### Room State:
> 了解如何使用 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

- 每個房間都有自己的 state. 房間 state 的變化會自動同步給所有已連接的客戶端.
- 關於房間狀態同步:
    - 當用戶成功加入房間時, 將從服務器接收到全部 state.
    - 每隔一個 `patchRate` 的時間, 狀態的二進製補丁都會被發送給各個客戶端 (默認 50ms)
    - 客戶端每次收到服務器發來的補丁都觸發 `onStateChange`.
    - 每個序列化方法都分別以自己的邏輯來處理收到的 state 補丁.
- `ColyseusRoomState` 是基類, 自定義房間 state 要繼承它.
- 查看我們的技術示例, 了解房間狀態數據同步的實現方法, 包括網遊實體, 聯網用戶或房間屬性等. [Shooting Gallery 技術演示](https://docs.colyseus.io/demo/shooting-gallery/)

```csharp
public class ExampleRoomState : Schema
{
    [Type(0, "map", typeof(MapSchema<ExampleNetworkedEntity>))]
    public MapSchema<ExampleNetworkedEntity> networkedEntities = new MapSchema<ExampleNetworkedEntity>();

    [Type(1, "map", typeof(MapSchema<ExampleNetworkedUser>))]
    public MapSchema<ExampleNetworkedUser> networkedUsers = new MapSchema<ExampleNetworkedUser>();

    [Type(2, "map", typeof(MapSchema<string>), "string")]
    public MapSchema<string> attributes = new MapSchema<string>();
}
```

## 調試

若您在 WebSocket 連接狀態下對應用設置了斷點, 則連接將在客戶端失活 3 秒後自動斷開. 為防止 Websocket 斷連, 請在開發過程中使用 `pingInterval:0`:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // 寫在這裏
});
```

請確保在生產環境中使用大於 `0` 的 `pingInterval`. 默認的 `pingInterval` 值為 `3000`.
