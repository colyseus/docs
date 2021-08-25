- {1>在 Heroku 上部署<1}
- {1>在 Nginx 上部署（推薦）<1}
- {1>在 Apache 上部署<1}
- {1>使用 greenlock-express<1}
- {1>Docker<1}

## Heroku

Heroku 只推薦用於原型設計。您可以透過點擊此按鈕在其上部署 {1>colyseus-examples<1} 專案：

{1>部署代碼<1}



## {1>在 Nginx 上部署（推薦）<1}



### 



{1> npm install -g pm2 <1}





### 伺服器端設定



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

### 





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

## 







伺服器端設定



    # Redirect all requests received from port 80 to the HTTPS variant (force ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

}; \`\`\`



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

}; \`\`\`

## {1>使用 greenlock-express<1}





{1> npm install --save express-rate-limit <1}





\`\`\`typescript fct\_label="TypeScript" import http from "http"; import express from "express"; import cors from "cors"; import { Server } from "colyseus";



  

  {1>Return type:<1}



      // Serves on 80 and 443
      // Get's SSL certificates magically!
      glx.serveApp(setup(app, glx.httpsServer(undefined, app)));
    });



  const app = express(); const server = createServer(app); // create the http server manually

  gameServer.listen(PORT); console.log("Listening on", PORT); \`\`\`

\`\`\`

## {1>Docker<1}

 

* 

* 
 










# 
Package.json 用法


# 
# 













{1>Output:<1}
# 範例









- 

- 
