# Database Module (`@colyseus/database`)

This module provides additional tooling on top of [Kysely](https://kysely.dev/).

!!! Warning "Why use `@colyseus/database`?"
    There are already [many great tools](/database/#alternative-modules) for working with databases. Why should I use this?

    This module is not meant to compete with existing tools, but to provide additional tooling on top of [Kysely](https://kysely.dev/) - an already established query builder for TypeScript.

    By having our own database module, we can gradually improve it, and work towards providing a better experience for Colyseus users, within the limitations of Kysely.

!!! Tip "This module is optional"
    If you're already familiar with other tool for working with databases, feel free to use it. See [alternative modules we recommend](/database/#alternative-modules).

!!! Note "This module is beta"
    We are looking for feedback from the community. Feedback is welcome [here](https://github.com/colyseus/colyseus/issues/594).

### Features

- SQLite, PostgreSQL and MySQL support
- CLI for Database Migrations
- CLI for TypeScript code generation based on existing database schema

### Installation

```bash
npm install --save @colyseus/database
```

### Usage

=== "`config/database.ts` - SQLite (default)"

    ```typescript
    import { Database } from "@colyseus/database";

    // schema fields
    interface Player {
        name: string;
    }

    const db = new Database<{
        // database schema / types
        players: Player,
    }>();
    ```

=== "`config/database.ts` - PostgreSQL"

    ```typescript
    import { Database, PostgresDialect } from "@colyseus/database";
    import pg from "pg";

    // schema fields
    interface Player {
        name: string;
    }

    const db = new Database<{
        // database schema / types
        players: Player,
    }>({
        // database config
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: "localhost",
                database: "dbname",
            })
        })
    });
    ```