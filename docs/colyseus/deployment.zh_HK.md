- [Colyseus Arena](#colyseus-arena)
- [在 Heroku 上部署服務器](#heroku)
- [在 Nginx 上部署服務器 (官方推薦)](#nginx-recommended)
- [在 Apache 上部署服務器](#apache)
- [使用 greenlock-express](#greenlock-express)
- [Docker](#docker)

## Colyseus Arena

部署 Colyseus 服務器最簡便的方法是使用 [Colyseus Arena](/arena). 能在 5 分鐘之內安裝部署並成功運行您的服務程序.

## Heroku

建議您只有在進行遊戲原型設計階段使用 Heroku. 通過點擊下面的按鈕就能部署 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 項目:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

在 Heroku 上進行 Colyseus 服務器擴展是不現實的. 我們不建議您將商業化 Colyseus 部署在 Heroku 上.

**註意:** 開發環境要設置 `NPM_CONFIG_PRODUCTION=false`, 以便引用開發依賴包, 如 `ts-node`, `ts-node-dev` 等.

## Nginx (recommended)

建議您在商用環境中使用 `pm2` 和 `nginx`.

### PM2

安裝 `pm2`.

```
npm install -g pm2
```

然後使用它啟動服務器:

```
pm2 start your-server.js
```

### Nginx配置

```
server {
    listen 80;
    server_name yourdomain.com;

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

### 為 Nginx 配置 SSL

建議您通過 [LetsEncrypt](https://letsencrypt.org) 獲取證書.

```
server {
    listen 80;
    listen 443 ssl;
    server_name yourdomain.com;

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

下面介紹了如何使用 Apache 作為 Node.js Colyseus 程序的代理. (感謝 [tomkleine](https://github.com/tomkleine)!)

需要安裝的 Apache 模塊:

```
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo a2enmod proxy_wstunnel
```

虛擬托管配置:

```
<VirtualHost *:80>
    ServerName servername.xyz

    # 把從 80 端口收到的請求全部轉發至 HTTPS 端口 (強製使用 ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost *:443>
    ServerName servername.xyz

    # 開啟 SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # 讓代理把 websocket 協議的請求轉發給 websocket 服務器
    # 反之亦然, 這樣就不用修改 colyseus 庫和程序了
    #
    # 註意: 代理會自動把 websocket 轉換為加密版本 (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # 讓代理把 https 協議的請求轉發給 http 服務器
    # (同樣自動把 https 轉換為 http, 反之亦然)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost>
```

## greenlock-express

想快速配置好 SSL, 而又不想要反向代理, Greenlock 是一個很好的選擇.

使用 [`greenlock-express`](https://www.npmjs.com/package/greenlock-express) 時, **不應** 再為它配置任何反向代理, 如 [Nginx](#nginx-recommended) 或 [Apache](#apache).

```
npm install --save greenlock-express
```

詳情請參考 [greenlock-express 的 README](https://www.npmjs.com/package/greenlock-express#1-create-your-project).

下面是官方推薦的配置, 開發環境和商用環境都適用:

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

if (process.env.NODE_ENV === "production") {
  require('greenlock-express')
    .init(function () {
      return {
        greenlock: require('./greenlock'),
        cluster: false
      };
    })
    .ready(function (glx) {
        const app = express();

      // 服務於 80 和 443 端口
      // 神奇地自動獲取 SSL 證書!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else {
  // 開發環境端口
  const PORT = process.env.PORT || 2567;

  const app = express();
  const server = http.createServer(app);

  setup(app, server);
  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

```

## Docker

準備工作:

* 確保項目裏有 `package.json` 和 `package-lock.json`.

* 配置 `npm start` 腳本以便啟動服務器.

步驟:

**第1步** 安裝 [Docker](https://www.docker.com/)

**第2步** 在 colyseus 項目的根目錄新建 `Dockerfile`
```dockerfile
FROM node:14

ENV PORT 8080

WORKDIR /usr/src/app

# 使用通配符確保 package.json 和 package-lock.json 文件都能被復製

COPY package*.json ./

RUN npm ci
# 只在商用環境下啟動
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```
**第3步** 在上述目錄下新建 `.dockerignore` 文件
```
node_modules
npm-debug.log
```
這樣可以防止將本地模塊和調試日誌錯被復製到 Docker 鏡像上覆蓋掉鏡像內的模塊.

**第4步** 在 Dockerfile 目錄下執行以下命令執行以下指令來編譯鏡像. -t 參數用以設置鏡像的類目, 以便日後查找方便:

```
docker build -t <your username>/colyseus-server .
```

**第5步** 用以下命令列出 Docker 鏡像:
```
docker images

```
輸出:
```
# 類似
REPOSITORY                      TAG     ID              CREATED
node                            14      1934b0b038d1    About a minute ago
<your username>/colseus-server  latest  d64d3505b0d2    About a minute ago
```

**第6步** 用以下命令運行 Docker 鏡像:
```
docker run -p 8080:8080 -d <your username>/colyseus-server
```
用 -d 參數使用脫離模式, 在後臺運行鏡像. -p 參數把公開端口映射到容器內的私有端口.


**第7步** 完成. 現在就可以通過 `localhost:8080` 訪問服務器了.

更多參考:

- [官方 Node.js Docker 鏡像](https://hub.docker.com/_/node/)

- [Node.js Docker 最佳實踐指南](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
- 