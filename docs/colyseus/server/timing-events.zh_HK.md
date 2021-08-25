# 服务器 API » 定时事件

对于 {1>定时事件<1}，建议在您的 {4>Room<4} 实例中使用 {2>{3>this.clock<3}<2}方法。

!!!提示：当 {3>Room<3} 被释放时，注册在 {1>{2>this.clock<2}<1} 上的全部间隔和超时都会被自动清除。

!!!警告 “重要”：内置 {1>{2>setTimeout<2}<1} 和 {3>{4>setInterval<4}<3} 方法依赖 CPU 负载，这可能导致意外的执行延迟时间。

## 时钟

提供了有用的时钟机制，用于为状态性模拟之外的事件计时。举一个使用案例：当一名玩家收集一件物品时，您可能 {1>clock.setTimeout<1} 以创建一个新的可收集物。使用 {2>clock.<2} 的一个好处在于您无须担心房间更新和增量，相反，您可以专注于为房间状态的每个事件单独计时。

### 公用方法

{1>备注： {2>time<2} 参数以毫秒为单位<1}

#### {1}clock.setInterval(callback, time, ...args):Delayed;

{1>setInterval()<1} 方法会反复调用一个函数或执行一个代码段，每次调用之间有固定的时间延迟。它将返回识别间隔的 {2>{3>Delayed<3}<2} 实例，以便您之后进行操控。

#### {1}clock.setTimeout(callback, time, ...args):Delayed;

{1>setTimeout()<1} 方法会设置一个定时器，定时器到期时会执行一个函数或特定代码段。它将返回识别间隔的 {2>{3>Delayed<3}<2} 实例，以便您之后进行操控。

**示例**

此 MVP 示例展示的房间拥有：{1>setInterval()<1}、{2>setTimeout<2} 并清理了之前存储的 {3>Delayed<3} 类型实例；同时显示房间时钟实例的当前时间。1 秒后'Time now ' + {4>this.clock.currentTime<4} 被 {5>console.log<5}，之后再过 10 秒我们清理了间隔：{6>this.delayedInterval.clear();<6}。

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

使用 {1>clock.setInterval()<1} 和 {2>clock.setTimeout()<2} 清除所有已注册的间隔和超时。

#### {1>clock.start()<1}

开始计算时间。

#### {1>clock.stop()<1}

停止计算时间。

#### {1>clock.tick()<1}

这个方法会在模拟间隔的每一步被自动调用。所有 {1>Delayed<1} 实例会在 {2>tick<2} 期间接受检查。

!!!提示：查看 {1>Room#setSimiulationInterval()<1} 了解更多细节。

### 公用属性

#### {1>clock.elapsedTime<1}

在 {1>{2>clock.start()<2}<1} 方法被调用后的运行时间，以毫秒计。只读。

#### {1>clock.currentTime<1}

当前时间，以毫秒计。只读。

#### {1>clock.deltaTime<1}

上次调用与当前{1>clock.tick()<1}调用之间的区别，以毫秒计。只读。

## 延迟

延迟实例由 {1>{2>clock.setInterval()<2}<1} 或 {3>{4>clock.setTimeout()<4}<3} 方法创建。

### 公用方法

#### {1>delayed.pause()<1}

在一个特定 {1>Delayed<1} 实例中暂停时间。（{2>elapsedTime<2} 不会增加，除非调用 {3>.resume()<3}。）

#### {1>delayed.resume()<1}

在一个特定 {1>Delayed<1} 实例中恢复时间。（{2>elapsedTime<2} 将会继续正常增加）

#### {1>delayed.clear()<1}

清除超时或间隔

#### {1>delayed.reset()<1}

重设运行时间

### 公用属性

#### {1>delayed.elapsedTime: number<1}

{1>Delayed<1} 实例的运行时间，自开始起以毫秒计。

#### {1>delayed.active: boolean<1}

如果计时器仍在运行，返回 {1>true<1}。

#### {1>delayed.paused: boolean<1}

如果计时器已通过 {2>.pause()<2} 暂停，返回 {1>true<1}。


