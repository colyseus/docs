# Database & Persistance

Colyseus is agnostic to the database you use. You can use your preferred Node.js tool for working with databases.

## Recommendation: `@colyseus/database`

We are working on our own database tools built on top of [Kysely](https://kysely.dev/).

See how to use it at [:octicons-database-16: Database Module (`@colyseus/database`)](/database/module).

---

## Alternative modules

You can use your preferred Node.js tool for working with databases. Query builders are known for their simplicity and flexibility, while ORMs are known for abstracting the database layer and providing a more object-oriented approach.

### ORMs (Object-Relational Mappers)

- [DrizzleORM](https://orm.drizzle.team/)
- [Sequelize](https://sequelize.org/)
- [TypeORM](https://typeorm.io/)
- [MikroORM](https://mikro-orm.io/)
- [Prisma](http://www.prisma.io/)

### Query builders

- [Kysely](https://kysely.dev/)
- [Knex](https://knexjs.org/)