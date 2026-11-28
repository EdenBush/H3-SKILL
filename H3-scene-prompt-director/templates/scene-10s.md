# 10 秒场景骨架

六个可直接改的骨架。**改之前先读完对应的"使用说明"，骨架不是万能模板，每个都对应一种弧型。**

占位符统一写作 `{{NAME}}`，替换时整个替换（含大括号），不要保留。

**`POSE AND STAGING` 内部按三层写**（2026 升级）：`World:`（L1 节点表，逐字）→ `Slots:`（L2 席位/朝向/承重）→ `Shot:`（L3 机位/景深/前景/帧内人数）；屏幕侧只出现一次。复杂场景 / 多单元先按 `spatial-anchoring.md` 建账本，再套骨架；账本不新增字段。

## 占位符速查

| 占位符 | 填什么 | 例 |
|---|---|---|
| `{{STYLE}}` | 渲染风格标签 | `2D anime illustration, clean cel-shaded linework with soft airbrushed gradients, flat two-dimensional rendering` |
| `{{CHARACTER}}` | 4–6 项身份特征，含高丢失率项 | `long wavy deep-blue hair, one upright ahoge curl, fin-shaped ears, bright blue eyes` |
| `{{SLOT_DECL}}` | 槽位声明（见 reference-slots.md） | 见各骨架首行 |
| `{{POSE}}` | 姿态，写关节状态 | `both knees bent and dropped wide, weight on her shins` |
| `{{CAMERA}}` | 高度→角度→焦段→运动→焦点 | |
| `{{LIGHT}}` | 光源位置 + 色温 + 明暗处理 | |
| `{{SOUND}}` | 环境声 1–4 句 | |

---

## 骨架 A：上升型（10 秒 / POV / 骑乘）

**使用说明**：适合情绪推进、正戏。三段镜头，每段承载一个生理层的进入。转折点（急吸）固定在 4.8 秒。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{CHARACTER}}.

POSE AND STAGING: First-person point of view from a man lying on his back. She {{POSE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
0.00-1.20s: Static POV looking up. She holds the pose, chest completing one slow deep inhale, {{IDLE_DETAIL}}, the hands motionless.
1.20-2.40s: She {{ACTION_1}}, the shoulders rolling forward a few degrees, {{FABRIC_OR_SKIN_DETAIL}}, her breath catching audibly in her throat.
2.40-3.60s: Flush begins at the ear roots and spreads strictly in order — ear roots, side of the neck, collarbones, chest — shifting from pale pink to deep rose; a bead of sweat forms in the hollow of her sternum and stays there.
3.60-4.80s: {{ACTION_2}}, the thighs spreading wider, her fingers curling and pressing down, the tendons standing out on the backs of her hands.
4.80-6.00s: Her breathing breaks — one short sharp gasp cuts in; a fine tremor runs through the inner thighs, the knees loosening a little further apart.
6.00-7.20s: A steady {{RHYTHM}} begins, {{BODY_RESPONSE}}, a slick sheen catching the light along {{SURFACE}}, her head tipping back and her hair falling away from her face.
7.20-8.40s: She slows, comes down and holds, looks straight into the lens with half-lowered eyelids and parted lips, and says in a {{VOICE}} (S1): <d>[Chinese] {{LINE_1}}</d>
8.40-10.00s: She stays seated, one slow {{CLOSING_MOVE}}, a long exhale through her mouth, a small smile forming as her eyelids drop further; the frame holds still.

CAMERA: {{CAMERA}}

PHYSIOLOGY PRIORITY: breathing amplitude > flush progression up chest and neck > thigh tremor > sweat bead at the sternum > pupils and eyelids > throat swallow. All six layers staggered across the time codes; {{BASE_BEAT}} sets the base beat.

LIGHT AND ATMOSPHERE: {{LIGHT}}. Specular points sit on sweat, {{SPECULAR_EXTRA}}. Cool neutral overall, the only warm area being her flushed chest and jaw.

CONSISTENCY LOCK: the pose never changes — {{POSE_LOCK}}. {{IDENTITY_LOCK}}. {{HEADCOUNT_LOCK}}.

SOUND: {{SOUND}}
```

---

## 骨架 B：衰减型（10 秒 / 事后 + 认知打断）

**使用说明**：最适合事后戏、余韵、喜剧反转。**前 4.8 秒必须真的在衰减**，转折点用"吸气卡在中途"标记。没有转折就删掉 7.2–10.0 的动作，改成纯收束。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{CHARACTER}}.

POSE AND STAGING: {{STAGING_WITH_DISTANCE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
0.00-1.20s: Static POV. She stays {{POSITION}}, chest still rising and falling fast from the exertion, shoulders lifting with each breath, a sheen of sweat across her collarbones and sternum, her gaze unfocused and aimed at the mattress.
1.20-2.40s: Her breathing slows and deepens, the shoulders dropping on each exhale, her head sinking forward, {{HAIR_DETAIL}}; a faint flush still visible high on her chest and fading.
2.40-3.60s: A last tremor runs through the inside of her thighs and dies out; {{FABRIC_STATE}}; she shifts her weight and her hands slide to rest on her knees.
3.60-4.80s: {{TRIGGER_MOMENT}} — her movement stops mid-breath, the inhale halts mid-way, the chest stays lifted, and only her eyebrows move first, drawing together.
4.80-6.00s: {{REALIZATION}} arrives in stages: the eyes widen, the pupils contract, the mouth opens slightly, and her head tilts a few degrees to one side.
6.00-7.20s: She lifts her head and looks up at the camera, the flush on her cheeks deepening into a hot red that spreads to her ear tips, and her throat moves in one hard swallow.
7.20-9.00s: In a {{VOICE}} (S1) she says: <d>[Chinese] {{LINE_1}}</d> then, {{SECOND_HALF_TONE}}: <d>[Chinese] {{LINE_2}}</d>
9.00-10.00s: {{FINAL_ACTION}}, her eyes still locked on the lens, the frame holds still.

CAMERA: {{CAMERA}}. Almost entirely static — one very small push in from 3.60s to 4.80s as her expression changes, then locked to the end; light handheld drift under 2% of frame width, and the drift stops dead at 4.80s so the stillness lands on her face. Focus on her face throughout.

PHYSIOLOGY PRIORITY: everything decays, then one interruption. Breathing falling in amplitude and rate > last thigh tremor fading out > sweat cooling into a dull sheen > chest flush retreating while the face flush arrives > pupils contracting > one hard swallow. The decay must be genuine and continuous from 0 to 4.80s; the realization cuts it off rather than adding on top of it.

LIGHT AND ATMOSPHERE: {{LIGHT}}. Specular points sit on the cooling sweat along her collarbones.

CONSISTENCY LOCK: the pose never changes — {{POSE_LOCK}}. {{IDENTITY_LOCK}}. {{HEADCOUNT_LOCK}}.

SOUND: {{SOUND}}. Her breathing loud and close at the start and slowing through the first four seconds, then near silence from 4.80s so the line lands clean.
```

---

## 骨架 C：转向型（10 秒 / 愤怒 / 反转）

**使用说明**：情绪从 A 切到 B，且不可逆。**潮红方向必须反转为两颊→外，呼吸全程快而浅**。这是与情欲戏唯一可靠的物理区分。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{CHARACTER}}.

POSE AND STAGING: {{STAGING_WITH_DISTANCE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
0.00-1.20s: POV. She {{OPENING_MOVE}} in one sharp motion, {{FABRIC_OR_HAIR_REACTION}}, her expression already set — brows pulled down, jaw tight, eyes fixed on the lens.
1.20-2.40s: She jabs her index finger straight at the camera, her hand trembling with each word she does not yet say, her chest heaving fast and shallow, the nostrils flaring on every breath, an angry flush blooming from the centre of both cheeks and spreading outward to her jaw and ears.
2.40-3.60s: She {{PHYSICAL_ACT}}, the camera {{CAMERA_REACTION}} and settles, her arm still extended, the tendons standing out along her forearm.
3.60-4.80s: {{BUILDUP_ACTION}}, her chin dropping, lower lip pushed out, tears gathering along the lower lid without falling.
4.80-6.00s: {{PEAK_ACTION}} — {{FRAME_OCCLUSION_IF_ANY}} — revealing her still glaring, one tear finally cutting a track down her right cheek.
6.00-7.20s: {{FINAL_BUILD}}, her mouth opening before any sound comes out.
7.20-9.00s: Her voice cracks on the first word — in a furious, tearful, breaking voice (S1) she cries: <d>[Chinese] {{LINE_1}}</d> then louder and higher: <d>[Chinese] {{LINE_2}}</d>
9.00-10.00s: She snaps her head to the side and turns one shoulder away from the camera, chin lifted; the frame holds still.

CAMERA: {{CAMERA}}. Mostly static with deliberate interruptions that settle within 0.4s; light handheld drift under 2% of frame width. Focus locked on her face throughout.

PHYSIOLOGY PRIORITY: anger, not arousal. Cheeks flush first and spread outward and downward to the jaw and ears > nostrils flare on each breath > jaw and neck tendons tighten > hands tremble > tear film builds on the lower lids > one swallow before the voice breaks. Breathing stays fast and shallow the entire time and never deepens.

LIGHT AND ATMOSPHERE: {{LIGHT}}. Specular points sit on the tear track on her cheek and on the damp strands of hair.

CONSISTENCY LOCK: her position stays fixed — {{POSE_LOCK}}. {{IDENTITY_LOCK}}. {{HEADCOUNT_LOCK}}.

SOUND: {{SOUND}}. Her fast shallow breathing throughout, and her voice breaking on the last syllable.
```

---

## 骨架 D：无姿势参考（自建空间）

**使用说明**：没有姿势图时用。**空间三件（位置 / 距离 / 朝向）必须全部写死**，缺一项模型就随机给机位。这是四条里最容易被低估的一条。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{CHARACTER}}.

POSE AND STAGING: {{CAMERA_OWNER}}. She {{POSITION_ON_BED}}, about {{DISTANCE}} away, {{ORIENTATION}}. {{POSE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
{{BEATS_FROM_SKELETON_A_B_OR_C}}

CAMERA: {{HEIGHT}} at {{ANGLE}}, {{FOCAL_LENGTH}}, {{MOVEMENT_BUDGET}}. Focus {{FOCUS_PLAN}}.

PHYSIOLOGY PRIORITY: {{PRIORITY_STRING}}

LIGHT AND ATMOSPHERE: {{LIGHT}}

CONSISTENCY LOCK: her position stays fixed — {{DISTANCE_LOCK}}, {{POSE_LOCK}}. {{IDENTITY_LOCK}}. {{HEADCOUNT_LOCK}}.

SOUND: {{SOUND}}
```

**空间三件填空示例**

```
She kneels on the mattress facing him, about a metre away, straddling nothing —
both knees on the mattress, sitting back slightly on her heels.
```

三个信息缺一不可：**位置**（床垫上跪着）、**距离**（约一米）、**朝向**（面对他）。再补承重方式（坐在脚跟上）把姿态钉死。

---

## 骨架 F：叙事场（10 秒 / 非 POV / 5–7 镜）

**使用说明**：三人以内、有对话/接触/权力变化的叙事场。**先按 `camera.md` 二c 列镜头表**，再填；POV/亲密戏用 A–D。它和 `golden-example.md` 是同一结构：镜头表 → 每镜高度/角度/景别/前景/切因 → 表演/接触 → 台词窗口 → 余波。

```text
{{SLOT_DECL}}

integrated_multimodal_description:
[Shot 1] {{STYLE}}. {{WORLD}}. {{A}} and {{B}} at {{POSITIONS}}. {{HEIGHT_ANGLE}}, {{LENS}}, {{SHOT_SIZE}}, {{FOREGROUND}}, focus {{FOCUS}}. {{BEAT_1}}.
[Shot 2] At 00:0X.000, the camera cuts to {{HEIGHT_ANGLE_2}}, {{LENS_2}}, {{SHOT_SIZE_2}}, {{FOREGROUND_2}}: {{BEAT_2}}.
[Shot 3] At 00:0X.000, the camera cuts to {{HEIGHT_ANGLE_3}}, {{LENS_3}}, {{SHOT_SIZE_3}}, {{FOREGROUND_3}}: {{BEAT_3}}.
[Shot 4] At 00:0X.000, the camera cuts to {{HEIGHT_ANGLE_4}}, {{LENS_4}}, {{SHOT_SIZE_4}}, {{FOREGROUND_4}}: {{BEAT_4}} {{DIALOGUE}}.
[Shot 5] At 00:0X.000, the camera cuts to {{HEIGHT_ANGLE_5}}, {{LENS_5}}, {{SHOT_SIZE_5}}: {{BEAT_5}}.
[Shot 6] At 00:0X.000, the camera cuts to {{HEIGHT_ANGLE_6}}, {{LENS_6}}, {{SHOT_SIZE_6}}, {{FOREGROUND_6}}: {{BEAT_6}}. The frame holds.

PHYSIOLOGY PRIORITY: {{PHYSIOLOGY_ORDER}}
LIGHT AND ATMOSPHERE: {{LIGHT}}
CONSISTENCY LOCK: {{IDENTITY_LOCK}} {{STATE_LOCK}} {{HEADCOUNT_LOCK}}

overall_soundscape: {{SOUND}}
non_diegetic_music: N/A
```

**镜头表（先填这张，再写正文）**：

| # | 高度/角度 | 景别/焦段 | 前景 | 发生什么 | 切因 |
|---|---|---|---|---|---|
| 1 |  |  |  |  |  |
| 2 |  |  |  |  |  |
| 3 |  |  |  |  |  |
| 4 |  |  |  |  |  |
| 5 |  |  |  |  |  |
| 6 |  |  |  |  |  |

**填法**：接触/反应场用 5–7 镜；瞬间戏 3–4 镜也可以，但必须覆盖来向/接触/后果；每一刀有切因；相邻两镜默认换两件（含高度/角度或轴线侧）；至少一个非平视正面。表演按 `acting-performance.md`：接触反射弧、3–4 拍微表情链、听者/旁观者反应。

---

## 骨架 E：静帧版（5 秒 / 验骨架用）

**使用说明**：正式跑 10 秒前，先用这个验构图和人体结构。没有时间码，生理层退化为"此刻的状态"，**不要写"然后""逐渐""开始"**。

```
{{SLOT_DECL}}

{{STYLE}}. {{CHARACTER}}.

{{POSE_AND_STAGING_ONE_PARAGRAPH}}.

Camera: {{FOCAL_LENGTH}}, {{HEIGHT_AND_ANGLE}}, {{FRAMING}}, shallow depth of field with {{FOCUS_POINT}} tack-sharp.

Lighting: {{LIGHT}}. {{ATMOSPHERE}}.

{{HEADCOUNT_LOCK}} {{EXTRA_COUNT_LOCK}}.
```

---

## 使用流程

```
1. 选骨架（按弧型，不按场景）
2. 填 {{SLOT_DECL}} 和 {{CHARACTER}}（先把这两块定死，后面才有意义）
3. 填 TIMELINE，逐拍确认"这一拍变了什么"
4. 填 CAMERA，检查运动是否 ≤2、是否有矛盾机位
5. 填 PHYSIOLOGY PRIORITY
6. 填一致性锁：**人数**（`exactly one woman in the frame` / `exactly two figures`）+ **姿态锁**（重心在哪只脚、谁承重、位置）+ **惯性**（她正往前扑 / 他的重心已经移到后脚）+ 身份标志物。**不写肢体数量**（ten fingers / two arms / two legs）——H3 不会融化肢体，写了只是挤占注意力。
7. 跑 check_prompt.mjs
8. 768P 出片验证，骨架对了再升 2K
```

## 骨架选择表

| 场景 | 骨架 | 转折位置 |
|---|---|---|
| 前戏 / 正戏 / 情绪推进 | A 上升型 | 4.8s 急吸 |
| 事后 / 余韵 / 喜剧反转 | B 衰减型 | 3.6–4.8s 吸气卡住 |
| 愤怒 / 反转 / 争吵 | C 转向型 | 2.4–3.6s 肢体冲突 |
| 没有姿势参考 | D 自建空间（套 A/B/C 的节拍） | 同对应弧型 |
| 叙事 / 对话 / 接触 / 多人 | **F 叙事场（非 POV）** | 接触、台词、反应、余波 |
| 先验构图 | E 静帧版 | 无 |
