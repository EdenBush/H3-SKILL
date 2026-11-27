#!/usr/bin/env node
/**
 * check_prompt.mjs — 场景提示词的机械自检
 *
 * 用法：
 *   node scripts/check_prompt.mjs prompt.txt
 *   node scripts/check_prompt.mjs prompt.txt --duration 10
 *   node scripts/check_prompt.mjs --stdin < prompt.txt
 *   node scripts/check_prompt.mjs prompt.txt --json
 *   node scripts/check_prompt.mjs unit1.txt unit2.txt unit3.txt --series
 *
 * --series：多个单元一起过闸，并逐条比对"系列常量块"（CHARACTER 段，
 * 或 Ref2VA 壳的 subject_definitions 段）是否整块重写、是否被逐条缩写。
 *
 * 退出码：0 全部通过（可有警告），1 存在失败项
 *
 * 机械检查只覆盖可判定的部分（段落完整性、时间码连续性、标记语法、计数声明、FACS 泄漏、常量块长度）。
 * 下面三项必须人工过：一拍是否只推一件事、生理层是否错开、有没有不可拍摄的形容。
 */

import { readFileSync } from "node:fs";

const REQUIRED_SECTIONS = [
  { key: "CHARACTER", label: "CHARACTER" },
  { key: "TIMELINE", label: "TIMELINE" },
  { key: "CAMERA", label: "CAMERA" },
  { key: "PHYSIOLOGY PRIORITY", label: "PHYSIOLOGY PRIORITY" },
  { key: "CONSISTENCY LOCK", label: "CONSISTENCY LOCK" },
];

// 七段骨架里其余两段：模板应写，缺失只提示，不算失败（静帧版等变体可能合法省略）
const RECOMMENDED_SECTIONS = [
  { key: "POSE AND STAGING", label: "POSE AND STAGING" },
  { key: "LIGHT AND ATMOSPHERE", label: "LIGHT AND ATMOSPHERE" },
];

const TIMECODE_RE = /(\d{1,2}\.\d{1,2})\s*-\s*(\d{1,2}\.\d{1,2})\s*s\s*:/g;
const SHOT_RE = /\[Shot\s+(\d+)\]/g;

function parseArgs(argv) {
  const opts = { files: [], stdin: false, duration: 10, json: false, series: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--stdin") opts.stdin = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--series") opts.series = true;
    else if (a === "--duration") {
      const v = Number(argv[i + 1]);
      if (Number.isFinite(v) && v > 0) opts.duration = v;
      i += 1;
    } else if (!a.startsWith("--")) opts.files.push(a);
  }
  opts.file = opts.files[0] ?? null;
  return opts;
}

function readInput(opts) {
  if (opts.stdin) return readFileSync(0, "utf8");
  if (!opts.file) {
    console.error("用法: node check_prompt.mjs <prompt.txt> [--duration 10] [--json]");
    process.exit(2);
  }
  return readFileSync(opts.file, "utf8");
}

function checkSections(text) {
  const results = [];
  for (const s of REQUIRED_SECTIONS) {
    const present = text.toUpperCase().includes(s.key);
    results.push({
      id: `section:${s.key}`,
      level: present ? "pass" : "fail",
      message: present ? `段落 ${s.label} 存在` : `缺少段落 ${s.label}`,
    });
  }
  for (const s of RECOMMENDED_SECTIONS) {
    if (!text.toUpperCase().includes(s.key)) {
      results.push({
        id: `section:${s.key}`,
        level: "warn",
        message: `缺少段落 ${s.label}（七段骨架里应写；确认这是有意省略的变体）`,
      });
    }
  }
  return results;
}

function checkTimeline(text, duration) {
  const results = [];
  const beats = [];
  let m;
  TIMECODE_RE.lastIndex = 0;
  while ((m = TIMECODE_RE.exec(text)) !== null) {
    beats.push({ start: Number(m[1]), end: Number(m[2]), raw: m[0] });
  }

  if (beats.length === 0) {
    results.push({
      id: "timeline:empty",
      level: "fail",
      message: "找不到时间码，节拍段可能没写或格式不对（应为 0.00-1.20s: ...）",
    });
    return results;
  }

  if (beats[0].start !== 0) {
    results.push({
      id: "timeline:start",
      level: "fail",
      message: `第一个节拍应从 0.00 开始，实际是 ${beats[0].start.toFixed(2)}`,
    });
  }

  for (let i = 1; i < beats.length; i += 1) {
    const prev = beats[i - 1];
    const cur = beats[i];
    if (cur.start < prev.end - 0.001) {
      results.push({
        id: `timeline:overlap:${i}`,
        level: "fail",
        message: `时间码重叠：${prev.end.toFixed(2)} → ${cur.start.toFixed(2)}`,
      });
    } else if (cur.start > prev.end + 0.001) {
      results.push({
        id: `timeline:gap:${i}`,
        level: "fail",
        message: `时间码有空洞：${prev.end.toFixed(2)} → ${cur.start.toFixed(2)}（会产生空白帧）`,
      });
    }
  }

  const last = beats[beats.length - 1];
  if (last.end > duration + 0.001) {
    results.push({
      id: "timeline:overflow",
      level: "fail",
      message: `最后一个节拍结束于 ${last.end.toFixed(2)}s，超过声明时长 ${duration}s`,
    });
  } else if (last.end < duration - 0.001) {
    results.push({
      id: "timeline:short",
      level: "warn",
      message: `最后一个节拍结束于 ${last.end.toFixed(2)}s，短于声明时长 ${duration}s（结尾会留空）`,
    });
  }

  const expected = Math.ceil(duration / 1.2);
  const diff = Math.abs(beats.length - expected);
  if (diff > 2) {
    results.push({
      id: "timeline:beatcount",
      level: "warn",
      message: `节拍数 ${beats.length} 与建议值 ${expected}（时长÷1.2 向上取整）相差 ${diff}，检查是否一拍塞了多个变化`,
    });
  }

  const shortest = beats.reduce((acc, b) => Math.min(acc, b.end - b.start), Infinity);
  if (shortest < 0.6) {
    results.push({
      id: "timeline:tooshort",
      level: "warn",
      message: `存在短于 0.6s 的节拍（最短 ${shortest.toFixed(2)}s），模型可能压成过渡帧`,
    });
  }

  if (!results.some((r) => r.level === "fail")) {
    results.push({
      id: "timeline:ok",
      level: "pass",
      message: `时间码连续，共 ${beats.length} 拍，0.00 → ${last.end.toFixed(2)}s`,
    });
  }
  return results;
}

function checkDialogue(text) {
  const results = [];
  const open = (text.match(/<d>/g) || []).length;
  const close = (text.match(/<\/d>/g) || []).length;

  if (open !== close) {
    results.push({
      id: "dialogue:unbalanced",
      level: "fail",
      message: `<d> 与 </d> 数量不匹配（${open} / ${close}）`,
    });
  } else if (open > 0) {
    results.push({
      id: "dialogue:balanced",
      level: "pass",
      message: `对白标记成对出现，共 ${open} 段`,
    });
  }

  const blocks = text.match(/<d>([\s\S]*?)<\/d>/g) || [];
  let missingLang = 0;
  let missingSpeaker = 0;
  for (const b of blocks) {
    if (!/\[[A-Za-z]+\]/.test(b)) missingLang += 1;
  }
  if (blocks.length > 0 && !/\(S\d\)/.test(text)) missingSpeaker = 1;

  if (missingLang > 0) {
    results.push({
      id: "dialogue:lang",
      level: "fail",
      message: `${missingLang} 段对白缺少语言标签，应为 <d>[Chinese] ...</d>`,
    });
  }
  if (missingSpeaker === 1) {
    results.push({
      id: "dialogue:speaker",
      level: "warn",
      message: "有对白但找不到说话人编号 (S1)，模型可能无法归属声音",
    });
  }
  return results;
}

function checkShotCuts(text) {
  const results = [];
  const shots = [];
  let m;
  SHOT_RE.lastIndex = 0;
  while ((m = SHOT_RE.exec(text)) !== null) {
    shots.push({ n: Number(m[1]), index: m.index });
  }

  const cutMissing = [];
  for (let i = 1; i < shots.length; i += 1) {
    const from = shots[i - 1].index;
    const to = shots[i].index;
    // 两种写法都接受：`At 00:03.000` 写在 [Shot N] 之前，或紧跟在 [Shot N] 之后
    // （后者是 h3-output-spec.md 推荐的官方写法，向后多取 80 字符以覆盖）
    const segment = text.slice(from, Math.min(text.length, to + 80));
    if (!/At\s+0\d:\d{2}\.\d{3}/.test(segment)) cutMissing.push(shots[i].n);
  }

  if (cutMissing.length > 0) {
    results.push({
      id: "shots:cutmissing",
      level: "fail",
      message: `Shot ${cutMissing.join(", ")} 缺少 "At 00:0X.000, the camera cuts to ..." 句式，切点不会准`,
    });
  } else if (shots.length > 1) {
    results.push({
      id: "shots:ok",
      level: "pass",
      message: `共 ${shots.length} 个镜头，切点句式齐全`,
    });
  }

  // 镜头密度：有台词要稳（台词窗口不能切），无台词要靠切镜提供节奏
  const shotCount = Math.max(shots.length, 1); // 无 [Shot N] 标签时，整条算 1 镜
  const hasDialogue = /<d>/.test(text);

  if (hasDialogue) {
    if (shotCount > 4) {
      results.push({
        id: "shots:density",
        level: "warn",
        message: `有台词的单元用了 ${shotCount} 镜。默认 2–4 镜，不设硬上限；超过 4 镜时每一刀必须换权力/信息/立场，台词窗口保持静止。若只是同一件事多切几刀，合并`,
      });
    }
  } else if (/first-person|POV|viewer.s own (right )?hand/i.test(text)) {
    // POV 单镜是合法选择：靠主观连续与画面内变化（焦点、呼吸起伏、手入画）维持注意力，不靠切
    results.push({
      id: "shots:pov",
      level: "pass",
      message: "POV 单镜，豁免镜头密度要求（但必须有画面内节奏：焦点变化 / 呼吸起伏 / 手入画）",
    });
  } else {
    if (shotCount < 3) {
      results.push({
        id: "shots:density",
        level: "warn",
        message: `无台词的单元只有 ${shotCount} 镜，10 秒会拖沓（没有对白提供节奏，就靠切镜）。建议 3–5 镜`,
      });
    } else if (shotCount > 7) {
      results.push({
        id: "shots:density",
        level: "warn",
        message: `无台词单元用了 ${shotCount} 镜；默认 3–5，设计版 5–7。超过 7 镜每镜必须有独立新信息，否则会切成碎片`,
      });
    }
  }

  return results;
}

function checkLock(text) {
  const results = [];
  // 人数锁是真有用的：防止模型凭空造出第三个人。保留。
  const hasHeadcount = /exactly\s+(one|two|three)\s+(woman|man|figure|person|people|women|men|figures)/i.test(text);

  // 肢体数量锁（two arms / ten fingers / two legs）不再是必需项。
  // H3 的空间语义理解足以避免"融化"和"多一条胳膊"；写这些只会挤占注意力。
  // 这里不检查、不提示，避免逆向诱导 agent 往上写。

  if (!hasHeadcount) {
    results.push({
      id: "lock:headcount",
      level: "warn",
      message: "一致性锁里没有人数约束（exactly one woman / exactly two figures）。人数锁能防凭空造人，建议补上",
    });
  } else {
    results.push({
      id: "lock:headcount",
      level: "pass",
      message: "一致性锁含人数约束",
    });
  }

  // 状态锁：位置、重心、承重、动作延续
  if (!/never changes|stays fixed|stays unchanged|stays on|weight stays|remains|holds|keeps her|keeps his/i.test(text)) {
    results.push({
      id: "lock:pose",
      level: "warn",
      message: "找不到状态锁句式（position stays fixed / the pose never changes / keeps her weight on ...）",
    });
  }
  return results;
}

// 这些短语里的否定词是合法指令（描述一个确定状态），不算负向提示词残留
const BENIGN_NEGATIVES = [
  /no cuts/gi,
  /no zoom/gi,
  /no hunting/gi,
  /no other figures/gi,
  /no additional/gi,
  /no more than/gi,
  /no music/gi,
  /no live-action/gi,
];

function checkNegativePhrasing(text) {
  const results = [];
  const hits = [];
  const lines = text.split(/\r?\n/);
  const patterns = [/\bno\s+[a-z]/i, /\bwithout\s+[a-z]/i, /\bdo not\b/i, /\bdon't\b/i, /\bnever\b/i];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("CONSISTENCY")) continue;

    let probe = trimmed;
    for (const benign of BENIGN_NEGATIVES) probe = probe.replace(benign, " ");

    for (const p of patterns) {
      if (p.test(probe)) {
        hits.push(trimmed.slice(0, 80));
        break;
      }
    }
  }

  if (hits.length > 0) {
    results.push({
      id: "negative:phrasing",
      level: "warn",
      message: `发现 ${hits.length} 处否定式措辞，H3 没有负向分支，建议改为正向的确定状态。示例：${hits[0]}`,
    });
  }
  return results;
}

// 剧集里每个单元对模型都是一次从零生成：指向"上一镜"的表述没有参照物，是空词。
// 只检测明确的跨条引用，避免误伤条内合法的 "the frame holds still" 这类写法。
const CROSS_SHOT_PATTERNS = [
  /continuing from the previous shot/gi,
  /from the previous shot/gi,
  /previous shot/gi,
  /the last shot/gi,
  /back in the same room/gi,
  /return to the same room/gi,
  /same as before/gi,
  /as before/gi,
];

function checkCrossShotReference(text) {
  const hits = [];
  for (const p of CROSS_SHOT_PATTERNS) {
    const m = text.match(p);
    if (m) hits.push(...m.map((s) => s.toLowerCase()));
  }
  if (hits.length === 0) return [];
  // 长的匹配优先，去掉被包含的短匹配，避免 "previous shot" 刷屏
  const uniq = [...new Set(hits)]
    .sort((a, b) => b.length - a.length)
    .filter((s, i, arr) => !arr.slice(0, i).some((longer) => longer.includes(s)));
  return [
    {
      id: "series:crossref",
      level: "warn",
      message: `发现 ${hits.length} 处跨条引用（${uniq.slice(0, 3).join(" / ")}）。H3 每个单元独立生成，这类表述在跨条时没有参照物，应改成对当前状态的直接描述。`,
    },
  ];
}

function checkSlotDeclaration(text) {
  const results = [];
  const firstHundred = text.slice(0, 400).toLowerCase();
  const mentionsImage = /image\s*1|picture\s*1|<picture\s*1>/.test(firstHundred);
  if (mentionsImage && !/ignore/.test(firstHundred)) {
    results.push({
      id: "slot:ignore",
      level: "warn",
      message: "开头提到参考图但没有 ignore 从句，槽位职责可能不明确",
    });
  }
  if (/multi-view|character design sheet|three standing views/i.test(text) && !/exactly one single figure/i.test(text)) {
    results.push({
      id: "slot:sheet",
      level: "fail",
      message: "识别到多视图设定图但缺少 render exactly one single figure，可能输出三联排站姿",
    });
  }
  return results;
}

function checkCameraConflict(text) {
  const results = [];
  const idx = text.search(/CAMERA\s*:/i);
  if (idx === -1) return results;

  // 取 CAMERA 段落到下一个全大写段落名为止
  const rest = text.slice(idx);
  const nextSection = rest.slice(10).search(/\n[A-Z][A-Z ]{5,}:/);
  const section = nextSection === -1 ? rest : rest.slice(0, 10 + nextSection);

  const up = /looking up|tilted up|from below|looking up along/i.test(section);
  const down = /top-down|looking down|tilted down|overhead/i.test(section);

  if (up && down) {
    results.push({
      id: "camera:conflict",
      level: "fail",
      message: "CAMERA 段内同时出现仰拍与俯拍指令，模型会在一段里给出多个机位",
    });
  } else {
    results.push({
      id: "camera:ok",
      level: "pass",
      message: "机位方向唯一",
    });
  }
  return results;
}

// FACS / AU 编号是给导演内部用的编码，写进 H3 正文会触发面部抽动伪影。
// 只认大写与紧邻数字的写法，避免误伤普通英文词。
function checkFacsLeakage(text) {
  const results = [];
  const facs = text.match(/\bFACS\b/g) || [];
  const auCodes = text.match(/\bAU[\s-]?\d{1,2}\b/g) || [];

  if (facs.length > 0 || auCodes.length > 0) {
    const samples = [...facs, ...auCodes].slice(0, 3).join(" / ");
    results.push({
      id: "facs:leak",
      level: "fail",
      message: `正文出现 FACS / AU 编码（${samples}）。这些是内部记账用的编号，模型会当成面部抽动指令；全部转写成可见的解剖微动作`,
    });
  } else {
    results.push({
      id: "facs:clean",
      level: "pass",
      message: "没有 FACS / AU 编号泄漏",
    });
  }
  return results;
}

// 系列常量块：剧集里每个单元都必须整块重写同一段不变量（风格锁 + 地标句 + 调度图 + 参考映射 + 主体定义）。
// 第 1 单元写全、第 3 单元少两项、第 5 单元只剩一个名字——这是剧集里最隐蔽的一种漂移。
// 三字段壳取 CHARACTER 段；六段壳取 subject_definitions + detailed_description 里的 setting 句。
// 六段壳的 summary 与 retention_analysis 是每单元都会变的内容，不是常量，必须排除。
function isSixPartShell(text) {
  return /subject_definitions\s*:/i.test(text);
}

function extractSettingSentence(text) {
  for (const line of text.split(/\r?\n/)) {
    const i = line.search(/The setting is/i);
    if (i !== -1) return line.slice(i).trim();
  }
  return null;
}

function extractConstantBlock(text) {
  const sixStart = text.search(/subject_definitions\s*:/i);
  if (sixStart !== -1) {
    const after = text.slice(sixStart);
    const end = after.slice(20).search(/\n\s*(summary|retention_analysis|detailed_description)\s*:/i);
    const defs = (end === -1 ? after : after.slice(0, 20 + end)).trim();
    const setting = extractSettingSentence(text);
    return setting ? `${defs}\n${setting}` : defs;
  }
  const charStart = text.search(/^\s*CHARACTER\s*:/im);
  if (charStart === -1) return null;
  const after = text.slice(charStart);
  const next = after.slice(10).search(/\n\s*[A-Z][A-Z ]{4,}\s*:/);
  return next === -1 ? after : after.slice(0, 10 + next);
}

function normalizeBlock(s) {
  return s.replace(/\s+/g, " ").trim();
}

function blockWords(block) {
  return normalizeBlock(block)
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]<>]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// 词频差集：只回答"基线里有哪些词在这一条里没有/多了"，用于人工判断是状态词还是缩写
const DIFF_STOPWORDS = new Set(
  "a an the and or of in on at to with for her his their its is are was were as by from that this these those it she he they".split(" ")
);

function wordDiff(baseWords, curWords) {
  const counts = (arr) => {
    const m = new Map();
    for (const w of arr) m.set(w, (m.get(w) || 0) + 1);
    return m;
  };
  const b = counts(baseWords);
  const c = counts(curWords);
  const removed = [];
  const added = [];
  for (const [w, n] of b) {
    const d = n - (c.get(w) || 0);
    if (d > 0) for (let i = 0; i < d; i += 1) removed.push(w);
  }
  for (const [w, n] of c) {
    const d = n - (b.get(w) || 0);
    if (d > 0) for (let i = 0; i < d; i += 1) added.push(w);
  }
  return { removed, added };
}

// 常量块里出现"持有 / 开合 / 在手上"这类会变的描述，是"逐字一致但一致地过时"的入口：
// 单元 1 的 `the mug travels in her hand` 被原样带到单元 2，就会和"缸在桌上"打架。
const STATE_IN_BLOCK = [
  /\btravels? in (?:her|his|their) hand\b/gi,
  /\b(?:holds?|holding|carries|carrying)\b/gi,
  /\bin (?:her|his|their) (?:right |left )?hand\b/gi,
  /\blid (?:clipped|snapped|open|closed)\b/gi,
  /\bclasp (?:closed|open|snapped)\b/gi,
];

function checkStateInConstantBlock(norm) {
  const groups = new Map();
  for (const u of norm) {
    const matches = new Set();
    for (const re of STATE_IN_BLOCK) {
      for (const m of u.norm.matchAll(re)) matches.add(m[0].toLowerCase());
    }
    if (matches.size === 0) continue;
    if (!groups.has(u.norm)) groups.set(u.norm, { names: [], matches: new Set() });
    const g = groups.get(u.norm);
    g.names.push(u.name);
    for (const m of matches) g.matches.add(m);
  }
  return [...groups.values()].map((g) => ({
    id: "series:stateinblock",
    level: "warn",
    message: `${g.names.join(" / ")} 的常量块含持有 / 开合描述（${[...g.matches].slice(0, 6).join(", ")}）。若它在本集里会变，搬到 POSE AND STAGING 与 CONSISTENCY LOCK；否则会"逐字一致但一致地过时"`,
  }));
}

function checkSeriesConstantBlock(units) {
  const results = [];
  const withBlocks = units.map((u) => ({ ...u, block: extractConstantBlock(u.text) }));

  const missing = withBlocks.filter((u) => !u.block);
  if (missing.length > 0) {
    results.push({
      id: "series:missing",
      level: "fail",
      message: `${missing.map((u) => u.name).join(" / ")} 找不到常量块（三字段壳的 CHARACTER 段，或 Ref2VA 壳的 subject_definitions 段）。剧集每个单元都要整块重写`,
    });
    return results;
  }

  const norm = withBlocks.map((u) => ({
    name: u.name,
    norm: normalizeBlock(u.block),
    words: blockWords(u.block),
  }));
  // 基线取最长的那条：通常是最完整的一条。若最长的那条也是缩写的，长度比这一关会全部通过，需人工再看一眼
  const base = norm.reduce((a, b) => (b.words.length > a.words.length ? b : a));
  results.push({
    id: "series:baseline",
    level: "pass",
    message: `常量块基线取 ${base.name}（${base.words.length} 词）`,
  });

  let allIdentical = true;
  for (const u of norm) {
    if (u.norm !== base.norm) allIdentical = false;
    const ratio = u.words.length / Math.max(1, base.words.length);
    const { removed, added } = wordDiff(base.words, u.words);
    const diffSet = [...new Set([...removed, ...added])];
    const interesting = diffSet.filter((w) => !DIFF_STOPWORDS.has(w) && w.length > 1);
    const sample = (interesting.length > 0 ? interesting : diffSet).slice(0, 10);
    const diffRatio = (removed.length + added.length) / Math.max(1, base.words.length);

    if (ratio < 0.85) {
      results.push({
        id: `series:short:${u.name}`,
        level: "fail",
        message: `${u.name} 常量块只有基线的 ${Math.round(ratio * 100)}%（${u.words.length} / ${base.words.length} 词），疑似逐条缩写。从规格卡整块复制，只改状态词`,
      });
    } else if (diffRatio > 0.03) {
      results.push({
        id: `series:rewrite:${u.name}`,
        level: "warn",
        message: `${u.name} 与基线差 ${Math.round(diffRatio * 100)}%（缺 ${removed.length} 词 / 多 ${added.length} 词）：${sample.join(", ")}。确认这些差异是状态词，不是被改写或删掉的描述`,
      });
    } else if (u.norm === base.norm) {
      results.push({
        id: `series:same:${u.name}`,
        level: "pass",
        message: `${u.name} 常量块与基线逐字一致`,
      });
    } else {
      results.push({
        id: `series:stateword:${u.name}`,
        level: "pass",
        message: `${u.name} 与基线仅差 ${diffSet.length} 词（${sample.slice(0, 8).join(", ")}），按状态词处理`,
      });
    }
  }

  if (allIdentical) {
    results.push({
      id: "series:identical",
      level: "pass",
      message: `${norm.length} 个单元的常量块逐字一致`,
    });
  }

  results.push(...checkStateInConstantBlock(norm));

  return results;
}

// 入画清单核对（六段壳）：retention_analysis 声明每个 Subject 出现在哪几镜，
// 正文 detailed_description 里实际出现的是哪几镜。两边对不上，就是"谁凭空消失/凭空出现"。
function checkRetentionParticipation(units) {
  const results = [];
  for (const u of units) {
    if (!isSixPartShell(u.text)) continue;

    const retIdx = u.text.search(/retention_analysis\s*:/i);
    if (retIdx === -1) {
      results.push({
        id: `series:retention:${u.name}`,
        level: "warn",
        message: `${u.name} 六段壳缺少 retention_analysis，无法核对入画清单`,
      });
      continue;
    }
    let ret = u.text.slice(retIdx);
    const retEnd = ret.slice(18).search(/\n\s*detailed_description\s*:/i);
    if (retEnd !== -1) ret = ret.slice(0, 18 + retEnd);

    const detIdx = u.text.search(/detailed_description\s*:/i);
    if (detIdx === -1) continue;
    let det = u.text.slice(detIdx);
    const detEnd = det.slice(20).search(/\n\s*(overall_soundscape|non_diegetic_music)\s*:/i);
    if (detEnd !== -1) det = det.slice(0, 20 + detEnd);

    // `<Subject 4> is the ...` 是环境主体（场景本身），按全镜在场处理，不参与逐镜核对
    const envSubjects = new Set();
    for (const line of u.text.split(/\r?\n/)) {
      const m = line.match(/<Subject\s+(\d+)>\s+is\s+the\b/i);
      if (m) envSubjects.add(Number(m[1]));
    }

    const actual = new Map();
    for (const part of det.split(/(?=\[Shot\s+\d+\])/)) {
      const m = part.match(/\[Shot\s+(\d+)\]/);
      if (!m) continue;
      const shotNo = Number(m[1]);
      // `<Subject 2>'s perch / voice` 是画外指代，不算入画
      const subs = new Set([...part.matchAll(/<Subject\s+(\d+)>(?!['’]s\b)/g)].map((x) => Number(x[1])));
      for (const s of subs) {
        if (!actual.has(s)) actual.set(s, new Set());
        actual.get(s).add(shotNo);
      }
    }

    const fmt = (set) =>
      set.size === 0 ? "不入画" : `镜 ${[...set].sort((a, b) => a - b).join("、")}`;

    for (const line of ret.split(/\r?\n/)) {
      const m = line.match(/<Subject\s+(\d+)>\s*\(([^)]*)\)/);
      if (!m) continue;
      const sub = Number(m[1]);
      if (envSubjects.has(sub)) {
        results.push({
          id: `series:participation:${u.name}:${sub}`,
          level: "pass",
          message: `${u.name} <Subject ${sub}> 是环境主体，按全镜在场处理（不参与逐镜核对）`,
        });
        continue;
      }
      const stated = new Set([...m[2].matchAll(/\[Shot\s+(\d+)\]/g)].map((x) => Number(x[1])));
      const seen = actual.get(sub) || new Set();
      const missing = [...stated].filter((s) => !seen.has(s));
      const extra = [...seen].filter((s) => !stated.has(s));
      if (missing.length === 0 && extra.length === 0) {
        results.push({
          id: `series:participation:${u.name}:${sub}`,
          level: "pass",
          message: `${u.name} <Subject ${sub}> 入画清单与正文一致（${fmt(stated)}）`,
        });
      } else {
        results.push({
          id: `series:participation:${u.name}:${sub}`,
          level: "warn",
          message: `${u.name} <Subject ${sub}> 入画清单与正文不一致：声明 ${fmt(stated)}，正文实际 ${fmt(seen)}。改清单或补写 / 删去该角色`,
        });
      }
    }
  }
  return results;
}

function runUnitChecks(text, duration) {
  if (!isSixPartShell(text)) return runChecks(text, duration);
  // 六段壳没有七段的段落名与行内时间码，三字段那套检查不适用
  return [
    { id: "shell:six", level: "pass", message: "六段壳（Ref2VA）：三字段段落 / 时间码检查跳过" },
    ...checkSlotDeclaration(text),
    ...checkFacsLeakage(text),
    ...checkNegativePhrasing(text),
    ...checkCrossShotReference(text),
  ];
}

function runChecks(text, duration) {
  return [
    ...checkSections(text),
    ...checkTimeline(text, duration),
    ...checkDialogue(text),
    ...checkShotCuts(text),
    ...checkCameraConflict(text),
    ...checkLock(text),
    ...checkSlotDeclaration(text),
    ...checkFacsLeakage(text),
    ...checkNegativePhrasing(text),
    ...checkCrossShotReference(text),
  ];
}

function summarize(results) {
  return {
    fails: results.filter((r) => r.level === "fail"),
    warns: results.filter((r) => r.level === "warn"),
    passes: results.filter((r) => r.level === "pass"),
  };
}

function printResults(results) {
  for (const r of results.filter((x) => x.level === "pass")) console.log(`  ok   ${r.message}`);
  for (const r of results.filter((x) => x.level === "warn")) console.log(`  warn ${r.message}`);
  for (const r of results.filter((x) => x.level === "fail")) console.log(`  FAIL ${r.message}`);
}

function runSeries(opts) {
  if (opts.files.length < 2) {
    console.error("--series 需要至少两个单元文件：node check_prompt.mjs unit1.txt unit2.txt [unit3.txt ...] --series");
    process.exit(2);
  }

  const units = opts.files.map((name) => ({ name, text: readFileSync(name, "utf8") }));
  const perUnit = units.map((u) => ({ name: u.name, results: runUnitChecks(u.text, opts.duration) }));
  const seriesResults = [...checkSeriesConstantBlock(units), ...checkRetentionParticipation(units)];

  const all = [...perUnit.flatMap((u) => u.results), ...seriesResults];
  const { fails, warns, passes } = summarize(all);

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          duration: opts.duration,
          series: true,
          units: perUnit.map((u) => ({ name: u.name, ...summarize(u.results), ok: summarize(u.results).fails.length === 0 })),
          seriesResults,
          fails,
          warns,
          passes,
          ok: fails.length === 0,
        },
        null,
        2
      )
    );
    process.exit(fails.length === 0 ? 0 : 1);
  }

  for (const u of perUnit) {
    console.log(`\n=== ${u.name} ===`);
    printResults(u.results);
  }
  console.log("\n=== 系列常量块（跨单元） ===");
  printResults(seriesResults);
  console.log("");
  console.log(`通过 ${passes.length} / 警告 ${warns.length} / 失败 ${fails.length}`);
  console.log("机械检查之外仍需人工确认：常量块里的差异是否只是状态词、一拍只推一件事、生理层彼此错开、没有不可拍摄的形容。");
  process.exit(fails.length === 0 ? 0 : 1);
}

function run() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.series) {
    runSeries(opts);
    return;
  }

  const text = readInput(opts);
  const results = runChecks(text, opts.duration);
  const { fails, warns, passes } = summarize(results);

  if (opts.json) {
    console.log(JSON.stringify({ duration: opts.duration, fails, warns, passes, ok: fails.length === 0 }, null, 2));
  } else {
    printResults(results);
    console.log("");
    console.log(`通过 ${passes.length} / 警告 ${warns.length} / 失败 ${fails.length}`);
    console.log("机械检查之外仍需人工确认：一拍只推一件事、生理层彼此错开、没有不可拍摄的形容。");
  }

  process.exit(fails.length === 0 ? 0 : 1);
}

run();
