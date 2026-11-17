# H3 图片编辑模型的专属约束

这些坑都是从视频版 H3 迁移过来的——同一个底座，同样的脾气。按出现频率排序。

---

## 一、设定图 / 多视图参考

**现象**：给一张三视图或四宫格角色设定图，输出变成三联排站姿，或者把分栏布局一起画进去。

**原因**：模型把整张图当成"一个画面"，而不是"一个人的资料"。

**修法**：三件一起上。

1. 声明里说清这是设定图，只取角色设计：`Image 1 is a four-panel character design sheet: use the character design only`
2. 数量硬约束：`render exactly one single figure`
3. 逐项排除版式：`ignore the panel layout, the face close-up, the profile view, the back view, the grey background and the drop shadow`

第 3 条列得越具体越有效。只写"ignore the layout"压不住。

---

## 二、跨风格（写实参考 → 2D 目标，或反之）

**现象**：动漫脸配真人毛孔，或者写实参考把动漫人物的画风带跑。

**原因**：风格渗透发生在三个层次，压住一层不够。

**修法**：三件套。

| 层 | 做法 | 例 |
|---|---|---|
| 槽位层 | 排除源图的渲染方式 | `ignore its photorealistic rendering and skin texture` |
| 全局层 | 独立一段 STYLE LOCK，放在所有段落之前 | `2D anime illustration throughout — clean ink linework, flat cel-shaded colour, two-tone shadow shapes` |
| 细节层 | 每处皮肤、汗、液体、高光都复述风格 | `smooth cel-shaded skin with a single hard highlight on each curve` |

**最容易被忽略的是液体和透明材质**：写实水花是粒子云，2D 水花是带一条硬高光的平整半透明色块。`flat semi-transparent shape rather than a spray of droplets` 这句往往决定整张图的画风归属。

---

## 三、画面内的文字

**现象**：招牌、标签、界面文字变成无法辨认的乱码。

**修法**：

- 文字放进**单引号**，逐字给出：`reading 'OPEN UNTIL 2AM'`
- 不许写"某个品牌名"、"一行标语"
- 不想要任何文字时，写正向状态：`the surface is plain and unlettered`，而不是 `no text`

产品图上的大标题品牌字吸附力极强，**必须在排除句里点名**：`ignore the brand text at the top, the slogans at the bottom`。

---

## 四、产品平铺图 → 穿在身上

**现象**：内衣、配饰、鞋包从平铺图转成上身时，浮在身体表面、不贴合、或者干脆变成平面贴图。

**原因**：平铺图没有受力信息，模型默认布料与皮肤之间留一层空气。

**修法**：给每件单品写**落点 + 受力 + 形变**。

| 单品 | 落点 | 必须写的形变 |
|---|---|---|
| 胸罩 | 胸肌下方 | 罩杯明显偏小、布料被压平、下沿勒出一条线 |
| 肩带 | 双肩 | 压出浅沟 |
| 颈圈 | 喉部 | 勒出浅痕 |
| 束带 | 胸骨中央 | 被拉得略紧、两侧陷进去 |
| 内裤 | 低腰卡在胯骨上 | 腰边被撑紧、胯部有褶皱 |

再补一句总收束：`Nothing floats and nothing hangs loose.`

---

## 五、性别 / 体型被"修正"

**现象**：男性穿女式内衣，躯干被自动女性化；壮的人被削瘦；圆脸被削成瓜子脸。

**原因**：服装带有强烈的性别/体型先验，模型会反过来改身体去适配服装。

**修法**：**身体必须独立成段**，并把体型特征写成具体形状。

```
His body matches the reference: broad through the shoulders, thick through the chest, a fuller middle, sturdy legs.
```

锁句再补一次：`His body stays masculine and unaltered — no feminisation of his face, shoulders, waist or hips.`

眼镜、发型是最强的双重锚点（既锁身份又锁性别），不要漏。

---

## 六、可数物不锁数量

**现象**：三件内衣变成两件，五个扣子变成四个，手指多一根。

**修法**：所有可数物在锁句里数一遍，并用"恰好"：

```
Exactly two arms, two hands, ten fingers, exactly two legs, two complete feet.
The bra, the panties and the harness stay exactly as described and never merge into one garment.
```

`exactly` 这个词对计数类约束的响应明显强于"正常数量"这类抽象表述。

---

## 七、抽象风格词

**现象**：写 `anime style`、`cinematic`、`high quality`，结果风格飘忽。

**修法**：换成可拍摄的物理描述。

| 别写 | 写成 |
|---|---|
| anime style | `clean ink linework, flat cel-shaded colour, two-tone shadow shapes` |
| cinematic | `one soft key light from the upper left, deep shadow falloff, shallow depth of field` |
| photorealistic | `visible fine skin texture, soft subsurface scattering, natural lens falloff` |
| high quality | 删掉，换成具体的光、材质、细节要求 |

---

## 八、否定式措辞

**现象**：写了 `no text`、`without extra people`，结果文字和多余的人都出现了。

**原因**：没有独立负向分支，否定词只是普通文本。

**修法**：全部改成可见的确定状态。

| 想表达 | 写成 |
|---|---|
| 不要文字 | `the surface is plain and unlettered` |
| 不要多一个人 | `exactly one person in the frame` |
| 不要原服装 | `he wears nothing except '...'` / `his own clothing is absent and only '...' covers him` |
| 不要变形 | `his build matches the reference exactly` |

例外：描述一个**可见的确定状态**时可以用 `without`，比如 `her upper body is bare, without any garment above the waist`——因为这句话能被摄像机验证。

---

## 九、一个复合示例：设定图 + 产品图 + 跨风格

输入：`<Picture 1>` 四宫格男性设定图；`<Picture 2>` 内衣平铺图。
指令：让他只穿这套内衣。

```
Image 1 is a four-panel character reference sheet: use the person's face, hair, glasses, build and body proportions only, render exactly one single figure, and ignore the panel layout, the profile and back views, his black t-shirt, his navy track pants, his white sneakers and the background.
Image 2 is a product photo of a lingerie set: use the garments only, ignore the brand text at the top, the slogans at the bottom and the plain white product background.

The man in <Picture 1> is <Subject 1>.
The pale pink lace bralette, the mint lace panties and the pink elastic harness in <Picture 2> are <Subject 2>.

The target image shows <Subject 1> standing in a white studio wearing <Subject 2> and nothing else.
<Subject 1> is partially preserved; his face, glasses, hairstyle, build and standing pose remain, while his clothing is replaced.
<Subject 2> is partially preserved; the garments' colour, lace trim, bows and metal rings remain, while they are now worn on a male body instead of laid flat.

The harness and bra behave as clothing on a man's body: the shoulder straps press shallow grooves into his shoulders, the bra's underband sits below his pectorals and the cups are visibly small for his chest, the harness straps pull a little tight across his chest and dig in slightly at the sides, the choker presses a shallow line into his throat, and the panties' waistband stretches taut over his hip bones with the lace creasing where his hips are wider than the garment. Nothing floats and nothing hangs loose. ...
```

注意三个细节：

1. `<Subject 2>` 判的是**部分保留**而不是完全保留——因为它从"平铺"变成了"上身"，状态变了。
2. 变化的部分只写受力与形变，不重写"淡粉色蕾丝、蝴蝶结"这些 Part 1 已经记过的外观。
3. 最后一句总收束，直接对应模型最容易犯的那个错。

---

## 十、检查

- [ ] 多视图设定图有没有 `exactly one single figure` + 逐项版式排除？
- [ ] 跨风格的三件套齐了吗？
- [ ] 画面文字是否用单引号逐字给出？产品图的品牌字是否点名排除？
- [ ] 平铺图转上身的每件单品，落点和形变写了吗？
- [ ] 体型/性别是否独立成段并锁死？
- [ ] 可数物是否用 `exactly` 数过？
- [ ] 有没有残留的抽象风格词？
- [ ] 有没有否定式措辞需要改成正向状态？
