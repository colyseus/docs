# 射擊場技術演示

此技術演示旨在展示如何建立房間、利用自訂遊戲邏輯以及處理完整的多人遊戲週期。該演示旨在與 Colyseus 0.14 版和 [Unity 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases) 版搭配使用。

**[下載試玩版](https://github.com/colyseus/unity-demo-shooting-gallery/archive/master.zip)**（[檢視原始程式碼](https://github.com/colyseus/unity-demo-shooting-gallery/)）

![螢幕擷取畫面](screenshot.png)

## 開始使用

### 啟動本機伺服器

你必須在**提供的伺服器目錄**中的伺服器裡安裝並啟動本試玩版，才能夠正常運作。只需按照這些文件的 Unity3d 部分中的[「執行演示伺服器」下的說明進行操作](/getting-started/unity3d-client/#running-the-demo-server)。

### ColyseusSettings ScriptableObject

全部伺服器設定都可以透過位於這裡的 ColyseusSetting ScriptableObject 來進行變更：

![ScriptableObject](../common-images/scriptable-object.png)

如果你執行的是本機伺服器，預設的設定應該很充足，然而如果你希望提供主機伺服器服務，會需要變更**Colyseus 伺服器位址**和對應的**Colyseus 伺服器連接埠** 值。

### 遊玩試玩版

在位於 `Assets\GalleryShooter\Scenes\Lobby` 的場景「Lobby」中啟動播放器。輸入您的使用者名稱並建立一個房間，以便開始。**如果您無法進入房間建立畫面，請確認您的本機伺服器運作正常並檢查 Unity 編輯器中的錯誤日誌。**如果成功，用戶端將加載「GalleryShooter」場景。如果您按 Enter 鍵或單擊「開始」按鈕，您將「準備就緒」並開始遊戲。如果您在本機伺服器上等待更多玩家加入，則所有玩家都必須在遊戲開始前「準備就緒」。


## 調整演示

當您使用這個演示時，您可能需要進行一些調整，以更好地熟悉正在發生的事情。以下，您將學習如何進行這些細微的調整。

### 目標

用於遊戲中目標的值可以在 `Server\src\rooms\customLogic\targets.ts` 的伺服器代碼中找到。在這裡，您可以調整分數值、重新命名目標和新增/刪除目標選項。如果您新增一個新的目標，確保也給它一個新的「id」值，否則 Unity 用戶端將不知道要顯示什麼目標模型。

用戶端上的這些目標選項可以在位於 `Assets\GalleryShooter\Prefabs\Targets\Controls\TargetController.prefab` 的「TargetController」預製件中進行調整。如果您希望調整模型或新增目標，您可以在此處為用戶端做好準備

### 目標移動

目標，當從伺服器提供時，將根據其行數傳遞給相應的 TargetTreadmill。「Row」在伺服器上 `target.ts` 中的第 52 行隨機設定。如果您在 GalleryShooter 場景中新增或刪除行，則必須透過 `LobbyController.numberOfTargetRows` 使伺服器意識到它：

![numberOfTargetRows](/demo/shooting-gallery/number-of-target-rows.png)

該數字將在房間初始化時提供給伺服器，並且在隨機選擇目標行時將使用該值。

跑步機單獨控制其發出目標的頻率：

![目標之間的時間](/demo/shooting-gallery/time-between-targets.png)

TargetBase 物件在此控制其速度：

![移動速度](/demo/shooting-gallery/move-speed.png)

### 調整槍械

可在此處的槍械預製件上更改槍械的重要值：

![槍械](/demo/shooting-gallery/guns.png)

### 最大玩家人數

最大玩家人數預設為 `25`。您可以在 `Server\src\rooms\ShootingGalleryRoom.ts` 中的第 `94` 行進行調整。或者，如果您希望沒有限制，只需刪除此行即可。

### 調整玩家移動

您可以在位於 `Assets\GalleryShooter\Prefabs\GalleryShootPlayer.prefab` 的預製件上調整玩家的移動值。在這裡，您還可以調整遠端玩家移動的插值率以及其他限制。
