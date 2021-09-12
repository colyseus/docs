# Unity SDK

!!! tip "自 2021 年 5 月 10 日起的變更記錄"
    [點擊這裏查閱更多資訊](/migrating/unity-sdk-0.14.5).

# 安裝

## 使用 Unity Package Manager

- 前往 Window > Package Manager 點擊按鈕 "+", 選擇 "Add package from git URL..."
- 進入 Git URL: `https://github.com/colyseus/colyseus-unity3d.git#upm`
- 點擊 "ADD"

點擊匯入示例專案以測試內置的演示文件.

## 使用舊版 `.unitypackage`:

- 下載最新的 [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- 將 `Colyseus_Plugin.unitypackage` 內容匯入到您的專案中.

`Colyseus_Plugin.unitypackage` 內含一個示例專案, 位於 `Assets/Colyseus/Example`, 您可以用作參考.

# 安裝

下面我們將向您介紹 Unity 客戶端的安裝, 執行以及連線到 Colyseus 伺服器的具體步驟.

涵蓋的主題如下:

- 在本地執行伺服器
- 伺服器設置
- 連線到伺服器
- 連線到房間
- 與房間之間的通信以及房間的狀態.

這些主題內容應足以滿足您自行安裝客戶端的需要了, 當然, 您也可以使用和修改所提供的示例代碼來滿足自身需求.

## 在本地執行伺服器

要想在本地執行演示伺服器, 請在您的終端設備上執行以下指令:

```
cd Server
npm install
npm start
```

內置的演示文件帶有一個 [房間處理程序](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts), 內含處理遊戲實體和玩家的建議. 您可隨意修改所有內容來滿足自身需求!

## 創建 Colyseus 設置對象:

- 在專案文件夾中任意位置點擊鼠標右鍵, 選擇 "Create", 選擇 "Colyseus", 然後點擊 "Generate ColyseusSettings Scriptable Object"
- 根據需要填寫字段.
    - **伺服器地址**
        - 您的 Colyseus 伺服器地址
    - **伺服器端口**
        - 您的 Colyseus 伺服器端口
    - **使用安全協議**
        - 若向您的伺服器發送請求和資訊時需使用"https"和"wss"協議,請勾選此項.
    - **預設標頭**
        - 您可以為您的伺服器的非 web 套接字請求添加預設標頭,數量不受限製.
        - `ColyseusRequest` 類使用預設標頭.
        - 示例標頭可包含`"Content-Type"` 的 `"名稱"` 以及 `"application/json"` 的 `"值"`.

## Colyseus 管理器:

- 您需要創建自己的管理器腳本, 可以從 `ColyseusManager` 中獲取, 也可以使用並修改所提供的 `ExampleManager`.
```csharp
public class ExampleManager : ColyseusManager<ExampleManager>
```
- 創建場景內管理器對象來托管您的自定義管理器腳本.
- 在場景檢查器中為您的管理器提供 Colyseus 設置對象參考.

## 客戶端:

- 調用您管理器中的 `InitializeClient()` 來創建一個 `ColyseusClient` 對象, 該對象將儲存在 `ColyseusManager` 的變數 `client` 中. 它將被用來創建/加入房間以及建立與伺服器的連線.
```csharp
ExampleManager.Instance.InitializeClient();
```
- 如果您的管理器有其他類需要參照您的 `ColyseusClient`, 您可以重寫 `InitializeClient` 並在其中建立這些連線.
```csharp
//In ExampleManager.cs
public override void InitializeClient()
{
    base.InitializeClient();
    //Pass the newly created Client reference to our RoomController
    _roomController.SetClient(client);
}
```
- 如果您希望管理器中有多個參考 `ColyseusClient`, 或者如果您想為您的 `ColyseusClient` 提供一個備用 `endpoint` / `ColyseusSettings` 對象, 那麽您可以直接調用 `base.InitializeClient()`.
    - 在重寫的 `InitializeClient()` 函數中, 您可以將一個終結點傳遞給任何您創建的其他新的 `ColyseusClient`, 或者您也可以用 `ColyseusSettings` 對象和 `布爾值` 來創建一個新的 `ColyseusClient`, 以表明在建立連線時應使用 websocket 協議而不是 http 協議. 如果您用 `字符串` 終結點創建一個新的 `客戶端`, 那麽它將在其構造函數中創建一個 `ColyseusSettings` 對象並從終結點推斷協議.
```csharp
public override void InitializeClient()
{
    chatClient = new ColyseusClient(chatSettings, true);                //Endpoint will be chatClient.WebSocketEndpoint
    deathmatchClient = new ColyseusClient(deathmatchSettings, false);   //Endpoint will be deathmatchSettings.WebRequestEndpoint
    guildClient = new ColyseusClient(guildHostURLEndpoint);             //Create the guildClient with only a string endpoint
}
```
- 您可以通過調用 `ColyseusClient` 的 `GetAvailableRooms` 來獲取服務端上的空閑房間資訊:
```csharp
return await GetAvailableRooms<ColyseusRoomAvailable>(roomName, headers);
```
## 接入房間

- 有多種創建或加入房間的方式.
- 您可以調用 `ColyseusClient` 的 `創建` 方法來創建房間, `ColyseusClient` 將自動在服務端上創建房間實例並加入其中:
```csharp
ExampleRoomState room = await client.Create<ExampleRoomState>(roomName);
```

- 您可以調用 `JoinById` 來加入特定房間:
```csharp
ExampleRoomState room = await client.JoinById<ExampleRoomState>(roomId);
```

- 您可以調用 `ColyseusClient` 的 `JoinOrCreate`, 它會為您匹配並接入空閑房間; 在可行的情況下, 也會在服務端上創建一個新房間並加入其中:
```csharp
ExampleRoomState room = await client.JoinOrCreate<ExampleRoomState>(roomName);
```

## 房間選項:

- 創建新房間時您可以傳入一個房間選項字典, 比如開始遊戲的最少人數要求, 或者要在您伺服器上執行的自定義邏輯文件的名稱.
- 選項所屬類型為 `對象`, 並由 `字符串` 類型進行鍵控:
```csharp
Dictionary<string, object> roomOptions = new Dictionary<string, object>
{
    ["YOUR_ROOM_OPTION_1"] = "option 1",
    ["YOUR_ROOM_OPTION_2"] = "option 2"
};

ExampleRoomState room = await ExampleManager.Instance.JoinOrCreate<ExampleRoomState>(roomName, roomOptions);
```

## 房間事件:

`ColyseusRoom` 有您想訂閱的各種事件:

### OnJoin
- 客戶端成功接入房間後調用.

### onLeave
!!! tip "更新至 0.14.7 版本"
    為處理 websocket 自定義閉包代碼, 委托函數現在從傳遞 `WebSocketCloseCode` 值改為傳遞 `int` 閉包代碼.

- 客戶端與房間斷連後調用.
- 有解釋斷連原因的 `int` 參數.
```csharp
room.OnLeave += OnLeaveRoom;
```
- 其中 `OnLeaveRoom` 函數為:
```csharp
private void OnLeaveRoom(int code)
  {
      WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code);
      LSLog.Log(string.Format("ROOM: ON LEAVE =- Reason: {0} ({1})", closeCode, code));
  }
```

### onStateChange
- 無論何時房間狀態發生改變(包括初始狀態)都會觸發該事件.

```csharp
room.OnStateChange += OnStateChangeHandler;
private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState)
{
    // Do something with the state
}
```

### onError
- 伺服器上發生與房間相關的錯誤時, 該事件會一並上報.
- 有錯誤代碼和錯誤資訊的參數

## 房間資訊:
您可以監聽來自伺服器上房間實例的自定義資訊, 或發送自定義資訊至伺服器上的房間實例.

### onMessage
- 您可以調用 `OnMessage` 傳入類型函數來添加監聽器,客戶端收到該資訊後執行該動作.
- 這些資訊有助於了解伺服器上房間中發生的事件. (查看我們的 [技術演示](https://docs.colyseus.io/demo/shooting-gallery/), 了解關於 `OnMessage` 的使用案例.)

```csharp
room.OnMessage<ExampleNetworkedUser>("onUserJoin", currentNetworkedUser =>
{
    _currentNetworkedUser = currentNetworkedUser;
});
```

### 發送
- 使用 `ColyseusRoom` 的 `Send` 向伺服器上的房間發送自定義資訊.
- 指定發送到您房間的 `type` 和可選參數 `message`.

```csharp
room.Send("createEntity", new EntityCreationMessage() { creationId = creationId, attributes = attributes });
```

### 房間狀態:
> 看看如何從 [State Handling](https://docs.colyseus.io/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

- 每個房間都有自己的狀態. 房間的狀態變化會自動同步給所有連線的客戶端.
- 房間狀態同步相關資訊:
    - 當用戶成功加入房間時, 將從伺服器接收到全部狀態.
    - 每個 `patchRate` 中, 狀態的二進製補丁都會被發送給各個客戶端(預設50ms)
    - 客戶端接收到伺服器發來的補丁後即調用 `onStateChange`.
    - 每個序列化方法都會以其特殊的方式來處理接收到的補丁狀態.
- `ColyseusRoomState` 是基本的房間狀態, 您的房間狀態將在該狀態的基礎上變化.
- 查看我們的技術示例, 了解房間狀態數據同步的實現案例, 如聯網遊戲人物, 聯網用戶或房間屬性等. [Shooting Gallery 技術演示](https://docs.colyseus.io/demo/shooting-gallery/)

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

## 除錯

若您在 WebSocket 連線打開時在您的應用程序中設置了斷點, 則連線將在客戶端失活3秒後自動斷開. 為防止 Websocket 斷連,您可使用在開發過程中使用 `pingInterval:0` during development:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // HERE
});
```

請確保生產環境中 `pingInterval` 值高於 `0`. 預設的 `pingInterval` 值為 `3000`.
