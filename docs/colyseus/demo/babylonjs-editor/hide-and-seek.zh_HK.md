# Hide and Seek 技術演示

## Technical Requirements
- Node.js v14.0 或更高版本
- Colyseus 0.14.20
- Colyseus Client SDK 0.14.13
- Babylon.js Editor 4.4.0 或更高版本

## Introduction
本技術演示旨在展示 Colyseus 如何與 Babylon.js Editor 配合使用. 以下文檔涵蓋從安裝到使用 Colyseus 客戶端 SDK 連接本地 Colyseus 服務器的方法. 本演示使用 Colyseus 0.14.20 版本以及 [Babylon.js Editor 版本 4.4.0](http://editor.babylonjs.com/){target=_blank}.
演示遊戲名叫 "Hide and Seek", 遊戲中玩家被隨機賦予躲藏者 (幽靈) 或者追捕者 (南瓜頭) 的角色. 躲藏者躲避追捕者的追捕直到遊戲倒計時結束即可獲得勝利.

**[下載演示](https://github.com/colyseus/babylonjs-hide-and-seek/archive/master.zip)** ([查看源碼](https://github.com/colyseus/babylonjs-hide-and-seek/){target=_blank})

**[玩玩看](https://bppuwh.colyseus.dev/){target=_blank}**

![封面](hide-and-seek/title.png)

## 開始

### Colyseus SDK/Framework
必須從 **提供的 Server 目錄** 安裝啓動服務器以便演示遊戲順利運行. 
要啓動本地服務器, 在控制台輸入以下命令即可:

```
cd Server
npm install
npm start
``` 

!!! note "注意"
    - 必須先安裝服務器再從編輯器中打開或運行遊戲項目不然項目編譯會報錯. 這是因爲出于開發便捷的目的, 客戶端代碼要從服務端引用壹些類.
    - 在用 Babylon.js Editor 打開遊戲項目時, 在 **Server** 文件夾裏會自動從 `.ts` 源文件生成相應的 `.js` 文件. 而當本地服務器 (使用用 `npm start`) 啓動時, 這些 `.js` 文件會被刪除以免造成運行時報錯.

### Colyseus 服務器配置
存放服務器配置的 `.env` 文件位于 Babylon.js Editor 工作目錄下:

![服務器配置](hide-and-seek/server-settings.png)

如果使用本地服務器, 使用 `local` 配置即可. 但當使用遠程服務器的時候, 就需要配置好相應的 **Colyseus 服務器地址** 和 **Colyseus 服務器端口**. 例如 remote 配置文件就包含了本演示遊戲在 Arena 上的配置信息.
編輯器默認從 `local.env` 文件中讀取配置值.

## 進入遊戲
![Editor](hide-and-seek/editor.png)

使用編輯器打開工作目錄就應該自動加載好這個唯壹的場景. 點擊編輯器左上角的 "Play" 按鈕就會開啓壹個播放窗口. 創建遊戲房間或者加入已存在的遊戲房間只要點擊 "Quick Play" 按鈕即可. 然後會顯示 "Joining..." 提示, 連接成功後提示消失並顯示出大廳界面.
默認最少3名玩家加入即可開始遊戲, 如下文所示該值是可調整的. 必要的話可以打開多個客戶端以模擬多人對戰.

!!! tip "提示"
    - 在浏覽器運行客戶端的性能要高于編輯器的嵌入式浏覽器 (在編輯器中右鍵點擊 "Run" 按鈕) 

    ![Run](hide-and-seek/run.png)

    - 如果未能成功進入大廳請檢查本地服務器運行狀況及編輯器日志報錯.

![遊戲界面](hide-and-seek/gameplay.png)

### 控制方法
玩家移動: W, A, S, D 鍵.

### 遊戲玩法
- 追捕者和躲藏者都出現在墓園前的中心位置
- 每輪遊戲持續 60 秒鍾. 剩余時間在屏幕左上角顯示

#### Seeker:
- 如果計時結束前追捕者找到所有躲藏者, 則追捕者獲勝
- 躲藏者被捉到前, 不能被追捕者直接看到
- 有壹些花招陷阱, 把躲藏者的的位置提示給追捕者, 點亮隱藏區域
    - 泥沼使得玩家移動時留下壹串腳印, 持續顯示壹段時間
    - 安住的追捕者魂會被躲藏者驚擾到
    - 休息的蝙蝠會被躲藏者驚擾到

#### Hider:
- 在追捕者開始追捕前, 躲藏者有 3 秒鍾時間逃跑躲藏
- 如果計時結束至少有 1 名躲藏者沒被找到, 則躲藏者獲勝
- 如果躲藏者出現在追捕者的視野裏或者離追捕者太近就會被捉到
    - 視野範圍 60 度, 長 7 米
- 被捉到的躲藏者無法移動
    - 會在其足部用高亮鐵鏈標識出來
- 被捉住的躲藏者有壹次機會被其他躲藏者救活
    - 救躲藏者只需站在他旁邊 1 秒鍾即可

## 調整遊戲
玩過這個遊戲之後, 您可能希望按自己喜好對遊戲做壹些調整. 下面來解釋如何對遊戲進行微調. 絕大多數變量都保存在 **Server** 文件夾下的 `Server/src/gameConfig.ts` 文件中.

![遊戲配置](hide-and-seek/config.png)

### 玩家限制
`minPlayers` 表示遊戲所需最少躲藏者數. `maxPlayers` 表示遊戲房間可以進入的最多躲藏者數. 本例中每個房間最多 8 名玩家. 可以減少這個數量, 增大到超過 8 則會報錯.

### 玩家移動
有兩個值影響著玩家移動速度. 基本移動速度 `playerMovementSpeed` 作用于追捕者和躲藏者所有玩家. 追捕者還有壹個速度加成 `seekerMovementBoost` 默認設置爲 `1.2`. 在速度加成影響下追捕者可以以 1.2 倍速 (也就是比躲藏者快 20%) 移動.

### 追捕者的視野
追捕者的追捕能力基于他的視野 (FOV) 和視距. 這兩個值分別保存爲 `seekerFOV` 和 `seekerCheckDistance` 變量.

### 營救玩家
有兩個變量涉及玩家營救. 壹個是 `rescueDistance` 用來控制營救者與被抓者的有效營救距離; 另壹個是 `rescueTime` 代表營救時間, 以毫秒爲單位.

### 倒計時
有許多倒計時可以調整; 每個倒計時以 `Countdown` 作爲變量後綴影響著遊戲狀態. 倒計時都是以毫秒爲單位:

![Countdowns](hide-and-seek/countdowns.png)

- `preRoundCountdown`: 從房間達到最少有效躲藏者數開始, 到鎖定房間並開始遊戲的倒計時. 
- `initializedCountdown`: 服務器初始化好壹輪遊戲的房間之後的壹小段時間, 用于讓服務端接收並更新 schemas 以及玩家們的初始化操作.
- `prologueCountdown`: 追捕者抓躲藏者之前的總時長. 與 scatter countdown 壹起使用. 留給玩家的角色反應時間是 `prologueCountdown - scatterCountdown`
- `scatterCountdown`: 留給玩家逃跑躲藏的時長.
- `huntCountdown`: 壹輪遊戲時長; 即留給追捕者捉躲藏者的時長.
- `gameOverCountdown`: 遊戲結束後顯示提示的時長.
