# 失败模式全表

按"你看到的画面"索引。每一行给出：现象 → 病因 → 修法（可直接粘进提示词的英文片段）。

诊断顺序建议：先看机位对不对，再看身份稳不稳，最后才看生理和细节。机位错了，后面的诊断全部无效。

---

## 一、构图与机位

| 现象 | 病因 | 修法 |
|---|---|---|
| 镜头在 10 秒里换了四五个角度，像剪辑事故 | CAMERA 段里有两套矛盾的机位（仰拍 + 俯拍同时存在） | 删到只剩一套，单独读一遍 CAMERA 段确认"这是一台机器" |
| 机位每次生成都不一样 | 没有姿势参考，且没写死站位 / 距离 / 高度 | `she kneels on the mattress facing him, about a metre away` + 机位高度 + 焦段，三件缺一不可 |
| 人物在画面里忽大忽小 | 没指定焦段，模型自己选了 | 明确 `24mm equivalent` / `18mm equivalent ultra-wide` |
| 广角下脸被拉成梯形 | 脸放在了画面边缘 | 18mm 以下时写 `her face centered`，或把脸移出焦点改用半身 |
| POV 镜头像悬空的第三方视角 | 没写镜头"属于谁、在哪里" | `POV from a man lying on his back` / `from a man sitting on the bed` |
| 镜头抖得像地震 | 手持漂移幅度没限制，或与冲击动作叠加 | `light handheld drift, amplitude under 2% of frame width`，有冲击时收小 |
| 被推 / 被撞之后画面回不到原位 | 没写复位窗口 | `both settle within 0.4s so the frame is stable again` |

---

## 二、身份与一致性

| 现象 | 病因 | 修法 |
|---|---|---|
| 输出三联排站姿 | 设定图是多视图，未做版面排除 | `render exactly one single figure, ignore the sheet layout, the three standing views, the detail crops` |
| 画面里多出一个人 | POV 里入画的手/腿被理解成第二人；或多视图被当成多角色 | `exactly one woman in the frame, no other figures` |
| 呆毛 / 兽耳 / 头饰某一镜消失 | 这类小结构丢失率最高；且只在开头提了一次 | 每一段各提一次 + 收尾一致性锁再列一次。丢失率排序：头饰 > 兽耳/鳍耳 > 呆毛 |
| 脸越来越不像参考图 | 没有在收尾重申身份 | 一致性锁里加 `her face stays identical to Image 2 across all shots` |
| 发型在镜头间变化 | 只写了"长发"，没写结构和颜色 | 写 `long wavy deep-blue hair with a lighter blue gradient at the tips` |
| 动漫脸配写实毛孔 | 跨风格未覆盖 | 三件套：槽位排除 `photorealistic rendering and skin texture` / 镜头首句 `flat two-dimensional rendering throughout` / 细节复述 `smooth cel-shaded skin` |
| 特写镜头突然变写实 | 跨风格覆盖只在开头做了，细节段漏了 | 每个提到皮肤、汗、高光的句子都带风格修饰 |

---

## 三、肢体与人体结构

| 现象 | 病因 | 修法 |
|---|---|---|
| 三条腿 | 非人特征（尾巴）被算进肢体计数 | 写清非人特征的起点、数量与空间排他：`one single tail with two flukes, growing from the base of her spine and hanging clear of her body`。不写肢体数量 |
| 手指黏连 / 六指 / 少指 | 手部交握类姿势没有具体约束 | 写接触点、关节状态与承重：`their hands are clasped, the thumbs resting over the top, the knuckles pale where they press`；仍崩就收窄景别或换种子 |
| 前景的手位置漂移或消失 | 只在第一镜提了一次 | 每一镜各提一次，并写 `only a forearm and the fingers visible` |
| 蝴蝶坐姿塌成跪坐 / 一条腿折叠 | 只写了 `spread wide`，没约束承重点 | `both knees bent and dropped wide out to either side` + `weight on her shins` |
| 脚掌只出一只 / 脚趾数不清 | 双脚类构图没有明确约束 | 写两只脚的落点与承重：`both soles planted flat on the sheet, the arches lifted, the weight on the heels`；脚趾细节靠景别与焦点，不靠计数 |
| 丝袜被画成裸腿 + 一层黑影 | 只写了"穿丝袜"，没有边界和形变 | `scalloped lace tops` + `the fabric bunches at the knees` + `the lace tops rolled slightly upward` |
| 姿势在切镜后变了 | 一致性锁只写了 `keep the pose` | 写成关节状态：`knees stay dropped wide ... her weight on her shins` |

---

## 四、生理与表演

| 现象 | 病因 | 修法 |
|---|---|---|
| 胸腔像手风琴匀速开合 | 呼吸没有终点，形成平循环 | 吸气呼气拆两个时间码 + 中途插一次 `one short sharp gasp cuts in` |
| 潮红一次铺满全身 | 没写顺序和色阶 | `spreads strictly in order — ear roots, side of the neck, collarbones, chest — shifting from pale pink to deep rose` |
| 汗珠贴在图层上不动 | 只有"成形"，没有"悬住"和"滑落" | 三阶段 + 具体路径：`runs down the line of her ribs leaving a wet trace` |
| 全身都在抖 | 颤动没有限定位置 | 只选一个部位（大腿 / 前臂 / 手指）+ 一个触发点（`at the top of each descent`） |
| 表情一秒内全出来 | 多变量同时变化 | 拆开：眉先动、眼后睁、嘴最后开，各给独立时间码 |
| 事后戏看起来像还在兴奋 | 走了上升型弧型 | 全部反转为衰减方向，见 `physiology.md` 的反向对照表 |
| 生气看起来像喘 | 呼吸转深了 | 全程写 `fast and shallow`，绝不出现 `long exhale` |
| 情绪像贴上去的 | 用了不可拍摄的形容（很伤心、很生气） | 换成可拍摄的物理事件，见 `physiology.md` 反例库 |
| 画面几乎不变，像静帧 | 生理层没有时间码骨架 | 补 TIMELINE，一拍一件事 |

---

## 五、台词与口型

| 现象 | 病因 | 修法 |
|---|---|---|
| 口型整体对不上 | 台词窗口里有运镜 | 窗口内镜头完全静止 + 焦点锁死 |
| 口型前 1 秒对得上，后面飘 | 句子太长 | 超过 12 字拆两段，中间留 0.6–1.0 秒停顿 |
| 台词被念成英文 | 台词没加语言标签 | `<d>[Chinese] ...</d>` |
| 漏字 / 改词 | 句子结构复杂或有生僻组合 | 缩短句子，避免长定语 |
| 台词没被念出来 | 台词放在了背影、微距或脸被遮住的镜头 | 台词只放在脸可见的镜头；主体脸至少占中近景 |
| 她没说话但嘴在动 | 倾听者 / 静默人物的嘴部状态没写 | 静默的人写 `her lips stay together` |
| 情绪不对 | 声音描述缺失或笼统 | 写具体：`soft, breathy, teasing voice, vowels slightly drawn out` / `furious, tearful, breaking voice` |
| 破音在句尾 | 破音位置没指定 | 明确 `her voice cracks on the first word` |

---

## 六、格式与时间轴

| 现象 | 病因 | 修法 |
|---|---|---|
| 切点比要求的晚 1–2 秒 | `[Shot 2]` 只写了标签，没写 `At 00:0X.000` | 每一镜都补完整句式 |
| 画面中间空白一两秒 | 时间码有洞 | 首尾相接，累加等于总时长 |
| 两个动作抢同一个部位 | 时间码重叠 | 串行拆分 |
| 成片比要求长 0.5–0.6 秒，收尾被截 | 按精确时长切了最后一拍 | 最后一段多留 0.3 秒余量 |
| 招牌 / 界面文字变乱码 | 画面内可见文字没加英文双引号 | `a sign reading "OPEN UNTIL 2 AM"` |
| 模型自己补了配乐 | `non_diegetic_music` 没写 | 不想配乐也要写 `N/A` |
| 音轨太小声 | 两个声音字段都没写或写得过短 | `overall_soundscape` 写 1–4 句具体的环境声 |
| 写了"不要"却没有效果 | H3 没有负向分支 | 全部改为正向的确定状态 |

---

## 七、生成与工作流

| 现象 | 病因 | 修法 |
|---|---|---|
| 每次生成结果差异巨大，无法收敛 | 没有锁种子 | 骨架对了立刻记种子，只在同一颗种子上微调 |
| 返工成本高 | 一直在高分辨率上试 | 768P 验骨架 → 骨架对 → 升 2K |
| 拆成两段 5 秒拼接后接缝处生理节律断裂 | 生理节奏跨段不连续 | 一次 10 秒整批出，不要拆 |
| 被平台拦下 | 露度或场景触发审核 | 先把露度降低、把环境写温和，跑通骨架后再恢复原提示词重跑 |
| 同一提示词跑三次结果完全不同 | 正常 | 视频模型 run-to-run 差异大；用同一颗种子跑三遍，取最好的一条 |

---

## 八、诊断流程图

```
画面不对
├─ 构图 / 机位不对
│   ├─ 机位跳变 → 检查 CAMERA 段是否有两套矛盾机位
│   ├─ 机位每次不同 → 补站位 + 距离 + 高度
│   └─ 焦段不对 → 指定等效焦段
├─ 身份不对
│   ├─ 多个人 / 三联排 → 版面排除 + exactly one figure
│   ├─ 特征缺失 → 逐段重申 + 一致性锁
│   └─ 风格混 → 跨风格三件套
├─ 肢体不对
│   ├─ 多腿 → 非人特征的起点 + 数量 + 空间排他
│   ├─ 手错 → 接触点 + 拇指位置 + 承重
│   └─ 丝袜变皮肤 → 蕾丝边 + 织物形变
├─ 表演不对
│   ├─ 不动 → 补时间码骨架
│   ├─ 动得假 → 拆同步、加打断
│   └─ 情绪错 → 检查弧型是否选错
└─ 台词不对
    ├─ 没声音 → 检查标记语法与镜头可见性
    └─ 口型飘 → 静止窗口 + 拆句
```
