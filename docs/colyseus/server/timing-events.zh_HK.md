# 服務器 API  &raquo; 計時器事件

對於 [計時器事件](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),
建議使用 `Room` 實例提供的 [`this.clock`](/server/room/#clock-clocktimer) 的功能.

!!! Tip
    當 `Room` 被銷毀時,
    註冊在 [`this.clock`](/server/room/#clock-clocktimer) 上的重復計時器和超時計時器
    都會被自動清除.

!!! Warning "註意"
    JS 自帶的 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
    和
    [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
    方法依賴 CPU 負載, 執行延遲可能並不準確.

## Clock

在狀態同步事件機製之外, Clock 提供了另一種有用的機製. 舉一個案例: 當一名玩家獲得一個可收集品後, 可以用 `clock.setTimeout` 來刷新這個物品. 使用 `clock.` 的好處就在於無須關心房間狀態更新變化, 可以專註計時程序而脫離狀態機製.

### 公開方法

*註意: `time` 參數以毫秒為單位*

#### `clock.setInterval(callback, time, ...args):Delayed`

`setInterval()` 方法會重復調用一個函數或執行一個代碼段,
每次調用之間有固定的時間間隔.
它返回 [`Delayed`](#delayed) 實例作為 id, 以便後續操控.

#### `clock.setTimeout(callback, time, ...args):Delayed`

`setTimeout()` 方法會設置一個定時器,
定時器到期時會執行一個函數或指定的代碼段.
它返回 [`Delayed`](#delayed) 實例作為 id, 以便後續操控.

**示例**

此 MVP 示例展示的功能有: `setInterval()`, `setTimeout` 及清理之前儲存的 `Delayed` 實例; 使用房間時鐘顯示當前時間.
每一秒鐘 'Time now ' + `this.clock.currentTime` 被 `console.log` 打印出來, 之後再過 10 秒清理計時器: `this.delayedInterval.clear();`.

```typescript fct_label="TypeScript"
// 導入 Delayed
import { Room, Client, Delayed } from "colyseus";

export class MyRoom extends Room {
    // 這個例子中
    public delayedInterval!: Delayed;

    // 房間初始化時
    onCreate(options: any) {
        // 時鐘開始計時
        this.clock.start();

        // 設置間隔計時並保存其引用
        // 以便後續清理工作
        this.delayedInterval = this.clock.setInterval(() => {
            console.log("Time now " + this.clock.currentTime);
        }, 1000);

        // 10 秒過後清理計時器;
        // 這會讓計時器 *停止並銷毀*
        this.clock.setTimeout(() => {
            this.delayedInterval.clear();
        }, 10_000);
    }
}
```

#### `clock.clear()`

使用 `clock.setInterval()` 和 `clock.setTimeout()` 清除所有已註冊的間隔計時器和超時計時器.

#### `clock.start()`

開始計時.

#### `clock.stop()`

停止計時.

#### `clock.tick()`

模擬時間步. 每次 `tick` 期間會遍歷所有 `Delayed` 實例.

!!! tip
    更多詳情參見 [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166).

### 公開屬性

#### `clock.elapsedTime`

在 [`clock.start()`](#clockstart) 方法被調用後經過的時間, 以毫秒計. 只讀.

#### `clock.currentTime`

當前時間, 以毫秒計. 只讀.

#### `clock.deltaTime`

當前`clock.tick()`調用與上次調用之間經過的時間, 以毫秒計. 只讀.

## Delayed

由 [`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed)
或 [`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) 方法
所創建的延遲實例.

### 公開方法

#### `delayed.pause()`

在指定 `Delayed` 實例上暫停計時. (`elapsedTime` 不再增加, 直到調用 `.resume()`.)

#### `delayed.resume()`

在指定 `Delayed` 實例上恢復計時. (`elapsedTime` 將會繼續正常增加)

#### `delayed.clear()`

清除超時計時或間隔計時

#### `delayed.reset()`

重置計時器

### 公開屬性

#### `delayed.elapsedTime: number`

`Delayed` 實例記錄的時間, 自開始計時起, 以毫秒計.

#### `delayed.active: boolean`

如果計時器在工作中, 則返回 `true`.

#### `delayed.paused: boolean`

如果計時器已用 `.pause()` 暫停工作, 則返回 `true`.


