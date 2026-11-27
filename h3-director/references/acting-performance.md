# 人物表演与微肌肉控制：情绪、微表情、边说边落泪与零用力过猛法则

## 适用范围与规则归属

用于情绪转折、含蓄对白、需要细腻表演的面部近景，或用户要求增强角色演技的镜头。纯动作交锋且没有此类表演需求时不加载；战斗中仅对相关反应段使用，不把整段动作改为克制文戏。普通对白无需强塞复杂心理层次，按当下叙事需要选细节。

保留用户已确认的角色、事件、台词、调度、镜数、镜头时长和表演强度；有现成材料时只增强获准的表演层。时长与强度先从已有分镜或语境继承，能合理设计就直接做；只有缺项实质影响台词容纳、情绪方向或物理接续时才询问。单张角色图可以作为身份参考，不自动锁死为原图构图的一镜到底。

**对白专项**：话轮 / 失语 / 三股力量 / 对白拍六件套见 `dialogue-performance.md`；本文件管微表情与面部微肌肉，不重复话轮设计。

- 视觉身份、面部形变与肤质沿用 `visual-tiers.md` 对应档位（默认 3DCG 档、三渲二档或真人电影档）；在 3DCG/三渲二档中保持同一三维模型形变，在**真人电影档**中严格执行**「无深法令纹、无油腻高光、中下脸松弛平滑 + 眼部/呼吸/泪水多拍演进」**，绝不靠挤出法令纹、拧巴五官或夸张咆哮来体现演技。
- **严禁把内部 `FACS` 或 `AU1/AU7` 编号直接写进最终 H3 提示词正文！** 所有微肌肉控制必须转化为自然、具象的英文解剖微动作描述（如 `his inner brows draw slightly together`、`a millimeter tightening of her lower eyelids`），防止触发视频生成模型的面部抽动伪影。正文自查见 `quality-gate.md` 与 `scripts/check_prompt.mjs`。
- 镜数、机位、速度和切点沿用 `camera.md`、`camera-motion.md`、`timeline-and-rhythm.md` 与 `continuity-ledger.md` 的当前设定。本模块不另设固定特写、固定机位或全片慢速默认。
- H3 模式、字段、素材标签、声源和输出仍由 `h3-output-spec.md` 与 `delivery.md` 负责。把表演写入对应事件处，不追加另一套提示词包、审阅关卡或视频生成步骤。


## 微表情锚定词：`micro expressions`（全档通用）

在情绪词后面挂 `micro expressions`，是把整张脸的表演收窄成**克制、细小、可读的面部变化**的最短手段。`sad micro expressions` 不是"更弱的悲伤"，而是"悲伤只从眼神、唇线和呼吸里漏出来"。它不替代本文件的三区控制与多拍链，只负责先定幅度；具体内容仍要按部位与顺序写。

实战只有两步：**① 情绪词后加 `micro expressions`；② 按部位与顺序写一条可见动作链，并在台词前后各留半拍。** 下面拆开讲。

### 最小句式：情绪词 + 锚定词 + 一个可见动作

只写 `sad` / `angry` 会得到标签式的标准表情；只加锚定词不写动作，会得到一张幅度正确但内容空泛的脸。有效写法是三段：

```text
a quietly hurt micro expression — her eyes drop, her lips part and close again, and she swallows once
a guarded yet aching micro expression, one corner of her mouth almost forming a polite smile before it relaxes
a nervous and earnest micro expression as his fingers tighten on the strap
```

### 复合情绪词：用第二个词限定走向

复合锚定词比单一情绪更难演错方向。可直接取用：

| 复合锚定词 | 演的是什么 |
|---|---|
| `restrained polite micro expressions` | 礼貌在表面，情绪压在里面 |
| `guarded yet aching micro expressions` | 有防备，但底下在疼 |
| `quiet fond micro expressions` | 不外露的温柔 |
| `breaking but restrained micro expressions` | 快绷不住，还在绷 |
| `held-back micro expressions` | 全部往回收 |
| `quietly hurt micro expressions` | 被刺到但不发作 |
| `shocked and conflicted micro expressions` | 震惊与矛盾同时存在 |
| `nervous and earnest micro expressions` | 紧张但真诚 |
| `shy and touched micro expressions` | 害羞又被触动 |
| `disbelieving but relieved micro expressions` | 不敢信，又松了口气 |
| `furious and heartbroken micro expressions` | 怒火底下是心碎 |
| `hollow and numb micro expressions` | 空掉、麻掉 |
| `desperate and pleading micro expressions` | 绝望地求 |
| `shaken and awakening micro expressions` | 被撼动后回神 |

两个情绪并列时，后一个词是前一个词的底子或走向；不写 `complex emotions` 这类不可拍摄的概括。

### 部位与顺序：微在幅度，不微在省略

写清**哪个部位、做什么、先后顺序**。一条链只承担一个意思，链上每一步仍服从 `performance-physics.md` 的一拍 1–2 部位与全场单一外显点：

- 看着对方 → 短暂垂眼 → 双唇微启又合上 → 抬眼 → 说台词
- `she holds his gaze, looks down briefly, lets her lips part and closes them again; after a short hesitation she says: <d>[English] ...</d>`

顺序本身就是表演：先垂眼再低头是退让，先低头再抬眼是憋着。同一组动作换序会变成另一种情绪，也不要把全部部位塞进同一拍。

### 台词三段关系：台词前准备、台词中气口、台词后余韵

- **台词前**：留半拍准备——视线落定或躲开、一次吸气、唇启欲言，避免一开口就抢台词；
- **台词中**：台词拆成两段时，在两段之间的 0.3–0.8 秒气口插入一个动作（一次吞咽、下眼睑收紧、呼吸断半拍），不打断单句发音，也不借机加入身体动作；
- **台词后**：留半拍余韵——`Her eyes remain on him after the line`、唇角收回、呼气；不说完立刻"断电"。

完整模板：`She holds his gaze, looks down briefly, lets her lips part and closes them again. After a short hesitation, she says: <d>[English] ...</d> Her eyes remain on him after the line.`

**不要照搬教程里的 `<pause>` 标签。** H3 输出规范只定义 `<d>`、语言标签与说话人编号；停顿写进正文（`a short hesitation` / `a 0.3-second pause`）或落在时间码里。

### 「差一点」装置：almost…then relaxes

克制感来自动作差一点发生又收回，而不是没有动作：

- `one corner of her mouth almost forms a polite smile and then relaxes`
- `her lips part as if to speak, then close again`
- `his hand starts to lift toward her, then settles back at his side`

对应 `acting-library.md` 的 M073（欲言又止）与 M074（克制笑意）。同一条链只安排一次"差一点"，反复用会显得犹豫成性。

### 反打反应镜：每切一镜换一个锚定词

两人对切时，给反应方一个新的复合锚定词，让情绪沿切点单向演进（`furious and heartbroken` → `hollow and numb` → `desperate and pleading` → `shaken and awakening`），不把同一条表情复制两遍。切点仍按 `continuity-ledger.md` 继承前一镜末态；同框多人的反应分工见 `performance-physics.md`「这条的边界：不是"一帧只能一个人动"」。

### 边界：什么时候不用

- 远景、全景、背影读不出脸：改用头肩、呼吸与手部，锚定词只挤占注意力；
- 纯动作交锋：只在命中、受击、胜负已分的反应段使用；
- 用户要夸张、喜剧化或卡通化表演：锚定词会把幅度拉回写实，遵从用户与当前档位；
- 默认 3DCG 档：可用，但 FF7RE 式 CG 表演允许剧情需要的大幅表情；锚定词只用于需要收窄的镜头，不把全片统一压成写实微表情；
- 三渲二实机建模档：可以用，但不以"微"牺牲该档应有的表情表现力与非面部表演；
- 锚定词不解除任何既有约束：一拍仍 1–2 个部位、全场一个外显点、3–4 拍微表情节拍与 TIMELINE 时间码节拍仍是两套计数（见下文「克制 ≠ 少写微表情」）。


## 真人电影档核心铁律：面部肌肉分区控制与「克制 ≠ 面瘫」多拍微表情法则

在真人电影档（及高精度近景文戏）中，摄影机镜头具有极强的心理放大效应。AI 视频生成最常见的两个极端错误是：**要么“五官乱飞、用力过猛（Overacting）并拉出刀刻般深法令纹”，要么为了防法令纹而“把脸锁成毫无微表情变化的木讷面瘫（Under-Specified Blank Face）”**。

为此，本技能将**「中下脸平滑锁死（防法令纹）」**与**「上脸/眼部/泪水/视线/呼吸喉部的高密度多拍微表情（保演技）」**严格解耦：

### 1. 面部上、中、下三区解剖控制表（锁死法令纹禁区，解放眼部、泪水与呼吸戏份）

| 面部分区 | 内部对应的 FACS 机制（仅作分析，严禁写入提示词正文） | 真人电影感控制策略（写入提示词的可见微动作） | 严禁出现的 AI 翻车表现（防用力过猛/防法令纹/防面瘫） |
|---|---|---|---|
| **上脸区（眼眶/眼睑/泪腺/视线）—— 承担 70% 情绪** | AU5（上眼睑微提）、AU7（下眼睑微收紧）、AU45（眨眼节律）、AU61–64（视线转移/回避） | 靠**瞳孔微扩、视线提前躲闪/拒绝直视、下眼睑 1 毫米收紧、眼眶水光积蓄（tear film pooling）→ 眨眼时单滴眼泪越过下眼睑缓慢滑落面颊（a single clear teardrop overflows the lower lash line and rolls slowly down the smooth cheek）、闭眼忍耐 0.3–0.6 秒**传递高浓度情绪 | 严禁眼球乱转、瞪裂眼眶；同时也严禁整镜眼神死板静止、毫无眨眼与泪光层次变化 |
| **眉额区（内眉/眉心）—— 承担 10% 情绪** | AU1（内眉微提）、AU4（眉心轻聚） | 仅允许**内眉心 1 毫米极轻聚拢或微提（inner brows draw slightly together / lift by a millimeter）**，额头皮肤保持平滑 | 严禁双眉大幅上下跳动、拧成八字眉，严禁在额头和眉间刻出深黑川字纹与抬头纹 |
| **中脸区（鼻翼/颧骨/鼻唇沟）—— 法令纹绝对禁区** | 抑制 AU9 / AU10 / AU11 强收缩；仅保留 AU38（鼻翼微张） | **全面锁死鼻唇沟与苹果肌的挤压！** 仅允许压抑哭泣或急促呼吸带来的**鼻翼毫厘级轻张（nostrils flare subtly）与急促鼻息（impatient nasal sigh）**；面颊与鼻唇过渡始终保持平滑饱满（`completely smooth, flat, and uncreased nasolabial zone`） | **绝对禁止挤鼻、掀上唇、大幅提拉苹果肌**——这些动作会直接触发 AI 生成刀刻般深陷的法令纹与扭曲鬼脸 |
| **下脸与颈部（唇缘/下巴/喉部）—— 承担 20% 情绪** | AU14/15/17/24 微量控制 | 用**极小下颌开合说话（minimal jaw opening）、下唇缘微颤两次（lower lip margin quivers twice）、双唇用力抿紧压抑哭声（presses lips firmly together）、下巴肌肉极轻微颤动、喉结一次明显吞咽（throat contracts in a tight swallow）**传递崩溃与隐忍 | 严禁咧大嘴假笑、撇大嘴嚎啕哭相、咬牙切齿导致腮帮鼓起或张大嘴咆哮 |

### 2. 「克制 ≠ 少写微表情」：3–4 秒近景必须包含 3–4 个按序演进的微表情节拍

**严禁只写一句“他看起来很悲伤但很克制”或仅写单一微动作！** 在 3–4 秒的关键近景/特写镜头中，必须用 `first... second... third... fourth...` 或自然时序串联 **3–4 个连续递进的微表情节拍（Multi-Beat Micro-Expression Chain）**，特别是以下三类高频高张力情境：

> **微表情节拍与 TIMELINE 时间码节拍是两套计数。** 3–4 个微表情节拍是镜内表演层的递进链，一组通常横跨两三个时间码节拍；10 秒单元的 TIMELINE 仍按 ⌈时长÷1.2⌉ 分约 9 拍。不要为了凑微表情节拍把时间码切碎，也不要把两个微表情节拍塞进同一拍。

#### 情境 A：男生/挽留方「一边说话哀求，一边慢慢掉眼泪」的四拍演进链
当角色在解释、挽留或情绪爆发却保持面部克制时，将眼泪的物理生成与台词气口绑定，同时锁死平滑鼻唇沟：
1. **Beat 1（起势：瞳孔与气息受阻）：** 看到对方冷漠回避，瞳孔微扩、呼吸卡住半拍，握住对方手腕的手指收紧（`first, his pupils dilate slightly and his breath catches as his fingers tighten around her wrist`）；
2. **Beat 2（积蓄：开口哀求时眼眶蓄满泪水）：** 保持面颊与鼻唇沟完全平滑无折痕，内眉微提 1 毫米，下眼睑泛红蓄满厚重水光，以颤抖破碎的嗓音说出前半句台词（`second, keeping his mid-face and nasolabial zone completely smooth and uncreased, heavy tear film pools along his reddened lower eyelids and his inner brow lifts by a millimeter as he pleads: <d>...</d>`）；
3. **Beat 3（滑落：气口停顿眨眼时单滴眼泪缓慢滚落面颊）：** 在两句台词之间的 0.3 秒哽咽停顿处，喉部明显吞咽一次、下唇微颤，随着一次眨眼，**一滴清澈的眼泪越过下睫毛线，沿着平滑哑光的面颊缓慢滑落**（`third, during a 0.3-second choked pause, he blinks once and a single clear teardrop overflows his lower lash line, rolling slowly down his smooth, matte cheek as his throat contracts in a visible swallow and his lower lip quivers`）；
4. **Beat 4（余震：泪珠滑至下颌线时压低嗓音说完后半句）：** 在泪珠继续缓慢滑向下颌线的同时，鼻翼微张强忍哭腔，以极小下颌开合度沙哑低语完后半句，合唇后下唇缘仍在微颤，面颊留下一道发光的湿润泪痕（`fourth, while the teardrop continues sliding slowly toward his jawline, his nostrils flare slightly to hold back a sob and he whispers in a hoarse, cracking voice with minimal jaw drop: <d>...</d> He closes his trembling lips, the wet tear trail glistening on his smooth cheek`）。

#### 情境 B：女生/决绝离场方「眼泛泪光，但毫无耐心、拒绝直视对方」的四拍演进链
当角色心死、只想离开且不想再听对方解释时，**严禁写成两人深情对视**！必须用「视线回避 + 不耐烦呼吸/闭眼 + 泪光克制不落」体现心理防御与决绝：
1. **Beat 1（偏头拒看与泪光闪烁）：** 被拉住停下时，依然将头偏开 30° 朝向离场方向或地面，绝不抬头看男生的脸；微红的下眼睑浮现一层晶莹闪烁的泪光却忍住不落（`she refuses to meet his eyes, keeping her chin turned 30 degrees away while shimmering, unshed tear light brims along her tightened lower eyelids`）；
2. **Beat 2（不耐烦闭眼与短促鼻息）：** 听完对方辩解的尾音，流露出极度不耐烦与心累的微表情——双眼用力闭上 0.3 秒，从鼻腔喷出一口短促焦躁的叹息（`with a micro-expression of sheer impatience and emotional exhaustion, she squeezes her eyes shut for 0.3 seconds and lets out a short, restless nasal sigh`）；
3. **Beat 3（视线仅落手腕、干脆打断台词）：** 睁眼后目光仅斜睨向对方抓着自己衣袖的手（视线停在手腕/胸口以下，绝不上移对视），面颊与鼻唇沟保持平滑松弛，以偏快、冷淡干脆的语速开口打断对方（`she opens her eyes to stare down only as far as his hand gripping her sleeve—never lifting her gaze to his face—and cuts him off in a brisk, impatiently clipped tone`）；
4. **Beat 4（移开目光与甩手决绝转身）：** 停顿间下唇轻抿 1 毫米，将泛着泪光的视线彻底移向远方街道，说完最后一句后依然不看对方一眼，果断发力向下甩开对方的手，转身大步离开。

#### 情境 C：留守方「原地目送离去，慢慢开始克制崩溃」的四拍演进链（含跨镜泪痕继承）
1. **Beat 0（跨镜泪痕继承锚）：** 首句明确继承上一镜面颊已有的湿润泪痕（`preserving the glistening wet tear track from [Shot 3] on his smooth cheek`）；
2. **Beat 1（脱力与失焦）：** 悬在半空的右手无力垂落身侧，注视左前方的眼神逐渐失焦；
3. **Beat 2（唇颚微颤）：** 下唇缘连续轻微颤抖两下，下巴肌肉微颤，强行吞咽压住涌上喉头的哭声；
4. **Beat 3（闭眼挤出第二滴泪）：** 面颊与鼻唇沟依然保持完全平滑无皱，双唇紧紧抿住，低头 15° 并用力闭上眼睛 0.6 秒，**将第二滴眼泪从紧闭的眼角挤出，顺着面颊原有的湿痕滚落**；
5. **Beat 4（沉肩颤抖呼气）：** 双肩下榻，胸口在一次无声的抽噎吸气中微颤，随后微红的双眼缓慢睁开，吐出一口在冷空气中化作白雾的漫长颤抖呼吸。

## 先确定人物意图，再选择可见动作

先确定触发事件、人物此刻想取得/避免什么、对谁反应，以及本段结束时的情绪与行动选择。存在掩饰时，再区分“想让对方看到什么”与“哪里不由自主泄露”；直接喜悦、坦率悲伤等无需强行套面具。

将情绪拆到可见部位：视线关注对象（直视还是刻意回避）、眼睑与眨眼时机、眼泪阶段（蓄泪水光 vs. 单滴滑落 vs. 面颊湿痕）、眉形、唇线/下颌、呼吸/喉部、头肩、手与既有道具。手部细节须在构图内且符合持物、支撑与动作状态，不凭空加杯子或让持剑手同时整理衣角。

需要候选时才查 [acting-library.md](acting-library.md) 的相关类别：P 为表演情境，R 为情绪矛盾，M 为可见动作链。

## 情绪方向、口型与身份保护

- 分清结尾是仍在悲伤、决绝、麻木、回温还是释然。失恋、遗憾或克制不自动变成温柔微笑；用户本来要求苦笑、笑着崩溃或礼貌掩饰时保留其功能，不能一概禁笑。
- 说话段的唇颌随原台词发音，不能同时要求全程闭嘴或完全锁住下颌；吞咽、抿唇、眨眼落泪与换气安排在可容纳的气口停顿（`0.3-second pause`），不擅改台词或声源。
- **眼眶湿润（glistening tear film）、正在滑落的泪滴（teardrop rolling slowly down the cheek）和面颊已形成的湿痕（wet tear track）是三个必须区分并跨镜承接的物理状态**；眨眼或切镜绝不能让已落下的泪痕凭空消失。

## 仅对采用本模块的片段检查

检查触发事件与反应的先后；情绪是否只有标签或只有锚定词而缺一个可见动作链；台词前是否有半拍准备、台词后是否有半拍余韵；关键近景是否具备 3–4 个细腻演进节拍而非单薄的一句概括；边说边哭是否写清了气口落泪与平滑面颊的双重锁定；不耐烦/回避方是否严格执行了拒绝直视；跨镜泪痕是否继承；正文中是否已彻底清除 `FACS` / `AU` 缩写代码。
