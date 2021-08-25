最后您可能发现会有恶意用户利用 Colyseus 的房间匹配程序来淹没您的服务器，导致您的服务器在没有真实玩家使用的情况下一直在创建和删除房间。

这种情况下我们建议使用 {1>express-rate-limit<1} 中间件来拦截来自同一来源的大量请求。更多详情可查看 {2>{3>express-rate-limit<3} 的 README<2};

{1> npm install --save express-rate-limit <1}

## 用法

\`\`\`typescript fct\_label="TypeScript" import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({ windowMs:15 * 60 * 1000, // 15 minutes max:100 }); app.use("/matchmake/", apiLimiter); \`\`\`

\`\`\`javascript fct\_label="JavaScript" const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({ windowMs:15 * 60 * 1000, // 15 minutes max:100 }); app.use("/matchmake/", apiLimiter); \`\`\`


若您使用了反向代理（如 Heroku、Bluemix、AWS ELB、Nginx 等），则必须同时启用 {1>"trust proxy"<1}

{1>javascript // see https://expressjs.com/en/guide/behind-proxies.html app.set('trust proxy', 1); <1}