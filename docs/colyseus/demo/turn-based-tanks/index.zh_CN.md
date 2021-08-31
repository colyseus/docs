# 回合制坦克演示

此演示的目標是作為使用 Colyseus 異步回合制遊戲的一種方法的示例。此演示旨在與 Colyseus 版本 0.14.7 和 [Unity 版本 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases) 搭配使用。

**[下載試玩版](https://github.com/colyseus/unity-demo-tanks/archive/main.zip)**（[檢視原始程式碼](https://github.com/colyseus/unity-demo-tanks/)）

[遊玩試玩版！](https://xcdazr.colyseus.dev/)

![大廳](/demo/turn-based-tanks/WeaponFired.png)

## 開始使用

### 啟動本機伺服器

你必須在**提供的伺服器目錄**中的伺服器裡安裝並啟動本試玩版，才能夠正常運作。只需按照這些文件的 Unity3d 部分中的[「執行演示伺服器」下的說明進行操作](https://docs.colyseus.io/getting-started/unity3d-client/#running-the-demo-server)。

### ColyseusSettings ScriptableObject

全部伺服器設定都可以透過位於這裡的 ColyseusSetting ScriptableObject 來進行變更：

![ScriptableObject](../common-images/scriptable-object.png)

如果您執行的是本機伺服器，預設設定應該足夠了，但是如果您希望託管伺服務器，則需要相應地更改 **Colyseus Server Address** 和 **Colyseus Server Port** 值.

## 試玩版概觀

### 房間中繼資料

這個演示利用房間的中繼資料來追蹤遊戲中玩家的使用者名稱。當玩家加入或建立房間時，其使用者名稱將儲存在名為 `team0` 或 `team1` 的屬性中，其中 `team0` 代表建立房間的玩家和 `team1` 代表已加入可用房間挑戰建立者的玩家。 ``` javascript this.metadata.team0 this.metadata.team1

this.setMetadata({"team0": options\["creatorId"]});

```

然後使用中繼資料中設定的使用者名稱來過濾大廳中顯示的可用房間。在大廳內，使用者可根據房間是否正在等待挑戰者加入遊戲來查看其建立或可用的任何房間。您尚未建立且有兩名玩家的房間將不會顯示在大廳中。

``` csharp private TanksRoomsAvailable\[] TrimRooms(TanksRoomsAvailable\[] originalRooms) { List<TanksRoomsAvailable> trimmedRooms = new List<TanksRoomsAvailable>(); for (int i = 0; i < originalRooms.Length; ++i) { //檢查房間中繼資料。如果它是我們的房間之一或正在等待玩家，我們將顯示它 TanksRoomMetadata metadata = originalRooms\[i].metadata; if (metadata.team1 == null || (metadata.team1.Equals(ExampleManager.Instance.UserName) || metadata.team0.Equals(ExampleManager.Instance.UserName))) { trimmedRooms.Add(originalRooms\[i]); } }

    return trimmedRooms.ToArray();
} ```

![大廳](/demo/turn-based-tanks/Rooms.png)

### 保持房間活躍

為了使這個演示成為基於異步回合的遊戲，我們需要即使在兩個玩家都離開房間後仍然保持房間活躍。透過將 `autoDispose` 標誌設定為 false，房間可以保持活躍狀態。（您可以在 onCreate 處理程序中的 TanksRoom 伺服器代碼中看到這一點）。

``` javascript this.autoDispose = false; ```

我們知道在執行檢查以確定是否應該關閉房間後，在布爾標誌 `inProcessOfQuitingGame` 設定為 true 後斷開房間。當使用者退出遊戲時執行這些檢查。 ``` javascript

// 檢查建立者是否在其他人加入之前退出 if(this.metadata.team0 && this.metadata.team1 == null) { disconnectRoom = true; }

// 房間裡沒有其他使用者，所以斷開連接 if(this.inProcessOfQuitingGame && this.state.networkedUsers.size <= 1 && this.connectedUsers <= 1) { disconnectRoom = true; }
	
// 房間應該斷開連接嗎？ if(disconnectRoom) { this.disconnect(); }```

### 暫停房間

由於這是一個異步遊戲的例子，我們的房間在任何時間內都可能沒有使用者連接到它。當沒有使用者連接到房間時，伺服器不需要更新模擬循環。當使用者與房間斷開連接時，會執行檢查以查看是否沒有更多使用者連接到房間。當沒有更多使用者連接到房間時，將延遲設定為高值能有效地暫停模擬間隔。在此情況下，該值比 24 天多一點。 ``` javascript

// 在房間的 `onLeave` 處理常式中 // 檢查伺服器是否應該暫停模擬循環，因為 // 沒有使用者連接到房間 let anyConnected: boolean = false; this.state.players.forEach((player, index) => { if(player.connected) { anyConnected = true; } });

if(anyConnected == false) { // 沒有使用者連接，所以暫停伺服器更新 this.setServerPause(true); }


private setServerPause(pause: boolean) {

    if(pause) {
        this.setSimulationInterval(dt => this.gameLoop(dt), this.pauseDelay);
    }
    else {
        // Set the Simulation Interval callback
        this.setSimulationInterval(dt => this.gameLoop(dt));
    }

    this.serverPaused = pause;
} ```

當使用者重新加入已暫停的房間時，將恢復模擬間隔。 ``` javascript

// 在房間的 `onJoin` 處理程序中 // 檢查伺服器是否需要取消暫停 if(this.serverPaused) { // 伺服器目前已暫停，因此取消暫停，因為玩家已連接 this.setServerPause(false ); }```

### 遊玩試玩版

在位於 `Assets\TurnBasedTanks\Scenes\TanksLobby` 的場景「TanksLobby」中啟動玩家。輸入您的使用者名稱並建立一個房間，以便開始。**如果您無法進入房間建立畫面，請確認您的本機伺服器運作正常並檢查 Unity 編輯器中的錯誤日誌。**如果成功，用戶端將加載「TankArena」場景。

- 此演示是一個異步回合制遊戲。

- 您可以隨時離開房間，然後返回正在進行的遊戲，它會從上次停止的地方繼續。

- 一個遊戲中只能有兩個玩家玩。

- 目標是摧毀對手的坦克。

- 每個玩家都有 3 個生命值顯示在畫面頂端的角落。

- 當您建立一個房間時，您可以立即輪到自己，而無需其他玩家加入。

- 所有控制項都顯示在 **ESC** 選單中。

- 您可以隨時使用 ESC 選單中的退出選項離開房間，或者您可以將遊戲交給對手。

- 輪到您時，您有 3 個行動點。向左/向右移動消耗 **1** AP，開火消耗 **2** AP。

- 移動可能被太高的地形阻擋。

- 若要開火您的坦克武器，您可以按滑鼠左鍵並按住以蓄力。釋放滑鼠左鍵將觸發。

- 您有 3 種不同射程的武器可供選擇。使用 1-3 編號鍵來選擇您的武器。

- 在每次移動或射擊動作之間有 2 秒的延遲，然後才能採取另一個動作。

- 當遊戲因玩家的坦克被摧毀或有人投降而結束時，將顯示一個遊戲結束選單，顯示贏/輸訊息，其中包含請求重賽或退出遊戲的選項。如果其他玩家在您離開之前請求重賽，則遊戲結束選單上將顯示一條訊息。

- 您的對手姓名旁邊有一個「上線指示器」，用於表明其是否與您同時在房間內。 
	- **紅色** = 離線 
	- **綠色** = 上線。

- 您可以選擇按空格鍵跳過剩餘的回合。

![大廳](/demo/turn-based-tanks/GameplayWithLabels.png) ![大廳](/demo/turn-based-tanks/GameOver.png)

## 調整演示

當您使用這個演示時，您可能需要進行一些調整，以更好地熟悉正在發生的事情。以下，您將學習如何進行這些細微的調整。

### 遊戲規則和武器資料

**Game Rules** 和 **Weapon Data** 值都可以在 `ArenaServer\src\rooms\tanks\rules.ts` 的伺服器代碼中找到。**遊戲規則**控制移動和射擊成本以及玩家獲得的行動點數。`weaponList` 中的資料指定了每種武器的最大蓄力、蓄力時間、撞擊半徑和撞擊傷害。

```javascript const GameRules = { MaxActionPoints:3, MovementActionPointCost:1, FiringActionPointCost:2, ProjectileSpeed:30, MaxMovement:3, MaxHitPoints:3, MovementTime:2, }

const weaponList = \[ { name:"Short Range", maxCharge:5, chargeTime:1, radius:1, impactDamage:1, index:0 }, { name:"Mid Range", maxCharge:8, chargeTime:2, radius:1, impactDamage:1, index:1 }, { name:"Long Range", maxCharge:10, chargeTime:5, radius:1, impactDamage:1, index:2 } ]

```
