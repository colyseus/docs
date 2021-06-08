# Cocos Creator 3 

[Cocos Creator](https://cocos.com/creator) is a Cross-Platform 2D/3D Game Creation Tool.

## 1. Install the extension

- [Open the Cocos Store](https://store.cocos.com/app/en/detail/2937/) (Menu: "Extension" &raquo; "Store")
- Search for "Colyseus SDK"
- Get the extension

## 2. Update your `tsconfig.json`

Make sure you have `"esModuleInterop": true` under `"compilerOptions"`:

```json
  // tsconfig.json
  // ...

  /* Add your custom configuration here. */
  "compilerOptions": {
    "esModuleInterop": true
  }
  // ...
```

## Usage

- Create a new TypeScript component, and add the 


## How to manually add the `colyseus.js` file into your project (without the extension)

- [Download the latest `colyseus-js-client.zip` release from GitHub](https://github.com/colyseus/colyseus.js/releases).
- Unzip the `colyseus-js-client.zip` file into the `assets/` folder.
- Move both `colyseus.js` and `colyseus.d.ts` files into your Cocos Creator project's `scripts` folder.
- Click on the `colyseus.js` file from the Assets panel, and enable to "Import As Plugin" (see image below)
- **TypeScript**: require it using `import Colyseus from "./colyseus.js";`
- **JavaScript**: require it using `const Colyseus = require("./colyseus.js");`

![Import as plugin](cocos-creator-import-as-plugin.png)
