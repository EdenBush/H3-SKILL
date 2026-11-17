# Ref2VA 视频参考：标签、互斥绑定与保留枚举

> **镜像文件。** 权威版在 `H3`（h3-ref2va-acting-director）技能的 `references/ref2va-video-reference.md`。这份是给"图片路径技能"顺带查阅用的同源副本，**改动必须两边同步**。

参考视频模式的提示词，本质是在回答一个问题：**`<Video N>` 到底"拥有"这条生成视频的哪一部分时间结构？** 把答案写进 `fully_preserved`，把你不想要它拥有的部分逐项放进 `strictly_avoided`，再用 `<Picture N>` 锁定它不该触碰的身份。

**视频参考比图片参考更强，也更容易"吃掉"其他素材。职责越窄，迁移越准。**

---

## 一、参考视频归 Ref2VA（全参考生成）

参考视频与参考图片共用同一套**六段式**结构，核心差异只有一条：

| 素材类型 | 锁定的是 |
|---|---|
| `<Picture N>` | **静态身份**——某一刻的像素锚点 |
| `<Video N>` | **时间维度上的关系**——动作节奏、运镜路径、剪辑卡点、表演节拍，甚至声音波形 |

所以提示词的关键任务**首先**是界定 `<Video 1>` 提供什么、不提供什么，以及它与图片、音频之间的优先级；描述视频里有什么，反而是次要的。

---

## 二、四类标签（编号各自独立）

| 标签 | 语义 | 常见误用 |
|---|---|---|
| `<Subject N>` | 可复用的可见内容（人物、物体、场景的身份定义） | 把 Subject 当成"某一帧"来引用 |
| `<Picture N>` | 具体的帧锚点（某一刻的画面） | 让它承担动作职责 |
| `<Video N>` | **整片级别的关系**——整条参考视频作为一个时间结构被引用 | 写成"视频里的某一帧"或"视频里那个人" |
| `<Audio N>` | 音频信号 | 让音频单独承担画面职责 |

`<Video 1>` 和 `<Picture 1>` 可以来自同一个上传文件，但语义完全不同：**Picture 是像素锚点，Video 是时间关系**。

API 层面，参考视频通过 `reference_video` 这个 role 传入；`<Video N>` 是写在提示词里的别名，用来指代它承担的职责。

---

## 三、互斥绑定：每份素材只做一件事

参考视频最容易出的问题不是"没参考上"，而是**参考了太多东西，互相争夺控制权**。一段参考视频同时包含人脸、服装、动作、运镜、光线和背景；不明确分配，H3 会默认"尽量全部保留"，结果是画面既不像目标人物，动作又卡顿漂移。

正确做法：在 `subject_definitions` 或 `summary` 里**用一句话完成绑定**，然后只在 `retention_analysis` 中展开保留策略，**不要在每一个镜头里反复重新描述素材职责**。

```text
<Video 1> is the reference clip for motion rhythm, body action sequence, and camera path only. It does not provide facial identity, clothing, or background.
<Picture 1> is the sole source of facial identity and hairstyle for <Subject 1>. <Subject 1>'s face and hair are strictly locked to <Picture 1>; no facial features are inherited from <Video 1>.
```

关键是**互斥**：视频不提供脸，图片不提供动作。不写这条互斥线，模型会自行混合，而混合的结果通常是"参考视频里的脸覆盖了图片里的脸"或"动作迁徙僵硬"。

---

## 四、`retention_analysis` 是固定枚举，不是自由措辞

三个词，别自创：

| 枚举 | 含义 | 典型用途 |
|---|---|---|
| `fully_preserved` | 原样保留 | 整份都要的背景板、固定风格图 |
| `partially_preserved` | 只保留列出的方面 | **编舞 / 运镜视频（最常用）** |
| `attribute_transfer` | 把列出的属性搬到另一个主体 | 把照片里的脸搬到表演者身上 |
| `weak_reference` | 只借风格、氛围、构图 | 色调参考、情绪板 |
| `strictly_avoided` | 逐项排除 | 脸、衣服、背景、色调、原音轨 |

音频另有 `fully_copy` / `partially_copy` / `reference` 三个专用词。

> **铁律：一份参考里既有你要的、又有你不要的，就永远不要标 `fully_preserved`。**
> 参考视频几乎总含着"人 + 衣服 + 背景 + 光线 + 音轨"，所以只要它承担编舞或运镜，就必须是 `partially_preserved`，并补一句"原表演者的外观一律不迁移"。标成 `fully_preserved` 是"脸被视频覆盖""背景串味"的头号原因。

选级别口诀：**选能满足目标的最窄那一级。**

### 目标 A：拍法不变，只换视觉（"视觉换皮"）

保留原视频的动作、运镜、节奏和剪辑，只替换人物 / 产品 / 场景。

```text
retention_analysis:
<Video 1>: partially_preserved — action sequence, timing of each beat, camera position, camera movement path, cut rhythm, on-screen motion speed. strictly_avoided — facial identity, clothing, background scene, original color grade, original audio track.
<Subject 1>: fully_preserved — facial identity and hairstyle locked to <Picture 1>. attribute_transfer — body follows <Video 1> action sequence exactly.
```

`summary` 一句话锁关系：

> The target video strictly reproduces the timing, camera path, and action sequence of `<Video 1>`, while replacing all visible identity and scene content with `<Subject 1>` and a new environment.

这种写法下，`detailed_description` **不需要逐帧重新描述动作**——`<Video 1>` 已在 `partially_preserved` 中承担了时间结构。只描述**替换后的视觉如何嵌入这个时间结构**：新人物在新场景中的外观、光线、声音，以及与参考节拍对齐的关键状态变化。

### 目标 B：只借动作或运镜（"动作迁移"）

只要参考视频里的**一段动作**或**一种运镜**，不要它的节奏、剪辑或表演。此时保留范围必须收窄。

```text
retention_analysis:
<Video 1>: partially_preserved — body action sequence only: the three-step run-up, right-foot takeoff, tuck in mid-air, two-foot landing. strictly_avoided — camera path, cut rhythm, facial expression, clothing, background, original timing between beats, original audio track.
<Subject 1>: fully_preserved — facial identity locked to <Picture 1>. attribute_transfer — performs the action sequence from <Video 1> at a natural pace; body proportions and clothing remain consistent.
```

关键：**把"动作"拆成可枚举的事件序列**，不要写"参考视频里的跳跃动作"。越具体的动作描述，模型越能准确迁移那一段，而不会把整条参考视频的节奏和运镜一起吞进来。

> 枚举不出来怎么办：至少写成"从起势到收势的完整动作序列 + 每一拍起停的节拍"，并把速度放进 `attribute_transfer`（`at a natural pace`）。这是枚举缺失时的最低可用写法，但仍建议事后补上 3–6 个事件短句。

---

## 五、动作迁移时 `detailed_description` 写什么

### 5.0 第一原则：不打时间轴，不写动作

参考视频承担人物动作时，这里**不出现任何时间码括号，也不出现任何描述人物动作的句子**。

1. **时间轴已经归 `<Video 1>` 了。** 同字段里再放一套 `[0–3s]`，会有两个时间结构，通常括号赢 → 动作被压进括号、其余时间自由发挥。**症状：动作只在前半段做完，后半段站着不动。**
2. **动作文字会压制视频。** 写"每拍张开、落下""头带动帽子"这类句子，模型会照文字演，把视频降级成素材。

**只有两种例外可以打时间码**：① 特调人物表情（`[6.0s] her smile drops`）；② 背景发生事件（灯箱变色、车灯扫过、有人推门）。这两者跟动作不抢同一个自由度。

**目标 B 是唯一需要枚举动作的分支**，且必须先把视频裁到同一时间区间；目标 A 整段迁移时，动作事件列表和描述里的动作句都要删掉。

**该写满的是视频给不了的那一半**：脸、发型、服装、身份标志物、表情、背景、光线，以及一句材质惯性物理句（`Every fabric, strand of hair and ribbon behaves with the weight and inertia of its real material.`）——这句压的是人偶感，不取代动作。

**元指令写进 `summary`（权重最高，只写一次）**：

```text
No other line in this prompt describes, adds to or overrides the motion: every movement in the frame is the movement of <Video 1>.
```

### 5.0.1 「不写动作」≠「不写动作归属」

把动作描述和动作归属一起删掉，结果是**所有人被同化成同一种运动**——原片里 A 走路、B 跳舞，成片变成两人一起走路。

| 层 | 内容 | 写不写 |
|---|---|---|
| 1 归属 | 谁演哪一份运动、两份不可互换 | **必写** |
| 2 类别 | 走路 / 跳舞 / 转身（只贴标签，不展开） | 可写，多主体时通常需要 |
| 3 细节 | 节拍、部位、幅度、速度、顺序 | **禁写** |

```text
<Video 1> contains two figures doing two different things at the same moment. The near figure's walking, phone-holding motion belongs to <Subject 1>; the far figure's dance belongs to <Subject 2>. The two are not interchangeable and are never averaged.
```

### 5.1 常规填写

`<Video 1>` 承担动作时，`detailed_description` **不重述动作本身**（那是 `<Video 1>` 的职责），只描述新身份和新场景里的**静态层与被动层**——长相、服装、表情、光线、背景、材质惯性。

```text
[Shot 1] <Subject 1>, whose facial identity is locked to <Picture 1>, stands in a rain-soaked forest clearing. The body performs the action sequence preserved from <Video 1>: a three-step run-up, right-foot takeoff, tuck in mid-air, and two-foot landing. During the run-up, the wet fabric of the jacket clings to the shoulders and releases with each stride. At takeoff, the jaw tightens and the eyes narrow slightly. The camera does not follow the original path from <Video 1>; it remains at a low fixed position, letting the figure cross the frame laterally. On landing, rainwater sprays outward from the impact point, and the hair, soaked, falls forward over the forehead before being pushed back with one hand.
```

这一段同时做了四件事：

1. `<Video 1>` 提供动作序列
2. `<Picture 1>` 提供脸
3. 文字提供**新场景特有的物理反应**（湿衣物、水花、头发）——这是参考视频给不了的增量
4. 明确排除原始运镜（`The camera does not follow the original path`）

要保留原始运镜，把第 4 条改成 `The camera follows the path preserved from <Video 1>` 即可。**这一句必须写，二选一，不能空着**——空着模型会自行选择，且通常选择错误。

**非人部件是最大的增量**：参考视频里的人没有尾巴 / 翅膀 / 兽耳，模型不会自发让它们动。把"尾巴晚半拍"这类延迟跟随写进去，成片才会从"描图"变成"角色表演"。

### 5.0.2 给"动作本身"开一个 Subject

比写互斥句更省事的写法：把**动作**当成一个独立可引用实体，和"人"分开。

```text
subject_definitions:
<Subject 1> is the target character from <Picture 1> ... (appearance only)
<Subject 2> is the dance routine performed in <Video 1>, including its step sequence, timing and tempo.
```

三个好处：动作从"人的属性"变成"可引用的实体"，多主体时不会互相污染；`attribute_transfer` 有了明确指出发点；**换人时只改 `<Subject 1>`，动作那行原样不动**。

### 5.0.3 三个开工前提（写之前先定，别写进去）

| 前提 | 规则 |
|---|---|
| 动作源数量 | **一次生成只用一条参考视频**，两条会互相稀释 |
| 复杂度 → 时长 | S 慢动作单平面可到 15s；M 多肢体中速 ≤10s；L 旋转/快速脚步/强遮挡拆段，每段 ≤8s |
| 场景预算 | 复杂背景（霓虹街、酒吧）会分走细节预算，**动作保真会下降**——用户坚持时要说明这是一笔交易 |

### 5.0.4 重试只改一个变量

| 症状 | 第一手 | 第二手 |
|---|---|---|
| 动作被换成通用动作 | `retention_analysis` 写清迁什么；`[Shot 1]` 首句重申动作来源 | 缩短时长 / 减少拍数 |
| 拍间速度漂移 | 补时间窗（写成指向来源，不写细节） | 减少拍数 |
| 身份中途漂移 | 补 1–2 个更强锚点 | 加目标图作为 `<Picture N>` 关键帧锚 |
| 熔肢 / 多肢 | 动作停顿处分段；场景剥成纯背景 | 要求放慢版本 |

同一层失败两次后不要盲试第三次，向用户提简化方案。

---

## 六、音频参考：与视频分开绑定

`<Audio N>` 是独立角色。硬约束：**音频不能单独作为唯一素材**，必须同时有至少一张图片或一段视频。

音频的保留枚举与视觉不同，单独写：

```text
retention_analysis:
<Audio 1>: fully_preserved — vocal timbre and speaking rhythm for <Subject 1>'s dialogue. attribute_transfer — pitch contour and pacing only; the actual words are replaced by the target Mandarin lines.
```

`<Video N>` 自带音轨而你不想要时，必须显式排除：

```text
<Video 1>: strictly_avoided — original audio track
```

不排除就会串入——H3 默认可能把视频文件的音轨作为参考信号。

---

## 七、六段式骨架（视频参考版）

```
subject_definitions: <Subject 1> 是什么 / <Video 1> 只提供什么 / <Picture 1> 是唯一身份来源
summary: 一句话锁定三者关系
retention_analysis: 逐素材列出 fully_preserved / attribute_transfer / strictly_avoided
detailed_description: [Shot 1] 风格 + 主体 + 姿态 + 动作序列引用 + 新场景物理反应 + 运镜声明 + 光线 + 一致性锁
overall_soundscape: 环境声 / 动作声 / 非语言人声
non_diegetic_music: 配乐，不要也写 N/A
```

七段骨架里的 `CHARACTER / POSE AND STAGING / CAMERA / PHYSIOLOGY PRIORITY / LIGHT AND ATMOSPHERE / CONSISTENCY LOCK` 全部并入 `detailed_description`，顺序不变。时间码在目标 A 里可以照常使用；**目标 B 里不要给身体动作打时间码**（会和视频的节拍打架），时间码只留给镜头、光、以及尾巴/头发这类延迟跟随层。

---

## 八、失败模式与修法

| 症状 | 病因 | 修法 |
|---|---|---|
| 动作僵硬 / 漂移 | `<Video 1>` 职责写得太模糊（"参考动作"），模型在多个时间点平均采样 | 拆成可枚举的事件序列，每个事件一个短句，写进 `fully_preserved` |
| 面部身份被视频覆盖 | Picture 与 Video 都含人脸，没声明优先级 | 显式互斥：`<Video 1> does not provide facial identity`，`retention_analysis` 里把 `<Picture 1>` 列为身份唯一来源 |
| 运镜被意外继承 | 只想要动作，镜头却跟着参考视频动 | `strictly_avoided` 逐项列 `camera path` / `camera movement speed` / `shot framing`，并在 `detailed_description` 里写出想要的机位（或固定机位） |
| 整体节奏拖慢 / 加快 | 剪辑节奏被继承，但目标动作不需要那个速度 | 只保留动作事件顺序，把 `timing` 放进 `attribute_transfer` 并写出目标速度 |
| 参考视频的音轨串入 | 没排除原音轨 | `<Video 1>: strictly_avoided — original audio track` |
| 写实质感渗透到动画角色 | 视频是实拍、目标是 2D | 跨风格三件套照旧：槽位排写实 / 镜头首句钉风格 / 细节复述风格 |
| 每个镜头都在重复素材职责 | 绑定写散在各处 | 绑定只写在 `subject_definitions` 与 `summary`，其余留给 `retention_analysis` |

---

## 九、检查清单

- [ ] 四类标签的编号是否与实际上传顺序一致？
- [ ] `<Video N>` 的职责是否写成"只提供 X"，并显式写了"不提供 Y"？
- [ ] 是否存在"视频不提供脸、图片不提供动作"的互斥线？
- [ ] `retention_analysis` 是否只用了 `fully_preserved` / `attribute_transfer` / `strictly_avoided` 三个枚举？
- [ ] 动作是否拆成了可枚举的事件序列（至少是"起势→过程→收势"）？
- [ ] `detailed_description` 是否没有重复描述动作，而是写了新场景的物理反应？
- [ ] 是否写了运镜归属（`does not follow the original path` 或 `follows the path preserved from`）二选一？
- [ ] 视频自带音轨是否被显式排除？
- [ ] 非人部件（尾巴 / 翅 / 兽耳）是否写了延迟跟随？
- [ ] 是否误用了"帧锚点"语义来描述 `<Video N>`？