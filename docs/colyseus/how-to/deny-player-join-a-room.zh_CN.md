您可以在调用 `onAuth()` 或 `onJoin()` 方法时展示一个错误提示来拒绝玩家接入.

至于何时执行拒绝操作则取决于您的用例.

下面这个例子是验证 [@colyseus/social](/tools/colyseus-social/#server-side-api) 身份认证令牌, 然后通过用户 id 获取相关联的 `Hero` 记录.

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

客户端在尝试加入房间时会收到错误提示:

```typescript
client.joinOrCreate("battle", {}).then(room => {
  // ...
}).catch(e => {
  console.log(e) // "数据库没找到 'Hero' 数据!"
})
```