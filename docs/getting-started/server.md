# Getting started

Colyseus requires [Node.js](https://nodejs.org/) v8.0 or higher.

## From examples project

See some examples in action by cloning the [examples project](https://github.com/colyseus/colyseus-examples) and running it locally.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm install
```

To run the http + websocket server, run `npm start`.


## Creating a barebones Colyseus server

Use the `npm init colyseus-app` command to generate a barebones Colyseus server. You may select between TypeScript (recommended), JavaScript and Haxe as your language of choice for the server.

```
npm init colyseus-app ./my-colyseus-app
```

See the contents of the project templates:

- [TypeScript](https://github.com/colyseus/create-colyseus-app/tree/typescript)
- [JavaScript](https://github.com/colyseus/create-colyseus-app/tree/javascript)
- [Haxe](https://github.com/colyseus/create-colyseus-app/tree/haxe)
