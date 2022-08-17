# 最佳實踐和建議

本節提供一般建議和最佳實踐, 以確保您的代碼庫保持健康並對您的團隊保持可讀性. 相關建議和實踐可有可無, 但如果遵循相關建議和實踐則可提高代碼的可讀性和清潔度.

- 您的房間應盡可能保持低等級, 而將特定於遊戲的功能委托給其他可組合結構.
- 可同步的數據結構應盡可能較小
    - 理想情況下, 每個擴展 `Schema` 的類應該只有字段定義.
    - 避免在 `Schema` 結構中實現 _大量_ 邏輯代碼. _少量_ 邏輯可以接受, 尤其是結構範圍內的, 只維護自身屬性的代碼.
- 房間代碼應盡可能少, 用以操作其他結構.
- 應該由其他結構處理遊戲邏輯, 例如:
    - 自定義外部函數.
    - [命令模式](#the-command-pattern).
    - 一種 [實體-組件系統](#entity-component-system-ecs).

## 單元測試

請參考 [這裏](/colyseus/tools/unit-testing/) 了解單元測試. 使用 `npm init colyseus-app` 初始化的應用自帶測試模板, 可根據需求自行修改.

## 設計模式

### 指令模式

指令模式有幾個優點,例如:

- 其將調用操作的類別與知道如何執行操作的物件分離.
- 它能讓您透過提供隊列系統來建立指令序列.
- 實作擴展以新增新指令很容易,無需更改現有代碼即可完成.
- 嚴格控制叫用指令的方式和時間.
- 提高代碼可讀性和單元測試的可能性.

#### 使用方式

安裝

```
npm install --save @colyseus/command
```

在您的房間實現中初始化 `dispatcher`:

```typescript fct_label="TypeScript"
import { Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";

import { OnJoinCommand } from "./OnJoinCommand";

class MyRoom extends Room<YourState> {
  dispatcher = new Dispatcher(this);

  onCreate() {
    this.setState(new YourState());
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
        sessionId: client.sessionId
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const command = require("@colyseus/command");

const { OnJoinCommand } = require("./OnJoinCommand");

class MyRoom extends colyseus.Room {

  onCreate() {
    this.dispatcher = new command.Dispatcher(this);
    this.setState(new YourState());
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
        sessionId: client.sessionId
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
```

指令實作看起來像這樣:

```typescript fct_label="TypeScript"
// OnJoinCommand.ts
import { Command } from "@colyseus/command";

export class OnJoinCommand extends Command<MyRoom, {
    sessionId: string
}> {

  execute({ sessionId }) {
    this.state.players[sessionId] = new Player();
  }

}
```

```typescript fct_label="JavaScript"
// OnJoinCommand.js
const command = require("@colyseus/command");

exports.OnJoinCommand = class OnJoinCommand extends command.Command {

  execute({ sessionId }) {
    this.state.players[sessionId] = new Player();
  }

}
```

#### 深入瞭解

- 請參閱[指令定義](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- 請參閱[使用方式](https://github.com/colyseus/command/blob/master/test/Test.ts)
- 請參閱[實作](https://github.com/colyseus/command/blob/master/src/index.ts)

### 實體組件系統 (ECS)

我們目前沒有正式的 ECS(實體組件系統),儘管我們已經看到社群成員實作其自己專屬的解決方案.

!!! Warning "试验中的功能"
    一些工作 [已開始嘗試將 ECSY 與 @colyseus/架構](http://github.com/endel/ecs) 結合起來.
