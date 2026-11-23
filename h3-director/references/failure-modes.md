# 失败模式全表

按"你看到的画面"索引。每一行给出：现象 → 病因 → 修法（可直接粘进提示词的英文片段）。

诊断顺序建议：先看机位对不对，再看身份稳不稳，最后才看生理和细节。机位错了，后面的诊断全部无效。剧集任务再多一轴：先确认这一单元的画面和地标句对得上（见第九节），再接其他诊断。

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
| 情绪只有标签 | 只写了 `sad` / `angry`，模型给一张标准表情脸 | 情绪词后加 `micro expressions`，再接一条可见动作链：`a quietly hurt micro expression — her eyes drop, her lips part and close again, and she swallows once` |
| 说完台词立刻"断电" | 台词窗口一结束表情归零，像演员下班 | 台词前留半拍准备，台词后留半拍余韵：`Her eyes remain on him after the line`；收尾用"差一点"：`one corner of her mouth almost forms a polite smile and then relaxes` |
| 画面几乎不变，像静帧 | 生理层没有时间码骨架 | 补 TIMELINE，一拍一件事 |

---

## 五、台词与口型

| 现象 | 病因 | 修法 |
|---|---|---|
| 口型整体对不上 | 台词窗口里有运镜 | 窗口内镜头完全静止 + 焦点锁死 |
| 口型前 1 秒对得上，后面飘 | 句子太长 | 超过 12 字拆两段，中间留 0.6–0.8 秒停顿 |
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

## 八、视觉档位与表演伪影（三档专用）

档位问题的系统排查见 `visual-tiers.md` 第七节；完整验收顺序见 `quality-gate.md`。

| 现象 | 病因 | 修法 |
|---|---|---|
| 同一片里 3DCG 脸配真人毛孔 / 三渲二配 FF7RE 材质 | 档位混用，或参考图媒介与档位不一致 | 整片只选一个档位；跨档素材只取姿态/结构并排除其渲染与肤色 |
| 腮红过重或整脸泛统一粉色 | 底色、妆容与受光没有分离 | 面颊底色与原肤色协调，默认不额外加重腮红；颜色写成受光后的可见结果 |
| 说话时突然像真人 | 只在全局做了 CG 锁，口型/近景段漏了档位锚 | 在该镜就地补同一 CG 模型与哑光散射皮肤描述；见 `visual-tiers.md` §2 |
| 三渲二出现毛孔、鼻翼脏黑自阴影、像 2D 平涂 | 混入 3DCG/真人词条，或没写三维体积 | 三渲二七项：`three-dimensional volume` + `clean two-tone SDF facial ramp` + `poreless matte anime skin` + 发束天使环 + 描边/硬边轮廓光 |
| 真人口播出现深法令纹、木偶纹 | 中下脸被强表情拉扯 | 平滑鼻唇过渡锁定 + 极小下颌开合；情绪交给眼睑、视线与呼吸 |
| 真人皮肤油腻 / 塑料反光 | 用了"光泽""水润"类词，或缺哑光约束 | `natural matte skin finish with subtle micro-texture, zero oily sheen` |
| 真人画面高饱和、橙红肤色、HDR 感 | 没有低饱和低对比调色；暖色物件未降饱和 | `heavily desaturated low-saturation cinema color grade` + 对红/暖物件加 `muted / pale / dusty` |
| 面部抽动、诡异微颤 | 提示词里直接写了 FACS / AU 编号 | **删除所有 `FACS`、`AU1`、`AU7` 等编号**，改写成纯可见的解剖微动作；`check_prompt.mjs` 会报错 |
| 表演"克制"演成面瘫 | 只抑制了中下脸，没给眼部/泪水/呼吸演进 | 每镜写 3–4 个有序微节拍；泪膜 / 单滴 / 湿润泪痕三态跨镜继承 |

---

## 九、跨单元（剧集）文锚失效

单看每一单元都没问题、接起来才暴露的问题都在这里。对照 `text-anchoring.md` 的五锁逐条查。

| 现象 | 病因 | 修法 |
|---|---|---|
| 每个单元的远景山、断墙或门的位置都在变，背景像每次重建 | 地标句没有逐字复用，或每单元同义改写 | 从规格卡复制原句；地标 3–4 个、顺序与光向不动；要改就是整集换版本，不是单单元改一句 |
| 角色一会儿画左一会儿画右，场景像换了个地方 | 用了"A 在 B 左边"这类相对坐标，换机位就失效 | 位置全部挂地标：`crouching on the left mecha shoulder plate`，不用人物互参 |
| 上一单元蓄力要跳，下一单元却已经站在地面聊天 | 动量没接力，动作相位被重置 | 本单元首拍用自包含现在时接住未完成态：`Opening directly from a spring-loaded crouch ..., her knees already coiled` |
| 道具上一镜还在手里，下一镜没了；关上的包扣自己弹开 | 物件状态链没重述，或只写了持有者没写开合 | 五字段逐个重述：来源 / 持有者或位置 / 开合或满空 / 下一手交接 / 体量材质约束；**没变也要写** |
| 上一单元站在废墟旁的配角，这一单元凭空消失或换了位置 | 在场者没锁，只写了人数 | 每镜括号补 `(who stands near the wreckage on the left with lips closed)`；换位置要有可见走位 |
| 主角说话时，旁边没台词的人嘴也在动 | 锁了人数没锁嘴 | 每条台词后补 `Both X and Y keep their lips completely closed throughout her line.` |
| 正反打的视线像在看两个方向，或高度对不上 | 视线向量缺屏幕方向或俯仰角 | 五字段写齐目标 / 屏幕方向 / 俯仰 / 距离；反打交于同一条射线，距离与高度差继承 |
| 切镜后光从另一侧来，影子反了 | 地标句里的光向没带过去，或反打没重新推算受光 | 每个单元重述光向；反打重新推导哪侧脸被照亮，光源世界位置不动 |

---

## 十、诊断流程图

```
画面不对
├─ 档位 / 素材媒介不对
│   ├─ 混档 → 整片只留一档
│   ├─ 忽 CG 忽真人 → 补该镜档位锚
│   └─ 面部抽动 → 删 FACS / AU 编号
├─ 构图 / 机位不对
│   ├─ 机位跳变 → 检查 CAMERA 段是否有两套矛盾机位
│   ├─ 机位每次不同 → 补站位 + 距离 + 高度
│   └─ 焦段不对 → 指定等效焦段
├─ 身份不对
│   ├─ 多个人 / 三联排 → 版面排除 + exactly one figure
│   ├─ 特征缺失 → 逐段重申 + 一致性锁
│   └─ 风格混 → 跨风格三件套
├─ 肢体不对
│   ├─ 多腿 → 非人特征的排他式并列
│   ├─ 手错 → 接触点 + 拇指位置 + 承重
│   └─ 丝袜变皮肤 → 蕾丝边 + 织物形变
├─ 表演不对
│   ├─ 不动 → 补时间码骨架
│   ├─ 动得假 → 拆同步、加打断
│   └─ 情绪错 → 检查弧型是否选错
├─ 跨单元接不上（剧集）
│   ├─ 背景重组 / 地标漂移 → 地标句逐字复用
│   ├─ 动作瞬移 → 补动量接力
│   ├─ 道具消失 / 开合回滚 → 物件状态链五字段重述
│   ├─ 配角消失 / 没说话嘴在动 → 在场者锁 + 全闭嘴句
│   └─ 视线对不上 / 光向翻转 → 视线向量 + 光向重述
└─ 台词不对
    ├─ 没声音 → 检查标记语法与镜头可见性
    └─ 口型飘 → 静止窗口 + 拆句
```
