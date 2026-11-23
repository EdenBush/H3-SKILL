# 角色三大视觉档位：默认 3DCG 档、游戏内三渲二实机建模档 与 真人电影档

**这份文件回答三个问题**：这一稿用什么视觉媒介、这套媒介的硬约束是什么、写进提示词时用哪些词。

三套档位**相互独立、绝不混用**。混用措辞的后果不是"风格更丰富"，是"动漫脸配真人毛孔"——面部身份在每一镜之间漂移，而且无法从成片反推原因。

| 档位 | 什么时候用 | 一句话目标 |
|---|---|---|
| **默认 3DCG 档**（FFVII REMAKE 严格 CG 档） | 用户未指定三渲二或真人 | 精心雕塑、绑定、动画化的三维角色；明确的动画电影 / 游戏过场 CG 身份 |
| **游戏内三渲二实机建模档** | 用户说"三渲二""3渲2""二次元3D建模"，或点名《鸣潮》《绝区零》《崩坏：星穹铁道》实机模型风格 | 次世代二次元动作 RPG 的游戏内实时 3D 模型；保持三维体积，不退化为 2D 立绘或手绘番剧 |
| **真人电影档** | 用户说"真人""真人电影""实拍""真人电影质感" | 院线级大画幅实拍光学质感；杜绝深法令纹、油腻皮肤、高对比高饱和、用力过猛四类 AI 通病 |

**与 H3 的关系**：视觉档位就是剧集工作流第 1 步里的**风格锁**（见 `series-workflow.md` 第 1 步）。同一稿里，风格锁原文逐字复用——图片资产与视频提示词共用同一句，不许同义替换。对模型来说，"cinematic" 和 "filmic" 不是同一个意思，是两个要求。

**档位不是效果保证**。以下规则是把公开制作经验转成提示词的可写准则，不是渲染器参数；H3 不会调用 Bonamik、FLIP、Niagara 或任何求解器。制作事实与适用边界见 `sources.md`。

---

## 零、怎么选档（三个判据，按顺序问）

```text
1 用户说了什么？
   提到"三渲二 / 3渲2 / 二次元3D建模 / 鸣潮 / 绝区零 / 星穹铁道"  → 三渲二档
   提到"真人 / 实拍 / 真人电影质感"                                  → 真人电影档
   什么都没说                                                       → 默认 3DCG 档
2 有素材吗？素材媒介与档位冲突吗？
   真人照片或二维立绘当身份参考 → 按选定档位**转译**身份，不照搬媒介（规则见 delivery.md）
   用户明确指定必须原样保留的首/尾帧 → 该帧优先于默认档位
3 用户同时要求了互相排斥的东西吗？
   （例：原样真人帧 + 全片纯三维动画）
   → 指出这一个具体冲突，解决素材用途或帧版本；不得假称同时满足
```

**只指定运镜、调度、打斗节奏的参考作品时，角色渲染不跟着换**——沿用本稿已选的档位。

---

## 一、执行方法：全局锁定 → 风险镜落实 → 全片复核

- **首镜建立完整媒介**：媒介（三档之一）、角色形体、肤质/材质基准、实际主光。不能只有作品名、"电影感""3DCG""三渲二""真人"几个字——这些词不构成可执行约束。
- **正文只写本镜可见、能影响结果的约束**；看不见的项内部标记"不适用"，不为凑项给光头加头发、给硬甲加飘动。
- **风险镜就地强化，不是逐镜粘贴长模板**。需要就地补锚的镜头：
  - 可辨口型的说话、微笑、哭泣、强情绪 → 补面部平滑度、口型与肤质锚
  - 脸部近景 / 特写 → 补身份、体积与表面锚
  - 彩色光照脸 → 补"底色/妆容"与"受光"的分离
  - 转身、急停、被推 → 补衣发响应
  - 接触、打斗 → 补发力路径与接触
  - 反打、换景 → 补实际光源与材质承接
- **不出现相互抵消的媒介目标**：检查 `photorealistic`、`live-action`、`real actor`、`documentary`、`shot on film` 等词在当前档位下会不会把角色推成实拍。是三渲二档时，同时排除 `flat 2D illustration`、`splash art` 等平面措辞。用户明确要真人或混合媒介时才切换目标。
- **档位词库只取短组合**，不整库粘贴。下文第五节的词库按"优先保留 / 按条件选用 / 改写或不作默认"三层组织，按当前场景选 3–6 个短语即可。

**跨风格覆盖必须三件套**（详见 `reference-slots.md` 第三节）：槽位声明里排除旧渲染 → 镜头首句钉死目标风格 → 细节处（皮肤、汗、高光）复述目标风格。缺一件就会出混合风格。

---

## 二、默认 3DCG 档：12 项可验收约束

目标是《最终幻想 VII Remake》式的风格化半写实角色 CG：人物是精心雕塑、绑定和动画化的三维角色，材质与环境有可信物理响应，整片保持明确的动画电影 / 游戏过场 3DCG 身份。

### 1. CG 媒介与完整世界

首镜明确 `fully computer-generated character animation`、`FFVII REMAKE-inspired stylized character CG`。人物、头发、服装和环境接受一致的三维光照与运动，不出现真人脸贴进 CG 身体、真人摄影质感中套游戏服装的混合观感。高细节和写实物理服务 CG 设计。排除项只用一条简短媒介边界，不堆长负面词库。

### 2. 角色雕塑与形体

锁定头身关系、面部骨点、眼距、鼻唇形态、颌线、四肢比例、主发束轮廓与服装体积。三分之四侧脸、仰俯视和透视变化仍由同一模型产生；不把转头误写成"面部形状完全不变"。轮廓清楚、面部过渡经过美术整理，微细节不吞没大形；不能用过度磨皮或二维涂抹冒充风格化。

多视图参考先按 `delivery.md` 划定属性来源。对于"上方面部特写、下方全身三视图"的版式，所有景别、转头、说话和表情都继承上方唯一面部身份；下方只提供身体、衣装、装备及其负责的整体轮廓，不能用下方小脸或灰色空白脸替换面部。头身尺度与脸内五官比例分别处理，身体换视角不触发换脸。

### 3. CG 皮肤、面颊底色与微表面

先锁用户角色原有肤色与妆容。默认面颊与额头、下颌的底色协调，局部色差柔和、红色不突出，**不自动添加两团粉红腮红、鼻尖红或眼下红**。低腮红不等于美白、全脸去色或统一冷白皮。已有妆容按用户要求保留；用户明确要红妆、害羞泛红或受伤红肿时，按指定范围与强度表达。没有这类要求时，微笑、说话和用力不自动触发持续增红。

保留柔和的表层体积过渡、局部受控高光和细微粗糙度差异。皮下散射用于软化受光过渡，不用"红润通透、血色充盈、强烈皮下透光"作为默认肤质目标；耳缘等薄处仅在适当逆光下有克制透光，不将整片面颊染成红蜡。近景可以保留细尺度纹理，但不默认逐镜强调毛孔、绒毛或血管。FF7RE 并非零毛孔；不能以真人扫描式微细节接管角色设计，也不以磨皮制造蜡、橡胶或瓷娃娃般统一表面。年龄、既有皱纹和伤疤持续；汗、泪、雨只改变有来源的局部湿润。

**分清三件事**：底色/妆容附着于角色表面，光色随光源、朝向与遮挡变化，表情阴影随形体变化。暖光可使受光区变暖，却不能无因生成对称腮红斑；彩光退去后回到已建立底色。

### 4. CG 表情形变与强表演

把情绪强度、表情幅度和皮肤细节密度分开控制。以**同一绑定 CG 角色的表情形状连续过渡**组织表演：根据触发事件选择眉形、眼睑开合、嘴角、下颌与必要的面颊形变，配合视线、呼吸和身体节奏；不把"真人演员级微表情、真实肌肉纤维/皮肉颤动"作为默认表演目标。允许剧情需要的大幅表情，不能因防真人化而一律减小幅度。

微笑时嘴角提升与面颊抬起来自同一模型，鼻翼、唇厚、眼形和颌线保持设计一致；不是把脸部每个点锁死。下颌转动、唇部拉伸和面颊压缩保留骨相与体积；动态折痕只表现这次形变所需的结构，不额外堆深沟、皮肤褶皱或松垮肉感。既有年龄纹理继续存在。

沿起势—峰值—释放检查实际呈现的阶段：不能在怒吼峰值换真人脸、突然长出深法令沟、面颊塌陷或年龄漂移。局部句应同时包含**具体表演 + 身份/体积保持 + 肤质保持**：

```text
Her brows lower and her jaw opens into the full shout, with the eyelids and lips following the same sculpted CG expression; cheek volume, facial identity and age remain coherent through the peak and release, while the established complexion and fine CG skin finish stay stable beneath the scene light.
```

### 5. 眼球、视线与口腔

指定眼神目标及必要的注意力转换；眼球转动与眼睑包覆联动，双眼对同一距离聚焦，眨眼有情境。眼部高光对应场景灯，泪膜集中于合理位置，不做发光玻璃球。张口/说话时保持嘴唇厚度、牙列与舌头所在空间，唇颌配合发音；不以乱动瞳孔、机械频繁眨眼或嘴单独开合模拟"活人感"。

**普通说话也逐段锁 CG。** 有可辨口型的台词即落实：口型随音节和语气连续变化，唇部闭合/展开、下颌开合与表情协调，停顿承接当前情绪。唇缘、唇厚、牙列尺度、口角位置与颊部体积由同一模型连续形变；不因开口切换真人嘴、牙龈和高湿唇部特写。

```text
As she speaks, articulated CG lip shapes and jaw motion follow the syllables; her sculpted cheeks, designed lip thickness and established facial proportions remain coherent, with the established complexion, specified makeup and fine CG skin finish beneath the changing light.
```

### 6. 发型结构与发丝受光

大形首先由稳定的主发束/发簇决定，再有次级分束和边缘细丝；根据用户发型区分短硬发束、刘海、辫子、长发或束发。顺着发丝走向的细长高光随头部与光线改变，束间有透气间隙和柔和遮蔽。发量、分缝、发际线与主轮廓跨镜稳定，不成实心头盔、假发塑料片，也不变成无结构的烟丝。

### 7. 发丝动力学

运动由**头/躯干加速度或已建立风场 → 发根随动 → 中段与发梢滞后 → 有限越位 → 阻尼落定**产生。固定点和发型结构保持，短硬发束小幅弹性响应、长发弯曲传播，不能所有发丝同相同幅摆动。头停后尾部可继续，但幅度衰减；静空气里不永动。头发碰肩、衣领、脸和道具时发生滑动、弯曲或受阻，不穿透。风力、重力和速度在世界中定义，切镜不重置发丝相位。头发或布料尚在运动就切镜时，保存当前位移和速度趋势，在下一镜延续。

### 8. 布料动力学与层次

先识别固定处、厚薄、重量、柔硬、裁片和内外层，再写运动：肩/腰/扣带带动布面，折痕从受力处传递，游离下摆滞后；急停后前摆，随后受重力落回并逐渐平息。厚外套呈较重的大褶与有限弯曲，薄布细褶更敏捷，皮革较挺，硬甲基本保持刚体。衣层之间、布与腿/武器之间保留接触和遮挡顺序，衣缘不穿身、缝线不游走、长度和厚度不跳变。

### 9. 身体动作幅度、发力与动画节奏

先给该角色本次动作的**意图、幅度等级、支撑、发力路径和终态**，不笼统写"自然动作"。日常表演用有选择的重心变化和手势；高节奏战斗的主要打击默认肢体打开、大开大合，以肩髋转动、躯干张弛、支撑转换和展开的肢体/武器轨迹形成强轮廓，配合短促爆发与清楚的关键姿态。风格化关键姿态与可信重量并存，动作之间有速度连续性。

### 10. 各类材质独立响应

| 可见材料 | 必须能区分的表现 |
|---|---|
| 布 | 织纹尺度随景别合理变化、边缘厚度、承重褶皱及柔和反射；不统一绸缎亮 |
| 皮革 | 较挺的折弯、局部微光泽、使用处磨损；不与棉布或乳胶同质 |
| 金属 | 高光/环境反射随角度滑动，粗糙度区分抛光与磨砂；棱边、刃厚与接合可信 |
| 硬甲/塑料/涂层 | 按设定保持结构、表面粗糙度和涂层关系，不因"CG"全变亮塑料 |
| 湿表面 | 水膜只在有水处改变反射，水滴沿表面/重力发展，不把整个人均匀上油 |

同一件物品跨镜的纹理尺度、粗糙度、损坏和湿度不重置。

### 11. MJ 式美术光影与世界光源

MJ 指 Midjourney 的光影审美参考，不是统一的灯光配方。有指定样图时提取其主光方向/面积、明暗比例、过渡软硬、光色关系和前后景分离。没有样图时采用下列美术默认：

- **主光塑形**：先写实际来源和世界位置，如西侧高窗。用方向清楚、面积合适的主光，让额头、颧面、鼻梁和颌线呈现清楚的大形与柔和衔接。
- **明暗与高光**：主次明暗有秩序，暗部深而保留必要的色彩、体积和表演信息；亮部平顺收束，鼻尖、额头与面颊高光面积受控。
- **色彩与空间**：从场景选定主光和环境反射的色彩关系，主体和背景通过明度、色彩或焦点层次分开。

### 12. 镜头、后期与时间稳定

采用清楚的虚拟摄影空间，景深、运动模糊、辉光与雾有选择地服务观看；关键接触和动作相位仍能辨认。每次切换、开口说话、微笑和动作峰值后核对：模型身份、面颊底色/妆容、口周形体、纹理/高光、发束结构、衣料厚度、光源方向、未落定的衣发都连续。

---

## 三、游戏内三渲二实机建模档：7 项专项（第 7–9 项动力学与动作沿用第二节）

用户指定某一作品作为外观参考时，以该作品的实机角色渲染为主；其他作品仅用于解释通用技术。若只指定某作品的运镜、调度或打斗节奏，角色渲染沿用本稿的选档。

采用**《鸣潮》《绝区零》《崩坏：星穹铁道》游戏内实机 3D 角色模型风格**：

### 1. 游戏内 3D 模型体积与非平面化（In-Game 3D Model Geometry）

角色、服装、头发与武器是具有完整三维几何网格（3D mesh volume）、骨骼绑定和准确空间透视的**游戏内实时 3D 模型**。在三分之四侧脸、仰俯拍、环绕运镜与大透视挥砍中，头部颅骨、胸腔、四肢、裙摆厚度与武器空间朝向呈现扎实的三维立体穿插。明确区分于 2D 平面立绘（2D splash art/sprite）或纯 2D 手绘赛璐璐动画，不压扁为纸片人；同时明确区分于 FF7RE 半写实 3DCG，不混入半写实 CG 皮肤散射与细碎毛发描述。

### 2. SDF 面部平滑二分卡通光影（SDF Clean 2-Tone Facial Shading）

脸部受光遵循次世代二次元 3D 游戏的距离场（SDF）面部法线逻辑：主光在面部形成边缘干净、过渡柔顺的**卡通二分明暗交界线（clean 2-tone cel-shaded facial lighting with soft artistic ramp）**。无论光源角度如何变化，鼻翼两侧、眼窝与面颊均保持干净的二次元色块，不出现写实三维渲染的脏黑鼻影、眼下黑斑或凹陷颧骨沟。

### 3. 纯净无毛孔卡通肤质与克制面颊底色（Poreless Anime Skin & Restrained Cheek Color）

皮肤表面为纯净无瑕的哑光卡通着色（smooth poreless matte anime skin shader），无写实毛孔、绒毛或胶片噪点。面颊底色与全脸均匀协调，仅在明暗交界处带轻微暖色阶过渡（subtle warm shadow ramp），默认不额外添加浓重腮红斑。说话、微笑与强情绪爆发时保持纯净二次元三维肤质，不长出写实法令纹或肌肉褶皱。

### 4. 三渲二五官建模与口型绑定（3D Anime Facial Rig & Lip-Sync）

眼部保留立体建模的眼眶、三维睫毛层与高清透度的多层高光二次元虹膜（crisp multi-layered anime iris shader with layered specular highlights）；鼻梁以精炼的三维体块配合点状/线状受控高光呈现。对白与表情由**同一三渲二角色模型的绑定口型与混合形状（articulated 3D cel-shaded lip-sync and facial blendshapes）**连续驱动，口腔结构干净简洁，不因开口说话变成真人嘴唇或写实牙床。

### 5. 三维几何发束与条带状天使环高光（Sculpted 3D Hair Clumps & Specular Band）

头发由体积饱满、分束清晰的**三维几何发束/发片（sculpted 3D anime hair clumps and layered sections）**构成，发梢收尖利落，不采用写实 CG 的单根细碎毛发。发面明暗色阶分明，并带有顺应发束弧度滑动的**卡通条带状/锯齿状高光环（stylized cel-shaded anisotropic angel-ring specular band）**。

### 6. 风格化 PBR 与卡通着色混合材质（Hybrid Cel-Shading & Stylized PBR Materials）

将清爽的卡通色块与鲜明的风格化 PBR 材质分离结合：

- **金属饰件与武器**：锐利的高光切面（sharp metallic specular facets）与受控环境反射；
- **皮革、漆皮与机能护具**：干脆的高对比条状反光与挺括折面；
- **丝绸、薄纱与丝袜**：视角相关的菲涅尔边缘微光（Fresnel rim sheen）与半透明层次；
- **布料衣褶**：三维建模体积与法线呈现干净利落的结构折线，避免杂乱写实织物噪点。

**作品微调倾向**：点名《绝区零》时突出潮流机能皮革/金属反差与富有弹性的关键帧姿态；点名《崩坏：星穹铁道》时突出精致礼服金饰层次与温润 SDF 面部色阶；点名《鸣潮》时突出修长骨相比例、深邃冷暖光影对比与丝绸/飘带动力学；仅说"三渲二"时综合三者实机建模优势。

### 7. 极细本色内描线与硬边轮廓光（Fine Colored Outlines & Crisp Rim Light）

角色外轮廓、领口、衣缝与五官转折处带有极细且粗细受控的**本色深化描线（fine variable-width colored inner and outer ink outlines）**，精致利落而非粗黑美漫描边。配合方向明确的**锐利卡通硬边轮廓光（crisp cel-shaded rim light）**，将三维角色模型从背景中清晰剥离。

---

## 四、真人电影档：7 项硬约束（四大 AI 通病的对症锁）

当用户指定真人质感时，切换到**院线级实拍电影摄影模式**。针对生成式 AI 在真人面部最容易翻车的四大顽疾——深法令纹、油腻塑料皮、高对比高饱和、用力过猛的五官抽动——逐镜落实：

### 1. 杜绝 AI 深法令纹与沟壑雕刻感（Youthful Uncreased Mid-Face & Minimal Jaw Drop）

- **问题根源**：AI 视频模型在生成真人说话、哭泣、悲伤或情绪宣泄时，极易过度激活颧大肌与上唇鼻翼提肌，在鼻翼两侧至嘴角刻出刀割般深陷的黑线（deep nasolabial creases / marionette lines），导致人物瞬间显老十岁、AI 雕刻感极重。
- **全局与逐镜硬约束**：
  1. 全局风格锁开头写入：`youthful smooth uncreased cheeks, completely flat and seamless nasolabial transition beside the nose and mouth, zero nasolabial folds, zero marionette lines, and zero forehead creases`；
  2. **说话与情绪爆发镜头的动态保护**：在每一个开口说话、哽咽或哭泣的镜头内就地加入反向锁定：`keeping his/her mid-face, mouth corners, and nasolabial zone completely smooth and uncreased with minimal jaw opening`——以极小下颌开合度与松弛的嘴角吐字，绝不向两侧拉扯苹果肌或挤压鼻翼沟壑。

### 2. 杜绝油腻反光与塑料蜡像感（Natural Matte Skin Finish & Zero Oily Specular Glare）

- **问题根源**：AI 常把"写实皮肤高光"误解为满脸涂油、出汗反光或塑料假人模特般的镜面高光（oily sheen / sweaty specular highlights / waxy plastic skin）。
- **硬性约束**：锁定**自然哑光微绒电影肤质（natural matte skin finish, soft diffused epidermal reflectance, subtle organic micro-texture, zero oily sheen or plastic specular glare）**。即使角色落泪，反光也只集中在**单道狭窄的泪水轨迹**上——眼眶泪膜、下睫毛上的一滴、或颊面一条湿痕，三者按剧情选用；全脸其余皮肤仍保持清爽哑光。

### 3. 杜绝高对比度与高饱和度：高危暖色/红色物体的去饱和降维锁

- **问题根源**：场景或服装中存在暖黄街灯（`warm-amber`）、红电话亭（`red telephone booth`）、红围巾（`burgundy-red`）等鲜艳元素时，仅写一句 `restrained saturation` 不足以阻止 AI 渲染出高饱和度、高对比度的数码 HDR 滤镜感（肤色泛橘红、暗部死黑）。
- **硬性约束**：
  1. **全局色调锁**：`heavily desaturated, low-saturation cinema color grade, muted slate-grey and pale dusty-amber tones, soft low-contrast diffused lighting, smooth logarithmic highlight roll-off, lifted milky shadows, completely eliminating digital HDR contrast and color oversaturation`；
  2. **逐物体色彩降维修饰**：正文中凡提及红色、暖黄或鲜艳环境/服饰词，全部冠以 `muted`、`pale`、`dusty`、`faded` 等修饰词。如 `glowing red telephone booth` → `muted red telephone booth`；`burgundy-red scarf` → `muted burgundy scarf`；`warm-amber streetlamp` → `pale dusty-amber streetlamp glow`。

### 4. 严禁在 H3 提示词正文中泄露 `FACS` 或 `AU` 编号代码

- **问题根源**：在 H3 提示词中直接写入 `(FACS AU1/AU4)`、`(FACS AU7)`、`(FACS AU17)` 等学术代码缩写，会被视频生成模型的文本编码器误读为"强化面部肌肉变形"的触发词，反而诱发面部肌肉抽动与深法令纹。
- **硬性约束**：**FACS 编码仅用于内部导演分析，最终输出的 H3 英文提示词正文中严禁出现 `FACS`、`AU1`、`AU4`、`AU7` 等任何代码字样。** 必须 100% 转译为温和、具象的日常解剖可见描述：`his inner brows draw slightly together`、`a millimeter tightening of her lower eyelids`、`his lower lip margin quivers subtly`。
- **自查**：`scripts/check_prompt.mjs` 会扫描正文中的 `FACS` / `AU\d+`，命中即失败。

### 5. 真人光学摄影机与镜头呼吸感（Optical Cinema Lens & Depth of Field）

采用真实大画幅球面定焦或变形宽银幕镜头（如 ARRI Alexa 65 + Cooke S4 Prime）的光学特性：焦点精准锁在近侧瞳孔（precise iris focus），前景与背景呈现温润有机的光学虚化与柔和边缘失光（creamy optical bokeh and natural lens fall-off），拒绝数码锐化。

### 6. 真人发丝与真实衣物物理（Authentic Hair Strands & Tactile Garments）

头发呈现真实人类发丝的自然蓬松度与受控漫反射光泽，不糊成塑料块；衣物呈现真实粗花呢、羊毛、风衣面料的物理垂坠感与急停惯性摆动。

### 7. 真人口型与台词自然协同（Natural Conversational Lip-Sync）

真人说话时采用日常交谈式的松弛口型（natural conversational articulation with relaxed jaw and minimal mouth opening），不张大嘴夸张咬字，不牵拉鼻翼两侧法令纹，发音间隙保留真实的微呼吸、吞咽与视线转移。

**真人档的表演层**（多拍微表情、泪水的三种物理状态、拒绝直视的决绝链）见 `acting-performance.md`。档位锁肤质与光影，表演锁微动作，两件事分开验收。

---

## 五、三档词库：按档位选用，不混库

**词库是短组合的来源，不是万能底座。** 每稿选与可见材料、场地和情绪有关的 3–6 个短语。

### 5.1 默认 3DCG 档词库

优先顺序：完整 CG 模型与身份 → 柔哑皮肤及受控散射 → 方向性柔光 → 各材料独立响应 → 调色与画面稳定。

**优先保留**

| 类别 | 精选英文词 | 要写出的画面结果 |
|---|---|---|
| 三维模型 | `premium AAA character CG`; `clean high-fidelity 3D geometry` | 同一雕塑角色有清楚轮廓、面部体积及衣层厚度，人物和环境属于同一个 CG 世界；细节不吞没大形 |
| 皮肤 | `soft matte CG skin shader`; `controlled subsurface scattering`; `fine natural skin microstructure` | 柔哑漫反射为主、局部小面积受控高光，薄处在合适逆光下轻微透光，近景细纹理不爬动；保留原有肤色和年龄 |
| 面颊 | `even neutral cheek pigmentation` | 面颊底色与原肤色协调，不因说话/微笑添加两团粉红；不抹掉指定妆容、伤痕或正常光色 |
| 发型 | `clean volumetric hair sections`; `natural scalp and crown volume`; `soft continuous anisotropic reflections` | 主发束体积、分缝和发际线稳定，次级发丝有间隙；高光顺发向移动，不能变头盔或塑料条 |
| 衣装 | `realistic fabric thickness`; `natural gravity-driven folds`; `precise structural seams`; `coherent garment construction` | 织纹尺度合景别、缝线附着、边缘有厚度、受力处生成褶皱；布/皮/金属分开，不将全部衣料设为哑光织物 |
| 柔光 | `large diffused cinematic key light`; `gentle ambient fill`; `soft gradual shadow transitions` | 指明场景内主光来源、方向与面积，以柔和过渡塑造体积，补光只保留必要暗部信息，不能抹平明暗 |
| 高光与空间 | `smooth filmic highlight roll-off`; `preserved highlight and shadow detail`; `soft contact shadows` | 亮部平顺收束且不泛白，接触处有合理阴影，前中后景有分离，细节不靠锐化 |
| 调色 | `clean neutral color balance`; `cinematic color separation`; `realistic skin color reproduction` | 同场镜头有一致白平衡和色彩关系，肤色底层稳定，主色与强调色有主次，亮暗保留必要层次 |

**按条件选用**

- `subtle warm-cool color contrast`、冷环境加暖主光：场景与叙事支持才用，不固定青橙配方。
- `restrained saturation`、`soft low-contrast cinematic tonality`：适合柔和影调，不强制所有戏低饱和低对比；强情绪、鲜艳魔法和硬光按故事保留。
- `matte woven technical textiles`、尼龙、棉混纺、丝混纺：只用于角色确有的面料，不能改变用户衣装。
- `gentle cinematic rim lighting`、体积雾与光束：要有对应光源和介质，不给每镜添加轮廓灯或烟雾。
- 85mm、平视、居中全身、无影墙、灰/白棚背景：仅角色设定图或用户指定的展示镜。故事分镜按空间、视点、动作和镜头夸张程度选择；85mm 不是全身照或高级 CG 的通用保证，透视还取决于机位距离。
- `MJ-style soft cinematic lighting`：只作审美简称，随后必须落实光向、软硬、明暗和空间层次，不附 MJ 专用参数。

**改写或不作默认底座**

| 原词 | 处理 |
|---|---|
| `high-poly digital human`; `accurate digital human facial anatomy`; `photorealistic AAA rendering`; `realistic photography` | 改为 `sculpted stylized CG character`、`coherent CG facial volume` 和可信 CG 材质，防止滑向真人；用户明确要真人时才切换媒介 |
| `UE5 cinematic rendering`; `physically accurate PBR`; `high-poly` | 可作质量简称，不能替代可见材质、体积和光照描述，不声称视频模型实际调用引擎或物理解算 |
| `porcelain-pale skin`; `natural bare-face appearance` | 不自动加入：前者可能改肤色并引发瓷像感，后者可能抹掉既有妆容 |
| `matte translucent skin`; `high skin surface roughness` | 改为柔哑表面、局部受控高光和薄处克制透光；不把全脸变半透明，也不统一最高粗糙度 |
| `wax-like translucency`; `luminous skin`; `glossy/shiny skin` | 默认柔哑目标下不选；湿润/油光确由剧情产生时限定部位与时段 |
| `ultra-detailed skin microdetails`; `masterpiece`; `best quality`; `8K` | 删去重复质量口号；按景别保留必要细节，避免粗颗粒、过锐和蜡塑观感 |
| `large diffused studio softbox`; `seamless studio cyclorama` | 场景照明改写为实际窗、天空或灯具；不把故事背景换成摄影棚 |

### 5.2 三渲二档词库

**优先保留**

| 类别 | 精选英文词 | 要写出的画面结果 |
|---|---|---|
| 游戏内 3D 模型体积 | `in-game 3D cel-shaded character model`; `stylized anime 3D geometry with solid volumetric perspective` | 角色具备《鸣潮》《绝区零》《崩坏：星穹铁道》游戏内实机 3D 模型的立体体积与准确透视，转头与大角度机位下保持扎实三维结构，不扁平化为 2D 立绘 |
| SDF 面部二分光影 | `clean SDF 2-tone cel-shaded facial lighting`; `smooth artistic shadow ramp`; `clean shadow steps across nose and cheeks` | 面部受光呈干净利落的二次元二分明暗交界线，明暗交界带柔和色阶（ramp），鼻翼与眼下无杂乱写实黑斑或凹陷阴影 |
| 卡通皮肤与面颊 | `smooth poreless matte anime skin shader`; `restrained neutral cheek color` | 纯净哑光无毛孔的二次元三维皮肤，面颊底色均匀克制，说话或大表情不产生写实皱纹、毛孔或油光 |
| 五官与绑定口型 | `crisp multi-layered anime iris shader with layered specular highlights`; `3D modeled eyelashes`; `articulated 3D cel-shaded lip-sync and facial blendshapes` | 高清多层高光二次元瞳孔与立体眼睫毛，口型与表情由同一 3D 卡通模型连续形变驱动，不切换真人嘴唇 |
| 几何发束与高光环 | `sculpted 3D anime hair clumps`; `clean cel-shaded hair shadow steps`; `stylized anisotropic angel-ring specular band` | 饱满立体的三维几何发束（区别于写实细碎毛发丝），发面明暗色块干净，带顺发束滑动的条带状卡通高光 |
| 混合风格化 PBR 服饰 | `hybrid NPR cel-shading and stylized PBR materials`; `sharp metallic specular facets`; `sleek high-contrast leather`; `structured 3D garment folds` | 主色块保持清爽卡通色阶，同时鲜明区分锐利金属高光切面、干脆皮革反光、半透明薄纱/丝袜菲涅尔边缘与立体建模衣褶 |
| 描线与硬边轮廓光 | `fine variable-width colored inner and outer ink outlines`; `crisp cel-shaded rim lighting` | 极细且粗细受控的本色深化内描线与外轮廓线，配合锐利的卡通硬边轮廓光，将 3D 角色从背景中利落剥离 |

**改写与区分**

| 易混词 | 在三渲二档中的处理 |
|---|---|
| `FFVII REMAKE CG`; `semi-realistic 3D CG`; `soft subsurface scattering`; `fine skin pores` | 改为 `in-game 3D cel-shaded character model`、`clean SDF 2-tone facial shading`、`smooth poreless anime skin shader`，避免三渲二滑向半写实 3DCG |
| `2D anime illustration`; `splash art`; `flat 2D cel animation`; `hand-drawn 2D frame` | 改为 `volumetric 3D cel-shaded character model with accurate 3D perspective and camera parallax`，避免三维实机建模退化为平面立绘或纯 2D 手绘番剧 |
| `thick black comic outlines`; `heavy manga hatching` | 改为 `fine variable-width colored ink outlines`，保持次世代游戏实机模型的精致边缘 |

### 5.3 真人电影档词库

**优先保留**

| 类别 | 精选英文词 | 要写出的画面结果 |
|---|---|---|
| 光学摄影与胶片媒介 | `shot on 35mm Kodak Vision3 film`; `ARRI Alexa 65 large-format cinema camera`; `Cooke S4 / ARRI Signature Prime optical lens`; `fine organic film grain` | 真实院线大画幅电影摄影机与定焦光学镜头质感，自然的浅景深散景与细腻有机的银盐颗粒，拒绝廉价数码视频感与过度锐化 |
| 去法令纹与饱满面颊 | `supple cheek volume`; `smooth and soft nasolabial transition`; `relaxed mid-face soft tissue without deep-carved nasolabial folds or harsh marionette creases` | 面颊饱满自然，鼻翼至嘴角过渡柔和顺滑，说话、微笑或情绪变化时绝不拉出刀刻般深陷的法令纹、木偶纹或干瘪老态褶皱 |
| 清爽哑光电影肤质（去油光） | `natural matte skin finish`; `soft diffused epidermal reflectance`; `subtle organic skin micro-texture with fine vellus hair`; `zero oily sheen or plastic specular glare` | 皮肤呈清爽透气的自然哑光微绒漫反射，额头、鼻梁与颧骨绝无油汗反光、蜡像塑料光斑或假人美颜磨皮感 |
| 柔和低对比度与高光滚降 | `smooth logarithmic highlight roll-off`; `soft low-to-medium filmic contrast`; `gentle shadow fall-off with lifted readable darks`; `large diffused motivated window/practical key light` | 亮部像胶片一样平顺柔和收束不过曝，明暗交界线宽广温润，暗部通透有空气感而不死黑，拒绝刺眼硬光与高对比度数字切割 |
| 克制低饱和电影调色 | `restrained desaturated cinema color palette`; `neutral authentic skin tone reproduction`; `subtle tonal separation` | 整体色彩饱和度克制内敛，肤色还原真实中性（不泛橘红或死白），环境色彩雅致沉稳，拒绝高饱和霓虹糖果色 |
| 内敛银幕演技（可见微动作，不写编号） | `understated screen acting`; `relaxed lower face and jaw`; `nuanced ocular focus and natural catchlights`; `quiet breath modulation` | 表演克制内敛、毫不费力：靠眼神聚焦、眼睑微张力、呼吸起伏和毫厘级唇角变化传情，中下脸肌肉松弛，绝不用力过猛、挤眉弄眼或张大嘴咆哮 |

**高危禁用 / 强制改写**

| 易引发 AI 伪影的词 | 翻车后果 | 强制改写 |
|---|---|---|
| `ultra-detailed pores`; `deep wrinkles`; `hyper-realistic skin creases`; `intense facial lines` | 触发 AI 过度雕刻通道，生成刀割般的深法令纹、木偶纹与显老沟壑 | 改为 `supple cheek volume, smooth nasolabial transition, natural matte skin finish with subtle soft micro-texture` |
| `dewy skin`; `glossy skin`; `sweaty face`; `shiny highlights`; `specular skin reflection` | 变成满脸涂油、塑料反光或刚抹了猪油的劣质 AI 脸 | 改为 `natural matte skin finish, soft diffused skin reflectance, zero oily sheen or plastic glare` |
| `high contrast`; `dramatic harsh shadows`; `vibrant colors`; `rich saturation`; `HDR`; `8K sharp` | 画面像廉价高对比度短视频滤镜，肤色橘红高饱和，暗部死黑 | 改为 `soft low-to-medium filmic contrast, smooth logarithmic highlight roll-off, restrained desaturated cinema color grade` |
| `intense emotional outburst`; `crying hard`; `screaming`; `wide eyes`; `contorted face`; `dramatic grimace` | 演员五官乱飞、用力过猛、嘴角剧烈抽动并瞬间拉出深法令纹 | 改为 `understated cinematic performance, relaxed lower face, emotion carried through quiet gaze and breath` + 3–4 拍可见微动作链（见 `acting-performance.md`） |

---

## 六、写入 H3 的可改写锚

### 6.1 默认 3DCG 档首镜与局部锚

在 3DCG 档首镜使用下面的结构，并结合实际人物、环境和主光裁剪：

```text
Fully computer-generated character animation with the sculpted, stylized character design and refined CG finish of FINAL FANTASY VII REMAKE. Preserve the supplied design, age and complexion, with restrained cheek color, coherent sculpted facial volumes through speech and expression, fine controlled skin texture, layered hair clumps and distinct cloth, leather and metal surfaces. The entire image remains an authored 3D animated world, with no live-action face substitution.
```

3DCG 光影与动作局部锚：

```text
A broad warm key from the west window shapes the CG face through soft light-to-shadow transitions; subdued neutral room bounce keeps the far cheek readable, highlights roll off gently, and the darker background separates the silhouette. The warmth follows the lit planes while the established complexion remains underneath.
```

```text
The planted foot and bent knee arrest her forward momentum. Her long hair and coat tails carry past the stopped torso, then fall back with different settling speeds; roots and shoulder seams remain anchored, and the cloth folds against her legs without passing through them.
```

### 6.2 三渲二实机建模档首镜与局部锚

```text
Stylized in-game 3D cel-shaded character model animation with a high-fidelity anime action RPG aesthetic. The character is a dimensional 3D-modeled figure with solid volumetric perspective, clean SDF 2-tone cel-shaded facial lighting with soft ramp transitions, smooth poreless anime skin with restrained cheek color, sculpted 3D hair clumps with a crisp cel-shaded specular highlight band, fine variable-width colored outlines, crisp rim lighting, and hybrid stylized-PBR materials that sharply distinguish metallic trims, sleek leather and structured 3D cloth folds. The entire shot maintains the in-game 3D cel-shaded model identity, distinct from both flat 2D illustration and semi-realistic 3DCG.
```

三渲二档说话、表情与受光局部锚：

```text
As she speaks, articulated 3D cel-shaded lip shapes and jaw motion follow the syllables cleanly; her sculpted 3D anime facial volume, clean SDF shadow ramp, multi-layered anime iris highlights and smooth poreless cel-shaded skin remain coherent through the expression.
```

```text
Directional scene light casts a crisp cel-shaded rim highlight along her 3D hair clumps and metallic collar while shaping her face with a clean 2-tone anime shadow boundary, preserving her underlying complexion and dimensional 3D model structure.
```

### 6.3 真人电影档首镜与局部锚

```text
Shot on 35mm Kodak Vision3 film with an ARRI Alexa 65 camera and Cooke S4 prime lenses, adopting a heavily desaturated, low-saturation cinema color grade, muted slate-grey and pale dusty-amber tones, soft low-contrast diffused lighting, smooth logarithmic highlight roll-off, lifted milky shadows, and fine organic 35mm film grain. Every person on screen maintains a natural matte skin finish with zero oily sheen or plastic glare, youthful supple cheek volume, and a completely smooth, flat nasolabial transition beside the nose and mouth with zero nasolabial folds, zero marionette lines, and zero forehead creases even during crying and speech.
```

真人电影档微表情、边说边落泪与面部特写局部锚（不出现 `FACS AU` 缩写）：

```text
In a tight close-up, he undergoes a multi-beat micro-expression progression while keeping his mid-face, mouth corners, and nasolabial zone completely smooth and uncreased: first, his pupils dilate slightly and his breath catches; second, heavy tear film pools along his reddened lower eyelids and his inner brow lifts by a millimeter in quiet heartbreak as he speaks; third, during a 0.3-second pause, he blinks once and a single clear teardrop overflows his lower lash line, rolling slowly down his smooth, matte cheek as his throat contracts in a visible swallow and his lower lip quivers.
```

### 6.4 风格锁在 H3 里的两个固定位置

1. **剧集第 1 步的规格卡**：把本档位首镜锚写进"风格锁原文"，全剧逐字复用（含资产生成提示词）。
2. **每单元 `[Shot 1]` 之后的第一个短语**：风格标签必须在首句最前，不能往后放。跨风格覆盖时尤其重要（见 `reference-slots.md` 第三节"第二件"）。

---

## 七、档位边界检查清单

```text
[ ] 首镜是否写清媒介（三档之一），且不是只给作品名或"电影感"？
[ ] 三档词条是否严格没有混用（3DCG 不写 SDF/描线；三渲二不写 FF7RE/皮下散射；真人不写 CG/cel-shaded）？
[ ] 图片资产的风格锁与视频提示词的风格锁是否逐字相同？
[ ] 风险镜（说话/近景/彩光/转身/接触/反打）是否就地补了对应档位的局部锚？
[ ] 真人电影档：全局与每个说话/哭泣镜是否都有平滑鼻唇与极小下颌锁？
[ ] 真人电影档：正文是否零出现 FACS / AU 编号？
[ ] 真人电影档：所有红色、暖黄、鲜艳物是否加了 muted / pale / dusty 修饰？
[ ] 三渲二档：是否明确排除 flat 2D illustration / splash art，同时排除半写实 3DCG 词条？
[ ] 3DCG 档：面颊底色是否与原肤色协调、没有默认加两团腮红？
[ ] 特效是否与角色同处一个视觉世界（见 vfx-design.md）？
```
