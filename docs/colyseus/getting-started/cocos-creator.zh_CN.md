# Cocos Creator 3 

[Cocos Creator](https://cocos.com/creator) 是一款跨平台的 2D/3D 遊戲創作工具。

Colyseus SDK for Cocos Creator 的運作方式與 [JavaScript SDK](/getting-started/javascript-client/) 相同。主要區別在於如何[>從 Cocos Creator 的 TypeScript 組件](#importing-from-the-extension)資產中匯入它。

!!! 提示「尋找一個例子？」 查看[井字遊戲示例](https://github.com/colyseus/cocos-demo-tictactoe)}。

## 1\.安裝擴充功能

- [打開 Cocos 商店](https://store.cocos.com/app/en/detail/2937/) (Menu:"Extension" » "Store")
- 搜尋「Colyseus SDK」
- 獲取擴充功能

## 2\.更新您的 `tsconfig.json` 檔案

確保在 `"compilerOptions"` 下有 `"esModuleInterop": true`：

\`\`\`json // ...

  /* 在此處新增您的自訂配置。\*/ "compilerOptions": { // ... "esModuleInterop": true // ... } // ... \`\`\`

## 3\.從擴充功能匯入

您必須從其擴充路徑匯入 Colyseus：

```typescript import Colyseus from 'db://colyseus-sdk/colyseus.js'; ```

以下是一個更詳細的示例，您可以將其複制並粘貼到您的專案中。

將以下內容另存為 `assets` 資料夾下的 `NetworkManager.ts`。

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

您現在可以從 Cocos Creator 將 `NetworkManager` 作為組件附加到任何節點上。 

因為我們使用了上面的 `@property` 裝飾器，所以您可以從 Cocos Creator 編輯器中編輯 `hostname`、`port` 和 `useSSL`：

![Colyseus SDK on TypeScript Component](cocos-creator-component.png)


---

## 選擇：如何手動將 `colyseus.js` 檔案新增到您的專案中（不帶擴充功能）

- [從 GitHub 下載 `colyseus-js-client.zip` 的最新版本](https://github.com/colyseus/colyseus.js/releases)。
- 將 `colyseus-js-client.zip` 檔案解壓縮到 `assets/` 資料夾中。
- 將 `colyseus.js` 和 `colyseus.d.ts` 檔案移動到 Cocos Creator 專案的 `scripts` 資料夾中。
- 點擊「資產」面板中的 `colyseus.js` 檔案，並啟用「作為外掛程式匯入」（見下圖）
- **TypeScript**: 使用 `import Colyseus from "./colyseus.js" 來取得該檔案 ;`
- **JavaScript**: 使用 `const Colyseus = require("./colyseus.js");` 來取得該檔案

![作為外掛程式匯入](cocos-creator-import-as-plugin.png)
