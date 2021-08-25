# Cocos Creator 3 

{1>Cocos Creator<1} 是一款跨平台的 2D/3D 遊戲創作工具。

Colyseus SDK for Cocos Creator 的運作方式與 {1>JavaScript SDK<1} 相同。主要區別在於如何{2>從 Cocos Creator 的 TypeScript 組件<2}資產中匯入它。

!!! 提示「尋找一個例子？」 查看{1>井字遊戲示例<1}。

## {1}安裝擴充功能

- {1>打開 Cocos 商店<1} (Menu:"Extension" » "Store")
- 搜尋「Colyseus SDK」
- 獲取擴充功能

## {1}更新您的 {1>tsconfig.json<1} 檔案

確保在 {2>"compilerOptions"<2} 下有 {1>"esModuleInterop": true<1}：

\`\`\`json // ...

  /* 在此處新增您的自訂配置。\*/ "compilerOptions": { // ... "esModuleInterop": true // ... } // ... \`\`\`

## {1}從擴充功能匯入

您必須從其擴充路徑匯入 Colyseus：

{1>typescript import Colyseus from 'db://colyseus-sdk/colyseus.js'; <1}

以下是一個更詳細的示例，您可以將其複制並粘貼到您的專案中。

將以下內容另存為 {2>assets<2} 資料夾下的 {1>NetworkManager.ts<1}。

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

您現在可以從 Cocos Creator 將 {1>NetworkManager<1} 作為組件附加到任何節點上。 

因為我們使用了上面的 {1>@property<1} 裝飾器，所以您可以從 Cocos Creator 編輯器中編輯 {2>hostname<2}、{3>port<3} 和 {4>useSSL<4}：

{1>Colyseus SDK on TypeScript Component<1}


---

## 選擇：如何手動將 {1>colyseus.js<1} 檔案新增到您的專案中（不帶擴充功能）

- {1>從 GitHub 下載 {2>colyseus-js-client.zip<2} 的最新版本<1}。
- 將 {1>colyseus-js-client.zip<1} 檔案解壓縮到 {2>assets/<2} 資料夾中。
- 將 {1>colyseus.js<1} 和 {2>colyseus.d.ts<2} 檔案移動到 Cocos Creator 專案的 {3>scripts<3} 資料夾中。
- 點擊「資產」面板中的 {1>colyseus.js<1} 檔案，並啟用「作為外掛程式匯入」（見下圖）
- {1>TypeScript<1}: 使用 {2>import Colyseus from "./colyseus.js" 來取得該檔案 ;<2}
- {1>JavaScript<1}: 使用 {2>const Colyseus = require("./colyseus.js");<2} 來取得該檔案

{1>作為外掛程式匯入<1}
