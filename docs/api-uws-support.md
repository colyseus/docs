# µWS Support

By default, Colyseus uses the standard [`ws`](https://www.npmjs.com/package/ws) package for the WebSocket server.

You can enable [`uws`](https://github.com/uNetworking/uWebSockets) in your server by installing it as a dependency in your project.

```
npm install uws
```

It's that simple! Colyseus will automatically detect the dependency available in your `node_modules` and use it instead of the default.