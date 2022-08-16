# 最佳实践和建议

本节提供一般建议和最佳惯例, 以确保您的代码库对您的团队来说是健康和可读的. 这些建议和最佳惯例都是可选的, 如果遵循它们, 将提高代码的可读性和整洁性.

- 您的房间应尽可能保持低等级, 而将特定于游戏的功能委托给其他可组合结构.
- 可同步的数据结构应尽可能较小
    - 理想情况下, 每个扩展 `Schema` 的类应该只有字段定义.
    - 避免在 `Schema` 结构中实现 _大量_ 逻辑代码. _少量_ 逻辑可以接受, 尤其是结构范围内的, 只维护自身属性的代码.
- 房间代码应尽可能少, 用以操作其他结构.
- 应该由其他结构处理游戏逻辑, 例如:
    - 自定义外部函数.
    - [命令模式](#the-command-pattern).
    - 一种 [实体-组件系统](#entity-component-system-ecs).

## 单元测试

请参考 [这里](/colyseus/tools/unit-testing/) 了解单元测试. 使用 `npm init colyseus-app` 初始化的应用自带测试模板, 可根据需求自行修改.

## 设计模式

### 命令模式

命令模式具有多项优势, 例如:

- 它将调用操作的类与知道如何执行操作的对象进行分离.
- 它允许通过提供队列系统来创建命令序列.
- 很容易实现扩展以添加新命令,无需更改现有代码即可完成.
- 严格控制调用命令的方式和时间.
- 提高代码可读性和单元测试可能性.

#### 用法

安装

```
npm install --save @colyseus/command
```

在房间实现中初始化 `dispatcher`:

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

命令实现看起来是这样的:

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

#### 参阅更多

- 参考 [command definitions](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- 参考 [用法](https://github.com/colyseus/command/blob/master/test/Test.ts)
- 参考 [implementation](https://github.com/colyseus/command/blob/master/src/index.ts)

### 实体组件系统 (ECS)

目前我们没有正式的 ECS(实体组件系统),尽管我们已经看到社区成员实现了他们自己的解决方案.

!!! Warning "试验中的功能"
    某些作品 [已经开始尝试将 ECSY 与 @colyseus/schema 相结合](http://github.com/endel/ecs).
