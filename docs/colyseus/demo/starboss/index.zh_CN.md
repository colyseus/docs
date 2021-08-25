# Starboss 技術演示
該演示從 {1>Unity Procedural Boss Demo<1} {2>（來源可在此處獲得）<2}開始，我們的團隊將其轉換為具有兩種不同遊戲模式的多人遊戲體驗。

此技術演示旨在展示如何採用現有的單人遊戲專案並將其轉換為處理完整的多人遊戲週期。該演示旨在與 Colyseus 版本 0.14.7 和 {1>Unity 版本 2020.1.5f1<1} 搭配使用。

{1>{2>下載試玩版<2}<1}（{3>檢視原始程式碼<3}）

{1>遊玩試玩版！<1}

{1>螢幕擷取畫面<1}

## 開始使用

### 啟動本機伺服器

你必須在{1>提供的伺服器目錄<1}中的伺服器裡安裝並啟動本試玩版，才能夠正常運作。只需按照這些文件的 Unity3d 部分中的{2>「執行演示伺服器」下的說明進行操作<2}。

### ColyseusSettings ScriptableObject

全部伺服器設定都可以透過位於這裡的 ColyseusSetting ScriptableObject 來進行變更：

{1>ScriptableObject<1}

如果你執行的是本機伺服器，預設的設定應該很充足，然而如果你希望提供主機伺服器服務，會需要變更{1>Colyseus 伺服器位址<1}和對應的{2>Colyseus 伺服器連接埠<2} 值。

### 遊玩試玩版

在位於 {1>Assets\\StarBoss\\Scenes\\StarBossLobby<1} 的「StarBossLobby」場景中啟動玩家。輸入您的使用者名稱並建立一個房間，以便開始。{2>如果您無法進入房間建立畫面，請確認您的本機伺服器運作正常並檢查 Unity 編輯器中的錯誤日誌。<2}如果成功，用戶端將加載「Scene\_Dev\_Environment」場景。建立房間時，您可以選擇建立合作或團隊死亡競賽房間。如果您在 Co-op 房間內按 Enter 鍵或單擊「開始」按鈕，您將「準備就緒」並開始遊戲。如果您在本機伺服器上等待更多玩家加入，則所有玩家都必須在遊戲開始前「準備就緒」。如果您建立了團隊死亡競賽房間，則在開始之前，您至少需要再有 1 名玩家加入其他團隊

## 試玩版概觀

### 建立和列出具有不同遊戲模式的房間
在用戶端的 {2>StarBossLobbyController.cs<2} 中被覆蓋的 {1>CreateRoom<1} 函數中，您可以看到我們在何處確定我們要啟動的是團隊死亡競賽還是合作類型的房間：{3>csharp string gameModeLogic = coopToggle.isOn ? "starBossCoop" : "starBossTDM"; roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } }; LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions); <3} 在 {4>StarBossRoom.ts<4} 的伺服器端，我們收到這些 {5>roomOptions<5} 並使用 {6>logic<6} 成員來確定我們要建立的房間類型：{7>javascript // 檢索房間的自訂邏輯 const customLogic = await this.getCustomLogic(options\["logic"]); if(customLogic == null) logger.debug("無自訂邏輯集"); try{ if(customLogic != null) { this.setMetadata({isCoop: options\["logic"] == "starBossCoop" }); customLogic.InitializeLogic(this, options); } } catch(error){ logger.error("自訂房間邏輯出錯：" + error); } <7} 在這一行中： {8>javascript this.setMetadata({isCoop: options\["logic"] == "starBossCoop" }); <8} 我們在房間的中繼資料中設定 {9>isCoop<9} 的值，然後我們可以在用戶端用它來顯示房間的類型。 

為此，我們在用戶端建立了一個 Serializable 類別 {1>StarBossRoomMetaData.cs<1}，其中包含 {2>isCoop<2} 值。然後我們在我們的自訂 {3>StarBossRoomAvailable<3} 中使用這個類別，它繼承自 {4>ColyseusRoomAvailable<4}: {5}csharp \[System.Serializable] public class StarBossRoomAvailable :ColyseusRoomAvailable { public StarBossRoomMetaData metadata; } {6}
然後在 {7>ExampleManager.cs<7} 中，我們更新了 {8>GetAvailableRooms<8} 函數以接收 {9>StarBossRoomAvailable<9} 類別的資料：{10>csharp public async void GetAvailableRooms() { StarBossRoomAvailable\[] rooms = await client.GetAvailableRooms<StarBossRoomAvailable>(\_roomController.roomName); onRoomsReceived?.Invoke(rooms); } <10} 我們還更新了 {11>OnRoomsReceived<11} 委託調用，以使用 {12>StarBossRoomAvailable<12}。最後，對於我們收到的每個條目，我們實例化一個帶有 {13>RoomListItem<13} 組件的物件，並將其傳遞給可用房間的引用。在 {15>RoomListItem.cs<15} 的 {14>DetermineMode<14} 函數中：\`\`\`csharp bool isCoop = roomRef.metadata.isCoop;

if (isCoop) { roomName.text = roomRef.roomId; gameMode.text = "Co-op"; gameMode.color = coopColor; backgroundImage.color = coopColor; } else { roomName.text = roomRef.roomId; gameMode.text = "Team Deathmatch"; gameMode.color = deathmatchColor; backgroundImage.color = deathmatchColor; } \`\`\`  最終結果給了我們這樣的東西：{1>RoomList<1}

## 調整演示

當您使用這個演示時，您可能需要進行一些調整，以更好地熟悉正在發生的事情。以下，您將學習如何進行這些細微的調整。

### 團隊死亡競賽獲勝得分

在{2>StarBossLobbyController.cs<2} 中重寫的{1>CreateRoom<1} 函數中，在團隊死亡競賽中獲勝的最高分數目前在用戶端設定為 3：{3>csharp roomOptions = new Dictionary<string, object> {{"logic", gameModeLogic }, { "scoreToWin", 3 } }; LoadMainScene(() => { ExampleManager.Instance.CreateNewRoom(selectRoomMenu.RoomCreationName, roomOptions); <3}

在伺服器端，我們收到這些 {1>roomOptions<1} 並使用它們來初始化遊戲邏輯。只有在初始化團隊死亡競賽房間時，我們才使用 {2>scoreToWin<2} 選項，如 {3>starBossTDM.js<3} 所示：{4}javascript roomRef.tdmScoreToWin = options\["scoreToWin"] ?Number(options\["scoreToWin"]) :{1}
