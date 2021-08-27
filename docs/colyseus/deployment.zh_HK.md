- [Deploying on Heroku](#heroku)
- [Deploying on Nginx (recommended)](#nginx-recommended)
- [Deploying on Apache](#apache)
- [Using greenlock-express](#greenlock-express)
- [Docker](#docker)

## Heroku

推荐仅使用 Heroku 进行原型设计。你可以通过点击这个按钮在上面部署 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 项目：

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**重要事項：**請確保您已妥善設定環境變數 `NPM_CONFIG_PRODUCTION=false`，以便在部署中使用 dev-dependencies，如`ts-node`、`ts-node-dev`等。

## Nginx (recommended)

建議在生產環境中使用`pm2`和`nginx`。

### PM2

在您的環境中安裝`pm2`。

``` npm install -g pm2 ```

然後用它來啟動您的伺服器。

``` pm2 start your-server.js ```

### Nginx配置

\`\`\` server { listen 80; server\_name yourdomain.com;

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
} \`\`\`

### 帶SSL的Nginx配置

建議從[LetsEncrypt](https://letsencrypt.org)獲取您的證書。

\`\`\` server { listen 80; listen 443 ssl; server\_name yourdomain.com;

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
} \`\`\`

## Apache

下面是如何使用Apache作為代理來存取您的Node.js Colyseus應用程式。（感謝[tomkleine](https://github.com/tomkleine)！）

安裝所需的Apache模組：

``` sudo a2enmod ssl sudo a2enmod proxy sudo a2enmod proxy_http sudo a2enmod proxy_html sudo a2enmod proxy_wstunnel ```

Virtual host configuration:

\`\`\` <VirtualHost \*:80> ServerName servername.xyz

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

</VirtualHost> \`\`\`

## greenlock-express

如果您想在您的伺服器上快速配置SSL，而不需要配置反向代理，Greenlock是一個很好的工具。

使用[`greenlock-express`](https://www.npmjs.com/package/greenlock-express)時，您不應該****在其後方配置任何反向代理，如[Nginx](#nginx-recommended)或[Apache](#apache)。

``` npm install --save greenlock-express ```

請先遵循[greenlock-express的README部分](https://www.npmjs.com/package/greenlock-express#1-create-your-project)。

以下是處理開發和生產環境的推薦方法：

\`\`\`typescript import http from "http"; import express from "express"; import { Server } from "colyseus";

function setup(app: express.Application, server: http.Server) { const gameServer = new Server({ server });

  // TODO：根據您的需要配置`app`和`gameServer`。// gameServer.define("room", YourRoom);

  return app; }

if (process.env.NODE\_ENV === "production") { require('greenlock-express') .init(function () { return { greenlock: require('./greenlock'), cluster: false }; }) .ready(function (glx) { const app = express() 。

      // Serves on 80 and 443
      // Get's SSL certificates magically!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });

} else { // development port const PORT = process.env.PORT || 2567;

  const app = express(); const server = http.createServer(app);

  setup(app, server); server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); }

\`\`\`

## Docker

先決條件： 

* `package.json`和`package-lock.json`都在專案中。

* 設定`npm start`指令，使其啟動伺服器
 
步驟：

**第1步**安裝[Docker](https://www.docker.com/)

**第2步** 在colyseus專案的根部建立`Dockerfile` \`\`\`dockerfile FROM node:12

ENV PORT 8080

WORKDIR /usr/src/app

# 使用萬用字元來確保package.json和package-lock.json都被正確複製。
COPY package\*.json ./

RUN npm ci
# 為生產執行此程式
# npm ci --only=production

COPY ..

EXPOSE 8080

CMD \[ "npm", "start" ] ``` **第3步** 在同一目錄下建立`.dockerignore`文件 ``` node\_modules npm-debug.log \`\` 這將防止您的本機模組和除錯日誌被複製到您的Docker鏡像上，並可能覆蓋您鏡像中安裝的模組。

**第4步**進入存放Docker檔案的目錄，執行以下指令來組建Docker鏡像。-t標誌可以讓您標記您的鏡像，以便日後使用docker images指令來更輕易地找到它：

``` docker build -t <your username>/colyseus-server .```

**第5步** 您的鏡像現在將被Docker用以下指令列出。\`\`\` docker images

``` Output: ```
# 範例
REPOSITORY TAG ID CREATED node 12 1934b0b038d1 About a minute ago <your username>/colseus-server latest d64d3505b0d2 About a minute ago \`\`\`

**第6步**用以下指令執行Docker鏡像。``` docker run -p 8080:8080 -d <your username>/colyseus-server ``` 用-d執行您的鏡像，以分離模式執行容器，讓容器在後台執行。-p標誌將一個公共埠口重新定向到容器內的一個私有埠口。


**第7步** 完成了。現在，您可以用`localhost:8080`連接到伺服器。

更多資訊：

- [官方的Node.js Docker鏡像](https://hub.docker.com/_/node/)。

- [Node.js Docker最佳實踐指南](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)
