# Shooting Gallery 技術演示

該技術演示的目的是展示如何創建房間, 利用自定義遊戲邏輯來處理完整的, 多人的遊戲循環周期. 該演示設計時使用了 Colyseus 0.14 版本以及 [Unity version 2019.4.20f1](https://unity3d.com/unity/qa/lts-releases).

**[下載演示源碼](https://github.com/colyseus/unity-demo-shooting-gallery/archive/master.zip)** ([在線查看源代碼](https://github.com/colyseus/unity-demo-shooting-gallery/))

![屏幕截圖](shooting-gallery/screenshot.png)

## 開始

### 啟動本地服務器

您需要以 **提供的 Server 目錄** 安裝並啟用服務器來打開本演示. 按照 [這些文檔中 Unity3d 部分的 "運行演示服務器"](/getting-started/unity3d-client/#running-the-demo-server) 中的說明操作即可.

### ColyseusSettings ScriptableObject

服務器的所有設置都可通過此處的 ColyseusSetting ScriptableObject 進行修改:

![ScriptableObject](common-images/scriptable-object.png)

如果您運行的是本地服務器, 默認的設置就能夠滿足需求; 但若您希望托管服務器, 則需要按需更改 **Colyseus 服務器地址** 和 **Colyseus 服務器端口**.

### 進入遊戲

打開位於 `Assets\GalleryShooter\Scenes\Lobby` 的場景 "Lobby" 進入遊戲. 輸入您的用戶名然後創建房間開始遊戲. **如果您無法進入創建房間界面, 請確認本地服務器運行正常, 並核查 Unity 編輯器的錯誤日誌.** 如果一切順利, 客戶端將加載 "GalleryShooter" 場景. 如果您按下 Enter 鍵或者點擊 「Start」 按鈕, 您將進入 "準備就緒" 狀態, 然後遊戲將會開始. 如果您想等待更多玩家加入, 必須等所有玩家都 "準備就緒" 後遊戲才會開始.


## 調整演示

當您把玩該演示的時候, 您可能希望進行一些調整, 幫您更好地了解各種機製. 下面您會學習到微調帶來的效果.

### 標靶

遊戲內標靶的值可以在服務端代碼 `Server\src\rooms\customLogic\targets.ts` 中找到. 在這裏, 您可以調整分值, 重命名標靶以及添加/刪除標靶配置項. 如果新增一個標靶, 請務必給它一個新的 "id" 值, 否則 Unity 客戶端不知道該顯示哪種標靶模型.

客戶端上的這些標靶配置項可以在 "TargetController"  prefab 中調整, 位置是 `Assets\GalleryShooter\Prefabs\Targets\Controls\TargetController.prefab`. 如果您希望修改模型或添加新標靶, 可以在這裏做功課.

### 標靶移動

服務器提供的標靶將根據其所在的行, 交給相應的 TargetTreadmill. "Row" 會在服務端 `target.ts` 的第 52 行隨機進行設置. 如果您在 GalleryShooter 場景中添加或刪除行, 則必須在服務修正 `LobbyController.numberOfTargetRows` 值:

![LobbyController.numberOfTargetRows](/colyseus/demo/shooting-gallery/number-of-target-rows.png):

這個數字將在房間初始化時提供給服務器, 在選擇隨機標靶行時使用.

treadmill 將獨立控製發送標靶的頻率:

![Time between targets](/colyseus/demo/shooting-gallery/time-between-targets.png)

TargetBase 對象在這裏控製其自身速度:

![Move speed](/colyseus/demo/shooting-gallery/move-speed.png)

### 調整槍支

槍支的各種參數可以在 Gun prefab 裏進行修改:

![Guns](/colyseus/demo/shooting-gallery/guns.png)

### 最大玩家數

默認最大玩家數設為 `25`. 您可以在 `Server\src\rooms\ShootingGalleryRoom.ts` 代碼的第 `94` 行更改. 或者, 如果您不希望有人數限製, 移除此行即可.

### 調整玩家移動

您可以在位於 `Assets\GalleryShooter\Prefabs\GalleryShootPlayer.prefab` 的這個 prefab 中調整玩家的移動數值. 在這裏您還可以調整遠程玩家的移動插值率以及其他限製.
