// Glass 渲染层（molten/dist/renderer）标签汉化
//
// 背景：Cursor 的 Glass 界面是一套独立的 React 应用，**不使用 VS Code 的 NLS 体系**，
// 顶部应用菜单 / 右键菜单的文字直接硬编码在 molten/dist/renderer/assets/*.js 里，
// 形如  {label:`Undo`,edit:`undo`,shortcut:`Ctrl+Z`}
// 而 src/platform.js 的 TARGET_FILES 只覆盖 out/vs/workbench/ 三个 bundle，
// 所以这些位置一直是英文——这就是"菜单栏点开还是英文"的原因。
//
// 注意：
// 1) 这些文件**不在** product.json 的 checksums 里（只有 6 个 vs/* 键），改完不需要修复校验。
// 2) 只替换「label:`X`」和「children:`X`」这两种明确的位置，且必须以 src/glass-labels.json
//    的白名单为准——绝不整篇套用 safeGlobalDict，避免动到 React 逻辑里的枚举值。
// 3) 文件名带内容哈希（chrome-CEaTw08d.js 之类），Cursor 更新后会换名，
//    因此这里用目录扫描而不是硬编码文件名。

const fs = require('fs');
const path = require('path');

const LABELS = require('./glass-labels.json');

function getGlassUiDir(appPath) {
  return path.join(appPath, 'molten', 'dist', 'renderer', 'assets');
}

function listGlassUiFiles(appPath) {
  const dir = getGlassUiDir(appPath);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => path.join(dir, f));
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 一次性建好所有替换规则：属性位 + 可选 NLS 调用包装 + 引号 + 白名单文本
// 形如 label:`Undo` / children:`X` / title:`X` / title:o(75,`&&Select All`) / title:p(813,`Cu&&t`)
// 最后一种是 monaco、keybinding 分片里的菜单项，NLS 调用把字面量包了一层，必须一并覆盖。
const RULES = Object.entries(LABELS)
  .filter(([en, zh]) => en !== zh)
  .map(([en, zh]) => ({
    en,
    zh,
    re: new RegExp(
      '((?:label|children|title):(?:[A-Za-z_$][\\w$.]*\\(\\s*\\d+\\s*,)?)(`|"|\')' + escapeRe(en) + '\\2',
      'g'
    ),
  }));

function patchGlassUiFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let out = original;
  let count = 0;
  for (const { zh, re } of RULES) {
    out = out.replace(re, (m, prop, q) => {
      count++;
      // prop 里已经带了结尾冒号（regex 的第 1 组是 "label:" / "title:o(75," 这种），
      // 所以这里不能再补一个冒号，否则会写出 label::`x` 这种非法语法。
      return `${prop}${q}${zh}${q}`;
    });
  }
  if (out === original) return { changed: false, count: 0 };
  fs.writeFileSync(filePath, out, 'utf8');
  return { changed: true, count };
}

function patchGlassUi(appPath) {
  const files = listGlassUiFiles(appPath);
  const results = [];
  let total = 0;
  for (const f of files) {
    const r = patchGlassUiFile(f);
    if (r.changed) {
      results.push({ file: f, count: r.count });
      total += r.count;
    }
  }
  return { files: files.length, total, changed: results };
}

module.exports = { patchGlassUi, patchGlassUiFile, listGlassUiFiles, getGlassUiDir, LABELS };
