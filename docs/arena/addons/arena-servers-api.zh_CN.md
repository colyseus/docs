# Arena 服务器 API

用来管理 Colyseus Arena 服务器部署的一套易用, 高效, 高可用性的 API. 它是管理多地域部署的理想工具, 还可以用来向客户端传递简洁的配置信息. 通过 API 可以方便快捷地向客户端用户推送配置信息和服务入口.

## 开始使用
Arena 服务器 API 可以用 Arena 仪表板部署为一个独立的应用. 部署服务器 API 应用需要您已加入付费计划.

### 配置
服务器 API 使用一个 JSON 文件进行配置. 首先在 Arena 仪表板的 **Server Code** 页面新建 `config.json` 文件. 该文件不是必须按照下面那样的格式, 最少需要配置 1 个服务器, 可以随意增加或者减少配置表中的服务器.

**必要值**

- `url`: 这个是整个配置里唯一必要的值, 它被用来轮询检查服务器活动情况.
!!! NOTE
    - Arena 服务器 API 仅在支持自动扩容缩容的 Arena 计划 (Powered Ascent 及更高版本) 中可用.

**示例 `config.json`:**
```
{
   "servers": [
      {
         "name": "Game US-East 1",
         "region": "US",
         "url": "fake.colyseus.dev",
         "port": 443,
         "visible": true
      },
      {
         "name": "Game EU-Central 1",
         "region": "Germany",
         "url": "fake.colyseus.de",
         "port": 443,
         "visible": false
      }
   ]
}
```

### 部署 API
保存好配置文件然后点选右上角的 `Deploy` 按钮即可进行部署. 记得先 ***check reload*** 再点 **Deploy**.

配置更新会被推送至服务器硬盘然后启动一个新 API 服务器来应用更新, 新服务器启动 (约 20 - 30 秒) 之后老服务器关闭. 这样就能让 API 服务在更新时也能无缝运行.

### 访问 API
通过显示于 **Manage** 页面下的 URL 加上以下地址就可以访问服务器 API 了.  (**比如:** *abc123.colyseus.dev/api/v1/list*)

- `/api/v1/list`: 包括 `config.json` 文件配置的一组服务器及它们当前的状态, 连接数和游戏服务器数量.

- `/api/v1/listExpanded`: 包括每个应用部署的更详细信息, 包括游戏服务器 ID 及其本地 IP 等. (未来会提供导向入口以便连接客户端到指定的游戏服务器上).


**`/api/v1/list` 返回数据举例:**
```
{
  "arena": [
    {
      "name": "Game US-East 1",             // 用户定义
      "region": "US",                       // *
      "url": "fake.colyseus.dev",           // *
      "port": 443,                          // *
      "visible": true,                      // *

      "totalCCU": 0,                        // API生成
      "totalGameServers": 1,                // *
      "state": "active"                     // *
    },
    {
      "name": "Game EU-Central 1",          // 用户定义
      "region": "Germany",                  // *
      "url": "fake.colyseus.de",            // *
      "port": 443,                          // *
      "visible": false,                     // *

      "state": "unreachable"                // API生成
    }
  ]
}
```
!!! NOTE
    - Arena 目前仅支持 2567, 80, 443 (SSL) 端口.
