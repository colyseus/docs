# 创建新的 Colyseus 服务器

**需求**:

- [下载并安装 Node.js](https://nodejs.org/) v14.0 或更高版本
- [下载并安装 Git SCM](https://git-scm.com/downloads)
- [下载并安装 Visual Studio Code](https://code.visualstudio.com/) (或其他编辑器)

## 从 NPM 模板创建 Colyseus 服务器

使用 `npm init colyseus-app` 命令创建新的 Colyseus 服务器. 您可以选择 TypeScript (推荐) 和 JavaScript 作为服务器语言. **Arena Cloud** 目前仅支持两种语言.

```
npm init colyseus-app ./my-colyseus-app
```

![NPM Selection](../../images/arena-app-support.jpg)

- 目前仅支持编译后的 **TypeScript** 和 **JavaScript (CommonJS)** . *不久后会支持 ESM.*

以下是在 *my-colyseus-app* 为 TypeScript 服务器创建的目录结构和文件.

![NPM Code](../../images/new-arena-server-code.jpg)

- **index.ts / js:** 此文件用于本地测试或自托管. 为确保 Arena Cloud 兼容性, 我们 ***建议*** 您 ***不要*** 直接对 index 文件进行更改. 服务器托管在 Arena Cloud 上时, 您对此文件的修改和功能更新都不会生效. 做本地测试时可以修改此文件里面的 Colyseus 服务器端口.

- **arena.config.ts / js:** 可以在此文件中进行修改和功能更新, 以便更好地支持您的游戏. 请注意在服务器初始化时需要调用的三个核心函数.

```
    getId: () => "Your Colyseus App",

    initializeTransport: (options) => {
        /**
         * 定义服务器传输层为 uWS (新版)
         */
        return new uWebSocketsTransport({});

        /**
         * 定义服务器传输层为 WS (旧版)
         * 本地开发时如果使用旧版 WS 需提供如下配置,
         * Arena 上并不需要这些配置
         */
        // return new WebSocketTransport({
        //     ...options,
        //     pingInterval: 5000,
        //     pingMaxRetries: 3,
        // });
    },

    initializeGameServer: (gameServer) => {
        /**
         * 定义房间句柄:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {
        /**
         * 自定义 express 路由地址:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * 绑定 @colyseus/monitor
         * 建议使用密码把这个路由地址保护起来.
         * 详见: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * 在执行 gameServer.listen() 之前自动调用此函数.
         */
    }
```


- **arena.env / development.env:** 这些文件用于管理 Colyseus 服务器的环境变量, 在 Arena Cloud 上托管时, 默认加载 arena.env.

- **lib / upload Folder:** 只有在第一次运行 ```npm run build``` 命令时才会创建此文件夹. 此文件夹包含了需要上传到 Arena Cloud 的文件, 包括编译后的 JS 代码, package.json 和 .env 文件.
