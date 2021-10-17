# 變更現有 Colyseus 伺服器

如果您擁有自己寫好的 Colyseus 伺服器或者剛在自托管伺服器上進行初始化安裝, 那麽伺服器的目錄結構應該是下面那個樣子滴.

### 自托管的 index.ts

![NPM 代碼](../../images/standalone-colyseus-server.jpg)

## Arena Cloud 上的必要變更

要使用 Arena Cloud, 必須變更上述伺服器代碼以使用當前的 **NPM** Colyseus 樣板. 一般來說, 這些變更跟現有的 0.14 版本伺服器差別不大. 只需要您將房間定義和自定義的 express 路由移入 ```arena.config``` 文件中. 比如上面的範例, 應該變更伺服器代碼如下.

!!! NOTE
    9/14/2021 更新: 您可能註意到, 我們不需要在 Arena Cloud 上定義驅動程式. 這是因為 Arena Cloud 在後臺自動對 Colyseus 伺服器所需的各種基礎服務和數據庫進行平衡和縮放. 因此作為開發人員, 您不需要定義 ***presence*** / ***matchmaking*** 這類驅動程式或部署和托管數據庫.


### 變更後的 arena.config.ts

```
import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
//import { WebSocketTransport } from  "@colyseus/ws-transport";
import { ShootingGalleryRoom } from "./rooms/ShootingGalleryRoom";
const port = Number(process.env.PORT);

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {

        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);

    },

    initializeTransport: (options) => {

        return new uWebSocketsTransport({});

        /**
         * 定義伺服器傳輸層協議為原始 WS (舊版)
         */
        // return new WebSocketTransport({
        //     ...options,
        //     pingInterval: 5000,
        //     pingMaxRetries: 3,
        // });
    },

    initializeExpress: (app) => {

        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        console.log(`Listening on ws://localhost:${ port }`)
    }
});
```

### 變更後的目錄結構

![NPM 代碼](../../images/new-arena-server-code.jpg)
