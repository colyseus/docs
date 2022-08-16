# 网络界面

### 要求

* [已完成创建](../create-application/) Arena 应用部署.

## 上传您的代码
在应用仪表板的左下角, 点选 **Server Code (服务器代码)**, 可以使用网页集成 IDE 和 上传功能.

![Arena 应用管理界面](../../images/edit-server-code.jpg)

在此界面上, 您可以 **CREATE (创建)**, **DELETE (删除)**, **UPLOAD (上传)** 代码并将代码 **DEPLOY (部署)** 到游戏服务器中. 点选 **Upload (上传)** 打开对话框, 在这里可以选择上传单个文件还是整个文件夹.

![Arena 应用管理界面](../../images/upload-dialog.jpg)

!!! NOTE
    - Arena 应用 **仅支持** 已编译的 Javascript 代码, 如果您使用 TypeScript, 请务必先进行编译然后上传编译后的文件夹内容.
    - 如果您使用 ***NPM*** 模板创建 Colyseus 服务器, 则 ```npm run build``` 命令会将 require 的所有文件编译复制到输出文件夹中.
    - 编译输出文件夹 TypeScript: ```lib``` / JavaScript: ```upload```

## 服务器代码概述

如果使用的 ```npm run build``` 模板, 完成上传后应该会看到如下的目录结构.

![Arena 代码模板](../../images/code-template.jpg)

- **arena.config.js:** 要在此文件中加入房间定义, express 插件以及各种需要在服务器启动之前运行的功能. 部署到 Arena Cloud 时, 此文件等同于您本地的 ***index.js***.

*文件 ```arena.config.js``` 举例:*
```
const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");

/**
 * 导入房间定义
 */
const { ShootingGalleryRoom } = require("./rooms/ShootingGalleryRoom");

module.exports = Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * 定义房间句柄:
         */
        gameServer.define('ShootingGalleryRoom', ShootingGalleryRoom);
    },

    initializeExpress: (app) => {
        /**
         * 自定义 express 路由写在这里:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * 绑定 @colyseus/monitor
         * 建议使用密码将这个路由地址保护起来.
         * 详见: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * 调用 gameServer.listen() 之前需要执行的程序.
         */
    }

});
```
- **arena.env:** 此文件中需要定义应用所需的各种自定义环境变量. 此文件很适合存放开发环境和生产环境的切换开关变量.

*文件 ```arena.env``` 举例:*
```
NODE_ENV=production
ABC_GAME_MODE=dev
```

- **index.js** 在 Arena Cloud 上托管时, 不使用此文件. 此文件可用于本地开发或自托管. 使用 Arena Cloud 时, 会由专为企业级可扩展性和稳定性而设计的 Colyseus 修改版来初始化 *arena.config.js* 文件.

- **package.json** **NPM** 模板上的 build 命令会将现有的 package.json 文件复制到分发文件夹中. 此文件用于在服务器启动时安装用户自定义模块.

- **.npmrc** *(可选)*: 详见 [使用私有 NPM 托管库](../../reference/npmrc-custom/)
