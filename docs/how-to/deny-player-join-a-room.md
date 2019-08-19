You can deny a player connection by throwing an error during `onAuth()` or `onJoin()` methods.

The implementation of when to deny a player connection will depend on your use-case.

Below you can see an example validating the [@colyseus/social](/authentication/#server-side-api) authentication token.

```typescript
export class BattleRoom extends Room {

  onCreate(options) {
    this.levelRequired = 10;
  }

  async onAuth(client, options) {
    const userId = verifyToken(options.token)._id;
    const hero = await Hero.findOne({ userId });

    if (!hero) {
      throw new Error("'Hero' not found in the database!");

    } else if (hero.level < this.levelRequired) {
      throw new Error("player do not have the level required to be on this room.");

    }

    return hero;
  }

}
```
