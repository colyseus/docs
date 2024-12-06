# Logging

Colyseus allows you to import a `logger` variable, which is customizable via its
initial settings.

```typescript
import { logger } from "@colyseus/core";
// ...

logger.debug("this is debug");
logger.log("this is a log");
logger.info("this is information");
logger.warn("this is a warning");
logger.error("this is an error");
```

By default, the `logger` instance is just an alias to `console`. You may want to
use a different logger than `console` for a number of different reasons, such
as:

- External logging storage
- Configure different logging levels
- Customize logging output
- (...) more!

**Customizing the logger**

=== "`app.config.ts`"

    ``` typescript
    import config from "@colyseus/tools";

    export default config({
      // ...

      options: {
        logger: yourPreferredLoggerInstance
      }

      // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "@colyseus/core";

    const gameServer = new Server({
        logger: yourPreferredLoggerInstance
    })
    ```

---

## Chosing your preferred logger

The Node.js ecosystem has a few different logging solutions, each of them has its own advantages and disadvantages, such as:

- [pino](https://www.npmjs.com/package/pino)
- [Winston](https://www.npmjs.com/package/winston)
- [Bunyan](https://www.npmjs.com/package/bunyan)

---

## Using `pino` as your logger

Install the `pino` module:

```
npm install --save pino
```

Configure it in your application:

=== "`app.config.ts`"

    ``` typescript
    import config from "@colyseus/tools";
    import pino from "pino";

    export default config({
      // ...

      options: {
        logger: pino({
          level: 50,
          msgPrefix: '[HTTP] '
        })
      }

      // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "@colyseus/core";
    import pino from "pino";

    const gameServer = new Server({
        logger: pino({
            level: 50,
            msgPrefix: '[HTTP] '
        }),
    })
    ```

See [full documentation for `pino` options](https://github.com/pinojs/pino/blob/HEAD/docs/api.md).

---

## Using `winston` as your logger

Install the `winston` module:

```
npm install --save winston
```

Configure it in your application:

=== "`app.config.ts`"

    ``` typescript
    import config from "@colyseus/tools";
    import winston from "winston";

    export default config({
      // ...

      options: {
        logger: winston.createLogger({
          level: 'info',
          format: winston.format.json(),
          defaultMeta: { service: 'user-service' },
          transports: [
            //
            // - Write all logs with importance level of `error` or less to `error.log`
            // - Write all logs with importance level of `info` or less to `combined.log`
            //
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
          ],
        })
      }

      // ...
    });
    ```

=== "Server constructor"

    ``` typescript
    import { Server } from "@colyseus/core";
    import winston from "winston";

    const gameServer = new Server({
      logger: winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
          //
          // - Write all logs with importance level of `error` or less to `error.log`
          // - Write all logs with importance level of `info` or less to `combined.log`
          //
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'combined.log' }),
        ],
      })
    })
    ```

See [full documentation for `winston` options](https://github.com/winstonjs/winston#table-of-contents).
