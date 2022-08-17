您可能發現總有惡意用戶利用 Colyseus 的 matchmaking 服務進行攻擊, 導致您的服務器在不斷創建和刪除房間卻不是為正式玩家服務.

這種情況下建議使用 `express-rate-limit` 中間件來攔截來自同一來源的大量請求. 更多詳情參見 [`express-rate-limit` 的 README](https://github.com/nfriedly/express-rate-limit).

```
npm install --save express-rate-limit
```

## 用法

```typescript fct_label="TypeScript"
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

```javascript fct_label="JavaScript"
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

若您使用了反向代理 (如 Heroku, Bluemix, AWS ELB, Nginx 等), 則必須同時開啟 `"trust proxy"`

```javascript
// 參見 https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
```
