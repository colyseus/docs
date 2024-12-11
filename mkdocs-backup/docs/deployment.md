- [Colyseus Cloud](#colyseus-cloud-managed-hosting)
- [Self-host on Vultr](#self-host-on-vultr)
- [Nginx configuration](#nginx-configuration)
- [Apache configuration](#apache-configuration)
- [Docker](#docker)
- [Heroku](#heroku)

Deploying Colyseus for a single-process environment is no different than deploying a regular Node.js application ([see a good article here](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)).

However, deploying Colyseus for a multi-process environment requires some [extra steps](/scalability/).

## Colyseus Cloud - Managed Hosting

The easiest way to deploy your Colyseus server is to use the [Colyseus Cloud](https://cloud.colyseus.io). It should take less than 15 minutes to get your server up and ready for production.

Colyseus Cloud uses NGINX, PM2, and requires you to use the `@colyseus/tools`
package for easy integration with its infrastructure.

See the configuration required for deploying on Colyseus Cloud:

=== "`index.ts`"

    ```typescript
    import { listen } from "@colyseus/tools";

    // Import Colyseus config
    import app from "./app.config";

    // Create and listen on 2567 (or PORT environment variable.)
    listen(app);
    ```

=== "`app.config.ts`"

    ```typescript
    import config from "@colyseus/tools";
    import { MyRoom } from "./rooms/MyRoom";

    export default config({
        initializeGameServer: (gameServer) => {
            // gameServer.define("my_room", MyRoom)
        },
    });
    ```

=== "`ecosystem.config.js`"

    ```typescript
    const os = require('os');

    module.exports = {
      apps : [{
        name: "colyseus-app",
        script: 'build/index.js',
        time: true,
        watch: false,
        instances: os.cpus().length,
        exec_mode: 'fork',
        wait_ready: true,
        env_production: {
          NODE_ENV: 'production'
        }
      }],
    };
    ```

The [`create-colyseus-app` templates](https://github.com/colyseus/create-colyseus-app/tree/master/templates) are ready for deployment on Colyseus Cloud.

---

## Self-host on [Vultr](https://www.vultr.com/?ref=9632185-9J)

<!-- https://www.vultr.com/?ref=8013231 -->
<!-- https://www.vultr.com/marketplace/apps/colyseus/?ref=8013231 -->

A pre-configured Colyseus server is available on [Vultr Marketplace](https://www.vultr.com/marketplace/apps/colyseus/?ref=9632185-9J). It's a great option if you want to self-host your Colyseus server.

This server is configured with:

- Node.js LTS
- PM2
- Nginx
- FREE `colyseus.dev` subdomain with SSL (Let's Encrypt)

Follow the instructions at Vultr Marketplace to get your server up and running.

---

## Nginx configuration

When self-hosting, it is recommended to use `nginx` and `pm2` in your production environment.

### Nginx configuration

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
        include proxy_params;
    }
}
```

### Nginx configuration with SSL

It's recommended to acquire your certificate from [LetsEncrypt](https://letsencrypt.org).

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
        include proxy_params;
    }
}
```

---

## Apache configuration

Here's how to use Apache as a proxy to your Node.js Colyseus app. (Thanks [tomkleine](https://github.com/tomkleine)!)

Install the required Apache modules:

``` bash
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_html
sudo a2enmod proxy_wstunnel
```

Virtual host configuration:

```
<VirtualHost *:80>
    ServerName servername.xyz

    # Redirect all requests received from port 80 to the HTTPS variant (force ssl)
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]

</VirtualHost>

<VirtualHost *:443>
    ServerName servername.xyz

    # enable SSL
    SSLEngine On
    SSLCertificateFile          /PATH/TO/CERT/FILE
    SSLCertificateKeyFile       /PATH/TO/PRIVATE/KEY/FILE

    #
    # setup the proxy to forward websocket requests properly to a normal websocket
    # and vice versa, so there's no need to change the colyseus library or the
    # server for that matter
    #
    # note: this proxy automatically converts the secure websocket (wss)

    RewriteEngine On
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$           [NC,OR]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$          [NC]
    RewriteRule .* ws://127.0.0.1:APP-PORT-HERE%{REQUEST_URI}  [P,QSA,L]

    # setup the proxy to forward all https requests to http backend
    # (also automatic conversion from https to http and vice versa)

    ProxyPass "/" "http://localhost:APP-PORT-HERE/"
    ProxyPassReverse "/" "http://localhost:APP-PORT-HERE/"

</VirtualHost>
```

---

## Docker

Prerequisite:

* `package.json` and `package-lock.json` are in the project.

* Set up the `npm start` command so it starts the server

Steps:

**Step 1** Install [Docker](https://www.docker.com/)

**Step 2** Create `Dockerfile` in the root of the colyseus project
```dockerfile
FROM node:14

ENV PORT 8080

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci
# run this for production
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```
**Step 3** Create `.dockerignore` file in the same directory
```
node_modules
npm-debug.log
```
This will prevent your local modules and debug logs from being copied onto your Docker image and possibly overwriting modules installed within your image.

**Step 4** Go to the directory that has your Dockerfile and run the following command to build the Docker image. The -t flag lets you tag your image so it's easier to find later using the docker images command:

```
docker build -t <your username>/colyseus-server .
```

**Step 5** Your image will now be listed by Docker with following command:
```
docker images

```
Output:
```
# Example
REPOSITORY                      TAG        ID              CREATED
node                            14         1934b0b038d1    About a minute ago
<your username>/colseus-server    latest     d64d3505b0d2    About a minute ago
```

**Step 6** Run the Docker Image with following command:
```
docker run -p 8080:8080 -d <your username>/colyseus-server
```
Running your image with -d runs the container in detached mode, leaving the container running in the background. The -p flag redirects a public port to a private port inside the container.


**Step 7** Done, now you can connect to the server with `localhost:8080`

More informations:

- [Official Node.js Docker Image](https://hub.docker.com/_/node/)

- [Node.js Docker Best Practices Guide](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md)

---

## Heroku

Heroku can be used for prototyping. You can deploy the [colyseus-examples](https://github.com/colyseus/colyseus-examples) project on it by hitting this button:

Keep in mind that scaling to multiple processes and/or nodes on Heroku is not supported out of the box, therefore we don't recommend using it in a production environment.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

**Important:** Make sure to set the environment variable `NPM_CONFIG_PRODUCTION=false` in order to use dev-dependencies in your deployment.

