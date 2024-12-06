Since Colyseus 0.15, you may customize the matchmaking CORS headers.

This article is only relevant for browser-based projects. If you don't have web browsers as a target for your project, you can ignore this.

!!! Quote "What is CORS?"
    "Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources. CORS also relies on a mechanism by which browsers make a "preflight" request to the server hosting the cross-origin resource, in order to check that the server will permit the actual request. In that preflight, the browser sends headers that indicate the HTTP method and headers that will be used in the actual request."
    – [See MDN documentation on CORS for more information](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

<!--
## Overview
-->


## Overriding the matchmaker's CORS headers

You can provide your own `getCorsHeaders()` function for the matchmaker. The headers you return from `getCorsHeaders()` are merged with default built-in headers.

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

Using the example above, the resulting headers from `OPTIONS` and further matchmaking HTTP requests (`GET`, `POST`) are going to contain these headers:

```
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods: OPTIONS, POST, GET
Access-Control-Allow-Origin: *
Access-Control-Max-Age: 2592000
Vary: *
```

---

## Accessing Request data

Note that you have the http request instance available when defining the custom CORS headers.

Depending on the [Transport](/server/transport/) implementation you are using, the available methods are going to be slightly different

- `WebSocketTransport`: see [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage)
- `uWebSocketsTransport`: see [uws.HttpRequest](https://unetworking.github.io/uWebSockets.js/generated/interfaces/HttpRequest.html)

```typescript
import { matchMaker } from "@colyseus/core";

matchMaker.controller.getCorsHeaders = function(req) {
    // "req" is the Transport's Request instance.

    // --
    // WebSocketTransport:
    // when using WebSocketTransport, it is an http.IncomingMessage
    const referer = req.headers.referer;

    // --
    // uWebSocketsTransport:
    // when using uWebSocketsTransport, it is an uws.Request
    const referer = req.getHeader('referer');

    return {/* YOUR CUSTOM CORS HEADERS */}
}
```
