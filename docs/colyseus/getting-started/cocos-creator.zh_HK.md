# Cocos Creator 3 

[Cocos Creator](https://cocos.com/creator) 是一款跨平台2D/3D游戏创作工具。

用于 Cocos Creator 的 Colyseus SDK 与 [JavaScript SDK](/getting-started/javascript-client/) 相同。主要区别在于如通过 Cocos Creator [从 TypeScript 组件中将其导入](#importing-from-the-extension)。

!!! tip "Looking for an example?" 查看[Tic Tac Toe 示例](https://github.com/colyseus/cocos-demo-tictactoe)。

## 1\.安装扩展

- [打开 Cocos Store](https://store.cocos.com/app/en/detail/2937/)（菜单："Extension" » "Store"）
- 搜索"Colyseus SDK"
- 获取扩展

## 2\.更新你的 `tsconfig.json` 文件

确保你在 `"compilerOptions"` 下拥有`"esModuleInterop": true`：

\`\`\`json // ...

  /* 在这里添加你的自定义配置。 \*/ "compilerOptions": { // ... "esModuleInterop": true // ... } // ... \`\`\`

## 3\.从扩展中导入

你必须从其扩展路径中导入 Colyseus：

```typescript import Colyseus from 'db://colyseus-sdk/colyseus.js'; ```

下面是一个更详细的示例，你可以复制并粘贴到您的项目中。

将下方内容以 `NetworkManager.ts` 保存在你的 `assets` 文件夹下。

\`\`\`typescript import { \_decorator, Component, Node } from 'cc'; const { ccclass, property } = \_decorator;

import Colyseus from 'db://colyseus-sdk/colyseus.js';

@ccclass('NetworkManager') export class NetworkManager extends Component { @property hostname = "localhost"; @property port = 2567; @property useSSL = false;

    client!: Colyseus.Client;
    room!: Colyseus.Room;

    start () {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);

        // Connect into the room
        this.connect();
    }

    async connect() { 
        try {
            this.room = await this.client.joinOrCreate("my_room");

            console.log("joined successfully!");
            console.log("user's sessionId:", this.room.sessionId);

            this.room.onStateChange((state) => {
                console.log("onStateChange: ", state);
            });

            this.room.onLeave((code) => {
                console.log("onLeave:", code);
            });

        } catch (e) {
            console.error(e);
        }
    }
} \`\`\`

你现在可以将 `NetworkManager` 作为附件附加到任何来自 Cocos Creator 的节点。 

因为我们是用上面的 `@property` 装饰器，你可以从 Cocos Creator 编辑器编辑`hostname`、`port`和`useSSL`：

![Colyseus SDK on TypeScript Component](cocos-creator-component.png)


---

## 替代品：如何将 `colyseus.js` 文件手动添加至你的项目（无扩展情况下）

- [从 GitHub 下载最新 `colyseus-js-client.zip`](https://github.com/colyseus/colyseus.js/releases)。
- 解压`colyseus-js-client.zip` 文件到 `assets/`文件夹。
- 移动 `olyseus.js` 和 `colyseus.d.ts` 文件到你的 Cocos Creator 项目的 `scripts` 文件夹。
- 从资产面板点击`colyseus.js` 文件，启用"Import As Plugin"（见下图）
- **JypeScript**: require it using `import Colyseus from "./colyseus.js";`
- **JavaScript**: require it using `const Colyseus = require("./colyseus.js");`

![Import as plugin](cocos-creator-import-as-plugin.png)}
