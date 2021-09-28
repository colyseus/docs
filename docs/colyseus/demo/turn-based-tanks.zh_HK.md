# 回合製坦克演示

本演示的目的是作為使用 Colyseus 的異步, 基於回合的遊戲的示例.
本演示旨在搭配 Colyseus 0.14.7 版本以及 [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases) 使用.

**[下載演示](https://github.com/colyseus/unity-demo-tanks/archive/main.zip)** ([查看源代碼](https://github.com/colyseus/unity-demo-tanks/))

[玩玩看!](https://xcdazr.colyseus.dev/)

![大廳](/demo/turn-based-tanks/WeaponFired.png)

## 開始

### 啟用本地伺服器

您需要從 **提供的伺服器目錄** 中選擇安裝並啟用伺服器, 以正常操作本演示. 按照 [這些文檔中 Unity3d 部分之 "執行演示伺服器"](https://docs.colyseus.io/getting-started/unity3d-client/#running-the-demo-server) 中的說明操作即可.

### ColyseusSettings ScriptableObject

伺服器的所有設置都可通過此處的 ColyseusSetting ScriptableObject 進行更改:

![ScriptableObject](../common-images/scriptable-object.png)

如果您執行的是本地伺服器, 預設的設置就能夠滿足需求; 但若您希望托管伺服器, 則需要相應地更改 **Colyseus 伺服器地址** 和 **Colyseus 伺服器端口**.

## 演示概覽

### 房間元數據

本演示使用房間的元數據, 通過用戶名來追蹤遊戲內的玩家. 當一名玩家加入或創建一個房間時, 其用戶名將被存儲在一個名為 `team0` 或 `team1` 的屬性中, `team0` 代表這名玩家創建了房間, `team1` 代表這名玩家加入了可用房間來挑戰其創建者.
``` javascript
this.metadata.team0
this.metadata.team1

this.setMetadata({"team0": options["creatorId"]});

```

之後, 元數據中設置的用戶名將用於篩選大廳中顯示的可用房間. 在大廳裏, 用戶能夠看到他們所創建的任何房間, 或者根據房間是否在等待挑戰者加入遊戲, 可以看到可用的房間. 非由您創建的房間以及已有兩名玩家的房間不會顯示在大廳內.

``` csharp
private TanksRoomsAvailable[] TrimRooms(TanksRoomsAvailable[] originalRooms)
{
    List<TanksRoomsAvailable> trimmedRooms = new List<TanksRoomsAvailable>();
    for (int i = 0; i < originalRooms.Length; ++i)
    {
        //Check a rooms metadata. If its one of our rooms OR waiting for a player, we show it
        TanksRoomMetadata metadata = originalRooms[i].metadata;
        if (metadata.team1 == null || (metadata.team1.Equals(ExampleManager.Instance.UserName) ||
                                       metadata.team0.Equals(ExampleManager.Instance.UserName)))
        {
            trimmedRooms.Add(originalRooms[i]);
        }
    }

    return trimmedRooms.ToArray();
}
```

![大廳](Rooms.PNG)

### 保持房間的存在狀態

為了使這個演示成為一個異步的回合製遊戲, 我們需要保持房間的存在狀態, 即使是在雙方玩家都離開房間之後. 通過將 `autoDispose` 標誌設為 false, 該房間將繼續保持存在狀態. (您可以在 onCreate 處理程序的 TanksRoom 伺服器代碼中看到此項).

``` javascript
this.autoDispose = false;
```

我們知道, 在執行檢查確定房間是否應該關閉後, 在布爾標誌 `inProcessOfQuitingGame` 被設置為 true 後斷開房間. 這些檢查會在一名用戶離開遊戲時執行.
``` javascript

// 檢查創作者是否在其他人加入之前就已經退出了
if(this.metadata.team0 && this.metadata.team1 == null) {
    disconnectRoom = true;
}

// 房間裏沒有其他用戶,所以斷開連線
if(this.inProcessOfQuitingGame && this.state.networkedUsers.size <= 1 && this.connectedUsers <= 1) {
    disconnectRoom = true;
}

// 房間是否應該斷開連線?
if(disconnectRoom) {
    this.disconnect();
}
```

### 暫停房間

由於這是一個異步遊戲的示例, 我們的房間可能在任何時間都沒有用戶連線進來. 當沒有用戶連線至房間時, 伺服器不需要更新模擬循環. 當用戶斷開與房間的連線時, 將執行檢查以查看是否不再有用戶連線到房間. 當沒有更多用戶連線到房間時, 通過將延遲設置為高值, 可以有效地暫停模擬間隔. 在本示例中, 該值略大於 24 天.

``` javascript

// 在房間的 `onLeave` 處理程序中
// 檢查伺服器是否應該暫停模擬循環,因為
// 沒有用戶連線到房間
let anyConnected: boolean = false;
this.state.players.forEach((player, index) => {
    if(player.connected) {
        anyConnected = true;
    }
});

if(anyConnected == false) {
    // 沒有用戶連線,所以暫停伺服器更新
    this.setServerPause(true);
}


private setServerPause(pause: boolean) {

    if(pause) {
        this.setSimulationInterval(dt => this.gameLoop(dt), this.pauseDelay);
    }
    else {
        // 設置模擬間隔回呼
        this.setSimulationInterval(dt => this.gameLoop(dt));
    }

    this.serverPaused = pause;
}
```

當用戶重新加入被暫停的房間時, 模擬間隔恢復.
``` javascript

// 在房間的 `onJoin` 處理程序中/
// 檢查伺服器是否需要解除暫停狀態
if(this.serverPaused) {
    // 伺服器目前處於暫停狀態,由於有玩家加入連線,因此取消暫停狀態
    this.setServerPause(false);
}
```

### 播放演示

讓玩家出生在 "TanksLobby" 場景, 位置是 `Assets\TurnBasedTanks\Scenes\TanksLobby`. 輸入您的用戶名並創建房間以開始. **如果您無法進入房間製作界面,請確認您的本地伺服器工作正常, 並檢查 Unity 編輯器的錯誤日誌.** 如果您成功了, 客戶端將加載 "TankArena" 場景.

- 本演示為異步回合製遊戲.

- 您可以隨時離開房間,之後返回進行中的遊戲時,將從最後離開的地方繼續.

- 一局遊戲中只能有兩名玩家.

- 遊戲目標是摧毀對手的坦克.

- 每名玩家有 3 點生命值, 顯示在屏幕上方角落.

- 當您創建一個房間時,您可以立即開始您的回合, 無論是否已經有另一名玩家加入.

- 所有控製選項都顯示在 **ESC** 菜單中.

- 您可以使用 ESC 菜單中的退出選項隨時離開房間, 也可以向您的對手投降.

- 您的回合開始時有 3 個行動點數.向左/右移動消耗 **一個** 行動點數, 開火消耗 **兩個** 行動點數.

- 移動可以被過高的地形所阻擋.

- 想要發射坦克的武器時, 單擊鼠標左鍵並長按來為射擊充能.松開左鍵進行開火.

- 您有 3 種射程不同的武器可供選擇. 使用數字鍵 1-3 來選擇武器.

- 在每次移動或開火行動後有 2 秒延遲, 之後才能進行下一次行動.

- 在一名玩家的坦克損毀或有人投降時遊戲結束, 遊戲結束菜單顯示勝/負消息, 並展示兩個選項: 再來一局或退出遊戲. 如果另一名玩家在您離開前要求再來一局, 您的遊戲結束菜單上將顯示一條消息.

- 您的對手名稱旁邊會有一個 "在線標誌",來顯示其是否與您同時處於房間內.
    - **紅色** = 離線
    - **綠色** = 在線.

- 您可以通過按下空格鍵來選擇跳過您的剩余回合.

![大廳](GameplayWithLabels.png)
![大廳](GameOver.PNG)

## 調整演示

當您播放此演示的時候, 您可能希望進行一些調整, 幫您更好地了解當前發生的情況. 下面您將學習如何進行微調整.

### 遊戲規則和武器數據

**Game Rules** 和 **Weapon Data** 的值都可以在遊戲代碼的 `ArenaServer\src\rooms\tanks\rules.ts` 中找到. **Game Rules** 控製移動, 開火消耗以及玩家擁有多少行動點數. `weaponList` 的數據詳細規定了每種武器的最大充能, 充能時間, 沖擊範圍以及沖擊傷害.

```javascript
const GameRules = {
    MaxActionPoints: 3,
    MovementActionPointCost: 1,
    FiringActionPointCost: 2,
    ProjectileSpeed: 30,
    MaxMovement: 3,
    MaxHitPoints: 3,
    MovementTime: 2,
}

const weaponList = [
    {
        name: "Short Range",
        maxCharge: 5,
        chargeTime: 1,
        radius: 1,
        impactDamage: 1,
        index: 0
    },
    {
        name: "Mid Range",
        maxCharge: 8,
        chargeTime: 2,
        radius: 1,
        impactDamage: 1,
        index: 1
    },
    {
        name: "Long Range",
        maxCharge: 10,
        chargeTime: 5,
        radius: 1,
        impactDamage: 1,
        index: 2
    }
]

```
