- [在 Heroku 上部署](#heroku)
- [在 Nginx 上部署（推薦）](#nginx-recommended)
- [在 Apache 上部署](#apache)
- [使用 greenlock-express](#greenlock-express)
- [Docker](#docker)

## Heroku

Heroku 只推薦用於原型設計。您可以透過點擊此按鈕在其上部署 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 專案：

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**Important:**一定要将环境变量设为`NPM_CONFIG_PRODUCTION=false`以便在部署中使用dev依赖项，比如`ts-node`, `ts-node-dev`,等。

## Nginx (recommended)

建议在生产环境中使用`pm2`和`nginx`。

### PM2

在你的环境中安装`pm2`。

``` npm install -g pm2 ```

之后使用它启动服务器：

``` pm2 start your-server.js ```

### Nginx configuration

``` server { listen 80; server\_name yourdomain.com;

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
} ```

### 用SSL进行Nginx配置

建议从[LetsEncrypt](https://letsencrypt.org)获取证书。

``` server { listen 80; listen 443 ssl; server\_name yourdomain.com;

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
} ```

## Apache

下面是如果使用Apache作为你的Node.js Colyseus应用的代理。（感谢[tomkleine](https://github.com/tomkleine)！）

安装所需Apache模块：

``` sudo a2enmod ssl sudo a2enmod proxy sudo a2enmod proxy_http sudo a2enmod proxy_html sudo a2enmod proxy_wstunnel ```

Virtual host configuration:

``` <VirtualHost \*:80> ServerName servername.xyz

    # Redirect all requests received from port 80 to the HTTPS variant (force ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost \*:443> ServerName servername.xyz

    # enable SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # setup the proxy to forward websocket requests properly to a normal websocket
    # and vice versa, so there's no need to change the colyseus library or the
    # server for that matter)
    #
    # (note: this proxy automatically converts the secure websocket (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # setup the proxy to forward all https requests to http backend
    # (also automatic conversion from https to http and vice versa)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost> ```

## greenlock-express

如果你想在服务器上快速配置SSL，Greenlock是个不错的工具，不需要配置反向代理。

在使用[`greenlock-express`](https://www.npmjs.com/package/greenlock-express)时，你**not**应该在其后面配置任何反向代理，比如[Nginx](#nginx-recommended)或[Apache](#apache)。

``` npm install --save greenlock-express ```

请遵循[greenlock-express's README section first](https://www.npmjs.com/package/greenlock-express#1-create-your-project)。

下面是处理开发及生产环境的推荐方法：

```typescript import http from "http"; import express from "express"; import { Server } from "colyseus";

function setup(app: express.Application, server: http.Server) { const gameServer = new Server({ server });

  // TODO: configure `app` and `gameServer` accourding to your needs. // gameServer.define("room", YourRoom);

  return app; }

if (process.env.NODE\_ENV === "production") { require('greenlock-express') .init(function () { return { greenlock: require('./greenlock'), cluster: false }; }) .ready(function (glx) { const app = express();

      // Serves on 80 and 443
      // Get's SSL certificates magically!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else { // development port const PORT = process.env.PORT || 2567;

  const app = express(); const server = http.createServer(app);

  setup(app, server); server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); }

```

## Docker

先决条件： 

* `package.json` and `package-lock.json`在项目中。

* 创建`npm start`命令来启动服务器
 
步骤：

**Step 1**安装[Docker](https://www.docker.com/)

**Step 2**在colyseus项目根目录中创建`Dockerfile````dockerfile FROM node:12

ENV 端口 8080

指定工作目录/usr/src/app

# 使用一个通配符来确保package.json和package-lock.json得到复制
COPY package\*.json ./

运行npm ci
# 在生产环境中运行此程序
# npm ci --only=production

复制 . .

公开 8080

CMD \[ "npm", "start" ] ``` **Step 3** Create `.dockerignore` file in the same directory ``` node\_modules npm-debug.log ``` 这将防止你的本地模块和调试日志被复制到Docker映像上，并可能覆盖安装在映像中的模块。

**Step 4**进入存放Dockerfile的目录，运行以下命令构建Docker映像。这个-t标志允许您标记映像，以便稍后使用docker images命令更容易找到：

``` docker build -t <your username>/colyseus-server . ```

**Step 5**你的映像将会通过以下命令按Docker列出：docker images

```Output:```
# 示例
REPOSITORY TAG ID CREATED node 12 1934b0b038d1 About a minute ago <your username>/colseus-server latest d64d3505b0d2 About a minute ago ```

**Step 6**使用下列命令运行Docker Image：``` docker run -p 8080:8080 -d <your username>/colyseus-server ```使用-d运行映像会使容器以分离模式运行，让容器在后台运行。而-p标志将公共端口重定向到容器内的私有端口。


**Step 7**完成，现在你可以通过`localhost:8080`连接至服务器

更多信息：

- [Official Node.js Docker Image](https://hub.docker.com/_/node/)

- [Node.js Docker Best Practices Guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
