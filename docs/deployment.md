- [Deploying on Heroku](#heroku)
- [Deploying on Nginx (recommended)](#nginx-recommended)

## Heroku

Heroku is recommended just for prototyping. You can deploy the [colyseus-examples](https://github.com/colyseus/colyseus-examples) project on it by hitting this button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/colyseus/colyseus-examples)

## Nginx (recommended)

It's recommended to use `pm2` and `nginx` in your production environment.

### PM2

Install `pm2` in your environment.

```
npm install -g pm2
```

Then start your game server using it:

```
pm2 start your-server.js
```

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
    }
}
```
