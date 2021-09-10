# 服务器 API » 定时事件

对于 [定时事件](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),建议在您的 `Room](/server/room/#clock-clocktimer) 实例中使用 [this.clock`方法.

!!!提示：当 `Room` 被释放时,注册在 [`this.clock`](/server/room/#clock-clocktimer) 上的全部间隔和超时都会被自动清除.

!!!警告 "重要"：内置 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) 和 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 方法依赖 CPU 负载,这可能导致意外的执行延迟时间.

## 时钟

提供了有用的时钟机制,用于为状态性模拟之外的事件计时.举一个使用案例：当一名玩家收集一件物品时,您可能 `clock.setTimeout` 以创建一个新的可收集物.使用 `clock.` 的一个好处在于您无须担心房间更新和增量,相反,您可以专注于为房间状态的每个事件单独计时.

### 公用方法

*备注： `time` 参数以毫秒为单位*

#### `clock.setInterval(callback, time, ...args):Delayed`

`setInterval()` 方法会反复调用一个函数或执行一个代码段,每次调用之间有固定的时间延迟.它将返回识别间隔的 [`Delayed`](#delayed) 实例,以便您之后进行操控.

#### `clock.setTimeout(callback, time, ...args):Delayed`

`setTimeout()` 方法会设置一个定时器,定时器到期时会执行一个函数或特定代码段.它将返回识别间隔的 [`Delayed`](#delayed) 实例,以便您之后进行操控.

**示例**

此 MVP 示例展示的房间拥有：`setInterval()`, `setTimeout` 并清理了之前存储的 `Delayed` 类型实例；同时显示房间时钟实例的当前时间.1 秒后'Time now ' + `this.clock.currentTime` 被 `console.log`,之后再过 10 秒我们清理了间隔：`this.delayedInterval.clear();`.

```typescript fct\_label="TypeScript" // Import Delayed import { Room, Client, Delayed } from "colyseus";

export class MyRoom extends Room { // For this example public delayedInterval!:Delayed;

    // When room is initialized
    onCreate(options: any) {
        // start the clock ticking
        this.clock.start();

        // Set an interval and store a reference to it
        // so that we may clear it later
        this.delayedInterval = this.clock.setInterval(() => {
            console.log("Time now " + this.clock.currentTime);
        }, 1000);

        // After 10 seconds clear the timeout;
        // this will *stop and destroy* the timeout completely
        this.clock.setTimeout(() => {
            this.delayedInterval.clear();
        }, 10_000);
    }
} ```

#### `clock.clear()`

使用 `clock.setInterval()` 和 `clock.setTimeout()` 清除所有已注册的间隔和超时.

#### `clock.start()`

开始计算时间.

#### `clock.stop()`

停止计算时间.

#### `clock.tick()`

这个方法会在模拟间隔的每一步被自动调用.所有 `Delayed` 实例会在 `tick` 期间接受检查.

!!!提示：查看 [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166) 了解更多细节.

### 公用属性

#### `clock.elapsedTime`

在 [`clock.start()`](#clockstart) 方法被调用后的运行时间,以毫秒计.只读.

#### `clock.currentTime`

当前时间,以毫秒计.只读.

#### `clock.deltaTime`

上次调用与当前`clock.tick()`调用之间的区别,以毫秒计.只读.

## 延迟

延迟实例由 [`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed) 或 [`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) 方法创建.

### 公用方法

#### `delayed.pause()`

在一个特定 `Delayed` 实例中暂停时间.(`elapsedTime` 不会增加,除非调用 `.resume()`.)

#### `delayed.resume()`

在一个特定 `Delayed` 实例中恢复时间.(`elapsedTime` 将会继续正常增加)

#### `delayed.clear()`

清除超时或间隔

#### `delayed.reset()`

重设运行时间

### 公用属性

#### `delayed.elapsedTime: number`

`Delayed` 实例的运行时间,自开始起以毫秒计.

#### `delayed.active: boolean`

如果计时器仍在运行,返回 `true`.

#### `delayed.paused: boolean`

如果计时器已通过 `.pause()` 暂停,返回 `true`.


