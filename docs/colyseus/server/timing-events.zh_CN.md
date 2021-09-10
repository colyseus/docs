# 伺服器 API » 計時事件

對於[計時事件](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),建議自您的`房間`執行個體使用 [`this.clock`](/server/room/#clock-clocktimer) 方法.

!!!提示 所有在 [`this.clock`](/server/room/#clock-clocktimer) 註冊的間隔和逾時都會在`房間`受處置時自動清除.

!!!警告(重要)內建 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) 和 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 方法仰賴於 CPU 負載,這可能會導致執行發生非預期的延遲時間.

## 時鐘

時鐘是提供作為可設定狀態之模擬外的計時事件的實用機制.使用範例為：當玩家收集物品時,您可能會 `clock.setTimeout` 以建立新可收集物.使用 `clock.` 的一個好處是您不用擔心房間的更新和差異,並轉而專注在對房間狀態的事件獨立進行計時.

### 公開方法

*注意：`時間`參數以毫秒計*

#### `clock.setInterval(callback, time, ...args):Delayed`

`setInterval()` 方法在每個呼叫之間的固定時間延遲下,重複呼叫函式或執行程式碼片段.其傳回[`延遲`](#delayed)執行個體,這會識別間隔,讓您
能稍後進行操作.

#### `clock.setTimeout(callback, time, ...args):Delayed`

`setTimeout()` 方法設定了計時器,這會在計時器過期後,執行函式或指定的程式碼片段.其傳回[`延遲`](#delayed)執行個體,這會識別間隔,讓您
能稍後進行操作.

**範例**

這個最佳範例示範了具有 `setInterval()`, `setTimeout` 並清除了先前儲存的 `Delayed` 類型執行個體的房間；以及示範了房間時鐘執行個體的 currentTime.在 1 秒後 'Time now ' + `this.clock.currentTime` 是 `console.log`'d,然後在 10 秒後我們會清除間隔：`this.delayedInterval.clear();`.

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

清除所有間隔和與 `clock.setInterval()` 和 `clock.setTimeout()` 登錄的逾時.

#### `clock.start()`

開始計時.

#### `clock.stop()`

停止計時.

#### `clock.tick()`

此方法會在每個模擬間隔步驟自動呼叫.所有`延遲`執行個體會在`滴答`時受檢查.

!!! 提示查看 [Room#setSimiulationInterval()](/server/room/#setsimulationinterval-callback-milliseconds166) 以瞭解更多資訊.

### 公開屬性

#### `clock.elapsedTime`

從呼叫 [`clock.start()`](#clockstart) 方法開始,以毫秒計的經過時間.唯讀.

#### `clock.currentTime`

以毫秒計的目前時間.唯讀.

#### `clock.deltaTime`

最後和目前 `clock.tick()` 呼叫的差異,以毫秒計.唯讀.

## 延遲

延遲執行個體是自 [`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed) 或 [`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) 方法建立的.

### 公開方法

#### `delayed.pause()`

暫停特定`延遲`執行個體的時間.(直到呼叫 `.resume()` 前,`elapsedTime` 都不會增加.)

#### `delayed.resume()`

繼續特定`延遲`執行個體的時間.(`elapsedTime` 會繼續正常增加)

#### `delayed.clear()`

清除逾時或間隔.

#### `delayed.reset()`

重設經過的時間.

### 公開屬性

#### `delayed.elapsedTime: number`

`延遲`執行個體的經過時間,自開始起算,以毫秒計.

#### `delayed.active: boolean`

如果計時器仍在執行,則傳回 `true`.

#### `delayed.paused: boolean`

如果計時器已透過 `.pause()` 暫停,則傳回 `true`.


