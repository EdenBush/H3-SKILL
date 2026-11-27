#!/usr/bin/env node
/**
 * check_prompt.mjs — 场景提示词的机械自检
 *
 * 用法：
 *   node scripts/check_prompt.mjs prompt.txt
 *   node scripts/check_prompt.mjs prompt.txt --duration 10
 *   node scripts/check_prompt.mjs --stdin < prompt.txt
 *   node scripts/check_prompt.mjs prompt.txt --json
 *
 * 退出码：0 全部通过（可有警告），1 存在失败项
 *
 * 机械检查只覆盖可判定的部分（段落完整性、时间码连续性、标记语法、计数声明）。
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

const TIMECODE_RE = /(\d{1,2}\.\d{1,2})\s*-\s*(\d{1,2}\.\d{1,2})\s*s\s*:/g;
const SHOT_RE = /\[Shot\s+(\d+)\]/g;

function parseArgs(argv) {
  const opts = { file: null, stdin: false, duration: 10, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--stdin") opts.stdin = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--duration") {
      const v = Number(argv[i + 1]);
      if (Number.isFinite(v) && v > 0) opts.duration = v;
      i += 1;
    } else if (!a.startsWith("--")) opts.file = a;
  }
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

function run() {
  const opts = parseArgs(process.argv.slice(2));
  const text = readInput(opts);

  const results = [
    ...checkSections(text),
    ...checkTimeline(text, opts.duration),
    ...checkDialogue(text),
    ...checkShotCuts(text),
    ...checkCameraConflict(text),
    ...checkLock(text),
    ...checkSlotDeclaration(text),
    ...checkNegativePhrasing(text),
    ...checkCrossShotReference(text),
  ];

  const fails = results.filter((r) => r.level === "fail");
  const warns = results.filter((r) => r.level === "warn");
  const passes = results.filter((r) => r.level === "pass");

  if (opts.json) {
    console.log(JSON.stringify({ duration: opts.duration, fails, warns, passes, ok: fails.length === 0 }, null, 2));
  } else {
    for (const r of passes) console.log(`  ok   ${r.message}`);
    for (const r of warns) console.log(`  warn ${r.message}`);
    for (const r of fails) console.log(`  FAIL ${r.message}`);
    console.log("");
    console.log(`通过 ${passes.length} / 警告 ${warns.length} / 失败 ${fails.length}`);
    console.log("机械检查之外仍需人工确认：一拍只推一件事、生理层彼此错开、没有不可拍摄的形容。");
  }

  process.exit(fails.length === 0 ? 0 : 1);
}

run();
