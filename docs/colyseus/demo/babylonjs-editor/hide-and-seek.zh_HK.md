# Hide and Seek 技術演示

!!! requirement "前提需求"
    - Node.js v14.0 或更高版本
    - Colyseus 0.14.20
    - Babylon.js Editor 4.4.0 或更高版本

本技術演示旨在展示 Colyseus 如何與 Babylon.js Editor 配合使用. 以下文檔涵蓋從安裝到使用 Colyseus 客戶端 SDK 連接本地 Colyseus 服務器的方法. 本演示使用 Colyseus 0.14.20 版本以及 [Babylon.js Editor 版本 4.4.0](http://editor.babylonjs.com/).

**[下載演示源碼](https://github.com/colyseus/babylonjs-hide-and-seek/archive/master.zip)** ([查看源代碼](https://github.com/colyseus/babylonjs-hide-and-seek/))

![封面](hide-and-seek/title.png)

## 開始

### 安裝並啓動本地服務器
您需要以 **提供的 Server 目錄** 安裝並啓用服務器來打開本演示. 按照 [這些文檔中 Unity3d 部分的 "運行演示服務器"](/getting-started/unity3d-client/#running-the-server-locally). 

!!! note "注意"
    - 必須先安裝服務器再從編輯器中打開或運行遊戲項目不然項目編譯會報錯. 這是因爲出于開發便捷的目的, 客戶端代碼要從服務端引用壹些類.
    - 在用 Babylon.js Editor 打開遊戲項目時, 在 **Server** 文件夾裏會自動從 `.ts` 源文件生成相應的 `.js` 文件. 而當本地服務器 (使用用 `npm start`) 啓動時, 這些 `.js` 文件會被刪除以免造成運行時報錯.

### Colyseus 服務器配置
存放服務器配置的 `.env` 文件位于 Babylon.js Editor 工作目錄下:

![服務器配置](hide-and-seek/server-settings.png)

如果使用本地服務器, 使用 `local` 配置即可. 但當使用遠程服務器的時候, 就需要配置好相應的 **Colyseus 服務器地址** 和 **Colyseus 服務器端口**. 例如 remote 配置文件就包含了本演示遊戲在 Arena 上的配置信息.
編輯器默認從 `local.env` 文件中讀取配置值.

## 進入遊戲
使用編輯器打開工作目錄就應該自動加載好這個唯壹的場景. 點擊編輯器左上角的 "Play" 按鈕就會開啓壹個播放窗口. 創建遊戲房間或者加入已存在的遊戲房間只要點擊 "Quick Play" 按鈕即可. 然後會顯示 "Joining..." 提示, 連接成功後提示消失並顯示出大廳界面. **如果未能成功進入大廳請檢查本地服務器運行狀況及編輯器日志報錯.**
默認最少3名玩家加入即可開始遊戲, 如下文所示該值是可調整的.

![遊戲界面](hide-and-seek/gameplay.png)

### 控制方法
玩家移動: W, A, S, D 鍵.

### 遊戲玩法
- 鬼和人都出現在墓園前的中心位置
- 在鬼開始追捕前, 人有 3 秒鍾時間逃跑躲藏
- 每輪遊戲持續 60 秒鍾. 剩余時間在屏幕左上角顯示
- 如果計時結束至少有 1 名人沒被找到, 則人獲勝
- 如果計時結束前鬼找到所有人, 則鬼獲勝
- 人被捉到前, 不能被鬼直接看到
- 有壹些花招陷阱, 把人的的位置提示給鬼, 點亮隱藏區域
    - 泥沼使得玩家移動時留下壹串腳印, 持續顯示壹段時間
    - 安住的鬼魂會被人驚擾到
    - 休息的蝙蝠會被人驚擾到
- 如果人出現在鬼的視野裏或者離鬼太近就會被捉到
    - 視野範圍 60 度, 長 7 米
- 被捉到的人無法移動
    - 會在其足部用高亮鐵鏈標識出來
- 被捉住的人有壹次機會被其他人救活
    - 救人只需站在他旁邊 1 秒鍾即可

## 調整遊戲
玩過這個遊戲之後, 您可能希望按自己喜好對遊戲做壹些調整. 下面來解釋如何對遊戲進行微調. 絕大多數變量都保存在 **Server** 文件夾下的 `Server/src/gameConfig.ts` 文件中.

![遊戲配置](hide-and-seek/config.png)

### 玩家限制
`minPlayers` 表示遊戲所需最少人數. `maxPlayers` 表示遊戲房間可以進入的最多人數. 本例中每個房間最多 8 名玩家. 可以減少這個數量, 增大到超過 8 則會報錯.

### 玩家移動
有兩個值影響著玩家移動速度. 基本移動速度 `playerMovementSpeed` 作用于鬼和人所有玩家. 鬼還有壹個速度加成 `seekerMovementBoost` 默認設置爲 `1.2`. 在速度加成影響下鬼可以以 1.2 倍速 (也就是比人快 20%) 移動.

### 鬼的視野
鬼的追捕能力基于他的視野 (FOV) 和視距. 這兩個值分別保存爲 `seekerFOV` 和 `seekerCheckDistance` 變量.

### 營救玩家
有兩個變量涉及玩家營救. 壹個是 `rescueDistance` 用來控制營救者與被抓者的有效營救距離; 另壹個是 `rescueTime` 代表營救時間, 以毫秒爲單位.

### 倒計時
有許多倒計時可以調整; 每個倒計時以 `Countdown` 作爲變量後綴影響著遊戲狀態. 倒計時都是以毫秒爲單位:

- `preRoundCountdown`: 從房間達到最少有效人數開始, 到鎖定房間並開始遊戲的倒計時. 
- `initializedCountdown`: 服務器初始化好壹輪遊戲的房間之後的壹小段時間, 用于讓服務端接收並更新 schemas 以及玩家們的初始化操作.
- `prologueCountdown`: 鬼抓人之前的總時長. 與 scatter countdown 壹起使用. 留給玩家的角色反應時間是 `prologueCountdown - scatterCountdown`
- `scatterCountdown`: 留給玩家逃跑躲藏的時長.
- `huntCountdown`: 壹輪遊戲時長; 即留給鬼捉人的時長.
- `gameOverCountdown`: 遊戲結束後顯示提示的時長.
