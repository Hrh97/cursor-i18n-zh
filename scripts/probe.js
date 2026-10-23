#!/usr/bin/env node
/**
 * 汉化遗漏反向探测脚本
 * 用法: node scripts/probe.js [选项]
 *
 * 与 audit.js 的区别：
 *   audit.js  检查一份固定清单（171 条），用于防止旧版本回归。
 *   probe.js  从产物里动态挖出英文字面量，反向判断哪些没有被翻译命中，
 *             用于发现 Cursor 新版本带来的全新文案。
 *
 * 核心原理：
 *   把当前文件内容跑一遍 translateContent() 得到「模拟汉化结果」，
 *   再逐条检查候选英文字面量是否仍原样存活。仍存活 = 字典里没有 = 遗漏。
 *   因此不依赖文件是否已打过补丁，未汉化状态也能直接跑。
 *
 * 两级置信度：
 *   A 级（默认报告）：出现在 UI 属性位（title/label/placeholder/description…）
 *                     或 JSX 文本位（>文案<）的字符串。误报极少。
 *   B 级（--deep 时附加）：句法上像英文句子的任意字面量。
 *                     会混入库内部警告与智能体提示词，需人工甄别。
 *
 * 选项:
 *   -p, --path <dir>   Cursor 安装目录（同 audit.js）
 *   --deep             额外报告 B 级候选
 *   --min <n>          B 级最小长度，默认 20
 *   --all              打印全部遗漏（默认每组只展示前 15 条）
 *   --new-only         剔除字典里已存在的键，只报真正要新增的词条
 *   --json [file]      输出 JSON 清单，默认 probe-report.json
 *   --quiet            只打印汇总
 */
const fs = require('fs');
const path = require('path');
const { detectCursorPath } = require('../src/platform');
const { translateContent } = require('../src/translate');

// ---------------------------------------------------------------------------
// 候选提取（带上下文）
// ---------------------------------------------------------------------------

/**
 * 抓出所有字符串字面量，并记录其前面的源码片段用于判断出现位置。
 * 返回 Map<string, {tierA: boolean, tierB: boolean}>
 */
function collectLiterals(content) {
  const out = new Map();
  const re = /(["'`])((?:\\.|(?!\1)[^\\\n]){2,})\1/g;
  const ctxWindow = 80;

  let m;
  while ((m = re.exec(content)) !== null) {
    const text = m[2];
    if (out.has(text)) continue;
    // 跳过 JSON/语法定义大块：转义引号会让正则跨字段吞并
    if (text.length > 300) continue;
    if (/\["']/.test(text)) continue;
    if (/\[nrt]/.test(text)) continue;
    if (/["']s*:/.test(text)) continue;

    const before = content.slice(Math.max(0, m.index - ctxWindow), m.index);
    out.set(text, {
      tierA: plausibleText(text) && proseLike(text) && isInUiPosition(before),
      tierB: false, // 稍后按句法填充
    });
  }
  return out;
}

// UI 属性位：title: "…" / label="…" / placeholder: `…`
const UI_PROP_TAIL =
  /(?:^|[\s,{(])(children|title|label|placeholder|description|tooltip|message|heading|caption|altText|text|value|original|subtitle|body|hint|helperText|emptyText|errorText|confirmText|cancelText|aria-label|ariaLabel|content|summary|detail|details)\s*[:=]\s*$/;

// JSX 文本位：>文案</span> 中的文案
const JSX_TEXT_TAIL = /[>(]\s*$/;

// JSX 属性位：<div placeholder="…">  /  <Comp title="…">
const JSX_ATTR_TAIL = /\b(?:aria-label|placeholder|title|alt|label|content|data-tooltip)\s*=\s*$/;

// 明显的非 UI 上下文（紧邻代码）
const CODE_BEFORE = /(?:require\(|import\s|from\s|case\s|typeof\s|instanceof|typeof)\s*$/;
const TS_TYPE_BEFORE = /:\s*["']?(?:string|number|boolean|any|never|unknown)\s*\|?\s*$/;

const VERB_START =
  /^(How|What|When|Where|Why|Who|Choose|Select|Enter|Type|Add|Remove|Delete|Create|Set|Show|Hide|Enable|Disable|Turn|Use|Open|Close|Start|Stop|Run|Try|Learn|Save|Cancel|Confirm|Update|Upload|Download|Search|Filter|Sort|Copy|Paste|Move|Rename|Share|Invite|Connect|Sign|Log|Reset|Clear|Apply|Edit|View|Manage|Configure|Allow|Block|Limit|Require|Prevent|Keep|Make|Let|Pick|Review|Approve|Reject|Retry|Reload|Refresh|Restart|Install|Uninstall|Export|Import|Join|Leave|Upgrade|Downgrade|Buy|Pay|Get|Press|Click|Drag|Attach|Detach|Merge|Rebase|Commit|Push|Pull|Resolve|Restore|Revert|Stash|Fork|Notify|Mention|Send|Reply|Schedule|Pause|Resume|Test|Verify|Validate)\b/;
const SECOND_PERSON = /\b(you|your|yours|yourself)\b/i;

// 内容闸门：无论出现在哪个位置，先确认它像人话而不是代码片段
const HARD_CODE = /[<>{}=;|&`]|\b(function|return|const |let |var |=>|class |this\.[a-z]|\bnull\b|\bundefined\b)/;

// 日志/遥测/诊断文案：不是界面文本
const NOISE_TEXT = /\bSentry\b|\bStatsig\b|Sentinel|Telemetry|unresponsive|Perfetto|snapshot|armed the next|resolver error|core-js_shared|__core-js|deprecated|JSON files viewable|best-practices|server SDK version|not found\. You may be/i;

function plausibleText(s) {
  if (s.length < 6 || s.length > 300) return false;
  if (/[\u4e00-\u9fff]/.test(s)) return false;
  if (HARD_CODE.test(s)) return false;
  if (NOISE_TEXT.test(s)) return false;
  if (s.includes(String.fromCharCode(92))) return false;       // 反斜杠序列
  if (/["'`]\s*:/.test(s)) return false;                      // JSON 键值
  const letters = (s.match(/[A-Za-z]/g) || []).length;
  if (letters / s.length < 0.7) return false;                  // 字母占比过低
  const words = s.trim().split(/\s+/);
  if (words.length < 2) return false;
  const hasWord = words.some((w) => /^[A-Za-z][A-Za-z,.!?-]*$/.test(w) && w.length >= 2);
  if (!hasWord) return false;
  return true;
}

// 像句子：至少三个词，且句首大写、或以动词开头、或含第二人称
function proseLike(s) {
  const words = s.trim().split(/\s+/);
  if (words.length < 3) return false;
  const startsUpper = /^[A-Z"\'(]/.test(s);
  const hasVerb = VERB_START.test(s);
  const hasYou = SECOND_PERSON.test(s);
  return startsUpper || hasVerb || hasYou;
}

function isInUiPosition(before) {
  if (CODE_BEFORE.test(before)) return false;
  if (TS_TYPE_BEFORE.test(before)) return false;
  if (UI_PROP_TAIL.test(before)) return true;
  if (JSX_ATTR_TAIL.test(before)) return true;
  // JSX 文本位要求前面确实有 '>' 或 '(',避免误判
  if (JSX_TEXT_TAIL.test(before) && /[>(,]\s*$/.test(before)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// 句法判断（B 级）
// ---------------------------------------------------------------------------

const CODEISH =
  /[={};<>\r\n]|=>|\$\{|\/\/|\\[nrtb]|\\u[0-9a-fA-F]{4}|%[sdif]|::|\[\]|\bnull\b|\bundefined\b|\bthrow\b|\bnew Error\b|\bfunction\b|\btypeof\b|!==|\|\||&&/;

const NOT_UI = [
  /^\s*https?:\/\//,
  /^[a-z-]+\/[a-z0-9.-]+$/i,
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9]{1,6}$/,
  /\b(org\.eclipse|elkjs|\belk\b|gremlin|hyperedge)\b/i,
  /\b(assert|invariant|precondition|postcondition|traceback|stack trace)\b/i,
  /\b(webkit|moz-appearance|box-shadow|font-family|border-radius)\b/i,
  /\b(chunk|minified|sourcemap|webpack|rollup|esbuild)\b/i,
  /\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+\//,
  /\bapplication\/(json|xml|x-www-form-urlencoded)\b/i,
  /\b[A-Z_]{3,}_[A-Z_]{2,}\b/,
  /\b(React|Internals|reconciliation|re-render|hydrat\w*|Rules of Hooks)\b/,
  /\b(cloned with props|render prop|Base UI|Lorem ipsum)\b/i,
  /\bviewBox|stroke-line|fill-rule\b/i,
  /\b(ChildProcess|RPC|event-loop|extension host|renderer)\b/,
  /\b(do not retry|tool call|prompt|token budget|system message)\b/i,
];



const CLASSY =
  /\b(flex|grid|items-|justify-|rounded|border-|text-|bg-|p-\d|m-\d|gap-\d|px-|py-|mt-|mb-|opacity-|hover:|focus:|disabled:|transition)/g;

function sentenceLike(s, minLen) {
  if (s.length < minLen) return false;
  if (/[\u4e00-\u9fff]/.test(s)) return false;
  if (!/^[\x20-\x7e\u00a0-\u024f]+$/.test(s)) return false;
  if (CODEISH.test(s)) return false;
  for (const re of NOT_UI) if (re.test(s)) return false;

  const words = s.trim().split(/\s+/);
  if (words.length < 3 || words.length > 40) return false;
  if (!/[a-z]{2}/.test(s)) return false;
  if (s === s.toUpperCase()) return false;

  const letters = (s.match(/[A-Za-z]/g) || []).length;
  const digits = (s.match(/[0-9]/g) || []).length;
  if (letters / s.length < 0.7) return false;
  if (digits / s.length > 0.1) return false;

  const kebab = (s.match(/\b[a-z]+(?:-[a-z0-9]+)+\b/g) || []).length;
  if (kebab >= 2) return false;
  if ((s.match(CLASSY) || []).length >= 2) return false;

  const startsUpper = /^[A-Z"'(]/.test(s);
  const hasVerb = VERB_START.test(s);
  const hasYou = SECOND_PERSON.test(s);
  if (!startsUpper && !hasVerb && !hasYou) return false;
  if (!words.some((w) => w.length >= 4)) return false;

  return true;
}

// ---------------------------------------------------------------------------
// 单文件探测
// ---------------------------------------------------------------------------

function probeFile(label, filePath, opts) {
  if (!fs.existsSync(filePath)) {
    console.log(`\n⚠️  ${label}: 文件不存在`);
    return { label, literals: 0, tierA: 0, tierB: 0, missesA: [], missesB: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const literals = collectLiterals(content);

  // 关键一步：跑一遍翻译，看哪些英文原样存活
  const simulated = translateContent(content);
  const stillEnglish = collectLiterals(simulated);

  const missesA = [];
  const missesB = [];
  let tierACount = 0;
  let tierBCount = 0;

  for (const [s, meta] of stillEnglish) {
    if (!literals.has(s)) continue; // 只保留原本存在的字面量

    if (meta.tierA) {
      tierACount++;
      missesA.push(s);
      continue;
    }
    if (opts.deep && sentenceLike(s, opts.min)) {
      tierBCount++;
      missesB.push(s);
    }
  }

  missesA.sort((a, b) => b.length - a.length);
  missesB.sort((a, b) => b.length - a.length);

  if (!opts.quiet) {
    console.log(`\n=== ${label} ===`);
    console.log(`  字面量总数: ${literals.size}`);
    console.log(`  A 级遗漏:   ${missesA.length}  (UI 属性位/JSX 文本位)`);
    if (opts.deep) console.log(`  B 级遗漏:   ${missesB.length}  (句法像文案，需甄别)`);

    const show = (arr, tag) => {
      if (!arr.length) return;
      const n = opts.all ? arr.length : Math.min(15, arr.length);
      for (let i = 0; i < n; i++) {
        console.log(`    ${tag}[${String(arr[i].length).padStart(3)}] ${arr[i]}`);
      }
      if (!opts.all && arr.length > n) {
        console.log(`    … 另有 ${arr.length - n} 条（用 --all 查看）`);
      }
    };
    show(missesA, '');
    if (opts.deep) show(missesB, 'B ');
  }

  return { label, literals: literals.size, tierA: tierACount, tierB: tierBCount, missesA, missesB };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { min: 20, deep: false, all: false, quiet: false, newOnly: false, json: null, customPath: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-p' || a === '--path') {
      const v = argv[++i];
      if (!v || v.startsWith('-')) {
        console.error('❌ 请在使用 -p / --path 后提供 Cursor 安装目录。');
        process.exit(1);
      }
      opts.customPath = v;
    } else if (a === '--min') {
      const v = Number(argv[++i]);
      if (!Number.isFinite(v) || v < 1) {
        console.error('❌ --min 需要一个正整数。');
        process.exit(1);
      }
      opts.min = v;
    } else if (a === '--deep') opts.deep = true;
    else if (a === '--all') opts.all = true;
    else if (a === '--new-only') opts.newOnly = true;
    else if (a === '--quiet') opts.quiet = true;
    else if (a === '--json') {
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        opts.json = next;
        i++;
      } else {
        opts.json = 'probe-report.json';
      }
    } else if (a === '-h' || a === '--help') {
      console.log('用法: node scripts/probe.js [-p <dir>] [--deep] [--min n] [--all] [--new-only] [--json [file]] [--quiet]');
      process.exit(0);
    }
  }
  return opts;
}

function dedupe(lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const s of list) {
      if (seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
  }
  return out.sort((a, b) => b.length - a.length);
}

/** 汇总当前字典的全部英文键（含各分区 dict），供 --new-only 过滤 */
function loadDictKeys() {
  const { safeGlobalDict, riskyShortWords } = require('../src/dict');
  return new Set([...Object.keys(safeGlobalDict), ...Object.keys(riskyShortWords)]);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const paths = detectCursorPath(opts.customPath);
  if (!paths) {
    console.error('❌ 未找到 Cursor 安装目录，请用 -p <Cursor 安装目录> 指定。');
    process.exit(1);
  }

  console.log('Cursor 汉化遗漏反向探测');
  console.log(`安装路径: ${paths.appPath}`);
  if (opts.deep) console.log(`B 级最小长度: ${opts.min}`);

  const results = [
    probeFile('desktop.main.js', paths.targets[0].abs, opts),
    probeFile('glass.main.js', paths.targets[1].abs, opts),
    probeFile('automations.js', paths.targets[2].abs, opts),
  ];

  const uniqueA = dedupe(results.map((r) => r.missesA));
  const uniqueB = dedupe(results.map((r) => r.missesB));

  // --new-only：剔除字典里已存在的键，剩下的才是真正要新增的词条
  const knownKeys = opts.newOnly ? loadDictKeys() : null;
  const reportA = knownKeys ? uniqueA.filter((s) => !knownKeys.has(s)) : uniqueA;
  const reportB = knownKeys ? uniqueB.filter((s) => !knownKeys.has(s)) : uniqueB;

  const totalA = results.reduce((s, r) => s + r.missesA.length, 0);
  const totalB = results.reduce((s, r) => s + r.missesB.length, 0);
  const totalLiterals = results.reduce((s, r) => s + r.literals, 0);

  console.log('\n--- 汇总 ---');
  console.log(`字面量总数:     ${totalLiterals}`);
  console.log(`A 级遗漏总计:   ${totalA}`);
  console.log(`A 级去重后:     ${reportA.length} 条${opts.newOnly ? '（已剔除字典已有键）' : ''}  ← 优先补这些`);
  if (opts.deep) {
    console.log(`B 级遗漏总计:   ${totalB}`);
    console.log(`B 级去重后:     ${uniqueB.length} 条`);
  }

  if (reportA.length && !opts.quiet) {
    console.log('\n--- A 级去重清单（按长度降序）---');
    const n = opts.all ? reportA.length : Math.min(40, reportA.length);
    for (let i = 0; i < n; i++) console.log(`[${String(reportA[i].length).padStart(3)}] ${reportA[i]}`);
    if (!opts.all && reportA.length > n) console.log(`… 另有 ${reportA.length - n} 条（用 --all 查看）`);
  }

  if (opts.json) {
    const outPath = path.resolve(opts.json);
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          appPath: paths.appPath,
          generatedAt: new Date().toISOString(),
          deep: opts.deep,
          minLength: opts.min,
          newOnly: opts.newOnly,
          files: results.map((r) => ({
            label: r.label,
            literals: r.literals,
            tierA: r.tierA,
            tierB: r.tierB,
            missesA: r.missesA,
            missesB: r.missesB,
          })),
          uniqueA: reportA,
          uniqueB: reportB,
        },
        null,
        2
      ) + '\n',
      'utf8'
    );
    console.log(`\n已写出 JSON 清单: ${outPath}`);
  }

  if (reportA.length > 0) {
    console.log('\n把 A 级词条补进 src/dict-*.js 后，运行: node index.js localize （需先退出 Cursor）');
  } else {
    console.log('\n未发现 A 级遗漏 ✅');
  }
}

main();
