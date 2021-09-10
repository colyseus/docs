- [在 Heroku 上部署服务器](#heroku)
- [在 Nginx 上部署服务器 (官方推荐)](#nginx-recommended)
- [在 Apache 上部署服务器](#apache)
- [使用 greenlock-express](#greenlock-express)
- [Docker](#docker)

## Heroku

建议您只有在进行游戏原型设计阶段使用 Heroku. 通过点击下面的按钮就能部署 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 项目：

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**注意:** 开发环境要设置 `NPM_CONFIG_PRODUCTION=false`, 以便引用开发依赖包, 如 `ts-node`, `ts-node-dev` 等.

## Nginx (recommended)

建议您在商用环境中使用 `pm2` 和 `nginx`.

### PM2

安装 `pm2`.

```
npm install -g pm2
```

然后使用它启动服务器:

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

### 为 Nginx 配置 SSL

建议您通过 [LetsEncrypt](https://letsencrypt.org) 获取证书.

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

下面介绍了如何使用 Apache 作为 Node.js Colyseus 程序的代理. (感谢 [tomkleine](https://github.com/tomkleine)!)

需要安装的 Apache 模块:

```
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo a2enmod proxy_wstunnel
```

虚拟托管配置:

```
<VirtualHost *:80>
    ServerName servername.xyz

    # 把从 80 端口收到的请求全部转发至 HTTPS 端口 (强制使用 ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost \*:443> ServerName servername.xyz

    # 开启 SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # 让代理把 websocket 协议的请求转发给 websocket 服务器
    # 反之亦然, 这样就不用修改 colyseus 库和程序了)
    #
    # (注意: 代理会自动把 websocket 转换为加密版本 (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # 让代理把 https 协议的请求转发给 http 服务器
    # (同样自动把 https 转换为 http, 反之亦然)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost>
```

## greenlock-express

想快速配置好 SSL, 而又不想要反向代理, Greenlock 是一个很好的选择.

使用 [`greenlock-express`](https://www.npmjs.com/package/greenlock-express) 时, **不应** 再为它配置任何反向代理, 如 [Nginx](#nginx-recommended) 或 [Apache](#apache).

```
npm install --save greenlock-express
```

详情请参考 [greenlock-express 的 README](https://www.npmjs.com/package/greenlock-express#1-create-your-project).

下面是官方推荐的配置, 开发环境和商用环境都适用:

```typescript
import http from "http";
import express from "express";
import { Server } from "colyseus";

function setup(app: express.Application, server: http.Server) {
  const gameServer = new Server({ server });

  // TODO：按需配置 `app` 和 `gameServer`.
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
       .ready(function (glx) {
         const app = express();

      // 服务于 80 和 443 端口
      // 神奇地自动获取 SSL 证书!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else {
  // 开发环境端口
  const PORT = process.env.PORT || 2567;

  const app = express();
  const server = http.createServer(app);

  setup(app, server);
  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}

```

## Docker

准备工作:

* 确保项目里有 `package.json` 和 `package-lock.json`.

* 配置 `npm start` 脚本以便启动服务器.

步骤:

**第1步** 安裝 [Docker](https://www.docker.com/)

**第2步** 在 colyseus 项目的根目录新建 `Dockerfile`
```dockerfile
FROM node:12

ENV PORT 8080

WORKDIR /usr/src/app

# 使用通配符确保 package.json 和 package-lock.json 文件都能被复制
COPY package\*.json ./

RUN npm ci
# 只在商用环境下启动
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD \[ "npm", "start" ]
```
**第3步** 在上述目录下新建 `.dockerignore` 文件
```
node\_modules
npm-debug.log
```
这样可以防止将本地模块和调试日志错被复制到 Docker 镜像上覆盖掉镜像内的模块.

**第4步** 在 Dockerfile 目录下执行以下命令執行以下指令来编译镜像. -t 参数用以设置镜像的类目, 以便日后查找方便:

```
docker build -t <your username>/colyseus-server .
```

**第5步** 用以下命令列出 Docker 镜像:
```
docker images

```
输出:
```
# 类似
REPOSITORY                      TAG     ID              CREATED
node                            12      1934b0b038d1    About a minute ago
<your username>/colseus-server  latest  d64d3505b0d2    About a minute ago
```

**第6步** 用以下命令运行 Docker 镜像:
```
docker run -p 8080:8080 -d <your username>/colyseus-server
```
用 -d 参数使用脱离模式, 在后台运行镜像. -p 参数把公开端口映射到容器内的私有端口.


**第7步** 完成. 现在就可以通过 `localhost:8080` 访问服务器了.

更多参考:

- [官方 Node.js Docker 镜像](https://hub.docker.com/_/node/)

- [Node.js Docker 最佳实践指南](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
