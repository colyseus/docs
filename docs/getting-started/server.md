# Getting started

Welcome to the getting started guide to for Colyseus! Before we start, let's make sure we have the necessary system requirements instaled in your local machine.

**Requirements**:

- [Node.js](https://nodejs.org/) v12.0 or higher
- [Git SCM](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) - or other editor of your choice.

## From examples project

See some examples in action by cloning the [examples project](https://github.com/colyseus/colyseus-examples) and running it locally.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm install
```

To run the server locally, run `npm start`, then open [http://localhost:2567](http://localhost:2567) to explore each example.

## Creating a barebones Colyseus server

Use the `npm init colyseus-app` command to generate a barebones Colyseus server. You may select between TypeScript (recommended), JavaScript and Haxe as your language of choice for the server.

```
npm init colyseus-app ./my-colyseus-app
```