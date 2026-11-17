---
name: h3-ref2va-acting-director
description: H3 提示词的轻量版单文件手册。一个文件跑完一镜，也能跑一集：六个硬机制、参考图五类角色、六段外壳+七段骨架、情绪到物理动作的速查、镜头七条硬约束、一集节奏、每单元开工四步。当用户要写 H3 提示词、设计分镜、或做多单元短剧时使用；细节不足时转到 h3-scene-prompt-director。
---

# H3 轻量版：一个文件跑完一镜，也能跑一集

**这份文件的定位**：**结论都在这里，细节在重型版。**

- 想快速写一条能跑的提示词 → 只读这一份就够
- 想从零做一集（资产、槽位经济、逐单元接力） → `h3-scene-prompt-director`
- 某个概念想要完整版（术语表、状态卡模板、失败模式全表） → 见第十二节的对照表

**两种任务形态，动笔前先分清**：

| 形态 | 输入 | 走哪 |
|---|---|---|
| **单条** | 用户手上有图，只要这一条 | 本文件全部内容 |
| **剧集** | 一集 6–12 个 10 秒单元，逐个生成再拼 | 本文件 + 第七节（开工四步）+ 第六节（一集节奏） |

判错的典型症状：写到第三个单元时发现脸对不上、空间对不上，而前两个单元的生成成本已经付掉了。

---

## 一、六个硬机制

动笔之前必须知道 H3 在底层怎么工作。这决定**哪些东西写了有用、哪些写了白写、哪些写了会打架**。

### 1.1 每次生成都是无状态的（最重要的一条）

**H3 不记得上一次生成。**

它不知道上一镜谁站在哪、刀在谁手上、刚才说过什么、这个房间长什么样。它只有两样输入：**这一次上传的图 + 这一串文字**。

三条推论，全部是硬规则：

1. **参考图不是加分项，它是跨单元记忆本身。** 上一镜的成片不是"顺便参考画风"，是把"上一刻这个世界长什么样"序列化成一张图喂进去。
2. **文字必须自包含。** `still`、`same`、`as before`、`continuing from the previous shot` 这些词在跨条时是**空词**——没有参照物。要换成对当前状态的直接描述。

   | 跨条无效 | 条内有效（它看得见自己生成的前几秒） |
   |---|---|
   | `she keeps the same smile as before` | `her smile holds unchanged from 5.40s` |
   | `he is still holding the knife` | `the knife stays in her right hand` |

3. **每一镜都要重新陈述画面里所有关键物件。** 手上的刀、盖到胸口的被子、关着的门——这些在观众记忆里，不在模型输入里。漏一个，它就可能让那个东西消失。

### 1.2 音视频联合生成，不是"先出画面再配音"

H3 的核心架构是音视频 latent 联合预测：写一句台词，它同时生成嘴型、声音、语气和环境音。这意味着两件事：

第一，**台词、口型、声音质量是绑定的**。如果你写了台词，模型会尝试生成匹配的嘴部运动和声音；如果你没写台词，倾听者的嘴唇必须明确写出"保持闭合"，否则它可能自行生成无意义的嘴部运动。

第二，**画面运动和声音共享同一个时间轴**。一个时间分段里同时要求"大哭 + 说完整的话 + 镜头推进"，模型会在三个目标间分配容量，三者都不精确。**一个时间分段只承载一个听觉事件和一个视觉事件。**

### 1.3 支持硬切，但有严格的使用条件

```text
[Shot 1]（不写时间戳，从 0.00s 开始）
[Shot 2] At 00:03.500, the camera cuts to ...
```

切点必须**严格递增**、**小于总时长**、**与台词和动作所需时间匹配**、**不在同一瞬间要求多个冲突事件**。

切镜有门槛：**必须带来至少一种新信息**——新主体、新空间、新状态、新视角、新时间阶段、关键反应。只是"从中景稍微变近"，用推，不要浪费一次硬切。

**镜头密度看有没有台词**：

| 情况 | 镜头数 | 为什么 |
|---|---|---|
| **有台词** | 1–2 镜（最多 3） | 台词窗口要求镜头静止，切碎了口型必漂 |
| **无台词** | **3–4 镜（最少 3）** | 对白本身提供节奏；没有对白，节奏只能靠切 |

上限 5 镜，再多就切成碎片（每镜不到 2 秒，观众来不及看清）。**10 秒无台词只用 1–2 镜，一定拖。** 唯一例外是 POV 单镜（切了破坏"连续在看"），但它必须靠焦点变化、呼吸起伏、手入画这三样维持注意力。 无台词怎么切见 5.7。

### 1.4 多主体时，它会"混合身份"，不会自动分开

两张参考图同时存在时，注意力机制会让两张脸的语义互相渗透。你不是在"提供两个角色"，你是在"提供两个可能被融合的面部分布"。

解法：**每张图只承担一个单一、互斥的职责**，并通过稳定标签 `<Subject 1>` / `<Subject 2>` 在每个镜头重复锚定。

身份混合有两种形态：**同一个人在一条视频里面部漂移**，或者**两个人互动时互相融合**。预防手段是**特征描述互斥**（一个有眼镜一个没有、一个左一个右）+ **逐字节复用的描述块**。

### 1.5 没有传统负面提示词的"分支"

公开权重是 CFG-distilled，标准流程没有 positive/negative 条件对。`no`、`不要`、`禁止` 不会进入独立分支压制概念，它们只是普通文本，甚至可能被正向采样。

**所有约束必须写成正向的确定状态。**

| 想表达 | 不要写 | 改写为 |
|---|---|---|
| 不要哭 | no crying | the lower lid stays dry, the eyelid tension held |
| 不要动 | no movement | her weight stays on her front foot, her right hand at her side |
| 不要换脸 | no face change | her face stays identical to Image 2 across all shots |
| 不要多一个人 | no extra person | exactly one woman in the frame, zero other figures |

### 1.6 中文口型的工程约束

音画同步是结构性能力，但**非英语训练数据密度低于英语**，口型精度会下降，prompting 修不好这一点。可工程化的解法：

- **一句台词控制在一个呼吸内**，越短越稳。过长会导致口型逐渐偏移
- **避免紧特写**。脸越大，时间误差越可见；中景比紧特写稳
- **说话时不要同时要求竞争性的面部动作或镜头运动**。吞咽、吸气、视线移动安排在台词前后，不要与台词同时
- **台词写入 `<d>` 标签**，语言标记在标签内，表演说明在标签外

---

## 二、参考图：五类角色，两个寿命

### 2.1 它是语义包，不是"一张能参考的图"

参考图不是"给模型看一张图"，是**把这张图编码成一个语义包，整体注入生成过程**。

所以你没法"只取其中想要的一部分"。所有 `take only X, ignore Y` 做的都是**减法**——规定包里哪些允许通过。这就是每张图只能承担一个职责的原因。

一张图只能回答三个问题之一：

| 问题 | 素材 |
|---|---|
| **世界长什么样** | 场景图 / 空镜 |
| **这个人长什么样** | 人设图 / 四视图 |
| **上一刻发生了什么** | 成片 |

前两个是**常量**，第三个是**变量**。

### 2.2 五类角色与寿命

| 用户常这么说 | 叫它 | 只准提供 | 寿命 |
|---|---|---|---|
| 人设图 / 三视图 / 立绘 | **身份卡** | 脸、发型、发饰、标志痣、服装结构 | 整集 |
| 场景图 / 空镜 | **环境卡** | 房间结构、家具位置、光的方向与形状 | 整集 |
| 成品图 / 上一镜截图 / **额外锚点** | **成片锚点** | 上一刻的可见状态：谁在哪、手上有什么、光落在哪 | 一镜 |
| 姿势参考 / 动作参考 | **姿态卡** | 一个动作怎么摆、机位高度 | 一镜到几镜 |
| 道具图 | **道具卡** | 器物的形状、大小、握法 | 几镜 |

**"基本参考图"和"额外锚点"按寿命分，不按重要性分。** 前者定义"一直如此"，后者定义"刚刚如此"。用成片当身份卡，脸会一路漂；用身份卡当成片锚点，姿势和道具全丢。

### 2.3 成片锚点必须排除构图，而且理由很硬

| 素材 | 对机位的态度 | 声明怎么写 |
|---|---|---|
| 四视图 / 贴图道具 | 中性 | 不用特别声明 |
| 场景空镜 | 半中性 | `copy zero of its camera angle` |
| **外部姿势参考** | **要取机位高度** | `supplies the posture and the camera height only` |
| **本项目成片** | **整份排除** | `copy zero of its framing and zero of its camera position` |

姿态卡取高度，因为"这个角度看这个动作"才成立；成片整份排除，因为它的价值在状态、不在构图。

**为什么这不是保险而是必需品**：单元是独立生成的。如果这一单元抄了上一单元的构图，两次生成之间的微差（脸的角度、光的强度、布料褶皱）会让画面在剪辑点**跳一下**。单看每段都没问题，接起来就是廉价感。这是短剧里最容易被察觉、又最难定位的毛病。

### 2.4 角色不入画，就不传他的身份卡

只拍她、他连一只手都不在画面里时，不要传他的图。传了，模型会认为画面里应该有他的位置，于是硬塞一个完整的人进来（POV 镜头里常表现为凭空造出第三个人）。

**判据**：这一镜的画面里，能不能看见这个角色身上的任何一部分？能（哪怕一片衣袖）→ 传；不能 → 不传，用文字说明"另一个人在画外"。

**槽位清单每单元重算，不许照抄上一单元。**

### 2.5 张数由"这一镜有几个未知"决定

不要先想"该传几张"，先数列这一镜必须让模型知道的事。未知的个数就是下限，然后按"能不能用文字重建"来砍。

2–3 张是稳定区；4–5 张要管纪律；6 张要准备删；7 张以上同一张脸会被平均成"谁也不像"。

---

## 三、格式：六段外壳 + 七段骨架

> **外壳有两种，内容一样。** 本文用 Ref2VA 的六段外壳；如果你的平台是三字段（`integrated_multimodal_description` / `overall_soundscape` / `non_diegetic_music`），见 3.1 末的换算表——**三个"消失"的字段不是删掉，是换了位置**。
>
> 三字段外壳的完整语法（对话标记、参数、可拍摄性禁用词）见 `h3-scene-prompt-director/references/h3-output-spec.md`。

### 3.1 外壳（Ref2VA 六段）

字段名必须小写、按顺序排列，不插入额外 Markdown 标题。

```text
subject_definitions:   每个 Subject 来自哪张图？保留什么？屏幕哪一侧？说话者 ID？
summary:               一句话交代这一条要干什么
retention_analysis:    按 Subject 分行，写 fully_preserved / attribute_transfer / strictly_avoided
detailed_description:  正文，内部走七段骨架（见 3.2）
overall_soundscape:    画内音 1–4 句
non_diegetic_music:    只有观众听得到的配乐，1–3 句或 N/A
```

**`subject_definitions` 的写法**：每个 `<Subject N>` 必须给屏幕位置和说话者角色。`<Picture N>` 只能被引用在 Subject 定义内部，不能单独成行。

```text
<Subject 1> is the young man from <Picture 1>, wearing a blue t-shirt. Positioned on the left
of the frame, facing right. His facial bone structure, short brown hair and basic skin tone
are strictly locked to <Picture 1>. Speaker ID: S1.
<Subject 2> is the woman from <Picture 2>. Positioned on the right of the frame, facing left.
Her facial features and hair are strictly locked to <Picture 2>. Listener. Her lips remain
completely closed unless explicitly speaking.
```

不分配屏幕位置和说话者角色，模型会自己分配，而它的分配通常是错的。

**`retention_analysis` 的写法**：用正向语言写约束。

```text
<Subject 1>: fully_preserved — facial identity, short hair, no glasses, position on left,
speaker role. attribute_transfer — wet hair on forehead, tears. strictly_avoided — identity
mixing with Subject 2, over-dramatic crying, opening mouth outside his speaking turns.
```

### 3.1b 三字段外壳怎么写：三个"消失"的字段去了哪

六段有六个顶层字段，三字段只有三个。**三个不是被删掉，是换了位置。**

| 六段的字段 | 三字段里放哪 |
|---|---|
| `subject_definitions` | 变成最前面的**裸槽位声明**——每个 Image 一句 `supplies X only — ignore Y`，不需要字段名 |
| `summary` | 并进 `CHARACTER` 段的第一句（风格锁之后），一句话交代这一条要干什么；也可以省掉 |
| `retention_analysis` | **不做枚举**。保留什么、排除什么全部由槽位声明里的 `take only` / `ignore` 表达 |

完整骨架：

```text
Image 1 supplies ... only — ignore its ...
Image 2 supplies ... only — ignore its ...

integrated_multimodal_description:

CHARACTER: [风格锁原文] [一句话交代这一条] [身份标志物]
POSE AND STAGING: ...
TIMELINE:
0.00-1.20s: ...
CAMERA: ...
PHYSIOLOGY PRIORITY: ...
LIGHT AND ATMOSPHERE: ...
CONSISTENCY LOCK: ...

overall_soundscape: ...
non_diegetic_music: N/A
```

**一个真实的差别，不是格式差别而是精度差别**：

| | 六段式 | 三字段 |
|---|---|---|
| 职责声明 | 结构化字段，带屏幕位置和说话者 ID | 自然语言的 `take only / ignore` |
| 保留策略 | 固定枚举 `fully_preserved` / `attribute_transfer` / `strictly_avoided` | 不做枚举 |
| 适合 | 三个以上主体、身份混合反复出现 | 一到两个主体、槽位 ≤ 4 张 |

**经验法则**：**主体一两个、图不超过 4 张 → 三字段够用且更快；主体三个以上、或者身份混合反复出现 → 换六段式上枚举。** 枚举的价值在于它强迫你把"保留什么"写具体，而这在多主体时是唯一的保险。

### 3.2 七段骨架（`detailed_description` 内部）

顺序不要变：

```text
CHARACTER → POSE AND STAGING → TIMELINE → CAMERA → PHYSIOLOGY PRIORITY
→ LIGHT AND ATMOSPHERE → CONSISTENCY LOCK
```

| 段 | 写什么 | 最容易漏的 |
|---|---|---|
| **CHARACTER** | 风格锁 + 4–6 项身份标志物 | 头饰位置、痣的左右、袖型 |
| **POSE AND STAGING** | 位置、距离、朝向、承重方式 | 只写"她在他旁边"，没写四十厘米 |
| **TIMELINE** | 首尾相接的时间码，一拍一件事 | 有洞或重叠 |
| **CAMERA** | 高度→角度→焦段→景别边界→运动→焦点 | 只写"中景"三个字 |
| **PHYSIOLOGY PRIORITY** | 六层生理的先后顺序 | 同一秒里两层一起变 |
| **LIGHT AND ATMOSPHERE** | 主光位置、色温、补光、明暗处理 | 只说"电影感打光" |
| **CONSISTENCY LOCK** | 人数 + 状态（重心、承重、位置）+ 身份标志物 + **物理惯性** | 写"keep the pose"（无效）；写"不要融化"（不需要） |

**风格锁要逐字复用**，不要同义替换——对模型来说 `cinematic` 和 `filmic` 是两个要求。

> **`LIGHT` 段还有一个用法：换空间时，用光色剧变标记。** 从走廊进卫生间、从卧室到地窖——如果两个空间光色接近，观众会以为还在原地。用极端反差：`warm tungsten` → `cold greenish fluorescent`、`amber candlelight` → `hard blue moonlight`。这是告诉观众"你换地方了"最便宜的方式，比一句台词都省。

#### 一致性锁不是"防崩清单"，是"状态延续"

这是整套文档里最容易写歪的一处。写它的时候，心态应该是**"告诉模型这个人此刻在物理上是什么状态，接下来会怎么继续"**，而不是"列出所有可能出错的地方来预防"。

| 该写 | 不该写 |
|---|---|
| 重心在哪只脚上、脊柱朝哪、谁在承重 | `no limb melting`、`no extra arms` |
| 手上的东西在哪个位置、有没有移动 | `keep the body normal` |
| 动作的**趋势**（她正往前扑 / 他的重心已经在后脚） | 一长串"保持不变" |
| 人数 | `ten fingers, two legs` |

```text
正确（状态 + 惯性）：
Her weight stays on her front foot, her spine tilted two degrees forward as though still
moving in. His weight has already moved onto his back heel, his chin pulled back, the front
foot only touching with the toe. The knife stays in her right hand, low at her side.
Exactly one woman and one man in the frame.

错误（过度设防）：
The pose never changes, no limb melting, no extra arms, exactly two arms, ten fingers,
exactly two legs, no distortion, keep the body proportions correct.
```

**为什么不该写肢体数量**：H3 是旗舰级的视频模型，空间语义理解足以处理"两个人同时动、重心转移、多角度"这类场面，不会凭空多出手臂或者把肢体融化。把"two arms / ten fingers"写进去，占的是本该用来描述动作和空间关系的注意力预算——**写得越具体，它越准；防得越多，它越保守**。

唯一的例外：如果你的项目**真的在这一条上崩过**（不是担心，是实测崩了），才针对性写一次，而且只写崩的那一处。

**人数锁要保留**，因为它防的不是"畸形"，是"凭空造人"——模型看到画面里空着一块，可能会自己补一个人进去。这两件事性质不同。

### 3.3 时间码与节拍

**节拍数 = ⌈时长 ÷ 1.2⌉，末拍延长到 1.6–1.8 秒。**

```text
0.00-1.20s: [这一拍唯一的变化]
1.20-2.40s: [下一拍唯一的变化]
```

四条纪律：

1. **前一段终点 = 后一段起点。** 不允许重叠，不允许留空（留空 = 空白帧，重叠 = 动作打架）
2. **保留两位小数**
3. **最后一拍结束时间 = 声明时长**，且多留 0.3 秒余量（成片比请求多 0.5–0.6 秒）
4. **节拍长度要不均匀**：动作点给短（0.9–1.1s）、情绪点给长（1.4–1.8s）、转折点给最短（0.6–0.9s）、末拍最长

**台词窗口**需要三样同时成立：脸可见（不小于中近景）+ 镜头静止 + 时间够（中文每秒 4–5 字 + 30% 余量）。窗口里不要同时安排动作——让他停手说话，说完再动。

---

## 四、演技：从情绪到可拍摄动作

### 4.1 三条铁律

**一、情绪不可写，只写它的物理后果。** H3 不执行"演得懵逼一点"，它执行一次眉毛弹起、一次下巴掉落、两次瞳孔横移。

判断法：**这句话能不能被摄像机验证？** 能就留，不能就往下拆一层。

**二、单个角色的脸，一拍只让 1–2 个部位明显变化。** 其余用"保持不变"锚住。同一秒里眉毛、眼睛、嘴角、下巴一起动，是 AI 人脸显假的第一原因。

> **注意这条只管"一张脸的部位"，不管"一帧里有几个人能动"。** 三个人同时有反应是好事，而且往往是画面变真的关键——见 4.9。把这条读成"一帧只能一个人动"，是这套文档最容易被误读的地方。

**三、强度封顶：全场只有一个最外显的点。** 情绪越强越要写"忍住"。脑子真正过载的人不会五官齐飞，他会**冻结**。

**写了等于没写的词**（这类词读起来很像提示词，其实什么都没说）：

| 禁用 | 为什么 | 换成 |
|---|---|---|
| `beautiful` / `stunning` | 是评价，不是状态 | 具体特征：痣在哪个位置、袖型是什么 |
| `cinematic` | 模型默认就是，且不知道你要哪一种 | `85mm, shallow depth of field, one soft key light from the left` |
| `dramatic` / `intense` / `emotional` | 是效果，不是原因 | `her jaw tightens and her chin stops moving` |
| `atmospheric` / `moody` | 同上 | `a hard grid of moonlight across the floorboards` |
| `slowly` / `gently` **单独用** | 没有量级 | `at less than two centimetres a second` |
| `like a wounded animal` | 模型会真的画一只动物 | 写身体：`her shoulders curling forward` |
| `she realizes` / `he understands` | 内心动词 | 写身体的变化顺序 |
| `more intense` / `softer than before` | 跨条时"before"不存在 | 改成绝对描述 |

### 4.2 情绪是叠加的，不是切换的

不要写"他从愤怒变成了悲伤"。写"眼神里仍有几分质问，但下眼睑的收紧已经变成对抗湿润的紧绷"。复合情绪用"在几分 XX 里又多了几分 XX"，不要给眉、眼、嘴分配不同的情绪——那会让 H3 生成扭曲的脸。

### 4.3 触发锚定时间点

把每一个面部反应绑定在一个可外部感知的触发上：

- "话音一落，眨一次眼"
- "说到最后一个字时，下眼睑的对抗失效"
- "她的手停在他唇上那一瞬间，他的视线移开"

比"然后他开始哭"精确得多。

### 4.4 物理应激优先于情绪表演

最可信的"表演"来自物理层面：雨水在睫毛尖悬挂后坠落的时机、泪水比雨水慢且反光更稠、湿发贴在额角形成的固定锚点、吞咽时喉结在湿皮肤下的可见运动。

**先写物理事件，情绪会从物理事件里自己长出来。**

### 4.5 动作：不写意图，写"力"

"抽离""挣扎""想站起来"这类词，H3 读不出来——它不是人，不理解"试图"。写这些，画面就会变成静止。

**主例**（实测有效的一次改写）：

```text
❌ He tries to pull his right arm away.
✅ He plants his left hand firmly on the wooden desk and pushes his torso to the left,
   his right shoulder pulling taut against her grip.
```

同一个意思。第二句给了三样它能算的东西：**反作用物**（the desk）、**力的方向**（pushes the torso left）、**张力**（taut against her grip）。

#### 四条规律

1. **给动作一个反作用物。** "抽离"没有对手，"顶着她的手抽离"有。桌子、她的手、椅背、墙——H3 对"顶着某个东西"的理解，远好于"想摆脱某个东西"。
   - `He pulls his arm away` → `He braces his palm against her shoulder and pushes his arm free`
   - `He backs away` → `His back hits the door frame and stops him`
2. **写力的来源和方向，不写位移结果。** `He backs away` 是结果；`His weight is already on his back heel, his front foot dragging` 是过程，每一帧都可拍。
3. **写中间态，不写"做到了"。** "他站起来了"只有最后一帧；"他的膝盖已经伸直一半，重心移到脚掌，一只手还撑在桌沿"每帧都可拍。
4. **一个动作 = 3–4 个部位协同。** `pull his arm away` 只有一个部位动，所以看起来像静止。真实的挣扎是四件事同时发生：

```text
left hand planted on the desk  +  torso pushed left  +  right shoulder taut  +  chin turned away
```

**张力词**：`taut`、`braced`、`straining`、`white-knuckled`、`tendons standing out`。

**检验**：这句话拍出来，是一个**瞬间**，还是一**段时间**？瞬间的都要拆成"正在…"。

#### 遇到"动态不明显"时，不要加重形容词

`forcefully`、`desperately`、`violently` 都没用。按顺序查：

```text
1 写了意图吗（tries to / wants to）→ 换成力
2 有反作用物吗 → 加一个（桌子、她的手、墙）
3 只写了一个部位吗 → 补到 3–4 个协同
4 有中间态吗 → 把"做到了"改成"正在做"
5 对面出力了吗 → 让阻力可见（her grip / her weight leaning in）
```

前四步几乎能解决所有"像静止"的反馈。

### 4.6 速查：常见情绪 → 物理指纹

| 情绪 | 物理写法 | 关键顺序 |
|---|---|---|
| **刚醒** | 眼睛半睁、瞳孔上翻没焦点 → 连眨两下 → 眉头先内收、**然后**下巴才掉 | 顺序反了就像在演 |
| **懵 / 过载** | 眉毛弹起 → 下巴掉 → 瞳孔左右横移两次 → 嘴唇无声念两个音节 → 头往后缩半寸 | 眉毛必须早于下巴 |
| **僵住** | 呼吸停在半口 + 颈筋绷起 + 不眨眼 + **喉结不动** | 连吞咽都不敢 |
| **怕出声** | 膝盖微弯、重心压低、**先脚跟再脚掌**、步子短 | 平脚走就没有"怕吵醒" |
| **决断** | 上睑下压 1mm + 下睑绷紧 + 眉心内侧下压 + **一次慢眨眼（0.6s 合 0.4s 开）** | 四样同时发生才算 |
| **假笑崩塌** | **眼周先松** → 嘴角后掉 → 下颌收紧 | 错了像在忍笑 |
| **病娇的笑** | 眼睛也笑，但**笑得太久**（3 秒不散） | 全片只此一处异常，别处全正常 |
| **温柔的威胁** | 语气和"安慰"完全一样，不做区分 | 当"别怕"和"我不让你走"用同一种语调 |
| **占有** | 手指**扣**而非挽（指节发白）+ 脸贴上去 + 重心靠过去 | — |
| **尴尬** | 手臂被搂住时往外撑一下又停 + 背绷直 + 膝并拢 | — |
| **松一口气** | 肩膀塌 5 厘米 + 胸腔垮下去 + 一次无声长呼气 | 这个"塌"是喜剧的节拍点 |
| **睡着** | 眼皮完全闭合、睫毛线贴皮肤、眼球不动、鼻息能吹动发丝 | 睁眼躺着盯镜头 = 恐怖谷 |

> 这里收了 12 条做速查。完整映射约 25 条（分六组：清醒 / 紧张 / 决断 / 病态 / 尴尬喜剧 / 睡着），见 `h3-scene-prompt-director/references/performance-physics.md`。

### 4.7 喜剧与压迫，两种反向演法

**喜剧**：他必须**极度认真**。观众笑的是"他在拆炸弹"，不是"他在搞笑"。一旦表情里有一丝"我知道这好笑"，整段就塌。笑料只来自物理限制（床板吱呀、头发缠手、被子绊脚），不来自台词。

**压迫**：情绪必须**稳定**。失控的人不可怕，稳定的才可怕。她的呼吸、手、声音都是平的，**全片唯一不对劲的地方是笑的时间太长**。

### 4.8 台词的四个参数

| 参数 | 写法 | 效果 |
|---|---|---|
| 音量 | `barely voiced` / `a thin whisper` / `carrying voice` | 越小越亲密，越大越失控 |
| 气息 | `breathy` / `cracked` / `hoarse` / `tight` | **破音放第一个字**是崩溃的物理证据；放句尾像演完再补 |
| 语速 | `unhurried` / `trailing` / `rushed` | 慢 = 有掌控，快 = 在泄漏 |
| 尾音 | `the last syllable dropping` / `rising` | 落下 = 陈述，上扬 = 求 |

#### 台词不是打字，是剪辑

拿到一句长台词，第一反应不该是"怎么让它念完"，而是"**哪一半可以删掉，用画面代替**"。

| 原始 | 处理 |
|---|---|
| "等一下等一下，这里是恐怖游乐园第三层，我们正在一个死亡游戏中……" | 砍掉"等一下等一下" → 换成**举手制止的动作**；砍掉"恐怖游乐园" → 只留"死亡游戏第三层" |
| "我没想到你会在这里，我以为你已经走了" | 留"我以为你走了"，前半句用**他的眼神**交代 |

**砍下来的部分用动作补**：打断 → 举手/后退半步；判断 → 视线扫过两个方向；情绪 → 呼吸变化；铺垫 → 一只手按在对方肩上。

**规则：一条台词只留一个信息。** 铺垫、语气词、重复，全砍。

这不是妥协——**短句本来更有力**。"死亡游戏第三层"六个字，比二十多个字的原句更吓人，因为观众有时间反应。**长台词是被听过去的，短台词是被记住的。**

### 4.9 画外的人说话怎么办

三条路，风险递增：

| 做法 | 怎么写 | 风险 |
|---|---|---|
| **只给声音不给词**（最安全） | 写进 `overall_soundscape`：`a woman's voice murmuring from beyond the door, too low to make out` | 几乎没有。模型不会给说话人造身体 |
| **给词但不给画面**（有风险） | 用 `<d>` 标记，但只写画外 | 模型可能强行插一张脸，因为它需要一个嘴 |
| **让他出现**（最干净） | 当正经角色处理：身份卡、人数锁、站位 | 无，但多一个角色要维护 |

**不要企图"只出声不现身"还让他把台词说清楚**——在 H3 里这两件事矛盾：`<d>` 会占时间轴并要求一个口型，而口型需要一张嘴。

**最划算的画外音是敲门声**：三下叩门，不需要任何人，就能制造"外面有事"，观众自己会补一个门外的人。

### 4.10 多角色同时反应：短剧最容易做出"真"的地方

只有一个角色在动、其他人在等指令，是最假的画面。现实里一件事发生，在场每个人都会有反应，而且方向不同。

**写法三步**：

1. 先写**触发**（谁做了什么）
2. 再写**每个人的独立反应**，用分号或句号分开，每人给 2–3 个具体部位
3. 最后写**视线关系**（谁在看谁，谁在看别处）

```text
0.00-1.40s: She throws her arms around him. He does not return it — his chin pulls back, his
weight shifts onto his back heel, and his eyes drop to her face. Two paces behind him the
roommate flinches: his shoulders jerk up, one hand rises halfway and stops, and his heel
slides back across the floorboard.
```

三个人同时有反应，但**因果链清楚**：因为她扑过来，所以两个人各自后退——一个是被抱住的错愕，一个是被吓到的本能。两个人的反应类型还不一样，这比细节多少更能让人相信"这是真的"。

#### 四个技巧

**其一，视线可以独立于头。**

写"环顾四周"模型会转头；写 `his eyes sweep left, then right, while his head stays mostly still` 才是"偷看别人反应"。这个动作在"怕被议论"的戏里特别有用：

```text
He answers with his head turned toward the roommate, then his eyes break away and sweep the
room — left, then right — before coming back to him.
```

**其二，给每个人的反应一个"没做完"。**

上面的 `one hand rises halfway and stops` —— 停在半途的手比举起来的手更真实，因为人在惊吓时动作是断的。

**其三，用空间词定位置。**

`two paces behind him`、`to his left, half out of frame`、`at the far end of the table`。不定位置，模型会把三个人挤到一起。

**其四，坐标和惯性比形容词有效。**

- "他后退"是结果；**"他的重心已经移到后脚跟，前脚只剩脚尖点地"**是一个正在后退的瞬间，模型能拍
- "她靠近"不如**"她的膝盖已经越过他的膝盖，胸口距他二十厘米"**
- "她抱得很紧"不如**"她的指节在他背上发白"**

#### 一个常见误用

把所有人写成一模一样的反应（都后退、都张嘴）。真实情况是**反应类型不同**：一个人后退，一个人僵住，一个人反而往前半步想看仔细。

**信任模型的能力**：多角色同时有表情、同时有动作、身体重心转移、视线锁定，这些都是 H3 擅长的。你写得越详细，它做得越准；你写得越保守，画面越像人在等指令。

---

## 五、镜头：七条硬约束

### 5.1 相邻两镜绝不同构图

不是美学偏好，是物理约束。单元是独立生成的，同一个构图的两次生成必然有微差（脸的角度、光的强度、布料褶皱）。单看每段都没问题，**但两段剪在一起，观众会看到画面"跳"了一下**——这不是剪辑的跳，是同一个画面被重画了一遍的跳。

#### 什么算"同构图"：换掉骨架，不是微调参数

观众认一张画面认的是**四根骨架**，四根里换掉至少一根才算换了构图：

| 骨架 | 怎么换才算 |
|---|---|
| **景别档** | 跨一档：特写 / 近景 / 中近景 / 中景 / 全景 |
| **轴线侧** | 机位换到两人连线的另一侧（最强） |
| **主体位置** | 人从居中变到边缘，或反过来 |
| **入画人数** | 双人 → 单人，或单人 → 双人 |

**参数变了但骨架没变，等于没变。** 平视改微侧五度、焦段 50 换 55、机位升十厘米——都不算，剪起来照样跳。

**剪影测试**（唯一可操作的判据）：把两帧并排、眯眼、只看黑白形状分布。两块黑影的位置和大小差不多，就是同构图。

#### 最容易漏的一处：这一单元的前 3 秒

**换构图不是"中间换"，是第一条就是新的。**

很多人想"先接上再变"，于是前 2–3 秒沿用了上一单元最后一帧的构图，到中间才换——剪辑点上必跳，因为观众看到的第一帧就是重复画面。

```text
❌ 0.00-3.00s 沿用上一单元构图 → 3.00s 才换
✅ 0.00-1.20s 就是新构图，用动作和台词接上
```

**衔接靠"状态一致"（她的手还搭在他肩上、刀还在右手），不靠"构图一致"。** 状态一致观众就跟得上；构图重复反而让他们以为卡了。

#### 三种违规形态，第二种最隐蔽

| 形态 | 长什么样 | 你当时会怎么想 |
|---|---|---|
| **① 先沿用再变** | 0–3s 旧构图，3s 才切 | "先接上再发展" |
| **② 起幅重合** | `starts at a medium shot of him on the bed, then pulls back` | **"我用运镜过渡了，等于变了啊"** |
| **③ 落幅重合** | 这一单元结尾 = 下一单元开头 | "留个接口好接" |

**② 为什么最隐蔽**：你确实写了变化（pulls back / pans right），但**起幅就是参考图**。

因果链是这样的：

```text
你传了成片锚点（他坐在床上的中景）
+ CAMERA 写"起幅是他在床上的中景"
→ H3 看到"起幅描述 = 参考图"
→ 最省力的解法：把参考图当第一帧，再开始运镜
→ 0 秒处就是重绘
```

**"平滑运镜"在衔接处是陷阱**——它的价值在连贯，而连贯的前提是"起点和参考一致"，正好踩雷。

起幅要**"从别处看进来"**，不要**"先看回原处"**：

| 错误（起幅 = 锚点） | 正确（起幅 ≠ 锚点） |
|---|---|
| `starts at a medium shot of him sitting on the bed, then pulls back` | `opens on a low angle from the floor beside the bed, his bare foot swinging down into frame` |

#### 三条合法解法：第一条不用换机位

| 解法 | 怎么做 | 代价 |
|---|---|---|
| **A 时间解法：起幅放在动作中途** | 不动机位，把第一秒从"静态起始位"改成"**已经在动的中途**" | **最省，机位完全不用改** |
| **B 空间解法：硬切全新骨架** | 第一秒就是新机位（换轴线或跨景别） | 最强，要多一次生成 |
| **C 同机位彻底锁死** | 机位纹丝不动，让他从原位置站起来**走出画** | 最保守，适合空间连续 |

**A 为什么有效**：上一单元最后一帧是"静态坐姿"，这一单元第一帧是"起身到一半、重心已移到前脚"——**同一个机位，画面已经完全不同**，因为人在动。

| 静态起幅（会重绘） | 动作中途起幅（不会重绘） |
|---|---|
| `He sits on the edge of the bed, about to stand.` | `He is already halfway up, his weight shifted onto his front foot, the quilt sliding off his thigh.` |
| `She holds the door handle, about to turn it.` | `The handle is already turning, her wrist rotated, her shoulder pulling back.` |

**通用形式**：跨单元接人物动作时，**第一秒写在动作的中途，不写在动作的起点**。它同时解决"衔接"和"动态不明显"两个问题。

**不要用第三种——"运镜平滑过渡"。** 它看起来最电影化，实际是唯一会翻车的。

#### ③ 落幅也要查

这一单元最后一个画面不能是下一单元第一个画面。一个"推近再拉回"的运镜，结尾会回到起始构图，等于把上一单元又画了一遍。

```text
[ ] 起幅 ≠ 上一单元的落幅
[ ] 整条中间没有"回到上一单元的构图"
[ ] 落幅 ≠ 下一单元的起幅
```

### 5.2 景别是匹配，不是配额

| 景别 | 脸的可读性 | 适合 | 不适合 |
|---|---|---|---|
| 大特写 / 特写 | 最锐利 | 微表情、眼神变化、短台词 | 交代位置 |
| 近景（胸以上） | 锐利 | 台词、单人情绪 | — |
| 中近景（腰以上） | 稳 | 台词、双人互动、手部动作 | — |
| 中景（膝以上） | 软，但仍可读 | 双人关系、动作、走位 | 长台词的精确口型 |
| 全景 / 远景 | 只剩轮廓 | 氛围、空间、气势、剪影 | **任何需要读表情的内容** |

**唯一判据**：

> **这一镜需要观众读到脸上的信息吗？**

需要（台词、眼神、微表情、转折）→ **中近景以内**。不需要（氛围、位置、气势）→ 中景到全景都行，**而且全景往往更有力量**。

**全景不是禁区。** 剪影、背影、逆光里的轮廓，这些镜头不存在"糊脸"——因为本来就不需要读脸。巨大月轮下的人影、门缝里的全身、雨中的走远，远景正是最优解。

三条仍要守：**主角第一次出场在近景以内**（观众得先认识这张脸）；**情绪转折点不用全景**；**长台词不放中景以外**。

> 景别的完整讨论（含焦段曲线、竖屏特性、以及"交代空间但不牺牲脸的三个办法"）见 `h3-scene-prompt-director/references/shot-continuity.md` 第三节。

### 5.3 正反打：轴线是唯一不能错的东西

| 镜头 | 谁在画面哪边 | 视线方向 |
|---|---|---|
| A 机（过他肩拍她） | 他的肩在**右**缘虚化，她居中 | 她看向**画面左下** |
| B 机（过她肩拍他） | 她的肩在**左**缘虚化，他居中 | 他看向**画面右下** |

两条视线必须**相反**。都朝同一侧 → 空间塌。

#### 坐标死锁：不写死，它就瞎画

**H3 不懂"对话轴线"，它只懂构图平衡。** 你不告诉它人在哪边，它会为了画面好看把人随便摆。

所以每个镜头都要钉死：

```text
<Subject 1> is strictly locked to the LEFT side of the frame, facing RIGHT.
<Subject 2> is strictly locked to the RIGHT side of the frame, facing LEFT.
They never cross the centre line within this shot.
```

**单人镜头也要锁视线方向**——它没有轴线问题，但有"看错边"的问题：

```text
She stays on the right of the frame, looking toward frame-left, off screen.
```

不写，她在画面里看错方向，下一镜的视线就接不上。

**但锁的是"镜头内"。** 换到轴线另一侧是允许的，而且是四根骨架里最强的换法——只是必须靠**切**完成，不能在一个镜头里漂移过去。

**前后必须写**：每次只拍一个人，所以要写清"另一个人在画外"和"他的肩在哪个角"，并写上 `the reverse of the same axis`。

**前景必须锚住**：`his shoulder in the foreground remains completely still`。不锚住，前景人物会自己加戏抢焦点。

**过肩的方向 = 观众的立场**：过他肩拍她，观众站在他的位置（他被凝视）；过她肩拍他，观众站在她的位置（她是被审视的人）。这是叙事选择，不是构图偏好。

#### 一组完整的正反打是四个片段

这一点最容易低估。以为"两个角度"就是两条，漏掉的 C1 和 C4 会让戏散掉。

| 片段 | 功能 | 典型镜头 | 说话者 |
|---|---|---|---|
| **C1** | 建立关系 | 双人中景 / 缓慢推近 | 无，或一句短台词 |
| **C2** | OTS A → B | 过 A 的肩，焦点 B | B，或 A 画外 |
| **C3** | Reverse OTS B → A | 过 B 的肩，焦点 A | A |
| **C4** | 收束 | 单人特写或侧角 | 无 |

**缺 C1**：观众不知道两人在空间里的关系，直接看到两个过肩镜头会失去方位感。
**缺 C4**：戏没有收束，最后一个过肩直接结束会显得"没演完"。

四个片段单独生成时，每个角色的描述词**逐字节一致**——换个同义词对模型就是重新采样，脸会开始漂。

#### 拆开做，还是一次生成内硬切

**两种都成立，取舍不同。**

| 做法 | 切点可控性 | 代价 |
|---|---|---|
| **拆成多次生成**（默认） | 高，想切在哪就切在哪 | 多付生成成本 |
| **一次生成内硬切** | 中 | ① **切点会提前 1–2.5 秒**（写第 5 秒，实测落在 3.5 秒左右）<br>② **可能被"抹平"**——模型在两个视角之间平滑过渡，而不是干净地切过去 |

**"抹平"是这条路最需要警惕的代价**：你要的是刀切，它给的是缓慢转身。判断方法是看中间有没有过渡帧。

一次生成内做的配套纪律：**每句台词各落一段、不跨切点**，观众靠耳朵就能跟住。

### 5.4 场景图是三维地图，不是取景框

场景图提供**房间结构**（墙、门、窗、家具、光从哪来）。**机位由这一镜自己定，可以放在房间任何位置。**

照抄它的机位，所有单元都会是同一个视角，直接撞上 5.1。

正确写法两步：

```text
声明：Image 1 supplies the room as a three-dimensional space — where the door, the window wall
     and the desk stand, and which direction the moonlight enters from — while the camera
     position for this shot comes entirely from the CAMERA section below.
正文：The camera sits at the foot of the bed, one metre from the door, at chest height,
     looking back toward the desk.
```

只写声明不指定机位，模型还是会退回参考图视角——因为那是它手上唯一的空间信息。

**自检**：如果把场景图当成一张平面图，我的机位站在这个房间的哪个位置？答不出来，说明你在照抄。

### 5.5 机位该动还是不该动

> **镜头动，是为了改变观众的注意力；镜头不动，是为了让观众自己看。**

| 该固定 | 为什么 |
|---|---|
| 台词窗口 | 口型的物理要求 |
| 建立空间 | 一动观众就不知道自己在哪 |
| 让人走远/走近 | 距离感来自人在画面里变小/变大，一跟就没了 |
| 情绪顶点 | 静止迫使观众盯着那张脸 |

| 该动 | 为什么 |
|---|---|
| 从"看到"到"看清" | 推近，把注意力收到脸上 |
| 在两人之间转移 | 摇，或一次焦点转移（不是切） |
| 揭示 | 拉开，让对象进画 |
| 跟随移动主体 | 跟拍，**H3 上风险最高**，容易糊脸崩空间 |

**反直觉经验**：**人走出画面比镜头跟过去更有力量。** 她走向门口时机位不动，她越走越小、出画，观众感到"她离开了"；镜头一跟，就只剩"她还在"。

### 5.6 运镜：边界、变量、写法

#### 先看边界：有些镜头做了也白做

写之前先查这张表。**做不成的镜头，写得再漂亮也是浪费一次生成。**

| 运镜 | 能做成吗 | 怎么办 |
|---|---|---|
| 摇镜 / 推 / 拉 / 横移 / 升降 | ✅ 都成立 | 见下面的变量纪律 |
| **半环绕 180°** | ✅ 成立，落点是正背面 | 首选，不需要 LoRA |
| **整圈环绕 / 子弹时间 / 双人整圈** | ❌ 不挂 360 类 LoRA 几乎不闭环 | **改半环绕或弧形横移 90°** |
| **希区柯克变焦** | ❌ 三版全部退化成普通推镜 | **不要指望**，写它就是一次普通推 |
| **荷兰角** | ❌ 单靠提示词无倾角 | 必须挂专用 LoRA，不挂就别用 |
| 急推变焦 | 🟡 成立，但"急"是突变不是快 | 落点写具体，别靠"快速" |
| 甩镜 | ✅ 前提是必须有落点 | 起手物写最前面 |
| 移焦 | ✅ 但容易靠运气 | **必须写死"从 A 到 B"两个深度不同的对象** |
| POV / 顶拍 / 跟拍 / 航拍 / 穿越 / 过肩 | ✅ 都成立 | 各有前置条件，见下面 |

一句话：**能用原生做的都是"机位在空间里移动"；做不到的都是"需要精确闭环或精确倾角"。**

#### 变量纪律：每种运镜只准写自己的变量

多写一个变量，等于给模型一个可动旋钮，它会去转那个旋钮。

| 运镜 | 必须写（排除声明） | 绝对不写 |
|---|---|---|
| **摇镜** | 摇向 + 摇幅（具体角度）+ `the camera body stays fixed at one point` | **焦距**（摇镜没这个变量） |
| **推 / 拉** | 方向 + 起止景别 + **`the focal length stays locked at the same setting`** | — |
| **横移** | 侧移方向 + **`the lens direction stays locked in one direction`** | `the gaze stays locked on the subject`（那是环绕，写了会退化） |
| **升降** | 升/降 + **`the camera stays level throughout`** | 俯仰（写了就变成"升降+摇"） |
| **变焦** | "变焦" + 机位固定 + `the perspective relationship stays unchanged` | 焦距数值当自变量 |

**那三句"声明变量"的话看起来像废话，实际是排他声明**：

- 推拉不写"焦距锁定" → 被读成变焦推
- 横移不写"朝向锁定" → 退化成环绕
- 升降不写"姿态水平" → 变成"升降+俯仰摇"

**变焦推 vs 推镜头**（最常混的一对）：判据**看背景**——变焦推背景等比放大、透视不变；推镜头近大远小差异变大。不看主体多大。

#### 书写顺序：画面里"先出现的东西"写最前面

**这条比措辞更重要。写错顺序，整条运镜就不成立。**

| 镜头 | 开头必须先写 |
|---|---|
| 遮挡 / 揭示 / 视差 | 前景遮挡物（柱子、门框、枝叶） |
| 甩镜 / 穿越 | 起手物（一丛花、门洞）——甩镜的本质是"从 A 甩到 B"，A 不先写就没有甩 |
| 航拍 / 拉升 | 高空全景 |
| POV | 视野里的东西，**主体不入画** |

反例：`<Subject 1> stands in the corridor…` 开头，后面才说被柱子挡住 → 遮挡关系没建立，模型只画一个站在走廊里的人。

#### 四条常用句式

```text
推镜头
At 00:00.000 the shot opens as a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has moved in to a close shot of <Subject 1>'s head and shoulders;
the focal length stays locked at the same setting throughout.

拉镜头（注意：全身镜不宜作首帧，可作尾帧）
At 00:00.000 a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has pulled back so the frame holds <Subject 1> head to toe;
the focal length stays locked at the same setting throughout.

半环绕 180°（整圈的替代）
A medium shot, framing <Subject 1> from the waist up;
the camera arcs slowly around <Subject 1> toward the right of frame, through about 180 degrees;
the camera keeps <Subject 1> centred in frame the whole time.

过肩（双人机位里最稳的一个）
The foreground holds his left shoulder and the side of his back — soft, occupying the
lower-left corner of frame;
a medium shot, framing <Subject 2> from the waist up;
an over-the-shoulder setup — the camera sits behind <Subject 1>'s shoulder, looking at
<Subject 2>, with his shoulder in the foreground.
```

**过肩的坑**：起手必须先写近景肩头，再写对面的人。顺序反了不成立。
**POV 的两条铁律**：不写景别（主体不入画）；行走位移写进剧情，不写进镜头层。

#### 六条通用陷阱

| 陷阱 | 正确做法 |
|---|---|
| **写器材名**（斯坦尼康/云台/无人机/滑轨/摇臂） | 会被画进画面。**描述效果，不描述器材**：`the camera floats smoothly, the image stays steady throughout` |
| **写"没有晃动"** | 提到 X 会提高 X 概率。写正向：`the image stays steady and smooth throughout` |
| **跟拍不写主体** | 必写 `his whole upper body stays inside the frame the entire time` |
| **横移写"纵深"** | "纵深/向深处延伸/尽头是"都是构图指令，会挤掉横向空间。改用**走向句**：`the long veranda runs from the left edge to the right edge of frame` |
| **环境写清单** | 清单式（"柱列、地砖、宫灯必须可见"）会把画面推宽。写**描述式**：一句说清主体所处的环境 |
| **横向运镜复制人** | 窄画幅里模型会复制一个人补位。加防复制句：`Only <Subject 1> appears in the frame from beginning to end.` |

#### 排障顺序：换种子优先于改词

H3 的种子敏感度很高——同一个提示词换个种子，结果可能完全不同（实测：翻滚 0.97 → −0.08）。

```text
1 换种子重跑（最便宜，成功率最高）
2 检查书写顺序（先出现的东西写最前了吗）
3 检查变量纪律（有没有多写不属于这个运镜的变量）
4 检查起手（是不是锚图把构图拽住了）
5 最后才改措辞
```

**先改词是新手最常犯的错**——改了半天，可能本来只是种子不好。

#### 另外两条基本功

**运动类型 + 幅度 + 速度**，写成自然句，不要堆标签：

```text
推荐：The camera pushes in with small amplitude at slow speed toward the letter in her hands.
不推荐：cinematic, push in, zoom, pan, orbit, handheld, fast, epic
```

**景别要写成可验证的取景边界**：

```text
Medium close-up: from the top of his hair down to mid-chest, his head and the microphone
filling most of the frame. The curtain behind him is a soft out-of-focus plane; the frame
ends above the waist, so no floor, no stage edge and no furniture appear anywhere in it.
```

三条：写上下裁切线，不写"中景"这种名词；背景只写紧景里能看见的东西；别用"空场"控制画面（"舞台上没有别的东西"会诱发模型自行填充）。

**文字隐含的景别，永远打赢显式写的景别。** 想要中近景，却在描述里写了"舞台地面""整面幕布"，模型为了让它们都成立会把镜头拉到广角。

**一个时间段只指定一个主运镜。** 次级手持感只作为微小风格。复合运动最多两个，而且必须是**物理连续**的（推 + 仰可以，推 + 绕 + 摇不行）——三个以上互不相干的运动会互相抵消。

> 完整的 12 条英中对照句式、逐条实测与坑，见 `h3-scene-prompt-director/references/camera-motion.md`。

### 5.7 镜头密度：无台词就要切

| 情况 | 镜头数 |
|---|---|
| 有台词 | **1–2 镜**（最多 3）——台词窗口要静止，切碎了口型必漂 |
| 无台词 | **3–4 镜（最少 3）**——对白提供节奏，没有对白就靠切镜 |
| 上限 | **5 镜**——再多就切成碎片，每镜不到 2 秒 |

**10 秒无台词只用 1–2 镜，一定拖。**

#### 按动作节点切，不要按等分切

| 结构 | 切法 |
|---|---|
| **建立 → 局部 → 反应** | 中景交代他在干什么 → 手/脚/道具特写 → 回到脸 |
| **动作 A → 动作 B → 结果** | 第一个动作 → 第二个动作 → 结果或定格 |
| **快切三连** | 眼 → 手 → 刀/道具 → 拉开看全貌 |

```text
例（10 秒 / 4 镜 / 无台词）
0.00-2.20s   中景：他坐在床沿，双手撑膝，低着头
2.20-4.40s   特写：脚踩到地上，脚趾抓了一下地板
4.40-6.80s   中近景：他抬头看向门
6.80-10.00s  中景（轴线换侧）：他从画面左侧走出，门开着
```

**三个镜头不能同骨架。** 连着三个中景，等于一个长镜头切了三刀——观众感觉不到变化。每镜和上镜之间至少换一根骨架（景别档 / 轴线侧 / 主体位置 / 入画人数）。

**最省的组合**：中景 → 特写 → 中近景，每镜都跨景别档，不用换轴线也成立。

---

## 六、一集怎么排

### 6.1 钩子六型

每个单元结尾必须有一个。但"钩子"不是抽象要求，是六种具体机制：

| 类型 | 机制 | 例 | 注意 |
|---|---|---|---|
| **动作钩** | 动作做到一半停住 | 她的指尖抬起来，还没落下 | 停在"即将发生"，不要停在"已发生" |
| **台词钩** | 一句带新信息的话，说完就切 | "你终于肯来了。" | 台词要短，信息必须是观众不知道的 |
| **反差钩** | 状态突然反转 | 他以为溜走了，她的手搭上腰 | 强度取决于前 8 秒铺垫得多彻底 |
| **认知反转** | 观众的理解被推翻 | "门外的人，不是来找我的。" | **一集最多一次** |
| **外部威胁** | 画外的东西逼近 | 三下叩门，人不出现 | 只给声音，不给画面 |
| **悬念揭示** | 物件或细节暴露 | 被褥下压着一把刀 | 用特写，1 秒内说清 |

**六种不要连用同一种。** 连用三次动作钩，观众会发现规律，然后开始预判。

> 钩子的完整用法（一集里的分布建议、认知反转为啥一集只能用一次）见 `h3-scene-prompt-director/references/episode-rhythm.md`。

### 6.2 揭示的时机：先给反应，再给对象

角色看到令人震惊的东西时，**先拍他的脸，再拍他看到的东西**。

- 观众先被迫和他一起"不知道"
- 揭示那一刻，观众的反应和他同步
- 反过来（先给对象再给反应），观众成了旁观者，惊讶消失一半

同一个信息，用这个顺序给，观众会"啊"一声；用相反的顺序，只会"哦"。

**四种释放节奏**：

| 节奏 | 顺序 | 用在 |
|---|---|---|
| 先反应后对象 | 他的脸 → 他看到的东西 | 任何"被震惊"的时刻 |
| 对象先入画 | 她手上的刀 → 他的脸 | 制造焦虑（观众替他着急） |
| 同时给 | 一帧里两人都在 | 日常戏，不用在爆点 |
| 只给反应 | 他的脸 → 切走，永远不给对象 | **集尾**，最强悬念 |

**实用的推论**：重要信息拆成两个时间点给——先给"有人看到了"，隔几秒再给"看到的是什么"。那几秒空白是观众自己往里填的时间，比任何画面都有力。

### 6.3 收尾四手法

| 手法 | 怎么拍 | 适合 |
|---|---|---|
| **一帧两种状态** | 她闭眼，他睁眼，同框 | 反差型收尾（甜 vs 恐惧） |
| **光变化** | 烛火吹灭、云遮月、门关上光被切断 | 任何类型，最便宜 |
| **人物静止** | 最后一秒完全不动，连呼吸都停 | 僵硬、震住、无路可退 |
| **走远** | 她走进月光里、走出画面 | 氛围向、留白向 |

**"一帧两种状态"为什么有效**：它在一帧里同时交付两条信息，而且互相解释——她闭眼是安心，他睁眼是不敢睡，两人贴在一起说明她以为他们很亲密。三件事同时成立，观众自己读出"这段关系有多错位"，不用一句台词。

最后一单元的**最后 1.2–1.6 秒，不要有新动作或台词**。让画面停住。还在动，观众觉得"没结束"；完全静止，观众会自己开始想。

---

## 七、每单元开工四步

### 第 0 步：填状态卡

**在写任何提示词之前填这张卡。** 它不是给自己看的笔记，是**给下一个接手的人（或模型）看的交接单**。

```text
【第 __ 单元 · 状态卡】

■ 空间
  房间：________（例：古宅卧室，床头侧有拔步床，门侧有格扇门与条案）
  他：在 ________（例：床那侧，半撑起，臀部不离床面）
  她：在 ________（例：门那侧，站在格扇门前，面向床）
  两人距离：________（例：约两步，中间隔着月光格纹的地板）

■ 物件
  他手上：________（例：空，双手撑在身侧）
  她手上：________（例：银色小刀，垂在右手，刃朝内）
  其他道具：________

■ 服装状态
  他：________（例：灰紫T恤、黑裤、赤脚）
  她：________（例：一字肩白纱裙、披到脚踝、露肩、赤脚）

■ 光
  主光：________（例：月光从门那侧进来，冷蓝 5600K，地面硬格纹）
  辅光：________（例：床头铜烛台，暖橙 2000K，勾他右肩轮廓）

■ 上一单元最后一帧
  画面内容：________
  眼睛状态：________（她闭眼 / 半睁 / 睁眼，看向哪里）

■ 这一单元要改变的
  唯一一件事：________
```

三条纪律：每项写**具体坐标或数值**（不写"她在他旁边"，写"她在他右侧约四十厘米"）；"上一单元最后一帧"是最重要的一行；"要改变的"只能填一件事（填出两件说明这是两个单元）。

**填不出来时**：不记得位置 → 看上一单元成片或它的提示词文本；不知道她手上有什么 → 翻上一单元的一致性锁；光和上一单元对不上 → 以**环境卡描述的方位**为准（光位由房间决定，不由镜头决定）；对手角色上一单元根本没入画 → 他的姿态**由这一单元的第一个动作决定**，不要试图从上一单元找。

### 第 1 步：读图七项

拿到成片时，**按七项逐条提取**，看不出来的明确写"看不出来"，不要猜。

1. **人物位置**——谁在画面哪一侧？相对距离？谁在前谁在后？
2. **姿态**——各关节状态：坐/躺/站，谁承重，膝盖朝哪
3. **手与道具**——谁的手在做什么？手上有东西吗？放在哪？
4. **表情与眼睛**——闭合程度（闭/半睁/睁）？看向哪？嘴角状态？
5. **光位**——主光从画面哪一侧来？辅光在哪？冷暖各在哪边？
6. **机位**——高度、俯仰角、景别（裁到哪）、焦段感
7. **服装状态**——有没有滑落、褶皱在哪、袖口在哪

因为下一单元的 `POSE AND STAGING` 和 `LIGHT AND ATMOSPHERE` 就是靠这七项写的。**少提取一项，下一单元就少一句交代，那一项就会自己长。**

常见漏项：手与道具（刀不见了）、眼睛状态（上一镜闭眼，这一镜睁眼盯人）、服装状态（纱滑到肩下又穿好了）、光位（月光从左变成从右）。

### 第 2 步：定戏眼

**这一单元最值钱的那一秒是什么？** 答不出来，先别写。

```text
问 1  这一单元结束时，观众得到了什么新信息？
      （答案是"没有"，这一单元就没有存在必要，合并进相邻单元）
问 2  这一单元里，谁在主动、谁在被动？
      （主动的人决定机位高度、景别和光）
问 3  观众此刻知道什么、角色知道什么？信息差在哪？
      （短剧张力九成来自信息差）
问 4  这一单元最后一个画面，应该是哪一帧？
      （先说清最后那一帧，再倒推整段怎么走到那里）
```

**问 4 是捷径**：戏眼几乎总落在**最后那一帧**上。先写"最后那一帧是：她的手指在他胸口，笑挂了三秒没散，他的眼睛睁着没眨"，前面 9 秒的任务就只剩一件——把他送到那一帧的状态。

### 第 3 步：定视角

先查上一单元的机位（一行）：`上一单元：85mm，他的右肩后，俯 3°，近景`。**这一单元不能一样。**

再判衔接类型：

```text
机位变了吗？  空间变了吗？
├ 都没变  → 同机位延续（只改景别或改动作）
├ 只变机位 → 换机位同空间
└ 空间变了 → 换空间
```

| 类型 | 必须带 | 口诀 |
|---|---|---|
| 同机位延续 | 成片锚点（几乎全靠它） | **同机位靠图** |
| 换机位同空间 | 环境卡 + 身份卡 + 位置描述；成片只负责状态 | **换机位靠环境卡** |
| 换空间 | 新环境卡 + 明确的走位路径 | **换空间靠走位** |

**选新机位**——按"观众该站哪边"：

| 观众该站哪边 | 选什么 |
|---|---|
| 和他一起被困 | 过**她**的肩拍他 |
| 看着她、审视她 | 过**他**的肩拍她 |
| 压倒性的压迫 | 过肩 + 85mm + 她的脸占满画面 |
| 交代空间 | 中景 + 人物走位（不要拉全景） |
| 只剩一件事重要 | 微距 |
| 收束一集 | 中近景；氛围向可换远景 |

---

## 八、失败模式

| 症状 | 病因 | 修法 |
|---|---|---|
| **两张脸融合成一张** | 没有互斥特征 | 给互斥特征（眼镜/无眼镜、左/右、说话/倾听）；`retention` 用正向语言写"以 X 为唯一基准"；仍失败就分开生成再拼 |
| **台词分给了错的人** | 说话者 ID 不稳定 | 每句台词由 `<Subject N> says:` 引出；同镜头写明倾听者嘴唇闭合 |
| **口型后半段漂** | 台词太长 / 有运镜 | 缩到一次呼吸内；台词放镜头前半段，末尾留收敛时间；避免紧特写 |
| **倾听者抢戏** | 前景没锚住 | 前景只写"肩膀保持静止"，不写任何可执行的面部动作 |
| **相邻两镜接起来"跳"** | 同构图 | 机位/景别/角度至少一项明显不同 |
| **脸糊了** | 景别太远 | 要么改中近景，要么接受它不需要被读 |
| **凭空多一个人** | 传了不入画角色的图 | 删掉那张身份卡 |
| **背景长出家具** | 场景机位没钉死 | CAMERA 段写一句机位在房间的位置 |

---

## 九、工作流

```text
1 判定形态    单条 or 剧集？有独立人物图 → Ref2VA
2 内部责任矩阵  每张素材：asset/order | 职责 | 保留什么 | 排除什么 | 用在哪些镜头
3 推导情绪弧线  起点 → 终点；切分节拍；判断叠加还是替换；找出唯一最外显点
4 写六段式    外壳 + 七段骨架；台词进 <d>；正反打写明 OTS 方向
5 自检        见下
```

**自检清单**：

```text
[ ] 每个 Subject 都有屏幕位置和说话者角色
[ ] 每张参考图只有一个职责，排除句写全了
[ ] 成片锚点写了 copy zero of its framing and zero of its camera position
[ ] 时间码首尾相接、累加等于时长、末拍有余量
[ ] 台词都能在一次性呼吸内说完，窗口内镜头静止
[ ] 每一拍只有一个新事件，没有两个部位同时大变
[ ] 最外显的表演只出现一次
[ ] 没有残留的否定式表述
[ ] 景别写成了取景边界，不是"中景"两个字
[ ] 相邻单元构图明显不同
[ ] 没有跨条引用（as before / previous shot）
[ ] 画面里所有关键物件都重新陈述了
```

---

## 十、两个完整示例

两个都要看：10.1 是**单人**，展示七段骨架的完整写法；10.2 是**双人过肩**，展示多主体隔离与 OTS 写法。这两个是 H3 最容易翻车、也最需要照抄的场景。

### 10.1 单人中近景（七段骨架完整写法）

```text
subject_definitions:
<Subject 1> is the woman from <Picture 1>, wearing a white off-shoulder gown. Positioned on the
right of the frame, facing left. Her facial features, the hairpin above her right temple and
the beauty mark below her left eye are strictly locked to <Picture 1>. Speaker ID: S1.

summary:
[reference generation] One continuous medium close shot. She is speaking to someone off frame
to the left, in a dark bedchamber at night. Single shot, no cuts.

retention_analysis:
<Subject 1>: fully_preserved — facial identity, hairpin position, beauty mark, gown structure,
position on the right, speaker role. attribute_transfer — the cold rim light along her shoulder,
the fine strands of hair across her cheek. strictly_avoided — the sheet's studio lighting,
the open-eyed smiling expression printed on the sheet, identity drift across the take.

detailed_description:
CHARACTER: Photorealistic cinematic film still, live-action film look, natural skin texture
with visible pores, fine vellus hair and real subsurface scattering, restrained teal-and-slate
color grade. She keeps her exact character design from <Picture 1>: very long straight black
hair with a centre part, a white jade hairpin with a short silver tassel above her right temple,
a small brown beauty mark below the outer corner of her left eye, a white off-shoulder chiffon
gown with translucent bishop sleeves.

POSE AND STAGING: She stands facing the left of the frame, her weight on her front foot, her
right hand at her side, her shoulders level. The carved door panel stands behind her, its frame
entering the right edge of the frame out of focus.

TIMELINE:
0.00-1.20s: Her eyes rest on a point off frame to the left; her breathing is slow and even, and
her mouth stays closed.
1.20-2.40s: Her chin lifts a few degrees and the corner of her mouth eases upward without
opening.
2.40-4.00s: In a soft, low, unhurried voice with the vowels drawn out (S1) she says:
<d>[Chinese] 你终于肯来了。</d>
4.00-5.20s: Her smile deepens and reaches her eyes, the skin crinkling at both outer corners.
5.20-6.40s: The smile stays exactly where it is and does not fade; she blinks once, slowly.
6.40-8.00s: Her eyes slide a few degrees to the left without her head moving.
8.00-10.00s: She holds the smile and the stillness; the frame does not move.

CAMERA: 85mm equivalent, at her eye height, slightly to the right of her centre line, a medium
close shot from the waist up, the door frame soft at the right edge, focus locked on her eyes
and mouth, one very slow push of five centimetres across the first six seconds and then locked
dead still for the last four.

PHYSIOLOGY PRIORITY: breathing amplitude > eyelid > smile > eye direction. Breathing is slow and
even throughout. The smile opens at 2.400s and holds past the point where a real smile would
fade. One slow blink at 5.200s. Her eyes shift at 6.400s while her head stays still. At most two
changes land inside any single second.

LIGHT AND ATMOSPHERE: Hard pale blue 5600K moonlight comes from behind her, rimming her hair and
her bare shoulder in cold light while her face sits a stop and a half down. A warm-orange 2000K
candle off frame to the left lifts the near side of her jaw. Highlights held just below clipping,
shadows deep and desaturated blue-grey.

CONSISTENCY LOCK: her weight stays on her front foot, her right hand at her side, her shoulders
level and her head not turning. Her hairpin stays above her right temple and the beauty mark
stays below the outer corner of her left eye. Exactly one woman in the frame.

overall_soundscape: A quiet night room tone with a faint low hum, distant insects beyond the
door, the light rustle of chiffon as her shoulder settles, her calm unhurried breathing, and
one quiet swallow just before she speaks.

non_diegetic_music: N/A
```

### 10.2 双人过肩（C2 片段，多主体隔离）

这是正反打里的 C2：**过他（Subject 1）的肩，焦点在她（Subject 2）**。注意四个写法——互斥的屏幕位置、前景肩膀锚定、倾听者嘴唇闭合、`the reverse of the same axis` 的兄弟写法（这里是正打，所以不写）。

```text
subject_definitions:
<Subject 1> is the man from <Picture 1>, wearing a muted grey-purple crew-neck t-shirt.
Positioned at the lower left of the frame as a foreground shoulder, facing away from camera.
His build and the small mole on the right side of his neck are strictly locked to <Picture 1>.
Listener. His lips remain completely closed and his shoulder stays completely still.

<Subject 2> is the woman from <Picture 2>, wearing a white off-shoulder chiffon gown.
Positioned centre-right of the frame, facing left. Her facial features, the hairpin above her
right temple and the beauty mark below the outer corner of her left eye are strictly locked to
<Picture 2>. Speaker ID: S1.

summary:
[reference generation] Segment C2 of a shot/reverse-shot sequence. An over-the-shoulder medium
close shot from behind the man, focusing entirely on the woman, in a night bedchamber.
One continuous shot.

retention_analysis:
<Subject 1>: fully_preserved — the mole on the right side of his neck, the grey-purple t-shirt,
position as foreground shoulder at lower left, listener role. attribute_transfer — the pale grid
of moonlight lying across his shoulder. strictly_avoided — identity mixing with Subject 2, any
facial movement, any movement of the foreground shoulder.

<Subject 2>: fully_preserved — facial identity, hairpin position, beauty mark, gown structure,
position centre-right, speaker role. attribute_transfer — the cold rim along her shoulder and
hair. strictly_avoided — identity drift, the open-eyed smiling expression printed on the sheet.

detailed_description:
CHARACTER: Photorealistic cinematic film still, live-action film look, natural skin texture with
visible pores, fine vellus hair and real subsurface scattering, restrained teal-and-slate color
grade. She keeps her exact character design from <Picture 2>: very long straight black hair with
a centre part, a white jade hairpin with a short silver tassel above her right temple, a white
off-shoulder chiffon gown with translucent bishop sleeves.

POSE AND STAGING: An over-the-shoulder view from behind his right shoulder, which fills the lower
left of the frame as a soft dark mass. She sits half upright on the edge of the bed at
centre-right, her left hand braced on the mattress, the quilt fallen to her hips, her shoulders
turned toward him.

TIMELINE:
0.00-1.20s: Her eyes come up to a point just off frame at the lower left; her breathing is slow
and even and her mouth stays closed.
1.20-2.40s: Her chin lifts a few degrees and the corner of her mouth eases upward without
opening.
2.40-4.20s: In a low, unhurried, faintly hoarse morning voice with the last two syllables
dropping (S1) she says: <d>[Chinese] 相公，你怎么醒了？</d>
4.20-6.00s: Her smile stays where it is; she blinks once, slowly, and her shoulders settle.
6.00-8.00s: Her eyes slide a few degrees to the left without her head moving; the foreground
shoulder stays completely still.
8.00-10.00s: She holds the smile and the stillness; the frame does not move.

CAMERA: 85mm equivalent, from just behind his right shoulder, at her eye height, a medium close
shot from the waist up with his shoulder soft and large in the lower left corner, focus locked
on her eyes and mouth, zero camera movement for the whole take.

PHYSIOLOGY PRIORITY: breathing amplitude > eyelid > smile > eye direction. Her breathing is slow
and even throughout. The smile opens at 2.400s and holds. One slow blink at 4.200s. Her eyes
shift at 6.000s while her head stays still. At most two changes land inside any single second.

LIGHT AND ATMOSPHERE: Hard pale blue 5600K moonlight comes through the lattice window on her left
and rims her shoulder and the edge of her hair, while her face sits a stop and a half down. A
warm-orange 2000K candle at the bed head lifts the underside of her jaw. His shoulder in the
foreground sits in near darkness. Highlights held just below clipping, shadows deep and
desaturated blue-grey.

CONSISTENCY LOCK: she stays half upright on one hip, her left hand braced on the mattress, her
shoulders turned toward him, and she does not stand. Her hairpin stays above her right temple
and the beauty mark stays below the outer corner of her left eye. Exactly one woman in the
frame, plus his right shoulder as the only other body element.

overall_soundscape: A quiet night room tone with a faint low hum, distant insects beyond the
lattice, the soft drag of quilted cotton as she settles her weight, her calm unhurried breathing,
and one quiet swallow just before she speaks.

non_diegetic_music: N/A
```

**这个例子里最该照抄的三处**：

1. **`Positioned at the lower left ... as a foreground shoulder`**——把前景那个人降级成"一个肩膀"，不是"一个人"。不这么写，模型会给他一张完整的身子和一张脸。
2. **`His lips remain completely closed and his shoulder stays completely still`**——倾听者的双重锚。少一个，他就可能皱眉、张嘴、或者动肩膀抢焦点。
3. **一致性锁里 `Exactly one woman in the frame, plus his right shoulder as the only other body element`**——人数锁必须把"半个身体"单独数出来，否则它会去凑一个完整的人。

---

## 十一、视频参考与动作迁移

### 11.1 先选模式：复刻态还是重建态

**这一步在写 retention 之前。** 选错了会同时犯两个错：背景被文字重编、景别被描述带远。

**30 秒判断法（三问）**：

1. 要替换的对象只有人（最多加衣服）？
2. 用户没有点名新地点？
3. 背景一变，就不算"同一个镜头"了？

三个都"是" → **复刻态（1:1）**。只要有一个"否" → **重建态（换景）**。

| | 复刻态（1:1） | 重建态（换景） |
|---|---|---|
| `<Video N>` 迁移什么 | 动作 + 构图景别 + 运镜 + **背景 / 光 / 色调 / 道具** | 动作（可选构图或运镜） |
| 正文能不能写背景 | **不能**，只许写 `…are the ones in <Video 1>, unchanged` | 必须写，且只写紧景可见的 |
| 最高风险 | 参考人物的假发 / 墨镜 / 服装残留 | 景别被背景描述带远 |

**两句记法**：

- **复刻态：看得见的都交给视频，文字只回答"谁"**
- **重建态：看得见的都交给文字，视频只回答"怎么动"**

复刻态的核心动词是**替换**，不是忽略。写 `replace the performer in <Video 1> with the woman from <Picture 1>`，不要写 `ignore the performer`——压不住一个占半屏的具体人，假发和外套会以"残留"的形式回来。

完整对照表、四条硬写法、两个隐藏地雷见 `references/ref2va-video-reference.md` 的 3.0 节。

### 11.2 六段式不变，只改三处

1. **`subject_definitions`** 多一行 `<Video N>`。它是"`<Picture N>` 不能单独成行"的唯一例外——它定义时间结构，允许单独成行
2. **`retention_analysis`** 用固定枚举：`fully_preserved` / `partially_preserved` / `attribute_transfer` / `weak_reference`，加排除项 `strictly_avoided`；音频用 `fully_copy` / `partially_copy` / `reference`。**一份参考里既有你要的又有你不要的，就永远不要标 `fully_preserved`**
3. **`detailed_description` 不写时间码、不写动作句子**——时间轴归视频。只写视频给不了的那一半：脸、发型、服装、表情、背景、光线

**四条铁律**：`<Video N>` 职责越窄迁移越准；运镜归属必须二选一写死（`does not follow the original path from <Video 1>` / `follows the path preserved from <Video 1>`）；动作归属必写（谁承担哪份运动，两份不可互换）；视频自带音轨而你不要，必须显式排除。

### 11.3 动作迁移的最小工作流

**三个前提**：

1. **一次只用一条参考视频**——两条同时进同一次生成，动作会互相稀释
2. **先定复杂度分级，再定时长**

   | 级别 | 特征 | 时长 |
   |---|---|---|
   | **S** | 慢、单平面、无遮挡（挥手、点头、慢走） | 单次可到 15s |
   | **M** | 多肢体协同、中速（舞句、跳跃落地） | 单次 ≤10s |
   | **L** | 旋转、快速脚步、技巧动作、强遮挡 | 拆段，每段 ≤8s |

3. **复杂背景会吃掉动作保真度**——背景分走了细节预算，这是一笔交易，不是风格问题

**三件必做**：

- **Beat Sheet 是分析产物，不进提示词。** 看参考片把动作分成 1–4 拍写下来，用来定时长和事后对照"哪一拍丢了"，默认不写进提示词
- **给动作本身开一个 Subject**：`<Subject 2> is the dance routine performed in <Video 1>, including its step sequence, timing and tempo.` 动作从此是可引用实体，多主体互不污染
- **拆段时按时间区间裁开喂**：`fully_preserved — body action sequence of the reference clip from 00:00.000 to 00:03.400 only`。不裁，拼接后动作会翻倍

**重试只改一个变量，先修最便宜的那层**：

| 症状 | 第一手 |
|---|---|
| 动作被换成通用动作 | `retention` 写清迁什么；首句重申动作来源 |
| 拍间速度漂移 | 补时间窗（指向来源） |
| 身份中途漂移 | 补 1–2 个更强锚点 |
| 熔肢 / 多肢 | 动作停顿处分段；场景剥成纯背景 |

同一层失败两次后不要盲试第三次，向用户提简化方案。

完整流程（16 节，含分段接续、尾帧接力、降级路线、多主体制作卡）见 `references/motion-transfer-workflow.md`。

---

## 十二、更细的东西在哪

这份文件是**结论集**。更细的内容分两处：本技能自带的两个深度文件，和重型版 `h3-scene-prompt-director`。

### 本技能自带的（`skills/H3/references/`）

| 你要做 | 去哪 |
|---|---|
| **视频参考的完整规范**（复刻态/重建态对照表、四条硬写法、两个隐藏地雷、四级保留枚举） | `references/ref2va-video-reference.md` |
| **动作迁移的完整流程**（16 节：入口判定、六项确认、Beat Sheet、分段接续、尾帧接力、重试策略、降级路线） | `references/motion-transfer-workflow.md` |

这两份是**本技能的权威版**，不是镜像。视频参考和动作迁移这两个主题，读它们就够，不需要再去重型版。

### 重型版里的（`h3-scene-prompt-director/references/`）

| 你要做 | 去哪 |
|---|---|
| 从零做一集（资产规划 → 出图核对 → 单元编排 → 接力） | `series-workflow.md` |
| 写角色/场景的出图提示词，或核对出图结果 | `asset-production.md` |
| 算槽位数量、决定撤哪张、多图防混淆 | `slot-economy.md` |
| 查一个词的准确定义（单元 / 镜头 / 锚点 / 机位 / 景别……） | `glossary.md` |
| 完整的状态卡模板、读图七项、开工四步 | `shot-intake.md` |
| 钩子六型、揭示节奏、收尾手法的完整版 | `episode-rhythm.md` |
| 更多情绪 → 物理动作的映射（约 25 条，本文只收了 12 条） | `performance-physics.md` |
| 六层生理的时间轴错位编法 | `physiology.md` |
| 镜头之间怎么接（含焦段曲线、竖屏特性、机位动不动） | `shot-continuity.md` |
| 症状 → 病因 → 修法的完整表格 | `failure-modes.md` |
| 三字段格式的完整语法、对话标记、可拍摄性禁用词表 | `h3-output-spec.md` |

> **本文与重型版有重叠是故意的**：本文给结论和速查，重型版给展开和边界。两处如果说法不一致，**以重型版为准**（它是唯一事实源），然后回来改本文。

---

## 最后一条原则

H3 不执行"演得悲伤一点"。它执行的是**一次喉结吞咽、一次下眼睑对抗、一次视线离开不到半秒又看回去**。

你的全部工作，是在承认"每次生成都是无状态的、硬切有信息预算、多主体有身份混合风险、中文口型有长度纪律"这些前提下，把这些生理事件按秒排进六段式字段里，并保证**声音、口型、视线方向和跨单元身份描述逐字节一致**。
