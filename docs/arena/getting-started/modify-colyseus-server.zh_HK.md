# 修改現有 Colyseus 伺服器

如果您已擁有 Colyseus 伺服器或最初即使用自託管設定, 則您可能擁有如下所示的伺服器資料夾結構和索引檔案.

### Self-hosted index.ts

![NPM 代碼](../../images/standalone-colyseus-server.jpg)

## Arena Cloud 所需的更改

若要使用 Arena Cloud, 您必須修改上述伺服器代碼以使用目前的 **NPM** Colyseus 樣板. 總體來說, 這些修改對於現有的 0.14 伺服器來說是次要的. 這些更改只需要您將房間定義和自定義快速路由移動到 ```arena.config``` 檔案中. 關於以上示例, 以下是修改伺服器代碼的正確方法.

!!! NOTE
    您會注意到我們不需要對 Arena Cloud 上的傳輸或驅動程式進行定義. 這是因為 Arena Cloud 在後台為您執行大規模託管 Colyseus 伺服器所需的各項必需服務和資料庫. 因此, 您作為開發人員不需要定義 ***presence*** / ***matchmaking*** 驅動程式或部署和託管其所需的資料庫.


### 修改過的 arena.config.ts

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
         * Define your server transports as Legacy WS (legacy)
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

### 修改過的資料夾結構

![NPM 代碼](../../images/new-arena-server-code.jpg)
