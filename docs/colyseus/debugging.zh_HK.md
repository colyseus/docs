- [監測器 (`--inspect` 參數)](#監測器)
- [調試信息](#調試信息)

## 監測器

您可使用 Node.js 的內置監測器來調試您的應用程序.

!!! Tip
    詳情請參考 [調試 Node.js 應用](https://nodejs.org/en/docs/inspector/).

### 在商用環境下使用監測器

商用環境下請謹慎使用監測器. 使用內存快照和斷點會直接影響您的用戶體驗.

*1.* 連接到遠程服務器:

```
ssh root@remote.example.com
```

*2.* 查看 Node 進程的 PID

```
ps aux | grep node
```

*3.* 將監測器加掛到進程中

```
kill -usr1 PID
```

*4.* 在您的本地機器中創建 SSH 通道到遠程監測器

```
ssh -L 9229:localhost:9229 root@remote.example.com
```

這樣您的生產服務器就可以通過 [`chrome://inspect`](`chrome://inspect`) 來進行監測了.

## 調試信息

啟動服務器時使用 `DEBUG=colyseus:*` 參數就可以啟用全部的調試日誌:

```
DEBUG=colyseus:* npm start
```

- `colyseus:errors`: 記錄服務端發生異常的 (或者故意的, 內部的) 錯誤.
- `colyseus:matchmaking`: 記錄房間被新建或銷毀.
- `colyseus:message`: 記錄流入/流出的房間消息.
- `colyseus:patch`: 記錄廣播至客戶端的數據補丁的字節大小和間隔時間.
- `colyseus:connection`: 記錄客戶端與服務器的連接.
<!-- - `colyseus:driver`:  -->
<!-- - `colyseus:presence`:  -->