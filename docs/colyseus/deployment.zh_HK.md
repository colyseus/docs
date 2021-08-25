- {1>Deploying on Heroku<1}
- {1>Deploying on Nginx (recommended)<1}
- {1>Deploying on Apache<1}
- {1>Using greenlock-express<1}
- {1>Docker<1}

## Heroku

推荐仅使用 Heroku 进行原型设计。你可以通过点击这个按钮在上面部署 {1>colyseus-examples<1} 项目：

{1>部署代码<1}



## {1>Deploying on Nginx (recommended)<1}



### 



{1> npm install -g pm2 <1}





### 服务器端配置



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







服务器端配置



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

## {1>Using greenlock-express<1}





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
# 示例









- 

- 
