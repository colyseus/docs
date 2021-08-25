## 步骤1：允许匹配程序识别{1>"password"<1}字段。

在 {2>filterBy()<2} 中定义{1>"password"<1}字段。

{1>typescript gameServer .define("battle", BattleRoom) .filterBy(\['password']) <1}


## 步骤2：不列出房间

若 {1>create()<1} 或 {2>joinOrCreate()<2} 已获取密码，则将房间列为私人房间：

\`\`typescript export class BattleRoom extends Room {

  onCreate(options) { if (options.password) { this.setPrivate(); } }

} \`\`\`
