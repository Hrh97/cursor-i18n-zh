/**
 * 顶部菜单栏「编辑」下拉项等 —— 这些文案在 bundle 里是 NLS 的内联默认值
 * （形如 `o(75, "&&Undo")`、`p(813, "Cu&&t")`），运行时若语言包缺这个 key，
 * 就直接显示这段英文默认值。官方 zh-hans 语言包只覆盖扩展（1855 条），
 * 核心 13625 条 NLS 文案没有中文，所以这些菜单项一直显示英文。
 *
 * 这里直接替换 bundle 里的英文默认值：`&&` 是助记符标记（显示时会隐藏），
 * 保留它可以让 Alt 菜单导航继续可用。
 */
const editMenuDict = {
  '&&Undo': '&&撤销',
  '&&Redo': '&&重做',
  '&&Cut': '&&剪切',
  '&&Copy': '&&复制',
  '&&Paste': '&&粘贴',
  '&&Select All': '&&全选',
  '&&Select All Occurrences': '&&全选所有匹配项',

  // Monaco 里助记符穿插在词中间的形式
  'Cu&&t': '剪&&切',
  'Cop&&y': '复&&制',
  'Pas&&te': '粘&&贴',
  'Select A&&ll': '全&&选',

  // 纯标题形式（命令面板 / 菜单项都走这里）
  'Undo': '撤销',
  'Redo': '重做',
  'Cut': '剪切',
  'Paste': '粘贴',
  'Select All': '全选',
  // Glass 顶部菜单栏「编辑 → 全选」的真实来源：
  // Pr({id:eAv, menu:{column:Ot.MenubarEditMenu, title:N({key:"glassOsEditSelectAll"}, "Select &&All")}})
  // 语言包没有这个 key 时直接用第二个参数（英文默认值），所以这里必须换掉它。
  'Select &&All': '全&&选',
};

module.exports = { editMenuDict };
