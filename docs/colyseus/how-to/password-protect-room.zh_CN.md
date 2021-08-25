## 第 1 步：讓配對者識別 {1>"password"<1} 欄位。

在 {2>filterBy()<2} 方法中定義 {1>"password"<1} 欄位。

{1>typ在 {2>filterBy()<2} 方法中定義 {1>"password"<1} 字段。
escript gameServer .define("battle", BattleRoom) .filterBy(\['password']) <1}


## 第 2 步：使房間不公開

如果為 {1>create()<1} 或 {2>joinOrCreate()<2} 提供了密碼，請將房間列表設定為私人：

\`\`\`typescript export class BattleRoom extends Room {

  onCreate(options) { if (options.password) { this.setPrivate(); } }

} \`\`\`
