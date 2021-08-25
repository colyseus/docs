# 伺服器 API » 計時事件

對於{1>計時事件<1}，建議自您的{4>房間<4}執行個體使用 {2>{3>this.clock<3}<2} 方法。

!!!提示 所有在 {1>{2>this.clock<2}<1} 註冊的間隔和逾時都會在{3>房間<3}受處置時自動清除。

!!!警告「重要」內建 {1>{2>setTimeout<2}<1} 和 {3>{4>setInterval<4}<3} 方法仰賴於 CPU 負載，這可能會導致執行發生非預期的延遲時間。

## 時鐘

時鐘是提供作為可設定狀態之模擬外的計時事件的實用機制。使用範例為：當玩家收集物品時，您可能會 {1>clock.setTimeout<1} 以建立新可收集物。使用 {2>clock.<2} 的一個好處是您不用擔心房間的更新和差異，並轉而專注在對房間狀態的事件獨立進行計時。

### 公開方法

{1>注意：{2>時間<2}參數以毫秒計<1}

#### {1}clock.setInterval(callback, time, ...args):Delayed;

{1>setInterval()<1} 方法在每個呼叫之間的固定時間延遲下，重複呼叫函式或執行程式碼片段。其傳回{2>{3>延遲<3}<2}執行個體，這會識別間隔，讓您
能稍後進行操作。

#### {1}clock.setTimeout(callback, time, ...args):Delayed;

{1>setTimeout()<1} 方法設定了計時器，這會在計時器過期後，執行函式或指定的程式碼片段。其傳回{2>{3>延遲<3}<2}執行個體，這會識別間隔，讓您
能稍後進行操作。

**範例**

這個最佳範例示範了具有 {1>setInterval()<1}、{2>setTimeout<2} 並清除了先前儲存的 {3>Delayed<3} 類型執行個體的房間；以及示範了房間時鐘執行個體的 currentTime。在 1 秒後 'Time now ' + {4>this.clock.currentTime<4} 是 {5>console.log<5}'d，然後在 10 秒後我們會清除間隔：{6>this.delayedInterval.clear();<6}。

\`\`\`typescript fct\_label="TypeScript" // Import Delayed import { Room, Client, Delayed } from "colyseus";

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
} \`\`\`

#### {1>clock.clear()<1}

清除所有間隔和與 {1>clock.setInterval()<1} 和 {2>clock.setTimeout()<2} 登錄的逾時。

#### {1>clock.start()<1}

開始計時。

#### {1>clock.stop()<1}

停止計時。

#### {1>clock.tick()<1}

此方法會在每個模擬間隔步驟自動呼叫。所有{1>延遲<1}執行個體會在{2>滴答<2}時受檢查。

!!! 提示查看 {1>Room#setSimiulationInterval()<1} 以瞭解更多資訊。

### 公開屬性

#### {1>clock.elapsedTime<1}

從呼叫 {1>{2>clock.start()<2}<1} 方法開始，以毫秒計的經過時間。唯讀。

#### {1>clock.currentTime<1}

以毫秒計的目前時間。唯讀。

#### {1>clock.deltaTime<1}

最後和目前 {1>clock.tick()<1} 呼叫的差異，以毫秒計。唯讀。

## 延遲

延遲執行個體是自 {1>{2>clock.setInterval()<2}<1} 或 {3>{4>clock.setTimeout()<4}<3} 方法建立的。

### 公開方法

#### {1>delayed.pause()<1}

暫停特定{1>延遲<1}執行個體的時間。（直到呼叫 {3>.resume()<3} 前，{2>elapsedTime<2} 都不會增加。）

#### {1>delayed.resume()<1}

繼續特定{1>延遲<1}執行個體的時間。（{2>elapsedTime<2} 會繼續正常增加）

#### {1>delayed.clear()<1}

清除逾時或間隔。

#### {1>delayed.reset()<1}

重設經過的時間。

### 公開屬性

#### {1>delayed.elapsedTime: number<1}

{1>延遲<1}執行個體的經過時間，自開始起算，以毫秒計。

#### {1>delayed.active: boolean<1}

如果計時器仍在執行，則傳回 {1>true<1}。

#### {1>delayed.paused: boolean<1}

如果計時器已透過 {2>.pause()<2} 暫停，則傳回 {1>true<1}。


