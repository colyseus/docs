
### Overview:

- ~~Support vertical scalability ([#43](https://github.com/gamestdio/colyseus/issues/43))~~ - ✔
- ~~Standardize how to authenticate users in a secure way. ([#49](https://github.com/gamestdio/colyseus/issues/49), suggested by [@darkyen](https://github.com/darkyen))~~ - ✔
- ~~PM2 support ([#56](https://github.com/gamestdio/colyseus/issues/56))~~ - ✔
- ~~Support horizontal scalability. ([#57](https://github.com/gamestdio/colyseus/issues/57))~~ - ✔
- Support for splitting and filtering views ([#59](https://github.com/gamestdio/colyseus/issues/59), suggested by [@darkyen](https://github.com/darkyen) and the whole [gitter channel](https://gitter.im/gamestdio/colyseus)!)
- Support serialization methods other than Fossil's Delta algorithm. ([#58](https://github.com/gamestdio/colyseus/issues/58), suggested by [@derwish-pro](https://github.com/derwish-pro))
- Support transport layers other than WebSocket. ([#48](https://github.com/gamestdio/colyseus/issues/48), suggested by [@darkyen](https://github.com/darkyen))

In order to achieve these goals, it would be great to split Colyseus's internal parts as composable modules. Specially match-making, which is the most complex feature to deal with by having multiple servers/processes running.
