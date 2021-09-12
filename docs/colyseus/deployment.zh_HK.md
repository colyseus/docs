- [在 Heroku 上部署](#heroku)
- [在 Nginx 上部署(推薦)](#nginx-recommended)
- [在 Apache 上部署](#apache)
- [使用 greenlock-express](#greenlock-express)
- [Docker](#docker)

## Heroku

Heroku 只推薦用於原型設計. 您可以透過點擊此按鈕在上面部署 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 專案：

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**註意:** 一定要将环境变量设为 `NPM_CONFIG_PRODUCTION=false` 以便在部署中使用開發依赖项,比如 `ts-node`, `ts-node-dev` 等.

## Nginx (recommended)

建議在生產環境中使用 `pm2` 和 `nginx`.

### PM2

安裝 `pm2`.

```
npm install -g pm2
```

之後使用它啟動伺服器：

```
pm2 start your-server.js
```

### Nginx 配置

```
server {
    listen 80; server\_name yourdomain.com;

    location / {
        proxy_pass http://localhost:2567;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

### 用 SSL 进行 Nginx 配置

建議從 [LetsEncrypt](https://letsencrypt.org) 獲取證書.

```
server {
    listen 80;
    listen 443 ssl;
    server\_name yourdomain.com;

    ssl_certificate /path/to/your/cert.crt;
    ssl_certificate_key /path/to/your/cert.key;

    location / {
        proxy_pass http://localhost:2567;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

## Apache

下面是如果使用 Apache 作為您的 Node.js Colyseus 應用代理.(感謝 [tomkleine](https://github.com/tomkleine) !)

安裝所需 Apache 模組：

```
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo a2enmod proxy_wstunnel
```

虛擬托管配置:

```
<VirtualHost \*:80>
    ServerName servername.xyz

    # 把從 80 端口收到的請求全部轉發至 HTTPS 端口 (強製使用 ssl):
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost \*:443>
    ServerName servername.xyz

    # 開啟 SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # 讓代理把 websocket 協議的請求轉發給 websocket 伺服器
    # 反之亦然, 這樣就不用修改 colyseus 庫和程序了)
    #
    # (註意: 代理會自動把 websocket 轉換為加密版本 (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # 讓代理把 https 協議的請求轉發給 http 伺服器
    # (同樣自動把 https 轉換為 http, 反之亦然)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost>
```

## greenlock-express

如果您想在伺服器上快速配置SSL,Greenlock是個不錯的工具,不需要配置反向代理.

在使用 [`greenlock-express`](https://www.npmjs.com/package/greenlock-express) 時,您 **不應該** 在其後面配置任何反向代理,比如 [Nginx](#nginx-recommended) 或 [Apache](#apache).

```
npm install --save greenlock-express
```

请遵循 [greenlock-express 的讀我文檔](https://www.npmjs.com/package/greenlock-express#1-create-your-project).

下面是處理開發及生產環境的推薦方法：

```typescript
import http from "http";
import express from "express";
import { Server } from "colyseus";

function setup(app: express.Application, server: http.Server) {
  const gameServer = new Server({ server });

  // TODO: 按需配置 `app` 和 `gameServer`.
  // gameServer.define("room", YourRoom);

  return app;
}

if (process.env.NODE\_ENV === "production") {
  require('greenlock-express')
    .init(function () {
      return {
        greenlock: require('./greenlock'),
        cluster: false
      };
    })
    .ready(function (glx) { const app = express();

      // 服務於 80 和 443 埠口
      // 神奇地自動獲取 SSL 證書!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else {
  // 開發環境埠口
  const PORT = process.env.PORT || 2567;

  const app = express(); const server = http.createServer(app);

  setup(app, server); server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

```

## Docker

先決條件：

* `package.json` 與 `package-lock.json` 位於專案中.

* 創建`npm start` 指令來啟動伺服器

步驟：

**步驟 1** 安装 [Docker](https://www.docker.com/)

**步驟 2** 在 colyseus 项目根目录中创建 Dockerfile
```dockerfile
FROM node:12

ENV PORT 8080

WORKDIR /usr/src/app

# 使用一個萬用字元來確保 package.json 和 package-lock.json 得到復製
COPY package\*.json ./

RUN npm ci
# 在生產環境中執行此程序
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```
**步驟 3** 在同目錄下創建 `.dockerignore` 文件
```
node\_modules npm-debug.log
```
這將防止本機模組和調試日誌被復製到 Docker 映像上,並可能覆蓋安裝在映像中的模組.

**步驟 4** 進入存放 Dockerfile 的目錄,執行以下指令構建Docker映像. -t 標誌允許您標記映像,以便稍後使用中更容易找到：

```
docker build -t <your username>/colyseus-server .
```

**步驟 5** 您的映像將會通過以下 Docker 指令列出:
```
docker images

```
輸出:
```
# 示例
REPOSITORY                      TAG     ID              CREATED
node                            12      1934b0b038d1    About a minute ago
<your username>/colseus-server  latest  d64d3505b0d2    About a minute ago
```

**步驟 6** 使用下列指令執行 Docker 鏡像：
```
docker run -p 8080:8080 -d <your username>/colyseus-server
```
使用 -d 執行映像會使容器以分離模式執行,讓容器在後臺執行. 而 -p 標誌將公共端口重定向到容器內的私有端口.


**步驟 7** 完成,現在您可以通過 `localhost:8080` 連線至伺服器

更多資訊：

- [官方 Node.js Docker 镜像](https://hub.docker.com/_/node/)

- [Node.js Docker 最佳實踐指南](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
