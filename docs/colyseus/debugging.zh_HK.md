- [偵測器 (`--inspect` 參數)](#偵測器)
- [偵錯訊息](#偵錯訊息)

## 偵測器

您可以使用 Node.js 的內建偵測器來對您的應用程式進行偵錯.

!!! Tip
    請閱讀 [Node.js 程式偵錯](https://nodejs.org/en/docs/inspector/) 來獲取更多資訊.

### 在生產環境中使用偵測器

在生產環境中使用偵測器時請謹慎. 使用記憶體快照和中斷點會直接影響您的使用者體驗.

*1.* 連接至遠端伺服器

```
ssh root@remote.example.com
```

*2.* 查看 Node 應用程式的 PID

```
ps aux | grep node
```

*3.* 將偵測器附加至應用程式

```
kill -usr1 PID
```

*4.* 建立本機電腦到遠距偵測器之間的 SSH 通道

```
ssh -L 9229:localhost:9229 root@remote.example.com
```

此時您的實際執行伺服器應該可以展現在 [`chrome://inspect`](`chrome://inspect`) 中.

## 偵錯訊息

如需啟用所有偵錯日誌, 請使用 `DEBUG=colyseus:*` 環境變數來執行您的伺服器.

```
DEBUG=colyseus:* npm start
```

或者, 您還可以按類別啟用偵錯日誌.

### `colyseus:patch`

紀錄廣播給用戶端的補丁位元數和補丁間隔時間.

```
colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms
```

### `colyseus:errors`

每當伺服器端發生異常(可預見的或內部的)錯誤時, 進行紀錄.

### `colyseus:matchmaking`

每當房間啟用或釋放時, 進行紀錄.

```
colyseus:matchmaking spawning 'chat' on worker 77218 +52s
colyseus:matchmaking disposing 'chat' on worker 77218 +2s
```
