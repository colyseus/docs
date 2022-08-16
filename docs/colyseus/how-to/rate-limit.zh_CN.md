您可能发现总有恶意用户利用 Colyseus 的 matchmaking 服务进行攻击, 导致您的服务器在不断创建和删除房间却不是为正式玩家服务.

这种情况下建议使用 `express-rate-limit` 中间件来拦截来自同一来源的大量请求. 更多详情参见 [`express-rate-limit` 的 README](https://github.com/nfriedly/express-rate-limit).

```
npm install --save express-rate-limit
```

## 用法

```typescript fct_label="TypeScript"
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

```javascript fct_label="JavaScript"
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100
});
app.use("/matchmake/", apiLimiter);
```

若您使用了反向代理 (如 Heroku, Bluemix, AWS ELB, Nginx 等), 则必须同时开启 `"trust proxy"`

```javascript
// 参见 https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
```
