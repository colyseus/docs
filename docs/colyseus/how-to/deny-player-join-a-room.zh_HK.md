您可以在調用 `onAuth()` 或 `onJoin()` 方法時展示一個錯誤提示來拒絕玩家接入.

至於何時執行拒絕操作則取決於您的用例.

下方是驗證 [@colyseus/social](/tools/colyseus-social/#server-side-api) 身份驗證令牌,以及檢索與用戶 id 關聯的 `Hero` 記錄.

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

客戶端在嘗試加入房間時會收錯誤提示:

```typescript
client.joinOrCreate("battle", {}).then(room => {
  // ...
}).catch(e => {
  console.log(e) // "'Hero' not found in the database!"
})
```
