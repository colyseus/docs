- [Inspector (`--inspect` flag)](#inspector)
- [偵錯訊息](#debug-messages)

## 偵測器

你可以使用 Node.js 的內建偵測器來對你的應用程式進行偵錯。

!!!提示請閱讀[偵錯 Node.js 應用程式](https://nodejs.org/en/docs/inspector/)的更多資訊。

### 在實際執行環境中使用偵測器

在實際執行中使用偵測器時請謹慎。使用記憶體快照和中斷點會直接影響你的使用者體驗。

*1\.*連接至遠端伺服器

``` ssh root@remote.example.com ```

*2\.*查看節點處理序的 PID

``` ps aux | grep node ```

*3\.*將偵測器附加至處理序

``` kill -usr1 PID ```

*4\.*在你的本機電腦和遠距偵測器之間建立 SSH 通道。

``` ssh -L 9229:localhost:9229 root@remote.example.com ```

你的實際執行伺服器現在應該會出現在 [`chrome://inspect`](`chrome://inspect`)。

## 偵錯訊息

如需啟用所有偵錯日誌，請使用 `DEBUG=colyseus:*` 環境變數來執行你的伺服器。

``` DEBUG=colyseus:* npm start ```

或者，您只能啟用按類別列印偵錯日誌。 

### `colyseus:patch`

紀錄位元組的數量，以及廣播給所有用戶端的修補程式之間的間隔。

``` colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms ```

### `colyseus:errors`

每當伺服器端發生非預期（或內部預期）的錯誤時，都會進行紀錄。

### `colyseus:matchmaking`

每當房間衍生或受處置時，都會進行紀錄。

``` colyseus:matchmaking spawning 'chat' on worker 77218 +52s colyseus:matchmaking disposing 'chat' on worker 77218 +2s ```
