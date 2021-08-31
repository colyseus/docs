您最終可能會發現惡意使用者利用 Colyseus 的匹配來淹沒您的伺服器房間，從而導致您的伺服器在沒有真正使用玩家的情況下建立和刪除房間。

建議使用 `express-rate-limit` 中間件來阻止來自同一來源的過多請求。查看有關 [`express-rate-limit` 的 README](https://github.com/nfriedly/express-rate-limit) 詳情；

``` npm install --save express-rate-limit ```

## 使用方式

```typescript fct\_label="TypeScript" import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({ windowMs:15 * 60 * 1000, // 最長 15 分鐘：100 }); app.use("/matchmake/", apiLimiter); ```

```javascript fct\_label="JavaScript" const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({ windowMs:15 * 60 * 1000, // 最長 15 分鐘：100 }); app.use("/matchmake/", apiLimiter); ```


如果您使用反向代理（如 Heroku、Bluemix、AWS ELB、Nginx 等），您還必須啟用 `"trust proxy"`

```javascript // 參見 https://expressjs.com/en/guide/behind-proxies.html app.set('trust proxy', 1); ```}