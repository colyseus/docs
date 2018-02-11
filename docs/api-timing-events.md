For [timing events](https://www.w3.org/TR/2011/WD-html5-20110525/timers.html),
it's recommended to use the [`ClockTimer`](api-room/#clock-clocktimer) methods.

!!! Warning "Important"
    The built-in
    [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
    and
    [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
    methods rely on CPU load, which may delay an unexpected amount of time to execute.

## ClockTimer

### Public methods

#### `clock.setInterval(callback, time, ...args): Delayed`

The `setInterval()` method repeatedly calls a function or executes a code
snippet, with a fixed time delay between each call. It returns
[`Delayed`](#delayed) instance which identifies the interval, so you can
manipulate it later.

#### `clock.setTimeout(callback, time, ...args): Delayed`

The `setTimeout()` method sets a timer which executes a function or specified
piece of code once after the timer expires. It returns [`Delayed`](#delayed)
instance which identifies the interval, so you can manipulate it later.

#### `clock.clear()`

Clear all intervals and timeouts registered with `clock.setInterval()` and `clock.setTimeout()`.

#### `clock.start()`

Start counting time.

#### `clock.stop()`

Stop counting time.

#### `clock.tick()`

This method is called automatically at every simulation interval step. All
`Delayed` instances are checked during `tick`.

!!! tip
    See [Room#setSimiulationInterval()](api-room/#setsimulationinterval-callback-milliseconds166) for more details.

### Public properties

#### `clock.elapsedTime`

Elased time in milliseconds since [`clock.start()`]() method was called. Read only.

#### `clock.currentTime`

Current time in milliseconds. Read only.

#### `clock.deltaTime`

The difference in milliseconds between the last and current `clock.tick()` call. Read only.

## Delayed

Delayed instances are created from
[`clock.setInterval()`](#clocksetintervalcallback-time-args-delayed) or
[`clock.setTimeout()`](#clocksettimeoutcallback-time-args-delayed) methods.

### Public methods

#### `delayed.clear()`

Clears the timeout or interval.

#### `delayed.reset()`

Reset the elapsed time.

### Public properties

#### `delayed.active: boolean`

Returns `true` if timer is still running.

