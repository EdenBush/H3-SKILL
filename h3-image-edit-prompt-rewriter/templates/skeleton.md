# 填空骨架

两个骨架：单人单改（最常用），和多图合成。填的时候先把 `{{}}` 整个替换掉，不要留花括号。

---

## 骨架 A：单人 / 单图编辑

适用：一张图，改一处（换装、换背景、改姿势、加物件、改字）。

```
{{SLOT_DECLARATION}}

The {{ELEMENT}} in <Picture 1> is <Subject 1>.

The target image shows <Subject 1> {{OVERVIEW_CHANGE}}.
<Subject 1> is {{RELATIONSHIP}}.

{{CHANGED_AND_NEW_DETAILS}}
```

### 各槽填法

**`{{SLOT_DECLARATION}}`** — 一两行，说清每张图提供什么、排除什么。

单图且没有版式问题时只写排除：

```
Image 1 is a product photo: use the {{KEEP}} only, ignore {{EXCLUDE}}.
```

多视图设定图必须加 `render exactly one single figure`。

**`{{ELEMENT}}`** — 用可见线索定位，一到三个特征词即可。

- `woman in a red coat`
- `man with thin-framed glasses`
- `pale pink lace bralette`

**`{{OVERVIEW_CHANGE}}`** — 一句话的成品状态，不是动作。

- ✓ `standing in a white studio wearing a navy dress`
- ✗ `having her clothes changed to a navy dress`

**`{{RELATIONSHIP}}`** — 四种之一：

```
fully preserved.
partially preserved; {{RETAINED}} remain, while {{CHANGED}}.
```

**`{{CHANGED_AND_NEW_DETAILS}}`** — 只写变更，2–6 句，要有物理整合（接触、投影、受力、遮挡）。

---

## 骨架 B：多图合成（角色 + 服装 / 角色 + 场景 / 主体 + 风格）

适用：两张以上参考图，各承担不同职责。

```
Image 1 {{ROLE_1}}: use {{TAKE_1}} only, and ignore {{EXCLUDE_1}}.
Image 2 {{ROLE_2}}: use {{TAKE_2}} only, and ignore {{EXCLUDE_2}}.

The {{ELEMENT_1}} in <Picture 1> is <Subject 1>.
The {{ELEMENT_2}} in <Picture 2> is <Subject 2>.

The target image shows <Subject 1> {{OVERVIEW}}.
<Subject 1> is {{RELATIONSHIP_1}}.
<Subject 2> is {{RELATIONSHIP_2}}.

{{CHANGED_AND_NEW_DETAILS}}
```

### 关系怎么填（三种常见组合）

**A. 角色保留 + 服装替换**

```
<Subject 1> is partially preserved; {{identity traits}} remain, while {{his clothing / her outfit}} is replaced.
<Subject 2> is partially preserved; {{garment traits}} remain, while {{they are now worn on the body / the fit changes}}.
```

**B. 角色保留 + 纯风格借用**

```
<Subject 1> is fully preserved.
<Subject 2> serves as a weak {{palette / style / lighting}} reference for the new background; {{what may vary freely}}.
```

**C. 属性转移（把 A 的颜色给 B）**

```
The {{property}} of {{object}} in <Picture 1> is <Subject 1>.
The {{carrier}} in <Picture 2> is <Subject 2>.
<Subject 1> supplies the exact {{property}} transferred to <Subject 2>.
<Subject 2> is partially preserved; {{retained traits}} remain, while its {{property}} changes to match <Subject 1>.
```

---

## 骨架 C：文字改写

适用：图里的字要换、要加、要翻译。

```
The {{ELEMENT}} in <Picture 1> is <Subject 1>.
The text block {{LOCATION}} in <Picture 1> is <Subject 2>, reading '{{ORIGINAL_LINE_1}}' on the first line and '{{ORIGINAL_LINE_2}}' on the second line.

The target image shows <Subject 1> {{OVERVIEW}}.
<Subject 1> is fully preserved.
<Subject 2> is partially preserved; its position, size and colour remain, while its wording changes.

The first line now reads '{{NEW_LINE_1}}' and the second reads '{{NEW_LINE_2}}', set in the same {{FONT_STYLE}} as before.
```

要点：源文字在 Part 1 逐字记下，目标文字在 Part 3 写**完整整行**，不是"把某词改成某词"。

---

## 骨架 D：加物件 / 加角色

适用：在保留的场景里新增一个东西。

```
The {{SCENE_ELEMENT}} in <Picture 1> is <Subject 1>.

The target image shows {{NEW_THING}} in the {{LOCATION}} within <Subject 1>.
<Subject 1> is fully preserved.

{{NEW_THING}} is {{shape, size, material, colour}}, positioned {{position}}, and its {{shadow / reflection / contact}} falls onto {{surface}} beside <Subject 1>.
```

注意最后一句：`<Subject 1>` 只作为裸锚点出现，不许挂任何形容词。

---

## 通用收尾锁（按需加一句）

当数量或边界容易出错时，在末尾补一句：

```
Exactly one {{entity}} in the frame. {{Countable item}} stays exactly as described and never {{failure mode}}.
```

---

## 填完自查

- [ ] 槽位声明里每张图都有独立的"取什么 / 排除什么"？
- [ ] Part 1 每个元素都带 `<Picture N>`？
- [ ] `The target image` 开头那句是成品状态，不是动作？
- [ ] 每个 Subject 恰好一句关系？
- [ ] 完全保留是不是标准短句？
- [ ] 变更细节里有没有重写保留内容？
- [ ] 可数物有没有 `exactly`？
- [ ] 有没有留花括号？
