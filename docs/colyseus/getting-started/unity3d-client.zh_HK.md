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

`Colyseus_Plugin.unitypackage` 內含壹個示例項目, 位于 `Assets/Colyseus/Example`, 以供您用作參考.

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

內置的演示文件帶有壹個 [房間處理程序](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts), 內含處理遊戲實體和玩家的標准方法. 您可隨意修改任何內容來滿足自定義需求!

## 初始化客戶端

客戶端實例必須在初始場景裏用服務器的 WebSocket 地址 / 安全 websocket(wss) 地址進行初始化.
```csharp
ColyseusClient client = new ColyseusClient("ws://localhost:2567");
```

## 連接到房間:

- 有很多辦法創建並加入房間.
- 可以調用 `ColyseusClient` 的 `Create` 方法創建房間, 這樣會在服務器端自動創建房間實例並把客戶端加入進去:
```csharp
ColyseusRoom<MyRoomState> room = await client.Create<MyRoomState>(roomName);
```

- 可以調用 `join` 方法加入已存在的房間, 服務端會找到壹個可用的房間並把客戶端加入進去:
```csharp
ColyseusRoom<MyRoomState> room = await client.Join<MyRoomState>(roomName);
```

- 還可以通過調用 `JoinById` 方法加入指定房間:
```csharp
ColyseusRoom<MyRoomState> room = await client.JoinById<MyRoomState>(roomId);
```

- 通過調用 `ColyseusClient` 的 `JoinOrCreate` 方法加入房間, 服務端首先進行 matchmake, 沒有匹配到房間的話, 服務端會創建壹個房間並把客戶端加入進去:
```csharp
ColyseusRoom<MyRoomState> room = await client.JoinOrCreate<MyRoomState>(roomName);
```

## 房間參數:

- 創建新房間時可以傳入壹個房間參數字典, 比如開始遊戲的最少人數要求, 或是要在服務器上運行的自定義腳本文件名.
- 這些參數都是 `object` 類型的, 並由 `string` 類型的鍵作爲索引:
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
!!! tip "于 0.14.7 版本更新"
    爲處理自定義 websocket 關閉代碼, 代理函數現在從傳遞 `WebSocketCloseCode` 值改爲傳遞 `int` 關閉代碼.

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
- 消息很有助于了解服務器房間中發生了什麽事. (參考 [技術演示](https://docs.colyseus.io/demo/shooting-gallery/), 了解 `OnMessage` 的使用案例)

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
- 關于房間狀態同步:
    - 當用戶成功加入房間時, 將從服務器接收到全部 state.
    - 每隔壹個 `patchRate` 的時間, 狀態的二進制補丁都會被發送給各個客戶端 (默認 50ms)
    - 客戶端每次收到服務器發來的補丁都觸發 `onStateChange`.
    - 每個序列化方法都分別以自己的邏輯來處理收到的 state 補丁.
- `ColyseusRoomState` 是基類, 自定義房間 state 要繼承它.
- 查看我們的技術示例, 了解房間狀態數據同步的實現方法, 包括網遊實體, 聯網用戶或房間屬性等. [Shooting Gallery 技術演示](https://docs.colyseus.io/demo/shooting-gallery/)

```csharp
public partial class MyRoomState : Schema
{
	[Type(0, "map", typeof(MapSchema<Player>))]
	public MapSchema<Player> players = new MapSchema<Player>();
}
```

使用 MapSchema 或者 ArraySchema 時, 與服務器進行 state 同步也可以使用如下的方式.

```csharp
// Something has been added to Schema
room.State.players.OnAdd += (key, player) =>
{
    Debug.Log($"{key} has joined the Game!");
};

// Something has changed in Schema
room.State.players.OnChange += (key, player) =>
{
    Debug.Log($"{key} has been changed!");
};

// Something has been removed from Schema
room.State.players.OnRemove += (key, player) =>
{
    Debug.Log($"{key} has left the Game!");
};
```

## 調試

若您在 WebSocket 連接狀態下對應用設置了斷點, 則連接將在客戶端失活 3 秒後自動斷開. 爲防止 Websocket 斷連, 請在開發過程中使用 `pingInterval:0`:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // 寫在這裏
});
```

請確保在生産環境中使用大于 `0` 的 `pingInterval`. 默認的 `pingInterval` 值爲 `3000`.
