# 建立一個新的 Colyseus 伺服器

\##要求

- {1>下載並安裝 Node.js <1} v12.0 或更高版本
- {1>下載並安裝 Git SCM<1}
- {1>下載並安裝 Visual Studio Code<1}（或您選擇的其他編輯器）

## 建立 Colyseus 伺服器表單 NPM 樣板

使用 {1>npm init colyseus-app<1} 命令生成準系統 Colyseus 伺服器。您可以選擇 TypeScript（推薦）和 JavaScript 作為伺服器語言。{2>Arena Cloud<2} 目前僅支持這兩種語言。

{1> npm init colyseus-app ./my-colyseus-app <1}

以下是在 {1>my-colyseus-app<1} 目錄中為 TypeScript 伺服器建立的預期資料夾結構和檔案。

{1>NPM 代碼<1}

- {1>index.ts / js:<1}此檔案用於本機測試或自託管。為確保 Arena Cloud 的相容性，我們{2>{3>建議<3}<2}您{4>{5>不<5}<4}直接對索引檔案進行更改。當您的伺服器託管在 Arena Cloud 上時，此處新增的更改或功能將不會反映出來。對於本機測試，您可以修改此檔案以更改 Colyseus 伺服器埠口。

- {1>arena.config.ts / js:<1}您可以在此檔案中進行新增和修改以支援您的遊戲。請注意將在遊戲伺服器初始化期間調用的三個核心函數。 

\`\`\` getId: () => "Your Colyseus App",

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
\`\`\`

- {1>arena.env / development.env:<1}相關檔案可用於管理 Colyseus 伺服器的環境變數，在 Arena Cloud 上託管時，arena.env 將預設載入。

- {1>lib / upload Folder:<1}只有在第一次執行 {2>npm run build<2} 後才會建立此資料夾。其中包含需要上傳到 Arena Cloud 的編譯後 JS 代碼、package.json 和 .env 檔案。