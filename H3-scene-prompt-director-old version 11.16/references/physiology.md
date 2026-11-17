# 生理动态层：可拍摄的写法

这份文件的唯一标准是**可拍摄性**：每一句都必须是一个摄像机能在某一秒拍到的物理变化。凡是"她感到""气氛变得"这类不可拍摄的表述，全部剔除。

## 为什么生理层是这类提示词的核心

成人向场景的画面本身信息量很低——两个人、一张床、一个固定机位，构图不变。真正让 10 秒有内容的只有两样东西：**身体在时间里的变化**，以及**镜头对变化的选择**。

但模型不会自发地演。你不给时间码，它给你一张几乎静止的图；你给一个笼统的情绪词，它给你一张贴上去的表情。生理层的功能就是**把情绪翻译成有时间坐标的物理事件**。

另一个隐性作用：生理层给模型提供了"每拍该变什么"的明确指令，这样可以有效抑制它在无人指令的地方乱动（乱动手、乱换脸、乱加镜头）。

---

## 六层结构

固定六层，一层不缺。缺层不会报错，但会让整段读起来"少一口气"。

### 第一层：呼吸（底拍）

**为什么它必须是底拍**：呼吸是唯一一个可以持续全程、且幅度可察觉的节律。其他五层都是事件（一次泛红、一滴汗），只有呼吸是连续变量，能当节拍器。

**词库（直接可用）**

```
the ribcage completes its first deep inhale
the belly rises slowly
the upper collarbone line lifts
the sheet sinks slightly under her weight
the ribs recede
the belly drops
the shoulders dropping on each exhale
breathing changes to short shallow pulls
one short sharp gasp cuts in
her breath catching audibly in her throat
a long exhale through the mouth
the inhale halts mid-way
fast and shallow, the nostrils flaring on every breath
one slow breath, then a soft exhale close to the microphone
```

**三条写法规则**

1. **必须有终点。** 呼吸不能是一条平的循环。给它一个明确事件收束：一次卡在半途的吸气、一次急吸、一口长呼气。没有终点的呼吸最后一定变成机械的胸腔缩放。
2. **幅度要可见地变化。** 写成 `从肩膀随呼吸抬起到肩膀落下` 这种可对比的两端，不要只写"呼吸急促"。
3. **衰减型场景里，呼吸是唯一允许保留振幅的层。** 事后戏其他层都在退，呼吸如果一下退到底，人物就死了。让它慢下来但保持深。

**崩坏特征**：胸腔像手风琴一样匀速开合。修法是把吸气和呼气拆成两个时间码，中间插一次打断。

### 第二层：潮红（方向性最强的一层）

潮红是六层里**唯一带方向语义**的层。方向写错，情绪就错。

| 情绪 | 起点 | 扩散路径 | 色阶 | 到达终点时的胸口状态 |
|---|---|---|---|---|
| 情欲上升 | 耳根 | 耳根 → 颈侧 → 锁骨 → 胸口 | 浅粉 → 深玫红 | 胸口是终点，最红 |
| 情欲衰减 | 胸口高处 | 停留后向回收 | 深玫红 → 浅粉 → 退净 | 胸口是起点，最红 |
| 愤怒 | 两颊中心 | 两颊 → 向外到下颌 → 耳尖 | 突然的绯红 | 胸口最淡，几乎无 |
| 羞耻/尴尬 | 两颊 + 耳尖同时 | 向下到颈部 | 迅速涨满 | 中等 |

**词库**

```
flush begins at the ear roots and spreads strictly in order — ear roots, side of the neck, collarbones, chest — shifting from pale pink to deep rose
a faint flush still visible high on her chest and fading
an angry flush blooming from the centre of both cheeks and spreading outward to her jaw and ears
a hot red that spreads to her ear tips
the red now covering her whole face and neck
```

**写法规则**

1. **必须写顺序。** 只写"脸红了"或"皮肤泛红"，模型会当成整体调色，一次铺满全身。
2. **必须写色阶。** `pale pink turning to deep rose` 比 `flushed` 有效一个数量级。
3. **同一个场景里，潮红方向只能有一个。** 如果想写"情欲退去、羞耻上来"，必须用两个独立时间码，并明确写出两个方向在交接（`the chest flush retreating while the face flush arrives`）。这是唯一合法的双向写法，其余情况一律单向。

### 第三层：汗（三阶段）

汗是最容易写废的一层，因为它默认是静止的。必须给三个阶段和一条物理路径。

**三阶段**：成形 → 悬住 → 滑落。少一个阶段，汗就是一粒贴在图层上的白点。

**词库**

```
a bead of sweat forms in the hollow of her sternum and stays there
a single sweat bead forms at the edge of her jaw and hangs without falling
a sweat bead runs down the line of her ribs leaving a wet trace
a thin sheen of sweat appears on the soles
a sheen of sweat across her collarbones and sternum
cooling into a dull sheen
```

**写法规则**

1. 路径要具体到解剖线：`along the line of her ribs`、`down the side of her neck`、`into the hollow of her throat`。写"流下来"没有方向，模型会随机选一条。
2. 只有一个高光点。画面里同时有三四滴汗在反光会显得脏，指定一滴带路径，其余写成"薄光"（`a dull sheen`）不反光。
3. 衰减型场景里汗要"冷掉"：从亮珠变成哑光薄层。这是事后戏最有效的一个细节。

### 第四层：颤动（限定位置 + 限定触发）

**写法规则**

1. **一次只抖一个部位。** 大腿、前臂、手指、肩膀，选一个。全身抖会被读成渲染错误。
2. **必须绑一个触发点。** `at the top of each descent`（每次落到底）、`as she pushes up`、`and dies out`。无触发的持续颤抖是噪音。
3. **有开始就要有结束。** 衰减型场景里，颤动是最先消失的层，写成 `a last tremor runs through ... and dies out`。

**词库**

```
a fine tremor runs through the inner thighs
her thighs visibly trembling at the top of each descent
the tendons standing out on the backs of her hands
her hand trembling with each word she does not yet say
a last tremor runs through the inside of her thighs and dies out
both fists come down onto the mattress once, her whole body bouncing with the impact
```

### 第五层：瞳孔与眼睑（POV 镜头里最便宜的情绪控制器）

**为什么最便宜**：POV 镜头里观众唯一能读的就是她的眼睛。眼神方向一变，整段的语义就变。

**四个可控变量**

| 变量 | 取值 | 语义 |
|---|---|---|
| 眼睑 | 完全睁开 / 半垂 / 紧闭 / 上抬 | 清醒↔沉醉↔痛苦↔轻蔑 |
| 瞳孔 | 放大 / 收缩 | 兴奋↔惊吓/警觉 |
| 泪膜 | 无 / 一层薄膜 / 积水在下眼睑 / 落下一道 | 平静↔湿润↔将哭↔已哭 |
| 视线 | 镜头 / 他处 / 自己的身体 / 失焦 | 主动↔回避↔自省↔放空 |

**词库**

```
pupils dilated, lashes wet with a film of tears
eyelids half lowered
her eyelids drop to half-lidded
her eyes wide open, the pupils contract
gaze unfocused and aimed at the mattress
her eyes drift down along her own body toward her lap
her eyes come into focus looking straight down into the lens
tears gathering along the lower lid without falling
one tear finally cutting a track down her right cheek
her gaze lifts straight into the lens
```

**写法规则**：视线变化必须落在时间码上，而且一次只改一个变量。"抬眼 + 睁大 + 流泪"三个同时来，会被平均成一个模糊的表情。

### 第六层：吞咽（"意识到"的生理签名）

咽喉动作是画面里最小、也最容易被忽略的一个动作，但它恰好对应一个特定的心理事件：**意识到某件事**。在所有反转、错愕、尴尬的场景里，它是性价比最高的一笔。

**词库**

```
one swallow passes through her throat, the tendon in her neck tightening
a faint pulse becomes visible at the carotid
her throat moving in a single hard swallow
her jaw tight, the muscle jumping at the hinge
```

---

## 补充层（按场景需要挂载）

六层之外还有四类，只在特定场景加，不要全塞。

### 体液与湿润光泽

```
a slick sheen catches the light along the shaft and across her knuckles
the wet slick sound becoming audible
a thin sheen of sweat appears on the soles
```

作用：给画面提供唯一的高光变化点，让"发生了什么"不需要明说。

### 织物（区分丝袜/皮肤的唯一可靠手段）

```
scalloped lace tops covering her legs from mid-thigh down
the lace edges rolling slightly upward
the fabric bunches at the knees as her thighs tense
the lace tops pushed slightly askew and creased from earlier
sheer grey pantyhose ... the fabric stretched taut over the spread thighs
```

**关键经验**：只写"穿丝袜"，模型有很高概率画成裸腿加一层黑影。**必须写织物的边缘（lace tops）和织物的形变（bunching / creasing / rolling）**。形变是织物存在的最强证据。

### 头发

```
her hair slides forward off her shoulders and swings into the top of the frame
strands stuck to her damp cheek
her hair flying up and settling
her hair falls across both sides of the frame
```

作用：给静止镜头提供免费的次级运动，也让画面不死。POV 镜头里头发入画还能强化"距离很近"。

### 声音生理

```
her voice cracks on the first word
her breath catching audibly
the last of the sound dissolving into the exhale
a single small giggle close to the microphone
```

作用：音画同步模型里，声音描写会反向影响口型和表情。写破音，它的嘴型就会给一个破音的形态。

---

## 三种弧型的反向写法对照

同一层，在不同弧型里写法完全相反。这张表是本文件最该背下来的部分。

| 层 | 上升型 | 衰减型 | 转向型（愤怒） |
|---|---|---|---|
| 呼吸 | 幅度递增，末尾长呼气 | 频率与幅度双降，但不退到底 | 快而浅，**绝不转深** |
| 潮红 | 耳根→胸，浅粉→深玫红 | 胸口高处→回收，反向褪去 | 两颊中心→颌耳，胸口最淡 |
| 汗 | 成形→悬住→沿肋滑落 | 亮珠冷成哑光薄层 | 一般不加，加了就削弱怒气 |
| 颤动 | 位置固定 + 触发点，幅度递增 | 先于其他层消失 | 手指与肩膀，持续不停且无节奏 |
| 眼 | 瞳孔放大，眼睑渐垂 | 失焦 → 半垂 → 重新聚焦 | 瞳孔收缩，眉毛下压，眼球不转 |
| 吞咽 | 一次，用于"被击中" | 一次，用于"意识到" | 一次，用在开口之前 |
| 收尾动作 | 一次缓慢的转髋/下沉 | 定格 + 一次长呼气 | 扭头、抱臂、别过脸 |

**一句话记忆**：上升型是"叠罗汉"，衰减型是"退潮"，转向型是"换频道"。

---

## 错位编排矩阵（10 秒模板）

这张表是一次完整的错位示范。横向看每一层什么时候进、什么时候退，纵向看任何一秒都不超过两个层在变化。

| 时间 | 呼吸（底拍） | 潮红 | 汗 | 颤动 | 眼 | 吞咽 |
|---|---|---|---|---|---|---|
| 0.0–1.2 | 第一口深吸 | — | — | — | 失焦 | — |
| 1.2–2.4 | 呼气，肩落下 | — | — | — | — | — |
| 2.4–3.6 | 转为短浅 | 耳根起 | — | — | — | 一次吞咽 |
| 3.6–4.8 | — | 走到颈侧 | 下颌处成形 | — | — | — |
| 4.8–6.0 | 一次急吸 | 走到锁骨 | 悬住不落 | 大腿起颤 | — | — |
| 6.0–7.2 | 频率上升 | 走到胸口 | 沿肋滑落 | 大腿持续 | — | — |
| 7.2–8.4 | — | 满至胸口 | — | 前臂起颤 | 聚焦镜头 | 第二次吞咽 |
| 8.4–10.0 | 一口长呼气 | 停留在胸口 | — | 全部停下 | 半垂 | — |

纵向检查：任何一格都没有三个层同时起变化。这是这个矩阵唯一要保证的事。

---

## 反例库：这些话不要写

| 不要写 | 为什么 | 改写为 |
|---|---|---|
| 她很性感 | 不可拍摄 | 锁骨上的汗珠悬住不落，喉咙一次吞咽 |
| 她越来越兴奋 | 不可拍摄 | 呼吸从一次深吸转成短浅连吸，胸口潮红走到锁骨 |
| 气氛暧昧 | 不可拍摄 | 房间只有一盏偏低的暖光，床单褶皱在高光里发白 |
| 她动情地看着他 | 不可拍摄 | 眼睑半垂，视线从他的手移到他的眼睛 |
| 不要露出痛苦 | 没有负向分支 | 眉头松开，嘴角保持平直 |
| 正常的人体结构 | 抽象，无约束力 | 写状态而不是数量：`her shoulders stay level, her weight on her front foot` |
| 保持这个姿势 | 抽象 | knees stay dropped wide, weight on her shins, soles facing the lens |

---

## 检查清单

写完生理层后逐条过：

- [ ] 六层是否都出现了？缺哪层？
- [ ] 底拍是哪一层？它有没有明确终点？
- [ ] 潮红有没有写顺序和色阶？方向是否与弧型一致？
- [ ] 汗有没有三阶段和具体路径？
- [ ] 颤动是否只有一个位置 + 一个触发点？
- [ ] 视线变化是否只有一个变量在动？
- [ ] 是否写出了 `PHYSIOLOGY PRIORITY` 且顺序合理（通常是呼吸最先）？
- [ ] 任意一秒内，是否有超过两层在同时起变化？（有就拆）
- [ ] 有没有残留不可拍摄的形容？（有就按反例库改写）