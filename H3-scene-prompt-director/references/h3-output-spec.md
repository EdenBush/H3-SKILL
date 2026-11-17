# H3 输出规范：三字段、语法与参数

这份文件是 H3 提示词的**格式真源**。只管"怎么写才被 H3 正确解析"，不管"内容好不好"。内容规则回 `SKILL.md` 与 `physiology.md`、`camera.md`。

> 模型机制层面的深度说明（音视频联合 latent、身份混合原理、CFG-distilled 无负向分支、中文口型约束）见已有技能 `h3-ref2va-acting-director` 的机制章节。这份文件不重复，只补格式与参数。

---

## 一、三字段结构

H3-Base 处理的是结构化文本。三个字段各管一件事，混写会互相削弱。

```
integrated_multimodal_description: [画面、分镜、动作、镜头、台词]
overall_soundscape: [环境声、动作声、非语言人声]
non_diegetic_music: [只有观众能听到的配乐]
```

### 字段一：integrated_multimodal_description

管画面的一切。内部按镜头分块：

```
[Shot 1] [风格标签] [主体与姿态] [镜头] [光线]
[Shot 2] At 00:03.000, the camera cuts to [新景别] [新内容]
[Shot 3] At 00:06.500, the camera cuts to [新景别] [新内容]
```

要点：

- `[Shot 1]` 不带时间戳，默认从 0.00s 开始。
- 后续镜头**必须**以 `At 00:03.000, the camera cuts to ...` 开头。只写 `[Shot 2]` 不写时间码，模型不会准点切。
- 风格标签放在 `[Shot 1]` 之后的第一个短语位置（不是段落末尾）。
- 段落内部不换行也可以，但用句号分成可读的句子，一句一个信息点。

### 字段二：overall_soundscape

1–4 句英文。写环境声、动作声、非语言人声（呼吸、喘息、笑声、吞咽）。

```
overall_soundscape: Quiet room tone with a faint low hum, thin fabric shifting softly, a light
skin-to-skin contact as fingertips touch the foot, one slow breath, and a soft exhale close to
the microphone.
```

只在**明确要完全静音**时才写 `N/A`。写 N/A 实测音轨平均 −57.8 dB，接近无声但不完全无声。

### 字段三：non_diegetic_music

1–3 句英文，只写"角色听不到、只有观众听得到"的配乐。

```
non_diegetic_music: A single low breathy synth pad at a slow tempo, sitting barely under the voice.
```

不要配乐就写 `N/A`。**这一行不写会怎样**：模型自己补一段，通常是它认为合适的通用配乐，且音量不小（实测无声音字段的版本音轨 −43.4 dB，有字段的是 −18.7 dB，差 25 dB）。

---

## 二、对话标记语法

```
她说话了，标记为 (S1)，台词包在 <d> 里并注明语言：
Looking into the lens with a soft, breathy voice (S1), she says: <d>[Chinese] token 来~</d>
```

规则：

| 项 | 规范 |
|---|---|
| 说话人编号 | 第一个是 `(S1)`，第二个 `(S2)`，按出场顺序 |
| 语言标签 | `[Chinese]` / `[English]` / `[Japanese]` 等，方括号内 |
| 台词容器 | `<d> ... </d>`，必须成对 |
| 声音描述位置 | 编号之前的修饰语里，例如 `with a soft, breathy, teasing voice (S1)` |
| 台词语言 | 保留原语言，不要翻译成英文 |
| 画面内可见文字 | 放进英文双引号，例如 `a red neon sign reading "OPEN UNTIL 2 AM"` |

**画面文字必须加引号**。实测：没加引号的招牌字几乎全部变成无法辨认的乱码，加了引号的那块读对了。

**台词长度**：中文语速约每秒 4–5 字。10 个字以内最稳，超过 12 字必须拆段。

### 画外的人说话怎么办

短剧里经常需要"门外有人说话"这种效果。三条路，风险递增：

| 做法 | 怎么写 | 风险 |
|---|---|---|
| **只给声音不给词**（最安全） | 写进 `overall_soundscape`：`a woman's voice murmuring from beyond the door, too low to make out` | 几乎没有。模型不会给说话人造身体 |
| **给词但不给画面**（有风险） | 用 `<d>` 标记，但只写画外 | 模型可能强行插一张脸进来，因为它需要一个嘴 |
| **让他出现**（最干净） | 当正经角色处理：给身份卡、给人数锁、给站位 | 无，但多一个角色要维护 |

**不要企图"只出声不现身"还让他把台词说清楚**——在 H3 里这两件事是矛盾的：`<d>` 会占用时间轴并要求一个口型，而口型需要一个嘴。

**最划算的画外音是敲门声**：三下叩门，不需要任何人，就能制造"外面有事"。观众自己会补一个门外的人。

---

## 三、参数表

| 参数 | 可选值 | 说明 |
|---|---|---|
| model | `MiniMax-H3` / `MiniMax-H3-Max` | H3 标准版有 2K；Max 是极速版，画质档位低 |
| resolution | H3：`768P` / `2K`；Max：`480P` / `768P` | 768P 实测输出 1344×768，2K 为 2560×1440 |
| duration | H3：4–15 秒；Max：5–15 秒 | 整数秒。成片会多出 0.5–0.6 秒 |
| ratio | `21:9` / `16:9` / `4:3` / `1:1` / `3:4` / `9:16` / `adaptive` | 纯文生必须指定具体比例；图生视频跟随首帧 |
| fps | 固定 24 | 写进提示词也改不了，写不写都一样 |
| prompt 长度上限 | 每个文本项 7000 字符 | |

**不存在的参数**：采样步数、CFG scale。这两个来自 Stable Diffusion 这类本地扩散模型，H3 接口里没有，写了不生效。网上流传的"步数 28–32、CFG 7–8"对 H3 完全无效。

**成本控制**：先 768P 出 5–8 秒验证骨架和节奏，满意再升 2K。不满意的镜头在 768P 阶段淘汰，返工成本差四倍。

---

## 四、H3 没有负向提示词

H3 的公开权重是 CFG-distilled，标准流程里没有 positive/negative 条件对。你写的 `no`、`without`、`不要`、`禁止` 不会进入一个独立分支去压制概念，它们只是普通文本，甚至可能被正向采样。

**所以所有约束必须写成正向的确定状态。**

| 想表达 | 不要写 | 改写为 |
|---|---|---|
| 不要哭 | no crying | the lower lid stays dry, the eyelid tension held |
| 不要动 | no movement | her weight stays on her front foot, her right hand at her side |
| 不要换脸 | no face change | her face stays identical to Image 2 across all shots |
| 不要过曝 | no overexposure | highlights sit just below clipping, detail held in the sheet folds |
| 不要多一个人 | no extra person | exactly one woman in the frame |

例外：在描述里偶尔出现 `without` 是可以的（例如 `with no fabric anywhere on her body`），因为它描述的是一个**可见的确定状态**，而不是一个被压制的概念。判断标准是：这句话能不能被摄像机验证。能，就写；不能，就换成正向状态。

---

## 五、可拍摄性：写了等于没写的词

H3 不执行形容词，它执行具体的物理状态。所以有一类词写进去不但不起作用，还会挤占注意力预算——**你越是描述"感觉"，模型越是自由发挥**。

这一节是写给"容易写成散文"的执行者的：它给的是**替换表**，不是原则。

### 5.1 禁用词与替代

| 禁用（或避免单独使用） | 为什么无效 | 换成 |
|---|---|---|
| `beautiful` / `stunning` / `gorgeous` | 是评价，不是状态 | 具体特征：`a small brown beauty mark below the outer corner of her left eye` |
| `cinematic` | 模型默认就是，且它不知道你要哪一种 | 具体镜头：`85mm, shallow depth of field, one soft key light from the left` |
| `dramatic` / `intense` / `emotional` | 是效果，不是原因 | 动作：`her jaw tightens and her chin stops moving` |
| `atmospheric` / `moody` | 同上 | 光：`a hard grid of moonlight lying across the floorboards` |
| `elegant` / `graceful` | 评价 | 姿态：`her weight on her front foot, her shoulders level` |
| `mysterious` | 评价 | 遮挡：`half her face in shadow, one eye catching the moonlight` |
| `realistic` / `high quality` / `detailed` | 无效，模型默认如此 | 删掉 |
| `slowly` / `gently` / `softly` **单独用** | 没有量级，它不知道多慢多轻 | 加量级：`at less than two centimetres a second`、`her palm flat and still` |
| `like a wounded animal` 这类文学比喻 | 模型会真的画一只动物，或者给出奇怪表情 | 写身体：`her shoulders curling forward, her chin dropping` |

### 5.2 三类"看着很具体其实很空"的写法

1. **抽象名词**：`emotion`、`atmosphere`、`tension`、`chemistry`。全部换成看得见的东西。
2. **内心动词**：`she realizes`、`he understands`、`she decides`。改成**身体的变化顺序**——眉毛先动、然后瞳孔、然后下颌。
3. **无参照的比较级**：`more intense`、`softer than before`。和什么比？跨单元时"before"根本不存在。改成绝对描述。

### 5.3 一个测试：摄像机能不能拍到

把写好的句子念一遍，问：

> **这句话，摄像机拍得到吗？**

- "她很紧张" → 拍不到
- "她的呼吸压到很浅，喉结吞了一下" → 拍得到

拍不到就往下拆一层，再拆一层，直到拆成**关节、肌肉、呼吸、瞳孔、布料**这个层级。

**拆到底的标准**：你能想象出一个人照着做出这个动作。

### 5.4 唯一允许用评价词的地方

**风格锁。** 因为那里需要的是渲染风格标签（`Photorealistic cinematic film still, live-action film look`），它是给模型的题材指令，不是对画面内容的描述。

除此之外，正文里不该出现评价词。如果一段提示词读起来像影评，它就不是提示词。

---

## 六、静态图 / 视频两种交付

同一个场景通常需要两个版本，写法不同：

**视频版**：三字段 + 时间码节拍 + 生理层演进。

**静帧版**（用来先验构图和骨架）：去掉 TIMELINE，把某一个节拍的状态写成单一瞬间，保留 POSE / CAMERA / LIGHT。

静帧版提示词骨架：

```
2D anime illustration, [风格细节]。
[主体与姿态，一段完整描述]。
[镜头的单一状态：高度、角度、焦段、景深]。
[光线的单一状态]。
```

静帧版没有时间码，所以生理层退化为"此刻的状态"，而不是"变化"。不要在静帧版里写"然后""逐渐"。

**推荐工作流**：先用静帧版验构图和骨架 → 骨架对了再跑视频版 → 视频版骨架再对 → 升 2K。这样每一步只改一个变量。

---

## 七、平台差异（非 H3）

写提示词的方法论是模型无关的，但格式要按平台调整。

| 平台类型 | 格式调整 |
|---|---|
| 单段文本框的模型（多数本地 / 开源管线） | 把三字段合并成一个大段，用 `TIMELINE:` `CAMERA:` `LIGHT:` 这类全大写标签分节，不要用 JSON 式字段名 |
| 有独立镜头列表 UI 的模型 | 按镜头拆分，每个镜头一个文本框，时间码写在镜头描述首句 |
| 有负面提示词框的模型 | 把"不要"类约束挪到负面框，正文只留正向描述 |
| 有独立音频分支的管线 | 把 `overall_soundscape` 单独喂给音频分支，正文里删掉这一节 |

**通用原则**：正文里始终保留 `CHARACTER / POSE AND STAGING / TIMELINE / CAMERA / PHYSIOLOGY PRIORITY / LIGHT AND ATMOSPHERE / CONSISTENCY LOCK` 这套全大写分节。即使目标模型不支持字段语法，这套分节也能显著提升模型对段落的识别率——它相当于给模型一个免费的目录。

---

## 八、检查清单

- [ ] 三个字段是否齐全（或按平台合并后仍保留分节标签）？
- [ ] `[Shot 2]` 之后是否都带了 `At 00:0X.000, the camera cuts to ...`？
- [ ] 风格标签是否在 `[Shot 1]` 后的第一个短语位置？
- [ ] 对白标记 `<d>...</d>` 是否成对、是否带语言标签？
- [ ] 说话人编号是否从 `(S1)` 起、按出场顺序？
- [ ] 画面内可见文字是否加了英文双引号？
- [ ] `non_diegetic_music` 是否写了（不想配乐也要写 N/A）？
- [ ] 是否有残留的否定式表述？（逐条改成正向状态）
- [ ] 时长是否按"实际多 0.6 秒"留了余量？
- [ ] 是否误加了步数 / CFG 这类不存在的参数？
