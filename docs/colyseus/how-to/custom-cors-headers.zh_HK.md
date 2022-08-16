從 Colyseus 0.15 版開始, 您可以自定義 matchmaking CORS header.

該教程僅針對基於瀏覽器的項目. 如果您不需要把項目輸出為瀏覽器運行的 web 程序, 可以忽略該教程.

## 啥是 CORS?

> Cross-Origin Resource Sharing (CORS) 跨域資源共享是一種基於 HTTP-header 的機製, 它使服務器允許瀏覽器從除了自己之外的地方 (域名, 協議或端口) 加載資源. CORS 還依賴於一種機製, 即瀏覽器向跨域資源托管服務器發出 "預檢" 請求, 以判斷服務器是否會允許對資源的實際請求. 在該預檢中, 瀏覽器發送出表示 HTTP method 的 header 和將在實際請求中使用的 header.

!!! tip "更多關於跨域資源共享的信息"
    [更多內容詳見 Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

<!--
## 概覽
-->


## 覆蓋 matchmaker 的 CORS headers

可以給 matchmaker 提供自定義的 `getCorsHeaders()` 函數. 從該 `getCorsHeaders()` 返回的 header 會跟默認內置的 header 混合在一起使用.

```typescript
import { matchMaker } from "@colyseus/core";

matchMaker.controller.getCorsHeaders = function(req) {
    return {
        'Access-Control-Allow-Origin': '*',
        'Vary': '*',
        // 'Vary': "<header-name>, <header-name>, ...",
    }
}
```

使用上例代碼的話, 最終 `OPTIONS` 裏的 header 及以後的 matchmaking HTTP 請求 (`GET`, `POST`) 將會包含如下內容:

```
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: OPTIONS, POST, GET
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 2592000
Vary: *
```

---

## 訪問請求數據

註意在自定義 CORS header 的時候, http 請求實例已被獲取到.

取決於您使用何種 [Transport](/colyseus/server/transport/) 層實現, 該使用的函數會有些許不同

- `WebSocketTransport`: 參見 [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage)
- `uWebSocketsTransport`: 參見 [uws.HttpRequest](https://unetworking.github.io/uWebSockets.js/generated/interfaces/HttpRequest.html)

```typescript
import { matchMaker } from "@colyseus/core";

matchMaker.controller.getCorsHeaders = function(req) {
    // "req" 就是傳輸層的請求實例.

    // --
    // WebSocketTransport:
    // 使用 WebSocketTransport, 它是一個 http.IncomingMessage
    const referer = req.headers.referer;

    // --
    // uWebSocketsTransport:
    // 使用 uWebSocketsTransport, 它是一個 uws.Request
    const referer = req.getHeader('referer');

    return {/* 自定義 CORS 標頭 */}
}
```