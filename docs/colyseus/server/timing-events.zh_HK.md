# 服務器 API  &raquo; 定時事件

對於 [定時事件](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html), 建議在您的 `Room` 實例中使用 [`this.clock`](/server/room/#clock-clocktimer) 方法.

!!! Tip
    當 `Room` 被釋放時,註冊在 [`this.clock`](/server/room/#clock-clocktimer) 上的全部間隔和超時都會被自動清除.

!!! Warning "重要"
    內置 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) 和 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 方法依賴 CPU 負載,這可能導致意外的執行延遲時間.

## 時鐘

提供了有用的時鐘機製,用於為狀態性模擬之外的事件計時.舉一個使用案例：當一名玩家收集一件物品時,您可能 `clock.setTimeout` 以創建一個新的可收集物.使用 `clock.` 的一個好處在於您無須擔心房間更新和增量,相反,您可以專註於為房間狀態的每個事件單獨計時.

### 公用方法

*備註： `time` 參數以毫秒為單位*

#### `clock.setInterval(callback, time, ...args):Delayed`

`setInterval()` 方法會反復調用一個函數或執行一個代碼段,每次調用之間有固定的時間延遲.它將返回識別間隔的 [`Delayed`](#delayed) 實例, 以便您之後進行操控.

#### `clock.setTimeout(callback, time, ...args):Delayed`

`setTimeout()` 方法會設置一個定時器,定時器到期時會執行一個函數或特定代碼段.它將返回識別間隔的 [`Delayed`](#delayed) 實例, 以便您之後進行操控.

**示例**

此 MVP 示例展示的房間擁有：`setInterval()`, `setTimeout` 並清理了之前存儲的 `Delayed` 類型實例；同時顯示房間時鐘實例的當前時間.1 秒後'Time now ' + `this.clock.currentTime` 被 `console.log`,之後再過 10 秒我們清理了間隔：`this.delayedInterval.clear();`.

```typescript fct_label="TypeScript"
// Import Delayed
import { Room, Client, Delayed } from "colyseus";

export class MyRoom extends Room {
    // For this example
    public delayedInterval!: Delayed;

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
}
```

#### `clock.clear()`

使用 `clock.setInterval()` 和 `clock.setTimeout()` 清除所有已註冊的間隔和超時.

#### `clock.start()`

開始計算時間.

#### `clock.stop()`

停止計算時間.

#### `clock.tick()`

這個方法會在模擬間隔的每一步被自動調用.所有 `Delayed` 實例會在 `tick` 期間接受檢查.

!!! tip
    查看 [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166) 了解更多細節.

### 公用屬性

#### `clock.elapsedTime`

在 [`clock.start()`](#clockstart) 方法被調用後的運行時間,以毫秒計.只讀.

#### `clock.currentTime`

當前時間,以毫秒計.只讀.

#### `clock.deltaTime`

上次調用與當前`clock.tick()`調用之間的區別,以毫秒計.只讀.

## 延遲

延遲實例由 [`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed) 或 [`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) 方法創建.

### 公用方法

#### `delayed.pause()`

在一個特定 `Delayed` 實例中暫停時間.(`elapsedTime` 不會增加,除非調用 `.resume()`.)

#### `delayed.resume()`

在一個特定 `Delayed` 實例中恢復時間.(`elapsedTime` 將會繼續正常增加)

#### `delayed.clear()`

清除超時或間隔

#### `delayed.reset()`

重設運行時間

### 公用屬性

#### `delayed.elapsedTime: number`

`Delayed` 實例的運行時間,自開始起以毫秒計.

#### `delayed.active: boolean`

如果計時器仍在運行,返回 `true`.

#### `delayed.paused: boolean`

如果計時器已通過 `.pause()` 暫停,返回 `true`.


