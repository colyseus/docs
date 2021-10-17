# 網絡界面

### 需求

* [已完成創建](../create-application/) Arena 應用部署.

## 上傳您的代碼
在應用儀表板的左下角, 點選 **Server Code (伺服器代碼)**, 可以使用網頁集成 IDE 和 上傳功能.

![Arena 應用管理界面](../../images/edit-server-code.jpg)

在此界面上, 您可以 **CREATE (創建)**, **DELETE (刪除)**, **UPLOAD (上傳)** 代碼並將代碼 **DEPLOY (部署)** 到遊戲伺服器中. 點選 **Upload (上傳)** 打開對話框, 在這裏可以選擇上傳單個文件還是整個文件夾.

![Arena 應用管理界面](../../images/upload-dialog.jpg)

!!! NOTE
    - Arena 應用 **僅支持** 已編譯的 Javascript 代碼, 如果您使用 TypeScript, 請務必先進行編譯然後上傳編譯後的文件夾內容.
    - 如果您使用 ***NPM*** 樣板創建 Colyseus 伺服器, 則 ```npm run build``` 命令會將 require 的所有文件編譯復製到輸出文件夾中.
    - 編譯輸出文件夾 TypeScript: ```lib``` / JavaScript: ```upload```

## 伺服器代碼概述

如果使用的 ```npm run build``` 樣板, 完成上傳後應該會看到如下的目錄結構.

![Arena 代碼樣板](../../images/code-template.jpg)

- **arena.config.js:** 要在此文件中加入房間定義, express 插件以及各種需要在伺服器啟動之前執行的功能. 部署到 Arena Cloud 時, 此文件等同於您本地的 ***index.js***.

*文件 ```arena.config.js``` 舉例:*
```
const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");

/**
 * 匯入房間定義
 */
const { ShootingGalleryRoom } = require("./rooms/ShootingGalleryRoom");

module.exports = Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * 定義房間句柄:
         */
        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);
    },

    initializeExpress: (app) => {
        /**
         * 自定義 express 路由寫在這裏:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * 綁定 @colyseus/monitor
         * 建議使用密碼將這個路由位址保護起來.
         * 詳見: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * 調用 gameServer.listen() 之前需要執行的程式.
         */
    }

});
```
- **arena.env:** 此文件中需要定義應用所需的各種自定義環境變數. 此文件很適合存放開發環境和生產環境的切換開關變數.

*文件 ```arena.env``` 舉例:*
```
NODE_ENV=production
ABC_GAME_MODE=dev
```

- **index.js** 在 Arena Cloud 上托管時, 不使用此文件. 此文件可用於本地開發或自托管. 使用 Arena Cloud 時, 會由專為企業級可擴展性和穩定性而設計的 Colyseus 變更版來初始化 *arena.config.js* 文件.

- **package.json** **NPM** 樣板上的 build 命令會將現有的 package.json 文件復製到分發文件夾中. 此文件用於在伺服器啟動時安裝用戶自定義模組.

- **.npmrc** *(可選)*: 詳見 [使用私有 NPM 托管庫](../../reference/npmrc-custom/)
