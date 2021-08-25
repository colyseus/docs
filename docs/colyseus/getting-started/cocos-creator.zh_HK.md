# Cocos Creator 3 

{1>Cocos Creator<1} 是一款跨平台2D/3D游戏创作工具。

用于 Cocos Creator 的 Colyseus SDK 与 {1>JavaScript SDK<1} 相同。主要区别在于如通过 Cocos Creator {2>从 TypeScript 组件中将其导入<2}。

!!! tip "Looking for an example?" 查看{1>Tic Tac Toe 示例<1}。

## {1}安装扩展

- {1>打开 Cocos Store<1}（菜单："Extension" » "Store"）
- 搜索"Colyseus SDK"
- 获取扩展

## {1}更新你的 {1>tsconfig.json<1} 文件

确保你在 {2>"compilerOptions"<2} 下拥有{1>"esModuleInterop": true<1}：

\`\`\`json // ...

  /* 在这里添加你的自定义配置。 \*/ "compilerOptions": { // ... "esModuleInterop": true // ... } // ... \`\`\`

## {1}从扩展中导入

你必须从其扩展路径中导入 Colyseus：

{1>typescript import Colyseus from 'db://colyseus-sdk/colyseus.js'; <1}

下面是一个更详细的示例，你可以复制并粘贴到您的项目中。

将下方内容以 {1>NetworkManager.ts<1} 保存在你的 {2>assets<2} 文件夹下。

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

你现在可以将 {1>NetworkManager<1} 作为附件附加到任何来自 Cocos Creator 的节点。 

因为我们是用上面的 {1>@property<1} 装饰器，你可以从 Cocos Creator 编辑器编辑{2>hostname<2}、{3>port<3}和{4>useSSL<4}：

{1>Colyseus SDK on TypeScript Component<1}


---

## 替代品：如何将 {1>colyseus.js<1} 文件手动添加至你的项目（无扩展情况下）

- {1>从 GitHub 下载最新 {2>colyseus-js-client.zip<2}<1}。
- 解压{1>colyseus-js-client.zip<1} 文件到 {2>assets/<2}文件夹。
- 移动 {1>colyseus.js<1} 和 {2>colyseus.d.ts<2} 文件到你的 Cocos Creator 项目的 {3>scripts<3} 文件夹。
- 从资产面板点击{1>colyseus.js<1} 文件，启用"Import As Plugin"（见下图）
- {1>TypeScript<1}: require it using {2>import Colyseus from "./colyseus.js";<2}
- {1>JavaScript<1}: require it using {2>const Colyseus = require("./colyseus.js");<2}

{1>Import as plugin<1}
