/**
 * 核心 NLS 文案表汉化（out/nls.messages.json）
 *
 * 原理：Cursor / VS Code 的 workbench 里大量文案是通过 NLS 索引拿的
 * （源码 `localize(key, 'English')` 编译后变成 `o(75, "English")`），
 * 运行时按索引去 `out/nls.messages.json` 取默认英文。
 * 官方中文语言包只覆盖扩展（1855 条），核心表 13625 条全是英文，
 * 所以顶部菜单项（Undo / Redo / Cut / Copy / Paste / Select All）等
 * 即使词典里已有译文也不会变中文 —— 它们根本没走 bundle 里那条路。
 *
 * 这里只做「整条精确匹配」替换：NLS 表中的条目本身就是纯展示文案，
 * 用我们已审核过的词典去命中，命中即替换，不命中一律保留英文，
 * 因此不会动到任何标识符/枚举，风险极低。
 *
 * 该文件不在 product.json 的 checksums 里，改完无需修复哈希。
 */

const fs = require('fs');
const path = require('path');

const NLS_REL = path.join('out', 'nls.messages.json');

const CJK = /[\u4e00-\u9fff]/;

function nlsPath(appPath) {
  return path.join(appPath, NLS_REL);
}

function stripMnemonic(s) {
  // 菜单文案里的 && 是助记符标记，&&Undo 显示为 Undo
  return s.startsWith('&&') ? s.slice(2) : s;
}

/**
 * @param {string} appPath Cursor 的 resources/app 目录
 * @param {Record<string,string>} dict 英文 → 中文
 * @returns {{changed:number,total:number,unique:number,file:string}}
 */
function patchNlsMessages(appPath, dict) {
  const file = nlsPath(appPath);
  if (!fs.existsSync(file)) {
    return { changed: 0, total: 0, unique: 0, file, missing: true };
  }
  const raw = fs.readFileSync(file, 'utf8');
  let table;
  try {
    table = JSON.parse(raw);
  } catch (e) {
    throw new Error(`nls.messages.json 解析失败: ${e.message}`);
  }
  if (!Array.isArray(table)) throw new Error('nls.messages.json 不是数组');

  const hitKeys = new Set();
  let changed = 0;
  const out = table.map((v) => {
    if (typeof v !== 'string' || !v || CJK.test(v)) return v;
    const bare = stripMnemonic(v);
    const zh = dict[bare];
    if (!zh || typeof zh !== 'string' || !CJK.test(zh)) return v;
    if (zh === bare) return v;
    hitKeys.add(bare);
    changed++;
    return v.startsWith('&&') ? `&&${zh}` : zh;
  });

  if (changed > 0) {
    fs.writeFileSync(file, JSON.stringify(out), 'utf8');
  }
  return { changed, total: table.length, unique: hitKeys.size, file };
}

module.exports = { patchNlsMessages, nlsPath, NLS_REL };
