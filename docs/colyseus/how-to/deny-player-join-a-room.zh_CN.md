您可以透過在 `onAuth()` 或 `onJoin()` 方法中拋出錯誤來拒絕玩家連接。

何時拒絕玩家連接的實現將取決於您的用例。

您可以在下方看到驗證 [@colyseus/social](/tools/colyseus-social/#server-side-api) 身分驗證令牌並檢索與使用者 ID 關聯的 `Hero` 記錄示例。

\`\`\`typescript export class BattleRoom extends Room {

  onCreate(options) { this.levelRequired = 10; }

  async onAuth(client, options) { const userId = verifyToken(options.token).\_id; const hero = await Hero.findOne({ userId });

    if (!hero) {
      throw new Error("'Hero' not found in the database!");

    } else if (hero.level < this.levelRequired) {
      throw new Error("player do not have the level required to be on this room.");

    }

    return hero;
  }

} \`\`\`

然後用戶端在嘗試加入房間時會收到錯誤：

```typescript client.joinOrCreate("battle", {}).then(room => { // ... }).catch(e => { console.log(e) // "'Hero' not found in the database!" }) ```