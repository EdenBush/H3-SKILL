#!/usr/bin/env node
/**
 * check_caption.mjs — H3 图片编辑提示词的机械自检
 *
 * 用法：
 *   node scripts/check_caption.mjs caption.txt
 *   node scripts/check_caption.mjs --stdin < caption.txt
 *   node scripts/check_caption.mjs caption.txt --json            # 校验两字段 JSON 封装
 *   node scripts/check_caption.mjs caption.txt --json --wrap --ratio 16:9
 *   node scripts/check_caption.mjs caption.txt --allow-newlines
 *
 * 退出码：0 通过（可有警告），1 有失败项，2 用法错误
 *
 * 机械检查只覆盖可判定的部分。以下必须人工过：
 *   1. Part 3 是否混入了保留内容的重写
 *   2. Subject 粒度是否合理
 *   3. 新增内容的描述是否厚到能照着画
 *   4. 文字/数据是否逐字完整、有没有该翻译没翻译
 */

import { readFileSync } from "node:fs";

const SUBJECT_RE = /<Subject\s+(\d+)>/g;
const PICTURE_RE = /<Picture\s+(\d+)>/g;

function parseArgs(argv) {
  const opts = { file: null, stdin: false, json: false, wrap: false, ratio: null, allowNewlines: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--stdin") opts.stdin = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--wrap") opts.wrap = true;
    else if (a === "--allow-newlines") opts.allowNewlines = true;
    else if (a === "--ratio") {
      opts.ratio = argv[i + 1];
      i += 1;
    } else if (!a.startsWith("--")) opts.file = a;
  }
  return opts;
}

function readInput(opts) {
  if (opts.stdin) return readFileSync(0, "utf8");
  if (!opts.file) {
    console.error("用法: node check_caption.mjs <caption.txt> [--json] [--wrap --ratio 16:9]");
    process.exit(2);
  }
  return readFileSync(opts.file, "utf8");
}

function fail(list, id, message) {
  list.push({ id, level: "fail", message });
}
function warn(list, id, message) {
  list.push({ id, level: "warn", message });
}
function pass(list, id, message) {
  list.push({ id, level: "pass", message });
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniqueMatches(re, text) {
  const out = new Set();
  let m;
  const rx = new RegExp(re.source, re.flags);
  while ((m = rx.exec(text)) !== null) out.add(m[1]);
  return [...out];
}

// ---------- JSON 模式 ----------

function checkJsonMode(raw, ratioOverride, results) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    fail(results, "json:parse", `JSON 解析失败：${e.message}`);
    return null;
  }
  pass(results, "json:parse", "JSON 解析通过");

  const keys = Object.keys(parsed);
  const okKeys =
    keys.length === 2 && keys.includes("expanded_caption") && keys.includes("target_aspect_ratio");
  if (okKeys) {
    pass(results, "json:keys", "恰好两个字段 expanded_caption / target_aspect_ratio");
  } else {
    fail(results, "json:keys", `字段不对，实际为：${keys.join(", ")}`);
  }

  const cap = parsed.expanded_caption;
  const ratio = parsed.target_aspect_ratio;

  if (typeof cap !== "string") fail(results, "json:caption-type", "expanded_caption 不是字符串");
  if (typeof ratio !== "string") fail(results, "json:ratio-type", "target_aspect_ratio 不是字符串");

  if (typeof cap === "string" && /\n/.test(cap)) {
    fail(results, "json:newline", "expanded_caption 内含真实换行");
  }
  if (typeof cap === "string" && /\r/.test(cap)) {
    fail(results, "json:cr", "expanded_caption 内含回车符");
  }

  if (typeof ratio === "string") {
    if (ratio === "adaptive") {
      fail(results, "json:ratio-adaptive", "target_aspect_ratio 不能输出 adaptive");
    } else if (!/^\d+:\d+$/.test(ratio)) {
      fail(results, "json:ratio-format", `target_aspect_ratio 格式应为 W:H 且无空格，实际为 ${ratio}`);
    } else {
      const [w, h] = ratio.split(":").map(Number);
      if (w <= 0 || h <= 0) {
        fail(results, "json:ratio-positive", "target_aspect_ratio 必须是正整数");
      } else {
        const g = (a, b) => (b === 0 ? a : g(b, a % b));
        const d = g(w, h);
        if (d !== 1) {
          warn(results, "json:ratio-reduce", `${ratio} 不是最简整数比，建议 ${w / d}:${h / d}`);
        } else {
          pass(results, "json:ratio-format", `画幅 ${ratio} 合法且已最简`);
        }
      }
      if (ratioOverride && ratioOverride !== ratio) {
        warn(results, "json:ratio-mismatch", `与 --ratio ${ratioOverride} 不一致`);
      }
    }
  }

  if (typeof cap === "string" && /["]/.test(cap)) {
    warn(
      results,
      "json:doublequote",
      "caption 内含 ASCII 双引号；建议把文字改用单引号包裹，从源头避免转义问题"
    );
  }

  return parsed;
}

// ---------- 正文结构 ----------

function checkStructure(text, results) {
  const subjects = uniqueMatches(SUBJECT_RE, text);
  const pictures = uniqueMatches(PICTURE_RE, text);

  if (subjects.length === 0) {
    warn(results, "struct:no-subject", "没有找到任何 <Subject N>；若为纯新增内容（无源元素）可忽略");
  } else {
    pass(results, "struct:subjects", `共定义 ${subjects.length} 个 Subject：${subjects.map((n) => `<Subject ${n}>`).join("、")}`);
  }

  if (pictures.length === 0) {
    warn(results, "struct:no-picture", "没有找到任何 <Picture N>；参考元素应写明来源图");
  } else {
    pass(results, "struct:pictures", `引用了 ${pictures.length} 张来源图`);
  }

  // 模糊指代
  const vague = [
    /the reference images/i,
    /the previous images/i,
    /all inputs/i,
    /these pictures/i,
    /the input images/i,
  ];
  const vagueHits = vague.filter((re) => re.test(text));
  if (vagueHits.length > 0) {
    fail(results, "struct:vague", "出现模糊指代（the reference images / all inputs 等），必须逐张写 <Picture N>");
  }

  // 结构指令泄漏
  const metaWords = [/\bDefine\s+</i, /\bLet\s+<Subject/i, /\bSection\s+\d/i, /\bPart\s+\d\s*:/i, /\bStep\s+\d/i];
  const metaHits = metaWords.filter((re) => re.test(text));
  if (metaHits.length > 0) {
    fail(results, "struct:meta", "出现结构指令词（Define / Let / Section / Part / Step），必须改写成自然叙述");
  }

  // 目标概述
  const overviewIdx = text.indexOf("The target image");
  if (overviewIdx === -1) {
    fail(results, "struct:overview", "找不到以 'The target image' 开头的目标概述句");
  } else {
    pass(results, "struct:overview", "存在目标概述句");
  }

  // 定义必须在概述之前
  if (overviewIdx > -1) {
    for (const n of subjects) {
      const defIdx = text.search(new RegExp(`<Subject\\s+${n}>[^.]*\\.`));
      const firstIdx = text.indexOf(`<Subject ${n}>`);
      if (firstIdx > overviewIdx) {
        fail(
          results,
          `struct:order:${n}`,
          `<Subject ${n}> 首次出现晚于目标概述句，应在概述之前定义`
        );
      }
      void defIdx;
    }
  }

  // 换行
  return { subjects, pictures, overviewIdx };
}

function checkRelationships(text, subjects, results) {
  const sentences = splitSentences(text);

  const patterns = {
    fully: /\bis fully preserved\b/i,
    partial: /\bis partially preserved\b/i,
    transfer: /\bsuppl(?:y|ies)\b[\s\S]*\btransferred\b/i,
    weak: /\bserves as a weak\b/i,
  };

  for (const n of subjects) {
    const token = `<Subject ${n}>`;
    const hits = [];
    sentences.forEach((s, i) => {
      if (!s.includes(token)) return;
      for (const [kind, re] of Object.entries(patterns)) {
        if (re.test(s)) hits.push({ kind, index: i, sentence: s });
      }
    });

    if (hits.length === 0) {
      fail(results, `rel:missing:${n}`, `<Subject ${n}> 没有关系声明（四种关系之一）`);
      continue;
    }
    if (hits.length > 1) {
      fail(
        results,
        `rel:multi:${n}`,
        `<Subject ${n}> 有 ${hits.length} 处关系声明，每个 Subject 必须恰好一句`
      );
    } else {
      pass(results, `rel:ok:${n}`, `<Subject ${n}> → ${hits[0].kind}`);
    }

    // 完全保留必须是标准短句
    const fp = hits.find((h) => h.kind === "fully");
    if (fp) {
      const expected = `<Subject ${n}> is fully preserved.`;
      if (fp.sentence.trim() !== expected) {
        fail(
          results,
          `rel:fp-form:${n}`,
          `完全保留句必须是 "${expected}"，实际为 "${fp.sentence.trim()}"`
        );
      }
    }

    // 合并句检测：一句里出现两个 Subject 且带关系词
    for (const h of hits) {
      const others = subjects.filter((m) => m !== n && h.sentence.includes(`<Subject ${m}>`));
      if (others.length > 0) {
        fail(
          results,
          `rel:merge:${n}`,
          `关系句里同时出现 <Subject ${n}> 与 ${others.map((m) => `<Subject ${m}>`).join("、")}，必须拆成独立句`
        );
      }
    }
  }
}

function checkMergedRelationship(text, subjects, results) {
  if (subjects.length < 2) return;
  const sentences = splitSentences(text);
  const relWord = /\b(preserved|transferred|serves as a weak)\b/i;

  for (const s of sentences) {
    if (!relWord.test(s)) continue;
    const present = subjects.filter((n) => s.includes(`<Subject ${n}>`));
    if (present.length >= 2) {
      fail(
        results,
        "rel:merged-sentence",
        `一句关系声明里出现了多个 Subject（${present.map((n) => `<Subject ${n}>`).join("、")}），必须每个 Subject 独立一句：「${s.slice(0, 70)}…」`
      );
    }
  }
}

function checkNoRedescription(text, subjects, results) {
  const sentences = splitSentences(text);

  // 找每句的相对位置
  for (const n of subjects) {
    const token = `<Subject ${n}>`;
    const fpIdx = sentences.findIndex(
      (s) => s.trim() === `<Subject ${n}> is fully preserved.`
    );
    if (fpIdx === -1) continue;

    const later = sentences.slice(fpIdx + 1).filter((s) => s.includes(token));
    for (const s of later) {
      const stripped = s.replace(new RegExp(`<Subject\\s+${n}>`, "g"), "").trim();
      const wordCount = stripped.split(/\s+/).filter(Boolean).length;
      // 只允许极短的锚点用法；超过 8 个词基本就是在复述外观
      if (wordCount > 12) {
        warn(
          results,
          `redo:${n}`,
          `完全保留的 <Subject ${n}> 之后出现较长描述（${wordCount} 词），检查是否在复述外观：「${s.slice(0, 70)}…」`
        );
      }
    }
  }
}

function checkTextHandling(text, results) {
  const doubleQuotes = (text.match(/"/g) || []).length;
  if (doubleQuotes > 0) {
    warn(results, "text:doublequote", "出现 ASCII 双引号；画面内文字建议统一用单引号包裹");
  }

  // 只在"疑似定界符"上做奇偶校验：先剔除英文所有格（字母 + ' + 字母/空格）
  const delimiters = text.replace(/[A-Za-z]'(?=[A-Za-z\s])/g, "");
  const quoteCount = (delimiters.match(/'/g) || []).length;
  if (quoteCount % 2 !== 0) {
    warn(results, "text:unbalanced-quote", "单引号数量为奇数，可能有未闭合的文字引用");
  }

  if (/\betc\.|\band so on\b/i.test(text)) {
    fail(results, "text:ellipsis-substitute", "出现 'etc.' / 'and so on'，文字内容必须写全");
  }

  if (/\.\.\./.test(text)) {
    warn(results, "text:ellipsis", "出现省略号；确认它是原文自带的，而不是用来省略内容");
  }
}

function checkNarration(text, results) {
  const imperatives = [
    /^\s*(Generate|Create|Please|Make)\b/i,
    /\bplease (generate|create|make)\b/i,
  ];
  const hit = imperatives.find((re) => re.test(text));
  if (hit) {
    warn(results, "narration:imperative", "正文出现祈使句（generate / create / please），应改写成对目标画面的叙述");
  }

  if (!/\b(?:is|are|shows|remains|changes|appears|sits|stands|falls)\b/i.test(text)) {
    warn(results, "narration:no-verb", "正文缺少描述性动词，可能不是叙述句");
  }
}

// ---------- 主流程 ----------

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const raw = readInput(opts).trim();
  const results = [];

  let text = raw;

  if (opts.json || opts.wrap) {
    const parsed = checkJsonMode(raw, opts.ratio, results);
    if (parsed && typeof parsed.expanded_caption === "string") {
      text = parsed.expanded_caption;
    } else if (opts.wrap) {
      // --wrap 模式允许输入是纯文本
      text = raw;
    }
    if (opts.wrap) {
      const ratio = opts.ratio || (parsed && parsed.target_aspect_ratio) || "16:9";
      const cap = text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
      const out = JSON.stringify({ expanded_caption: cap, target_aspect_ratio: ratio });
      console.log(out);
      console.log("");
    }
  }

  if (!opts.allowNewlines && /\n/.test(text)) {
    fail(results, "format:newline", "正文含真实换行，必须是一整段");
  }

  const { subjects } = checkStructure(text, results);
  checkRelationships(text, subjects, results);
  checkMergedRelationship(text, subjects, results);
  checkNoRedescription(text, subjects, results);
  checkTextHandling(text, results);
  checkNarration(text, results);

  const fails = results.filter((r) => r.level === "fail");
  const warns = results.filter((r) => r.level === "warn");
  const passes = results.filter((r) => r.level === "pass");

  for (const r of passes) console.log(`  ok    ${r.message}`);
  for (const r of warns) console.log(`  warn  ${r.message}`);
  for (const r of fails) console.log(`  FAIL  ${r.message}`);

  console.log("");
  console.log(`通过 ${passes.length} / 警告 ${warns.length} / 失败 ${fails.length}`);
  console.log("仍需人工确认：Part 3 有无保留内容重写、Subject 粒度、新增内容厚度、文字完整性。");

  process.exit(fails.length === 0 ? 0 : 1);
}

main();
