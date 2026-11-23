# 依据、适用范围与审美对照题

**仅用于维护和查证，日常出稿不加载。**

整理时间：CG 基础 2026-10-14；面部与光影 2026-10-17；特效整合 2026-10-18；真人电影档 2026-11；与 H3 工作流融合 2026-11。

以下全部是**面向生成视频的导演 / 美术应用依据**：来源支持制作事实，本技能把它转成提示词的可写规则；**不构成 H3 能力、帧级准确性或生成质量保证**。作品名、引擎名和技术名不能代替可见描述。

---

## 一、CG 与 FF7RE 造型 / 光影

| 一手来源 | 资料明确支持的制作事实 | 本技能采用的视觉推导与边界 |
|---|---|---|
| [Epic：FFVII REMAKE 开发者访谈](https://www.unrealengine.com/developer-interviews/how-square-enix-leveraged-unreal-engine-to-modernize-final-fantasy-vii-remake?lang=en-US) | 角色目标并非完全照片写实；Bonamik 以 PBD 为核心处理角色衣发 / 软体，强调电影动作可控性；过场另做布光 | CG 身份与设计优先，衣发写锚点、滞后、碰撞和落定；不能声称视频模型会运行 Bonamik |
| [CGWORLD：开发团队访谈，第 1 篇](https://cgworld.jp/feature/202012-ffvll-01.html) | 发型使用板片、透明 / 法线贴图与 bent normal；皮肤、眼、发、布采用不同着色模型；面部变形配合法线与细纹修正 | 写主发束与细丝层次、不同材料响应、随表情变化的体积 / 褶皱；不虚构逐根解算、全脸解剖肌肉仿真或 UE5 管线 |
| [CGWORLD：开发团队访谈，第 2 篇](https://cgworld.jp/feature/202012-ffvll-02.html) | 保留角色性和原作夸张；激烈动作可从动捕大量手调至近乎全关键帧；复杂衣发接触可混合手工动画 | 明确动作幅度、关键姿态、发力与收势，不用统一真人幅度；碰撞和轮廓必须同时成立，不把"完全物理"当唯一审美 |
| [CGWORLD：开发团队访谈，第 3 篇，灯光部分](https://cgworld.jp/feature/202012-ffvll-03.html) | 照搬现实灯光不一定适合 FFVII；场所保留多色灯特点，过场按镜管理演出灯与后期 | 允许动机明确的美术化补光和戏剧塑形，保持世界光源连续；不强制每镜三灯、青橙调色或恒定轮廓光 |
| [Adobe：角色 / 环境材质团队访谈](https://blog.adobe.com/en/publish/2020/09/17/discover-substance-3d-workflow-for-square-enix-final-fantasy-vii-remake) | 强调设计和 PBR 的共同作用；角色皮肤有毛孔；材质、模型与灯光协同 | 保留细微纹理并控制尺度，不能"零毛孔"磨成塑料，也不能用粗糙真人纹理替代 CG 设计 |
| [CEDEC 2020 官方：角色动画技术](https://cedec.cesa.or.jp/2020/session/detail/s5e58c8811bc98.html) | 介绍动画分层、程序化处理；面部包括语音口型、情感与自然视线 | 提示词写眼睑 / 眼球、唇颌与表情的可见协调；简介不提供通用肌肉参数，不能据此编造 |
| [ScreenSkills：场记职责](https://www.screenskills.com/job-profiles/browse/film-and-tv-drama/technical/script-supervisor-film-and-tv-drama/) | 制作前分解人物、动作、服装、道具与故事日，拍摄中监测动作、视线和连续性 | 采用固定场景关系、逐镜初末态和逐切点核对；这是提示词工作流设计，不是 H3 官方协议 |

补充：

- [Epic：INTERGRADE 渲染团队访谈](https://www.unrealengine.com/developer-interviews/how-square-enix-impressively-optimized-final-fantasy-vii-remake-intergrade-for-next-gen?lang=en-gb)：灯光、反射、阴影、雾及画面稳定性改进。用于支持切镜间光影 / 材质稳定的目标，不把该版本技术等同原版全部流程。
- [Square Enix：Revisited 第 12 章](https://www.square-enix-games.com/en_GB/news/final-fantasy-vii-remake-revisited-chapter-12)：从分镜与预演调整场面、镜头运动、切镜和节奏。支持以剧情危机驱动视觉强度，而非固定快切配额。
- [Midjourney 官方：Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference) 将色彩、媒介、纹理和光照列为可参考的风格属性。此处仅支持分开描述光影属性的做法；不证明 H3 具备相同功能。本技能只取光影，并用可见文字表达，不迁移 MJ 参数或真人角色材质。
- 无样图时的方向主光、柔和过渡、可读暗部、平顺高光与空间分离，是为本体系选定的美术默认，不是 MJ 官方唯一风格或 FF7RE 官方灯光配方。

上述来源的"物理可信"与"艺术控制"并存。`visual-tiers.md` 的 12 项约束及 `continuity-ledger.md` 的状态交接是据此制定的应用规则，不是原作团队公布的生成提示模板。

---

## 二、剪辑、连续性与蒙太奇

- [Adobe：180°规则，含导演 / 摄影师访谈](https://www.adobe.com/uk/creativecloud/video/discover/what-is-the-180-degree-rule.html)：同轴同侧机位维持空间关系，有意破坏需要目的。本技能进一步限定为"用户明确要求时才设计连续性破坏"，不是宣称电影永远不能越轴。
- [Adobe 官方：J-cut 与 L-cut](https://helpx.adobe.com/premiere/desktop/edit-projects/trim-clips/perform-j-cuts-and-l-cuts.html)：下镜声音先入为 J，上镜声音延续为 L。用于声画切点时序，不能只贴术语。
- [BFI：爱森斯坦与蒙太奇](https://www.bfi.org.uk/features/where-begin-sergei-eisenstein)：镜头并置可以产生单镜没有的意义，介绍不同蒙太奇组织方式。用于观念 / 节奏层面；不是每次切镜须具备全部类型的依据。

理论命名会因教材传统略异；实际验收以观众能读懂的时空、因果、声画和语义关系为准。30° 参考、节奏策略与各题材示例是实践指导，不是成功率公式。

---

## 三、真人电影档与微表情控制的依据

| 领域与核心来源 | 资料明确支持的机制与事实 | 本技能转化为真人电影档的硬性规则 |
|---|---|---|
| [Paul Ekman：Facial Action Coding System (FACS)](https://www.paulekman.com/facial-action-coding-system/) 及 [PMC 解剖分类研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC3008166/) | 面部表情由 46 个独立动作单元（AUs）及 A–E 五级强度构成；AU10（上唇提肌）、AU11（鼻唇沟加深肌）、AU12（颧大肌）的强收缩直接加深鼻唇沟（法令纹）；真笑（Duchenne smile）依赖眼轮匝肌（AU6）与极轻口角联动而非单纯拉扯嘴角 | **阻断法令纹与防用力过猛**：真人特写把中下脸强度锁在 Trace/Slight 级；通过抑制中下脸的剧烈拉扯，从解剖学根源消除 AI 动态深法令纹，将大部分情绪交给眼睑微张力、视线焦点与呼吸。**这些编码只在内部使用，正文严禁出现 `FACS` / `AU` 字样** |
| [ARRI Alexa 35 REVEAL Color Science & Textures](https://www.arri.com/resource/blob/277388/bf133c4a8673934c385a8afbb830acf4/2024-01-arri-textures-data.pdf) | 院线数字摄影机通过极宽动态范围、对数高光柔和压缩滚降（smooth highlight roll-off）与去饱和暗部颗粒，实现宽容、温润且不油腻的自然肤色还原 | **去油腻、去高对比高饱和**：提示词强制锁定 `smooth logarithmic highlight roll-off`、`natural matte skin finish with zero oily sheen`、`soft low-to-medium filmic contrast` 与 `restrained desaturated cinema color palette` |

**验证边界**：本轮针对"腮红过重、说话 / 表情转为真人观感、真人档四大伪影"的修订，未提供可供逐帧查看的成片。底色 / 妆容 / 受光分离、普通对白局部锚、四拍微表情链是本技能据此制定的修正策略，不能把失败归因于单个词，也不能宣称已经过视频生成对照验证。

---

## 四、特效设计依据

检索核验：2026-10-17；整合验收：2026-10-18。研究横跨电影制作方、制作者访谈、3A 开发团队和官方技术文档；不是穷尽互联网，也不是对全部影片 / 游戏逐帧分析。只使用实际读到的网页 / 摘要，未观看的嵌入视频、未取得的完整论文不算已通读。

用户报告气流、粒子、能量束、物理破坏等观感廉价，本轮未提供成片。因而不能确定某个单词或单一模块就是实际失败原因。`vfx-design.md`、`vfx-families.md` 和质量闸是根据资料与用户偏好形成的导演规则；**文本试写与结构校验不等于已验证 H3 成片提升**。

### 4.1 电影制作

| 一手来源与阅读范围 | 资料明确支持的内容 | 本技能的应用推导 |
|---|---|---|
| [ACM SIGGRAPH：The Special and Visual Effects Behind Twisters](https://blog.siggraph.org/2024/12/the-special-and-visual-effects-behind-twisters.html/)；ILM 制作者问答正文，2024-12-20 | 龙卷由漏斗、尘幕、地表尘土 / 碎片和云层等组合；动画与连续性、美术控制及尺度 / 速度约束共同工作，云 / 大气散射参与照明 | 气流以适用介质和环境响应显形，主形与次级运动共同保持方向 / 尺度；不强制每镜具备全部风暴组件 |
| [DNEG：Return to Arrakis — Dune: Part Two](https://www.dneg.com/news/return-to-arrakis-for-a-closer-look-at-our-work-on-dune-part-two)；官方正文，2025-01-24 | 沙虫尾迹表达巨大尺度；脚步扬尘与大沙流接续；飞行器爆炸、残骸坠地和后续火 / 沙冲击相继组织 | 地标与环境痕迹共同说明尺度；一次爆发可产生跨镜发展的后续接触，不用所有层同帧结束 |
| [DNEG：Anatomy of a Shot — The Gorge: Building the Blast](https://www.dneg.com/news/anatomy-of-a-shot-or-the-gorge-building-the-blast)；FX 负责人制作说明正文，2025-04-15 | 参考实拍爆炸后为银幕阅读调整曝光；尘土、树木受压、阴影与环境高光使冲击嵌入场景 | 将强度写成传播、局部光照和环境响应，保留高亮峰值与可读性；电影美术选择不当作严格物理定律 |
| [Framestore：Project Power](https://www.framestore.com/work/project-power)；官方案例正文 | 火焰角色的闪动光照影响沿途墙面 / 对手；使用真实燃烧参考；冲击背景扭曲、烟汽后果和冰晶成长均参与效果 | 特效光跟随源点与遮挡，热扰动局部化；冰 / 烟有表面或空间依附，光色不改变角色固有肤色 |
| [Framestore：Thor: Ragnarok](https://www.framestore.com/work/thor-ragnarok)；官方案例正文 | 水体规模与角色动作可见性需要平衡；巨型火焰细节与尺度匹配；雷电参考实际放电并调整运动 | 大场面保留表演和接触窗口；巨物不一律慢放；分层水体与电弧形状服务当前镜头 |
| [Framestore：Doctor Strange](https://www.framestore.com/work/doctor-strange)；官方案例正文 | 早期长曝光式火花 / 弯曲耀斑过于虚幻，团队逐步缩短火花并逐镜调节；灵体利用背光和负空间获得对比 | 火花长短、强度、疏密与寿命受控；透明度、暗部与留白也提供能量效果的结构，不能只追求更密更长 |
| [Wētā 作者：Pahi — A Unified Water Pipeline and Toolset](https://alexey.stomakhin.com/research/pahi.html)；作者网页与可见论文摘要，DigiPro 2023，未通读完整 PDF | 覆盖主体水体、飞沫、水雾、泡沫、气泡、涟漪、薄膜和滴流，整合不同现象而非单一方法包办 | 先有连续水量，再按接触 / 流动组织适用次级层；只据摘要采用覆盖范围，不编造内部算法或参数 |

### 4.2 3A 游戏

| 一手来源与阅读范围 | 资料明确支持的内容 | 本技能的应用推导 |
|---|---|---|
| [Blizzard：Diablo IV Quarterly Update — December 2021](https://news.blizzard.com/en-us/article/23746639/diablo-iv-quarterly-updatedecember-2021)；VFX 主管章节全文 | 主次阅读与视觉强度分配；命中位置 / 受力方向对应动画；特效接受环境光并用发光辅助阅读；放大技能不统一等比放大所有层 | 主形、局部运动、微粒分别承担职责；强度有峰值，威力增长可调整范围 / 运动 / 密度等不同维度，保留接触证据 |
| [PlayStation / Sucker Punch：How stunning visual effects bring Ghost of Tsushima to life](https://blog.playstation.com/?p=345372)；VFX 主管正文 | 风统一影响烟、火星、植被、布与绳；人物扰动草叶，草阻尼回弹，叶片可落地 / 落水；强调风格化运动美感 | 同一风场下不同材料有不同响应；允许美术夸张，环境不能各按互不相关的方向和节奏运行 |
| [EA / DICE / Frostbite：How Battlefield 6 reimagines destruction](https://www.ea.com/en-gb/amp/news/how-battlefield-6-redefined-destruction)；官方正文，2025-11-10 | 系统性破坏与控制并存；残骸改变空间，裂缝 / 表面效果按冲击与碎块状态触发，按视觉材质选效果并同步声音 | 接触点、材料、结构失效和后续残骸分开设计；下一镜继承场地变化，声画来自同一事件 |
| [Naughty Dog at GDC 2012](https://www.naughtydog.com/blog/naughty_dog_at_gdc_2012)；官方讲座介绍正文，未观看全部讲座 | 烟的翻卷 / 自遮阴、建筑内火焰深度、沙粒环境交互、主体洪水表面与补充粒子、粒子照明分别解决 | 主体介质与体积先成立，细粒补材质；成熟质量来自组织与照明，不取决于在提示词里点名新引擎 |
| [PlayStation / Square Enix：How Final Fantasy XVI harnesses PS5's power](https://blog.playstation.com/2023/03/30/ps5-creators-how-final-fantasy-xvi-harnesses-ps5s-power/)；主导演访谈正文 | 角色、环境、灯光 / 阴影共同提升精度；涵盖高速战斗和大型召唤兽场面 | 大技能与角色 / 场景保持质量和尺度一致；该文不支持任何特定技能的模拟配方，也不要求替换 FF7RE 人物设计 |

补充边界资料：

- [Guerrilla：The Real-Time Volumetric Cloudscapes of Horizon Zero Dawn](https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn)、[Nubis, Evolved](https://www.guerrilla-games.com/read/nubis-evolved)：本轮网页打开超时，采用搜索可见的官方摘要，仅支持云的形态、演化、光照协同以及近距离可穿行云 / 内部闪光的设计问题；不声称通读讲义。
- [GDC / Remedy：Destructible Environments in Control](https://gdcvault.com/play/1030643/Destructible-Environments-in-Control-Lessons)：只读课程页摘要，支持"超自然但有现实基础的风格及制作取舍"；未观看完整讲座，不将具体破坏算法归给 Remedy。

### 4.3 介质与材质技术补充

| 官方文档 | 可确证的技术关系 | 转为画面时的边界 |
|---|---|---|
| [SideFX：Pyro look development](https://www.sidefx.com/docs/houdini/pyro/pyro_look.html) | 源形状、时变供给、外力共同塑形；大尺度卷动与高频细节有不同控制；细节过强可变无序噪声 | 提示词描述主翻卷、局部边缘和供给变化，不写求解器参数；平顺层流也是有效设计，不强加湍流 |
| [SideFX：Shading and rendering](https://www.sidefx.com/docs/houdini/pyro/shading.html) | 烟密度 / 吸收与发光分开；内部光散射、烟对发光的遮蔽能形成层次 | 烟的厚薄、内光与暗部按现象选择，非发光介质不用强加亮芯；不把所有烟都做成火球 |
| [SideFX：Whitewater](https://www.sidefx.com/docs/houdini/fluid/whitewater.html) | 喷溅、泡沫、气泡作为主体流体的次级现象，流动 / 浮力 / 表面条件和寿命共同影响 | 主水体、表面泡沫、离水飞滴和细雾分工；不向 H3 输出 FLIP 或粒子寿命参数 |
| [SideFX：RBD Material Fracture](https://www.sidefx.com/docs/houdini/nodes/sop/rbdmaterialfracture-.html) | 混凝土、玻璃与木材有不同断裂模式；冲击点、木纹、破片簇和细碎剥落影响形态 | 按材料和构造写断裂、厚度及残留；金属屈曲、玻璃具体种类等进一步区分是本技能的材料设计应用，不冒称该页覆盖全部材料 |
| [Epic：Volumetric Fog](https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-fog-in-unreal-engine) | 参与介质的散射、消光、局部密度和灯光 / 阴影相互作用 | 写清局部浓淡、遮挡和受光，避免把雾当统一灰滤镜；不把性能 / 体素 / 渲染设置迁入视频提示词 |

### 4.4 采用原则与验证范围

`vfx-design.md` 的总体规则和 `vfx-families.md` 的十类策略是综合后的提示词设计，包含材料常识、导演选择与用户偏好，不是任何厂商的完整流程复刻。魔法、人工规则几何、无热 / 无烟 / 无破坏等设定拥有优先权；不将"物理可信"误写成所有效果都必须产尘、发热或持续残留。

电影 / 游戏常用贴片、缓存、程序化噪声和艺术调整；这些技术本身不廉价。本技能验收的是可见的深度、材料、时间、光照及剧情关系。**不得把"所有东西必须真实模拟"或"全片低饱和、全片慢放"设为唯一合格标准。**

本轮可验证：入口与引用可达、原有身份 / 动作规则保留、文本案例能遵守设定并表达作用 / 残留。需要真实视频才能验证：粒子时间稳定、实际细节质量、曝光、材质 / 形体生成、完整动作和最终观看效果。若取得成片，按 `quality-gate.md` 定位具体失败，保持其余条件尽量一致做针对性复测。

---

## 五、六道固定审美对照题（维护用）

仅用于维护者评估框架版本，日常出稿不加载。当前状态：题目已准备，尚无用户盲评或实际视频对照结果；**不能报告审美已经提升**。`aesthetic-examples.md` 是设计辅助，本题集用于新的同条件输出，不要求复现样例答案。

### 5.1 对照方法

1. 记录旧 / 新框架版本、模型及版本、采样设置、素材、完整需求和滑块状态；固定用户要求。使用独立会话，避免新版看到旧版答案。顺序随机为 A/B，对评审隐藏版本。至少保留一次独立复测，避免把单个幸运输出当稳定改善。
2. 六题默认关闭滑块，由文本明确锁定时长和镜数；T2VA，无参考附件、无台词、无配乐，16:9。题内风格优先。需要检索时记录来源与证据范围；两版尽量使用相同可用参考。没有旧版结果时先保留题目，不编造基线。
3. 文本层分别检查意图、可想象的主次 / 光色、动作与空间、节奏、约束保留。记录具体镜头和原因；没有可见画面不评价真实渲染效果。实际成片层另行比较，固定视频模型、素材、参数与预算，记录随机种子（若支持）；确认音画及动作后才能判断节奏。
4. 人评可选 A、B、平手、都不合格；每题写一个最主要原因和一个具体问题。不把 AI 自评分当人评，不以更多字、更复杂运镜、低饱和或更少动作自动判优。
5. 若新版改善某项却损害用户指定的动作、强度、风格或时长，单独记录退步；修规则后复测相关题及可能受影响的另一题。程序测试只检验格式与审核证据，不能代替这里的人评。

### 5.2 固定需求

| 题号 | 原样输入的创作需求 | 特别观察 |
|---|---|---|
| B1 情绪表演 | 8秒，3镜，3DCG。女孩站在晴天码头，看到渡船离开；她抬手想招呼，停住，再放下手。最后仍看着船。明亮暖色，无眼泪，无微笑，不新增道具和剧情。 | 行为中的情绪是否可读；会否自动改成阴雨、低饱和或哭泣；船与视线关系 |
| B2 双人互动 | 10秒，3镜，3DCG。明亮餐厅中两人面对面坐，甲把桌上的钥匙推向乙，乙按住钥匙，最后推回甲面前。不离座、不说话、不新增物件；交接过程必须看清。 | 关系变化是否通过调度发生；手、钥匙、目线和切点是否连续 |
| B3 高强近战 | 12秒，4镜，3DCG。甲持一柄长剑，乙持一柄短剑，在宽阔石阶侧向移动交锋。甲连续三次进攻，乙挡前两击，第三击被迫退下一阶但不倒地。大幅动作、小景别为主、强透视、关键短慢镜和鲜艳火花；不删攻击、不加武器。 | 动作因果、真实接触与位移；高潮区别；是否因保守而降幅 / 降强度 |
| B4 远距空间 | 10秒，3镜，三渲二游戏模型。两人站在相距100米的两座塔上，甲释放红色能量矛，乙侧身躲开，能量矛击中乙身后的石墙。距离和两座塔不变，不出现近身交锋。 | 尺度、传播路径、方向承接、近景与世界距离是否兼容 |
| B5 大型特效 | 12秒，4镜，三渲二游戏模型。角色抬起双臂，巨大青金色能量潮从前方涌向城门，击穿城门后逐渐消散。高饱和、铺满画面的规模和猛烈破坏均保留；角色不飞起、不追加召唤物。 | 来源 / 主形 / 接触 / 后果是否分层，材质和环境受光，是否变成全屏等亮噪声 |
| B6 角色展示 | 8秒，一镜到底，3DCG。披风剑士站在白昼山脊上，转身拔出唯一长剑，剑尖向斜下方停住；镜头从正侧向斜前方移动，保持全身可见。大幅动作、清晰衣装和金属质感；不慢放、不切镜、不改服装。 | 全身轮廓与拔剑可读、运动动机、材质分离、指定镜头与正常速度保留 |

### 5.3 空白评审记录

运行日期：待填写；旧版标识：待填写；新版标识：待填写；文本模型 / 设置：待填写；视频模型 / 设置（如有）：待填写。生成结果路径与 A/B 对应表分开保存，评审完成后揭示。

| 题号 | 文本选择 A/B/平手/都不合格 | 具体镜头与原因 | 约束违背 / 退步 | 成片选择与时间段（未生成填未验证） |
|---|---|---|---|---|
| B1 | 待评 | 待评 | 待评 | 未验证 |
| B2 | 待评 | 待评 | 待评 | 未验证 |
| B3 | 待评 | 待评 | 待评 | 未验证 |
| B4 | 待评 | 待评 | 待评 | 未验证 |
| B5 | 待评 | 待评 | 待评 | 未验证 |
| B6 | 待评 | 待评 | 待评 | 未验证 |

验收采用逐题原因和最差案例的变化；不得以平均分掩盖空间崩坏、丢失用户动作或风格漂移。首次人评结果进入样例维护记录后，再把相应处理标为"用户认可"，保留适用范围。

---

## 六、"加强一倍"这类要求的落地方式

"加强"落实为：**全局约束 + 风险镜局部约束**双层写入，加上独立的档位 / 表演验收与切点 / 空间验收，以及独立的特效质感一轮。12 项 CG 覆盖用于查缺，不是效果提升倍数。**没有同条件生成对照时，不报告"成功率翻倍"或"已完全一致"。**
