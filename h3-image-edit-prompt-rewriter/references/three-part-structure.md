# 三段式：逐句写法与正反例

这份文件把 SKILL.md 里的三段式展开到可执行的粒度。写完一段就对照一次。

---

## Part 1：参考元素定义

### 目的

让模型知道**哪些东西是有身份的**，以及它们在源图的哪儿。没有编号的元素，在后面就没有"保留"的资格。

### 句式

元素在前，来源在后，编号在最后：

```
The woman in a red coat in <Picture 1> is <Subject 1>.
The pale pink lace bralette in <Picture 2> is <Subject 2>.
```

变体（属性、区域、布局都适用）：

```
The colour of the cup's body in <Picture 1> is <Subject 1>.
The camera framing in <Picture 1> is <Subject 2>.
The text block in the upper left of <Picture 2> is <Subject 3>.
```

### 三条硬规则

**一、必须写 `<Picture N>`，并且逐张列名。**
禁止 `the reference images`、`the previous images`、`all inputs`、`these pictures`、`the two images`。

**二、识别信息够唯一即可，不要复述全貌。**
Part 1 是索引，不是图鉴。写完定义后你觉得"再多写点会更准"的地方，那部分属于 Part 3（如果变了）或者根本不用写（如果没变）。

**三、可读文字与数据要逐字转录。**
见 `text-and-data.md`。这条是 Part 1 唯一的例外——文字必须写全，不能"够识别即可"。

### 同一元素跨多图

用同一个编号，并把所有来源图列出来：

```
The woman shown in <Picture 1> and <Picture 3> is <Subject 1>.
```

判定"同一个"的标准是能确信是同一人/同一物，不是"看起来有点像"。

### 不该建的 Subject

- 目标才有的新元素（没有源，就没有编号）
- 被彻底删除且不复用的元素（在 Part 2 概述里提一次即可，然后 Part 3 写那个位置新长了什么）
- 为了"把十五类都凑齐"而硬造的元素

---

## Part 2：目标概述 + 关系声明

### 概述句

固定开头 `The target image`，一句话说清主要的变化结果：

```
The target image shows <Subject 1> standing in a white studio, wearing <Subject 2> in place of his own clothing.
```

它是一句概述，不是第二份细节描述。写完这句就该进关系声明。

### 关系声明

每个 Subject **独立一句**，不允许合并：

```
<Subject 1> is fully preserved.
<Subject 2> is partially preserved; its silhouette and lace trim remain, while its colour changes from mint to deep navy.
```

四种关系与判定见 `relationships.md`。

### 完全保留的句子必须"干净"

```
✓ <Subject 1> is fully preserved.
✗ <Subject 1> is fully preserved, with her dark hair, glasses, and neutral expression unchanged.
✗ <Subject 1> and <Subject 2> are both fully preserved.
```

加了补充说明或合并句子，都会把它从"保留"降级为"重新描述"。

---

## Part 3：只写变更

### 允许写的内容

| 类型 | 例 |
|---|---|
| 源属性变了，写最终外观 | 新的颜色、材质、形状、长度、位置 |
| 新增内容 | 新的背景、新的人物、新的物件、新的文字、新的布局 |
| 物理整合 | 接触、遮挡、投影、反射、光照响应、比例、朝向、透视、解剖、支撑 |
| 被删除区域的正向补全 | 移除某物后，那个位置现在长什么样（写"现在有什么"，不写"没有什么"） |

### 禁止写的内容

- 已判定完全保留的元素的任何外观（只能用裸 `<Subject N>` 当锚点）
- 部分保留元素中"留下的部分"的外观（Part 1 已经记过了）
- 没有变化的背景、光照、画风、画质描述（为了"让段落完整"而加的填充）
- 结构指令、章节名、项目符号、推理过程

### 正例：完全保留 + 新增物件

```
The black horse in <Picture 1> is <Subject 1>. The target image shows <Subject 1> beside a newly added luminous pearl. <Subject 1> is fully preserved. The pearl emits a cool glow onto the ground beside <Subject 1>.
```

最后一句描述了新珍珠和它在地面上的光，`<Subject 1>` 只作为锚点出现，没有任何形容词挂在它身上。

### 反例：把保留内容重写一遍

```
<Subject 1> is fully preserved. <Subject 1> is a muscular black horse with segmented dark armour and a long mane.
```

第二句是 T2I 式的复述，必须删掉。

### 正例：部分保留

```
<Subject 1> is partially preserved; its identity and body armour remain, while its bare head changes to an ornate helmet. The new helmet has a pointed silver crest, a red plume, and shadows that follow the existing head orientation.
```

后面只写新头盔，不再描述脸、身体、护甲。

### 网格/分栏的写法

必须明确行列数，并且标明哪个数字是行：

```
✓ a 2 x 3 (rows x columns) grid
✓ 2 rows and 3 columns
✗ a 2x3 grid
```

格子内容按"从上到下、从左到右"描述，并点名每个变更元素在哪一行哪一列。

不规则排布直接描述实际结构：`the top row has three panels and the bottom row has two`。

---

## 语言与标点

| 项 | 规则 |
|---|---|
| 描述性文字 | 一律英文 |
| 引用的文字内容 | 用单引号包裹，保留原语言与脚本 |
| 用户要求新写的文案 | 用用户指定的语言，同样用单引号 |
| 多行文字 | 按阅读顺序逐个单引号串行写出，用散文说明换行位置，不插入真实换行 |
| 段落 | 一整段，无真实换行 |

单引号还顺带解决了 JSON 转义问题——正文里没有 ASCII 双引号，就不需要 `\"`。

---

## 完成后对照

- [ ] Part 1 是否每个元素都带了 `<Picture N>`？
- [ ] 是否有模糊指代（the images / all inputs）？
- [ ] Part 2 是否以 `The target image` 开头？
- [ ] 每个 Subject 是否恰好一句关系？
- [ ] 完全保留是否是标准短句、无补充、无合并？
- [ ] Part 3 是否有任何一句在重写保留内容？
- [ ] 新增内容是否厚到能照着画？
- [ ] 文字/数据是否逐字写全、未翻译不该翻译的部分？
- [ ] 全文是否一整段、无结构词、无换行？
