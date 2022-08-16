# Starboss 技術演示
該示例以 [Unity Procedural Boss Demo](https://www.youtube.com/watch?v=LVSmp0zW8pY) [(Source available here)](https://on.unity.com/37K5j1b) 開始, 我們的團隊將其轉化為帶有兩種不同遊戲模式的多人遊戲體驗.

本技術演示的目的在於展示如何將一個現有的單人遊戲專案轉化為一個完整的多人遊戲循環. 該演示旨在搭配 Colyseus 0.14.7 版本以及 [Unity version 2020.1.5f1](https://unity3d.com/unity/qa/lts-releases) 使用.

**[下載演示](https://github.com/colyseus/unity-demo-starboss/archive/main.zip)** ([查看源代碼](https://github.com/colyseus/unity-demo-starboss/))

[玩玩看!](https://sac-dt.colyseus.dev/)

![屏幕截圖](starboss/screenshot.PNG)

## 開始

### 啟用本地伺服器

您需要從 **提供的伺服器目錄** 中選擇安裝並啟用伺服器, 以正常操作本演示. 按照 [這些文檔中 Unity3d 部分之"執行演示伺服器"](/getting-started/unity3d-client/#running-the-demo-server) 中的說明操作即可.

### ColyseusSettings ScriptableObject

伺服器的所有設置都可通過此處的 ColyseusSetting ScriptableObject 進行更改:

![ScriptableObject](common-images/scriptable-object.png)

如果您執行的是本地伺服器, 預設的設置就能夠滿足需求; 但若您希望托管伺服器, 則需要按需更改 **Colyseus 伺服器地址** 和 **Colyseus 伺服器端口**.

### 播放演示

讓玩家出生在"StarBossLobby"場景, 位置是 `Assets\StarBoss\Scenes\StarBossLobby`. 輸入您的用戶名並創建房間以開始. **如果您無法進入房間製作界面, 請確認您的本地伺服器工作正常, 並檢查 Unity 編輯器的錯誤日誌.** 如果您成功了, 客戶端將會加載 "Scene\_Dev\_Environment" 場景. 創建房間時,您將擁有創建合作模式或團隊死鬥模式的選項. 如果您在合作模式房間中按下 Enter 鍵或單擊 "開始" 按鍵, 您將 "準備就緒" 並且遊戲將會開始. 如果您在您的本地伺服器上等待更多玩家加入, 必須在所有玩家都 "準備就緒" 後遊戲才會開始. 如果您創建了團隊死鬥房間, 您將需要至少 1 名其他玩家加入另一隊伍, 之後才能開始

## 演示概覽

### 創建並列出不同遊戲模式的房間
在客戶端 `StarBossLobbyController.cs` 中的被重寫 `CreateRoom` 函數中, 您會看到我們是在哪裏決定發布團隊死鬥模式或合作模式房間的:
```csharp
string gameModeLogic = coopToggle.isOn ? "starBossCoop" : "starBossTDM";
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```
在伺服器端的 `StarBossRoom.ts` 我們收到這些 `roomOptions` 並使用  `logic` 成員來決定創建的房間類型:
```javascript
// Retrieve the custom logic for the room
const  customLogic = await  this.getCustomLogic(options["logic"]);
if(customLogic == null) logger.debug("NO Custom Logic Set");
try{
	if(customLogic != null) {
		this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
		customLogic.InitializeLogic(this, options);
	}
}
catch(error){
	logger.error("Error with custom room logic: " + error);
}
```
這一行:
```javascript
this.setMetadata({isCoop:  options["logic"] == "starBossCoop" });
```
我們在房間元數據中設置該值為 `isCoop`, 這樣我們就可以用於客戶端並展示房間類型.

為做到這一點,我們在客戶端創建了一個包含 `isCoop` 值的建立序列類 `StarBossRoomMetaData.cs`. 之後我們在我們的自定義 `StarBossRoomAvailable` 中使用此類,它繼承自 `ColyseusRoomAvailable`:
```csharp
[System.Serializable]
public class StarBossRoomAvailable : ColyseusRoomAvailable {
    public StarBossRoomMetaData metadata;
}
```
之後通過 `ExampleManager.cs`  我們已經更新了 `GetAvailableRooms` 函數來接收數據類型`StarBossRoomAvailable`:
```csharp
public async void GetAvailableRooms() {
    StarBossRoomAvailable[] rooms = await client.GetAvailableRooms<StarBossRoomAvailable>(_roomController.roomName);
    onRoomsReceived?.Invoke(rooms);
}
```
我們還更新了 `OnRoomsReceived` 委托調用來使用 `StarBossRoomAvailable`.最後,對於收到的每個條目, 我們實例化一個附加有 `RoomListItem` 組件的對象, 然後將可用房間的引用傳給它. 在 `DetermineMode` 函數的 `RoomListItem.cs`:
```csharp
bool isCoop = roomRef.metadata.isCoop;

if (isCoop) {
    roomName.text = roomRef.roomId;
    gameMode.text = "Co-op";
    gameMode.color = coopColor;
    backgroundImage.color = coopColor;
}
else {
    roomName.text = roomRef.roomId;
    gameMode.text = "Team Deathmatch";
    gameMode.color = deathmatchColor;
    backgroundImage.color = deathmatchColor;
}
```
最終結果顯示為:
![RoomList](starboss/room-list.PNG)

## 調整演示

當您播放此演示的時候, 您可能希望進行一些調整, 幫您更好地了解當前發生的情況. 下面您將學習如何進行微調整.

### 團隊死鬥勝利得分

在客戶端, 團隊死鬥勝利得分最大值目前在被重寫的 `CreateRoom` 函數中設為 3, 位置是 `StarBossLobbyController.cs`:
```csharp
roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } };
LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions);
```

在伺服器端, 我們收到這些 `roomOptions` 並用其初始化遊戲邏輯. 僅在初始化團隊死鬥房間時, 我們才使用 `scoreToWin` 選項, 正如以下函數 `starBossTDM.js`:
```javascript
roomRef.tdmScoreToWin = options["scoreToWin"] ? Number(options["scoreToWin"]) : 10;
```
