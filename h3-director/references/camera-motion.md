# 运镜：H3 能做什么、该怎么写

这份文件来自一份实测运镜库（A–G 七组 46 镜 · 约 130 条成片 · Ref2VA · 中文提示词 · 480P 横屏）。

**它解决的问题不是"怎么写得漂亮"，是"这个镜头到底能不能做出来，以及怎么写才不会退化成别的运动"。**

> **profile 声明（重要）**：本文实测条件为 **Ref2VA + 中文 + 864×480 横屏**。你如果跑竖屏 9:16 + 英文 + 三字段，部分结论可能不同（尤其是起手景别，见第七节）。**能做的判断优先信本文，具体幅度和落位以自己的首片为准。**

---

## 一、先看边界：有些镜头做了也白做

写之前先查这张表。**做不成的镜头，写得再漂亮也是浪费一次生成。**

| 运镜 | 能做成吗 | 怎么办 |
|---|---|---|
| **半环绕 180°** | ✅ 成立，落点是正背面 | 首选，不需要 LoRA |
| **整圈环绕 360°** | ❌ 不挂 360 类 LoRA 几乎不闭环（实测 0.094–0.67，挂了 0.93–0.95） | **不挂 LoRA 就不要选整圈**，改半环绕或弧形横移 90° |
| **子弹时间（整圈）** | ❌ 同上，原生≈0 | 同上 |
| **双人整圈环绕** | ❌ 同上 | **改 180° 半环绕**，半环绕不该按闭环判 |
| **希区柯克变焦（dolly zoom）** | ❌ 三版全部退化成普通推镜 | **不要指望**。要么接受它就是一次推镜，要么挂专用 LoRA（效果仍不稳） |
| **急推变焦（crash zoom）** | 🟡 成立，但"急"是突变不是快 | 可以写，落点要具体；"急"要靠突变描述，不要靠"快速" |
| **荷兰角** | ❌ 单靠提示词无倾角 | **必须挂荷兰角 LoRA**；不挂就别用，写了也没有 |
| **甩镜** | ✅ 但有条件 | **必须有落点**，且起手物写最前面（详见第四节） |
| **移焦** | ✅ 但容易靠运气 | **必须写死"从 A 到 B"两个深度不同的对象** |
| **推 / 拉 / 横移 / 升降 / 摇镜** | ✅ 都成立 | 见变量纪律 |
| **POV / 顶拍 / 俯视 / SnorriCam / 航拍 / 穿越 / 视差** | ✅ 都成立 | 各有前置条件，见第四节 |
| **过肩（OTS）** | ✅ **四个双人机位里最稳的一个** | 起手先写肩头 |
| **正反打（一次生成内硬切）** | ✅ 成立，但切点会提前 1–2.5 秒 | 见第六节 |

**一句话总结边界**：**能用原生做的，都是"机位在空间里移动"这一类；做不到的，都是"需要精确闭环或精确倾角"这一类。**

---

## 二、变量纪律：每种运镜只准写自己的变量

这是最容易犯又最难自查的错——**多写一个变量，等于凭空给模型一个可动旋钮，它会去转那个旋钮。**

| 运镜 | 必须写（声明变量不变） | 绝对不写 |
|---|---|---|
| **摇镜** | 摇向 + 摇幅（具体角度）+ `the camera body stays fixed at one point` | **焦距**——摇镜没有这个变量，写了就多一个旋钮 |
| **推 / 拉** | 方向 + 起止景别 + **`the focal length stays locked at the same setting`** | — |
| **变焦** | "变焦" + 机位固定 + **`the perspective relationship stays unchanged`** | 把焦距数值当自变量 |
| **横移** | 侧移方向 + **`the lens direction stays locked in one direction`** | **`the gaze stays locked on the subject`**（那是环绕的定义，写了会退化） |
| **升降** | 升/降 + **`the camera stays level throughout`** | **俯仰**（写了就变成"升降 + 摇"） |
| **整圈环绕** | **圈数 + 起止时刻（两个都要）** + 收束句 `the frame returns to the front at the end` | 只给其中一个 |
| **翻滚** | 方向（顺时针/逆时针）+ 角度 | 省略方向（模型自选，不可复现） |
| **荷兰角** | 静态倾角方向（左/右） | 当成运动写 |

### 三句"声明变量"的话，为什么必须写

它们看起来像废话，实际上是**排他声明**：

- 推拉不写"焦距锁定" → 模型可能读成变焦推（**两者的判定看背景，不看主体大小**）
- 横移不写"朝向锁定" → 退化成绕主体转的环绕
- 升降不写"姿态水平" → 变成"升降 + 俯仰摇"两个运动

**变焦推 vs 推镜头的镜像判据**（剧集里最常混的一对）：

| | 背景怎么变 | 透视怎么变 |
|---|---|---|
| **变焦推** | 等比放大 | **不变** |
| **推镜头** | 近大远小的差异**变大** | 变 |

判定看背景，不看主体多大。这两个写反了会互相退化。

---

## 三、书写顺序：画面里"先出现的东西"写在最前面

**这条比措辞更重要。写错顺序，整条运镜就不成立。**

| 镜头类型 | 开头必须先写 | 为什么 |
|---|---|---|
| **遮挡 / 揭示 / 视差** | 前景遮挡物（柱子、门框、枝叶） | 先写主体，遮挡关系无从建立 |
| **甩镜** | 起手物（一丛花、一盏灯） | 甩镜的本质是"从 A 甩到 B"，A 不先写，就没有甩 |
| **穿越** | 门洞、枝叶 | 同上 |
| **航拍 / 拉升** | 高空全景 | 先写主体，高度关系不成立 |
| **POV** | 主体**不进画面**，写视野里的东西 | 主体不入画，写了就矛盾 |

**反例**：`"<Subject 1> stands in the corridor…"` 开头 + 后面才说"被柱子挡住" → 遮挡关系没建立起来，模型只会画一个站在走廊里的人。

---

## 四、十二条句式模板（英中对照）

每条都是可直接粘贴的 `[Shot N]` 句。中文原句来自实测库，英文是按同一结构转写的。

### 4.1 摇镜（向右 45°）

```text
At 00:00.000 a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has panned about 45 degrees to the right and settled;
the camera body stays fixed at one point for the whole take.
```
```
At 00:00.000 景别为中景，取景 <Subject 1> 腰部以上；
At 00:09.500 机位已向右摇过约 45 度并停稳，机位位置自始至终固定在同一点。
```
**坑**：摇幅要给具体角度，不要写"缓慢地摇"——速度交给时刻。

### 4.2 推镜头

```text
At 00:00.000 the shot opens as a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has moved in to a close shot of <Subject 1>'s head and shoulders;
the focal length stays locked at the same setting throughout.
```
```
At 00:00.000 起手景别为中景，取景 <Subject 1> 腰部以上；
At 00:09.500 机位已前移推近至末帧，末帧为 <Subject 1> 头部与肩部的特写；
焦距自始至终锁定在同一档位。
```
**坑**：`the focal length stays locked` **必写**——它声明"是机位在动，不是变焦"。

### 4.3 拉镜头

```text
At 00:00.000 a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has pulled back so the frame holds <Subject 1> head to toe;
the focal length stays locked at the same setting throughout.
```
```
At 00:00.000 起手景别为中景，取景 <Subject 1> 腰部以上；
At 00:09.500 机位已后移拉远至末帧，末帧为 <Subject 1> 从头顶到脚底的全身景；
焦距自始至终锁定在同一档位。
```
**坑**：**全身镜不宜作拉远的首帧，可作尾帧**（所以这个镜头是"中景起、全身收"，不是反过来）。
**另一坑**：场景图会把它的机位一起带进来，推拉时镜头被持续拉回它的构图。按三维地图处理（见 `slot-economy.md` 0.7）：声明 `the scene image supplies the room as a three-dimensional space only; the camera position for this shot comes entirely from the CAMERA section below`，再用一句话把机位钉在房间的具体位置。

### 4.4 横移（向左）

```text
At 00:00.000 a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has trucked left, leaving <Subject 1> on the right of frame;
the camera slides sideways while the lens direction stays locked in one direction.
```
```
At 00:00.000 景别为中景，取景 <Subject 1> 腰部以上；
At 00:09.500 机位已向左横移，末帧 <Subject 1> 位于画面右侧；
机位自始至终沿横向侧移，镜头朝向全程锁定在同一方向。
```
**坑**：**末帧落位句不稳定**——同写法换个种子可能反向。**右横移建议只写方向，不写落位**，先看首片再决定。

### 4.5 升降（升）

```text
At 00:00.000 a medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has risen to a high position;
the camera stays level throughout the move.
```
**坑**：`stays level` 必写，否则变成"升降 + 俯仰摇"。

### 4.6 半环绕 180°（首选，不需要 LoRA）

```text
A medium shot, framing <Subject 1> from the waist up;
the camera arcs slowly around <Subject 1> toward the right of frame, through about 180 degrees;
the camera keeps <Subject 1> centred in frame the whole time.
```
**判据**：半环绕的落点是**正背面**，不是回到起点——不要用闭环标准判它。

### 4.7 弧形横移 90°（整圈的可行替代）

```text
A medium shot, framing <Subject 1> from the waist up;
at 00:09.500 the camera has travelled along an arc of about 90 degrees.
```
**与环绕的区别在半径**：弧形横移半径大、主体可以在画面里位移；环绕半径恒定、主体居中。

### 4.8 甩镜

```text
The frame begins on a cluster of flowers at the edge of the veranda — the flowers sit
centred and sharp, swaying slightly;
the camera whips right at high speed and lands on <Subject 1>, framing him from the waist up;
the camera then stays on him until the end of the take.
```
**坑（两条）**：① **必须有落点，且落点写死**（落到什么、落定后的景别）；② **起手物写最前面**——反过来（主体 → 甩到别处）实测不成功。

### 4.9 移焦

```text
A medium shot, framing <Subject 1> from the waist up;
focus then racks from <Subject 1> in the foreground to the moon gate in the background,
the foreground softening as the background sharpens;
the framing and camera position stay unchanged.
```
**坑**：**必须写死"从 A 到 B"两个深度不同的对象**。不写就是靠运气（初版没写对象，只是恰好画面里有纵深才成立）。

### 4.10 过肩（OTS，双人机位里最稳）

```text
The foreground holds his left shoulder and the side of his back — soft, occupying the
lower-left corner of frame;
a medium shot, framing <Subject 2> from the waist up;
an over-the-shoulder setup — the camera sits behind <Subject 1>'s shoulder, looking at
<Subject 2>, with his shoulder in the foreground.
```
**坑**：**起手必须先写近景肩头，再写对面的人**。顺序反了就不成立。

### 4.11 POV（第一人称）

```text
First person: the camera is <Subject 1>'s eyes, and the frame unfolds along his line of sight;
the red columns and lanterns on both sides sweep backward past the edges of vision;
the camera carries a slight handheld sway.
He raises his right hand a little; a silver-grey bracer and a pale blue cuff enter the
lower edge of frame.
```
**两条铁律**：
1. **POV 下主体不入画 → 不得写景别**（不要写"framing from the waist up"）
2. **行走位移写进剧情，不写进镜头层**（镜头层没东西可写）

### 4.12 SnorriCam（机身绑定）

```text
A medium shot, framing <Subject 1> from the waist up;
the camera moves with <Subject 1> in a follow rig, his whole upper body staying inside
the frame;
he carries the camera with him: it moves in sync with him, his position and size in frame
stay constant, and the background keeps flowing backward.
```
**判据**：**主体位置与大小全程恒定 + 背景持续流动**，两条都要成立。只写前者会被读成普通跟拍。

---

## 五、六条通用陷阱

### 5.1 绝不写器材名

**斯坦尼康、云台、无人机、滑轨、摇臂、稳定器**——这些词会被画进画面里（实测：命名的机身装置会出现在成片中）。

描述**效果**，不描述**器材**：

| 不要写 | 写 |
|---|---|
| 斯坦尼康跟拍 | `the camera floats smoothly, the image stays steady and smooth throughout` |
| 无人机航拍 | `the camera moves smoothly and level through the air` |
| 摇臂上升 | `the camera rises to a high position` |

### 5.2 稳定要写正向句

不要写"画面没有晃动"——**提到 X 会提高 X 出现的概率**。写：

```text
the image stays steady and smooth throughout
```

### 5.3 跟拍必写"主体全程留在画面内"

```text
his whole upper body stays inside the frame the entire time
```

不写，跟拍会把主体甩出画面。

### 5.4 横移给"走向句"，规避"纵深"字眼

**"纵深""向深处延伸""尽头是"都是构图指令**——写了它们，模型会把画面往纵深安排，横向位移就没有空间了。

| 场景 | 写 |
|---|---|
| 横移的空间 | `the long veranda runs from the left edge to the right edge of frame`（走向） |
| 前后层次 | `the foreground and background are offset`（前后错位，不是"纵深"） |

### 5.5 环境写描述式，不要清单式

- **清单式**（"柱列、地砖、宫灯、竹丛必须可见"）→ 模型为了把全部元素塞进去，**把画面推宽**
- **描述式**（一句说清"主体所处的环境是什么"）→ 不推宽

**效果上限**：改描述式后主体约放大 2.4–3 倍，但**仍到不了腰部以上**。它是"别让环境把画面推宽"的止损手段，不是"锁半身"的手段。

### 5.6 防复制：横向运镜在窄画幅里会"复制一个人"

**机理**：横向运镜在窄画幅里没有位移空间，模型用"复制一个人"补位。

**防复制双保险**：

```text
Only <Subject 1> appears in the frame from beginning to end.
```
强调版：
```text
Every body, every sleeve and every strand of hair in frame belongs to this one figure.
```

**这条与画幅有关**：同一提示词，4:3 出双脸、1.8:1 不出。所以跨画幅复用提示词前要有预期。

---

## 六、正反打：能不能一次生成内做

**可以，但切点会提前。**

实测：写"约第 5 秒切"，实际最大单帧跳变落在 **3.54 秒**（另一条件到 2.58 秒）。**提前 1–2.5 秒是常态，不是失败。**

| 做法 | 可控性 | 适合 |
|---|---|---|
| **拆成多次生成** | 高，每段都是一条独立可控的镜头 | 默认推荐 |
| **一次生成内硬切** | 中，切点会提前 1–2.5 秒 | 短促的正反打、不想多付一次生成 |

一次生成内做的写法：

```text
[Shot 1] The first part looks past his shoulder at her: his left shoulder and the side of
his back fill the near foreground, soft, while she is sharp across from him, head tilted,
listening.
First part: a medium shot, framing <Subject 2> from the waist up;
an over-the-shoulder setup — the camera sits behind <Subject 1>'s shoulder.
Second part: a medium shot, framing <Subject 1> from the waist up;
an over-the-shoulder setup — the camera sits behind <Subject 2>'s shoulder.
```
**配套纪律**：**每句台词各落一段，不跨切点**——这样就不需要用场景转换标记。

---

## 七、起手景别：Ref2VA 下不受控

**实测：官方矩阵「中景及更近」取景 0/51 命中；起手命中 6/48；可测偏差 40/40 全部是"偏宽"。**

三条"锁半身"的花招全部无效：

- ❌ 写裁切线句
- ❌ 把参考图裁到腰部以上（而且会破坏下身服装）
- ❌ 用构图锚图

**唯一有效的止损**：环境改描述式（见 5.5），但上限是放大 2.4–3 倍，仍到不了腰部以上。

**真正的正解**：**用真实首帧图（I2VA）**——首帧决定取景、高度、角度，文字只负责运动。

> **给你的 profile 的提醒**：如果你跑的是竖屏 9:16 + 英文 + 三字段，这条未必成立（竖屏本身就更紧，而且成片锚点会带入构图）。**先出两条试试，再决定要不要为"锁景别"改流程。**

---

## 八、排障顺序：换种子优先于改词

这是这份库最反直觉、也最有价值的一条纪律。

**H3 的种子敏感度是 HIGH。** 同一个提示词换个种子，翻滚从 0.97 掉到 −0.08，荷兰角从"有倾角"变成"没有"。

所以遇到"没做出来"时，顺序是：

```text
1 换种子重跑（最便宜，成功率最高）
2 检查书写顺序（画面里先出现的东西写最前面了吗）
3 检查变量纪律（有没有多写不属于这个运镜的变量）
4 检查起手帧（是不是锚图把构图拽住了）
5 最后才改措辞
```

**先改词是新手最常犯的错**——你改了半天，可能本来只是种子不好。

---

## 九、长镜头原则

一镜到底是一种**持续关系**，不等于始终全景，也不等于绕人一圈。

- 用走位、前后景、遮挡揭示、焦点转移和机位变化形成镜内段落；每一段仍按信息交接安排摄影机与人物的会合点。
- 相机路径必须能连续执行：人物不瞬移，不借前景遮挡、黑场或擦镜夹隐藏切点，不把一个连续镜拆成多个 `[Shot N]`。
- 允许镜内改变景别与角度，但变化要有动机（人物移动、关系揭示、注意力转移），并延续同一套空间关系。
- 一镜到底可有多个连贯阶段，但不能同时命令固定、环绕、急拉远等互相冲突的运动。慢动作可以固定机位，也可有动机地移动；恢复正常速后保持空间、动作相位和结果一致。
- 逐段保存人物与相机的起止位置；每次机位变化后，从固定世界关系重新推导画面左右、目线、遮挡和出入画方向。需要正脸而当前站位看不见时，改到可达的同侧机位，或设计有剧情理由的可见转头/走位。
- 前景经过可以短暂遮挡，但遮挡前后动作、位置和时间继续。摄影机无需追着每个肢体，可提前等候动作到达；大幅位移的持续时间必须足够相机完成路线。

## 十、这份文件没有覆盖的

| 你要做 | 去哪 |
|---|---|
| 挂哪个 LoRA、权重多少 | 原库的 LoRA 目录（本体系不含 LoRA 环境，只保留"必须挂才能做"的结论） |
| 46 条完整题库与逐条实测数字 | 原库的完整实测记录 |
| 指标怎么算（闭环阈值、跳帧检测） | 原库的指标与排障文档 |
