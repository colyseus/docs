最後您可能發現會有惡意用戶利用 Colyseus 的房間匹配程序來淹沒您的伺服器, 導致您的伺服器在沒有真實玩家使用的情況下一直在創建和刪除房間.

這種情況下我們建議使用 `express-rate-limit` 中間件來攔截來自同一來源的大量請求. 更多詳情可查看 [`express-rate-limit` 的 README](https://github.com/nfriedly/express-rate-limit);

```
npm install --save express-rate-limit
```

## 用法

```typescript fct_label="TypeScript"
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

```javascript fct_label="JavaScript"
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

若您使用了反向代理(如 Heroku, Bluemix, AWS ELB, Nginx 等), 則必須同時啟用 `"trust proxy"`

```javascript
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
```
