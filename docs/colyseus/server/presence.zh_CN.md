# 伺服器 API » 目前狀態

當您需要在多個處理序和/或多部機器上縮放伺服器時， 您必須提供[`目前狀態`](/server/api/#optionspresence)選項至`伺服器`。`目前狀態`的目的是允許在不同處裡序間通訊與分享資料，特別是在進行配對的時候。

- [`LocalPresence`](#localpresence)（預設）
- [`RedisPresence`](#redispresence-clientopts)

`目前狀態`執行個體也可用於每個`房間`處理常式。您可以透過 PUB/SUB 使用其 [API](#api) 保存房間之間的資料和通訊。

### `LocalPresence`

這是預設選項。這選項是您在單一處理序中執行 Colyseus 時會使用的。

### `RedisPresence (clientOpts?)`

當您在多個處理序和/或多部機器執行 Colyseus 時，使用此選項。

**參數：**

- `clientOpts`：Redis 用戶端選項（主機/認證）。[查看選項的完整清單](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/redis/index.d.ts#L28-L52)。

\`\`\`typescript fct\_label="TypeScript" import { Server, RedisPresence } from "colyseus";

// 這會在從屬處理序中發生。 const gameServer = new Server({ // ... presence: new RedisPresence() });

gameServer.listen(2567); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const colyseus = require('colyseus');

// 這會在從屬處理序中發生。 const gameServer = new colyseus.Server({ // ... presence: new colyseus.RedisPresence() });

gameServer.listen(2567); \`\`\`

## API

`目前狀態` API 高度基於 Redis 的 API，這是個索引鍵值資料庫。

每個[`房間`](/server/room)執行個體都具有[`目前狀態`](/server/room/#presence-presence)屬性，其實作以下方法：

### `subscribe(topic: string, callback:Function)`

訂閱指定的`主題`。訊息於`主題`[發佈](#publishtopic-string-data-any)時會觸發`回調`。

### `unsubscribe(topic: string)`

取消訂閱指定的`主題`。

### `publish(topic: string, data: any)`

張貼訊息至指定的`主題`。

### `exists(key: string):Promise<boolean>`

如果索引鍵存在，則進行傳回。

### `setex(key: string, value: string, seconds: number)`

將索引鍵設為保留字串值，並將索引鍵設為在指定秒數後逾時。

### `get(key: string)`

取得索引鍵值。

### `del(key: string): void`

移除指定的索引鍵。

### `sadd(key: string, value: any)`

將指定的成員新增至儲存在索引鍵的集合中。會忽略已經是此集合之成員的指定成員。如果索引鍵不存在，則會在新增指定的成員前建立新的集合。

### `smembers(key: string)`

傳回所有儲存在索引鍵的集合值成員。

### `sismember(member: string)`

如果\\`成員`是儲存在索引鍵的集合成員，則進行傳回。

**傳回值**

- `1` 如果元素是集合成員。
- `0` 如果元素不是集合成員，或如果索引鍵不存在。

### `srem(key: string, value: any)`

自儲存在索引鍵的集合中移除指定的成員。會忽略不是此集合之成員的指定成員。如果索引鍵不存在，會將其視為空集合且此命令傳回 0。

### `scard(key: string)`

傳回儲存在索引鍵之集合的集合基數（元素數）。

### `sinter(...keys: string[])`

傳回集合的成員，該集合為指定集合交集的結果。

### `hset(key: string, field: string, value: string)`

將儲存在索引鍵的雜湊中的欄位設為值。如果索引鍵不存在，則會建立保有雜湊的新索引鍵。如果欄位已存在於雜湊，則會覆寫。

### `hincrby(key: string, field: string, value: number)`

以遞增方式，增加儲存在索引鍵中的雜湊中，儲存在欄位中的數字。如果索引鍵不存在，則會建立保有雜湊的新索引鍵。如果欄位不存在，則在執行作業前，值會設為 0。

### `hget(key: string, field: string):Promise<string>`

傳回關聯於儲存在索引鍵中之雜湊的欄位的值。

### `hgetall(key: string):Promise<{\[field: string]: string}>`

傳回儲存在索引鍵中之雜湊的所有欄位和值。

### `hdel(key: string, field: string)`

自儲存在索引鍵中的欄位移除指定的欄位。會忽略不存在此雜湊中的指定欄位。如果索引鍵不存在，則會將其視為空雜湊，且此命令傳回 0。

### `hlen(key: string):Promise<number>`

傳回儲存在索引鍵中之雜湊包含的欄位數字。

### `incr(key: string)`

將儲存在索引鍵中的數字增加一。如果該索引鍵不存在，則會在執行作業前將其設為 0。如果索引鍵包含錯誤類型的值或包含無法以整數呈現的字串，則會傳回錯誤。此作業僅限 64 位元帶正負號的整數。

### `decr(key: string)`

將儲存在索引鍵中的數字減少一。如果該索引鍵不存在，則會在執行作業前將其設為 0。如果索引鍵包含錯誤類型的值或包含無法以整數呈現的字串，則會傳回錯誤。此作業僅限 64 位元帶正負號的整數。
