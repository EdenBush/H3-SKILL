# 10 秒场景骨架

四个可直接改的骨架。**改之前先读完对应的"使用说明"，骨架不是万能模板，每个都对应一种弧型。**

占位符统一写作 `{{NAME}}`，替换时整个替换（含大括号），不要保留。

**`POSE AND STAGING` 内部按三层写**（2026 升级）：`World:`（地标句，逐字）→ `Slots:`（席位/朝向/承重）→ `Shot:`（机位/景深/前景/帧内人数）；屏幕侧只出现一次。复杂场景 / 多单元先按 `spatial-anchoring.md` 建账本，再套骨架；账本不是第六把锁，交付仍写地标句/调度图/五锁。

动笔前先锁定四件事：**视觉档位**（`visual-tiers.md`）、**镜数与角度档位**（`camera.md`）、**该档的风格锁原文**、剧集的**地标句**（单条模式可无）。没锁定就先别套骨架。

## 占位符速查

| 占位符 | 填什么 | 例 |
|---|---|---|
| `{{STYLE}}` | 选定档位的风格锁首句，逐字取自 `visual-tiers.md` §6 | `Fully computer-generated character animation with the sculpted, stylized character design and refined CG finish of FINAL FANTASY VII REMAKE` |
| `{{LANDMARKS}}` | 地标句：3–4 个固定地标（竖屏 2–3）+ 固定顺序 + 光向，一句英文。**剧集必填、逐字复用**；单条模式没有固定场景就整段删掉（连同后面的空格）。宽画幅按左 → 中 → 右 → 远排；9:16 按前 → 中 → 远排，地标名仍可用"左墙的门、后墙的床" | 宽画幅：`The setting is the open sunlit hillside: the white-gold mecha wreckage half-buried on the left slope, pink wildflowers across the centre, a gentle grassy rise on the right, and a distant peak with a cyan light beam in the far background, all under warm sunlight from the upper left.`<br>竖屏：`The setting is the room: the door on the left wall nearest the camera, the bed against the centre back wall beyond it, and the window on the right wall in the far background, all under moonlight falling from the right.` |
| `{{CHARACTER}}` | 4–6 项身份特征，含高丢失率项 | `long wavy deep-blue hair, one upright ahoge curl, fin-shaped ears, bright blue eyes` |
| `{{SLOT_DECL}}` | 槽位声明（见 reference-slots.md） | 见各骨架首行 |
| `{{POSE}}` | 姿态，写关节状态 | `both knees bent and dropped wide, weight on her shins` |
| `{{CAMERA}}` | 高度→角度→焦段→运动→焦点 | |
| `{{LIGHT}}` | 光源位置 + 色温 + 明暗处理 | |
| `{{SOUND}}` | 环境声与动作声 1–4 句，写进 `overall_soundscape`，不写进字段一 | `a low room tone, the mattress creaking once at 3.2s` |
| `{{MUSIC}}` | 配乐 1–3 句；后期配乐就写 `N/A`（留空模型会自补，音量差可达 25 dB） | `N/A` |

---

## 骨架 A：上升型（10 秒 / POV / 骑乘）

**使用说明**：适合情绪推进、正戏。**单镜 POV，不切镜**，靠三段时间推进；每段承载一个生理层的进入。转折点（急吸）固定在 4.8 秒。

**骨架 A 的固定动作偏亲密戏**：写其他题材时整句替换动作与生理细节，只保留它的时间码结构和"一拍只推一件事"的递进逻辑，不要留下原句。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{LANDMARKS}} {{CHARACTER}}.

POSE AND STAGING: First-person point of view from a man lying on his back. She {{POSE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
0.00-1.20s: Static POV looking up. She holds the pose, chest completing one slow deep inhale, {{IDLE_DETAIL}}, the hands motionless.
1.20-2.40s: She {{ACTION_1}}, the shoulders rolling forward a few degrees, {{FABRIC_OR_SKIN_DETAIL}}, her breath catching in her throat.
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

overall_soundscape: {{SOUND}}. Her breath catches once around 2.0s, then deepens with the rhythm.

non_diegetic_music: {{MUSIC}}
```

---

## 骨架 B：衰减型（10 秒 / 事后 + 认知打断）

**使用说明**：最适合事后戏、余韵、喜剧反转。**前 4.8 秒必须真的在衰减**，转折点用"吸气卡在中途"标记。没有转折就删掉 7.2–10.0 的动作，改成纯收束。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{LANDMARKS}} {{CHARACTER}}.

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

overall_soundscape: {{SOUND}}. Her breathing loud and close at the start and slowing through the first four seconds, then near silence from 4.80s so the line lands clean.

non_diegetic_music: {{MUSIC}}
```

---

## 骨架 C：转向型（10 秒 / 愤怒 / 反转）

**使用说明**：情绪从 A 切到 B，且不可逆。**潮红方向必须反转为两颊→外，呼吸全程快而浅**。这是与情欲戏唯一可靠的物理区分。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{LANDMARKS}} {{CHARACTER}}.

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

overall_soundscape: {{SOUND}}. Her fast shallow breathing throughout, and her voice breaking on the last syllable.

non_diegetic_music: {{MUSIC}}
```

---

## 骨架 D：无姿势参考（自建空间）

**使用说明**：没有姿势图时用。**空间三件（位置 / 距离 / 朝向）必须全部写死**，缺一项模型就随机给机位。这是四条里最容易被低估的一条。

```
{{SLOT_DECL}}

CHARACTER: {{STYLE}}. {{LANDMARKS}} {{CHARACTER}}.

POSE AND STAGING: {{CAMERA_OWNER}}. She {{POSITION_ON_BED}}, about {{DISTANCE}} away, {{ORIENTATION}}. {{POSE}}. {{CLOTHING_OR_NUDITY}}. Background: {{BACKGROUND}}.

TIMELINE:
{{BEATS_FROM_SKELETON_A_B_OR_C}}

CAMERA: {{HEIGHT}} at {{ANGLE}}, {{FOCAL_LENGTH}}, {{MOVEMENT_BUDGET}}. Focus {{FOCUS_PLAN}}.

PHYSIOLOGY PRIORITY: {{PRIORITY_STRING}}

LIGHT AND ATMOSPHERE: {{LIGHT}}

CONSISTENCY LOCK: her position stays fixed — {{DISTANCE_LOCK}}, {{POSE_LOCK}}. {{IDENTITY_LOCK}}. {{HEADCOUNT_LOCK}}.

overall_soundscape: {{SOUND}}

non_diegetic_music: {{MUSIC}}
```

**空间三件填空示例**

```
She kneels on the mattress facing him, about a metre away, straddling nothing —
both knees on the mattress, sitting back slightly on her heels.
```

三个信息缺一不可：**位置**（床垫上跪着）、**距离**（约一米）、**朝向**（面对他）。再补承重方式（坐在脚跟上）把姿态钉死。

---

## 骨架 E：静帧版（5 秒 / 验骨架用）

**使用说明**：正式跑 10 秒前，先用这个验构图和人体结构。没有时间码，生理层退化为"此刻的状态"，**不要写"然后""逐渐""开始"**。

```
{{SLOT_DECL}}

{{STYLE}}. {{LANDMARKS}} {{CHARACTER}}.

{{POSE_AND_STAGING_ONE_PARAGRAPH}}.

Camera: {{FOCAL_LENGTH}}, {{HEIGHT_AND_ANGLE}}, {{FRAMING}}, shallow depth of field with {{FOCUS_POINT}} tack-sharp.

Lighting: {{LIGHT}}. {{ATMOSPHERE}}.

{{HEADCOUNT_LOCK}} {{EXTRA_COUNT_LOCK}}.
```

---

## 骨架 F：剧集单元（常量块 + 调度图 + 接力首拍）

**使用说明**：剧集第 2 个单元起用。它不是新的弧型，是给 A/B/C 套上三层外壳：① **系列常量块整块重写**（五件一字不改，状态不进块内）；② **本单元空间复述**（机位拍到的那部分全部重新陈述）；③ **首拍接住上一单元末拍**。第 1 个单元用 A–E 中的一个，同时在这里定义常量块。

```
CHARACTER: {{STYLE_LOCK，逐字}}. {{LANDMARK_SENTENCE，逐字}}. BLOCKING MAP: {{FIXED_STRUCTURE}}; {{SEAT_1}}, {{SEAT_2}}; {{ENTRANCES_AND_AISLES}}; {{TABLETOP_OBJECTS}}. {{SUBJECT_1_DEFINITION，逐字，含 only-the-upper-face / body-proportions 来源声明}}. {{SUBJECT_2_DEFINITION，逐字}}. {{COSTUME_STATE_WORDS：本单元改动的那几个词}}.

POSE AND STAGING: {{本单元机位拍到的席位与朝向，逐人一句}}. {{首拍：上一单元末拍的余力，自包含现在时}}. {{视线向量：看谁 + 屏幕方向 + 俯仰 + 距离}}. {{在场者括号：位置 + 状态 + lips closed}}.

TIMELINE:
0.00-1.20s: {{首拍 = 上一单元最后一帧那股力的可见证据}}
1.20-2.40s: {{...}}
{{...}}
{{末拍}}: {{停在蓄力 / 悬空 / 半程 / 余波，写成未完成的物理状态}}

CAMERA: {{高度 → 角度 → 焦段 → 运动 ≤2 → 焦点}}. {{机位相对地标的方位，以及"机位由本节决定"}}.

PHYSIOLOGY PRIORITY: {{优先级串}}

LIGHT AND ATMOSPHERE: {{主光方位 + 色温，必须与地标句末句一致}}.

CONSISTENCY LOCK: {{人数}}; {{席位复述}}; {{物件：持有 / 位置 / 开合或鼓瘪}}; {{身份标志物}}; {{惯性}}.

overall_soundscape: {{SOUND}}

non_diegetic_music: {{MUSIC}}
```

**三条检查（缺一条就不算剧集单元）：**

1. 遮住动作部分，常量块必须和上一条**逐字相同**；不同的只能是状态词。
2. 首拍必须能指回上一条的末拍（蓄力 / 悬空 / 半程 / 余波），且写成自包含现在时。
3. 本单元机位拍到的席位、入口、桌面物件必须重新陈述，不许出现 `as before` / `same` / `previous shot`。

## 使用流程

```
1. 选骨架（按弧型，不按场景）
2. 填 {{SLOT_DECL}}、{{CHARACTER}} 和剧集的 {{LANDMARKS}}（先把这三块定死，后面才有意义；地标句从规格卡逐字抄，不许改写）
3. 填 TIMELINE，逐拍确认"这一拍变了什么"
4. 填 CAMERA，检查运动是否 ≤2、是否有矛盾机位
5. 填 PHYSIOLOGY PRIORITY，再把环境声填进 `overall_soundscape`、配乐填进 `non_diegetic_music`（不要配乐也写 N/A）
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
| 先验构图 | E 静帧版 | 无 |
