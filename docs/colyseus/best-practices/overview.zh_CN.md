# 最佳實踐和建議

!!!注意「工作進行中」此文件頁面不完整

本節提供一般建議和最佳實踐，以確保您的代碼庫保持健康並對您的團隊保持可讀性。相關建議和實踐可有可無，但如果遵循相關建議和實踐則可提高代碼的可讀性和清潔度。

- 將您的房間等級盡可能縮小，將遊戲的特定功能委託給其他可組合結構。
- 使同步化的資料結構盡可能縮小
    - 理想情況下，各個擴展`架構`的類別應該只有欄位定義。
    - 可實作自定義的 getter 和 setter 方法，只要其中沒有遊戲邏輯即可。
- 您的遊戲邏輯應由其他結構處理，例如：
    - [命令模式](#the-command-pattern)
    - [實體-組件系統](#entity-component-system-ecs)。

## 單元測試

> TODO：我們需要提供一個 `@colyseus/測試` 套件，以輕鬆模擬`房間`類別並觸發其生命週期事件，以及建立虛擬客戶端。

## 設計模式

### 命令模式

**為什麼？**

- 模型 ([`@colyseus/架構`](https://github.com/colyseus/schema))主要應包含資料，沒有繁重的遊戲邏輯。
- 房間應該有盡可能少的代碼，並將動作轉發到其他結構

**命令模式有幾個優點，例如：**

- 其將調用操作的類別與知道如何執行操作的物件分離。
- 它能讓您透過提供隊列系統來建立命令序列。
- 實作擴展以新增新命令很容易，無需更改現有代碼即可完成。
- 嚴格控制叫用命令的方式和時間。
- 提高代碼可讀性和單元測試的可能性。

#### 使用方式

安裝

``` npm install --save @colyseus/command ```

在您的房間實現中初始化`調派程式`：

\`\`\`typescript fct\_label="TypeScript" import { Room } from "colyseus"; import { Dispatcher } from "@colyseus/command";

import { OnJoinCommand } from "./OnJoinCommand";

class MyRoom extends Room<YourState> { dispatcher = new Dispatcher(this);

  onCreate() { this.setState(new YourState()); }

  onJoin(client, options) { this.dispatcher.dispatch(new OnJoinCommand(), { sessionId: client.sessionId }); }

  onDispose() { this.dispatcher.stop(); } } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require("colyseus"); const command = require("@colyseus/command");

const OnJoinCommand = require("./OnJoinCommand");

class MyRoom extends colyseus.Room {

  onCreate() { this.dispatcher = new command.Dispatcher(this); this.setState(new YourState()); }

  onJoin(client, options) { this.dispatcher.dispatch(new OnJoinCommand(), { sessionId: client.sessionId }); }

  onDispose() { this.dispatcher.stop(); } } \`\`\`

命令實作看起來像這樣：

\`\`\`typescript fct\_label="TypeScript" // OnJoinCommand.ts import { Command } from "@colyseus/command";

export class OnJoinCommand extends Command<YourState, { sessionId: string }> {

  execute({ sessionId }) { this.state.players\[sessionId] = new Player(); }

} \`\`\`

\`\`\`typescript fct\_label="JavaScript" // OnJoinCommand.js const command = require("@colyseus/command");

exports.OnJoinCommand = class OnJoinCommand extends command.Command {

  execute({ sessionId }) { this.state.players\[sessionId] = new Player(); }

} \`\`\`

#### 深入瞭解

- 請參閱[命令定義](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- [使用方式](https://github.com/colyseus/command/blob/master/test/Test.ts)
- 請參閱[實作](https://github.com/colyseus/command/blob/master/src/index.ts)

### 實體組件系統 (ECS)

我們目前沒有正式的 ECS（實體組件系統），儘管我們已經看到社群成員實作其自己專屬的解決方案。

!!!警告「非常實驗性」一些工作[已開始嘗試將 ECSY 與 @colyseus/架構](http://github.com/endel/ecs) 結合起來。
