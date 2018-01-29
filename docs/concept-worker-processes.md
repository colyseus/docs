# Worker processes

## Clustered environment

The clustered environment is recommended for your production environment. To leverage from it, you'll need to use [`ClusterServer`](https://github.com/gamestdio/colyseus/blob/master/usage/ClusteredServer.ts) class. 

```typescript fct_label="TypeScript"
import * as cluster from "cluster";
import * as path from 'path';
import * as express from 'express';
import { ClusterServer } from "colyseus";

const PORT = 8080;
const gameServer = new ClusterServer();

if (cluster.isMaster) {
  gameServer.listen(PORT);
  gameServer.fork();

} else {
  const app = new express();

  gameServer.attach({ server: app });
}

console.log(`Listening on ${ PORT }`);
```

```typescript fct_label="JavaScript"
const cluster = require("cluster");
const path = require("path");
const express = require("express");
const ClusterServer = require("colyseus").ClusterServer;

const PORT = 8080;
const gameServer = new ClusterServer();

if (cluster.isMaster) {
  gameServer.listen(PORT);
  gameServer.fork();

} else {
  const app = new express();

  gameServer.attach({ server: app });
}

console.log(`Listening on ${ PORT }`);
```


By default, `ClusterServer` spawn a worker process for each CPU available on the host machine.

```
                +----------------+                                                      
                | Master process |                                                      
                +--------|-------+                                                      
                         |                                                              
              +----------+-----------+                                                  
              | Match-making process |                                                  
              +----------------------+                                                  
                         |                                                              
         +----------------                                                              
         |                                                                              
+--------|-------+----------------+----------------+                                    
| Worker process | Worker process | Worker process |                                    
+----------------+----------------+----------------+                                    
  # FooRoom        # FooRoom        # QuxRoom                                           
  # BarRoom                
```

### Master process

The master process will handle redirecting the WebSocket connection to the suitable process. When not connected to a room, the Match-making process will be selected for that connection.

### Match-making process

The Match-making process is responsible for responding to requests for joining a room/session. After the request has been completed, the client will establish a new WebSocket connection which will be redirected the Worker process that room is living in.

### Worker process

Each Worker processes can handle multiple rooms / sessions.

## Single process environment

The single process environment is lightweight and is best for local development and prototyping. You can deploy it on [Zeit Now](deployment#zeit-now) or [Heroku](deployment#heroku) for free.

```typescript fct_label="TypeScript"
import * as http from "http";
import * as express from "express";
import { Server } from "colyseus";

const port = 8080;
const endpoint = "localhost";

const app = express();

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({ server: server });

// Listen on port
gameServer.listen(port);
console.log(`Listening on http://${ endpoint }:${ port }`)
```

```typescript fct_label="JavaScript"
const http = require("http");
const express = require("express");
const Server = require("colyseus").Server;

const port = 8080;
const endpoint = "localhost";

const app = express();

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({ server: server });

// Listen on port
gameServer.listen(port);
console.log(`Listening on http://${ endpoint }:${ port }`)
```