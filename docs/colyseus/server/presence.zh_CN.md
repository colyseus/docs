# 伺服器 API » 目前狀態

當您需要在多個處理序和/或多部機器上縮放伺服器時， 您必須提供{1>{2>目前狀態<2}<1}選項至{3>伺服器<3}。{4>目前狀態<4}的目的是允許在不同處裡序間通訊與分享資料，特別是在進行配對的時候。

- {1>{2>LocalPresence<2}<1}（預設）
- {1>{2>RedisPresence<2}<1}

{1>目前狀態<1}執行個體也可用於每個{2>房間<2}處理常式。您可以透過 PUB/SUB 使用其 {3>API<3} 保存房間之間的資料和通訊。

### {1>LocalPresence<1}

這是預設選項。這選項是您在單一處理序中執行 Colyseus 時會使用的。

### {1>RedisPresence (clientOpts?)<1}

當您在多個處理序和/或多部機器執行 Colyseus 時，使用此選項。

{1>參數：<1}

- {1>clientOpts<1}：Redis 用戶端選項（主機/認證）。{2>查看選項的完整清單<2}。

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

// 這會在從屬處理序中發生。 const gameServer = new Server({ // ... presence: new RedisPresence() });

gameServer.listen(2567); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require('colyseus');

// 這會在從屬處理序中發生。 const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() });

gameServer.listen(2567); \`\`\`

## API

{1>目前狀態<1} API 高度基於 Redis 的 API，這是個索引鍵值資料庫。

每個{1>{2>房間<2}<1}執行個體都具有{3>{4>目前狀態<4}<3}屬性，其實作以下方法：

### {1}subscribe(topic: string, callback:Function){2}

訂閱指定的{1>主題<1}。訊息於{4>主題<4}{3>發佈<3}時會觸發{2>回調<2}。

### {1>unsubscribe(topic: string)<1}

取消訂閱指定的{1>主題<1}。

### {1>publish(topic: string, data: any)<1}

張貼訊息至指定的{1>主題<1}。

### {1}exists(key: string):Promise<boolean>{2}

如果索引鍵存在，則進行傳回。

### {1>setex(key: string, value: string, seconds: number)<1}

將索引鍵設為保留字串值，並將索引鍵設為在指定秒數後逾時。

### {1>get(key: string)<1}

取得索引鍵值。

### {1>del(key: string): void<1}

移除指定的索引鍵。

### {1>sadd(key: string, value: any)<1}

將指定的成員新增至儲存在索引鍵的集合中。會忽略已經是此集合之成員的指定成員。如果索引鍵不存在，則會在新增指定的成員前建立新的集合。

### {1>smembers(key: string)<1}

傳回所有儲存在索引鍵的集合值成員。

### {1>sismember(member: string)<1}

如果{1>成員<1}是儲存在索引鍵的集合成員，則進行傳回。

{1>傳回值<1}

- {1>1<1} 如果元素是集合成員。
- {1>0<1} 如果元素不是集合成員，或如果索引鍵不存在。

### {1>srem(key: string, value: any)<1}

自儲存在索引鍵的集合中移除指定的成員。會忽略不是此集合之成員的指定成員。如果索引鍵不存在，會將其視為空集合且此命令傳回 0。

### {1>scard(key: string)<1}

傳回儲存在索引鍵之集合的集合基數（元素數）。

### {1>sinter(...keys: string\[])<1}

傳回集合的成員，該集合為指定集合交集的結果。

### {1>hset(key: string, field: string, value: string)<1}

將儲存在索引鍵的雜湊中的欄位設為值。如果索引鍵不存在，則會建立保有雜湊的新索引鍵。如果欄位已存在於雜湊，則會覆寫。

### {1>hincrby(key: string, field: string, value: number)<1}

以遞增方式，增加儲存在索引鍵中的雜湊中，儲存在欄位中的數字。如果索引鍵不存在，則會建立保有雜湊的新索引鍵。如果欄位不存在，則在執行作業前，值會設為 0。

### {1}hget(key: string, field: string):Promise<string>{2}

傳回關聯於儲存在索引鍵中之雜湊的欄位的值。

### {1}hgetall(key: string):Promise<{\[field: string]: string}>{2}

傳回儲存在索引鍵中之雜湊的所有欄位和值。

### {1>hdel(key: string, field: string)<1}

自儲存在索引鍵中的欄位移除指定的欄位。會忽略不存在此雜湊中的指定欄位。如果索引鍵不存在，則會將其視為空雜湊，且此命令傳回 0。

### {1}hlen(key: string):Promise<number>{2}

傳回儲存在索引鍵中之雜湊包含的欄位數字。

### {1>incr(key: string)<1}

將儲存在索引鍵中的數字增加一。如果該索引鍵不存在，則會在執行作業前將其設為 0。如果索引鍵包含錯誤類型的值或包含無法以整數呈現的字串，則會傳回錯誤。此作業僅限 64 位元帶正負號的整數。

### {1>decr(key: string)<1}

將儲存在索引鍵中的數字減少一。如果該索引鍵不存在，則會在執行作業前將其設為 0。如果索引鍵包含錯誤類型的值或包含無法以整數呈現的字串，則會傳回錯誤。此作業僅限 64 位元帶正負號的整數。
