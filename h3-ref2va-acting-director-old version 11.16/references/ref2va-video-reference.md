# 参考视频（`<Video N>`）：在这套六段式里怎么接

这份文件是 SKILL.md 的补充件，只解决一件事：**当用户提供的是"参考视频"而不是"参考图片"时，六段式字段怎么填**。

六段式的字段名、顺序、大小写一律不变。变的只有三处：`subject_definitions` 里多一条绑定、`retention_analysis` 里多一组枚举、`detailed_description` 里多一句运镜归属。

---

## 一、`<Video N>` 是什么：时间结构，不是帧

官方全参考格式定义四类标签，编号各自独立：

| 标签 | 语义 | 常见误用 |
|---|---|---|
| `<Subject N>` | 可复用的可见内容（人物、物体、场景的身份定义） | 把 Subject 当成某一帧来引用 |
| `<Picture N>` | 具体的帧锚点（某一刻的画面） | 让它承担动作职责 |
| `<Video N>` | **整片级别的关系**——整条参考视频作为一个时间结构被引用 | 写成"视频里的某一帧"或"视频里那个人" |
| `<Audio N>` | 音频信号 | 让音频单独承担画面职责 |

`<Video 1>` 和 `<Picture 1>` 可以来自同一个上传文件，但语义完全不同：**Picture 是像素锚点，Video 是时间关系**。API 层面参考视频通过 `reference_video` 这个 role 传入，`<Video N>` 是写在提示词里的别名。

它承载的是：动作节奏、运镜路径、剪辑卡点、表演节拍，甚至声音波形。

---

## 二、放在哪个字段：`<Video N>` 可以单独成行

本技能有一条硬规则：**`<Picture N>` 只能被引用在 Subject 定义内部，不能单独成行**。

`<Video N>` 是这条规则的**唯一例外**——它定义的不是主体，而是时间结构，所以允许在 `subject_definitions` 里单独成行。但它必须和 `<Picture N>` 写在**同一段**里，中间不留空行，让模型一次读到互斥关系。

```text
subject_definitions:
<Subject 1> is the young man from <Picture 1>, wearing a blue t-shirt. Positioned on the left of the frame, facing right. His facial bone structure, hair and skin tone are strictly locked to <Picture 1>. Speaker ID: S1.
<Video 1> is the reference clip for motion rhythm, body action sequence and camera path only. It does not provide facial identity, clothing, or background. <Subject 1>'s face and hair are strictly locked to <Picture 1>; no facial features are inherited from <Video 1>.
```

关键是**互斥**：视频不提供脸，图片不提供动作。不写这条互斥线，模型就会自行混合，结果通常是"参考视频里的脸覆盖了图片里的脸"，或者动作迁移僵硬。

绑定只写一次。**不要在每一个镜头里反复重申素材职责**——那是 `retention_analysis` 的活。

---

## 三、`retention_analysis`：保留级别是固定枚举，不自创措辞

### 3.0 先选模式：复刻态（1:1）vs 重建态（换景）

同一个视频参考有两种截然不同的用法，**先定这个，再写 retention**。搞混一次，整条提示词会同时犯两个错：背景被文字重编、景别被描述带远。

| | **复刻态（1:1）** | **重建态（换景）** |
|---|---|---|
| 用户怎么说 | "只换人""背景照原视频""一模一样""1:1" | "换个霓虹步行街""把这个动作搬到我的场景" |
| `<Video N>` 的迁移项 | 动作 + 构图景别 + 运镜 + **背景 / 光 / 色调 / 颗粒 / 道具** | 动作（可选构图或运镜） |
| `strictly_avoided` 剩下 | 只有**表演者身份与服装** + 原音轨 | 还要加：背景、原光线、色调、道具 |
| 正文能不能写背景 | **不能。** 一写就是重编，只许写 "…are the ones in `<Video N>`, unchanged" | 必须写，且只写紧景里可见的（见 SKILL.md 5.5） |
| 正文该写什么 | 脸 / 头发 / 服装、表情、材质、声音 | 同左 **+** 完整场景与光 |
| 最高风险 | 参考人物的假发 / 墨镜 / 服装残留 | 景别被背景描述带远、姿势被"空场"指令带偏 |
| 一句话记 | **看得见的东西都由视频给，文字只回答"谁"** | **看得见的东西都由文字给，视频只回答"怎么动"** |

**30 秒判断法**（答"是"就往左）：

1. 替换对象只有人（或人 + 衣服）吗？
2. 用户有没有点名要某个新地点或新风格？
3. 背景一旦变了，这条片子还算"同一个镜头"吗？

三个都"是" → 复刻态；只要有一个"否" → 重建态。

**复刻态的四条硬写法**：

1. `partially_preserved` 里把背景**逐项列出**（backdrop / lighting / falloff into darkness / colour grade / grain / props）——列得越全，正文越不用写。
2. `summary` 里出现一次 `reproduced one-to-one`。
3. 正文里凡提到背景，只能以"是 `<Video N>` 的原样、位置未变"的形式出现，**不许出现任何背景的形容词**（银灰、丝绒、两盏暖灯、雾……写一个就把景别拉远一格）。
4. **被换掉的人要用"替换"动词句，不能只靠排除。** 见 3.0.1。

### 3.0.1 复刻态的核心动词是"替换"，不是"忽略"

`strictly_avoided` 是给**非人物层**（背景、光线、色调、音轨、道具）用的。**人物不能只写排除。**

原因：H3 没有负向分支，`ignore the performer`、`his wig is not used` 这类句子只是普通文本，压不住一个占了半个画面的具体人。而 `replace A with B` 是一个**正向操作**——它告诉模型"这里原本站着 A，现在站 B"，位置、姿态、光位全部沿用，只换身份。

推荐句式（四处各一句，形成闭环）：

```text
subject_definitions:
The blonde man in dark sunglasses who appears in <Video 1> and <Picture 2> is the performer being replaced.
Replace him with <Subject 1>: his place in frame, his pose and his action stay; his face, hair, sunglasses, suit and necklace do not.

summary:
Replace the blonde man in dark sunglasses in <Video 1> with <Subject 1>; there is exactly one man in the output.

detailed_description:
The blonde man in <Video 1> and <Picture 2> is replaced, not retouched: <Subject 1> stands where he stood,
in his pose, under his light, and nothing of his face, hair, glasses or clothing reaches the frame.

CONSISTENCY LOCK:
The blonde man appears nowhere in the output.
```

一句话：**排除项管背景和声音，"替换"句管人。** 只写排除、不写替换，参考人物就会以"残留"的形式回来——假发、墨镜、外套通常就是这时候出现的。

### 3.0.2 复刻态的两个隐藏地雷

**地雷一：身份清单就是取景清单。** 一致性锁要求身份标志物"每一帧都在"，于是**列到哪、画面就得拍到哪**。列了过膝袜和鞋，就必须拍到脚，想要大腿中段的裁切就不可能。出画的部件不是写"出画"，而是**根本不提**。

**地雷二：同一层不能有两个主人。** 景别不能一边写"等于 `<Video N>`"、一边写"等于 `<Picture N>`"。复刻态的归属应当是：

| 层 | 唯一主人 |
|---|---|
| 景别（crop / shot size / camera height / angle / 主体在画面中的位置） | `<Picture N>` 帧锚 |
| 动作、时间、机位运动方式 | `<Video N>` |
| 场景、背景、光位、色调 | `<Picture N>`（没有帧锚时才归 `<Video N>`） |
| 身份与服装 | 人设图 `<Picture 1>` |

同一层出现两个主人，结果不可预测——而且是"看起来也算对"的那种错，最难排。

**复刻态的音频陷阱**：原曲在参考音轨里，所以必须 `strictly_avoided — the original audio track including its music`，同时 `non_diegetic_music: N/A`。**不能一边排除原音轨、一边写"配乐原样保留"**——这两句互斥，模型会随机选一个。要保留现场音效就写进 `overall_soundscape`（人声、呼吸、麦克风握持声、房间混响），与人声是否保留分开决定。

---

官方是**四级保留 + 一条排除**，不是两级：

| 枚举 | 含义 | 典型用途 |
|---|---|---|
| `fully_preserved` | 原样保留 | 已确认整份都要的背景板、固定风格图 |
| `partially_preserved` | 只保留列出的方面，其余允许改 | **编舞/运镜视频（最常用）**、只借材质的产品图 |
| `attribute_transfer` | 把列出的属性搬到另一个主体上 | 把照片里的脸/发/衣服搬到表演者身上 |
| `weak_reference` | 只借风格、氛围、构图这类笼统相似 | 色调参考、情绪板 |
| `strictly_avoided` | 逐项排除 | 脸、衣服、背景、色调、原音轨 |

音频另有三个专用词：`fully_copy`（整条音轨照用）/ `partially_copy`（只留一部分或与新音混合）/ `reference`（生成新音，只跟音色、节奏、措辞、质感）。

> **铁律：一份参考里既有你要的、又有你不要的，就永远不要标 `fully_preserved`。**
>
> 参考视频几乎总含着"人 + 衣服 + 背景 + 光线 + 音轨"，所以**只要它承担编舞或运镜，就必须是 `partially_preserved`**，并补一句"原表演者的外观一律不迁移"。标成 `fully_preserved` 等于邀请它把整份参考倒进成片——这是"脸被参考视频覆盖""背景串味"的头号原因。

选级别的口诀：**选能满足目标的最窄那一级。** 只要运镜节奏，就不要保留整条视频。

### 目标 A：拍法不变，只换视觉（"视觉换皮"）

用户要"保留原视频的动作、运镜、节奏和剪辑，只替换人物/场景"。

```text
retention_analysis:
<Video 1>: partially_preserved — action sequence, timing of each beat, camera position, camera movement path, cut rhythm, on-screen motion speed. strictly_avoided — facial identity, clothing, background scene, original color grade, original audio track.
<Subject 1>: fully_preserved — facial identity and hairstyle locked to <Picture 1>. attribute_transfer — body follows <Video 1> action sequence exactly.
```

`summary` 一句话锁关系：

> The target video strictly reproduces the timing, camera path, and action sequence of `<Video 1>`, while replacing all visible identity and scene content with `<Subject 1>` and a new environment.

这种写法下 `detailed_description` **不需要逐帧重述动作**——时间结构已经在 `fully_preserved` 里了。只写替换后的视觉如何嵌进这个结构。

### 目标 B：只借动作或运镜（"动作迁移"）

只要那一段动作或那一种运镜，不要它的节奏和剪辑。`fully_preserved` 的范围必须收窄。

```text
retention_analysis:
<Video 1>: partially_preserved — body action sequence only: the three-step run-up, right-foot takeoff, tuck in mid-air, two-foot landing. strictly_avoided — camera path, cut rhythm, facial expression, clothing, background, original timing between beats, original audio track.
<Subject 1>: fully_preserved — facial identity locked to <Picture 1>. attribute_transfer — performs the action sequence from <Video 1> at a natural pace; body proportions and clothing remain consistent.
```

**关键：把"动作"拆成可枚举的事件序列**，别写"参考视频里的跳跃动作"。越具体，越不会把整条视频的节奏和运镜一起吞进来。

---

## 四、拆片段时：`<Video N>` 必须按片段裁剪

这是本技能（正反打拆 C1–C4）与视频参考最容易打架的地方。

**`<Video 1>` 指的是整条参考视频。** 如果你把一场戏拆成 C2 / C3 两次生成，而两个片段的 `fully_preserved` 都原样写着"视频的动作序列"，结果是**每一段都会重播整条参考动作**，拼接后动作翻倍、节奏断裂。

修法是：在片段级提示词里，把视频的时间区间裁出来写。

```text
<Video 1>: fully_preserved — body action sequence of the reference clip from 00:00.000 to 00:03.400 only, up to the moment he turns his head away. strictly_avoided — the remainder of the reference clip after 00:03.400, camera path, background, original audio track.
```

同时记住本技能的既有规则：**真正的前后正反打不要塞进同一次生成**。视频参考不改变这条——它只是让每个片段各自的"动作来源"更明确。

如果用户只想保留参考视频里"某一段"的动作，用上面的裁剪写法，而不是写"参考其中的动作"。

---

## 五、台词与视频节拍争夺同一条时间轴

这是第二个本技能特有的冲突。H3 是音视频联合生成，`<d>` 里的台词会占据时间轴；而 `<Video 1>` 在 `fully_preserved` 里也占据时间轴。两者抢同一段秒数时，模型会在口型和动作之间折中，结果是**口型后半段漂移 + 动作变慢**。

三条处置规则，按用户的真实需求选一条，不要三条同时上：

| 用户真正想要 | 写法 |
|---|---|
| 口型/台词是主角 | `<Video 1>` 只保留"身体姿态与重心变化"，`strictly_avoided` 里加 `gesture timing during dialogue`；台词窗口内的动作写成"保持" |
| 动作是主角 | 台词压到极短（一次呼吸内），或整段不放台词，改用非语言人声（喘息、破音、哽咽）进 `overall_soundscape` |
| 两者都要 | 拆片段：C2 给动作，C3 给台词。**不要在同一次生成里既要整段动作又要中文长台词。** |

另外，视频参考通常会继承"表演节拍"，而本技能的演技规则要求**全场只有一个最外显的表演点**。两者的最高点如果在不同秒数，模型会折中成"两次半强度"的表演。修法：在 `retention_analysis` 里把参考视频的最高点裁掉（`strictly_avoided — the peak beat of the reference clip at 00:0X`），只借它前面的铺垫段。

---

## 六、`detailed_description` 写什么 / 不写什么

### 6.0 动作迁移的第一原则：不打时间轴，不写动作

参考视频承担人物动作时，**这里不出现任何时间码括号，也不出现任何描述人物动作的句子**。

理由两条：

1. **时间轴已经归 `<Video N>` 了。** 同一个字段里再放一套 `[0–3s]`，等于给模型两个时间结构，必有一个抢赢——通常是括号赢（它更显式），于是动作被压进括号、其余时间自由发挥。典型症状：**动作只在前半段做完，后半段站着不动**。
2. **动作文字会压制视频。** 写"每拍张开、落下""头带动帽子"这类句子，模型会照文字演，把视频降级成素材。文字里只要出现带节拍的身体描述，迁移精度就掉。

**允许用时间码的只有两种例外**，其余一个括号都不要写：

| 例外 | 例子 |
|---|---|
| 特调人物表情 | `[6.0s] her smile drops and her eyes go still` |
| 背景发生事件 | 灯箱变色、有人推门、车灯扫过、烟花炸开 |

原因是这两者跟动作不抢同一个自由度，绑时间不会把动作挤走。

**唯一的例外分支是目标 B（只借一小段动作）**：那时必须把那段动作拆成可枚举事件，但前提是**先把参考视频裁到同一时间区间**（见第四节）。喂整条、却只枚举一段，两套动作会互相打架。

**该写、且必须写满的是视频给不了的那一半**：脸、发型、服装、身份标志物、表情、背景、光线，以及一句材质惯性。

### 6.0.1 「不写动作」≠「不写动作归属」

这是 6.0 最容易被执行坏的一处：把"动作描述"和"动作归属"一起删掉，结果是**所有人被同化成同一种运动**——参考视频里"A 在走路、B 在跳舞"，成片变成"两个人一起走路"。因为模型把它当成一个整体运动场，而不是两份互斥的运动。

分三层，前两层必写，第三层禁写：

| 层 | 内容 | 写不写 |
|---|---|---|
| 1 归属 | 谁演哪一份运动、两份不可互换 | **必写** |
| 2 类别 | 走路 / 跳舞 / 转身 / 回头（只贴标签，不展开） | 可写，且通常需要 |
| 3 细节 | 节拍、部位、幅度、速度、先后顺序 | **禁写** |

推荐句式（只到第 2 层，不含任何动作细节）：

```text
<Video 1> contains two figures doing two different things at the same moment. The near figure's walking, phone-holding motion belongs to <Subject 1>; the far figure's dance belongs to <Subject 2>. The two are not interchangeable and are never averaged.
```

一旦写到第 3 层（"每拍张开、膝盖内扣、头带动帽子"），就重新变成替它编舞，动作偏离视频。


**唯一保留的"物理句"**：不带动作、不带节拍的材质声明，例如

```text
Every fabric, strand of hair, ribbon and antler behaves with the weight and inertia of its real material.
```

它压的是"人偶感 / 僵硬关节"，不取代动作。参考素材是白模、人偶、动画草稿时，这一句几乎必写。

**元指令（写在权重最高的 `summary` 里，只写一次）**：

```text
No other line in this prompt describes, adds to or overrides the motion: every movement in the frame is the movement of <Video 1>.
```

这是压低"文字抢控制权"最直接的一句——直接告诉模型本提示词里没有第二套动作依据。

### 6.1 仍然要写的那一半

`<Video 1>` 承担动作时，这里**不重述动作本身**，只写新身份、新场景里的静态层与被动层：长相与服装、表情、光线、背景、材质惯性。

```text
[Shot 1] <Subject 1>, whose facial identity is locked to <Picture 1>, stands in a rain-soaked forest clearing. The body performs the action sequence preserved from <Video 1>: a three-step run-up, right-foot takeoff, tuck in mid-air, and two-foot landing. During the run-up, the wet fabric of the jacket clings to the shoulders and releases with each stride. At takeoff, the jaw tightens and the eyes narrow slightly. The camera does not follow the original path from <Video 1>; it remains at a low fixed position, letting the figure cross the frame laterally. On landing, rainwater sprays outward from the impact point, and the hair, soaked, falls forward over the forehead before being pushed back with one hand.
```

这一段同时做了四件事：`<Video 1>` 给动作、`<Picture 1>` 给脸、文字给新场景的物理反应、**明确排除原始运镜**。

> 注意：上面的例子属于**目标 B**（只借一小段动作，所以把动作拆成事件）。如果是**目标 A 整段迁移**，整段动作照视频演，`fully_preserved` 里的动作事件列表和描述里的动作句都要删掉，只留 6.0 允许的那几类。

**运镜归属必须二选一，不能空着**——空着模型会自己选，而且通常选错：

```text
The camera does not follow the original path from <Video 1>; it remains at ...
The camera follows the path preserved from <Video 1>.
```

本技能的"每个时间段只指定一个主运镜"照旧生效；视频参考只是可能把主运镜从你的手里拿走。**如果你写了固定机位，就不许在 `fully_preserved` 里保留 `camera path`**——这两句同时出现，是运镜乱跳最常见的原因。

---

## 七、音频：`<Audio N>` 与视频音轨分开绑定

`<Audio N>` 是独立角色，硬约束：**不能单独作为唯一素材**，必须同时有图或视频。

```text
retention_analysis:
<Audio 1>: fully_preserved — vocal timbre and speaking rhythm for <Subject 1>'s dialogue. attribute_transfer — pitch contour and pacing only; the actual words are replaced by the target Mandarin lines.
```

`<Video N>` 自带音轨而你不要，必须显式排除，否则会串入：

```text
<Video 1>: strictly_avoided — original audio track
```

排除音轨后，`overall_soundscape` 才真正由你掌控——这是哭戏/雨戏能不能立住的关键。

---

## 八、失败模式

| 症状 | 病因 | 修法 |
|---|---|---|
| **动作只在前半段做完，后半段站着不动** | `detailed_description` 里给动作打了时间码括号，动作被压进括号区间 | 删掉全部动作时间码（见 6.0），时间轴只留给表情与背景事件 |
| **所有人都变成同一种运动**（原片里 A 走 B 跳，成片两人都在走） | 把动作归属和动作描述一起删了，模型把参考当成一个整体运动场 | 按 6.0.1 补第 1 层归属 + 第 2 层类别标签，明确"两份不可互换、不取平均" |
| **参考角色的动作明显偏离视频** | 文字里写了动作句（"每拍张开、落下""头带动帽子"），文字压过视频 | 删掉所有含节拍的身体描述；在 `summary` 加"无第二套动作描述"的元指令 |
| 动作僵硬 / 漂移 | `<Video 1>` 职责写成"参考动作"这种模糊措辞，模型在多个时间点平均采样；**或目标 B 里没把动作拆成可枚举事件** | 目标 A：整段交给视频、不写动作；目标 B：拆成可枚举事件并同步裁剪视频区间 |
| 人偶感 / 球关节 / 动作一顿一顿 | 参考素材是白模、人偶、动画草稿，模型连"表演质感"一起搬了 | 在 `attribute_transfer` 补 `with continuous human weight and joint flow`；再加一句材质惯性物理句 |
| 脸被参考视频覆盖 | Picture 与 Video 都含人脸，没声明优先级 | 补互斥句：`It does not provide facial identity ... no facial features are inherited from <Video 1>` |
| 运镜意外继承 | 只想要动作，镜头却跟着视频动 | `strictly_avoided` 逐项列 `camera path` / `camera movement speed` / `shot framing`，并在 `detailed_description` 写明机位 |
| 正反打拼接后动作翻倍 | 每个片段都保留了整条视频 | 按片段裁时间区间（见第四节） |
| 口型后半段漂移 + 动作变慢 | 台词与 `<Video 1>` 抢同一条时间轴 | 见第五节，三选一 |
| 表演出现两次半强度的高点 | 视频的最高点与本技能"全场一个最外显点"冲突 | 把参考视频的高点裁掉，只借铺垫段 |
| 写实质感渗进动画角色 | 视频是实拍、目标是 2D | 槽位排写实 + 镜头首句钉风格 + 细节复述风格（三件套照旧） |
| 参考视频音轨串入 | 没排除原音轨 | `<Video 1>: strictly_avoided — original audio track` |

---

## 九、检查清单

- [ ] `<Video N>` 是否写在 `subject_definitions` 内、与 `<Picture N>` 同段、且有一句明确的"不提供什么"？
- [ ] 是否有互斥线（视频不给脸、图片不给动作）？
- [ ] `retention_analysis` 是否只用了固定枚举（四级保留 + `strictly_avoided`）？含"要的 + 不要的"的参考有没有误标 `fully_preserved`？
- [ ] **动作迁移时，`detailed_description` 里是否还有时间码？（除特调表情、背景事件外应为零）**
- [ ] **是否还有任何描述人物动作的句子？（应为零）**
- [ ] **是否写了第 1 层"动作归属 + 两份不可互换"？（多主体参考视频必写，漏了会全员同化）**
- [ ] **`summary` 是否带了"本提示词没有第二套动作描述"的元指令？**
- [ ] 目标 B 才需要枚举动作事件；目标 A 是否误留了事件列表？
- [ ] 拆片段时，是否按片段裁出了视频的时间区间？
- [ ] 台词与视频节拍是否只保留了其中一个主导？
- [ ] 运镜归属是否二选一写死？固定机位与 `camera path: fully_preserved` 是否同时存在？
- [ ] 原音轨是否被显式排除？
- [ ] 六段式字段名是否仍然小写、按序、未被插入额外标题？