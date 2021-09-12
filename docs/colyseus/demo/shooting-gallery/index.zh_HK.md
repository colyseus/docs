# Shooting Gallery  技術演示

該技術演示的目的是展示如何製作房間, 利用客製化遊戲邏輯並處理完整的多人遊戲周期.該演示旨在搭配  Colyseus 0.14 版本以及 [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases) 使用.

**[下載演示](https://github.com/colyseus/unity-demo-shooting-gallery/archive/master.zip)** ([查看源代碼](https://github.com/colyseus/unity-demo-shooting-gallery/))

![屏幕截圖](screenshot.png)

## 開始

### 啟用本地伺服器

您需要從 **提供的伺服器目錄** 中選擇安裝並啟用伺服器,以正常操作本演示. 按照 [這些文檔中 Unity3d 部分之"執行演示伺服器"](/getting-started/unity3d-client/#running-the-demo-server) 中的說明操作即可.

### ColyseusSettings ScriptableObject

伺服器的所有設置都可通過此處的 ColyseusSetting ScriptableObject 進行更改：

![ScriptableObject](../common-images/scriptable-object.png)

如果您執行的是本地伺服器,預設的設置就能夠滿足需求；但若您希望托管伺服器,則需要按需更改 **Colyseus 伺服器地址** 和 **Colyseus 伺服器端口**.

### 播放演示

讓玩家出生在"大廳"場景,位置是 `Assets\GalleryShooter\Scenes\Lobby`. 輸入你的用戶名並創建房間以開始. **如果你無法進入房間製作界面,請確認你的本地伺服器工作正常,並檢查 Unity 編輯器的錯誤日誌.** 如果你成功了,客戶端將加載 "GalleryShooter" 場景. 如果你按下 Enter 鍵,你將"準備就緒",同時遊戲將會開始.如果你在你的本地伺服器上等待更多玩家加入,必須在所有玩家都"準備就緒"後遊戲才會開始.


## 調整演示

當你播放此演示的時候,你可能希望進行一些調整,幫你更好地了解當前發生的情況.下面你將學習如何進行微調整.

### 目標

遊戲內目標的值可以在伺服器代碼 `Server\src\rooms\customLogic\targets.ts` 中找到. 在此處, 你可以調整分值, 重命名目標並添加/移除目標選項.如果你添加了一個新目標,請務必給它一個新的 "id" 值,否則 Unity 客戶端將不知道該展示何種目標模型.

客戶端上的這些目標選項可以在 "TargetController" 預設中調整,位置是 `Assets\GalleryShooter\Prefabs\Targets\Controls\TargetController.prefab`. 如果你希望調整模型或添加新目標,你可以在這裏為客戶端做準備

### 目標移動

伺服器提供的目標將根據其所在行的位置移交給相應的 TargetTreadmill."行"會在伺服器 52 列 `target.ts` 隨機設置.如果你在 GalleryShooter 場景中添加或移除行,伺服器必須通過此處對其進行了解：`LobbyController.numberOfTargetRows`:

![LobbyController.numberOfTargetRows](/demo/shooting-gallery/number-of-target-rows.png):

這個數字將在房間初始化時提供給伺服器,並在隨機選擇目標所在的行時使用該值.

treadmills 單獨控製發送目標的頻率：

![Time between targets](/demo/shooting-gallery/time-between-targets.png)

TargetBase 對象在這裏控製其自身速度：

![Move speed](/demo/shooting-gallery/move-speed.png)

### 調整槍支

槍支的重要值可以在槍預設這裏進行更改：

![Guns](/demo/shooting-gallery/guns.png)

### 最大玩家數

預設最大玩家數設置為 `25`. 你可以在 `Server\src\rooms\ShootingGalleryRoom.ts` 的 `94` 列更改. 或者, 如果你不希望設置限製, 移除此列即可.

### 調整玩家移動

你可以在位於 `Assets\GalleryShooter\Prefabs\GalleryShootPlayer.prefab` 的預設中調整玩家的移動值.在這裏,你也可以調整遠端玩家的插值率以及其他限製.
