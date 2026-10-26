// 顶部应用菜单 / 命令面板 / 通用按钮文案（版本无关，多词条）
// 来源：3.27.14 原版 bundle 中 label/title/children 位置出现的英文；
// 每条都经过"逻辑位扫描"（===/!==/case/includes 等）确认未被当作枚举值。
// 单字词（View / Exit / Quit / Forward）不在这里，放 dict.js 的 riskyShortWords，
// 因为它们在代码里出现频率高、只能限定在 UI 属性位替换。
const dictAppMenu = {
  // ── 应用菜单：新建类 ──
  'New Terminal': '新建终端',
  'New Browser': '新建浏览器',
  'Open IDE': '打开 IDE',

  // ── 应用菜单：视图/命令 ──
  'Command Palette': '命令面板',
  'View License': '查看许可证',
  'Zoom In': '放大',
  'Zoom Out': '缩小',
  'Reset Zoom': '重置缩放',
  'Restart to Update': '重启以更新',
  'Copy Image': '复制图片',
  'Log In': '登录',

  // ── 通知 / 空状态 ──
  'No recent agents': '暂无最近的智能体',
  'Clear All Notifications': '清除所有通知',

  // ── 三元表达式里的按钮文案（如 children: x ? "Show more" : "收起"）──
  'Show more': '显示更多',
  'Show less': '收起',
  'Show input': '显示输入',
  'Hide input': '隐藏输入',
  'Edit Form': '编辑表单',
  'Edit JSON': '编辑 JSON',
};
module.exports = { dictAppMenu };
