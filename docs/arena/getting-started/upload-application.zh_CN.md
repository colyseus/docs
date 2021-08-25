# 網頁介面

### 相關要求

* {1>建立<1} Arena 應用程式部署。

## 上傳您的代碼
在應用程式儀表板的左下角，選擇{1>伺服器代碼<1}，以存取整合的 Web IDE 和 Uploader。 

{1>Arena 應用程式管理視圖<1}

在此畫面中，您可以將代碼{1>建立<1}、{2>刪除<2}、{3>上傳<3}和{4>部署<4} 到您的部署遊戲伺服器隊列。選擇{5>上傳<5}可開啟對話框，您可以從這裡選擇上傳單一檔案或上傳資料夾。 

{1>Arena 應用程式管理視圖<1}

!!!請注意 - Arena 應用程式{1>僅支援<1}編譯後的 Javascript 代碼。如果您使用 TypeScript，請務必先建置您的代碼並上傳建置資料夾的內容。 - 如果您使用 {2>{3>NPM<3}<2} 樣板建立 Colyseus 伺服器，則 {4> npm run build <4} 命令將編譯所有必要的檔案並將其複製到您的輸出資料夾中。 - 為 TypeScript 建置輸出資料夾：{5> lib <5} / JavaScript：{6> upload <6}

## 伺服器代碼概覽

完成上傳後，如果您使用 {1> npm run build <1} 模板，您應該會看到以下檔案和資料夾結構。 

{1>Arena 代碼樣板<1}

- {1>arena.config.js:<1}您應該在此檔案中新增房間聲明、快速加載項以及在伺服器啟動之前需要調用的任何其他函數。將應用程序部署到 Arena Cloud 時，將此視為您的 {2>{3>index.js<3}<2}。

{1>File {2>arena.config.js<2} Example:<1} \`\`\` const Arena = require("@colyseus/arena").default; const { monitor } = require("@colyseus/monitor");

/\** * 匯入您的房間檔案 \*/ const { ShootingGalleryRoom } = require("./rooms/ShootingGalleryRoom");

module.exports = Arena({ getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);
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

}); \`\`\` - {1>arena.env:<1}在此檔案中，您將定義應用程式所需的任何自定義環境變數。這將是一個很好的檔案，因為它可用於儲存分隔開發和生產環境的密鑰。

{1>檔案 {2>arena.env<2} 示例：<1}{3> NODE\_ENV=production ABC\_GAME\_MODE=dev <3}

 - {1>index.js<1} 在 Arena Cloud 上託管時不使用此檔案。此檔案有助於本機開發託管或自託管。使用 Arena Cloud 時，您的 {2>arena.config.js<2} 將由專為企業級可擴展性和穩定性設計的 Colyseus 開源的修改版本初始化。

 - {1>package.json<1} {2>NPM<2} 樣板上的建置命令將您現有的 package.json 複製到分發資料夾中。此檔案用於在遊戲伺服器啟動時安裝使用者定義的模組。

- {1>.npmrc<1} {2>（可選）<2}：請參閱{3>使用私有 NPM 儲存庫<3}