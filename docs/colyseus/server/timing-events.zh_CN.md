# 服务器 API  &raquo; 计时器事件

对于 [计时器事件](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),
建议使用 `Room` 实例提供的 [`this.clock`](/server/room/#clock-clocktimer) 的功能.

!!! Tip
    当 `Room` 被销毁时,
    注册在 [`this.clock`](/server/room/#clock-clocktimer) 上的重复计时器和超时计时器
    都会被自动清除.

!!! Warning "注意"
    JS 自带的 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
    和
    [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
    方法依赖 CPU 负载, 执行延迟可能并不准确.

## Clock

在状态同步事件机制之外, Clock 提供了另一种有用的机制. 举一个案例: 当一名玩家获得一个可收集品后, 可以用 `clock.setTimeout` 来刷新这个物品. 使用 `clock.` 的好处就在于无须关心房间状态更新变化, 可以专注计时程序而脱离状态机制.

### 公开方法

*注意: `time` 参数以毫秒为单位*

#### `clock.setInterval(callback, time, ...args):Delayed`

`setInterval()` 方法会重复调用一个函数或执行一个代码段,
每次调用之间有固定的时间间隔.
它返回 [`Delayed`](#delayed) 实例作为 id, 以便后续操控.

#### `clock.setTimeout(callback, time, ...args):Delayed`

`setTimeout()` 方法会设置一个定时器,
定时器到期时会执行一个函数或指定的代码段.
它返回 [`Delayed`](#delayed) 实例作为 id, 以便后续操控.

**示例**

此 MVP 示例展示的功能有: `setInterval()`, `setTimeout` 及清理之前储存的 `Delayed` 实例; 使用房间时钟显示当前时间.
每一秒钟 'Time now ' + `this.clock.currentTime` 被 `console.log` 打印出来, 之后再过 10 秒清理计时器: `this.delayedInterval.clear();`.

```typescript fct_label="TypeScript"
// 导入 Delayed
import { Room, Client, Delayed } from "colyseus";

export class MyRoom extends Room {
    // 这个例子中
    public delayedInterval!: Delayed;

    // 房间初始化时
    onCreate(options: any) {
        // 时钟开始计时
        this.clock.start();

        // 设置间隔计时并保存其引用
        // 以便后续清理工作
        this.delayedInterval = this.clock.setInterval(() => {
            console.log("Time now " + this.clock.currentTime);
        }, 1000);

        // 10 秒过后清理计时器;
        // 这会让计时器 *停止并销毁*
        this.clock.setTimeout(() => {
            this.delayedInterval.clear();
        }, 10_000);
    }
}
```

#### `clock.clear()`

使用 `clock.setInterval()` 和 `clock.setTimeout()` 清除所有已注册的间隔计时器和超时计时器.

#### `clock.start()`

开始计时.

#### `clock.stop()`

停止计时.

#### `clock.tick()`

模拟时间步. 每次 `tick` 期间会遍历所有 `Delayed` 实例.

!!! tip
    更多详情参见 [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166).

### 公开属性

#### `clock.elapsedTime`

在 [`clock.start()`](#clockstart) 方法被调用后经过的时间, 以毫秒计. 只读.

#### `clock.currentTime`

当前时间, 以毫秒计. 只读.

#### `clock.deltaTime`

当前`clock.tick()`调用与上次调用之间经过的时间, 以毫秒计. 只读.

## Delayed

由 [`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed)
或 [`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) 方法
所创建的延迟实例.

### 公开方法

#### `delayed.pause()`

在指定 `Delayed` 实例上暂停计时. (`elapsedTime` 不再增加, 直到调用 `.resume()`.)

#### `delayed.resume()`

在指定 `Delayed` 实例上恢复计时. (`elapsedTime` 将会继续正常增加)

#### `delayed.clear()`

清除超时计时或间隔计时

#### `delayed.reset()`

重置计时器

### 公开属性

#### `delayed.elapsedTime: number`

`Delayed` 实例记录的时间, 自开始计时起, 以毫秒计.

#### `delayed.active: boolean`

如果计时器在工作中, 则返回 `true`.

#### `delayed.paused: boolean`

如果计时器已用 `.pause()` 暂停工作, 则返回 `true`.


