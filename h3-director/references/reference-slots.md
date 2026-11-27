# 参考图槽位：分配、声明、跨风格覆盖

多模态参考的失败几乎全部来自同一件事：**模型不知道每张图该管什么，于是自己分配了一个你没想过的职责**。

这份文件解决三件事：怎么给每张图派活、怎么写声明句、参考图与目标风格不一致时怎么强行覆盖。

所有图先过一道档位检查：**媒体必须与选定视觉档位一致**（3DCG / 三渲二实机建模 / 真人电影）。**只有跨档时**才在声明里排除来源渲染与肤色，排除哪套渲染词按媒介差决定（完整表格见第三节）；同档不排除来源渲染。跨档时只取姿态或结构，档位规则见 `visual-tiers.md`，素材路由见 `delivery.md`。

**整条提示词一张图都没有时（纯文字 T2VA），整行槽位声明省略**——没有槽位，也就没有 unused。只有槽位存在但空着（比如用户只发了角色设定、没发姿势图）才写 `Image 1 is unused — ignore it entirely.`

---

## 一、槽位分配的基本原理

模型的参考不是"读图"，是把每张图的语义向量注入生成过程。n 张图同时存在时，它们的语义会互相渗透——包括你不想要的那些部分（脸、背景、光照、渲染风格）。

所以**槽位分配的本质是"减法"**：不是告诉模型要什么，而是告诉它每张图**只准**提供什么，其余全部忽略。

一条铁律：

> **每个槽位只能承担一个互斥的职责。** 两个槽位职责重叠，模型一定会混。

---

## 二、槽位声明模板

声明句固定放在提示词最前面，每张图一行，格式统一为"take only X, ignore Y and Z"。

### 模板 A：姿势参考 + 角色设定（最常用）

```
Image 1 supplies the body pose and the camera's vertical height alone — its lateral position, distance, lens, framing and composition come entirely from the CAMERA section below. Ignore its face, identity, hairstyle, clothing, and any watermark or overlaid text.
Image 2 supplies the character design and the costume structure only — ignore its background, any sheet layout, and its studio lighting.
```

**跨档取姿势时才排除来源渲染**：目标是 3DCG/三渲二/动漫而参考是真人照片，在 Image 1 那句里补 `photorealistic rendering and skin texture`；目标是真人档而参考也是真人照片，**不写这一条**——写了会把目标档的写实质感一起否定，只排除脸、身份、发型、服装、构图与水印。反方向（动漫图作姿势参考、目标真人档）则补 `lineart, flat shading and cel-shaded skin`。

### 模板 B：角色设定图是多视图（三视图 / 含细节裁切）

多视图设定图有一个独立风险：模型会把整张图当成"一个画面"，输出三联排站姿。必须额外加一句版面排除。

```
Image 2 is a multi-view character design sheet: use the character design only, render exactly one single figure, ignore the sheet layout, the three standing views, the detail crops and the plain white background.
```

关键词是 `render exactly one single figure`——这是唯一能压住多视图复制的表述。

### 模板 B2：四视图角色卡——上下分工（剧集推荐）

多视图设定图最稳的用法不是"整张取角色设计"，而是**把图拆成两半派活**：

```
Image 1 is a four-view character sheet. Use only the upper facial close-up as the exclusive source of her facial identity across all angles, speech and expressions. Use the bottom front, right-side and back full-body views only for body proportions and costume details, without copying their static standing pose or their flat camera-facing orientation. Render exactly one single figure; ignore the sheet layout, the plain background and the studio lighting.
```

两句缺一不可：`only the upper facial close-up` 管脸，`only for body proportions and costume details` 管衣服与比例；`without copying their static standing pose` 是三视图最大的污染源——不写，立正站姿会被抄进每一镜，而且每个单元抄得不一样。

剧集里这条随**系列常量块**每单元整块重写（`text-anchoring.md` §2.8）：它属于"主体定义"那一件，不是槽位声明的一次性备注。

### 模板 C：没有姿势参考（设定图直接放在第 2 槽）

```
Image 1 is unused — ignore it entirely.
Image 2 is a multi-view character design sheet: use the character design only, render exactly one single figure, ignore the sheet layout, the three standing views, the detail crops and the plain white background.
```

**第一行不能省。** 槽位空着不声明，模型会去找点什么来填，通常是凭空造一个人或把设定图当构图参考。

### 模板 D：一张图承担两个职责

```
Image 1 supplies both the character design and the framing — keep her face, hair and proportions exactly as shown, and start from the same camera height and distance.
```

只在单图、无姿势要求时用。风险最高，建议尽量不要。

### 模板 E：风格参考（不管内容）

```
Image 1 supplies the color palette, contrast and light quality only — ignore its subject entirely, do not copy its composition or any person in it.
```

---

## 三、跨风格覆盖三件套

这是高频且必错的一种情况：**姿势参考是一张写实照片，角色设定是 2D 动漫**（或反过来）。

只写槽位声明不够。必须在三个位置同时施压，缺一个就会出混合风格——动漫脸配真人毛孔，是最典型的失败画面。

### 第一件：在槽位声明里排除来源渲染

```
Image 1 supplies the body pose and the camera's vertical height alone — take nothing else
from its camera; ignore its face, identity and hairstyle.
```

排除哪些渲染词，按媒介差决定：

| 来源 → 目标 | 追加的排除句 |
|---|---|
| 真人照片 → 3DCG / 三渲二 / 动漫 | `ignore its photorealistic rendering and skin texture` |
| 动漫图 → 真人档 | `ignore its lineart, flat shading and cel-shaded skin` |
| 真人照片 → 真人档（同档） | **不加渲染排除**，只排除脸、身份、发型、服装与构图 |

关键是**跨档才排除来源渲染**。同档也写 `photorealistic rendering` 等于把目标档的写实质感一起否定，成片会退回半写实的塑料脸——这是盲测里实际踩到的一处。

### 第二件：在镜头描述的最前面钉死目标风格

风格标签必须是 `[Shot 1]` 之后的第一个短语，不能往后放：

```
[Shot 1] 2D anime illustration, clean cel-shaded linework with soft airbrushed gradients,
flat two-dimensional rendering throughout, one continuous take, static frame.
```

`flat two-dimensional rendering throughout` 这句看起来冗余，实际是压住写实渗透最有效的一句。

### 第三件：在生理细节里复述风格

细节描写是最容易漏的地方。写到皮肤、汗、高光时，每个都带上风格修饰：

```
bare shoulders ... all rendered as smooth cel-shaded skin
a thin sheen of sweat appears on the soles ... smooth cel-shaded skin with a clean rim highlight
```

不写的话，特写镜头（尤其是微距）会自动切回写实皮肤。

### 反向覆盖（动漫参考 → 写实目标）

同样三件套，把 `2D anime illustration` 换成对应的写实标签，并在槽位声明里写 `ignore its lineart, flat shading and cel-shaded skin`。

---

## 四、身份保持：哪些特征必须点名

"保持角色一致"是无效指令。必须点名**标志物**，因为模型的注意力只会落在你提到的具体物体上。

从设定图里挑 4–6 项，原则是**高辨识度 + 低歧义**：

| 类型 | 例子 | 优先级 |
|---|---|---|
| 独特发型结构 | 呆毛、双马尾、发梢渐变、齐刘海 | 最高（形状独特，一丢就认不出） |
| 头部配饰 | 蝴蝶结、发卡、蕾丝头饰、兽耳、鳍耳 | 最高 |
| 发色 + 瞳色 | 深蓝渐变长发、亮蓝眼 | 高 |
| 面部特殊标记 | 痣、疤、异色瞳、星形高光 | 高 |
| 服装标志物 | 特定领型、徽章、刺绣图案 | 中（如果场景里会脱掉，重要性下降） |
| 非人特征 | 鲸尾、翅膀、尾巴、角 | 最高（且极容易被当成多余肢体） |

**写法示例**

```
The girl from Image 2 keeps her exact character design: long wavy deep-blue hair with a lighter
blue gradient at the tips, one upright ahoge curl on top of the head, fin-shaped ears with white
fluffy tips on both sides, scalloped lace maid headdress with a blue ribbon bow, large bright blue
eyes with white highlights.
```

**关键经验**：这三类特征丢失率最高，务必要在**每一段**各提一次，并在收尾的一致性锁里再列一次。

1. 头饰（尤其当它不在画面中心时）
2. 兽耳 / 鳍耳这类"从头发里长出来"的部件
3. 呆毛这类单根细结构

---

## 五、非人特征的特殊处理

鲸尾、尾巴、翅膀这类部件有一个独立风险：**模型会把它算进肢体计数**，结果变成三条腿。

必须写成显式的排除式并列：

```
Her single large whale tail is tucked under her right hip and curves out to the right across the
sheet, both flukes clearly visible.
...
the whale tail stays under her right hip and remains one single tail with two flukes, clearly
separate from her legs.
```

三件都要有：**位置**（在哪）、**数量**（一条、两片尾鳍）、**排他**（与腿分开）。**"数量"只数非人部件，不写肢体数量。**

只写"她有鲸尾"不够——模型不知道这条尾巴占据的是"额外的位置"还是"腿的位置"。

---

## 六、一张图多个角色的情况

设定图里常有正面、侧面、背面三个角色形象。除了版面排除，还要处理"人物数量"：

```
render exactly one single figure
exactly one woman in the frame
no other figures, no mannequins, no reference sheet borders
```

`exactly one woman in the frame` 这句在 POV 场景尤其重要——POV 里通常会有一只手/一条腿入画，模型可能把它理解成第二个人，于是造出一个完整的第三人。

---

## 七、H3 的参考能力边界

| 项 | 上限 | 备注 |
|---|---|---|
| 参考图 | 9 张 | 越多越容易互相污染，实际操作 2–3 张最稳 |
| 参考视频 | 3 段 | 用于复刻运镜节奏 |
| 参考音频 | 3 段 | 用于指定音色 |
| 单任务文件总数 | 12 | |
| 与首尾帧 | **不能同时使用** | 二选一，这是硬约束 |

**参考音频的限制**：H3 的参考音频必须与图片或视频同时上传，单独的音频不能作为参考。

**上传顺序 = 编号顺序。** 声明里的 `Image 1` / `Image 2` 指的是上传顺序，不是文件名。每次调整顺序都要回头改声明，这是最容易出的一处低级错误——整条提示词的槽位全部反了，而画面看起来"好像也对"，问题很难被发现。

---

## 八、检查清单

- [ ] 每张参考图是否都有独立的声明行？
- [ ] 每行是否都写了 `take only X` 和 `ignore Y`（两个都要）？
- [ ] 多视图设定图是否加了 `render exactly one single figure`？
- [ ] 四视图角色卡是否按模板 B2 拆开派活（上半脸管身份、下半身只管比例与服装、不取站姿）？
- [ ] 空的槽位是否显式声明了 unused？
- [ ] 跨风格时，三件套是否都到位（槽位排除渲染 / 镜头首句定风格 / 细节复述风格）？
- [ ] 素材媒介是否与当前视觉档位一致？跨档素材是否只取了姿态/结构并排除了渲染？
- [ ] 身份特征是否点名了 4–6 项，且包含头饰、耳部、呆毛这类高丢失率项？
- [ ] 非人特征是否写了位置 + 数量 + 与肢体的排他？
- [ ] 声明里的编号是否与实际上传顺序一致？
- [ ] 是否同时使用了参考图和首尾帧（H3 不允许）？
