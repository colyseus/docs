# 网页界面

### 要求

* [Created](../create-application/) Arena 应用部署.

## 上传您的代码
在应用仪表板的左下角, 选择 **Server Code（服务器代码）**, 可以以访问集成的 Web IDE 和 上传器.

![Arena 应用管理视图](../../images/edit-server-code.jpg)

在此屏幕上, 您可以 **CREATE（创建）**、**DELETE（删除）**、**UPLOAD（上传）** 代码并将代码 **DEPLOY（部署）** 到部署游戏服务器队列. 选择 **Upload（上传）** 打开对话框, 在这里可以选择上传单个文件或文件夹.

![Arena 应用管理视图](../../images/upload-dialog.jpg)

!!! NOTE
    - Arena 应用 **仅支持** 已编译的 Javascript 代码, 如果您使用 TypeScript, 请务必先构建您的代码并上传构建文件夹的内容.
    - 如果您使用 ***NPM*** 模板创建 Colyseus 服务器, 则 ``` npm run build ``` 命令将编译所有需要的文件, 并将其复制到输出文件夹.
    - TypeScript 的构建输出文件夹: ``` lib ``` / JavaScript: ``` upload ```

## 服务器代码概述

完成上传后, 如果使用 ``` npm run build ``` 模板, 应该会看到以下文件和文件夹结构.

![Arena 代码模板](../../images/code-template.jpg)

- **arena.config.js:** 应该在此文件中添加房间声明、快速加载项以及在服务器启动之前需要调用的任何其他函数. 将应用部署到 Arena Cloud 时, 应将此文件视为您的 ***index.js***.

*File ```arena.config.js``` Example:*
```
const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");

/**
 * Import your Room files
 */
const { ShootingGalleryRoom } = require("./rooms/ShootingGalleryRoom");

module.exports = Arena({
    getId: () => "Your Colyseus App",

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

});
```
- **arena.env:** 在此文件中, 您将定义应用所需的任何自定义环境变量. 此文件可用于存储分离的开发和生产环境的密钥.

*File ```arena.env``` Example:*
```
NODE_ENV=production
ABC_GAME_MODE=dev
```

- **index.js** 在 Arena Cloud 上托管时, 不使用此文件. 此文件可用于本地开发托管或自托管. 使用 Arena Cloud 时, 您的 *arena.config.js* 将由专门为了企业级可扩展性和稳定性而设计的 Colyseus 开源修改版本初始化.

- **package.json** **NPM** 模板上的构建命令将现有的 package.json 复制到分发文件夹中. 此文件用于在游戏服务器启动时安装用户定义的模块.

- **.npmrc** *（可选）* :参见 [Using a Private NPM Repository（使用私有 NPM 存储库）](../../reference/npmrc-custom/)
