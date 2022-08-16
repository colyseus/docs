# 歡迎使用 Colyseus

!!! Tip "重要提示"
    - 文檔正在更新和改進中.
    - 文檔翻譯正在進行中.

## 介紹

Colyseus 是基於 Node.js 的, 使用 JavaScript/TypeScript 語言進行開發的, 權威性多平臺遊戲服務系統.

Colyseus 對於客戶端技術和語言一視同仁. 您可以使用任何一種官方支持的客戶端, 比如 [Unity](/colyseus/getting-started/unity3d-client/), [JavaScript/TypeScript](/colyseus/getting-started/javascript-client/), [Defold Engine](/colyseus/getting-started/defold-client/), [Haxe](/colyseus/getting-started/haxe-client/), [Cocos Creator](/colyseus/getting-started/cocos-creator/) 或者 [Construct3](/colyseus/getting-started/construct3-client/).

**Colyseus 可以提供:**

- 基於 webSocket 的實時通訊.
- 服務器和客戶端簡單易懂的 API.
- 服務器和客戶端自動數據同步機製.
- 將客戶端匹配到遊戲會話
- 水平/垂直服務容量擴展

---

## 開始

開始前, 請確保您本地機器已安裝好必要的軟件工具.

**必要軟件**

- [下載並安裝 Node.js](https://nodejs.org/) V14.0 或更高版本
- [下載並安裝 Git SCM](https://git-scm.com/downloads)
- [下載並安裝 Visual Studio Code](https://code.visualstudio.com/) (或者您喜歡的其他編輯器)

### 創建一個簡單的 Colyseus 服務器

打開系統控製臺, 輸入下列命令, 從零開始架設本地服務器.

```
npm init colyseus-app ./my-first-game-server
```

至此服務器模板架設完成. 它可以運行於本地, 自托管服務器, 或者 [Colyseus Arena](/arena/) 之上.

#### 下一步

- 選擇一種 [客戶端 SDK](/colyseus/client/) 來連接服務器.
- 學習如何在服務器與客戶端之間 [交換信息](/colyseus/server/room/#onmessage-type-callback).
- 了解 [自動狀態數據同步](/colyseus/state/overview/) 的工作原理
- 盡情實驗! 探索, 體驗樂趣!

---

### 一些實例項目

建議您參考下面的實例項目探索和學習 Colyseus.

- [Official examples](https://github.com/colyseus/colyseus-examples)
- [PlayCanvas Tutorial](https://developer.playcanvas.com/en/tutorials/real-time-multiplayer-colyseus/)
- [BabylonJS Tutorial](https://doc.babylonjs.com/guidedLearning/multiplayer/Colyseus)
- [PixiJS Tic-Tac-Toe](https://github.com/endel/colyseus-tic-tac-toe)
- [The Open-Source IO Shooter](https://github.com/halftheopposite/TOSIOS)
- [Colyseus + PixiJS Boilerplate (Agar.io simplistic adaptation)](https://github.com/endel/colyseus-pixijs-boilerplate)

**官方 Unity 實例項目**

- [Shooting Gallery](/colyseus/demo/shooting-gallery/)
- [Starboss](/colyseus/demo/starboss/)
- [Turn Based Tanks](/colyseus/demo/turn-based-tanks/)
- [MMO](/colyseus/demo/mmo/)

---

## 附贈: JS GameDev Summit 2022

<iframe width="560" height="315" src="https://www.youtube.com/embed/KnN6nRtfL44" title="Making Multiplayer Games with Colyseus, Node.js and TypeScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Slides](https://docs.google.com/presentation/d/e/2PACX-1vTbM8frwpFb1DhqeFw3hNAEl-awUHs6gU-cCZti4Ec8bvFx-Oa6-qRYlaopwi44uqrXFZoPgMgd64sG/pub?start=false&loop=false&delayms=3000) | [GitNation](https://portal.gitnation.org/contents/making-multiplayer-games-with-colyseus-nodejs-and-typescript)

---

**社區視頻**: 社區成員製作的系列視頻:

- [Multiplayer Tic-Tac-Toe in Colyseus & Phaser 3.50](https://www.youtube.com/playlist?list=PLumYWZ2t7CRueXsocQXOGqewmwzohljof)
- [Multiplayer Game Design Colyseus and Unity](https://www.youtube.com/playlist?list=PLxgtJR7f0RBK_yGDSbPuspqMR-oEi1S25)