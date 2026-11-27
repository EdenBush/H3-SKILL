# 空间控场：三层空间协议与跨单元锚定

**这份文件的定位**：`SKILL.md` 1.7、2.6、3.4、5.3、5.4、5.8、7 的完整版。它只解决一件事：**每个单元独立生成时，如何用文字把"谁在哪、面向谁、几个人、从哪边拍"锁住，让 N 个 10 秒拼起来像一场戏。**

**它不做什么**：不做三维建模，不要求模型"看懂空间"。它只维护四个不变量：**身份 / 拓扑 / 人数 / 轴线**。

**素材来源**：《提示词场景控场法》的三层空间协议与示例（多人视频空间拆解，CASE 0016）。其中的示例是演示样片与配套提示词，不是对照实验；本文件把它改写成本技能的六段式字段与时间码纪律，并补上了它没有覆盖的部分（机位移交、双轨冲突规则、环境卡覆盖弧、文本预算）。

**30 秒版**：先从场景图里读出 5–7 个节点、3–8 个锚区、3–6 个机位点，写成账本；之后每单元只做投影（选 K#、定轴线侧、算屏幕侧、定人数、写增量）；四检守住身份、拓扑、人数、轴线。**不要让它"看懂三维"，让它"读表"。**

---

## 零、八个词，先对齐

| 词 | 定义 | 不指什么 |
|---|---|---|
| **节点 N#** | 房间里的固定结构与家具锚点（门、窗、桌、沙发、壁炉） | 不指机位，也不指人物站位 |
| **锚区 P#** | 人物可站/坐/倚的位置，挂在 1–2 个节点上 | 不指机位点；一个锚区同时只给一个人 |
| **机位点 K#** | 摄影机可站的位置（位置 + 高度 + 默认看向点） | 不指人物位置；不能与有人占用的 P# 重合 |
| **人物槽位 c#** | 跨单元稳定的人物编号，绑定图 / `<Subject N>` / 说话人 ID | 不等于 `<Subject N>`：c# 是账本编号，Subject 是提示词标签，二者一一绑定 |
| **空间账本** | L1 + L2 + 当前段落的持久记录，整场一份 | 不指每单元的交接块；账本是整场的，交接块是本单元的 |
| **L1 / L2 / L3** | 世界层 / 身份层 / 本镜层 | 不指输出外壳的"三字段" |
| **手性锁** | "肩侧 = 视线侧"的固定对应，开场定一次 | 不指左或右本身；手性可以整场镜像 |
| **机位移交** | 一次连续生成内，镜头从 A 的肩后推到 B | 不指切镜；切镜是两次生成 |

---

## 一、两个症状，一个根因

### 1.1 症状

| 症状 | 现场长什么样 |
|---|---|
| **反打穿帮** | 双人对话切到反打，人物位置立刻翻转：A 镜她在左，B 镜她跑到右；两个人看着同一侧，空间塌了 |
| **角色随机刷新** | 多人场景一复杂，少一个人、多一个人、两个人换脸；坐着的人站起来，站着的人瞬移，背景里冒出半个人 |

这两类问题在本套文档里统一叫 **视频单元上下文不对齐**：每个单元都是独立生成，单元之间没有共享记忆。参考图能传"看得见的状态"，但传不了"房间的拓扑、对话轴、谁在画外、几个人"这些看不见的关系。

### 1.2 根因不是"写得不够多"，是"写得太乱"

文字锚定失效的五种病因，按出现频率排序：

| # | 病因 | 机制 | 症状 |
|---|---|---|---|
| 1 | **三个坐标系混写** | 同一句"在左边"可能指房间西侧、画面左三分之一、他视角的左边；三套说法同时出现，模型折中或漂移 | 人物位置在镜头间游移 |
| 2 | **同一事实重复定义** | `subject_definitions` 说一次、`POSE AND STAGING` 说一次、一致性锁再说一次；模型不知道以哪次为准 | 每次生成挑一个版本，接起来就跳 |
| 3 | **每单元重新理解场景** | 每个单元都从场景图重新推断一遍空间，采样方差累积 | 写到第三、四个单元开始漂 |
| 4 | **没有稳定槽位** | 每次用人名、关系、外貌重新描述同一个人；措辞一变，模型重新采样 | 换脸、身份融合 |
| 5 | **追求完整三维理解** | 试图让语言模型"看懂"整个房间的 3D，负担重且不可靠 | 推断越多，错得越自然 |

**正确方向是减法**：

1. 把空间信息**分成三层**，每层只说一次。
2. 把重计算（读懂场景）**只做一次**，写进账本；之后每单元只做机械投影。
3. 用**稳定槽位号**替代人名和关系描述。
4. 只守**四个不变量**，不追求三维保真。

> 资源里的原话是这份文档的总纲：**"不是让 AI 突然拥有完整三维理解，而是不要让它同时相信三套空间说法。"**

---

## 二、三层空间协议

> 这里的 L1 / L2 / L3 指**空间层**，与 3.1b 的"三字段外壳"无关。

### 2.1 三层各管什么

| 层 | 回答的问题 | 内容 | 寿命 | 写进提示词哪里 |
|---|---|---|---|---|
| **L1 世界层** | 这间房长什么样？东西在哪？ | 坐标约定、节点表 N#、锚区 P#、机位点 K#、光位 | 整场 / 整段冻结 | `POSE AND STAGING` 第一句，前缀 `World:` |
| **L2 身份层** | 谁是谁？谁在哪？拿什么？ | c# ↔ Subject ↔ 图 ↔ 说话人；槽位 P#；朝向节点；道具；服装基线；轴线表 | 整集（槽位随段落更新） | `subject_definitions` + `POSE AND STAGING` 的 `Slots:` |
| **L3 本镜层** | 此刻谁入镜、从哪拍、看哪、说什么？ | 机位点 K#、轴线侧、屏幕左右、景别、帧内人数、朝向/视线变化、位移、进/出画、台词 | 一单元 | `subject_definitions` 的屏幕位 + `CAMERA` + `TIMELINE` |

### 2.2 一条铁律：一个事实，只在一个层级出现一次

| 事实 | 唯一主人 | 允许的第二次出现 |
|---|---|---|
| 房间结构、家具、门/窗方位 | L1（节点表，逐字复用） | 无。不要在同一条提示词里换同义词再说一遍 |
| 人物身份、服装、标志物 | L2（`subject_definitions` / `CHARACTER`） | 一致性锁可重申 1–2 个最关键标志物 |
| 人物在房间里的位置 | L2（`Slots:`，节点相对） | 时间码里写"从哪个节点到哪个节点"的变化 |
| 屏幕左右、景别、前景肩 | L3（`subject_definitions` 一次） | 只有**变化**才在 `TIMELINE` 再说 |
| 朝向 / 视线 | L3（跟屏幕位一起说一次） | `TIMELINE` 写变化；一致性锁写惯性（趋势），不写重复值 |
| 人数 | L2 计划总人数；L3 帧内人数；一致性锁锁定 | 三处口径必须一致，不是三套数字 |
| 光的方向 | L1（世界方向，节点相对） | `LIGHT` 段写本镜的画面投影 |

**最常见的违规**：`subject_definitions` 写了"她在画面右侧"，`POSE AND STAGING` 又写"她坐在右边"，`CAMERA` 再写"她位于画面右三分之一"。写三遍不是加强，是给模型三个可选版本。

### 2.3 锁拓扑 ≠ 禁止移动

这是最容易读反的一条。锁住的是**空间关系**，不是人物。

| 动作 | 算什么 | 写在哪 |
|---|---|---|
| 起身、坐下、侧身、靠近、转头、伸手 | 房间内移动 | `TIMELINE` 对应拍，写清起止锚区 |
| 从沙发走到门口但没出门 | 房间内移动 | `TIMELINE`，经过哪些锚区 |
| 穿过门、进入走廊、上楼、大规模换位 | **新的空间段落** | 新的 L1（新节点表 / 新站位图）+ 新机位点 |
| 房间被改造、家具被移动 | 新的空间段落 | 重建节点表 |

**门是段落边界。** 一个人跨过门，就换地图；不要在同一段里让他从客厅走到走廊还沿用客厅的节点表。

### 2.4 四检：只守四个不变量

资源的原话是"只检查四件事"。这四件是观众真正会追踪的，也是模型最容易崩的：

| 检查 | 问什么 | 失败长什么样 | 回哪一层 |
|---|---|---|---|
| **身份** | 每个 c# 的图、`<Subject N>`、说话人 ID 是否一致？ | 换脸、两人融合、台词分错人 | L2 |
| **拓扑** | 每个人在哪个节点？和上一单元比变了没有？变了的起止节点写了吗？ | 人从沙发瞬移到门口、坐着的人站起来、家具位置变了 | L1+L2 |
| **人数** | 房间总人数？帧内几人？谁在画外？画外的人传卡了吗？ | 凭空多一个人、少一个人、背景冒出半个人 | L2+L3 |
| **轴线** | 机位在轴的哪一侧？前景肩在哪？视线朝哪？和上一镜连续还是相反？ | 两个人都看同一侧、反打左右翻转、过肩肩头换边 | L3 |

**为什么只守这四件**：完整的 3D 保真既做不到也不需要。观众不会数家具的厘米数，但会立刻发现"她刚才在沙发上，怎么现在在门口"。四件守住，画面就稳；守不住，写再多细节也没用。

---

## 三、空间账本：从场景图到节点表

空间账本是整场戏的**唯一空间事实源**。它在第一单元开工前建一次，之后每个单元只更新"当前段落"和"上一帧状态"。

### 3.1 先定覆盖：环境卡是"拍摄弧"，不是"整个房间"

**这是最容易误解的一步。** 一张场景图通常只覆盖 90–180° 的拍摄弧；它没拍到的墙、门背面、房间另一侧，模型并不知道。

所以账本的第一块不是节点表，是**覆盖与假设**：

```text
■ 0 覆盖与假设
  环境卡 E1（客厅·壁炉侧）覆盖：北墙、西墙、南墙西段（N1 门）、东墙窗段（N2）、壁炉、长沙发、书桌、单人椅。
  未见：南墙东段、天花板。→ 本场机位只朝北/西/东窗段；若需朝南东段，补环境卡 E2。
  假设：门在南墙偏西；若实际相反，整场镜像并在账本改一次。
```

三条推论：

1. **机位只能朝已覆盖的弧拍。** 朝未见的墙拍，模型会即兴生成，每个单元长得不一样——这就是"背景长出家具"和"房间变了"的根因。
2. **反打通常需要两张环境卡。** A 镜的背景是 B 身后的墙，B 镜的背景是 A 身后的墙；两面墙都要有依据。
3. **站位图（俯视图）补拓扑，不补外观。** 它告诉你门在哪、谁站哪，但不告诉你墙是什么材质、光从哪来。外观仍归环境卡。**没有俯视图时，用 3.1b 从场景图读节点表；不要要求用户补图。**

> 重型的剧集工作流里有一条同源规则：场景资产按"空间朝向"做，不按"镜头"做。一间房有几个可拍朝向，就做几张空镜。这条在这里落地成了"覆盖与假设"。

### 3.1b 没有俯视图：从一张场景图读节点表

**俯视图不是必需品。** 办公区、宿舍、食堂、楼外这类透视场景图已经足够建账本；俯视图只是把同一间房转成平面的加速器。不要因为用户没给俯视图就要求补图——那会把一个"读图"任务变成"补资产"任务。

#### 五步

```text
1 定向：画面远墙=北，画面左=西，右=东，镜头所在侧=南
2 数固定结构：门/窗/柜台/玻璃隔断/立柱/楼梯/远端墙；记"在哪面墙、朝哪、能不能过人"
3 数家具阵列：桌排/上下铺/餐桌排/货架；记"几行几列、长边朝哪、中间哪条是通道"
4 划锚区 P#：人从哪进、坐哪、站哪、走哪条通道；一个锚区挂 1–2 个节点
5 划机位点 K#：只在可见弧里选；每个 K# 写高度+看向点；未见墙面标"需补环境卡"
```

#### 透视图的深度线索

| 线索 | 读什么 | 用来定什么 |
|---|---|---|
| **地面透视线** | 地砖/地板缝/通道线向远处收敛 | 主通道方向、远端墙位置 |
| **家具遮挡关系** | 近排桌挡住远排桌的腿 | 桌排的前后顺序、纵深 |
| **窗/门的高光** | 窗框、门框的透视收缩 | 窗墙/门墙的朝向 |
| **阵列重复** | 桌/床/椅按同一间距重复 | 行数、列数、中间通道 |
| **光斑与影子** | 影子往哪边倒 | 主光方向（世界方向，不是画面侧） |

#### 示例 A：办公区

- 定向：远端=北；玻璃会议室/茶水台=西；窗墙=东；镜头侧=南。
- 节点：N1 玻璃隔断（西前）、N2 茶水台（西前近）、N3 打印机（西北）、N4 远端门/隔断（北）、N5 窗墙（东）、N6 办公桌阵列（中，2 列 × 3 排）、N7 绿植（北中）。
- 锚区：P1 茶水台前、P2 中央主通道（南→北）、P3 近排左桌、P4 近排右桌、P5 远排桌、P6 打印机角、P7 窗边。
- 机位：K1 南端入口（北望，交代空间）、K2 两排桌之间（西望，拍坐者）、K3 窗边（西望，侧光）、K4 远端门（南望，反打；需补南墙环境卡）。
- 覆盖：北/西/东/南西可见；南东、天花板未见。

#### 示例 B：宿舍

- 定向：远端门/窗=北；左上下铺列=西；右上下铺列=东；镜头侧=南。
- 节点：N1 左铺列（西）、N2 右铺列（东）、N3 远端门（北西）、N4 远端窗（北中）、N5 三联桌+双椅（北中）、N6 右侧边桌（东）。
- 锚区：P1 左通道、P2 右通道、P3 桌前双椅、P4 门内、P5 左列近/中/远铺（代表锚区，不逐个编号）、P6 右列近/中/远铺。
- 机位：K1 南端中央（北望全景）、K2 左通道（东望拍右铺）、K3 右通道（西望拍左铺）、K4 远端桌前（南望反打；需补南墙环境卡）。
- 覆盖：北/西/东可见；南墙、天花板未见。

#### 场景类型速查

| 场景 | 固定结构 | 家具阵列 | 锚区 | 反打注意 |
|---|---|---|---|---|
| 办公区 | 玻璃隔断、茶水台、窗墙、远端门 | 办公桌 2 列 × N 排 | 中央通道、桌位、茶水台、窗边 | 朝入口侧反打需补南墙卡 |
| 宿舍 | 远端门/窗、两侧铺列 | 上下铺 2 列 × N 铺 | 左右通道、桌前、门内、床铺 | 朝门内反打需补南墙卡 |
| 食堂 | 售卖台、窗墙、远端墙 | 餐桌 N 排 | 售卖台前、桌侧、通道 | 朝入口侧反打需补入口卡 |
| 楼外 | 台阶、玻璃门、门灯、侧墙 | 无 | 台阶下、门槛、门内 | 门=段落边界；室内外交接换 L1 |

**一句判据**：把这张场景图交给一个没来过的人，他能不能画出"门在哪、窗在哪、桌子/床怎么排、人从哪进、机位能放哪"？能，账本就建起来了；不能，就补一条假设（"假设门在南墙"），不要留空。

### 3.2 定向：给房间一个固定坐标系

在账本顶部写死一次，整场不改：

```text
透视场景图：画面远墙=北，画面左=西，右=东，镜头所在侧=南。
（如果用户给了俯视图：上=北，下=南，左=西，右=东；两者是同一套坐标。）
世界坐标只用节点/方位；屏幕左右只在本镜（L3）写。
```

- 如果场景图的方位有歧义，**当场声明假设**："假设门在南墙；若实际相反，整场镜像并只改账本一次。" 不要在每个单元里重新猜。
- 一旦定下，所有"左/右"在账本里都是世界方向；画面左右只出现在本镜层。
- 这样"她在左边"这句话在账本里永远不合法——必须写成"她在 P4（沙发左端）"。

### 3.3 节点表 N#

只收**约束站位的结构与家具**，不收装饰。4–7 个足够。

```text
■ 2 节点表 N（L1）
  N1 门：南墙偏西，向内开；门内侧可站 1 人。
  N2 窗：东墙中段，月光从东向西入射。
  N3 书桌：北墙偏东，桌前缘距北墙 0.9m；桌后与北墙之间可站 1 人。
  N4 长沙发：西墙中段，面朝东（房间中央）；左端可靠扶手坐 1 人。
  N5 壁炉：北墙正中，炉前 0.8m 可站 1 人。
  N6 单人椅：壁炉东南 1.2m，面朝沙发。
```

每个节点至少写四件事：**ID、位置（哪面墙/哪个区）、朝向（面朝哪）、可做什么（坐/站/倚/通过）**。有遮挡关系的加一句"挡住什么"。

### 3.4 锚区表 P#：人物能站/坐的点

节点是"物"，锚区是"位"。每个锚区必须挂在 1–2 个节点上，并给一个默认朝向。

```text
■ 3 锚区表 P（L1 派生）
  P1 门内侧（N1 内 1m）——进出场用
  P2 书桌后（N3 与北墙之间）——站/倚桌
  P3 壁炉前（N5 前 0.8m）——站/转身
  P4 沙发左端（N4 左扶手）——坐
  P5 窗边（N2 内侧 0.6m）——站/看窗外
  P6 单人椅（N6）——坐
  P7 房间中央（N4 与 N5 之间）——走位经过，不停留
```

规则：

- **一个锚区同时只给一个人。** 两个人挤同一个 P#，模型会把它们合成一个。
- **锚区不等于机位点。** 人站的点和机器站的点分开编号，否则"机位在窗边"会和"她站在窗边"打架。
- 锚区数量控制在 3–8 个；太多会让模型在相似位置之间漂移。

### 3.5 机位点 K#：机器能站的点

这是"没有空间地图"死结的解法：**把可站机位预先编号，每单元只选 K# 和看向点，不再即兴想象机位。**

```text
■ 4 机位点 K（L1 派生）
  K1 书桌右前 1m，高 1.35m，看向 P4（过 c2 的肩）
  K2 壁炉前 1.5m，高 1.5m，看向 P4（正打 c1）
  K3 沙发右后 1m，高 1.4m，看向 P2（反打 c2）
  K4 房间中央偏南，高 1.4m，看向 N4（群像全景）
  K5 门内侧 1.5m，高 1.5m，看向 N4（进门口的主观方向）
  K6 沙发西侧贴地，高 0.35m，看向 N4（低机位起幅，群像移交用）
  K7 书桌西南 2m，高 1.4m，看向 P2（正打 c2）
```

规则：

- **K# 不能与有人占用的 P# 重合**，至少留 0.5–1m 的净空。
- 每个 K# 记三项：位置、高度、默认看向点。需要换焦段/景别时只改镜头参数，不改 K#。
- **相邻单元不能同 K + 同景别 + 同主体位置**（撞 5.1 的同构图）。K# 可以复用，但要换景别、换入画人数或换主体位置。
- K# 必须在覆盖弧内；如果看向点落在未见墙上，先补环境卡，不要硬拍。

### 3.6 人物槽位 c#：谁是谁，谁在哪

c# 是**跨单元稳定的人物槽位号**，不是临时称呼。绑定只写一次，之后每个单元原样复用。

```text
■ 5 人物槽位（L2）
  c1 = 伊芙 = <Picture 1> = <Subject 1> = S1 → P4（坐）
     朝向 N3（房间中央）；重心在左髋；右手搭左扶手；左手空；红裙；赤脚。
  c2 = 丹尼尔 = <Picture 2> = <Subject 2> = S2 → P2（站）
     朝向 N4；右髋靠 N3 桌沿；右手持杯，杯口朝上；深蓝西装。
  c3 = 亚瑟 = <Picture 3> = <Subject 3> = S3 → P6（坐）
     朝向 N4；后背贴椅背；双手搭扶手；灰西装。
  c4 = 薇拉 = <Picture 4> = <Subject 4> = S4 → P5（站）
     朝向 N4；左手扶窗框；右手垂在身侧；绿裙。
  在场：4 人。画外：无。缺席：管家（不传卡，不入画）。
```

规则：

- **一个 c# 只对应一个人、一张图、一个说话人 ID。** 不要在某一单元把 c3 的图给 c2 用。
- **站位写"P# + 状态"，不写画面左右。** "P4（坐，靠左扶手，面向 N3）"是合法的；"画面左侧"不合法。
- **朝向写"面向哪个节点/人"。** 朝向是空间关系，不是屏幕方向。
- **道具和承重单独写。** "右手持杯"和"右髋靠桌"是下一单元最容易丢的两项。
- **画外的人不传身份卡**（2.4），但在场/缺席名单要写清；否则模型会自己补人。
- **身份卡不重不漏**：每单元只传帧内人物的卡，槽位清单每单元重算。

### 3.7 轴线表：正反打的唯一几何依据

每一对主要对话人物建一条轴。轴线表同时定义 A 机和 B 机的肩侧、焦点位置、视线方向。

```text
■ 6 轴线表（L2）
  主对话轴：c2(P2) ↔ c1(P4)。
  A 机（过 c2 的肩看 c1）：c2 的肩在画面左缘；c1 居中偏右；c1 视线朝画面左下。
  B 机（过 c1 的肩看 c2）：c1 的肩在画面右缘；c2 居中偏左；c2 视线朝画面右下。
  手性：本场固定为"肩左→看左，肩右→看右"；整集不改。
```

**几何铁律：焦点人物看向前景肩所在的那一侧。** 肩在左，对方就看左下；肩在右，对方就看右下。这条比"左/右"本身更重要——它保证两个人始终像在看着对方。

### 3.8 光位表：存在世界层，投影在本镜层

```text
■ 7 光位（L1）
  主光：月光自 N2 东墙入，冷蓝 5600K，地面硬格纹由东向西。
  辅光：N5 壁炉余烬，暖橙 2000K，勾北侧轮廓。
  人物进入不同光区时曝光连续；暗部蓝灰，不棚拍。
```

- 光位永远用**世界方向**记（"自东墙入"），不用画面左右。
- 每个单元的 `LIGHT AND ATMOSPHERE` 段再把它**投影**成画面侧（"主光从画面左侧来"），这是本镜层的合法描述。
- **反打时画面侧会翻转**：A 镜主光在画面左，B 镜可能就在画面右。把 A 镜的"from frame-left"抄到 B 镜，房间就会像被镜像了一样。这是反打穿帮里最隐蔽的一种。

### 3.9 完整账本模板

```text
【空间账本 · 庄园客厅】  建立于第 01 单元前｜整场冻结，逐字复用

■ 0 覆盖与假设
  环境卡 E1（客厅·壁炉侧）覆盖：北墙、西墙、南墙西段（N1 门）、东墙窗段（N2）、壁炉、长沙发、书桌、单人椅。
  未见：南墙东段、天花板。→ 本场机位只朝北/西/东窗段；若需朝南东段，补环境卡 E2。
  假设：门在南墙偏西；若实际相反，整场镜像并在账本改一次。

■ 1 坐标约定
  坐标约定：画面远墙=北，画面左=西，右=东，镜头所在侧=南（若用俯视图，上=北）。
  世界坐标只用节点/方位；屏幕左右只在本镜（L3）写。

■ 2 节点表 N（L1）
  N1 门：南墙偏西，向内开；门内侧可站 1 人。
  N2 窗：东墙中段，月光从东向西入射。
  N3 书桌：北墙偏东，桌前缘距北墙 0.9m；桌后与北墙之间可站 1 人。
  N4 长沙发：西墙中段，面朝东（房间中央）；左端可靠扶手坐 1 人。
  N5 壁炉：北墙正中，炉前 0.8m 可站 1 人。
  N6 单人椅：壁炉东南 1.2m，面朝沙发。

■ 3 锚区表 P（L1 派生）
  P1 门内侧（N1 内 1m）——进出场用
  P2 书桌后（N3 与北墙之间）——站/倚桌
  P3 壁炉前（N5 前 0.8m）——站/转身
  P4 沙发左端（N4 左扶手）——坐
  P5 窗边（N2 内侧 0.6m）——站/看窗外
  P6 单人椅（N6）——坐
  P7 房间中央（N4 与 N5 之间）——走位经过，不停留

■ 4 机位点 K（L1 派生）
  K1 书桌右前 1m，高 1.35m，看向 P4（过 c2 的肩）
  K2 壁炉前 1.5m，高 1.5m，看向 P4（正打 c1）
  K3 沙发右后 1m，高 1.4m，看向 P2（反打 c2）
  K4 房间中央偏南，高 1.4m，看向 N4（群像全景）
  K5 门内侧 1.5m，高 1.5m，看向 N4（进门口的主观方向）
  K6 沙发西侧贴地，高 0.35m，看向 N4（低机位起幅，群像移交用）
  K7 书桌西南 2m，高 1.4m，看向 P2（正打 c2）

■ 5 人物槽位（L2）
  c1 = 伊芙 = <Picture 1> = <Subject 1> = S1 → P4（坐）
     朝向 N3（房间中央）；重心在左髋；右手搭左扶手；左手空；红裙；赤脚。
  c2 = 丹尼尔 = <Picture 2> = <Subject 2> = S2 → P2（站）
     朝向 N4；右髋靠 N3 桌沿；右手持杯，杯口朝上；深蓝西装。
  c3 = 亚瑟 = <Picture 3> = <Subject 3> = S3 → P6（坐）
     朝向 N4；后背贴椅背；双手搭扶手；灰西装。
  c4 = 薇拉 = <Picture 4> = <Subject 4> = S4 → P5（站）
     朝向 N4；左手扶窗框；右手垂在身侧；绿裙。
  在场：4 人。画外：无。缺席：管家（不传卡，不入画）。

■ 6 轴线表（L2）
  主对话轴：c2(P2) ↔ c1(P4)。
  A 机（过 c2 的肩看 c1）：c2 的肩在画面左缘；c1 居中偏右；c1 视线朝画面左下。
  B 机（过 c1 的肩看 c2）：c1 的肩在画面右缘；c2 居中偏左；c2 视线朝画面右下。
  手性：本场固定为"肩左→看左，肩右→看右"；整集不改。

■ 7 光位（L1）
  主光：月光自 N2 东墙入，冷蓝 5600K，地面硬格纹由东向西。
  辅光：N5 壁炉余烬，暖橙 2000K，勾北侧轮廓。

■ 8 当前段落（L3，逐单元更新）
  段落：第 01–06 单元，客厅对话，无大规模换位。
  上一单元落幅：c1 坐 P4，c2 站 P2，c3 坐 P6，c4 站 P5；c1 视线在 c2；c2 右手持杯。
  本单元变化：c1 起身 P4 → P3（1.2–2.0s）；c2 原地转身 90° 面向 N5；c3/c4 原地。
  本单元结束：c1 → P3（站，面向 N5）；c2 → P2（面向 N5）。
```

### 3.10 建账本的顺序

```text
1 读环境卡 → 写"覆盖与假设"（哪些墙见过、哪些没见过）
2 定向（北/南/西/东）
3 节点表 N（4–7 个）
4 锚区 P（3–8 个）
5 机位点 K（3–6 个，每个带高度和默认看向点）
6 人物槽位 c#（绑定图/Subject/说话人，写站位/朝向/承重/道具/服装）
7 轴线表（每对主要对话人物一条）
8 光位表（世界方向）
9 当前段落（本单元开始时的状态）
→ 冻结 L1/L2；之后每单元只改第 8 块和"交接块"
→ 单元结束后，把"结束状态"写回第 5 块（人物槽位）和第 8 块；下一单元从这里开始，不从旧基线开始
```

### 3.11 什么时候重建 L1

| 情况 | 处理 |
|---|---|
| 换到另一个房间 / 室外 | 新建账本 |
| 一个人穿过门进入走廊 | 新的空间段落，新建节点表 |
| 家具被移动、房间被破坏 | 重建节点表 |
| 只是起身、走近、转身、坐下 | 不重建，写进 `TIMELINE` |
| 同一房间换一个拍摄弧（正打 → 反打） | L1 不变；检查反方向的环境卡是否存在 |

---

## 四、单元投影：从账本到提示词

账本建好之后，每个单元不再是"重新理解场景"，而是一次**机械投影**：选机位、定轴线侧、算屏幕侧、定人数、写增量。

### 4.1 五步投影

```text
1 选机位：选一个 K#，写高度、看向点、景别边界
2 定轴线侧：同侧（延续）还是换侧（刻意反打）；换侧必须靠切
3 算屏幕侧：按轴线表取 A 或 B 的现成一行；肩侧 = 视线侧
4 定人数：帧内几人、谁画外、有没有人进出；画外的人不传卡
5 写三层 + 时间码：World（L1 逐字）+ Slots（L2 节点相对）+ Shot（L3 景深/前景）+ TIMELINE（变化）
```

### 4.2 屏幕侧不要重新推导

每单元重新判断"她在左还是右"是反打穿帮的主要来源。正确做法是**读表**：

- 这一单元用 A 机？直接取轴线表 A 行：前景肩在左缘，焦点人物在中/右，视线朝左下。
- 这一单元用 B 机？直接取 B 行：前景肩在右缘，焦点人物在中/左，视线朝右下。
- 换侧？切到另一行，不是把同一行左右翻转。
- 单人镜头？把视线写成绝对方向（`frame-left` / `frame-right` / `off frame left`），头部是否跟随另写。

**K# 与轴线行的对应在账本里写死**：例如 K1（过 c2 的肩）= A 行，K3（过 c1 的肩）= B 行。选 K# 就等于选行，不要在每条提示词里再判断一次。

### 4.3 提示词落位模板（六段式）

```text
subject_definitions:
c1 = <Subject 1> = the woman from <Picture 1>, ... Positioned in the right third of the
frame, facing frame-left, off screen. Speaker ID: S1.
c2 = <Subject 2> = the man from <Picture 2>, ... His shoulder enters at the lower-left
foreground, soft and out of focus. Listener; his lips stay completely closed.

summary:
[reference generation] Segment C2 of a shot/reverse-shot sequence. One continuous medium
close shot on c1, over c2's shoulder, in the drawing room from <Picture 3>.

retention_analysis:
<Subject 1>: fully_preserved — identity, red dress, seated posture at the sofa's left end,
speaker role. attribute_transfer — the cold sheen across her hair and shoulder. strictly_avoided —
identity mixing with c2, extra people, any re-definition of the room.
<Subject 2>: fully_preserved — identity, dark blue suit, the glass in his right hand,
foreground-shoulder role. strictly_avoided — any facial movement, any movement of the
foreground shoulder, any dialogue from him.

detailed_description:
CHARACTER: [风格锁原文，逐字] c1 keeps her exact design from <Picture 1>: ... c2 keeps ...

POSE AND STAGING:
World: a rectangular drawing room; N1 door at the south wall, N2 window at the east wall,
N3 desk against the north wall east of the fireplace, N4 long sofa against the west wall
facing east, N5 fireplace at the centre of the north wall, N6 armchair north-west of the
sofa facing south-east.
Slots: c1 sits at P4, the left end of N4, her weight on her left hip, her right hand on the
armrest, facing the room centre (N3); c2 stands at P2 behind N3, his right hip braced on the desk edge, the
glass in his right hand, facing N4; c3 sits at P6 in N6, his forearms on the armrests,
facing N4; c4 stands at P5 by N2, her left hand on the window frame, facing N4 — c3 and c4
stay out of frame for the whole shot. The distance from c1 to c2 is about four paces.
Shot: an over-the-shoulder view from behind c2's shoulder; his shoulder fills the near
foreground as a soft dark mass, and c1 is sharp beyond it. The desk edge runs behind him;
the fireplace is out of focus in the far background.

TIMELINE:
0.00-1.20s: ...
...

CAMERA: 85mm equivalent, at c1's eye height, from K1 behind c2's shoulder, a medium
close shot from c1's waist up, focus locked on her eyes and mouth; the camera body stays
fixed at one point for the whole take.

PHYSIOLOGY PRIORITY: ...

LIGHT AND ATMOSPHERE: The key moonlight enters from N2 on the east wall, so in this shot it
comes from behind the camera and falls across c1's face, lifting the edge of her hair; ...
...
CONSISTENCY LOCK: c1's weight stays on her left hip, her right hand on the armrest, her eyes
staying on c2's shoulder; c2's right hip stays on the desk
edge, the glass in his right hand; exactly two people in the frame, one woman plus c2's right
shoulder as the only other body element; no one enters or leaves the room.
```

**注意**：`subject_definitions` 是屏幕左右的唯一出现处；`POSE AND STAGING` 的 `Shot:` 只写景深和前景，不再复述"left/right"；`CAMERA` 只写机位点、焦段、高度和静止。

### 4.4 完整示例一：双人反打 C2

```text
subject_definitions:
c1 = <Subject 1> = the woman from <Picture 1>, wearing a deep red dress. Positioned in the
right third of the frame, facing frame-left, off screen. Her facial features, the silver
hairpin above her left temple and the small mole below her right eye are strictly locked to
<Picture 1>. Speaker ID: S1.

c2 = <Subject 2> = the man from <Picture 2>, wearing a dark blue suit. Positioned at the
lower-left foreground as a shoulder, facing away from camera. The mole on the right
side of his neck and the glass in his right hand are strictly locked to <Picture 2>.
Listener. His lips remain completely closed and his shoulder stays completely still.

summary:
[reference generation] Segment C2 of a shot/reverse-shot sequence. An over-the-shoulder
medium close shot from behind c2's shoulder, focusing entirely on c1, in the drawing
room from <Picture 3>. One continuous shot.

retention_analysis:
<Subject 1>: fully_preserved — facial identity, silver hairpin above the left temple, mole
below the right eye, red dress, seated posture at P4, speaker role. attribute_transfer —
the cold sheen across her hair and shoulder. strictly_avoided — identity mixing with c2, extra
people, any re-definition of the room, any change of her seat.

<Subject 2>: fully_preserved — the mole on the right side of his neck, the dark blue suit,
the glass in his right hand, foreground-shoulder role at the lower-left. strictly_avoided —
any facial movement, any movement of the foreground shoulder, any line from him, any identity
drift toward c1.

detailed_description:
CHARACTER: Photorealistic cinematic film still, live-action film look, natural skin texture
with visible pores, fine vellus hair and real subsurface scattering, restrained teal-and-slate
color grade. c1 keeps her exact character design from <Picture 1>: very long straight black
hair with a centre part, a silver hairpin above her left temple, a small brown mole below the
outer corner of her right eye, a deep red silk dress with a square neckline.

POSE AND STAGING:
World: a rectangular drawing room; N1 door at the south wall, N2 window at the east wall,
N3 desk against the north wall east of the fireplace, N4 long sofa against the west wall
facing east, N5 fireplace at the centre of the north wall, N6 armchair north-west of the
sofa facing south-east.
Slots: c1 sits at P4, the left end of N4, her weight on her left hip, her right hand on the
armrest, facing the room centre (N3); c2 stands at P2 behind N3, his right hip braced on the desk edge, the
glass in his right hand, facing N4; c3 sits at P6 in N6, his forearms on the armrests,
facing N4; c4 stands at P5 by N2, her left hand on the window frame, facing N4 — c3 and c4
stay out of frame for the whole shot. The distance from c1 to c2 is about four paces.
Shot: an over-the-shoulder view from behind c2's shoulder; his shoulder fills the near
foreground as a soft dark mass, and c1 is sharp beyond it. The desk edge runs behind him;
the fireplace is out of focus in the far background.

TIMELINE:
0.00-1.20s: c1's eyes rest on the point just off frame where c2's shoulder is; her breathing
is slow and even; her mouth stays closed.
1.20-2.40s: Her chin lifts a few degrees and the corner of her mouth eases upward without
opening; c2's shoulder stays completely still.
2.40-4.00s: In a low, unhurried, faintly hoarse voice with the last two syllables dropping
(S1) she says: <d>[Chinese] 你终于肯来了。</d>
4.00-5.60s: Her smile deepens and reaches her eyes; she blinks once, slowly; her shoulders
settle against the sofa.
5.60-7.60s: Her eyes slide a few degrees toward frame-left without her head moving.
7.60-10.00s: She holds the smile and the stillness; the frame does not move.

CAMERA: 85mm equivalent, at c1's eye height, from K1 behind c2's shoulder, a medium
close shot from c1's waist up with c2's shoulder soft and large in the near foreground;
focus locked on c1's eyes and mouth; zero camera movement for the whole take.

PHYSIOLOGY PRIORITY: breathing amplitude > eyelid > smile > eye direction. Breathing stays
slow and even. The smile opens at 2.40s and holds past the point where a real smile would
fade. One slow blink at 4.00s. Her eyes shift at 5.60s while her head stays still. At most
two changes land inside any single second.

LIGHT AND ATMOSPHERE: The key moonlight enters from N2 on the east wall, so in this shot it
comes from behind the camera and falls across c1's face, lifting the edge of her hair; her face
sits a stop and a half down. A warm-orange 2000K fire from N5 lifts the underside of her jaw
from frame-right. c2's foreground shoulder sits in near darkness. Highlights held just below
clipping, shadows deep and desaturated blue-grey.

CONSISTENCY LOCK: c1's weight stays on her left hip, her right hand on the armrest, her eyes
staying on c2's shoulder; c2's right hip stays on the desk
edge and the glass stays in his right hand; c3 and c4 remain at P6 and P5 and never enter
this frame. Exactly one woman and one foreground shoulder in the frame; no one enters or
leaves the room.

overall_soundscape: A quiet drawing-room tone with a clock ticking somewhere behind the
camera, the soft rustle of silk as c1 settles against the sofa, c2's calm breathing from
the near foreground, and one quiet swallow just before she speaks.

non_diegetic_music: N/A
```

### 4.5 完整示例二：四人群像 + 机位移交

这个单元要同时做到四件事：交代四个人的节点、让镜头从近处的人推进到另一个人、给一句台词、让另外两个人有反应。

```text
subject_definitions:
c1 = <Subject 1> = the woman from <Picture 1>, in a deep red dress. Positioned in the near
foreground at 0.00s, out of focus. Listener.

c2 = <Subject 2> = the man from <Picture 2>, in a dark blue suit. Positioned in the centre
of the frame, facing the camera side. Speaker ID: S1.

c3 = <Subject 3> = the older man from <Picture 3>, in a grey suit. Positioned in the left
background, seated, facing frame-right. Listener.

c4 = <Subject 4> = the woman from <Picture 4>, in a green dress. Positioned in the right
background, standing, facing frame-left. Listener.

summary:
[reference generation] A single continuous take in the drawing room from <Picture 5>. The
camera starts low near the floor beside c1, rises and pushes forward toward c2, and settles
on him for his line. Four people are in the room; no one enters or leaves.

retention_analysis:
<Subject 1>: fully_preserved — identity, red dress, the sofa's left end at P4, listener role.
strictly_avoided — any facial performance, any movement beyond sitting still, identity
mixing with c4.
<Subject 2>: fully_preserved — identity, dark blue suit, the glass in his right hand, speaker
role. attribute_transfer — the desk edge behind his hip. strictly_avoided — leaving the desk,
turning his back to c1, any second speaker.
<Subject 3>: fully_preserved — identity, grey suit, seated posture at P6, listener role.
strictly_avoided — standing up, any line.
<Subject 4>: fully_preserved — identity, green dress, standing posture at P5, listener role.
strictly_avoided — leaving the window, any line.

detailed_description:
CHARACTER: [风格锁原文，逐字] c1 keeps her exact design from <Picture 1>: ... c2 keeps ...
c3 keeps ... c4 keeps ...

POSE AND STAGING:
World: a rectangular drawing room; N1 door at the south wall, N2 window at the east wall,
N3 desk against the north wall east of the fireplace, N4 long sofa against the west wall
facing east, N5 fireplace at the centre of the north wall, N6 armchair north-west of the
sofa facing south-east.
Slots: c1 sits at P4, the left end of N4, weight on her left hip, facing the room centre
(N3); c2 stands at
P2 behind N3, right hip braced on the desk edge, the glass in his right hand, facing N4;
c3 sits at P6 in N6, forearms on the armrests, facing N4; c4 stands at P5 by N2, left hand
on the window frame, facing N4. c1 and c2 are about four paces apart; c3 is two paces behind
c2's left; c4 is at the far right.
Shot: the camera starts at K6, low near the floor west of the sofa, with the back of the sofa
and c1's shoulder in the near foreground; it rises to chest height and arcs along the south
side of the room to K7, ending on c2, with c1 out of frame and c2 sharp in the centre. The
move stays on the south side of the c2-c1 axis for the whole arc.

TIMELINE:
0.00-1.20s: A low angle near the floor: the back of the sofa and c1's shoulder fill the near
foreground; beyond her, c2 stands at the desk, his right hip against the edge, the glass in
his right hand; c3 is seated in the armchair at the left, c4 stands by the window at the right.
Exactly four people are in the room; no one else enters.
1.20-3.00s: The camera rises to chest height and arcs along the south side of the room to K7,
staying on the south side of the c2-c1 axis; by 3.00s it settles on c2, c1 has left the frame,
and c2 is sharp in the centre with the desk edge behind his hip; c3 and c4 remain in the
background.
3.00-5.60s: c2's eyes move from c1's direction to the far side of the room, then back; he
sets the glass down on the desk without looking at it and says, in a low, dry, deliberately
level voice (S1): <d>[English] Mrs Vane was found dead just after midnight.</d> His hand
stays on the glass after the line.
5.60-7.40s: c3's hand stops on the armrest; c4's eyes shift from c2 toward c1's direction;
c2's chin lifts a few degrees and his weight settles back onto his hip.
7.40-10.00s: c2 holds the room with his eyes; c3 and c4 stay still; the frame holds; no one
enters or leaves.

CAMERA: 35mm equivalent, starting at K6 low near the floor and ending at K7 at chest height,
a medium shot of c2 from the waist up at the end; the lens stays at the same focal length
throughout; one continuous rise-and-arc move, no cuts; the image stays steady and smooth.

PHYSIOLOGY PRIORITY: c2's breathing > his eyelids > his hand > his gaze. His breathing stays
slow and even; he blinks once after the line; his right hand stays on the glass; his eyes
move before his head does. At most two changes land inside any single second.

LIGHT AND ATMOSPHERE: The key moonlight enters from N2 on the east wall, so at the start it
comes from the far side and rims c1's shoulder; as the camera arcs toward K7, the key swings
to frame-right on c2's face. The fireplace at N5 adds a warm 2000K edge on his right cheek.
The background stays in deep blue-grey shadow; highlights held just below clipping.

CONSISTENCY LOCK: c1 stays seated at P4 for the whole take, even after she leaves the frame;
c2's right hip stays on the desk edge and the glass stays in his right hand; c3 stays in the
armchair; c4 stays at the window; exactly four people are in the room and no one enters or
leaves; the camera stays on the south side of the c2-c1 axis for the whole move.

overall_soundscape: A quiet drawing-room tone with a clock ticking, the soft friction of
c1's dress as the camera passes her, c2's calm breathing, the click of the glass touching
the desk, and the room's low air tone after the line.

non_diegetic_music: N/A
```

**这个例子里最该照抄的五处**：

1. `c1 in the near foreground at 0.00s ... by 3.00s c1 has left the frame`（TIMELINE）——入画人数变化写成了**时间事件**，不是模糊的"镜头推进"。
2. `The move stays on the south side of the c2-c1 axis for the whole arc`——机位移交不跨轴。
3. `Exactly four people are in the room; no one else enters` + 每个人的节点——人数锁和拓扑锁同时成立。
4. `c3's hand stops ... c4's eyes shift ...`——群像反应各有各的方向，不是所有人一起后退。
5. `c1 stays seated at P4 for the whole take, even after she leaves the frame`——出画不等于离场，这是群像里最容易被模型误读的一处。

### 4.6 文本预算

| 任务 | 建议英文词数 | 超了先砍什么 |
|---|---|---|
| 10 秒，1–2 人 | 250–400 | 砍形容词、砍重复的身份描述 |
| 10 秒，3–4 人 | 350–500 | 砍次要角色的服装细节，保留节点和人数 |
| 10 秒，5 人以上 | 拆镜，不要硬写 | 改为"建立镜 + 局部镜" |

三层各自的预算：

- L1 节点表：≤ 60 词，逐字复用，不逐单元扩写。
- L2 映射：每个角色 ≤ 30 词，只写身份 + 槽位 + 承重/道具。
- L3 投影：≤ 80 词，只写机位、景深、前景、帧内人数。
- `TIMELINE`：120–180 词，一拍一件事。
- 一致性锁：≤ 60 词，只写惯性、人数、轴线、身份。

**超预算时先砍形容词，永远不砍四检。**

---

## 五、正反打轴线：整场只算一次

### 5.1 几何关系：视线永远朝向前景肩

一条对话轴把空间分成两侧。过肩镜头的几何只有一条铁律：

> **焦点人物看向前景肩所在的那一侧。**
> 肩在画面左缘 → 焦点人物看画面左下；肩在右缘 → 焦点人物看画面右下。

这条规则同时保证了"两个人在看着对方"和"反打的视线相反"。具体用左还是右，是开场时的机位选择；一旦定下，整场沿用（手性锁）。

| 镜头 | 前景肩 | 焦点人物 | 视线方向 |
|---|---|---|---|
| **A 机**（过 c2 的肩看 c1） | c2 的肩在**左**缘虚化 | c1 居中偏右 | c1 看向**画面左下**（朝着 c2 的肩） |
| **B 机**（过 c1 的肩看 c2） | c1 的肩在**右**缘虚化 | c2 居中偏左 | c2 看向**画面右下**（朝着 c1 的肩） |

两条视线必须**相反**。都朝同一侧 → 空间塌。

### 5.2 视线写绝对方向，不写"看着对方"

- 合法：`her eyes stay toward the lower-left side of the frame, where c2's shoulder is`
- 不合法：`she looks at him`（模型不知道"him"在画面哪边）
- 变化：`at 5.60s her eyes slide a few degrees toward frame-left without her head moving`
- 头部是否跟随单独写：`her head stays still` / `her chin turns with the eyes`

### 5.3 单人与双人的区别

| 情况 | 要锁什么 | 怎么写 |
|---|---|---|
| 单人镜 | 视线方向 + 画外人所在侧 | `She stays on the right of the frame, looking toward frame-left, off screen; the other person is off frame left.` |
| 双人同框 | 两人的屏幕侧 + 两条相反视线 | `c1 is locked to the left third, facing frame-right; c2 is locked to the right third, facing frame-left; their gazes meet across the centre line.` |
| 过肩 | 前景肩侧 + 焦点人物侧 + 焦点视线 | 见 5.1 表 |
| 反打 | 上一行的反行 | `the reverse of the same axis` |

### 5.4 一组正反打是四个片段

| 片段 | 功能 | 镜头 | 轴线状态 |
|---|---|---|---|
| **C1** | 建立关系 | 双人中景 / 缓慢推近 | 建立轴，观众第一次知道两人怎么站 |
| **C2** | 正打（甲 → 乙） | 过甲的肩，焦点乙 | 守 A 行 |
| **C3** | 反打（乙 → 甲） | 过乙的肩，焦点甲 | 守 B 行 |
| **C4** | 收束 | 单人特写 / 侧角 | 回到 A 或 B 的同一侧，不发明第三侧 |

四个片段单独生成时，L1/L2 逐字复用；只有 L3 变。

### 5.5 反打的四个穿帮点

| 穿帮 | 机制 | 修法 |
|---|---|---|
| **两个人看同一侧** | 只写了"看着对方"，没写绝对方向；或两镜都用了同一行轴线 | 每镜从轴线表取行；视线写 frame-left/right |
| **肩侧和视线不同侧** | 前景肩在左，焦点人物却看右；观众觉得他没看她 | 肩侧 = 视线侧；用 5.1 表 |
| **反打背景变了** | B 镜的背景墙没有环境卡，模型即兴生成 | 补反方向环境卡，或让背景保持近景虚化 |
| **光从另一边来** | 把 A 镜的"from frame-left"抄到 B 镜 | 光位存世界方向，每镜重新投影 |

### 5.6 换侧必须靠切

- 在一个镜头里从 A 侧漂移到 B 侧，观众会觉得房间转了 180°。
- 换侧 = 一次硬切；切完在 `subject_definitions` 里写新的轴线行，并在 `summary` 里写 `the reverse of the same axis`。
- 不要用"平滑运镜"跨轴——那是 5.1 里最贵的错误。

---

## 六、机位移交：多人场景不靠切，靠走位

### 6.1 它解决什么问题

多人场景里每切一次，就是一次独立的空间重建：人物可能少一个、多一个、换边。机位移交用**一次连续生成**里的镜头移动，把"建立关系"和"推到某个人"合成一条，减少切点，也减少重建次数。

资源里的写法是：镜头从 c1 的肩侧平稳移交给 c2，并靠近。落地到 H3，有两种常见形态：**过肩推进**（起幅在 A 的肩后，沿轴向前推，落幅在 B 的近景）和**沿轴弧线移交**（起幅在 A 的肩后，沿轴的一侧弧线移动到 B 的正/侧前方，落幅在 B）。两种都成立；关键是起幅有人物在前景、落幅在 B、路径不跨轴。

### 6.2 四条硬规则

1. **交接发生在没人说话的拍。** 台词窗口内镜头必须已经停稳；让镜头在 3.00s 停稳，3.00s 才开口。
2. **始终在轴的同一边。** 可以沿轴向前推，也可以沿轴的一侧做弧线；不能跨轴。要换到另一边，切。
3. **高度或焦段只变一个。** 推荐"低机位升到胸高 + 推/弧线"这一种物理连续的组合；不要同时叠加推、摇、绕三种互不相干的变化。弧线是位移加转向的连续运动，算一种。
4. **人数逐段写死。** 起幅几人、落幅几人、谁出画、谁一直在画外；出画不等于离场。

### 6.3 写法

- **`TIMELINE` 写移动的时间段和路径**：
  `1.20-3.00s: the camera rises to chest height and arcs along the south side of the room to K7, staying on the south side of the c2-c1 axis; by 3.00s it settles on c2, c1 has left the frame, and c2 is sharp in the centre.`
- **`CAMERA` 写不随时间变的属性**：起始 K#、结束 K#、焦段恒定、无切、稳定。
- **不要**在 `CAMERA` 里写一个与 `TIMELINE` 矛盾的静态景别；也不要一边写固定机位，一边保留参考视频的 `camera path`。

### 6.4 群像的两种排法

| 排法 | 适用 | 做法 |
|---|---|---|
| **一镜移交**（推荐 ≤4 人） | 人物动作简单、台词短、空间开阔 | 一个 10 秒单元，从 A 肩后推到/弧线移到 B；其他人固定在节点上做反应 |
| **建立镜 + 局部镜**（>4 人或动作复杂） | 六人以上、走位复杂 | 先用一个群像建立镜交代所有节点（无台词或一句短台词），再切 2–3 人的局部镜；局部镜复用账本，不重新理解空间 |

> 资源里的六人群像示例是"演示级"配置：6 张身份素材 + 场景 + 光效参考，已经接近槽位上限。生产里 4 人是稳定上限；超过 4 人，优先用"建立镜 + 局部镜"，不要把所有人和所有动作塞进一次生成。

### 6.5 机位移交的失败模式

| 症状 | 病因 | 修法 |
|---|---|---|
| 口型后半段漂 | 移交还没停稳就开口 | 把台词窗口后移；交接提前 0.4s 完成 |
| 移交中人物换边 | 路径跨了轴 | 路径锁在轴的一侧；换边改切 |
| 移交后少一个人 | 起幅/落幅人数没写 | 两段都写帧内人数；出画的人写"仍在 P#，只是出画" |
| 背景在移交中变了 | 路径经过了未覆盖的墙 | K# 只在覆盖弧内；补环境卡 |
| 移交像环绕 | 同时写了推 + 绕 + 摇 | 只保留一个主运镜；交接用推 + 升 |

---

## 七、双轨锚定：图管状态，字管关系

### 7.1 分工表

| 轨道 | 负责 | 不负责 |
|---|---|---|
| **成片锚点（图）** | 可见状态：姿态、手、眼、光斑、衣褶、道具位置 | 房间拓扑、轴线、画外、人数计划 |
| **文字账本** | 拓扑、轴线、人数、画外、运动边界、身份映射、光的世界方向 | 精确的瞬时姿态与表情 |
| **本镜文字（L3）** | 屏幕投影、景别、帧内人数、朝向变化、台词 | 重新定义房间或身份 |

### 7.2 冲突规则

> **状态以成片为准，拓扑以账本为准。**

- 成片里她的手在左肩、杯子在右手 → 更新交接块，不改账本。
- 成片里她坐在 P4，但账本说她应该在 P3 → 要么她真的移动了（更新段落），要么上一单元拍错了（以成片为准修正账本）。
- 成片里的画面左右与账本的轴线不一致 → 成片只是一个机位的投影；下一镜的轴线仍按账本，不要照抄画面。

### 7.3 读图只读状态，不读坐标

**这是整份文件最重要的一条操作纪律。**

成片是**投影**，不是**地图**。画面左右是摄影机坐标；把它抄进账本，下一镜就会把机位当成房间。

读图七项（7.1）照旧，但位置一项要做翻译：

| 从画面读到 | 不要写成 | 要写成 |
|---|---|---|
| 她在画面右三分之一 | "她在右边" | "她在 P4（沙发左端），坐姿，面向 N3"（结合上一单元账本与机位） |
| 他在画面左下前景 | "他在左下" | "c2 在 P2，桌沿前；本镜作为前景肩" |
| 月光从画面左侧来 | "光从左来" | "光从 N2（东墙）来；本镜投影在画面左侧" |
| 看不出她在哪个节点 | "大概在窗边" | "位置待确认；下一镜固定为 P5" |

读图时**允许写"待确认"**，不允许猜。猜出来的坐标会变成下一单元的错误事实。

### 7.4 参考图的声明句

| 素材 | 声明 |
|---|---|
| 上一单元成片 | `supplies the current visible state only — pose, hands, gaze, light falloff, wardrobe — and copy zero of its framing and zero of its camera position` |
| 站位图 / 俯视图 | `supplies the top-down x/y layout of the furniture nodes and standing positions only; copy zero of its lighting, materials, rendering style and camera angle` |
| 环境卡 | `copy zero of its camera angle`（现有规则） |
| 身份卡 | 中性；只锁身份，不锁构图 |

**站位图不是环境卡**：环境卡管"看起来是什么样"，站位图管"平面关系"。两者同时存在时，拓扑归站位图，外观归环境卡；不要让它俩同时定义同一件事。**没有站位图时，不需要这条声明**；用场景图按 3.1b 读节点表即可。

---

## 八、失败模式与错误路由

### 8.1 路由表：错误出现在哪，就回到哪一层

| 症状 | 先回哪一层 | 查什么 | 不要做什么 |
|---|---|---|---|
| **第一帧就错位** | L1+L2 | 节点表是否逐字复用；c# 映射是否一行；槽位是否和账本一致 | 不要先改措辞；不要加更多位置形容词 |
| **镜头一移动就乱** | L3 | 机位路线是否只在 K# 之间；移动是否写进时间码；是否越过门/墙 | 不要用"平滑运镜"掩盖空间跳变 |
| **只有对视方向不成立** | L3 轴线 | 视线是否绝对方向；肩侧与视线是否同侧；A/B 是否相反 | 不要写"看着对方"就完事 |
| **人物随机刷新** | L2+L3 | 画外身份卡；帧内计数；身份映射；入画人数 | 不要靠加长描述压人 |
| **房间变了 / 长出家具** | L1 覆盖 | 是否朝未覆盖的墙拍；是否补了反方向环境卡 | 不要在正文里即兴描述未见墙面 |
| **人物瞬移** | L3/L1 | 位移有没有起止节点；是否穿门没换段 | 不要在同一段里跨门 |
| **反打左右翻转** | L3 轴线 | 是否用了轴线表的同一行给两个方向；手性是否被改 | 不要每镜重新判断左右 |
| **反打后光从另一边来** | L3 光位 | 是否把上一镜的"from frame-left"抄过来了；按世界光向重新投影 | 不要改世界光向 |
| **越写越乱** | 全部 | 同一事实出现几次；三个坐标系是否混写；文本预算 | 不要加细节，先删重复 |

### 8.2 生成前四检

```text
[ ] 身份：每个 c# 的图 / <Subject N> / 说话人 ID 与账本一致
[ ] 拓扑：每个人在哪个 P#；要动的，起止 P# 写清；没有穿门不换段
[ ] 人数：房间总人数 / 帧内人数 / 画外名单；画外的人没传卡
[ ] 轴线：机位在轴的哪一侧；前景肩在哪；视线朝哪；与上一镜连续还是相反
```

### 8.3 生成后四检

```text
[ ] 第一帧：人物的节点和上一单元落幅是否对得上
[ ] 移动后：有没有人少/多/换边；相机有没有经过未覆盖的墙
[ ] 对视：两个人的视线是否朝相反侧，且各自朝向前景肩
[ ] 光位：反打后主光的画面侧是否按世界方向重新投影
```

### 8.4 重试纪律

- **先换种子**处理随机方差（现有规则）。
- 如果错误是**系统性的**（拓扑、轴线、人数），换种子不会修；按 8.1 的路由回到对应层，只改一个变量。
- 同一层失败两次，不要再盲试第三次；向用户提简化方案（拆镜、减人、换覆盖弧）。

---

## 九、检查清单（空间专项）

```text
[ ] 账本已建：覆盖/假设、坐标约定、N#、P#、K#、c#、轴线、光位
[ ] L1 与上一单元逐字一致，没有同义改写
[ ] c# 映射一行一个，图/Subject/说话人 ID 一致
[ ] 四检通过：身份 / 拓扑 / 人数 / 轴线
[ ] 屏幕左右只在 subject_definitions 里定义一次；retention 如引用，值不变；POSE/CAMERA 不复述
[ ] 帧内人数写死；画外角色没有传身份卡
[ ] 正反打：肩侧与视线同侧；A/B 相反；手性与开场一致
[ ] 光位按世界方向存，按本镜投影；反打后没有抄上一镜的画面侧
[ ] 移动写了起止 P#；穿门/换空间用了新 L1
[ ] 机位移交不跨轴；台词窗口内镜头已停稳
[ ] 没有朝未覆盖的墙拍；反打有对应环境卡
[ ] 文本预算内；同一事实没有用两种说法出现
```

---

## 十、和现有章节怎么配合

| 现有章节 | 怎么配合 |
|---|---|
| **2.2 参考图六类角色** | 站位图是**可选**加速器；没有俯视图时用场景图读节点表（3.1b）；环境卡管外观，站位图管拓扑 |
| **2.3 成片锚点排除构图** | 不变；再补一句"成片是投影，不是地图" |
| **3.2 七段骨架** | `POSE AND STAGING` 内部按 `World:` / `Slots:` / `Shot:` 三句写 |
| **5.1 相邻不同构图** | K# 可复用，但相邻单元不能同 K + 同景别 + 同主体位置 |
| **5.3 正反打** | 轴线表 + 肩侧=视线侧 + 手性锁 |
| **5.4 场景图是拍摄弧里的三维地图** | 补"环境卡是拍摄弧，不是 360°" |
| **5.8 机位移交** | 群像的一镜方案；不替代单元间的构图差异 |
| **7 开工流程** | 第 0 步改为"更新空间账本 + 交接块"；新增第 0.5 步四检 |
| **8 失败模式** | 新增随机刷新、反打翻转、房间变化、瞬移、越写越乱 |
| **重型版 `shot-intake.md` 状态卡** | 账本替代其中的"空间"半张卡；物件/服装/光/上一帧仍保留在交接块 |

> **权威性说明**：空间控场这一主题是本技能新增的内容，重型版 `h3-scene-prompt-director` 尚未收录完整版。本文件是它的权威来源；若与重型版的其他章节有冲突，空间部分以本文件为准，其余仍以重型版为准。
