从 Colyseus 0.15 版开始, 您可以自定义 matchmaking CORS header.

该教程仅针对基于浏览器的项目. 如果您不需要把项目输出为浏览器运行的 web 程序, 可以忽略该教程.

## 啥是 CORS?

> Cross-Origin Resource Sharing (CORS) 跨域资源共享是一种基于 HTTP-header 的机制, 它使服务器允许浏览器从除了自己之外的地方 (域名, 协议或端口) 加载资源. CORS 还依赖于一种机制, 即浏览器向跨域资源托管服务器发出 "预检" 请求, 以判断服务器是否会允许对资源的实际请求. 在该预检中, 浏览器发送出表示 HTTP method 的 header 和将在实际请求中使用的 header.

!!! tip "更多关于跨域资源共享的信息"
    [更多内容详见 Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

<!--
## 概览
-->


## 覆盖 matchmaker 的 CORS headers

可以给 matchmaker 提供自定义的 `getCorsHeaders()` 函数. 从该 `getCorsHeaders()` 返回的 header 会跟默认内置的 header 混合在一起使用.

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

使用上例代码的话, 最终 `OPTIONS` 里的 header 及以后的 matchmaking HTTP 请求 (`GET`, `POST`) 将会包含如下内容:

```
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: OPTIONS, POST, GET
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 2592000
Vary: *
```

---

## 访问请求数据

注意在自定义 CORS header 的时候, http 请求实例已被获取到.

取决于您使用何种 [Transport](/server/transport/) 层实现, 该使用的函数会有些许不同

- `WebSocketTransport`: 参见 [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage)
- `uWebSocketsTransport`: 参见 [uws.HttpRequest](https://unetworking.github.io/uWebSockets.js/generated/interfaces/HttpRequest.html)

```typescript
import { matchMaker } from "@colyseus/core";

matchMaker.controller.getCorsHeaders = function(req) {
    // "req" 就是传输层的请求实例.

    // --
    // WebSocketTransport:
    // 使用 WebSocketTransport, 它是一个 http.IncomingMessage
    const referer = req.headers.referer;

    // --
    // uWebSocketsTransport:
    // 使用 uWebSocketsTransport, 它是一个 uws.Request
    const referer = req.getHeader('referer');

    return {/* 自定义 CORS 标头 */}
}
```