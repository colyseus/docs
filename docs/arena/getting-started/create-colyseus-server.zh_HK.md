# 創建新的 Colyseus 服務器

**需求**:

- [下載並安裝 Node.js](https://nodejs.org/) v14.0 或更高版本
- [下載並安裝 Git SCM](https://git-scm.com/downloads)
- [下載並安裝 Visual Studio Code](https://code.visualstudio.com/) (或其他編輯器)

## 從 NPM 模板創建 Colyseus 服務器

使用 `npm init colyseus-app` 命令創建新的 Colyseus 服務器. 您可以選擇 TypeScript (推薦) 和 JavaScript 作為服務器語言. **Arena Cloud** 目前僅支持兩種語言.

```
npm init colyseus-app ./my-colyseus-app
```

![NPM Selection](../../images/arena-app-support.jpg)

- 目前僅支持編譯後的 **TypeScript** 和 **JavaScript (CommonJS)** . *不久後會支持 ESM.*

以下是在 *my-colyseus-app* 為 TypeScript 服務器創建的目錄結構和文件.

![NPM Code](../../images/new-arena-server-code.jpg)

- **index.ts / js:** 此文件用於本地測試或自托管. 為確保 Arena Cloud 兼容性, 我們 ***建議*** 您 ***不要*** 直接對 index 文件進行更改. 服務器托管在 Arena Cloud 上時, 您對此文件的修改和功能更新都不會生效. 做本地測試時可以修改此文件裏面的 Colyseus 服務器端口.

- **arena.config.ts / js:** 可以在此文件中進行修改和功能更新, 以便更好地支持您的遊戲. 請註意在服務器初始化時需要調用的三個核心函數.

```
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * 定義房間句柄:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {
        /**
         * 自定義 express 路由地址:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * 綁定 @colyseus/monitor
         * 建議使用密碼把這個路由地址保護起來.
         * 詳見: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * 在執行 gameServer.listen() 之前自動調用此函數.
         */
    }
```


- **arena.env / development.env:** 這些文件用於管理 Colyseus 服務器的環境變量, 在 Arena Cloud 上托管時, 默認加載 arena.env.

- **lib / upload Folder:** 只有在第一次運行 ```npm run build``` 命令時才會創建此文件夾. 此文件夾包含了需要上傳到 Arena Cloud 的文件, 包括編譯後的 JS 代碼, package.json 和 .env 文件.
