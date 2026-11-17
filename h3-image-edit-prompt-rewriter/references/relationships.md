# 四种保留关系：判定树与边界

关系的判定直接决定 Part 3 能写什么。判错一次，整段就废。

---

## 判定树

按顺序问，遇到"是"就停：

```
1. 这个元素整体没变吗？
   （身份、外观、数量、姿态/状态、位置、拓扑、在目标里的角色，全部未变）
   → 是：完全保留

2. 变的只是它的某个属性被搬到了别的地方吗？
   （它自己没动，是它的颜色/材质/风格被复制到另一个载体上）
   → 是：属性转移（并把那个属性单独定义成一个 Subject）

3. 还能认出来是它，但至少一个相关属性变了吗？
   → 是：部分保留

4. 只剩一种笼统的气质/风格/配色逻辑被借用吗？
   → 是：弱引用
```

第 1 步和第 3 步的分界很关键：**任何一个相关属性变了，就不是完全保留**。位置挪了一厘米也算。

---

## 一、完全保留

### 句式

```
<Subject N> is fully preserved.
```

独立成句。不补充、不合并、不解释。

### 什么时候能用

七个维度全部未变：身份、外观、数量、姿态/状态、位置、拓扑、角色。

### 容易误判的三种情况

| 情况 | 判定 |
|---|---|
| 元素没动，但因为换背景而多了一圈新投影 | **部分保留**（投影是它外观的一部分） |
| 元素没动，但被新物件遮住一角 | **部分保留**（遮挡改变了可见外观） |
| 元素没动，整体画幅变了导致它在画面里的占比变了 | 看情况——如果只是画幅裁切、元素本身没被重绘，可以算完全保留；如果为了适配画幅重新构图了，判部分保留 |

第三条要按 Part 2 的概述自己保持一致：如果概述说"整体构图保留、只换了画幅"，那元素可以完全保留；如果概述说"重新构图以适配竖屏"，就不能说完全保留。

### 母不能全留，除非子也没动

一个 Subject 的范围里包含了另一个被修改的 Subject，母 Subject 就不能是"完全保留"。

```
✗ <Subject 1>（整个人）is fully preserved.  ← 但她的衣服 <Subject 2> 换了
✓ <Subject 1> is partially preserved; her identity, pose and everything except the garment remains, while the garment changes to <Subject 2>.
```

---

## 二、部分保留

### 句式

写清两块：**留了什么类别**、**变了什么类别**，并给出具体的"从 A 到 B"。

```
<Subject N> is partially preserved; its identity, pose and hairstyle remain, while its clothing changes from a black t-shirt to <Subject M>.
```

### 写法要求

- 保留部分只点**类别名**，不复述外观（Part 1 已经记过）。
- 变化部分必须具体，能落地的就落到具体：颜色从什么到什么、长度从哪儿到哪儿、位置从哪儿到哪儿。
- 不要罗列清单式地补保留细节。

### 图表/文档/UI 的部分保留

额外要说清**哪些类别留下、哪些改变**：

```
<Subject 3> is partially preserved; the title, axis labels and all existing bar values remain, while the colour of the third series changes from pale blue to deep ochre.
```

---

## 三、属性转移

### 什么时候用

一个源属性被**直接复制**到目标载体上，而源物件本身可能一点都没变。

### 句式

```
<Subject 1> supplies the exact colour transferred to <Subject 2>.
<Subject 2> is partially preserved; its colour changes to match <Subject 1>, while its cut and material remain.
```

### 关键操作：把属性单独定义

不要把一个物件和它的颜色混在同一个 Subject 里：

```
✓ The colour of the cup's body in <Picture 1> is <Subject 1>.     ← 属性独立
✓ The coat in <Picture 2> is <Subject 2>.                          ← 载体独立
```

这样杯子的"完全保留"和颜色的"转移"各有归属，互不干扰。

### 只转移被点名的属性

转移了颜色，就不要顺手把材质、光照、形状也搬过去。这是最容易溢出的地方。

---

## 四、弱引用

### 什么时候用

只借一种笼统的气质、风格、配色逻辑、构图原则，**不要求精确匹配**。

### 句式

```
<Subject 1> serves as a weak palette reference for the new composition; related colours are redistributed among geometric blocks, with freely adapted proportions and placement.
```

必须说清两件事：**借的是什么**、**新设计可以在哪里自由变化**。

### 与属性转移的区别

| 关系 | 要求 |
|---|---|
| 属性转移 | 必须精确匹配，能对齐 |
| 弱引用 | 只要求"同一种感觉"，允许自由改编 |

判定靠**用户怎么用这个参考**，不是靠这个属性叫什么名字。用户说"参考它的配色做一套全新的设计"，就是弱引用；用户说"把裙子改成这个杯子的颜色"，就是属性转移。

---

## 五、多形态 / 多实例

一个 Subject 在目标里出现多次或多种形态（实物、包装图、屏幕显示、线稿），要**整体判定**：

- 全都没变 → 完全保留
- 有的没变、有的变了/新增了 → 部分保留，并在这个 Subject 自己的关系句里把不同用途分开说

```
<Subject 1> is partially preserved; its appearance on the product package is unchanged, while its newly added screen rendering applies the same design in a simplified flat form.
```

不要因为其中一个实例没变就判整体完全保留。

---

## 六、反复检查的三件事

1. **Part 2 的关系和 Part 3 的描述必须一致。** 如果 Part 3 需要描述某个 Subject 的变化，Part 2 就不能判它完全保留。
2. **完全保留的 Subject 在 Part 3 只能以裸 token 出现。** 一旦挂了形容词，这段就废了。
3. **未被提及的源内容默认视为稳定**，但这个默认不能用来压制明确要求的变化。变更范围内的想象要足。
