# 修改现有 Colyseus 服务器

如果您已经拥有 Colyseus 服务器或在开始时使用自托管设置，则可能拥有如下所示的服务器文件夹结构和索引文件。

### Self-hosted index.ts

{1>NPM Code<1}

## Arena Cloud 所需要的更改

要使用 Arena Cloud，必须修改上述服务器代码以使用当前的 {1>NPM<1} Colyseus 模板。总体来说，这些修改对于现有的 0.14 服务器来说数量很小。这些更改只需要您将房间定义和自定义快速路由移动到 {2>arena.config<2} 文件中。对于上面的示例，修改服务器代码的正确方法如下所示。

!!!注意   
    您会注意到，我们不需要 Arena Cloud 上的传输或驱动程序的定义。这是因为 Arena Cloud 在后台运行为您大规模托管 Colyseus 服务器所需的所有必需服务和数据库。因此，作为开发人员，您不需要定义 {1>{2>presence<2}<1} / {3>{4>matchmaking<4}<3} 驱动程序或部署和托管它们所需的数据库。


### Modified arena.config.ts

\`\`\` import Arena from "@colyseus/arena"; import { monitor } from "@colyseus/monitor"; import { ShootingGalleryRoom } from "./rooms/ShootingGalleryRoom";

const port = Number(process.env.PORT);

export default Arena({ getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {

        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);

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
}); \`\`\`

### 修改后的文件夹结构

{1>NPM Code<1}