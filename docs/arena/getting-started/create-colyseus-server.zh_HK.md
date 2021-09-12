# 建立一個新的 Colyseus 伺服器

**要求**

- [下載並安裝 Node.js ](https://nodejs.org/) v12.0 或更高版本
- [下載並安裝 Git SCM](https://git-scm.com/downloads)
- [下載並安裝 Visual Studio Code](https://code.visualstudio.com/) （或您選擇的其他編輯器）

## 建立 Colyseus 伺服器表單 NPM 樣板

使用 `npm init colyseus-app` 指令生成準系統 Colyseus 伺服器. 您可以選擇 TypeScript（推薦）和 JavaScript 作為伺服器語言. **Arena Cloud** 目前僅支持這兩種語言.

``` npm init colyseus-app ./my-colyseus-app ```

以下是在 *my-colyseus-app* 目錄中為 TypeScript 伺服器建立的預期資料夾結構和檔案.

![NPM 代碼](../../images/new-arena-server-code.jpg)

- **index.ts / js:** 此檔案用於本機測試或自託管. 為確保 Arena Cloud 的相容性, 我們 ***建議*** 您 ***不*** 直接對索引檔案進行更改. 當您的伺服器託管在 Arena Cloud 上時, 此處新增的更改或功能將不會反映出來. 對於本機測試, 您可以修改此檔案以更改 Colyseus 伺服器埠口.

- **arena.config.ts / js:** 您可以在此檔案中進行新增和修改以支援您的遊戲. 請注意將在遊戲伺服器初始化期間調用的三個核心函數.

```
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
```

- **arena.env / development.env:** 相關檔案可用於管理 Colyseus 伺服器的環境變數, 在 Arena Cloud 上託管時, arena.env 將預設載入.

- **lib / upload Folder:** 只有在第一次執行 ```npm run build``` 後才會建立此資料夾. 其中包含需要上傳到 Arena Cloud 的編譯後 JS 代碼、package.json 和 .env 檔案.
