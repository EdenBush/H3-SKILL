# 表演增强：微表情锚定词与部位顺序（成片案例版）

**这份文件的定位**：`SKILL.md` 第 4.1b 节的完整版。结论在 SKILL.md，这里给逐条拆解、完整提示词和词库。

**素材来源**：一套 15 秒全片直出的展示案例（编号 1–4、6，无 5），作者标注 AI-PanSir。这些是展示样片与配套提示词，不是对照实验——把两招当作"有成功案例支撑的导演规则"，不是已证实的因果。

**改写说明**：提示词按本技能输出规范做了两处统一——① 源教程在 `<d>` 内使用 `<pause>`，H3 规范只定义 `<d>`、语言标签和说话人编号，这里统一改写为正文停顿、拆句或时间码；② 复合锚定词按 `h3-director/references/acting-performance.md` 的拼写对齐（源案例中的 `breaking restrained`、`disbelieving relieved`、`desperate pleading` 为压缩写法，效果等同）。

---

## 一、问题：为什么只写情绪词会演砸

同一句"我等你"，两个版本：

```text
A（只写情绪标签）
The camera cuts to a close-up of the wife. She listens silently, looks at him, and
answers with quiet sadness: <d>[Chinese] 我等你。</d>

B（锚定词 + 部位顺序 + 停顿 + 尾帧）
At 00:06.500, the camera cuts to a close-up of the wife. She holds his gaze, looks
down briefly, lets her lips part and closes them again. After a short hesitation,
she says: <d>[Chinese] 我等你。</d> Her eyes remain on him after the line.
```

| 版本 | 给了什么 | 还缺什么 | 结果 |
|---|---|---|---|
| A | 情绪类别（sad） | 幅度、部位、顺序、收尾 | "quiet sadness" 可以是面无表情，也可以是泪流满面——全靠采样运气 |
| A + 锚定词 | + 幅度（micro） | 部位顺序、动作与台词的先后 | 有微表情，但顺序随机，可能说完就"断电" |
| B | + 五拍顺序 + 正文停顿 + 尾帧 | — | 每一帧可拍，切点上不泄气 |

**核心判断**：情绪词回答"是哪一类情绪"，不回答"多大、用哪里、怎么收"。后三个问题必须由锚定词和部位顺序分别回答。

---

## 二、第一招：`micro expressions` 锚定词

### 2.1 语法与位置

```text
with + <情绪形容词> + micro expressions + :
```

紧跟情绪词之后，后面可以直接接 `<d>` 台词，也可以接一句部位动作：

```text
with sad micro expressions:
with restrained polite micro expressions: <d>[English] ...</d>
reacts with hollow and numb micro expressions, blinking slowly, lips parting silently.
```

锚定词不要求在句尾，跟在情绪词后面即可。

### 2.2 它做什么、不做什么

| 做了 | 没做 |
|---|---|
| 把幅度锁进"眼底、面部肌肉、嘴角的微小变化" | 不指定哪个部位先动、动多大 |
| 让 `furious`、`heartbroken` 这类强词可以安全使用，不五官齐飞 | 不替代部位拆解——只写锚定词不写部位动作，仍有面瘫风险 |
| 给模型一个明确的"内敛演法"边界 | 不管动作与台词的先后顺序 |

**它是一层幅度声明，不是省事的替代品。** 成片里有效的配方是两层叠加：

```text
第一层  情绪词 + micro expressions        → 定幅度
第二层  部位 + 方向 + 幅度 + 回收 + 顺序   → 定演法
```

### 2.3 和"负面提示词失效"的关系

想表达"别哭太狠"，写 `no big crying` 不会压制概念（见 SKILL.md 1.5）。`sad micro expressions` 是它的正向写法：**用幅度锚定代替否定句**。这是第一招在机制上的合法性来源。

### 2.4 什么时候不该用

- **远景 / 全景**：脸读不到，锚定词浪费一次注意力预算，把表演交给身体调度。
- **大动作喜剧**：需要外显肢体，全局 micro 会让画面发闷。正确做法是**外显给身体、脸仍然 micro**——案例 4 的怒吼就是：`Chen shouts with furious and heartbroken micro expressions`。
- **纯氛围空镜**：没有脸可演，用生理事件和呼吸即可。

### 2.5 单条与复合：14 个成片组合

单个情绪词 + micro 就够用的场景：淡淡的悲伤、压抑的挫败、微妙俏皮。

需要**两层情绪**时，用 `and` / `yet` 把两个形容词连起来，再接 `micro expressions`。完整词库见本文第五节。

写作启发：**前一层常是壳，后一层是漏出来的东西**——`guarded yet aching`（表面若无其事，底下发酸）、`breaking but restrained`（克制正在碎）。不是模型规则，但按这个顺序写，脸部层次更容易读。

---

## 三、第二招：部位 + 方向 + 幅度 + 回收 + 顺序

### 3.1 四问：写完锚定词立刻回答

```text
动的是眼睛还是嘴？→ 往哪里动？→ 幅度多大？→ 最后收不收得回来？
```

对应到可验证的写法：

| 问题 | 空泛写法 | 可拍摄写法 |
|---|---|---|
| 哪个部位 | "她很伤心" | `her eyes`, `her lips`, `her jaw`, `her lower eyelids` |
| 往哪动 | "她低下头" | `looks down briefly` / `her eyes slide a few degrees to the left` |
| 幅度 | "微微" | `briefly` / `a few degrees` / `one corner of her mouth` / `half-smile` |
| 回收 | —— | `closes them again` / `then relaxes` / `then softens` / `eyes remain on him` |

**"回收"是最常漏的一项。** 只写"她张嘴想说"不写"又闭上"，模型会让她一直张着嘴；写上 `lets her lips part and closes them again`，"欲言又止"才成立。

### 3.2 三种动作—台词时序

| 时序 | 写法 | 适用 | 案例 |
|---|---|---|---|
| **先动后说** | 部位动作铺完，再接 `<d>` | 压着情绪说短台词 | 城门 B、案例 1、案例 4、案例 6 |
| **说中带停** | 台词拆成两个 `<d>`，中间插一个呼吸动作 | 话到嘴边停一拍 | 案例 3 `Be with me?` |
| **说完再动** | 台词落完才崩 / 才眨眼 / 才笑开 | 反转、破防、余味 | 案例 1 说完后单侧嘴角的礼貌微扬又收回 |

**停顿不进标签。** H3 的输出规范只定义 `<d>`、语言标签和说话人编号；`<pause>` 是教程写法，不属于规范。三种合规落法：

```text
句前停顿：After a short hesitation, she says: <d>[Chinese] 我等你。</d>
句中停顿：<d>[English] Hey... I don't want tonight to end.</d> He takes a short breath,
        then: <d>[English] Be with me?</d>
时间码： 0.00-1.60s 停在情绪里，1.60s 才开口
```

### 3.3 四拍 + 尾帧模板（"压着情绪说一句"）

```text
1  稳视线      She holds his gaze,                          （眼睛，先把观众接住）
2  半拍转折    looks down briefly,                          （眼/颈，只半拍，幅度要小）
3  欲言又止    lets her lips part and closes them again.    （嘴，动完必须收回）
4  犹豫 + 台词 After a short hesitation, she says:
               <d>[Chinese] 我等你。</d>                    （停顿写进正文）
5  尾帧停留    Her eyes remain on him after the line.       （不泄气，停在情绪里）
```

这五拍适合所有"压着情绪说一句短台词"的近景。把第 2 拍的"低头"换成"垂眼 / 转头 / 抿唇 / 吞咽"，即可复用到别的情绪。

**尾帧那一句不要省。** 台词说完脸就回到中性，是最常见的廉价感来源——观众会看到"演完了"。让它停在最后一个动作上。

### 3.4 身体锁、脸微动

案例 2 和案例 4 的共同写法：**情绪最强的时刻，身体反而不动。**

```text
Close-up of Daniel with shocked and conflicted micro expressions, keeping his gun steady.
Lin reacts with hollow and numb micro expressions, blinking slowly, lips parting silently.
```

- 持枪、抓住衣领、坐着不动——把身体动作锁死
- 只让眼底、下眼睑、嘴唇这几处动
- 外显幅度全部让给"锁定感"本身

这比"全身一起演"可信得多，也是 micro expressions 锚定词最大的价值：**允许你写强情绪词，而画面保持克制。**

---

## 四、五条成片案例（每条 15 秒，多镜直出）

### 4.1 案例 1｜播客专访：克制隐忍

**情绪弧线**：礼貌得体 → 被追问 → 强忍 → 轻声承认。

```text
[Shot 1] The guest holds the coffee cup... [Shot 2 02.8s] Medium close-up: she lowers her
eyes, presses her lips together, with restrained polite micro expressions: <d>[English]
I thought I had already made peace with it.</d> Her jaw tightens, one corner of her mouth
almost forms a polite smile and then relaxes. [Shot 3 05.4s] Host asks: <d>[English] But
you still remember every detail?</d> [Shot 4–5 08.2–15.0s] Close-up: eyes drop, lips part
then close again, swallows once with held-back micro expressions, then says quietly:
<d>[English] Every detail.</d>
```

| 镜 | 锚定词 | 部位顺序 | 台词 |
|---|---|---|---|
| Shot 2 | `restrained polite` | 垂眼 → 抿唇 → 台词 → 下颌收紧 → 单侧嘴角扬起又收回 | "I thought I had already made peace with it." |
| Shot 3 | — | 主持人追问，把焦点交回她 | "But you still remember every detail?" |
| Shot 4–5 | `held-back` | 垂眼 → 唇张又闭 → 吞咽一次 → 轻声说 → 结束 | "Every detail." |

**可抄的三处**：
1. `one corner of her mouth almost forms a polite smile and then relaxes`——礼貌笑只给单侧嘴角，而且必须收回。
2. 被追问后才允许"强忍"出场：情绪按外界触发升级，不是自己演上去的。
3. 最重的台词 "Every detail." 用最轻的音量（`says quietly`）+ 前面一串吞咽和欲言又止铺垫。

### 4.2 案例 2｜夜雨天台：多人物微表情层次

**情绪弧线**：冷压命令 → 转身认出 → 受伤但稳 → 震惊但持枪不动。

```text
[00–04s] Rooftop at night in rain. Daniel raises his weapon in a controlled stance:
<d>[English] Police. Keep your hands where I can see them. Turn around. Slowly.</d>
[06–09s] Eva turns into the cold light with quietly hurt micro expressions:
<d>[English] Eva?</d> <d>[English] You found me.</d> [10–15s] Close-up of Daniel with
shocked and conflicted micro expressions, keeping his gun steady: <d>[English] You're
under arrest.</d> Eva holds calm posture: <d>[English] I know.</d>
```

| 镜 | 角色 | 锚定词 | 关键写法 |
|---|---|---|---|
| 00–04s | Daniel | — | 指挥式短句 + `Slowly.` 建立压迫 |
| 06–09s | Eva | `quietly hurt` | 转身入冷光，两句台词；受伤但不哭 |
| 10–15s | Daniel | `shocked and conflicted` | `keeping his gun steady`——身体锁死 |
| 尾 | Eva | — | `holds calm posture` + `I know.` 收束 |

**可抄的三处**：
1. `quietly hurt`（安静地受伤）比 `sad` 精确：不哭、不闹，眼神受伤，语气压平。
2. 双人各自的"稳"（持枪稳 / 姿态平静）与脸上的微动形成反差，两层信息一帧交付。
3. 最外显的一点只出现一次（Daniel 的震惊），Eva 全程克制。

### 4.3 案例 3｜毕业舞会：含羞到破防

**情绪弧线**：紧张恳求 → 含羞应允 → 不敢信的狂喜。

```text
[Shot 1] Medium two-shot on the dance floor. Leo catches Mia's wrist, then hesitates.
[Shot 2 02.4s] Close-up of Leo with nervous and earnest micro expressions: swallows once,
lips press tight: <d>[English] Hey... I don't want tonight to end.</d> He takes a short
breath, then: <d>[English] Be with me?</d>
[Shot 3 06.8s] Close-up of Mia with shy and touched micro expressions: lashes dip, corner
curls into a trembling half-smile: <d>[English] Yes.</d> [Shot 4 09.6s] Leo breaks into
disbelieving but relieved micro expressions into an embrace. [Shot 5 11.6s] Smooth 360°
spotlights orbit them kissing until final frame.
```

| 镜 | 锚定词 | 部位顺序 | 台词 |
|---|---|---|---|
| Shot 1 | — | 抓手腕 → 犹豫，双人景先建立关系 | — |
| Shot 2 | `nervous and earnest` | 吞咽一次 → 抿紧嘴唇 → 第一句 → 一次短吸气 → 第二句 | "Hey... I don't want tonight to end." / "Be with me?" |
| Shot 3 | `shy and touched` | 睫毛下垂 → 嘴角抖着半笑 → 轻声 | "Yes." |
| Shot 4 | `disbelieving but relieved` | 眉毛瞬间松开 → 笑出 → 前倾拥抱 | — |
| Shot 5 | — | 灯光环绕收尾 | — |

**可抄的三处**：
1. `nervous and earnest` 是两个情绪词的互补组合：紧张（生理）+ 诚恳（态度），不是同义反复。
2. `a trembling half-smile`——半笑是"抖"的，不是稳的；一个字就区分了"真心害羞"和"礼貌微笑"。
3. 把"不敢问出口"写成两段台词之间的一个短吸气——停顿是动作，不是标签。

### 4.4 案例 4｜战后废墟：极强情绪反差

**情绪弧线**：麻木 → 怒吼 → 哀求 → 眼神唤醒。

```text
[Shot 1] Smoky concrete ruins. Chen grabs slumped Lin's dusty collar. [Shot 2 02.3s]
Chen shouts with furious and heartbroken micro expressions: <d>[Chinese] 你在这坐着等死吗？
为什么要放弃？！</d> [Shot 3 06.2s] Lin reacts with hollow and numb micro expressions,
blinking slowly, lips parting silently. [Shot 4 08.8s] Chen's brow breaks with desperate
and pleading micro expressions: <d>[Chinese] 抬头看我！家里还有老婆孩子在等着你呢！</d>
[Shot 5 12.5s] Lin's eyes snap up with shaken and awakening micro expressions, lower
eyelids quivering as his jaw locks.
```

| 镜 | 角色 | 锚定词 | 部位顺序 |
|---|---|---|---|
| Shot 1 | — | — | 冲入、抓住衣领，身体动作大 |
| Shot 2 | Chen | `furious and heartbroken` | 吼叫台词；脸仍 micro，怒不外翻成五官扭曲 |
| Shot 3 | Lin | `hollow and numb` | 慢眨眼 → 嘴唇微张无声（`lips parting silently`） |
| Shot 4 | Chen | `desperate and pleading` | 眉垮 → 嘶哑哀求，点出"老婆孩子" |
| Shot 5 | Lin | `shaken and awakening` | 眼神猛然抬起 → 下眼睑轻颤 → 下颌咬紧 |

**可抄的三处**：
1. 强情绪的两层写法：`furious`（表层）+ `heartbroken`（底层），脸 micro，外显给吼叫和抓衣领。
2. `lips parting silently`——麻木的人不是不动，是"想说什么但没声"。
3. 唤醒拍三层顺序：`eyes snap up` → `lower eyelids quivering` → `jaw locks`，先眼神、再眼睑、最后下颌，顺序反了就像演。

### 4.5 案例 6｜雨夜车站：假笑崩塌

**情绪弧线**：故作轻松 → 被温柔拆穿 → 假笑垮掉 → 化软。

```text
[Shot 1] Rainy train station canopy at blue dusk. Zhou stops; Lin freezes under the lamp.
[Shot 2 2.5s] Close-up of Lin with guarded yet aching micro expressions, lifting brows
casually: <d>[Chinese] 这么巧，你也在这儿？</d> [Shot 3 06.4s] Zhou smiles with quiet
fond micro expressions: <d>[Chinese] 笨蛋，我等了你一个小时。</d> [Shot 4 10.5s]
Close-up of Lin with breaking but restrained micro expressions: fake smile collapses, eyelid
quivers, then softens; after a short hesitation, she says: <d>[Chinese] 下次不许等这么久。</d>
```

| 镜 | 角色 | 锚定词 | 部位顺序 | 台词 |
|---|---|---|---|---|
| Shot 2 | Lin | `guarded yet aching` | 扬眉故作轻松 → 台词 | "这么巧，你也在这儿？" |
| Shot 3 | Zhou | `quiet fond` | 轻柔一笑 → 台词，直接击穿防线 | "笨蛋，我等了你一个小时。" |
| Shot 4 | Lin | `breaking but restrained` | 假笑垮掉 → 眼睑轻颤 → 化软 → 短顿 → 台词 | "下次不许等这么久。" |

**可抄的三处**：
1. 崩塌写成三段：`fake smile collapses` → `eyelid quivers` → `then softens`——先垮、再颤、最后软，缺一段都像演的。
2. `guarded yet aching` 里"壳"和"暗流"各占一个词，观众从第一句台词就看见防备，也看见防备底下的酸。
3. 台词前留一个短顿（`after a short hesitation`），让崩塌先落地，再开口——顺序颠倒，台词会压住表情。

---

## 五、复合情绪词库（14 条成片组合）

| 组合 | 中文 | 来源 | 用法要点 |
|---|---|---|---|
| `guarded yet aching` | 故作若无其事，底下发酸 | 车站 | 前壳后暗流；配一个"故作轻松"的动作 |
| `quiet fond` | 安静温柔 | 车站 | 眼神软、声音轻；用来拆对方防线 |
| `breaking but restrained` | 克制正在崩塌 | 车站 | 后面必须接 collapse → quiver → soften |
| `restrained polite` | 克制礼貌 | 播客 | 单侧嘴角，扬了又收 |
| `held-back` | 强忍 | 播客 | 吞咽、唇张又闭、音量压到最低 |
| `quietly hurt` | 安静受伤 | 天台 | 不哭、不闹，眼神受伤 |
| `shocked and conflicted` | 震惊且挣扎 | 天台 | 身体锁住，只让眼底动 |
| `nervous and earnest` | 紧张又诚恳 | 舞会 | 生理紧张 + 态度诚恳，非同义反复 |
| `shy and touched` | 害羞又被打动 | 舞会 | 睫毛下垂、半笑发抖 |
| `disbelieving but relieved` | 不敢信的释然 | 舞会 | 眉先松、笑后到 |
| `hollow and numb` | 空洞麻木 | 废墟 | 慢眨、唇张无声、视线涣散 |
| `furious and heartbroken` | 暴怒又心碎 | 废墟 | 吼叫，但脸 micro |
| `desperate and pleading` | 绝望哀求 | 废墟 | 眉垮、声音嘶哑 |
| `shaken and awakening` | 震动后觉醒 | 废墟 | 下眼睑颤、瞳孔回焦、下颌咬紧 |

**拼词规则**：
- 两个形容词必须互补，不要同义堆叠（`sad and sorrowful` 是浪费）
- 前一层放"外壳 / 表层状态"，后一层放"暗流 / 真实状态"
- 写完后必须跟 1–2 个部位动作；只有复合词、没有部位，等于给了情绪没给演法
- 拼写与 `h3-director/references/acting-performance.md` 的 14 条词库对齐；源案例中的压缩写法（`breaking restrained` 等）效果等同

---

## 六、情绪弧线的五种分层模式

每条 15 秒里的多镜表演，情绪不是一次性给完，而是**每镜走一格**。成片里出现过的五种：

| 模式 | 四格弧线 | 适合 | 来源 |
|---|---|---|---|
| **假笑层叠型** | 装作没事 → 被温柔戳穿 → 崩塌 → 化软 | 双向暗恋、久别重逢 | 车站 |
| **压迫-身份型** | 冷命令 → 转身认出 → 受伤但稳 → 震惊但身体不动 | 警匪对峙、亲人对立 | 天台 |
| **告白三段型** | 紧张恳求 → 含羞应允 → 不敢信的狂喜 | 甜宠、青春 | 舞会 |
| **刺激-唤醒型** | 麻木 → 怒吼 → 哀求 → 眼神回焦 | 战损、绝境、劝生 | 废墟 |
| **克制隐忍型** | 礼貌得体 → 被追问 → 强忍 → 轻声承认 | 访谈、旧事重提 | 播客 |

三条共同纪律：
1. **每镜只走一格**——两镜之间是"被对方的话/动作触发"，不是自己升级。
2. **最外显的一点放倒数第二镜**，末镜收（案例 2 的震惊、案例 4 的醒来）。
3. **末镜靠身体状态收尾**（拥抱、眼神停留、姿态不动），不靠再加一句台词。

---

## 七、表演专项失败模式

| 症状 | 病因 | 修法 |
|---|---|---|
| **演得平、没有层次** | 只有情绪词 | 加 `micro expressions` 锚定 + 四拍顺序 |
| **五官齐飞、过火** | 没有幅度约束 | 锚定词收幅度 + 身体锁住 + 全场只留一个外显点 |
| **微表情变成面瘫** | 有锚定词、没有部位动作 | 至少给 1–2 个可见部位 + 一个触发点 |
| **表情被台词吃掉** | 动作和台词同一拍 | 动作前置，台词窗口清空，或把台词拆成两段、中间插一个呼吸动作 |
| **说完就"断电"** | 缺尾帧 | `Her eyes remain on him after the line.` 之类的停留句 |
| **假笑像真笑** | 没有崩塌顺序 | `collapses → quivers → softens` 三段写全 |
| **受伤变成委屈** | 用 `sad` 一个词 | 换 `quietly hurt` + 不哭的眼 + 压平的呼吸 |
| **强情绪像舞台剧** | 全身一起演 | 身体锁死（持枪/抓领/坐姿），只让眼底和嘴唇动 |
| **倾听者抢戏** | 没锁身体 | `keeping his gun steady`、`holds calm posture`、前景肩头静止 |
| **反应不对味** | 复合词顺序反了 | 前壳后暗流：`guarded yet aching`，不是 `aching yet guarded` |

---

## 八、接入七段骨架的位置

| 七段 | 放什么 |
|---|---|
| **CHARACTER** | 不写表演，只写身份与服装；锚定词不进这一段 |
| **POSE AND STAGING** | 身体锁定状态（持枪稳、坐姿、抓衣领的手） |
| **TIMELINE** | 四拍顺序 + 正文停顿 + 尾帧，一拍一件事 |
| **CAMERA** | 台词窗口镜头静止；微表情必须近景以内 |
| **PHYSIOLOGY PRIORITY** | 排序：呼吸 → 眼睑 → 嘴角 → 视线；同一秒最多两层变化 |
| **LIGHT AND ATMOSPHERE** | 给眼部一个可读的光：单侧主光 + 眼窝阴影，否则微表情看不见 |
| **CONSISTENCY LOCK** | 尾帧状态（眼神停在谁身上、手停在哪）+ 人数锁 |

**光照是微表情的隐形前提**：眼底、下眼睑、嘴角这些地方，需要在光里有对比才读得到。全平光下再好的微表情也等于没写——主光偏一侧、眼窝留一点阴影，比多加一句形容有用。

---

## 九、检查清单（表演专项）

```text
[ ] 每个有台词或情绪转折的镜头，都有锚定词或等效的幅度声明
[ ] 锚定词后面跟了至少 1–2 个具体部位动作
[ ] 每个部位动作写了方向、幅度，以及"收不收得回来"
[ ] 动作和台词谁先谁后写死了；停顿写在正文、拆句或时间码里，没有使用规范外的标签
[ ] 台词之后有尾帧（视线停留 / 姿态不动），没有说完就回到中性
[ ] 身体在情绪最强处是锁住的，没有全身一起演
[ ] 倾听者的身体和嘴唇都有明确状态
[ ] 复合情绪词是"壳 + 暗流"，不是两个同义词
[ ] 最外显的一点全场只出现一次
```
