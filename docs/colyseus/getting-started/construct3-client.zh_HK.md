# Construct 3 SDK

## 安裝

- [下載 Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk)

!!! Warning "註意!您需要一個服務器來使用 Colyseus!"
    眾所周知 Construct 具有一個功能可以從客戶端 "托管" 多人進程. 這在使用 Colyseus 時並不適用. Colyseus 是一個權威性 **服務器**, 由 Node.js 編寫. 不能讓客戶端直接托管遊戲進程.

!!! tip "Construct 3 SDK: 源碼"
    您可以在此找到 Construct SDK 的源代碼: [Construct 3](https://github.com/colyseus/colyseus-construct3) (與 Construct3 的 C3 和 C2 運行環境兼容) / [Construct 2](https://github.com/colyseus/colyseus-construct2) (非最新版 - 與 0.9.x 服務器兼容)

## 示例項目

請參考如下示例項目來了解如何在 Construct3 上使用 Colyseus.

- [下載 `.c3p` 和服務端文件](https://github.com/colyseus/construct3-demo/archive/refs/heads/master.zip)
- 從 Construct 編輯器中打開 `ConstructProject.c3p` 文件.
- (可選步驟) 運行 `npm install` 和 `npm start` 命令啟動本地服務器

要使用本地服務器, 確保已經把 Construct 的 Event Sheet 中全局變量 `serverURI` 的值替換為 `ws://localhost:8080`.

> 項目文件 `.c3p` 和服務端文件已公開於 [colyseus/construct3-demo](https://github.com/colyseus/construct3-demo/) 上.

## 處理消息

從服務器向客戶端發送消息時的一個重要註意事項:
您需要提供一個含有 `"type"` 字段的對象,
以便客戶端能夠進行識別.

**服務器端**

```typescript
this.broadcast("foo", "bar");
```

**客戶端**

使用 `On Message` 條件, 以 `"foo"` 作為參數. 表達式 `CurrentValue` 將被賦值為 `"bar"`.


## 屬性

### Default Endpoint
使用 "Connect" 行為的默認地址.

## 行為

### Set endpoint to {0}.
格式: wss://example.com

### Join room {0} with options {1}.
以名稱為參數加入房間

### Create room {0} with options {1}.
以名稱為參數創建房間

### Join room {0} with ID {1}.
以 ID 為參數加入現有房間

### Reconnect into room {0} with sessionId {1}.
重新連接到之前連接過的房間

### Send {0} with {1}.
向房間發送消息

### Leave from the room.
斷開客戶端與房間的連接

### Get available {0} rooms.
以名稱為參數獲取房間, 當數據取得時觸發 OnGetAvailableRooms. 數據作為 CurrentValue 表達式返回, 內容為 JSON 字符串

## 條件

### On Join
成功加入房間時觸發.

### On Leave
離開房間時觸發.

### On Error
服務器發生錯誤時觸發.

### On Message ({0})
當房間廣播一條消息, 或直接向該客戶端發送消息時觸發.

### On State Change
當房間 state 改變時觸發.

### On Get Available Rooms
當可用的房間數據在 CurrentValue 表達式中被賦值時觸發.

### On add at {0}
當 ArraySchema 或 MapSchema 中添加新條目時觸發.

### On field change at {0}
當 Schema 實例中某個條目改變時觸發.

### On change at {0}
當 ArraySchema 或 MapSchema 中某個條目改變時觸發.

### On remove at {0}
當 ArraySchema 或 MapSchema 中某個條目被刪除時觸發.

### Is index {0}
用於 Array 和 Map. 檢查當前條目索引是否與所提供的值相等.

### Is field {0}
用於 direct 對象的 "On change" 條件中. 檢查某條目名稱是否被改變.

## 表達式

### JSON
聲明一個 JSON 值.

### CurrentValue
從當前條目獲取值.

### PreviousValue
從當前條目獲取上一個值. 用於實例變量的 "On change" 條件中. 不支持 array 和 map.

### CurrentValueAt
從當前條目獲取嵌套值.

### CurrentIndex
從當前條目獲取索引. 用於 "On Add", "On Change" 或 "On Remove" 條件中.

### CurrentField
獲取正在被改變的條目. 用於 "On field change" 條件中.

### State
從房間 State 中獲取一個值.

### SessionId
當前用戶的唯一 sessionId.

### ErrorCode
獲取最新錯誤代碼.

### ErrorMessage
獲取最新錯誤消息.
