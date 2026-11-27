# 对白表演：话轮、失语与三股力量

**这份文件的定位**：表演层的**对白专项**。它补 `acting-performance.md`（微表情 / 三区控制）与 `performance-physics.md`（情绪→动作映射）没有覆盖的三件事：**话轮怎么设计、说不出口怎么演、强情绪怎么拆成同时存在的力量**。

**权威来源**：以 `h3-ref2va-acting-director/references/performance-enhancement.md` 第七至九节为准。素材来自一套《如何写提示词增强演技表现》的拆解；它是导演规则与展示案例，不是 H3 的硬机制，也不是对照实验。

**它不做什么**：不改变七段骨架、时间码算法、档位规则与台词窗口；不新增 `<pause>` 之类规范外标签。停顿写进正文、拆句或时间码里。

---

## 一、先改一个默认：对白不是排队

一套常见的"错误对白规则"长这样：

```text
角色 A 先完整说完自己的台词，语气愤怒但表达清晰。
角色 B 等待 A 结束后准时开口，准确回应上一句话。
每一句对白必须清楚、完整、准确，情绪转换需要明确。
不允许停顿、抢话、重叠或改口，保证口型与台词同步。
```

结果：两个人轮流完成各自任务，却没有真正接住对方。观众听到的是"像两个人拿着同一只麦克风排队"。

**错误不在台词内容，在发言秩序过于干净。** 清晰 + 准确 + 有序 = 假。形式全部正确，关系却没有发生。

改成导演的问法：

| | 写作者 | 导演 |
|---|---|---|
| 关注 | 说了什么 | 为什么此刻说不完整 |
| 目标 | 完成一句漂亮台词 | 让情绪打断表达 |

**人物先被击中，再尝试组织语言。** 话轮不是"台词之间的空隙"，是互动的最小单位：谁在抢、谁在让、谁插不进去、谁用沉默回答。

---

## 二、七种话轮

| 话轮 | 机制 | 写法 | 用在 |
|---|---|---|---|
| **完整轮** | A 说完，B 接 | A 的最后一个音节落下，B 在半拍后开口 | 平静陈述、正式对话 |
| **抢话** | B 在 A 说完前进入 | B 的第一个字压进 A 最后两个字；A 的嘴还动半拍才停 | 争执、急事 |
| **叠话** | 两人同时说 | 两句重叠约 0.4 秒；A 为主音，B 更低更轻，只听到片段 | 吵起来、互相打断 |
| **插不进** | B 尝试失败 | B 张嘴、吸气、没声；手抬到一半停下 | 权力不对等 |
| **沉默** | 一轮没有词 | 吞咽、移开视线、呼吸；持续 1–2 秒 | 愧疚、悲恸 |
| **自我修正** | 说话人改口 | "I— 不是。算了。" 前半句被自己截断 | 隐藏意图、羞耻 |
| **失败启动** | 口型先成，声音不出 | 一次失败吸气，然后吞咽；改换句子 | 情绪过载 |

**一轮只服务一个关系变化。** 不要在一轮里又抢话、又沉默、又自我修正；那是三轮。

---

## 三、每个对白拍六件套

```text
时间码 → 说话目标 → 原句 + 触发词 → 可见反应 → 声音动作 → 话轮 + 听者反应
```

| 件 | 写什么 | 例 |
|---|---|---|
| 时间码 | 这一拍的长度 | `3.00-4.20s` |
| 说话目标 | 他这一轮想完成什么（不是情绪） | `他想让她停止自责` |
| 原句 + 触发词 | 原话；情绪落在哪个词 | `"You're not torturing me." — 重音落在 "not"` |
| 可见反应 | 说话者和听者的身体 | `他的右手慢慢落下；她的下眼睑含泪` |
| 声音动作 | 气息、音量、语速、破音 | `更低、更慢、句尾极轻` |
| 话轮 + 听者反应 | 谁占着话轮；听者怎么接 | `她停 0.3 秒，重新看他` |

**六件套是检查项，不是六个事件。** 一拍仍然只让一件事改变；说话目标和听者反应可以是静态背景。

### 三条硬规则

1. **听者在台词进行中反应，不是在台词结束后。** 台词落下才给反应，是"演完了"。写法：在台词的时间段里插入听者的一个身体事件（手指收紧、下眼睑动、呼吸停半拍），不要等台词结束再写。
2. **一句台词只留一个信息。** 铺垫、语气词、重复全砍；砍下来的部分用动作补（打断→举手/后退半步；判断→视线扫过两个方向；情绪→呼吸变化）。
3. **重叠只用短插话，不超过两个声音。** 主台词保持口型可辨；副声音写 `lower and partially audible`，放进 `overall_soundscape` 或一个极短的 `<d>`。

---

## 四、H3 的叠话工程约束

叠话在 H3 上是高难动作：音视频联合生成，两条台词抢同一条时间轴，口型会互相稀释。

1. **只用短插话重叠**：`I—`、`wait—`、`no—`，不超过 4 个音节；不要重叠两句完整台词。
2. **最多两个声音**；主台词保持清晰，副声音只给片段，不要给完整句。
3. **重叠失败就改切**：切到听者的脸，让观众从反应里读出被打断；不要为了叠话牺牲整条口型。
4. **每句台词各落一段、不跨硬切**；观众靠耳朵就能跟住话轮。

---

## 五、示例：把"排队"改成"接住"

```text
❌ 排队版
A 说完："I don't want you to go."
（静音）
B 开口："I have to."

✅ 话轮版
0.00-1.40s: A's eyes stay on B; his lips part before the sound arrives:
            <d>[English] I don't want you to—</d>
1.40-1.80s: B's first word lands on top of A's last syllable, lower and quieter:
            <d>[English] I know.</d> A's mouth keeps moving for half a beat, then stops.
1.80-3.20s: A swallows once; his eyes drop to B's hand on the door handle; he does not
            finish the sentence. B's hand tightens on the handle.
```

观众听到的不是"两句台词"，是**一次没说完的挽留和一次已经决定的离开**。

---

## 六、言语不流畅：把失败写在最难面对的词上

### 6.1 不是随手加"口吃"

心理障碍决定语言用哪一种方式失败：

| 心理障碍 | 失败方式 | 物理写法 |
|---|---|---|
| 羞耻 / 内疚，无法开始 | **启动失败** | 口型先形成，声音不出；一次失败吸气；喉结轻动；改口 |
| 害怕被误解，试图校准 | **重复 / 重音** | 同一个词说两遍，第二遍更轻或更快；重音落在关键词；目光扫对方 |
| 真相太残酷，无法继续 | **沉默 / 失败吸气** | 句子说到一半停住；吸气到一半停；视线离开；吞咽 |
| 想隐藏真正意图 | **自我修正** | 说到一半改口；"不是——我是说——"；手抬起又放下 |

### 6.2 三条硬规则

1. **失败落在最难面对的词上。** 对这个人来说最难的词——"我"、名字、"死"、"走"——才配得到一次失败。不要平均撒满整句。
2. **失败必须发生在身体。** 口型先成、无声气流、失败吸气、吞咽、喉结、改口——这些是证据；重复字只是结果。
3. **障碍句只说一次。** "他不是冷漠，而是悲伤超过身体承受范围"这类内核句允许出现一次，后面必须跟身体证据；不要写成心理分析。

### 6.3 示例：把失败放在"我"上

```text
【表演控制原则】He is not cold, and he is not suppressing anger: the grief is past what
his body can hold, so he relies on politeness, denial and caring for her to keep from
breaking down in front of her.

0.00-2.20s: He wants to finish each sentence and keeps getting stuck on the pronoun "I":
his lips form the shape first, then a silent stream of air, then a failed inhale. His throat
moves; he swallows and changes the sentence.
2.20-3.60s: "I am—" starts and stops. After "and I—" a short inhale fails. The second "I"
lodges in his throat; his mouth opens and no sound comes.
```

**"口吃"两个字不要写**——模型会把它演成夸张的结巴。写口型、气息、吞咽和那个词，它会自己长出真实的失败。

### 6.4 H3 的适配

- 一句台词仍要控制在一个呼吸内；失败发生在**句子的开头或那个词上**，不要在一句长台词的中段加五次停顿。
- 失败与台词共用时间轴；把失败放在台词窗口的前半段，后半段留一句完整的短句（"Every detail." 那种），收束更有力。
- 失败的物理事件可以写进 `TIMELINE`，也可以写进 `overall_soundscape`（失败吸气、吞咽），但不要两边重复。

---

## 七、三股力量：把"悲伤"拆成三件同时存在的事

### 7.1 不要写"悲伤欲绝，泪流满面"

这是"只写情绪结果"的典型：模型只能给你一个表情，给不了层次。把悲伤拆成三股**同时存在**的力量：

| 力量 | 作用 | 写法 | 例 |
|---|---|---|---|
| **生理泄露 LEAK** | 身体先出卖 | 眼眶红、吞咽、呼吸失控、手指发抖 | 眼眶微红湿润，无泪痕；一次困难吞咽 |
| **自我控制 CONTROL** | 意志压回去 | 移开视线、不落泪、压回哭腔、下颌收紧 | 目光靠近不到半秒便移开；喉结轻动后吞咽 |
| **关心目标 CARE** | 他真正想完成的事 | 保护对方、减轻对方罪恶感、维持体面 | 说完最完整的一句，句尾极轻摇头，表示不是她的错 |

**三股力量同时存在，不是从 A 变成 B。** 最强的时刻是泄露和控制同时可见，而目标决定了他选择哪一种失败。

### 7.2 完整示例：一句"你没有被折磨"

```text
【表演控制原则】He is not cold, and he is not suppressing anger: the grief is past what
his body can hold, so he relies on politeness, denial and caring for her to keep from
breaking down.

【LEAK】His eyes are red and wet, as if he has just cried alone, but there are no tear
tracks and no tears fall. His gaze comes close to her and moves away in less than half a
second, followed by one difficult swallow. Each sentence fails at the pronoun "I": the
mouth shape forms, the sound lodges in his throat.

【CONTROL】He looks away, pushes the crying voice back, and keeps his jaw tight. His right
hand lowers slowly until it rests on the desk.

【CARE】When he finally says "You're not torturing me.", it is his most complete sentence:
he speaks it to relieve her guilt, not to win. "You're not" is faster; "torturing me" is
slower, lower, still weak. He does not look at her; at the end of the line he shakes his
head very slightly, meaning none of this is her fault.
```

### 7.3 为什么有效

- 只写 LEAK，人物变成崩溃的受害者；
- 只写 CONTROL，人物变成冷漠的石头；
- 只写 CARE，人物变成圣徒；
- **三股同时存在，观众才看到一个在崩溃边缘还在保护对方的人。**

### 7.4 接入七段骨架

| 段 | 放什么 |
|---|---|
| `CHARACTER` | 不写表演，只写身份与服装 |
| `POSE AND STAGING` | 身体锁：持枪稳、抓着衣领、坐在桌前；LEAK 与 CONTROL 的初始状态 |
| `TIMELINE` | 话轮六件套 + LEAK 的失败点 + CONTROL 的压回 + CARE 的那一句完整台词 |
| `CAMERA` | 台词窗口镜头静止；微表情必须近景以内；叠话只用短插话 |
| `PHYSIOLOGY PRIORITY` | 呼吸 → 眼睑 → 喉结/吞咽 → 下颌 → 声音；同一秒最多两层变化 |
| `LIGHT AND ATMOSPHERE` | 给眼部一个可读的光：单侧主光 + 眼窝阴影 |
| `CONSISTENCY LOCK` | 尾帧状态：视线停在哪、手落在哪、谁占着话轮、泪有没有落下来 |

**内核句只出现一次，后面必须跟身体证据。** 不要把它写成一段心理分析，也不要在每个段落重复。

---

## 八、与宿主表演文件的分工

| 文件 | 管什么 |
|---|---|
| 本文件 | 话轮、失语、三股力量、对白拍六件套 |
| `acting-performance.md` | 微表情锚定词、三区面部控制、泪膜/单滴/湿痕、3–4 拍微表情链 |
| `performance-physics.md` | 情绪词 → 可拍摄动作的映射表、意图性动作、台词四参数 |
| `physiology.md` | 六层生理、三弧型、呼吸/潮红/汗/泪的物理顺序 |

**不重复造词**：复合情绪词库在 `acting-performance.md`；本文件只规定"话轮怎么排、失败落在哪、三股力量怎么并存"。

---

## 九、审片三查与自检

**审片三查**（生成后只看这三项）：

```text
[ ] 声音是否真的重叠——不是上一句静音后，下一句才整齐出现
[ ] 口吃是否发生在身体——检查呼吸、口型、吞咽，而不只听重复字
[ ] 切镜后情绪是否连续——湿润程度、视线和动作不能重置
```

**写作自检**：

```text
[ ] 对白不是排队：按戏的需要，至少有一处抢话/叠话/插不进/沉默/失败启动
[ ] 听者在台词进行中反应，不是台词落下后才反应
[ ] 每轮只服务一个关系变化；没有一轮里塞三种话轮
[ ] 说不出口的失败落在最难面对的词上，且发生在身体里
[ ] 三股力量同时存在（LEAK / CONTROL / CARE），外显只留一个
[ ] 内核句只说一次，后面跟了身体证据，没有写成心理分析
[ ] 切镜后情绪连续：湿润程度、视线方向、呼吸相位、手的位置没有重置
[ ] 停顿写在正文、拆句或时间码里，没有使用 `<pause>` 之类规范外标签
[ ] 叠话只用短插话、最多两个声音、不跨硬切
```
