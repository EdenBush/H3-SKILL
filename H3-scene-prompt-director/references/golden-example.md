# 范文：10 秒三人叙事场（非 POV）

**这份文件解决一个问题**：技能说“可以写长、要有设计、人物要活”，到底长什么样？

下面是一条完整的 10 秒单元：食堂、三人、接触、台词、旁观者反应。它不是让你背，是让你对照：**同样的 10 秒，证据可以写到多密；哪些句子是必需的，哪些是废话。**

> 假设手上有四张图：Image 1 食堂空间、Image 2 银发女生、Image 3 男生、Image 4 舍友。没有图时，删掉槽位声明，把人物描述写全即可。

---

## 一、镜头表（不写进提示词）

| # | 秒 | 高度/角度 | 景别/焦段 | 前景/遮挡 | 发生什么 | 切因 |
|---|---|---|---|---|---|---|
| 1 | 0.0–2.0 | 胸高，平视 | 中全，35mm | 托盘/蒸汽 | 两人吃饭，女生从背景左门入 | 建立日常 + 入侵 |
| 2 | 2.0–3.4 | 高角 2.2m，俯 30° | 中全，28mm | 桌面/窗光 | 女生绕到男生左侧，舍友筷子停 | 交代地理 + 察觉 |
| 3 | 3.4–5.2 | 胸高略低，侧向 | 中近，35mm | 男生肩线 | 女生坐下抱左臂；男生反射弧 | 接触证据 + 权力变化 |
| 4 | 5.2–7.6 | 眼高，过舍友右肩 | 中近，50mm | 舍友肩/耳 | 女生说台词；男生侧脸；舍友前景 | 台词 + 立场 |
| 5 | 7.6–8.6 | 眼高 | 近景，85mm | 无 | 舍友冻结、嘴张、眼神来回 | 反应 + 不可置信 |
| 6 | 8.6–10.0 | 低角 0.7m，仰 10° | 中全，28mm | 托盘/蒸汽 | 女生拉回；男生僵住/靠过去；舍友半起 | 新秩序 + 余波 |

**为什么不是三镜**：三镜只够“中全+特写+微距”，这条戏的核心是**接触后的反射弧 + 三人立场变化**，必须给接触、台词、反应、余波各自一刀。六镜平均 1.6 秒，仍在 10 秒容量内。

---

## 二、完整提示词

```text
Image 1 supplies the cafeteria as a three-dimensional space — the long laminate table, the window wall on the left, the double doors at the back left, the tray return in the far background — while the camera position and framing come entirely from the CAMERA lines below; copy zero of its framing and zero of its camera position. Image 2 is the silver-blonde woman only: use her face, long wavy silver-blonde hair, the mole under the outer corner of her left eye and her two dimples; ignore the sheet layout, the separate views, the studio poses and the grey background; render exactly one single figure. Image 3 is the man only: use his face, short black messy hair, the small mole on the right side of his neck and his lean build; render exactly one single figure. Image 4 is the roommate only: use his round face, short buzz cut and heavy build; render exactly one single figure.

integrated_multimodal_description:
[Shot 1] 2.5D semi-realistic anime render, cel-shaded volumetric lighting, soft painterly skin shading, glossy detailed eyes with layered iris highlights, crisp fabric and hair detail, shallow cinematic depth of field, contemporary Chinese donghua film aesthetic, vertical 9:16. A busy university cafeteria at lunch: a long laminate table, two plastic trays, steam rising from rice. The man — short black messy hair, lean build, worn white shirt under a faded grey-blue blazer — sits centre-left, chopsticks in his right hand. The roommate — round face, short buzz cut, black hoodie — sits to his right. Both face the camera across the table. In the background left, the silver-blonde woman — long wavy hair, mole under the outer corner of her left eye, black leather dress — enters through the double doors, out of focus. 35mm equivalent, chest height, medium-wide, the foreground tray and steam soft at the bottom edge, the table edge anchoring the frame. 0.00–2.00s: the two men eat; the man lifts rice to his mouth; the roommate laughs with his mouth full; the woman's silhouette sharpens behind them. No one looks at her yet.

[Shot 2] At 02.000, the camera cuts to a high angle 2.2 metres above the table, 28mm equivalent, medium-wide, looking down across the trays: the man centre-left, the roommate right, the woman crossing behind them along the window wall, her left hand trailing the bench. The roommate's chopsticks stop halfway to his mouth; the man's shoulders stay square. Pale window light from screen left lays a band across the table; the woman's shadow crosses the tray.

[Shot 3] At 03.400, the camera cuts to a low chest-height 35mm medium close-up from across the table, slightly below eye level: the woman sits on the bench at the man's left, her leather sleeve brushing his arm; both hands close around his left upper arm. 0.00–0.40s: his left forearm flinches, the chopsticks in his right hand jerk and click against the bowl; his torso retreats half an inch, shoulders lift, a half-breath catches. 0.40–0.80s: his head turns to her, brows lift, lips part. 0.80–1.80s: his eyes break from her face to the roommate and back; his free right hand rises halfway and stops. The woman's chin comes near his left shoulder; she smiles with her eyes first, then her lips.

[Shot 4] At 05.200, the camera cuts to an over-the-shoulder medium close-up from behind the roommate's right shoulder, 50mm equivalent, eye level; the roommate's shoulder and ear fill the near foreground, soft and completely still; focus on the woman's face across the table. The woman leans her chin against the man's left shoulder, her hands still locked around his arm, and says in a low, teasing, possessive voice (S1): <d>[Chinese] 老公，怎么吃饭不叫我。</d> The man's left profile stays in frame, his jaw tight, his eyes fixed on the roommate; the woman's eyes flick to the roommate at the last word, then back to the man. The camera is completely still; focus locked on her eyes and mouth.

[Shot 5] At 07.600, the camera cuts to an 85mm close-up of the roommate at eye level, the couple soft in the background left. His chopsticks hang in mid-air; his mouth is open; his eyes dart from the woman to the man and back; his chair scrapes back an inch; one hand rises halfway and stops. His expression is shocked and conflicted micro expressions: brows high, lower lids tight, lips parted, one hard swallow.

[Shot 6] At 08.600, the camera cuts to a low angle 0.7 metres above the table, 28mm equivalent, medium-wide, the foreground tray and steam large and soft at the bottom. The woman pulls the man's arm tighter and leans her weight into him; his torso is pulled toward her, his free hand braces on the table edge, his chopsticks fall flat; he stiffens, then his weight settles against her, ears red, throat swallowing, eyes still on the roommate. The roommate half-rises from the bench, one hand on the table. The woman's smile holds; she does not look away from the roommate. The final frame holds on the three of them — woman left, man centre, roommate right, the table and trays between them.

PHYSIOLOGY PRIORITY: the man's contact reflex leads — left forearm flinch, chopsticks jerk, torso retreat, shoulders lift, half-breath, eyes widen, head turn, eyes to the roommate, free hand half-raise, then stiffen and settle against her; the woman's smile and eye flick second; the roommate's shock third — chopsticks freeze, mouth open, eyes dart, chair scrape, half-rise. Breathing, swallowing and eye direction stay staggered; no two facial changes land in the same second.

LIGHT AND ATMOSPHERE: late lunch window light from screen left, warm-neutral 4300K, soft steam haze, pale window bands on the table; faces lit from screen left, shadows soft and open, highlights just below clipping.

CONSISTENCY LOCK: the same 2.5D cel-shaded rendering and the same cafeteria light persist across all shots. The man stays centre-left, the roommate to his right, the woman on the man's left; the man's left arm is hugged, his right hand holds the chopsticks until they fall in the last shot; the woman's mole under the outer corner of her left eye and her two dimples stay identical; the roommate's black hoodie and buzz cut stay identical; the window light stays screen-left; the trays stay on the table; exactly three people in the frame in every shot, with no extras.

overall_soundscape: A busy university cafeteria room tone — tray clatter, cutlery, overlapping conversations, a distant chair scrape; the woman's leather sleeve whispers against the man's shirt; his chopsticks click against the bowl; a half-breath catches; the woman's low teasing line lands close to the microphone; after the line, the roommate's chair scrapes back and a single chopstick taps the tray; a beat of near-silence around the couple.

non_diegetic_music: N/A
```

---

## 三、这份范文做对的八件事

1. **每一镜有高度/角度/景别/前景/切因**。不是“中全、特写、微距”三件套；第 2 镜用高角交代地理，第 3 镜用略低侧向拍接触，第 6 镜用低角收权力。
2. **接触有反射弧**：局部缩 → 惊跳 → 定向 → 评估 → 对抗/顺从 → 余波。没有用 `freeze` 当第一拍。
3. **两力模型**：她拉 + 他撑 + 合成（僵住/靠过去），不是“他被抱住”一个静态结果。
4. **台词落在静止、脸可见的窗口**：第 4 镜 2.4 秒，焦点锁眼和嘴，前景舍友肩保持完全静止。
5. **听者和旁观者都有反应**：舍友不是背景，筷子停、嘴张、眼珠来回、椅子刮地、半起；一人一种反应，错峰。
6. **空间连续**：桌、托盘、窗光、门、席位从头到尾一致；女生从背景左门入 → 绕过 → 坐左侧；男生左臂被抱、右手筷子；舍友在右。
7. **声音证明动作**：筷子碰碗、皮革摩擦、椅脚刮地、半口吸气、台词后的近静——声音不是装饰，是接触和停顿的证据。
8. **长但不空**：多出来的字给动作因果、接触证据、空间交接、声音时序；没有堆形容词。

---

## 四、怎么用到你的项目

- 换人物、换场景，不换结构：**镜头表 → 接触/反应 → 台词窗口 → 旁观者 → 余波**。
- 如果你的项目是 2.5D 漫剧，把第 1 镜的风格标签换成你的项目风格锁，并在 `CONSISTENCY LOCK` 里重申“同一渲染、同一光”跨镜保持；画幅按项目改，范文用 9:16。
- 如果只有 3 镜：保留“接触 → 台词/反应 → 余波”，每镜必须有高度/角度或轴线变化；不要只换景别。
- 如果提示词写完只有几行：回看这份范文，问自己少的是**动作因果、接触证据、空间交接、声音时序**中的哪一项；不要用形容词补。
