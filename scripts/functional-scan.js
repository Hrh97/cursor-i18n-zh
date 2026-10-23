#!/usr/bin/env node
/**
 * 扫描「绝不能翻译」的字符串（功能位词条），生成 src/functional-keys.json
 *
 * 背景：Cursor 的 bundle 里有大量英文字符串**不用于显示**，而是参与运行逻辑：
 *   1. 比较/分支：`case "X"`、`x === "X"`、`list.includes("X")`
 *   2. 名字构件表：`{red:"Red", added:"Added"}` —— 这些值会被拼进语义 token 名
 *      （bg + Git + Added + PrimaryHover → bgGitAddedPrimaryHover），
 *      一旦翻译成中文，运行时按英文名查表就查不到，直接抛异常、启动中断。
 * 3.27.6 的启动卡死就是因为 "Added"/"Modified"/"Removed" 被翻译。
 *
 * 用法:
 *   node scripts/functional-scan.js            # 只报告
 *   node scripts/functional-scan.js --write    # 写入 src/functional-keys.json
 *
 * 注意：扫描结果是**保守建议清单**（按语法位置机械判定，会比实际需要的大），
 *       Cursor 大版本更新后重新扫描 → 挑出真需要的 → 写入后必须验证：
 *       ① 启动能出窗口 ② node scripts/audit.js 遗漏为 0
 *       当前随版本发布的 upfront 清单是经过启动验证的最小集合。
 *
 * 注意：扫描的是**备份的原版 bundle**（未汉化），否则英文已被替换，扫不到。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { detectCursorPath, readCursorVersion } = require('../src/platform');
const { getBackupDir } = require('../src/backup');

const OUT = path.join(__dirname, '..', 'src', 'functional-keys.json');

// 主题语义 token 的名字构件：必须永远保持英文
const THEME_PARTS = [
  'Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Magenta', 'Purple',
  'Added', 'Modified', 'Removed', 'Untracked', 'Danger', 'Success', 'Warning',
  'Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Accent', 'Warn',
];

// 已被实测证实会破坏启动、但不一定被规则命中的词条
const PROVEN_POISON = ['No team selected.'];

const LIT = '["\'`]([^"\'`\\\\]{1,120})["\'`]';
const LOGIC_PATTERNS = [
  [new RegExp(LIT + '\\s*(?:===|!==|==|!=)', 'g'), '比较'],
  [new RegExp('(?:===|!==|==|!=)\\s*' + LIT, 'g'), '比较'],
  [new RegExp('case\\s*' + LIT, 'g'), 'switch case'],
  [new RegExp('\\.(?:includes|startsWith|endsWith|indexOf|localeCompare|search)\\(\\s*' + LIT, 'g'), '字符串判断'],
];

function loadPristine() {
  const { appPath } = detectCursorPath();
  const version = readCursorVersion(appPath);
  const dir = getBackupDir(version);
  if (!fs.existsSync(dir)) {
    throw new Error(`找不到 ${version} 的原版备份目录: ${dir}\n请先运行一次 node index.js localize 生成备份。`);
  }
  const files = fs.readdirSync(dir).filter(f => f.startsWith('workbench.') && f.endsWith('.backup'));
  if (!files.length) throw new Error(`备份目录为空: ${dir}`);
  console.log(`原版备份 (${version}): ${files.join(', ')}`);
  return files.map(f => ({ name: f, content: fs.readFileSync(path.join(dir, f), 'utf8') }));
}

function scan() {
  const bundles = loadPristine();
  const found = new Map();    // key -> 原因

  // 1) 逻辑位
  for (const b of bundles) {
    for (const [re, why] of LOGIC_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(b.content))) {
        const lit = m[1];
        if (lit.length > 120 || !/[A-Za-z]/.test(lit)) continue;
        if (!found.has(lit)) found.set(lit, why);
      }
    }
  }
  const logicCount = found.size;

  // 2) 名字构件表 prop:"Prop"（值 = 首字母大写的属性名）
  const tableRe = /([a-zA-Z][A-Za-z0-9]{1,24}):"([A-Z][A-Za-z0-9]{1,24})"/g;
  let nameparts = 0;
  for (const b of bundles) {
    tableRe.lastIndex = 0;
    let m;
    while ((m = tableRe.exec(b.content))) {
      const [prop, val] = [m[1], m[2]];
      if (val.toLowerCase() !== prop.toLowerCase() || val === prop) continue;
      if (THEME_PARTS.includes(val)) continue;   // 已固定收录
      if (!found.has(val)) { found.set(val, `拼表 ${prop}:"${val}"`); nameparts++; }
    }
  }

  // 3) 固定项
  for (const k of THEME_PARTS) if (!found.has(k)) found.set(k, '主题名字构件');
  for (const k of PROVEN_POISON) if (!found.has(k)) found.set(k, '实测毒点');

  // 4) 只保留与词典有关的（不在词典里的字符串删不删都无所谓，留着会让清单变噪音）
  //    注意：safeGlobalDict 已应用过 functional-keys.json 的剔除，所以要把现有清单并回来
  const relevant = new Set();
  try {
    const { safeGlobalDict } = require('../src/dict');
    for (const k of Object.keys(safeGlobalDict)) relevant.add(k);
  } catch (e) {
    console.warn('  ⚠️ 词典加载失败，跳过相关性过滤: ' + e.message);
  }
  if (fs.existsSync(OUT)) {
    try { for (const k of JSON.parse(fs.readFileSync(OUT, 'utf8'))) relevant.add(k); } catch (e) {}
  }
  for (const k of [...THEME_PARTS, ...PROVEN_POISON]) relevant.add(k);
  for (const k of [...found.keys()]) if (!relevant.has(k)) found.delete(k);

  const keys = [...found.keys()].sort();
  console.log(`\n=== 扫描结果 ===`);
  console.log(`逻辑位: ${logicCount} | 拼表: ${nameparts} | 合计: ${keys.length}`);

  const write = process.argv.includes('--write');
  if (write) {
    fs.writeFileSync(OUT, JSON.stringify(keys, null, 2) + '\n', 'utf8');
    console.log(`\n✅ 已写入 ${OUT}（${keys.length} 条）`);
    console.log('   下一步: node index.js localize  （需先退出 Cursor）');
  } else {
    console.log('\n（预览模式，未写入；加 --write 才会更新 functional-keys.json）');
  }
  if (process.argv.includes('--verbose')) {
    for (const [k, why] of found) console.log(`  ${JSON.stringify(k)}  <- ${why}`);
  }
  return keys;
}

try {
  scan();
} catch (e) {
  console.error('❌ ' + e.message);
  process.exit(1);
}
